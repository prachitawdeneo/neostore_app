const express=require('express');
const router=express.Router();
const jwt = require('jsonwebtoken')
const jwtSecret='afkhfhgruwi743657iuhuj4k5j'
const { check, validationResult } = require('express-validator');
const {addCustomer,loginCustomer}=require('../controller/customerController')
const customerModel=require('../models/customerSchema') 
const productModel=require('../models/productSchema') 
const categoryModel=require('../models/categorySchema') 
const colorModel=require('../models/colorSchema') 
const orderModel=require('../models/orderSchema') 
const bcrypt=require('bcrypt')
const credentials=require('../controller/env')
const nodemailer=require('nodemailer')
const multer = require('multer');
const path=require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

const upload = multer({ storage: storage }).single('file')


let otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);



function autenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if (token == null) {
        res.json({ "err": 1, "msg": "Token not match" })
    }
    else {
        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                res.json({ "err": 1, "msg": "Token incorrect" })
            }
            else {
                console.log("Match")
                next();
            }
        })
    }
}


router.post('/register',[
    check('email', 'Email length should be 4 to 30 characters')
                    .isEmail().isLength({ min: 10, max: 30 }),
    check('first_name', 'Name length should be 3 to 20 characters')
                    .isLength({ min: 3, max: 20 }),
    check('phone_no', 'Mobile number should contains 10 digits')
                    .isLength({ min: 10, max: 10 }),
    check('last_name', 'Name length should be 3 to 20 characters')
                    .isLength({ min: 3, max: 20 }),
    check('password', 'Password length should be 6 to 100 characters')
                    .isLength({ min: 6, max: 100 })
],(req,res)=>{
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
      return res.status(400).json(errors);
    }
    addCustomer(req.body)
    res.json({"err":0,"msg":"Data Posted"})

})

router.post('/login',[
    check('email', 'Email length should be 4 to 30 characters')
                    .isEmail().isLength({ min: 10, max: 30 }),
    check('password', 'Password length should be 8 to 100 characters')
                    .isLength({ min: 8, max: 100 })
],(req,res)=>{
    customerModel.findOne({ email: req.body.email }, (err, data) => {
        console.log(req.body.password);
        console.log(data.password);
        if (err) {
            res.send("its error")
        }
        else if (data == null) {
            console.log(data)
            res.json({ err: 1,message:'please write correct email id' })
        }
        else if(data.isSocialLogin){
            res.json({ err: 1 ,'message':'You are a Social User!!Please use Social Login!'})
        }
        else if ((bcrypt.compareSync(req.body.password, data.password))) {
            console.log((bcrypt.compareSync(req.body.password, data.password)));
            let payload = {
                 email:req.body.email,
                 first_name:data.first_name,
                 last_name:data.last_name,
                 phone_no:data.phone_no,
                 password:data.password,
                 id:data._id,
                 profile_pic:"http://localhost:8000/public/user.png",
                 cart:data.cart,
                 gender:data.gender,
                 dob:data.dob,
                 isSocialLogin:false
                }
            const token = jwt.sign(payload,jwtSecret,{expiresIn:360000})
            console.log({
                err: 0, 
                success: true,
                status_code: 200,
                message: `" ${data.first_name} ${data.last_name} You have logged In"`,
                data: data,
                token:token
            })
            res.json({
                err: 0, 
                success: true,
                status_code: 200,
                message:` Hey !${data.first_name} ${data.last_name} You have Logged In Successfully`,
                data: data,
                token:token
            })  
        }
        else if (!(bcrypt.compareSync(req.body.password, data.password))) {
            res.json({ err: 1 ,'message':'Please Enter Valid Details'})
        }
        

    })

})

router.post('/changePassword',[
    check('old_password', 'Password length should be 8 to 100 characters')
                    .isLength({ min: 8, max: 100 }),
    check('password', 'Password length should be 8 to 100 characters')
                    .isLength({ min: 8, max: 100 }),
    check('con_password', 'Password length should be 8 to 100 characters')
                    .isLength({ min: 8, max: 100 })
],(req,res)=>{
    console.log(req.body)
    customerModel.findOne({email:req.body.email},(err,data)=>{
        console.log(data)
        if (err) {
            res.json({
                "err":1,
                "success": false,
                "status_code": 200,
                "message": "Something went wrong!!"
              }
              )
        }
        else if(data === null){
            res.json({
                "err":1,
                "success": false,
                "status_code": 200,
                "message": "Password not match!"
              }
              )
        }
        // else if((bcrypt.compareSync(req.body.old_password, data.password))){
        //     console.log(req.body.old_password, data.password);
        //     customerModel.updateOne({email:req.body.email},{$set:{password:req.body.password,con_password:req.body.con_password}},(err,result)=>{
        //         if (err) throw err
        //         console.log(result);
        //     })
        //     res.json({
        //         "err":0,
        //         "success": true,
        //         "status_code": 200,
        //         "message": "You have changed your password",
        //         "data":customerModel.find({email:req.body.email},(err,data)=>{
        //             return data
        //         })
        //       }
        //       )
        // }
        else{
            bcrypt.compare(req.body.old_password, data.password, function(err, isMatch) {
                if (err) {
                  throw err
                } else if (!isMatch) {
                  console.log("Password doesn't match!")
                  res.json({
                    "err":1,
                    "success": false,
                    "status_code": 200,
                    "message": "Password doesn't match!"
                  })
                } else {
                  console.log("Password matches!")
                  customerModel.updateOne({email:req.body.email},{$set:{password:req.body.password,con_password:req.body.con_password}},(err,result)=>{
                    if (err) {
                        res.json({
                            "err":1,
                            "success": false,
                            "status_code": 200,
                            "message": "Something went wrong!!"
                          })
                    }
                    else{
                        console.log(result);
                        res.json({
                            "err":0,
                            "success": true,
                            "status_code": 200,
                            "message": "You have changed your password",
                            // "data":customerModel.find({email:req.body.email},(err,data)=>{
                            //     return data
                            // })
                        })
                    }
                })
                }
              })
        }
    })
})

router.post('/forgotPassword',(req,res)=>{
    console.log(req.body);
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: credentials.email, // generated ethereal user
          pass: credentials.password, // generated ethereal password
        },
    });
    var mailOptions = {
        from: 'prachivt@gmail.com',
        to: `${req.body.email}`,
        subject: 'NeoSTORE Verification Code',
        html: `<h1><span style="color:black">Neo</span><span style="color:red">STORE</span> </h1>
                <h2>Your Verification Code is </h2>
                <h1 style="font-weight:bold;color:red">${otp}</h1>
                `
      };
      customerModel.find({email:req.body.email},(err,data)=>{
          if (err){
              res.json({
                  "err":1,
                  "message":"Enter Correct Email id!"
              })
          }
          else if(data===null){
            res.json({
                "err":1,
                "message":"User Not Found!!"
            })
          }
          else{
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                  res.json({
                      "err":1,
                      "message":"Enter Correct Email"
                  })
                } else {
                  console.log('Email sent: ' + info.response);
                  console.log({
                    "err":0,
                    "otp": otp,
                    "message":"OTP sent successfully!!" 
                   }
                )
                res.json({
                    "err":0,
                    "otp": otp,
                    "message":"OTP sent successfully!!" 
                   }
                )
                }
              });
          }
      })
    
})

router.post('/recoverPassword',(req,res)=>{
    console.log(req.body);
    console.log(otp);
    console.log(req.body.otp)
    if(otp===parseInt(req.body.otp)){
        customerModel.updateOne({email:req.body.email},{$set : {password:req.body.password,con_password:req.body.con_password}},(err,result)=>{
            if (err){
                res.json({
                    "err":1,
                    "success": false,
                    "status_code": 200,
                    "message": "Something went wrong!!"
                  }) 
            }
            else{
                console.log(result);
                res.json({
                    "err":0,
                    "success": true,
                    "status_code": 200,
                    "message": "Password recovered successfully."
                })
                console.log({
                    "err":0,
                    "success": true,
                    "status_code": 200,
                    "message": "Password recovered successfully."
                });
            }
        })
    }
    else{
        res.json({
            "err":1,
            "success": false,
            "status_code": 200,
            "message": "Verification Code not matched!!"
          })
        console.log({
            "err":1,
            "success": false,
            "status_code": 200,
            "message": "Verification Code not matched!!"
          });
    }
})

router.post('/profile',(req,res)=>{
            if(req.body !== undefined){
                customerModel.updateOne({_id:req.body.id},{$set:{first_name:req.body.first_name,last_name:req.body.last_name,email:req.body.email,phone_no:req.body.phone_no,gender:req.body.gender,dob:req.body.dob}},(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(result);
                        res.json({"err":0,"message":"Data updated!!"})
                    }
                })
            }

})

router.post('/profilepic',(req,res,next)=>{
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        else{
            const url = req.protocol + '://' + req.get('host') + '/public/' + req.file.filename
            console.log(req.body)
            console.log(req.file)
            if(req.body !== undefined && req.file !== undefined){
                customerModel.updateOne({_id:req.body.id},{$set:{profile_pic:url}},(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(result);
                        customerModel.findOne({_id:req.body.id},(err,data)=>{
                            if(err){
            
                            }
                            else{
            
                                let payload = {
                                    email:data.email,
                                    first_name:data.first_name,
                                    last_name:data.last_name,
                                    gender:data.gender,
                                    phone_no:data.phone_no,
                                    password:data.password,
                                    id:data._id,
                                    profile_pic:data.profile_pic,
                                    dob:data.dob,
                                    cart:data.cart,
                                }
                                const token = jwt.sign(payload,jwtSecret,{expiresIn:360000})
                                res.json({
                                    "err":0,
                                    "message":"Profile Pic Uploaded!!",
                                    "token":token
                                })
                            }
                        })
                        
                    }
                })
            }
    
        }
        
 })

})

router.post('/getCustAddress',(req,res)=>{
    console.log(req.body);
    customerModel.find({_id:req.body.id},(err,data)=>{
        if(err){
            res.json({
                "err":1,
                "message":"Address Not Found!!"
            })
        }
        if(data=== null){
            res.json({
                "err":1,
                "message":"Address Not Found!!"
            })
        }
        else{
            // console.log(data.customer_address)
            res.json({
                "err":0,
                "address":data,
                "message":"Address Fetched!!"
            })
        }
    })
})

router.post('/address',(req,res)=>{
    console.log(req.body)
    customerModel.updateOne({_id:req.body.id},{$push:{customer_address:{address:req.body.address.address,city:req.body.address.city,pin:req.body.address.pin,state:req.body.address.state,country:req.body.address.country,address_id:Math.random(),customer_id:req.body.id,isDelivery:false}}},(err,result)=>{
        if(err){
            console.log(err);
            res.json({
                "err":1,
                "message":"Address Not Found!!"
            })
        }
        else{
            console.log(result);
            res.json({"err":0,"message":"Address  added!!"})
        }
    })
})

router.post('/deleteAddress',(req,res)=>{
    console.log(req.body)
    customerModel.updateOne({_id:req.body.id,address_id:req.body.add_id},{$pull:{customer_address:{address_id:req.body.add_id}}},(err,result)=>{
        if(err){
            console.log(err);
            res.json({
                "err":1,
                "message":"Address Not Found!!"
            })
        }
        else{
            console.log(result);
            res.json({
                "err":0,
                "message":"Address Deleted!!"
            })
        }
    })
})


router.post('/updateAddress',(req,res)=>{
    console.log(req.body)
    customerModel.updateOne({_id:req.body.customer_id,"customer_address.address_id":req.body.address_id},{"customer_address.$":req.body},(err,result)=>{
        if(err){
            console.log(err);
            res.json({
                "err":1,
                "message":"Address Not Found!!"
            })
        }
        else{
            console.log(result);
            res.json({"err":0,"message":"Address  updated!!"})
        }
    })
})
router.post('/updateshipadd',(req,res)=>{
    console.log(req.body)
    
    customerModel.updateMany({id:req.body.customer_id}, {$set:{
        "customer_address.$[].isDelivery":false} }
           ,(err,result)=>{
               if(err) throw err;
               else{
                   console.log(result)
               }
           })

    customerModel.updateOne({_id:req.body.customer_id,"customer_address.address_id":req.body.address_id},{"customer_address.$.address":req.body.address,"customer_address.$.city":req.body.city,"customer_address.$.pin":req.body.pin,"customer_address.$.state":req.body.state,"customer_address.$.address_id":req.body.address_id,"customer_address.$.customer_id":req.body.customer_id,"customer_address.$.isDelivery":true},(err,result)=>{
        if(err){
            console.log(err);
            res.json({
                "err":1,
                "message":"Address Not Found!!"
            })
        }
        else{
            console.log(result);
            customerModel.find({_id:req.body.customer_id},(err,data)=>{
                if(err){
                    res.json({
                        "err":1,
                        "message":"Address Not Found!!"
                    })
                }
                else{
                    console.log(data.customer_address);
                    res.json({"err":0,"message":"Address  updated!!","address":data.customer_address})
                }
            })
        }
    })
})

router.get('/category',(req,res)=>{
    categoryModel.find({},(err,data)=>{
        if(err){
            res.json({"success": false,
            "status_code": 200,
            "message": "Category Not Found",
          })
        }
        else{
            // console.log(data);
            res.json({"success": true,
            "status_code": 200,
            "message": "Category Available",
            "category": data
          })
        }
    })
})
router.get('/color',(req,res)=>{
    colorModel.find({},(err,data)=>{
        if(err){
            res.json({"success": false,
            "status_code": 200,
            "message": "Color Not Found",
          })
        }
        else{
            // console.log(data);
            res.json({"success": true,
            "status_code": 200,
            "message": "Colors Available",
            "color": data
          })
        }
    })
})
router.get('/commonProducts',(req,res)=>{
    productModel.find({},(err,data)=>{
        if(err){
            res.json({"success": false,
            "status_code": 200,
            "message": "Product Not Found",
          })
        }
        else{
            // console.log(data);
            res.json({"success": true,
            "status_code": 200,
            "message": "Product Available",
            "product_details": data
          })
        }
    })
})

router.post('/filterdata',(req,res)=>{
    productModel.find()
    .populate(["categoryId","colorId"])
    
    .then(product=>{
        res.send(product)
        // console.log(product)
    })
})
router.post('/filterCatCol',(req,res)=>{
    console.log(req.body);
    productModel.find({},(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            // console.log(data.map(d=>d.categoryId.toString()===req.body.cat_id.toString() && d.colorId.toString()===req.body.color_id.toString()));
            data=data.filter(d=>d.categoryId.toString()===req.body.cat_id.toString() && d.colorId.toString()===req.body.color_id.toString())
            console.log(data);
            res.json({"filtered_product":data})
        }
    })
    // productModel.find()
    // .populate(["categoryId","colorId"])
    
    // .then(product=>{
    //     // res.send(product)
    //     console.log(product)
    //     console.log(product.filter(pro=>pro.categoryId !==req.body.cat_id && pro.colorId !==req.body.color_id))
    //     // product=product.filter(pro=>pro.categoryId !==req.body.cat_id && pro.colorId !==req.body.color_id)
    //     // console.log(product);
    //     // res.json({"filtered_product":product})
    // })
})

router.post('/specificProduct',(req,res)=>{
    console.log(req.body);
    productModel.find({_id:req.body.id})
    .populate(["categoryId","colorId"])
    
    .then(product=>{
        res.json({"success": true,
        "status_code": 200,
        "message": "Product Available",
        "specific_product": product
      })
        console.log(product)
    })
})

router.post('/addtoCart',(req,res)=>{
    console.log(req.body);
    customerModel.updateOne({_id:req.body.id},{$set:{cart:req.body.cart}},(err,result)=>{
        if(err){
            console.log(err);
            res.json({
                "err":1,
                "message":"Product not found!!"
            })
        }
        else{
            console.log(result);
            customerModel.findOne({_id:req.body.id},(err,data)=>{
                console.log(data);
                if(err){
                    console.log(err)
                }
                else{

                    let payload = {
                        email:req.body.email,
                 first_name:data.first_name,
                 last_name:data.last_name,
                 phone_no:data.phone_no,
                 password:data.password,
                 id:data._id,
                 profile_pic:data.profile_pic,
                 cart:data.cart,
                 gender:data.gender,
                 dob:data.dob,
                 isSocialLogin:false
                    }
                    const token = jwt.sign(payload,jwtSecret,{expiresIn:360000})
                    res.json({
                        "err":0,
                        "message":"Added to Cart!!",
                        "token":token
                    })
                }
            })
            }
    })
    
})
router.post('/getcustomer',(req,res)=>{
    customerModel.find({_id:req.body.id},(err,data)=>{
        if(err){
            res.json({
                "err":1,
                "message":"Data not fteched!"
            })
        }
        else{
            res.json({
                "err":0,
                "message":"Data Fetched!",
                "customer_details":data[0]
            })
        }
    })
})

router.post('/placeOrder',(req,res)=>{
    console.log(req.body);
    let ins=new orderModel(req.body)
    ins.save((err)=>{
        if(err){
            console.log(err)
            res.json({
                "err":1,
                "message":"Something went wrong!"
            })
        }
        else{
            res.json({
                "err":0,
                "message":"Order placed Successfully"
            })
        }
    })
})

router.post('/getOrderDetails',(req,res)=>{
    console.log(req.body)
    orderModel.find({"ship_address.customer_id":req.body.id},(err,data)=>{
        if (err){
            console.log(err);
            res.json({
                "err":1,
                "message":"Orders not Found!",
            })
        }
        else{
            console.log(data);
            res.json({
                "err":0,
                "message":"Orders fetched!",
                "order_details":data
            })
        }
    })
})
router.post('/getOrder',(req,res)=>{
    console.log(req.body)
    orderModel.find({_id:req.body.id},(err,data)=>{
        if (err){
            console.log(err);
            res.json({
                "err":1,
                "message":"Order not Found!",
            })
        }
        else{
            console.log(data);
            res.json({
                "err":0,
                "message":"Order fetched!",
                "specificOrder":data
            })
        }
    })
})
router.put('/rateProduct',(req,res)=>{
    console.log(req.body);
    let total=0
    req.body.productRating.forEach(function(item, index) {
            total += item;
            
         
        });
        let avg=total/req.body.productRating.length
        console.log(avg)
        productModel.updateOne({_id:req.body.id},
            { $push: {RatingsArray:req.body.value}  },function(err,docs){
                if (err){
                    console.log(err)
                    res.json({
                        "err":1,
                        "message":"Rating Is not updated!!"
                    })
                }
                else{
                    console.log("Updated Docs : ", docs);
                    productModel.updateOne({_id:req.body.id},
                        {$set:{productRating:avg }}, function (err, docs) {
                  
                              if (err){
                                  console.log(err)
                                  res.json({
                                      "err":1,
                                      "message":"Rating Is not updated!!"
                                  })
                              }
                              else{
                                  console.log("Updated Docs : ", docs);
                                  res.json({"err":0,"message":"You Have Successfuly Updated Your Rating.",docs})
                              }
                         });
                }
            })
            
    // productModel.updateOne({_id:req.body.id},{productRating:req.body.value},(err,result)=>{
    //     if(err){
    //         console.log(err);
    //         res.json({
    //             "err":1,
    //             "message":"Something went wrong!",
    //         })
    //     }
    //     else{
    //         console.log(result);
    //         res.json({
    //             "err":0,
    //             "message":"Rating Updated!"
    //         })
    //     }
    // })
})
router.post('/sociallogin',(req,res)=>{
    console.log(req.body);

    customerModel.findOne({ email: req.body.email }, (err, data) => {
           
        if (err) {
            res.send("its error")
        }
        else if (data == null) {
            let ins=customerModel(req.body)
            ins.save((err)=>{
                if(err) throw err
                else{
                    console.log("User Added!")
                    // res.redirect('/login')
                    let payload = {
                        email:req.body.email,
                        first_name:req.body.first_name,
                        last_name:req.body.last_name,
                        gender:'',
                        phone_no:'',
                        password:'',
                        // id:req.body._id,
                        profile_pic:req.body.profile_pic,
                        cart:[],
                        dob:'',
                        isSocialLogin:true
                       }
                   const token = jwt.sign(payload,jwtSecret,{expiresIn:360000})
                   console.log({
                       err: 0, 
                       success: true,
                       status_code: 200,
                       message: `" ${req.body.first_name} ${req.body.last_name} You have logged In"`,
                       data: data,
                       token:token
                   })
                   res.json({
                       err: 0, 
                       success: true,
                       status_code: 200,
                       message:` Hey !${req.body.first_name} ${req.body.last_name} You have Logged In Successfully`,
                       data: data,
                       token:token
                   })  
                }
   
            })
            // res.json({ err: 1,message:'please write correct email id' })
        }
        else {
            let payload = {
                email:req.body.email,
                first_name:data.first_name,
                last_name:data.last_name,
                gender:data.gender,
                dob:data.dob,
                phone_no:data.phone_no,
                // password:data.password,
                id:data._id,
                profile_pic:req.body.profile_pic,
                cart:data.cart,
                isSocialLogin:data.isSocialLogin
               }
           const token = jwt.sign(payload,jwtSecret,{expiresIn:360000})
           console.log({
               err: 0, 
               success: true,
               status_code: 200,
               message: `" ${data.first_name} ${data.last_name} You have logged In"`,
               data: data,
               token:token
           })
           res.json({
               err: 0, 
               success: true,
               status_code: 200,
               message:` Hey !${data.first_name} ${data.last_name} You have Logged In Successfully`,
               data: data,
               token:token
           })  
        }
    })

    
    
})

router.post('/findsocialuser', (req, res) => {
    customerModel.findOne({ email: req.body.email }, (err, data) => {
        if (data == null) {
            res.json({ err: 1 })
        }
        else if (data != null) {
            console.log(data);
            let payload = {
                email:req.body.email,
                first_name:data.first_name,
                last_name:data.last_name,
                gender:data.gender,
                dob:data.dob,
                phone_no:data.phone_no,
                password:data.password,
                id:data._id,
                profile_pic:data.profile_pic,
                cart:data.cart,
                isSocialLogin:data.isSocialLogin
               }
            const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 })
            res.json({ err: 0, token: token })
        }
    })
})

module.exports=router;
