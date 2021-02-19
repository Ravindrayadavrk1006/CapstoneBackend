const express=require('express');
const router=express.Router();
const Items=require('../models/item');
const PShop=require('../models/personalShop');
router.post('/addItem',(req,res,next)=>{
    const item=req.body;
    const sellerId=req.user["id"];
    //ADDING TO PERSONAL SHOP 
    PShop.findOne({sellerId:sellerId})
         .then(shop=>{
          console.log("this is shop ",shop);
             var itemList=shop.items;
             itemList.push(item);
             console.log("itemlist=>",itemList);
              PShop
               .updateOne({sellerId:sellerId},{$set:{items:itemList}},(foundShop)=>{
                  console.log(foundShop);
                  console.log("myShop items is updated");
                  res.status(200).send(`item added to  myshop of ${req.user["fullname"]}`);
               })
         })
         .catch(err=>{
             console.log("error while adding item to personal shop",err)
         })
    
    //ADDING TO ITEMS DB
    var ItemInstance=new Items(item);
    ItemInstance
          .save()
          .then(result=>{
             console.log("item saved to the item DB",result)
          })
          .catch(err=>{
           console.log("error raised while saving to item db=>",err)
          })
})
module.exports=router;