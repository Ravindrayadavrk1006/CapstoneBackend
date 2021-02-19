const mongoose=require('mongoose');
const Schema=mongoose.Schema
var SellerSchema=new Schema({
    isSeller:{
     type:Boolean,
     default:true,
    },
    fullname:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true
    },
    phone:
    {
        type:Number,
        required:true,
        unique:false
    },
    password:
    {
        type:String,
        required:true
    },
    // pinCode:
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
    // category:
    // {
    //   type:[String],
    //   require:true
    // },
    admin:
    {
        type:Boolean,
        default:false
    }  

})
// User.plugin(passportLocalMongoose);
module.exports=mongoose.model('Seller',SellerSchema);