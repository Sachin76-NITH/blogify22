require("dotenv").config();
const express=require("express");
const app=express();
const path=require("path");
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')
const mongoose=require("mongoose");
const cookieParser=require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const Blog=require('./models/blog')
const Port=process.env.Portort ||8000;

mongoose.connect(process.env.MONGO_URL)
.then((e)=>console.log("MongoDb Connected"));


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve("./public")))

app.get("/",async(req,res)=>
{   const allBlogs= await Blog.find({});
    res.render("home",
    {     blogs:allBlogs,
         user:req.user,
    });
});


app.use('/user',userRoute);
app.use('/blog',blogRoute);
app.listen(Port,()=>
{
    console.log("SERver is Running");
})