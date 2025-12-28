const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

// 一覧
app.get("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('keiyo2', {data: station2} );
});

// Create
app.get("/keiyo2/create", (req, res) => {
  res.redirect('/public/keiyo2_new.html');
});

// Read
app.get("/keiyo2/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_detail', {id: number, data: detail} );
});

// Delete (確認ページ表示)
app.get("/keiyo2/delete/:number", (req, res) => {
  const number = Number(req.params.number);
  const detail = station2[number];
  if (!detail) {
    return res.redirect('/keiyo2');
  }
  res.render('keiyo2_delete', { id: number, data: detail });
});

// Delete 実行
app.post("/keiyo2/delete/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!isNaN(number) && station2[number]) {
    station2.splice(number, 1);
  }
  res.redirect('/keiyo2');
});

//// Delete
//app.get("/keiyo2/delete/:number", (req, res) => {
//  // 本来は削除の確認ページを表示する
//  // 本来は削除する番号が存在するか厳重にチェックする
//  // 本来ならここにDBとのやり取りが入る
//  station2.splice( req.params.number, 1 );
//  res.redirect('/keiyo2' );
//});

// Create
app.post("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const id = station2.length + 1;
  const code = req.body.code;
  const name = req.body.name;
  const change = req.body.change;
  const passengers = req.body.passengers;
  const distance = req.body.distance;
  station2.push( { id: id, code: code, name: name, change: change, passengers: passengers, distance: distance } );
  console.log( station2 );
  res.render('keiyo2', {data: station2} );
});

// Edit
app.get("/keiyo2/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_edit', {id: number, data: detail} );
});

// Update
app.post("/keiyo2/update/:number", (req, res) => {
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  station2[req.params.number].code = req.body.code;
  station2[req.params.number].name = req.body.name;
  station2[req.params.number].change = req.body.change;
  station2[req.params.number].passengers = req.body.passengers;
  station2[req.params.number].distance = req.body.distance;
  console.log( station2 );
  res.redirect('/keiyo2' );
});



let tani = [
  { id:1,  name:"コミュニケーションスキル", reqsubject:1, elesubject:6, reqacquisition:0, eleacquisition:0 },
  { id:2,  name:"情報",                   reqsubject:1, elesubject:0, reqacquisition:0, eleacquisition:0 },
  { id:3,  name:"人間力養成",             reqsubject:6, elesubject:0, reqacquisition:0, eleacquisition:0 },
  { id:4,  name:"国際理解",               reqsubject:6, elesubject:2, reqacquisition:0, eleacquisition:0 },
  { id:5,  name:"人間・社会・自然の理解", reqsubject:10, elesubject:0, reqacquisition:0, eleacquisition:0 },
  { id:6,  name:"総合",                   reqsubject:0, elesubject:2, reqacquisition:0, eleacquisition:0 },
  { id:7,  name:"教養特別科目",           reqsubject:0, elesubject:1, reqacquisition:0, eleacquisition:0 },
  { id:8,  name:"基礎基礎科目",           reqsubject:4, elesubject:2, reqacquisition:0, eleacquisition:0 },
  { id:9,  name:"専門基幹科目",           reqsubject:26,elesubject:12, reqacquisition:0, eleacquisition:0 },
  { id:10, name:"専門展開科目",           reqsubject:13, elesubject:32,reqacquisition:0, eleacquisition:0 },
];

// 一覧表示
app.get("/tani", (req, res) => {
  res.render('tani', {data: tani});
});

// 詳細
app.get("/tani/:number", (req, res) => {
  const number = req.params.number;
  if (tani[number]) {
    res.render('tani_detail', {id: number, data: tani[number]});
  } else {
    res.redirect('/tani');
  }
});

// 更新
app.post("/tani/update/:number", (req, res) => {
  const number = req.params.number;
  if(tani[number]) {
    tani[number].reqacquisition = Number(req.body.reqacquisition);
    tani[number].eleacquisition = Number(req.body.eleacquisition);
  }
  res.redirect('/tani');
});

// 削除
app.post("/tani/delete/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!isNaN(number) && tani[number]) {
    tani.splice(number, 1);
  }
  res.redirect('/tani');
});

// 登録
app.post("/tani/create", (req, res) => {
  const id = tani.length > 0 ? tani[tani.length - 1].id + 1 : 1;
  
  const name = req.body.name;
  const reqsubject = Number(req.body.reqsubject);
  const elesubject = Number(req.body.elesubject);
  
  tani.push({
    id: id,
    name: name,
    reqsubject: reqsubject,
    elesubject: elesubject,
    reqacquisition: 0,
    eleacquisition: 0
  });
  
  res.redirect('/tani');
});



let moneyList = [
  { id:1, name:"12月のバイト代", income:50000, expense:0 },
  { id:2, name:"課金",    income:0,     expense:13000 },
  { id:3, name:"お年玉",        income:10000, expense:0 },
  { id:4, name:"友達と出かける",  income:0,     expense:7500 },
];

// 一覧表示
app.get("/money", (req, res) => {
  res.render('money', {data: moneyList});
});

// 詳細
app.get("/money/:number", (req, res) => {
  const number = req.params.number;
  if (moneyList[number]) {
    res.render('money_detail', {id: number, data: moneyList[number]});
  } else {
    res.redirect('/money');
  }
});

// 更新
app.post("/money/update/:number", (req, res) => {
  const number = req.params.number;
  if(moneyList[number]) {
    moneyList[number].income = Number(req.body.income);
    moneyList[number].expense = Number(req.body.expense);
  }
  res.redirect('/money');
});

// 削除
app.post("/money/delete/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!isNaN(number) && moneyList[number]) {
    moneyList.splice(number, 1);
  }
  res.redirect('/money');
});

// 登録
app.post("/money/create", (req, res) => {
  const id = moneyList.length > 0 ? moneyList[moneyList.length - 1].id + 1 : 1;
  moneyList.push({
    id: id,
    name: req.body.name,
    income: Number(req.body.income),
    expense: Number(req.body.expense)
  });
  res.redirect('/money');
});



let itemList = [
  { id:1, name:"消しゴム", price:100, stock:50 },
  { id:2, name:"B5ノート", price:250, stock:30 },
  { id:3, name:"ボールペン", price:150, stock:10 },
  { id:4, name:"はさみ",   price:600, stock:5 },
];

// 一覧表示
app.get("/shohin", (req, res) => {
  res.render('shohin', {data: itemList});
});

// 詳細
app.get("/shohin/:number", (req, res) => {
  const number = req.params.number;
  if (itemList[number]) {
    res.render('shohin_detail', {id: number, data: itemList[number]});
  } else {
    res.redirect('/shohin');
  }
});

// 更新
app.post("/shohin/update/:number", (req, res) => {
  const number = req.params.number;
  if(itemList[number]) {
    itemList[number].price = Number(req.body.price);
    itemList[number].stock = Number(req.body.stock);
  }
  res.redirect('/shohin');
});

// 削除
app.post("/shohin/delete/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!isNaN(number) && itemList[number]) {
    itemList.splice(number, 1);
  }
  res.redirect('/shohin');
});

// 登録
app.post("/shohin/create", (req, res) => {
  const id = itemList.length > 0 ? itemList[itemList.length - 1].id + 1 : 1;
  itemList.push({
    id: id,
    name: req.body.name,
    price: Number(req.body.price),
    stock: Number(req.body.stock)
  });
  res.redirect('/shohin');
});









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

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let judgement = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 以下の数行は人間の勝ちの場合の処理なので，
  // 判定に沿ってあいこと負けの処理を追加する
  judgement = '勝ち';
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

app.listen(8080, () => console.log("Example app listening on port 8080!"));
