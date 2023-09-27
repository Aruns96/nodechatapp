const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(bodyParser.urlencoded({extended:false}));



app.get("/",(req,res)=>{

    fs.readFile("username.txt",(err,data)=>{
        if(err){
            console.log(err);
            data = 'no data';
        }
        res.send(`${data}<form action="/" method="POST"
        onsubmit="document.getElementById('username').value = localStorage.getItem('username')" >
        <input id="message" name="message" placeholder="message">
        <input id="username" type="hidden" name="username"><button type="submit">send</button> </form>`);
    })
   
    

})
app.post("/",(req,res)=>{
    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.message);
   fs.writeFile("username.txt",`${req.body.username}:${req.body.message}`,{flag:'a'},(err)=>{
    err ? console.log(err) : res.redirect("/");
   })
   
    
})
app.get("/login",(req,res)=>{
    
    res.send(`<form action="/" method="POST"
    onsubmit="localStorage.setItem('username', document.getElementById('username').value)" >
    <input type="text" name="username" id="username" placeholder="username"><button type="submit">Login</button> </form>`);
    
})


app.listen(3000);