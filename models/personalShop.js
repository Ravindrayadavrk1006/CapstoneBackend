const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Item=require('./item');
const MyShop=new Schema({
 sellerId:{
    type:String,
    required:true,
    default:""
 },
 items:{
  type:[],
  default:[]
 }
});
module.exports=mongoose.model('MyShop',MyShop);