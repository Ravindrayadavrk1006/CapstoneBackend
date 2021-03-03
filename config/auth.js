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
        if(typeof req.user.admin != undefined && req.user.admin===true)
        {
            next();
        }
        else
        {
            res.send("sign in as admin");
            res.redirect('/')
        }
    },
    //seller Autorization
    sellerAuth:function(req,res,next)
    {
        if(typeof req.user.isSeller != undefined && req.user.isSeller)
        {
            next();
        }
        else
        {
            res.send({msg:"sign in as seller"})
        }
    },
    //buyer authorization
    buyerAuth:function(req,res,next)
    {
        if(typeof req.user.isBuyer != undefined && req.user.isBuyer)
        {
            next();
        }
        else
        {
            res.send({msg:"sign in as buyer"});
        }
    }
    
}
