
const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const app = express();
const mysql = require('mysql');


//Make the card details
let cards = [];
let profile = {};

app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "110786",
  database: 'webdata'
});

con.connect(function (err) {
  if (!err)
    console.log('Database is connected!');
  else
    console.log('Database not connected! : ' + JSON.stringify(err, undefined, 2));
});


//Make the profile table

let profileSql = `create table if not exists profile(
  id int primary key auto_increment,
  name varchar(20) not null,
  email varchar(50) not null
)`;

con.query(profileSql, (err, res) => {
  if (err)
    console.log(err.message);
  else
    console.log("Done");
});



//Query data from the card_table
let str = 'SELECT * FROM card_table';
con.query(str, (err, rows) => {
  if (err) throw err;
  rows.forEach((row) => {
    console.log(`${row.name} : ${row.detail}`);
    cards.push({
      // id: row.card_id,
      url: row.card_url,
      name: row.name,
      detail: row.detail
    });
  });
  console.log(cards);
});





//Render the web
app.get("/home", function (req, res) {
  res.render("index.ejs", { result: [cards, profile] });
})

//Render the form
app.get("/profile", function (req, res) {
  res.render("profile.ejs");
});

//Insert data to profile table
app.post("/postProfile", function (req, res) {

  if (req.body.name && req.body.email) {
    let sql = `INSERT INTO profile (name,email) VALUES ("${req.body.name}","${req.body.email}")`;
    profile.name = req.body.name;
    profile.email = req.body.email;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
    return res.redirect('/home');
  }
  res.redirect('/profile');

});



//Insert a record to database
app.post("/add", function (req, res) {
  console.log("Received request", req.body);
  let newCard = {
    url: req.body.url,
    name: req.body.name,
    detail: req.body.detail
  };
  cards.push(newCard);
  let sql = `INSERT INTO card_table (card_url,name,detail) VALUES ("${newCard.url}","${newCard.name}","${newCard.detail}")`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });

  res.redirect('/home');
});


//Delete a record from database
app.post("/removeCard", function (req, res) {
  console.log("removeCard received", req.body);
  let name = req.body.name;
  cards = cards.filter((element) => {
    return element.name !== name;
  });
  let del = `DELETE FROM card_table WHERE name = "${name}"`;
  con.query(del, function (err, res) {
    if (err) throw err;
    console.log("1 record deleted");
  });
  res.redirect('/home');
});

//Update a record
app.post("/update", function (req, res) {
  console.log("Update card", req.body);
  let name = req.body.name;
  let str = `${name}  is an interesting place`;
  let sql = `UPDATE card_table SET detail = "${str}" WHERE name = "${name}"`;
  cards = cards.map(card => {
    if (card.name === name) {
      card.detail = str;
    }
    return card;
  });
  con.query(sql, function (err, res) {
    if (err) throw err;
    console.log("Update sucessful");
  });

  res.redirect('/home');
});

//Sorting database
app.post("/sorting", function (req, res) {
  console.log("Sorting database", req.body);

  let type = req.body.type;


  cards.sort(Compare(type, 'desc'));

  let sql = `SELECT * FROM card_table ORDER BY ${type} DESC`;
  console.log(sql);
  con.query(sql, function (err, res) {
    if (err) throw err;
    console.log(res);
  })
  res.redirect('/home');

});

//Searching database
app.post("/search", function (req, res) {
  console.log("Searching database", req.body);

  let name = req.body.name;
  let sql = `SELECT * FROM card_table WHERE name LIKE "%${name}%"`;
  cards = [];
  con.query(sql, (err, rows) => {
    if (err) throw err;
    rows.forEach((row) => {
      console.log(`${row.name} : ${row.detail}`);
      cards.push({
        // id: row.card_id,
        url: row.card_url,
        name: row.name,
        detail: row.detail
      });
    });
    console.log(cards);
  });
  res.redirect('/home');


});

app.listen(3000, function () {
  console.log('hello nodejs running on port 3000');
})


function Compare(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

