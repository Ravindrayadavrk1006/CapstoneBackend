const express=require('express');
var passport=require('passport');
// var authenticate=require('../authenticate');
const Buyer=require('../models/buyerSignUp')
const buyerAdditionalInfo=require('../models/buyerAdditionalInfo');
const bcrypt=require('bcryptjs')
const {ensureAuthenticated,adminAuth}=require('../config/auth');
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
     res.statusCode=200
     res.send(errors);
    }
     else
     {
         Buyer.findOne({email})
         .then(user=>{
             if(user)
             {
              errors.push({msg:'email already in use'})
              res.statusCode=204;
              res.send(errors)
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
                        var BuyerInstance=new Buyer(tempObj);
                        BuyerInstance
                            .save()
                            .then(result=>{
                               const buyerAdditionalInfoInstance=new buyerAdditionalInfo({buyerId:result.id})
                               buyerAdditionalInfoInstance
                                        .save()
                                        .then(buyerInfo=>{
                                            console.log("buyeradditionalinfo ",buyerInfo);
                                            console.log("user saved to the db");
                                            res.statusCode=200;
                                            res.send("success_msg You are now registered and can log in");
                                            res.redirect('/user/signIn')

                                        })
                                console.log("the data is logged from the buyer signup=>",result);
                                    
                                
                            
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
    passport.authenticate('buyer',{
      successRedirect:'/user/buyer/dashboard',
      failureRedirect:'/user/buyer/signIn',
      failureFlash:true,   
    })
    (req,res,next);
})
router.get('/dashboard',[ensureAuthenticated],(req,res)=>{
    console.log("this is the buyer dashboard");
    res.send(req.user);
})
router.post('/additionalInfo',(req,res,next)=>{
    var buyerId=req.user.id;
    var {address,profilePicUrl,}=req.body;
    const tempAddresArray=[];
    tempAddresArray.push(address);
    buyerAdditionalInfo
        .findOne({buyerId:buyerId})
        .then((info)=>{
            console.log("this is old info stored",info)
            if(info != null || info != undefined)
            {
                var oldAddress=info.address;
                oldAddress.map(add=>tempAddresArray.push(add))
            }
            buyerAdditionalInfo
                .updateOne({buyerId:buyerId},{$set:{address:tempAddresArray,profilePicUrl:profilePicUrl}})
                .then(result=>{
                    console.log(" addtional information added",result);
                        res.send("updated");
                })
                .catch(err=>{
                    console.log("error while adding additional seller info",err);
                })
           
        })
        .catch(err=>{
            console.log("error raise while finding the old data ",err);
        })
    // let tempObj={
    //     buyerId:buyerId,
    //     address:tempAddresArray,
    //     profilePicUrl
    // }
    // var BuyerAdditionalInfoInstance=new BuyerAdditionalInfo(tempObj);
})
//logout handle
router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/user/buyer/signIn')
}) 
module.exports=router

