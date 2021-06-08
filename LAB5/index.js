const express = require('express');
const ejs = require('ejs');
var app = express();
const fs = require("fs").promises;
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const { json } = require('body-parser');
const bodyParser = require('body-parser');

app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

async function getDBConnection() {
    const db = await sqlite.open({
        filename: 'product.db',
        driver: sqlite3.Database
    });
    return db;
}

app.get('/', async function (req, res) {
    let db = await getDBConnection();
    //상품 목록 불러오기
    let category = await db.all(`select distinct product_category from product`);
    let image = await db.all(`select product_image, product_id from product`);
    db.close();
    res.render("index", { clist: category, img: image, hello: "all" });
})

app.get('/search', async function (req, res) {
    let db = await getDBConnection();
    let category = await db.all(`select distinct product_category from product`);
    let image;
    if (req.query.keyword === undefined) {
        //카테고리만 선택
        if (req.query.category == "all") {
            image = await db.all(`select product_image, product_id from product`);
        }
        else {
            image = await db.all(`select product_image, product_id from product where product_category = '${req.query.category}'`);
        }
    } else {
        if (req.query.category == "all") {
            image = await db.all(`select product_image, product_id from product where product_title LIKE '%${req.query.keyword}%'`);
        }
        else {
            image = await db.all(`select product_image, product_id from product where(product_category = '${req.query.category}') AND (product_title LIKE '%${req.query.keyword}%')`);
        }
    }
    db.close();
    res.render("index", { clist: category, img: image, hello: req.query.category });
})


app.get('/signup', function (req, res) {
    res.render("signup", {});
    console.log("회원가입 도착");
})

app.get('/login', function (req, res) {
    res.render("login", {});
    console.log("로그인 도착");
})

app.get('/product/::product_id', async function (req, res) {
    let db = await getDBConnection();
    let all = await db.all(`SELECT * from product where product_id = ${req.params.product_id}`);
    db.close();
    let contents = await fs.readFile('comment.json', 'utf8');
    contents = JSON.parse(contents);
    res.render("detail", { one: all, content: contents[req.params.product_id - 1].comment, num: contents[req.params.product_id - 1].number });
})

app.post('/product/::product_id', async function (req, res) {
    let id = req.body.id;
    let contents = await fs.readFile('comment.json', 'utf8');
    contents = JSON.parse(contents);
    let length = contents[id - 1].number;
    contents[id - 1].comment[length] = req.body.comment;
    contents[id - 1].number = length + 1;
    console.log(contents);
    contents = JSON.stringify(contents);
    await fs.writeFile('comment.json', contents);
    res.end();
})


var port = 3000;
app.listen(port, function () {
    console.log("server on! http://localhost:" + port);
})