const express=require('express');
const router=express.Router();
router.get('/check',(req,res,next)=>{
 res.render("homepage.ejs");
})
router.get("/signIn",(req,res,next)=>{
      res.render("singIn.ejs");
})
router.get("/basicInfo",(req,res,next)=>{
 res.render("basicInfo.ejs")
})
module.exports=router;