const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true,// bat buoc phai co
        minlength:6,
        maxlength:20,
        unique:true // username ton tai duy nhat
    },
    email:{
        type:String,
        required:true,// bat buoc phai co
        minlength:10,
        maxlength:50,
        unique:true // username ton tai duy nhat
    },
    password:{
        type:String,
        required:true,// bat buoc phai co
        minlength:10,
    },
    admin:{
        type:Boolean,
        default:false //gia tri mac dinh cho cac user ko phai admin
    }
},
{timestamps:true}//thoi diem user dc tao
)

module.exports = mongoose.model('User',userSchema);//export de dung