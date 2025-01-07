"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  let judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});

app.get("/add", (req, res) => {
  console.log("GET");
  console.log( req.query );
  const num1 = Number( req.query.num1 );
  const num2 = Number( req.query.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

app.post("/add", (req, res) => {
  console.log("POST");
  console.log( req.body );
  const num1 = Number( req.body.num1 );
  const num2 = Number( req.body.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

// これより下はBBS関係

// 1. 投稿データ構造の拡張
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

app.post("/read", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  const start = Number( req.body.start );
  console.log( "read -> " + start );
  if( start==0 ) res.json( {messages: bbs });
  else res.json( {messages: bbs.slice( start )});
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  const id = Date.now(); // ユニークIDを生成
  console.log({ id, name, message });

  const newPost = { id, name, message, replies: [], reactions: { like: 0, negative: 0 } };
  bbs.push(newPost); // 投稿を bbs 配列に追加
  res.json({ number: bbs.length });
});



// 2. 返信機能の追加
app.post("/reply", (req, res) => {
  const parentId = Number(req.body.parentId); // 親投稿ID
  const name = req.body.name;
  const message = req.body.message;
  console.log({ parentId, name, message });

  const parent = bbs.find(post => post.id === parentId);
  if (parent) {
    const reply = { id: Date.now(), name, message, replies: [], reactions: { like: 0, negative: 0 } };
    parent.replies.push(reply);
    res.json({ status: "success", reply });
  } else {
    res.status(404).json({ status: "error", message: "Parent post not found" });
  }
});

// 3. 削除機能の追加
app.post("/delete", (req, res) => {
  const postId = Number(req.body.postId); // 削除する投稿のID
  console.log({ postId });

  const post = bbs.find(post => post.id === postId);
  if (post) {
    post.message = "[削除されました]";
    post.name = null;
    res.json({ status: "success", post });
  } else {
    res.status(404).json({ status: "error", message: "Post not found" });
  }
});

// 4. リアクション機能の追加
app.post("/react", (req, res) => {
  const postId = Number(req.body.postId); // リアクション対象の投稿ID
  const reaction = req.body.reaction; // リアクション種別（例: "like", "negative"）
  console.log({ postId, reaction });

  const post = bbs.find(post => post.id === postId);
  if (post && ["like", "negative"].includes(reaction)) {
    post.reactions[reaction] += 1;
    res.json({ status: "success", reactions: post.reactions });
  } else {
    res.status(404).json({ status: "error", message: "Invalid post or reaction" });
  }
});

// 投稿エンドポイントの更新 (ユニークID追加)
app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  const id = Date.now(); // ユニークIDを生成
  console.log({ id, name, message });

  const newPost = { id, name, message, replies: [], reactions: { like: 0, negative: 0 } };
  bbs.push(newPost);
  res.json({ number: bbs.length });
});


app.listen(8080, () => console.log("Example app listening on port 8080!"));