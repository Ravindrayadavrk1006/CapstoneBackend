const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Item=require('./item');
var Cart=new Schema({
 buyerId:{
  type:String,
  default:'',
 },
 items:{
  type:[]
 }
})
module.exports=mongoose.model('Cart',Cart);