const express=require('express');
var passport=require('passport');
const fs=require("fs")
const path=require('path')
// var authenticate=require('../authenticate');
const Educator=require('../models/educatorSignUp')
const educatorAdditionalInfo=require('../models/educatorAdditionalInfo');
const bcrypt=require('bcryptjs')
const {ensureAuthenticated,adminAuth,sellerAuth,buyerAuth,educatorAuth}=require('../config/auth');
const multer=require('multer');
var storage=multer.diskStorage({
  destination:function(req,file,cb)
  {
    cb(null, path.join(__dirname,'..', '/public/','uploads/'));
  },
  filename:function(req,file,cb)
  {
      cb(null,new Date().toISOString().replace(/[\/\\:]/g, "_"));
  }
})
var uploadVideo = multer({storage:storage}).single('video');
var photoUpload=multer({storage:storage}).single('profilePic')
const router=express.Router();
router.post('/signUp',(req,res,next)=>{
    var {phone,email,password,confirmPassword,fullname}=req.body;
    var errors=[]
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
         Educator.findOne({email})
         .then(user=>{
            //  console.log("this is user for check =>",(user))
             if(user != null)
             {
                console.log("this is inside the user if user not null");
               errors.push({msg:'email already in use'})
               console.log(errors);
               res.status(200).send(errors);
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
                        var EducatorInstance=new Educator(tempObj);
                        EducatorInstance
                            .save()
                            .then(result=>{
                               const educatorAdditionalInfoInstance=new educatorAdditionalInfo({educatorId:result.id})
                               educatorAdditionalInfoInstance
                                        .save()
                                        .then(educatorInfo=>{
                                            console.log("educator additional info ",educatorInfo);
                                            console.log("user saved to the db");
                                            // res.statusCode=200;
                                            res.status(200).send("success_msg You are now registered and can log in");
                                            // res.redirect('/user/signIn')

                                        })
                                        .catch(err=>{
                                         if(err) 
                                         {
                                          console.log("error raised while adding educator info ",err)
                                         }
                                        })
                                 console.log("the data is logged from the educator signup=>",result);
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
    passport.authenticate('educator',{
    //   successRedirect:'/user/seller/dashboard',
      failureRedirect:'/user/educator/signIn',   
    },(err,user,info)=>{
        if(err)
        {
            console.log("this is error in post sign of educator",err)
        }
        if(!user)
        {
            console.log("! user",user);
            // console.log("post signIn message in educator=>",info.msg)
            // res.write(info.msg);
        }
         req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/user/educator/dashboard');
    });
    })
    (req,res,next);
})
router.get('/dashboard',[ensureAuthenticated],(req,res)=>{
    console.log("this is the educator dashboard");
    educatorAdditionalInfo
            .find({educatorId:req.user.id})
            .then(result=>{
                res.send({
                    userInfo:req.user,
                    additionalInfo:result
                })
            })
    // res.send(req.user);
})
router.post('/addBlog',[educatorAuth],(req,res,next)=>{
      console.log(req.user.user);
      var educatorId=req.user.id;
      var title=req.body.title;
      var subTitle=req.body.subTitle;
      var article=req.body.article;
      var titleImageUrl=req.body.titleImageUrl;
      var articleImageUrls=req.body.articleImageUrls//array
      var newBlogObject={title,subTitle,article,titleImageUrl,articleImageUrls}
      let oldBlogs=[]
      educatorAdditionalInfo
             .findOne({educatorId:educatorId})
             .then(result=>{
                    oldBlogs=result.blogs;
                    oldBlogs.push(newBlogObject);
                    console.log(oldBlogs);
                    educatorAdditionalInfo
                        .updateOne({educatorId:educatorId},{$set:{blogs:oldBlogs}})
                        .then(result=>{console.log(result)
                    res.send("blog saved succesfully")})
              .catch(err=>console.log("error while adding blog ",err))
             })
             .catch(err=>{
                console.log("error raised while adding blog",err);
             })
      
})
router.post('/basicInfo',[photoUpload],(req,res,next)=>{
    var photo=req.file;
    var tempPhoto=fs.readFileSync(path.join(photo['path']))
    var educatorId=req.user.id;
    var address=req.body.address;
    // var profilePicUrl=req.user.profilePicUrl;
    educatorAdditionalInfo
             .updateOne({educatorId:educatorId},{$set:{address:address,profilePicUrl:tempPhoto}})   
             .then(result=>{
                 console.log("profile updated")
                 res.send("succesfully updated")
             })      
})
router.post("/addVideos",[uploadVideo],(req,res,next)=>{
    //     console.log("this is from the /addVideos",req.user.id);
    console.log("i entered in add videos");
    console.log("req.user.id",req.user.id);
      var educatorId=req.user.id;
      var video=req['file'];
      console.log(video);
      var tempVid;
      
      
        tempVid=fs.readFileSync(path.join(video['path']))
      var tags=req.body.tags;
      var videoTitle=req.body.title;
      var description=req.body.description;
      var tempVidObject={
       tempVid,
       videoTitle,
       description,
       tags
      }
      var tempVidArray=[]
      educatorAdditionalInfo
              .findOne({educatorId:educatorId})
              .then(result=>{
                   tempVidArray=result.videos
                   tempVidArray.push(tempVidObject);
                   console.log("vid array",tempVidArray);
                   educatorAdditionalInfo
                        .updateOne({educatorId:educatorId},{$set:{videos:tempVidArray}})
                        .then(result=>
                            {
                                console.log("updated the videos list",result)
                                res.send("video added to the database")
                            })
                        .catch(err=>
                            {
                                console.log("error raised inside the catch of add videos",err);
                            }
                            )
                        
                      })
      
    
})
//logout handle
router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/user/buyer/signIn')
}) 
module.exports=router

