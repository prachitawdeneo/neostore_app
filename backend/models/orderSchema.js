const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
   products:{
       type:Array
   },
   card_no:{
       type:String
   },
   card_name:{
       type:String,
   },
   card_cvv:{
       type:String
   },
   card_expiry:{
       type:Date,
   },
   ship_address:{
       type:Object
   },
   Date:{
       type:Date,
       default:Date.now()
   },
   total_cost:{
       type:Number
   }

})

module.exports=mongoose.model('order',orderSchema)