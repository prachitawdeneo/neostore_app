const mongoose=require('mongoose');

const customerSchema=new mongoose.Schema({
    first_name:{
        type: String,
        required:'This field is required'
    },
    last_name:{
        type: String,
        // required:true
        
    },
    email:{
        type:String,
        // required:true,
        unique:true      
    },
    phone_no:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        // required:true,
        // unique:true
    },
    con_password:{
        type:String,
        // required:true
    },
    gender:{
        type:String,
        
    },
    profile_pic:{
        type:String,
    },
    dob:{
        type:Date,
    },
    customer_address:{
        type:Array,
        sparse:true
    },
    cart:{
        type:Array,
        unique:false,
        sparse:true
    },
    isSocialLogin:{
        type:Boolean,
        sparse:true
    }
})

module.exports=mongoose.model('customer_details',customerSchema)