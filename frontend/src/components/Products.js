import {  Container, Paper, Accordion,AccordionSummary,Typography, Button, AccordionDetails, Pagination, PaginationItem, Rating} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Card, Form, FormControl} from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react'
import jwt_decode from 'jwt-decode'
import Footer from './Footer'
import Header from './Header'
import { useNavigate } from 'react-router';
import { getProducts,getCategories,getColors,filterCatCol } from '../config/Myservice';
import usePagination from './usePagination';
import {useDispatch} from 'react-redux'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Products() {
    let [page, setPage] = useState(1);
    const dispatch=useDispatch()
    const PER_PAGE = 6;
    const[set,setstate]=useState({id:'',cartCount:0})
    const[flag,setFlag]=useState(0);
    const [temp,setTemp]=useState([])
    const[cart,setCart]=useState({cart:[]})
    const [expanded, setExpanded] = useState(false);
    const [categories,setCategories]=useState([])
    const [colors,setColors]=useState([])
    const [customer,setCustomer]=useState('');
    const [product,setProduct]=useState([])
    const [color_id,setColor_id]=useState()
    const [cat_id,setCat_id]=useState()
    const navigate=useNavigate()
    const searchInput=useRef(null)

    useEffect(async () => {
        getAllPro();
        getAllCategories()
        getAllColors()
        dispatch({type:"cartLen"})
        if (localStorage.getItem("_token") != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwt_decode(token);
            console.log(decode)
            setCustomer(decode)
            // setDeocde(decode.cart)
            setCart({cart:decode.cart})
            // localStorage.setItem("cart", JSON.stringify(decode.cart))
        }
     }, [])

    // useEffect(()=>{
    //     getAllPro()
    //     getAllCategories()
    //     getAllColors()
    //     dispatch({type:'cartLen'})
    //     // if(localStorage.getItem('_token')!==undefined){
    //     //     let token=localStorage.getItem('_token');
    //     //     let decode=jwt_decode(token);
    //     //     console.log(decode)
    //     //     setCustomer(decode)    
    //     // } 
    //     if (localStorage.getItem("_token") !== undefined) {
    //         let token = localStorage.getItem('_token');
    //         let decode = jwt_decode(token);
    //         console.log(decode)
    //         // setDeocde(decode.cartData)
    //         setCart({cartData:decode.cart})
    //         localStorage.setItem("cart", JSON.stringify(decode.cart))
    //     }
    // },[])
    
    function refreshPage() {
        window.location.reload(false);
      }
    
    const count = Math.ceil(product.length / PER_PAGE);
    const temp_count = Math.ceil(temp.length / PER_PAGE);
    const _DATA = usePagination(product, PER_PAGE);
    const _TEMPDATA = usePagination(temp, PER_PAGE);
    const handleChange = (e, p) => {
        setPage(p);
        flag ? _TEMPDATA.jump(p) :_DATA.jump(p);
        
      };

    const handleChangeAcc = (panel) => (event, isExpanded) => {
       setExpanded(isExpanded ? panel : false);
     };
    
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

    const getAllCategories=()=>{
        getCategories()
        .then(res=>{
            console.log(res.data);
            if(res.data.success){
                setCategories(res.data.category)
                console.log(categories);
            }
        })  
    }
    const getCategory=(id)=>{
        setFlag(1)
        setCat_id(id)
        console.log(cat_id)
        color_id!==undefined ? filterCatCol({cat_id:id,color_id:color_id})
        .then(res=>{
            console.log(res.data)
            setTemp(res.data.filtered_product)
            })
        :
        setTemp(product.filter(pro=>pro.categoryId=== id ))
        console.log(temp);
        
    }
    const getColor=(id)=>{
        setFlag(1)
        setColor_id(id)
        console.log(color_id)
        cat_id!==undefined ? filterCatCol({cat_id:cat_id,color_id:id})
        .then(res=>{
            console.log(res.data)
            setTemp(res.data.filtered_product)
            })
        :
        setTemp(product.filter(pro=>pro.colorId=== id ))
        console.log(temp);
        
    }
    const getAllColors=()=>{
        getColors()
        .then(res=>{
            console.log(res.data);
            if(res.data.success){
                setColors(res.data.color)
                console.log(colors);
            }
        })  
    }

    const IncreaseSorting=()=>{
        product.sort((a, b) => parseFloat(a.productCost) - parseFloat(b.productCost));
        console.log(product)
        const slice = product.slice(flag - 1, flag - 1 + PER_PAGE)
        setTemp(slice);

     }
     const DecreaseSorting=()=>{
        product.sort((a, b) => parseFloat(b.productCost) - parseFloat(a.productCost));
        console.log(product)
        const slice = product.slice(flag - 1, flag - 1 + PER_PAGE)
        setTemp(slice);

     }
     const RatingSorting=()=>{
        product.sort((a, b) => parseFloat(b.productRating) - parseFloat(a.productRating));
        console.log(product)
        const slice = product.slice(flag - 1, flag - 1 + PER_PAGE)
        setTemp(slice);

     }

     const searchProduct=()=>{
        let arr=[];
        getProducts()
        .then(res=>{
            console.log(res.data)
            arr=res.data.product_details;
            console.log(arr)
            let selectedproduct=arr.filter((value)=>{
              if(searchInput.current.value === ""){
                  return value
              }
              else if(value.productName.toLowerCase().includes(searchInput.current.value.toLowerCase()))
              {
                  return value
              }
            })
            console.log(selectedproduct);
            setProduct(selectedproduct)
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
                        toast.info("Product already Added!!", {
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
                        toast.info("Product already Added!!", {
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
            <Container className='p-0 mt-3 text-center'>
            {/* <h1>Product Component</h1> */}
            <div className='row'>
                    <div className='col-3'>
                    <Paper elevation={3}  className='mb-4'>
                        <Button style={{color:"black"}}  onClick={getAllPro}>All Products</Button>
                    </Paper>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChangeAcc('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{marginLeft:"20px"}}>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {categories.map(cat=>
                                <div>
                                <Button style={{width:'100%'}} className=' mb-1 ' onClick={()=>getCategory(cat._id)}>{cat.category_name}</Button>
                                 {/* <hr/>  */}
                                </div>)}
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChangeAcc('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography style={{marginLeft:"20px"}}>Color</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {colors.map(col=>
                                <div>
                                <Button style={{width:'100%'}} className=' mb-1 ' onClick={()=>getColor(col._id)}>{col.color_name}</Button>
                                 {/* <hr/>  */}
                                </div>)}
        </AccordionDetails>
      </Accordion>
                    
                    </div>
                    <div className='col-9'>
                        <div className='row'>
                            <div className='col-4'>
                            <Form >
                                <FormControl
                                    type="search"
                                        placeholder="Search"
                                        className="me-2"
                                    aria-label="Search"
                                    ref={searchInput}
                                    onChange={searchProduct}/>
                            </Form>
                            </div>
                            <div className='col text-end'>
                        <Button onClick={RatingSorting}><i class="btn text-warning  fas fa-star"></i></Button>
                        <Button onClick={IncreaseSorting}><i class="btn text-success fas fa-arrow-up"></i></Button>        
                        <Button onClick={DecreaseSorting}><i class="btn text-danger fas fa-arrow-down"></i></Button>        
                            </div>
                        </div>
                        <div className="row">
                            
                            {(flag ? _TEMPDATA.currentData() : _DATA.currentData()).map((pro,index)=>
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
                            </Paper>)}
                        </div>
                    </div>
            </div>
            <div className='d-flex justify-content-center mt-4'>
            <Pagination
                className='align-self-center'
                // style={{margin:"auto"}}
                count={flag? temp_count : count}
                size="large"
                page={page}
                // variant="outlined"
                // shape="rounded"
                onChange={handleChange}
                renderItem={(item) => (
                    <PaginationItem
                      components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                      {...item}
                    />
                  )}
            />
            </div>
            </Container>
            <Footer/>
        </div>
    )
}
