const express=require('express');
var passport=require('passport');
// var authenticate=require('../authenticate');
const Seller=require('../models/sellerSignUp')
const MyShop=require('../models/personalShop');
const bcrypt=require('bcryptjs')
const {ensureAuthenticated,adminAuth}=require('../config/auth');
const sellerAdditionalInfo = require('../models/sellerAdditionalInfo');
const router=express.Router();
router.post('/signUp',(req,res)=>{
    var {phone,email,password,confirmPassword,fullname}=req.body;
    let errors=[]
    if(!phone||!email||!fullname||!password||!confirmPassword)
    {
        errors.push({msg:"please fill in all the fields"})
    }
    if(password!=confirmPassword)
    {
        errors.push({msg:"password didn't match"})
    }
    if(password.length<8)
    {
        errors.push({msg:"password should be atleast 8 characters"})
    }
    if(errors.length>0)
    {
     res.statusCode=400;
     res.send(errors);
    }
     else
     {
         const succesMsg=[]
         Seller.findOne({email})
         .then(user=>{
             if(user)
             {
                 console.log("user is found already");
                 res.statusCode=204;
                res.send({msg:'email already in use'});
             }
             else
             {
                var tempObj =
                {
                    phone,email,password,fullname
                }
                
                 var tempPass
                 bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(tempObj.password,salt,(err,hash)=>{
                        if(err)throw new Error(err);
                        tempObj.password=hash
                        var SellerInstance=new Seller(tempObj);
                        SellerInstance
                            .save()
                            .then(result=>{
                                console.log("user saved to the db");
                                succesMsg.push(" You are now registered and can log in"); 
                               // CREATING A CART
                                Seller
                                    .findOne({email})
                                    .then(seller=>{
                                        console.log(seller);
                                        var sellerId=seller.id;
                                        const PShopInstance=new MyShop({sellerId:sellerId,items:[]});
                                        PShopInstance
                                                .save()
                                                .then(result=>{
                                                    console.log("Pshop has been created=>",result);
                                                    succesMsg.push("Personal Shop has been created");
                                                    // succesMsg.push("now u can log in");
                                                   
                                                    var sellerAdditionalInfoInstance=new sellerAdditionalInfo({sellerId:sellerId})
                                                    sellerAdditionalInfoInstance
                                                            .save()
                                                            .then(sellerInfo=>{
                                                                console.log("seller additional info added",sellerInfo);
                                                                res.statusCode=200;
                                                                res.send(succesMsg);
                                                                // res.redirect('/user/signIn')
                                                            })
                                                            .catch(err=>{
                                                                console.log("seller additional info error",err);
                                                            })
                                                            
                                                })
                                                
                                                .catch(err=>{
                                                        console.log("err is raised while creating a personal shop",err);
                                                })
                                    })
                            })
                            .catch(err=>{
                                if(err) throw new Error(err) 
                            })
                                })
                            })               
             }
         })
         .catch(err=>{
             if(err) throw new Error(err)
         })
        
     }
})
//login handle
router.post('/signIn',(req,res,next)=>{
    passport.authenticate('seller',{
    //   successRedirect:'/user/seller/dashboard',
      failureRedirect:'/user/seller/signIn',   
    },(err,user,info)=>{
        if(err)
        {
            console.log("this is error in post signIn of seller",err)
        }
        if(!user)
        {
            console.log("post signIn message=>",info.msg)
            // res.write(info.msg);
        }
         req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/user/seller/dashboard');
    });
    })
    (req,res,next);
})
router.get('/dashboard',[ensureAuthenticated],(req,res,next)=>{
    var shopInst;
    var additionalInfo;
    var sellerId=req.user.id;
    MyShop
        .findOne({sellerId:sellerId},(shop)=>{
            shopInst=shop;
        })
    sellerAdditionalInfo
        .findOne({sellerId:sellerId},(result)=>{
            additionalInfo=result;
        })
    var dataToSend={
        user:req.user,
        shop:shopInst,
        additionalInfo
                    }
    console.log("this is seller dashboard");

    res.send(dataToSend);
})
//logout handle
router.post('/additionalInfo',(req,res,next)=>{
    var sellerId=req.user.id;
    var {pinCode,address,category,profilePicUrl,}=req.body;
    let tempObj={
        sellerId:sellerId,
        pinCode,
        address,
        category,
        profilePicUrl
    }
    const tempCategoryArray=[];
    category.map(cat=>tempCategoryArray.push(cat));
    sellerAdditionalInfo
        .findOne({sellerId:sellerId})
        .then((info)=>{
            console.log("this is old info stored",info)
            if(info != null || info != undefined)
            {
                var oldCategory=info.category;
                oldCategory.map(cat=>tempCategoryArray.push(cat))
            }
            sellerAdditionalInfo
                .updateOne({sellerId:sellerId},{$set:{pinCode:pinCode,category:tempCategoryArray,profilePicUrl:profilePicUrl}})
                .then(result=>{
                    console.log("seller addtional information added",result);
                        res.send("updated");
                })
                .catch(err=>{
                    console.log("error while adding additional seller info",err);
                })
           
        })
        .catch(err=>{
            console.log("error raise while finding the old data ",err);
        })
    // var sellerAdditionalInfoInstance=new sellerAdditionalInfo(tempObj);
    // sellerAdditionalInfoInstance
    //         .save()
    //         .then(result=>{
    //             console.log(" addtional information added",result);
    //         })
    //         .catch(err=>{
    //             console.log("error while adding additional seller info",err);
    //         })
})
router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/user/signIn')
}) 
module.exports=router;