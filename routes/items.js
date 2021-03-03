const Items=require("../models/item");
const express=require('express');
const router =express.Router();
router.get('/allItems',(req,res,next)=>{
      Items
       .find({})
       .then(items=>{
          console.log("items found")
           res.send(items);
       })
       .catch(err=>{
         console.log("error raised while retrieving all the items",err)
       })
})
router.get('/items',(req,res,next)=>{
    let category=req.query.category;
    Items
      .find({category:category})
      .then(result=>{
         console.log("items found",result);
         res.send(result);
      })
      .catch(err=>{
         console.log("error raised while quering /items",err);
      })
})
module.exports=router;