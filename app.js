var createError = require('http-errors');
var express = require('express');
var path = require('path');
var dotenv=require('dotenv');
dotenv.config('.env');

//ROUTES REQUIRE
var Seller=require('./models/sellerSignUp');
var Buyer=require("./models/buyerSignUp");
var Educator=require("./models/educatorSignUp");
const tempRouter=require('./routes/temp');
const AddItemRouter=require('./routes/addItem');
const ItemsRouter=require('./routes/items');
const mongoose =require('mongoose');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser');
var port =process.env.PORT||3001;
var indexRouter = require('./routes/index');
var BuyerRouter = require('./routes/buyer');
const session=require('express-session') 
var SellerRouter=require('./routes/seller'); 
var EducatorRouter=require("./routes/educator")
const databaseName="artworld";
const url=`mongodb://localhost:27017/${databaseName}`
const mongoUrl=process.env.MONGODB_URI || url
app = express();
//firebase admin

// var admin = require("firebase-admin");

// var serviceAccount = require("./config/adminservicekey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


var dotenv=require('dotenv');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const passport=require('passport');
var passRoute=require('./config/passport');
passRoute.buyer(passport);
passRoute.seller(passport);
passRoute.educator(passport);

//EXPRESS SESSION
app.use(session({
  secret:"secret",
  resave:true, 
  saveUninitialized:true,
  cookie:{secure:false}
}))
//using passport middleware;
app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//ROUTES
app.use('/user/buyer', BuyerRouter);
//=>   /user/seller/signUp or signIn
app.use('/user/seller',SellerRouter);
app.use("/user/educator",EducatorRouter)
app.use('/',ItemsRouter);
app.use('/user/seller/dashboard',AddItemRouter);
// app.get('/',(req,res,next)=>{
//   // res.send("this is homepage");
//   res.render("homepage.js");
// })
//SERIALIZING THE BUYER OR SELLER
 passport.serializeUser((user,done)=>{
   console.log(user.id);
   if(user.isBuyer !== undefined)
   {
      // console.log(user);
        var key={
          id:user.id,
          type:"Buyer"
        }
      done(null,key);
   }
   else if (user.isSeller !== undefined)
   {
      console.log(user);
      var key={
        id:user.id,
        type:"Seller"
      }
      done(null,key)
   }
   else
   {
     var key={
       id:user.id,
       type:"Educator"
     }
     done(null,key)
   }
    })
passport.deserializeUser((key,done)=> {
      var Model;
      if(key.type==="Buyer")
      {
        Model=Buyer;
      }
      else if(key.type=== "Seller")
      {
        Model=Seller;
      }
      else
      {
        console.log("entered in the diserializesector")
        Model=Educator;
      }
      Model.findById(key.id,(err,user)=>{
        done(err,user);
      })
    })
app.use("/temp",tempRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
mongoose.connect(mongoUrl,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
})
  .then((result)=>{
    console.log('connected to databse');
    })
  .catch(err=>{
    console.log(err)
  })

app.listen(port,()=>{
  console.log("the server is running at localhost:",port);
})
module.exports = app;

 
