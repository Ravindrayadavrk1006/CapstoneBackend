const LocalStategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

//User model
const Seller=require('../models/sellerSignUp');
const Buyer=require("../models/buyerSignUp");
exports.seller=function(passport){
    passport.use('seller',
        new LocalStategy({usernameField: 'email',
    passwordField: 'password'},(username,password,done)=>{
            //match user
            Seller.findOne({email:username})
            .then(user=>{
                if(!user)
                {
                    console.log("email is not registered");
                    return done(null,false);
                    
                }
                //Match the password if the user exist by the username
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch)
                    {
                        console.log('seller username password matched')
                        return done(null,user)
                    }
                    
                    else
                    {
                        console.log("password not matched")
                        return done(null,false);
                    }
                })
            })
            .catch(err=>{
                console.log(err);
            })
        })
    )
}
exports.buyer=function(passport){
    passport.use('buyer',
        new LocalStategy({usernameField: 'email',
    passwordField: 'password'},(username,password,done)=>{
            //match user
            Buyer.findOne({email:username})
            .then(user=>{
                if(!user)
                {
                    return done(null,false);
                }
                //Match the password if the user exist by the username
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    // if(isMatch && user['admin']==true)
                    // {
                    //     return done(null,user,{message:"is admin",admin:true})
                    // }
                    if(isMatch)
                    {
                        console.log("username and password is matched")
                        return done(null,user)
                    }
                    
                    else
                    {
                        return done(null,false,{message:'password incorrect'});
                    }
                })
            })
            .catch(err=>{
                console.log(err);
            })
        })
    )
}
