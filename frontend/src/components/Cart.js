import React,{useState,useEffect} from 'react'
import {Box,Step,Stepper,StepLabel,Typography,Button} from '@mui/material'
import { Paper, Table,TableHead,TableCell,TableBody,TableRow, Container} from '@mui/material'
import { Card, Form,Row,Col } from 'react-bootstrap';
import { getCustomer, postOrder, updateShipAdd } from '../config/Myservice';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Footer from './Footer'
import Header from './Header'
import { addCart } from '../config/Myservice';
import jwt_decode from 'jwt-decode'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import '../css/Login.css'

const steps = ['Cart', 'Delivery Address'];
const regForName = RegExp(/^[A-Za-z]{3,10}$/);
const regForCVV=RegExp(/^[0-9]{1,3}$/);
const regForCNo=RegExp(/^[0-9]{16,16}$/);

function refreshPage() {
      window.location.reload(false);
    }

export default function Cart() {
  const navigate=useNavigate();
  const dispatch = useDispatch()
  const [activeStep, setActiveStep] = useState(0);
  const [cart,setCart]=useState()
  const [address,setAddress]=useState()
  const [customer,setCustomer]=useState('');
  const [gst,setGST]=useState(0);
  const [orderTotal,setOrderTotal]=useState(0);
  const [subtotal,setSubTotal]=useState(0);
  const [select,setSelect]=useState()
  const [order,setOrder]=useState()
  const [Errors,SetError]=useState({
    card_no:'',
    card_expiry:'',
    card_cvv:'',
    card_name:'',
    ship_add:'',
})
  useEffect(() => {
    dispatch({type:"cartLen"})
    if(!localStorage.getItem('_token') && localStorage.getItem('cart')){
      let cartArr=JSON.parse(localStorage.getItem('cart'))
      let sum=0
      setCart(cartArr);
      cartArr.forEach(pro=>{
        sum +=pro.quantity*pro.price
      })
      setSubTotal(sum);
      setGST(sum*5/100)
      setOrderTotal(sum+(sum*5/100))
    }
    else if(localStorage.getItem('_token') && localStorage.getItem('cart')){
      let token = localStorage.getItem('_token');
      let decode = jwt_decode(token);
      // console.log(decode)
      getCustomer({id:decode.id})
      .then(res=>{
        console.log(res.data.customer_details.customer_address)
        setAddress(res.data.customer_details.customer_address)
      })
      setCustomer(decode)
      let cartArr=JSON.parse(localStorage.getItem('cart'))
          // console.log(cart);
          setCart(cartArr)
          let sum=0
          cartArr.forEach(pro=>{
            sum +=pro.quantity*pro.price
          })
          setSubTotal(sum);
          setGST(sum*5/100)
          setOrderTotal(sum+(sum*5/100))
                addCart({cart:cartArr,id:decode.id})
                .then(res=>{
                    if(res.data.err===1){
                        console.log(res.data);
                    }
                    else if(res.data.err===0){
                        console.log(res.data);
                        // refreshPage()
                    }
                })
            
    }
    else if(localStorage.getItem('_token') && !localStorage.getItem('cart')){
      let token = localStorage.getItem('_token');
      let decode = jwt_decode(token);
      // console.log(decode)
      getCustomer({id:decode.id})
      .then(res=>{
        console.log(res.data.customer_details.customer_address)
        setAddress(res.data.customer_details.customer_address)
        setCart(res.data.customer_details.cart)
      })
      setCustomer(decode)
      localStorage.setItem('cart',JSON.stringify(decode.cart))
      let cartArr=JSON.parse(localStorage.getItem('cart'))
      let sum=0
          cartArr.forEach(pro=>{
            sum +=pro.quantity*pro.price
          })
          setSubTotal(sum);
          setGST(sum*5/100)
          setOrderTotal(sum+(sum*5/100))
                addCart({cart:cartArr,id:decode.id})
                .then(res=>{
                    if(res.data.err===1){
                        console.log(res.data);
                    }
                    else if(res.data.err===0){
                        console.log(res.data);
                        // refreshPage()
                    }
                })
    }


 },[])

  const handleNext = () => {
    if(!activeStep && !localStorage.getItem('_token')){
      alert("Please Login First!!")
      navigate('/login',{replace:true})
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const handleChange=(e)=>{
    const {name,value}=e.target

    switch(name){
      case 'card_no':
        Errors.card_no= regForCNo.test(value)?'':'Number should be of 16 digits';
        break;
      case 'card_expiry':
        Errors.card_expiry=value!== Date.now()?'':'Invalid expiry date!';
        break;
      case 'card_cvv':
        Errors.card_cvv= regForCVV.test(value)?'':'CVV should be of 3 digits';
        break;
      case 'card_name':
        Errors.first_name= regForName.test(value)?'':' name should be between 2 to 10 letters';
        break;
      // case 'ship_add':
      //   value=JSON.stringify(value)
      //   break;
      default:
        break;
      
    }
    setSelect({Errors,[name]:value},()=>{
      console.log(Errors)
    })
    
  setOrder({...order,[name]:value})
  console.log(order)

  }

  // const getStep=(active)=>{
  //     switch(active){
  //       case 0:
  //           return <Step1/>;
            
  //       case 1:
  //           return <Step2/>
            
  //       default:
  //           break;
  //     }
  // }

  const addQuant=(pro,i)=>{
    // alert(i)
    dispatch({type:'addCart'})
    if(pro.quantity <= 10){
        let arr=JSON.parse(localStorage.getItem('cart'))
        console.log(arr);
        arr[i].quantity=arr[i].quantity + 1
        console.log(arr);
        localStorage.setItem('cart',JSON.stringify(arr))
        refreshPage()
    }
}
const delQuant=(pro,i)=>{
    // alert(i)
    dispatch({type:'delCart'})
    if(pro.quantity >= 1){
        let arr=JSON.parse(localStorage.getItem('cart'))
        console.log(arr);
        arr[i].quantity=arr[i].quantity - 1
        console.log(arr);
        localStorage.setItem('cart',JSON.stringify(arr))
        refreshPage()
    }
}

const deletePro=(i)=>{
    // alert(i)
    let arr=JSON.parse(localStorage.getItem('cart'))
        console.log(arr);
        arr=arr.filter((ele,index)=>index!==i)
        console.log(arr.filter((ele,index)=>index!==i));
        localStorage.setItem('cart',JSON.stringify(arr))
        refreshPage()
}

const placeOrder=()=>{
  console.log(order)
  let id=address[order.ship_add]
  console.log(id)
  updateShipAdd(id)
  .then(res=>{console.log(res.data)
              setAddress(res.data.address)})
  console.log(address[order.ship_add]);
  postOrder({card_no:order.card_no,card_name:order.card_name,card_cvv:order.card_cvv,card_expiry:order.card_expiry,ship_address:address[order.ship_add],products:cart,total_cost:orderTotal})
  .then(res=>{
    if(res.data.err===1){
      alert(res.data.message)
    }
    else  if(res.data.err===0){
      alert(res.data.message)
      setActiveStep(steps.length - 1)
      handleNext()
      localStorage.removeItem('cart')
      setTimeout(()=>{

        navigate('/',{replace:true})
      },3000)
    }
  })
  
}
    return (
        <>
        <Header/>
        {/* {console.log((localStorage.getItem('cart')))} */}
        {localStorage.getItem('cart') && JSON.parse(localStorage.getItem('cart')).length>0  ?
        <Container>
            <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} className='mt-3 text-light' >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
        //   if (isStepOptional(index)) {
        //     labelProps.optional = (
        //       <Typography variant="caption">Optional</Typography>
        //     );
        //   }
          // if (isStepSkipped(index)) {
          //   stepProps.completed = false;
          // }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1,fontSize:'50px' }}>
            All steps completed - Thankyou for Shopping with Us!!!
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button variant='contained' onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div sx={{ mt: 2, mb: 1 }}>{activeStep ? 
            <div className='row justify-content-center'>
              {/* <Paper elevation={5}  style={{width:'80%',}} > */}
                {/* <Container  > */}
                  <Form className='text-start' onSubmit={placeOrder}>

                  <div className='row  container pt-5 pb-5'>
                    <div className='col-6 mt-5 mb-5 border border-light border-end-0  text-white' style={{backgroundColor:'#e8b877 '}}>
                      <img src='./checkout.png' alt='Checkout' height='100%' width='100%'/>
                      {/* <p style={{fontSize:'60px'}}>It was an Amazing Journey Shopping with you!!</p> */}
                    </div>
                    <div className='col-6 p-3   border' style={{backgroundColor:'#dadfe1  ',color:'#dd802c '}}>
              <h3 className='mb-2 text-center fw-bolder'style={{fontFamily:'sans-serif'}}>CHECKOUT</h3>
              <hr/>

  <Form.Group className="mb-3" controlId="card_no">
    <Form.Label>Credit Card</Form.Label>
    <Form.Control type='text' name='card_no' placeholder="Enter 16 digit card no" onChange={handleChange}/>
    <i class="far fa-credit-card checkout" ></i>
    {Errors.card_no.length>0 &&
                  <span style={{color:"red"}}>{Errors.card_no}</span>}
  </Form.Group>
              <Row className="mb-3">
    <Form.Group as={Col} controlId="card_expiry">
      <Form.Label>Expiration Date</Form.Label>
      <Form.Control name='card_expiry' type="date" placeholder="Enter expiry date" onChange={handleChange}/>
      {/* <i class="fas fa-calendar-day checkout"></i> */}
      {Errors.card_expiry.length>0 &&
                  <span style={{color:"red"}}>{Errors.card_expiry}</span>}
    </Form.Group>

    <Form.Group as={Col} controlId="card_cvv">
      <Form.Label>CVV</Form.Label>
      <Form.Control name='card_cvv' type="text" placeholder="CVV" onChange={handleChange}/>
      <i class="fas fa-lock checkout"></i>
      {Errors.card_cvv.length>0 &&
                  <span style={{color:"red"}}>{Errors.card_cvv}</span>}
    </Form.Group>
  </Row>

  <Form.Group className="mb-3" controlId="card_name">
    <Form.Label>Card Holder name</Form.Label>
    <Form.Control name='card_name' type='text' placeholder="Enter name" onChange={handleChange}/>
    <i class="fas fa-user checkout"></i>
    {Errors.card_name.length>0 &&
                  <span style={{color:"red"}}>{Errors.card_name}</span>}
  </Form.Group>

              <Form.Group>
                <Form.Label>Select Shipping Address</Form.Label>
              <Form.Select name='ship_add'  aria-label="Select Delivery Address" onMouseOver={handleChange} onChange={handleChange}>
              {address!==undefined && address.map((add,i)=>
                <option defaultValue={i} value={i}>&nbsp;&nbsp;&nbsp;{add.address}, {add.city}-{add.pin}, {add.state}, {add.country}</option>
                )}
              </Form.Select>
                <i class="fas fa-map-marker-alt checkout_add"></i>
              </Form.Group>
              <Button className=' mt-2'  variant='contained' style={{width:'100%',backgroundColor:'#3e2a20'}} onClick={placeOrder}>Pay &nbsp;&nbsp; <i class="fas fa-rupee-sign"></i>  {orderTotal}</Button>
                    </div>
                  </div>
                  </Form> 
               
                {/* </Container> */}
              {/* </Paper> */}
           </div>
          : 
          <Container>
          {/* <h1>Step 1</h1> */}
          <div className='row mt-4'>
              <div className='col-md-8 col-sm-12 mb-3'>
                  <Container>
                  </Container>
<Paper elevation={6}>
<Table  aria-label="simple table" className='table-responsive'>
<TableHead>
<TableRow>
<TableCell>Product</TableCell>
<TableCell align="right">Quantity</TableCell>
<TableCell align="right">Price</TableCell>
<TableCell align="right">Total</TableCell>
<TableCell align="right"></TableCell>
</TableRow>
</TableHead>
<TableBody>
      {cart!==undefined && cart.map((pro,i)=>
<TableRow key={pro.id}

//   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
>
<TableCell component="th" scope="row">
 <div className='row'>
     <div className='col-md-4 col-sm-12'>
         <img src={pro.image} alt='product' height='100%' width='100%'
/>       </div>
     <div className='col-md-8 col-sm-12'>
         {pro.name}<br/>
         by {pro.producer}<br/>
         Status : {pro.stock >= pro.quantity ? <span className='text-success fw-bold'>In Stock</span> : <span className='text-danger fw-bold'>Out of Stock</span>}
     </div>
 </div>
</TableCell>
<TableCell align="center" style={{padding:'5px'}}><span className='text-danger btn' style={{padding:'0px'}} onClick={()=>delQuant(pro,i)}><RemoveCircleIcon /></span><span style={{marginRight:'5px',marginLeft:'5px'}}>{pro.quantity}</span><span className='text-danger btn' style={{padding:'0px'}} onClick={()=>addQuant(pro,i)}><AddCircleIcon/></span></TableCell>
<TableCell >{pro.price}</TableCell>
<TableCell >{pro.quantity * pro.price}</TableCell>

{/* {console.log(subtotal=subtotal+(pro.quantity * pro.price))}  */}
<TableCell className='btn text-danger' onClick={()=>deletePro(i)}><DeleteOutlinedIcon/></TableCell>
</TableRow>
)}
</TableBody>
</Table>
</Paper>
              </div>
              <div className='col-md-4 col-sm-10'>
                  <Paper elevation={5}>
                      <Container>
                      <h4>Review Order</h4>
                      <Table className='table table-responsive'>
                          <TableHead>
                          <TableRow>
                              <TableCell>Subtotal</TableCell>
                              <TableCell className='fw-bold fs-6 text-end'>{subtotal}</TableCell>
                          </TableRow>
                          <TableRow>
                              <TableCell>GST(5%)</TableCell>
                              <TableCell className='fw-bold fs-6 text-end'>{gst}</TableCell>
                          </TableRow>
                          <TableRow>
                              <TableCell>Order Total</TableCell>
                              <TableCell className='fw-bolder fs-4 text-end'><i class="fas fa-rupee-sign"></i> {orderTotal}</TableCell>
                          </TableRow>
                      </TableHead>
                      </Table>
                      {/* <Button className='btn' style={{width:'100%',marginTop:'10%',marginBottom:'10%',backgroundColor:'orangered',color:'black'}} onClick={()=>{<Step2/>}}>Proceed To Pay</Button> */}
                      </Container>
                  </Paper>
              </div>
          </div>
          </Container>
          }</div>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              variant='contained'
              style={{backgroundColor:' #3e2a20', border:'1px solid  #3e2a20',color:'white'}}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )} */}

            <Button onClick={handleNext} variant='contained' style={{backgroundColor:' #3e2a20', border:'1px solid  #3e2a20'}}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Proceed To Pay'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
      </Container>
      :
      <Container>
      <div>
        <img src='./emptycart.png' alt='Cart is Empty!'/>
      </div>
        <button className='btn' onClick={()=>{navigate('/commonProducts',{replace:true})}} style={{backgroundColor:'#e8b877 ',border:'1px solid black'}}>Continue Shopping</button>
      </Container>}
        <Footer/>
        </>
    )
}
