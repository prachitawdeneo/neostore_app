const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    productName:{
        type:String
    },
    productImage:{
        type:String
    },
    productDescrip:{
        type:String
    },
    productRating:{
        type:Number
    },
    productProducer:{
        type:String
    },
    productCost:{
        type:Number
    },
    productStock:{
        type:Number
    },
    productDimension:{
        type:String
    },
    productMaterial:{
        type:String
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    colorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"color"
    },
    subImages:{
        type:Array
    },
    RatingsArray:{
        type:Array
    }
    
})

module.exports=mongoose.model('product_details',productSchema)