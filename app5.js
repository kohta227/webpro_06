const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

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
  let judgement = '';
  if (hand === cpu) judgement = '引き分け';
  else if ((hand === 'グー' && cpu === 'チョキ') || (hand === 'チョキ' && cpu === 'パー') || (hand === 'パー' && cpu === 'グー')) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }
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

app.get("/lottely", (req, res) => {
  const input = req.query.number; 
  let result = '';

  if (input === "1") {
    const random = Math.random(); // 0 <= random < 1 のランダム値
    result = random < 0.2 ? "当たり" : "外れ";
  } else {
    result = "1 を入力してください";
  }

  res.send(`結果: ${result}`);
});

app.get("/add", (req, res) => {
  const num1 = Number(req.query.num1); 
  const num2 = Number(req.query.num2); 

  if (isNaN(num1) || isNaN(num2)) {
    res.send("Error: num1とnum2には数字を指定してください。");
    return;
  }

  const sum = num1 + num2; 
  res.send(`結果: ${num1} + ${num2} = ${sum}`); 
});




app.get("/questions", (req, res) => {
  const answer1 = req.query.answer1; 
  const answer2 = req.query.answer2; 
  const answer3 = req.query.answer3; 

  let yesCount = 0;
  if (answer1 === "はい") yesCount++;
  if (answer2 === "はい") yesCount++;
  if (answer3 === "はい") yesCount++;

  let result = "";
  if (yesCount === 0) result = "陰キy...内向的";
  else if (yesCount === 1) result = "ちょっと内向的";
  else if (yesCount === 2) result = "ちょっと外交的";
  else if (yesCount === 3) result = "陽キy...外交的";

  res.render("questions", { result, answer1, answer2, answer3 });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
