require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const app=express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});
const userschema=new mongoose.Schema({
 email:String,
 password:String
});

userschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User=new mongoose.model("User",userschema);
app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/submit",function(req,res){
    res.render("submit");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.get("/secret",function(req,res){
    res.render("secret");
})
app.post("/register",function(req,res){
    const newuser=new User({
        email:req.body.email,
        password:req.body.pass
    });
    newuser.save(function(err){
        if(err)
        {console.log(err);}
        else
        {
            res.render("secret");
        }
    });
});
app.post("/login",function(req,res){
    const useremail=req.body.email;
    const userpassword=req.body.pass;
    User.findOne({email:useremail},function(err,founduser){
        if(err){
            console.log(err);
        }
        else{
            if(founduser)
            {
                if(founduser.password == userpassword)
                {
                    res.render("secret");
                }
            }
        }
    });
});







app.listen(3000,function(){
    console.log("server has started");
})
