import Footer from './Footer'
import Header from './Header'
import { useDispatch } from 'react-redux';
import { Container, Paper,Button } from '@mui/material';
import React,{useEffect,useState} from 'react'
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router';
import MyAccount from './MyAccount';
import { getOrder } from '../config/Myservice';
import {Card, CardImg } from 'react-bootstrap';
const paperStyle={height:'auto', width:'auto', margin:'30px auto',paddingTop:'20px'}

export default function Order() {
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const [customer,setCustomer]=useState('');
    const [orders,setOrders]=useState([]);
    const[set,setstate]=useState({id:'',cartCount:0})
    useEffect(()=>{
        dispatch({type:"cartLen"})
        if(localStorage.getItem('_token')){
                  let token=localStorage.getItem('_token');
                  let decode=jwt_decode(token);
                  console.log(decode)
                  setCustomer(decode)
                //   setData(decode)
                    getOrder({id:decode.id})
                    .then(res=>{
                        if(res.data.err===1){
                            alert(res.data.message)
                        }
                        else if(res.data.err===0){
                            setOrders(res.data.order_details)
                        }
                    })
            }
            },[])

            const specificProduct = (id) => {
                console.log(id);
                setstate({
                    id: id
                })
                localStorage.setItem('specificProductId', id);
                navigate('/specificProduct',{replace:true})
        
            }

    return (
        <>
            <Header/>
            {/* <h1>Order Component</h1> */}
            {localStorage.getItem('_token')?
            <Container>
                <h2 className='text-start mt-2'>My Account</h2>
                <hr/>
                <div className='row'>
                    <div className='col-4 mt-5'>
                      {console.log(customer.profile_pic)}
                        <MyAccount/>
                    </div>
                    <div className='col-8' >
                        <div style={{height:"480px","overflow-y": "auto",padding:'2%'}}>

                        {orders.map(ord=>
                        <Paper className='text-start p-2' elevation={6} style={paperStyle}>
                            <h4><span className='text-danger fw-bolder'>ORDER BY</span> :- {ord.card_name}</h4>
                            <p>Placed on: <span className='fw-bold'>{ord.Date}</span> / <span className='text-success fw-bold'> <i class="fas fa-rupee-sign"></i>{ord.total_cost}</span></p>
                            <hr/>
                            <div className='row'>
                            {ord.products.map(pro=>
                            <img className='col-3 m-3' onClick={(id) => specificProduct(pro.id)} src={pro.image} alt={pro.name} height='100px' width='80px'/>
                            )}
                            </div>
                            <hr/>
                            <Button onClick={()=>{navigate('/preview',{state:{id:ord._id}},{replace:true})}} variant='contained'>Download Invoice as PDF</Button>
                        </Paper>
                            )}
                            </div>

                    </div>

                </div>
            </Container>
            :
            <Container>
                {/* <h1>Hello</h1> */} 
                    <img src='./emptyorder1.png' alt='No Order found' style={{backgroundColor: '#669fb2 ',color:'#669fb2'}} />
                <h2 style={{fontFamily:'sans-serif',marginTop:'1%'}}>NO ORDERS YET</h2>
            </Container>}
            <Footer/>
        </      >
    )
}
