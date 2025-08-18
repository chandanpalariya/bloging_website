const express=require("express");
const userRoute=require('./routes/user')
const path=require("path");
const mongoose=require('mongoose');
const cookieParser=require("cookie-parser");
const {checkforAuthenticationCookie}=require('./middleware/authentication')
const Blog=require('./models/blog')
const blogRouter=require("./routes/blog");
const { configDotenv } = require("dotenv");

const app=express();

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkforAuthenticationCookie("token"))


const port=process.env.port||8000;

mongoose.connect("mongodb+srv://ex-chandan:chandan2006@cluster0.10rsh.mongodb.net/blogs").then(()=>{
   console.log("mongodb connected succesfully");
})


app.get("/",async(req,res)=>{
   const allBlogs=await Blog.find({});
   res.render("home",{
      user:req.user,
      blogs:allBlogs,
   })
})


app.use(express.static(path.resolve("./public")))

app.use('/user',userRoute)
app.use("/blog",blogRouter)

app.listen(port,()=>console.log(`server started at ${port}`));
