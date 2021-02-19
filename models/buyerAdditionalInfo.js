const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const BuyerInfo=new Schema({
    buyerId:{
     type:String,
    },
    address:
    {
      type:[],
      default:[],
      require:true
    },
    reviews:
    {
      type:Array,
      default:[]
    },
    profilePicUrl:
    {
     type:String,
     default:''
    }
})
module.exports=mongoose.model('BuyerInfo',BuyerInfo);