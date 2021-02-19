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
            next()
        }
        else
        {
            res.redirect('/')
        }
    }
}
