import React, { useEffect,useState } from 'react'
import {Navbar,Container,Nav,Form,FormControl, Button,Dropdown} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'
import jwt_decode from 'jwt-decode'
import { addCart, getCustomer } from '../config/Myservice'
import {useSelector,useDispatch} from 'react-redux'

export default function Header() {
  const navigate=useNavigate();
  const [flag,setFlag]=useState(false)
  const cartLen=useSelector(state=>state.cartLength)
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch({type:'cartLen'})
  })
 
  const logout=(e)=>{
    e.preventDefault();

    if(localStorage.getItem('_token') !==undefined){
      console.log('hello')
      let token=localStorage.getItem('_token');
      let decode=jwt_decode(token);
      console.log(decode);
      if(localStorage.getItem("cart")){
        addCart({id:decode.id,cartData:JSON.parse(localStorage.getItem('cart'))})
      }
      else{
        addCart({id:decode.id,cartData:decode.cartData})
      }
      // Swal.fire(
      //   'Logout!',
      //   'You have Successfully Logout from this device.',
      //   'success'
      // )
      localStorage.clear();
           setFlag(true)
      dispatch({type:'logout'})
        navigate('/login',{replace:true})
        // setTemp(prev=>!prev);
   
    }

}
    return (
        <>
           <Navbar  expand="lg" style={{padding:'5px',backgroundColor:'#669fb2',color:'#dd802c '}}>
  <Container className='conatiner' fluid style={{backgroundColor:'#dadfe1'}}>
    <Navbar.Brand href="/" style={{fontSize:'30px',fontWeight:'700',color:'#dd802c ',width:"20%"}}>Neo<span style={{color:'#3e2a20'}}>STORE</span></Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarScroll" />
    <Navbar.Collapse id="navbarScroll" >
      <Nav
        className="me-auto my-2 my-lg-0"
        style={{ maxHeight: '100px',width:'40%',margin:'auto' }}
        navbarScroll
      >
        <Nav.Link href="/" style={{fontWeight:'500',color:'#dd802c ',fontSize:'20px',width:'20%'}}>Home</Nav.Link>
        <Nav.Link href="/commonProducts" style={{fontWeight:'500',color:'#dd802c ',fontSize:'20px',marginLeft:'50px'}}>Products</Nav.Link>
        <Nav.Link href="/order" style={{fontWeight:'500',color:'#dd802c ',fontSize:'20px',marginLeft:'50px'}}>Orders</Nav.Link>
  

      </Nav>
      {/* <p style={{marginRight:'100px'}}></p> */}
       
        <Button variant="outline-light" style={{color:'#dd802c' }} onClick={()=>{navigate('/getCartData',{replace:true})}}><i className="fas fa-shopping-cart" ></i>Cart   <span ><sup className="top_header_cart_count">{cartLen}</sup></span></Button>
               
         

           <Dropdown >
  <Dropdown.Toggle variant="outline-light" id="dropdown-basic"  style={{height:'40px',width:'100px',marginLeft:'10px',color:'#dd802c'}}>
  <i className="fas fa-user-tie"></i>
  </Dropdown.Toggle>
  {localStorage.getItem('isLoggedIn')?
  <Dropdown.Menu>
    <Dropdown.Item href="/profile">My Account</Dropdown.Item>
    <Dropdown.Item href="/login" onClick={logout}>Logout</Dropdown.Item>
   
  </Dropdown.Menu>:
  <Dropdown.Menu>
    <Dropdown.Item href="/login">Login</Dropdown.Item>
    <Dropdown.Item href="/register">Register</Dropdown.Item>
   
  </Dropdown.Menu>
}
</Dropdown>
   
     
    
        {/* <Button variant="outline-success">Search</Button> */}
     
  
    </Navbar.Collapse>
  </Container>
</Navbar>
        </>
    )
}
