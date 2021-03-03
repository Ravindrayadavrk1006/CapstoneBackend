const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const EducatorInfo=new Schema({
    educatorId:{
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
    blogs:{
     type:Array,
     default:[]
    },
    videos:
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
module.exports=mongoose.model('EducatorInfo',EducatorInfo);