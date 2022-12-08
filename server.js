//Cyclic URL: https://good-pink-turtle-boot.cyclic.app
const express = require("express");
const app = express();
const path = require('path');
const HTTP_PORT = process.env.PORT || 8080;
var Final = require('./final');

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
} 

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/finalViews/home.html"));
});

app.get("/register", (req,res) => {
    res.sendFile(path.join(__dirname, "/finalViews/register.html"));
});

app.post("/register", (req,res) => {
  Final.register(req.body).then((user) => {
    res.send(user.email + " registered successfully. <br /> <a href='/'>Go Home</a>");
  }).catch((err) => {
    res.send(err);
  })
});

app.get("/signIn", (req,res) => {
    res.sendFile(path.join(__dirname, "/finalViews/signIn.html"));
});

app.post("/signIn", (req,res) => {
  Final.signIn(req.body).then((user)=>{
    res.send(user.email + " signed in successfully. <br /> <a href='/'>Go Home</a>");
  }).catch((err) => {
    res.send(err);
  })
});

app.use((req, res) => {
    res.status(404).send("Error 404:page not found.");
  });

Final.startDB()
.then(() => {
    app.listen(HTTP_PORT, onHttpStart);
})
.catch(function(err) {
    console.log(err);
})