import React,{useEffect,useState} from 'react'
import Footer from './Footer'
import Header from './Header'
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { addCart, findSocialUser } from '../config/Myservice';
import { Carousel,Card } from 'react-bootstrap';
import {getProducts} from '../config/Myservice'; 
import {Button,Rating,Paper,Container} from '@mui/material'
import { useNavigate } from 'react-router';
import {  toast } from 'react-toastify';

function refreshPage() {
    window.location.reload(false);
  }

export default function Home() {
    const dispatch = useDispatch()
    const[flag,setFlag]=useState(0);
    const[set,setstate]=useState({id:'',cartCount:0})
    const [product,setProduct]=useState([])
    const navigate=useNavigate()
    useEffect(() => {
        dispatch({type:"cartLen"})
        getAllPro()

        if(localStorage.getItem("_token")){ 
          let token = localStorage.getItem('_token');
          let decode = jwt_decode(token);
          // console.log(decode.cart)

          if (decode.isSocialLogin) {
            // alert("hello")
              localStorage.removeItem("_token")
              findSocialUser({ email: decode.email }).then(res => localStorage.setItem("_token", res.data.token))
              dispatch({ type: "cartLen" })
              setTimeout(() => {
                dispatch({ type: "cartLen" })
                if (localStorage.getItem("cart") && localStorage.getItem("_token")) {
                  let cartDetails = JSON.parse(localStorage.getItem("cart"));
                  console.log(cartDetails)
                  let token = localStorage.getItem('_token');
                  let decode = jwt_decode(token);
                  console.log(decode.cart)
                  let arr = cartDetails.concat(decode.cart)
                  console.log(arr)
                  let jsonObject = arr.map(JSON.stringify);
                  console.log(jsonObject);
      
                  let uniqueSet = new Set(jsonObject);
                  let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                  console.log(uniqueArray)
                  dispatch({ type: "oldCart", payload: uniqueArray.length })
                  setTimeout(() => {
                    dispatch({ type: "cartLen" })
                  }, 100);
                  dispatch({ type: "cartLen" })
                  console.log(uniqueArray);
                  addCart({ id: decode.id, cart: uniqueArray }).then(res => {
                    localStorage.clear()
                    localStorage.setItem("_token", res.data)
                  })
                  dispatch({ type: "cartLen" })
                }
              }, 300);
      
            }
         
      // addCart({id:decode.id,cart:[]}).then(res=>{
      //     if(res.data.err===1){
      //         alert(res.data.message)
      //     }
      //     else if(res.data.err===0){
      //         // alert(res.data.message)
      //         // localStorage.setItem('cart',JSON.stringify(uniqueArray))
      //         localStorage.setItem("_token",res.data.token)
      //     }
      // })
  }
  else  if(localStorage.getItem("cart")){
        let cart=JSON.parse(localStorage.getItem("cart"));
        console.log(cart);
        if(localStorage.getItem("_token")){ 
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            console.log(decode.cart)
           
          

            let arr=cart.concat(decode.cart)
            console.log(arr)
            let jsonObject = arr.map(JSON.stringify);  
            console.log(jsonObject);
            let uniqueSet = new Set(jsonObject);
            let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
            console.log(uniqueArray.length)
            dispatch({type:"oldCart",payload:uniqueArray.length})
            console.log(uniqueArray);
            // addCart({id:decode.id,cart:uniqueArray}).then(res=>{
            //     if(res.data.err===1){
            //         alert(res.data.message)
            //     }
            //     else if(res.data.err===0){
            //         // alert(res.data.message)
            //         localStorage.removeItem('_token')
            //         localStorage.setItem('cart',JSON.stringify(uniqueArray))
            //         localStorage.setItem("_token",res.data.token)
            //     }
            // })
          }
    }
    else if(!localStorage.getItem("cart")){
        // localStorage.setItem('cart',[])
        if(localStorage.getItem("_token")){ 
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            // console.log(decode.cart)

            if (decode.isSocialLogin) {
              // alert("hello")
                localStorage.removeItem("_token")
                findSocialUser({ email: decode.email }).then(res => localStorage.setItem("_token", res.data.token))
                dispatch({ type: "cartLen" })
                setTimeout(() => {
                  dispatch({ type: "cartLen" })
                  if (localStorage.getItem("cart") && localStorage.getItem("_token")) {
                    let cartDetails = JSON.parse(localStorage.getItem("cart"));
                    console.log(cartDetails)
                    let token = localStorage.getItem('_token');
                    let decode = jwt_decode(token);
                    console.log(decode.cart)
                    let arr = cartDetails.concat(decode.cart)
                    console.log(arr)
                    let jsonObject = arr.map(JSON.stringify);
                    console.log(jsonObject);
        
                    let uniqueSet = new Set(jsonObject);
                    let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                    console.log(uniqueArray)
                    dispatch({ type: "oldCart", payload: uniqueArray.length })
                    setTimeout(() => {
                      dispatch({ type: "cartLen" })
                    }, 100);
                    dispatch({ type: "cartLen" })
                    console.log(uniqueArray);
                    addCart({ id: decode.id, cart: uniqueArray }).then(res => {
                      localStorage.clear()
                      localStorage.setItem("_token", res.data)
                    })
                    dispatch({ type: "cartLen" })
                  }
                }, 300);
        
              }
           
        // addCart({id:decode.id,cart:[]}).then(res=>{
        //     if(res.data.err===1){
        //         alert(res.data.message)
        //     }
        //     else if(res.data.err===0){
        //         // alert(res.data.message)
        //         // localStorage.setItem('cart',JSON.stringify(uniqueArray))
        //         localStorage.setItem("_token",res.data.token)
        //     }
        // })
    }
    }

    },[])

    const getAllPro=()=>{
        setFlag(0)
        getProducts()
        .then(res=>{
            console.log(res.data);
            if(res.data.success){
                setProduct(res.data.product_details)
                console.log(product);
            }
        })  
    }

    const specificProduct = (id) => {
        console.log(id);
        setstate({
            id: id
        })
        localStorage.setItem('specificProductId', id);
        navigate('/specificProduct',{replace:true})

    }

    const addToCart=(pro)=>{
      // alert(pro._id)
      if(!localStorage.getItem('_token') && !localStorage.getItem('cart')){
          let arr=[{id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1}]
          toast('Product Added!!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              })
          // alert('Product Added!!')
          arr.push()
          localStorage.setItem('cart',JSON.stringify(arr))
          dispatch({type:'addCart'})
          // refreshPage()
      }
      else if(!localStorage.getItem('_token') && localStorage.getItem('cart')){
          let cart=JSON.parse(localStorage.getItem('cart'))
              console.log(cart)
              if(cart.some(c=>c.id===pro._id)){
                      toast("Product already Added!!", {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          })
                      // alert("Product already Added!!")
                  }
                  else{
                      toast('Product Added!!', {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                      })
                      // alert('Product Added!!')
                      cart.push({id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1})
                      localStorage.setItem('cart',JSON.stringify(cart))
                      dispatch({type:'addCart'})
                      // refreshPage()
                  }
      }
      else if(localStorage.getItem('_token') && localStorage.getItem('cart')){
          let cart=JSON.parse(localStorage.getItem('cart'))
              console.log(cart.some(c=>c.id===pro._id))
                  if(cart.some(c=>c.id===pro._id)){
                      toast("Product already Added!!", {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          })
                      // alert("Product already Added!!")
                  }
                  else{
                      toast('Product Added!!', {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                      })
                      // alert('Product Added!!')
                      cart.push({id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1})
                      localStorage.setItem('cart',JSON.stringify(cart))
                      dispatch({type:'addCart'})
                      // refreshPage()
                  }
      }
      else if(localStorage.getItem('_token') && !localStorage.getItem('cart')){
          let arr=[{id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1}]
          toast('Product Added!!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
          })
          // alert('Product Added!!')
          arr.push()
          localStorage.setItem('cart',JSON.stringify(arr))
          dispatch({type:'addCart'})
          // refreshPage()
      }
  }


    return (
        <div>
            <Header/>
            
            <Carousel fade style={{width:'100%',height:'600px',marginTop:'2%'}}>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="https://cdn11.bigcommerce.com/s-fzhb7p3qqx/images/stencil/original/carousel/4/slider-2.png?c=1"
                    alt="First slide"
                  />
                  <Carousel.Caption style={{fontFamily:'sans-serif',backgroundColor:'burlywood',padding:'1%' }}>
                      <div style={{border:'2px solid white',padding:'1%'}}> 
                    <h3>Home Centre Diana 6-Seater Dining Table</h3>
                    <p>Engineered Wood Bed. Made from premium-quality engineered wood, it has undergone various tests to ensure safety and durability. It is elegantly designed, with smooth, curved edges and an earthy Walnut durance finish.</p>
                      </div>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 h-100"
                    src="https://cdn11.bigcommerce.com/s-txnccc4dcc/images/stencil/original/carousel/10/Slider-1.png?c=1"
                    alt="Second slide"
                  />

                  <Carousel.Caption style={{fontFamily:'sans-serif',backgroundColor:'#6F8FAF',padding:'1%' }}>
                      <div style={{border:'2px solid white',padding:'1%'}}> 
                    <h3>Adorn India Monteno Sofa Set</h3>
                    <p>The sofa is designed to look and feel like a well tailored suit mid century modern elements include sleek track arms take a seat on the slightly reclined frame and enjoy the comfort and lumbar support by the high density foam.</p>
                    </div>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="https://cdn11.bigcommerce.com/s-txnccc4dcc/images/stencil/original/carousel/13/Slider-4.png?c=1"
                    alt="Third slide"
                  />
                  <Carousel.Caption style={{fontFamily:'sans-serif',backgroundColor:'#F4BB44',padding:'1%' }}>
                      <div style={{border:'2px solid white',padding:'1%'}}> 
                    <h3>Solimo Tucana Wood Queen Bed</h3>
                    <p>Solimo Queen Bed has a modern, minimalistic design which makes it compatible with a wide range of interiors. </p>
                    </div>
                  </Carousel.Caption>

                </Carousel.Item>
            </Carousel>
            <h4>Popular Products</h4>
            <Container>
            <div className="row justify-content-center">
            {product.map(pro=>
                pro.productRating > 4 && 
                <Paper elevation={4} key={Math.random()} style={{ width: '18rem',height:'27rem' }} className="col-4 m-2">
                <Card  className="mt-2 mb-2" style={{height:'95%'}}>
                    <Card.Img variant="top" src={pro.productImage} height="200px" width="300px"  onClick={(id) => specificProduct(pro._id)}/>
                    <Card.Body className="text-center">
                        <Card.Title style={{height:'35%'}}>{pro.productName}</Card.Title>
                        <Card.Text  style={{height:'15%'}}>
                            Price : {pro.productCost} /-
                        </Card.Text>
                        <Button  style={{height:'20%' ,marginBottom:'4%'}} variant="contained" onClick={()=>addToCart(pro)} >Add To cart</Button>
                        <Rating  style={{height:'25%'}} name="read-only"  precision={0.5} readOnly value={pro.productRating}  />
                    </Card.Body>
                </Card>
                </Paper>
            )}
            </div>
            </Container>
            <Footer/>
        </div>
    )
}
