const mongoose=require('mongoose');
const Schema=mongoose.Schema
var EducatorSchema=new Schema({
    fullname:
    {
        type:String,
        required:true
    },
    isEducator:
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
    admin:
    {
        type:Boolean,
        default:false
    }  

})
// User.plugin(passportLocalMongoose);
module.exports=mongoose.model('Educator',EducatorSchema);