const  express =require("express");
const app=express();
const users=require("./routes/user.js")
const posts=require("./routes/post.js")
const session =require("express-session")
const flash=require("connect-flash")
const path = require("path");

app.set("view engine","ejs")
app.set("views", path.join(__dirname, "views"));

const sessionOptions={
   secret: "mysupersecretstring",
   resave: false,
   saveUninitialized: true
 }
app.use(session(sessionOptions));
app.use(flash());
app.get("/register",(req,res)=>{
   let {name}=req.query;
   req.session.name=name;
  req.flash(`success`,`user regestered successfully`)
   res.redirect("/hello")
});
app.get("/hello",(req,res)=>{
res.render("page.ejs",{name:req.session.name,msg:req.flash("success")})
})
 
// app.get("/test",(req,res)=>{
//    res.send("test successful")
// })
// app.get("/reqcount",(req,res)=>{
//    if(req.session.count){
//       req.session.count++;
//    }else{
//       req.session.count=1;
//    }
   
//    res.send(`You sent a request ${req.session.count} times`);
   
// })
app.listen(3000,()=>{
   console.log("listening at port 3000") 
})