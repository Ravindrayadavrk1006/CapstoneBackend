const mongoose=require('mongoose');
const Schema=mongoose.Schema;
var Item=new Schema({
 name:{
  type:String,
  default:'',
 },
 //for storing string values that will help to find the TYPE of items
 category:{
  type:Array,
 },
 rating:
 {
  type:Number,
  default:0
 },
 price:{
   type:Number,
   default:0.000
 },
 highlights:{
  type:String
 },
 description:{
  type:String
 },
 imageUrl:{
   type:String
 },
 descImageUrl:{
  type:[],
  default:[]

 },
 specification:{
  type:[],
  default:[]

 },
 comments:{
  type:[],
  default:[]
 }
})
module.exports=mongoose.model("Item",Item);