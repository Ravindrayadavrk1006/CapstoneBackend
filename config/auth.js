module.exports={
    ensureAuthenticated:function(req,res,next)
    {
        if(req.isAuthenticated())
        {
            // console.log("the user is ",req.user);
            next();
        }
        else
        {
            console.log("please login to view");
        }
    },
    //checking if the author is the admin or not
    adminAuth:function(req,res,next)
    {
        // console.log(req.user);
        //    if(req.user === undefined || req.user.a === undefined)
        //     {
        //         res.send({msg:"sorry looks like wrong place please sign in/sign up as admin"})
        //     }
        //     else
        //     {
        //         next();
        //     }
        if(typeof req.user.admin != undefined && req.user.admin===true)
        {
            next();
        }
        else
        {
            // res.send("sign in as admin");
            res.redirect('/')
        }
    },
    //seller Autorization
    sellerAuth:function(req,res,next)
    {
           if(req.user === undefined )
            {
                res.send({msg:"sorry looks like wrong place please sign in"})
            }
            else if(req.user.isSeller === undefined)
            {
                 res.send({msg:"sorry looks like wrong place please sign in/sign up as seller"})
            }
            else
            {
                next();
            }
    },
    //buyer authorization
    buyerAuth:function(req,res,next)
    {
          if(req.user === undefined )
            {
                res.send({msg:"sorry looks like wrong place please sign in"})
            }
            else if(req.user.isBuyer === undefined)
            {
                 res.send({msg:"sorry looks like wrong place please sign in/sign up as buyer"})
            }
            else
            {
                next();
            }
    },
    educatorAuth:(req,res,next)=>{
            if(req.user === undefined || req.user.isEducator === undefined)
            {
                res.send({msg:"sorry looks like wrong place please sign in/sign"})
            }
            else if(req.user.isEducator === undefined)
            {
                res.send({msg:"sign in/signup  as educator "})
            }
            else
            {
                next();
            }
    } 
    
}
