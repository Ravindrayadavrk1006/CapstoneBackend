const mongoose=require('mongoose');
const Schema=mongoose.Schema
var BuyerSchema=new Schema({
    fullname:
    {
        type:String,
        required:true
    },
    isBuyer:
    {
     type:Boolean,
     default:true,
    },
    email:
    {
        type:String,
        required:true
    },
    phone:
    {
        type:String,
        required:true,
        unique:false
    },
    password:
    {
        type:String,
        required:true
    },
    //  pinCode:
    // {
    //  type:Number,
    //  default:0,
    //  required:true,
    // },
    // address:
    // {
    //   type:String,
    //   default:"",
    //   require:true
    // },
    // cart:{
    //    type:[{String}]
    // }
    // ,
    admin:
    {
        type:Boolean,
        default:false
    }  

})
// User.plugin(passportLocalMongoose);
module.exports=mongoose.model('Buyer',BuyerSchema);