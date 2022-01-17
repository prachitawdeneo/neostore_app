const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const PORT=8000;
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static('./'));

app.use(cors());

//db connection
const db="mongodb://localhost:27017/neostore-app";
const connectDB=async()=>{
    try{
        await mongoose.connect(db,{useNewUrlParser:true});
        console.log("MOngoDB connected");
    }
    catch(err){
        console.log(err.message);
    }
}
connectDB();
//end


//routes
//load routes
const neoRoutes=require('./routes/neoRoutes');
const { urlencoded } = require('express');
app.use('/',neoRoutes);

// const { urlencoded } = require('express');



app.listen(PORT,(err)=>{
    if (err) throw err
    console.log(`Work on ${PORT}`);
})