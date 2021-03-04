const express=require('express');
const router=express.Router();
router.get('/check',(req,res,next)=>{
 res.render("homepage.ejs");
})
router.get("/signIn",(req,res,next)=>{
      res.render("singIn.ejs");
})
module.exports=router;