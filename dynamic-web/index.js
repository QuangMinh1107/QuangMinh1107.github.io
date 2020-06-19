const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const { urlencoded } = require("body-parser");
const app = express();

let db;

MongoClient.connect("mongodb://localhost:27017",(err,client)=>{
    if(err){
        return console.log(err);
    }
    db = client.db("web");
    console.log("Da ket noi database");
});


let cards = [
    { img: "https://thuthuatnhanh.com/wp-content/uploads/2019/05/gai-xinh-toc-ngan-facebook-586x580.jpg", mail: "Park Eh Hye", name: "ehhyepark@gmail.com" },
    { img: "https://thuthuatnhanh.com/wp-content/uploads/2019/07/anh-girl-xinh-facebook-464x580.jpg", mail: "Lam Tran", name: "tranlam.vn" },
    { img: "http://img.gioitre.net//uploads/img/2020/06/gt-5ee3456b5a01e.jpg", mail: "Anh Mai", name: "maianh@gmail.com" },
    { img: "https://zicxa.com/hinh-anh/wp-content/uploads/2020/04/T%E1%BB%95ng-h%E1%BB%A3p-h%C3%ACnh-%E1%BA%A3nh-girl-xinh-Nh%E1%BA%ADt-B%E1%BA%A3n-%C4%91%E1%BA%B9p-nh%E1%BA%A5t-15.jpg", mail: "Sakira Juno", name: "junesakira@gmail.com" },
    { img: "https://toplist.vn/images/800px/sa-lim-di-tien-phong-cho-cac-xu-huong-thoi-trang-146292.jpg", mail: "Sa Lim", name: "limsa@hotmail.com" },
    { img: "https://toplist.vn/images/800px/pham-phuong-anh-146616.jpg", mail: "Anh Phuong", name: "phuongpham@gmail.com" },
    { img: "https://thuthuatnhanh.com/wp-content/uploads/2019/07/tai-hinh-nen-gai-nhat-xinh-nozomi-sasaki-584x580.jpg", mail: "Sasaki Nozumi", name: "nozumisan@gmail.com" },
    { img: "https://thuthuatnhanh.com/wp-content/uploads/2019/07/top-gai-xinh-nhat-ban-kyoko-fukada-468x580.jpg", mail: "Kyoku Fukada", name: "fukankyoku@hotmai.com" }
];

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname));

app.set("view engine", "ejs");


app.get("/post", function (req, res) {
    console.log(__dirname);
    res.render("update.ejs");
});


app.get("/main", function (req, res) {
    console.log(__dirname);

    res.render("index.ejs", { result: cards });
    
});

app.post("/list", function (req, res) {
    console.log("Nhan request", req.body);
    let newCard = { img: "https://picsum.photos/id/237/120/120",
                    mail: req.body.name,
                    name: req.body.email};
    cards.push(newCard);
    db.collection("list").insertOne(req.body).then(results=>{
        console.log(results)
    }).catch(error=>{
        console.error(error);
    })
});

app.post("/removeCard",function(req,res){
    console.log("Request received", req.body);
    let name = req.body.name;
    cards = cards.filter((element)=>{
        return element.mail!==name;
    });
    console.log(cards);

});

app.get("/web",function(req,res){
    db.collection("list").find().toArray().then(results =>{
        console.log(results);
        res.render("upload.ejs",{todoList: results})
    }).catch(error=>{
        console.error(error);
    });

});

app.get("/web/:todoId",function(req,res){
    let id = req.params['todoId'];
    let objectId = require('mongodb').ObjectID;
    db.collection("list").findOne({_id: new objectId(id)}).then(results =>{
        console.log(results);
        res.render("todo.ejs",{todo: results})
    }).catch(error=>{
        console.error(error);
    });
})

app.post("/update", function (req, res) {
    console.log("Nhan request", req.body.email);
    let objectId = require('mongodb').ObjectID;
    db.collection("list").findOneAndUpdate({_id: new objectId(req.body.id)},
    {$set: {name: req.body.name, email: req.body.email}}).then(results =>{
        console.log(results);
    }).catch(error=>{
        console.error(error);
    });
})

app.post("/delete", function (req,res) {
    console.log("Nhan request", req.body);
    let objectId = require('mongodb').ObjectID;
    db.collection("list").deleteOne(
        {_id: new objectId(req.body.id)}
    ).then(results =>{
        console.log(results);
    }).catch(error=>{
        console.error(error);
    });
});

app.listen(3000, function () {
    console.log('running on port 3000');
});