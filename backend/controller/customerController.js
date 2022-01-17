const customerModel=require('../models/customerSchema')
const bcrypt=require('bcrypt')
let loginCheck=''

async function addCustomer(data){
    console.log(data)
    loginCheck=data.password

    
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    
    // now we set user password to hashed password
    data.password = await bcrypt.hash(data.password, salt);
    data.con_password = await bcrypt.hash(data.con_password, salt);
    console.log(data)
    // creating a new mongoose doc from user data
    let ins=await new customerModel(data);
     ins.save((err)=>{
        if(err) throw err
        else{
        console.log("User Added!")
        // res.redirect('/login')
        }
    })
}

async function loginCustomer(body){
    
    customerModel.find({email:body.email},(err,data)=>{
        console.log(data)
        console.log(body.password)
        console.log(data.password)
        // const validPassword =  bcrypt.compare(data.password,body.password);
        console.log( data.password === body.passwrod);
        if (err) throw err
        else if(data.password === body.passwrod){
            console.log(data);
            console.log("Data matched!");
            return data;
        }
            
        })   
}

module.exports={addCustomer,loginCustomer}