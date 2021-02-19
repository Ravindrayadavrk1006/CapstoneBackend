const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const sellerInfo=new Schema({
 sellerId:{
  type:String,
 },
  pinCode:
    {
     type:Number,
     default:0,
     required:true,
    },
    address:
    {
      type:String,
      default:"",
      require:true
    },
    category:
    {
      type:[String],
      require:true
    },
    profilePicUrl:
    {
     type:String,
     default:''
    }
})
module.exports=mongoose.model('SellerInfo',sellerInfo);