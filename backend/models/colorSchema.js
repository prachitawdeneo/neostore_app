const mongoose=require('mongoose');

const colorSchema=new mongoose.Schema({
    color_name:{
        type:String
    }

})

module.exports=mongoose.model('color',colorSchema)