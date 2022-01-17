import React,{useEffect, useState} from 'react'
import Footer from './Footer'
import Header from './Header'
import { Form, Container, Button } from 'react-bootstrap';
import SocialButton from "./SocialButton";
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import {Paper} from '@mui/material'
import '../App.css'
import {  logUser, socialLogin } from '../config/Myservice';
import '../css/Login.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'
const paperStyle={height:'60vh', width:'auto', margin:'30px auto',paddingTop:'20px',backgroundColor:'#dadfe1',color:' #dd802c'}
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);

export default function Login() {
    const dispatch = useDispatch()
    const [loginData, setloginData] = useState({});
    const [eye, seteye] = useState(true);
    const [uid,setUid]=useState('')
    const [password, setpassword] = useState("password");
    const [type, settype] = useState(false);
    const [select,setSelect]=useState()
    const navigate=useNavigate()
    const [res,setRes]=useState()

    const [Errors,SetError]=useState({
        first_name:'',
        last_name:'',
        email:'',
        password:'',
        phone_no:'',
        con_password:''
    })
    const [data,setData]=useState({userData:[]});

    
    
      useEffect(()=>{
        dispatch({type:"cartLen"})
        //     if(localStorage.getItem('_token')!==undefined){
            //         let token=localStorage.getItem('_token');
            //         let decode=jwt_decode(token);
//         console.log(decode)
//         setUid(decode.uid)
//     }
  },[])

  const handleSocialLogin = (user) => {
    // setData({userData:user._profile})
    console.log(user) 
    socialLogin({email:user.profile.email,first_name:user.profile.firstName,last_name:user.profile.lastName,profile_pic:user.profile.profilePicURL,isSocialLogin:true})
        .then(res=>{
            if(res.data.err===1){
                Swal.fire({icon: 'error',title:res.data.message });
            }
            else if(res.data.err===0){
                Swal.fire({title:res.data.message,icon: "success"});
                // alert(res.data.message)
                localStorage.setItem('isLoggedIn',true);
                console.log(res.data.token)
                localStorage.setItem('_token',res.data.token);
                navigate('/',{replace:true})
            }
        })
};

    const handleSocialLoginFailure = (err) => {
    console.error(err);
    
        };  


    const Eye = () => {
        if (password == "password") {
            setpassword("text");
            seteye(false);
            settype(true);
        }
        else {
            setpassword("password");
            seteye(true);
            settype(false);
        }
    }
    const handleRegisterloginData=(event)=>{
        const {name,value}=event.target;
        switch(name){
            case 'email':
                Errors.email= regForEmail.test(value)?'':'invalid email';
                break;
            
            case 'password':
                Errors.password= regForPass.test(value)?'':'Password must be between 6 to 16 characters and must contain one number and one special character';
                break;
            default:
                break;
            
          }
          setSelect({Errors,[name]:value},()=>{
            console.log(Errors)
          })
          
        setloginData({...loginData,[name]:value})
        console.log(loginData)
    }

    const submitLogin = (e) => {
        e.preventDefault()
        console.log(loginData)
        logUser(loginData)
        .then(res=>{
            console.log(res.data.data)
            if(res.data.err === 0){
                Swal.fire({title:res.data.message,icon: "success"});
                let arr=res.data.data
                console.log(arr);
                localStorage.setItem('isLoggedIn',true);
                console.log(res.data.token)
                localStorage.setItem('_token',res.data.token);
                localStorage.setItem('customer_details',JSON.stringify(arr))
                navigate('/',{replace:true})
                
            }
            else  if(res.data.err === 1){
                Swal.fire({icon: 'error',title:res.data.message });
            }
            else  if(res.data === null){
                Swal.fire({icon: 'error',title:res.data.message });
            }
            
        })
    }
    return (
        <div>
            <Header/>
            

            <Container>
                <div className='row'>
                    <div className='col-md-6 col-sm-12 mt-4 pt-5 align-middle'>
                    <SocialButton  provider="facebook"
      appId="960690884795692"
      onLoginSuccess={handleSocialLogin}
      onLoginFailure={handleSocialLoginFailure} className="my-2 me-5 py-2 mt-5" style={{ width: "100%", backgroundColor: "#3b5998" ,color:'white'}}> <FacebookIcon style={{ fontSize: "45px" }} /> Login With FaceBook</SocialButton>
        <SocialButton  provider="google"
      appId="500500298722-n80vuro8isk3euqmns377q0n2q2u0bjl.apps.googleusercontent.com"
      onLoginSuccess={handleSocialLogin}
      onLoginFailure={handleSocialLoginFailure} className="my-2 me-5 py-2 bg-danger mt-5" style={{ width: "100%",color:'white'}}> <GoogleIcon style={{ fontSize: "45px" }} /> Login With Google</SocialButton>
                    </div>
                    <div className='col-md-6 col-sm-12'>
            <Paper elevation={5} style={paperStyle}>
        <Container>
        <Form>
            <div className="text">
                <h3>Login</h3>   
            </div>
        <Form.Group className="input-text">
            <Form.Control type='text'   name="email" placeholder="Email" onChange={handleRegisterloginData} required/>
            <i className="fas fa-envelope"></i>
        </Form.Group>
        {Errors.email.length>0 &&
                  <span style={{color:"red"}}>{Errors.email}</span>}
        

         <Form.Group className="input-text">
            <Form.Control type={password}   name="password" placeholder="Password" onChange={handleRegisterloginData} required/>
            <i className="fas fa-lock"></i>
            <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye" }`}></i>
        </Form.Group>
        {Errors.password.length>0 &&
                  <span style={{color:"red"}}>{Errors.password}</span>}
        
           
        <div className="buttons">
                    <Button onClick={submitLogin} style={{backgroundColor:' #3e2a20', border:'1px solid  #3e2a20'}} type='submit'>Login</Button>
        </div>
        </Form>
        </Container>
            </Paper>
            </div>
            </div>

                
            </Container>


            {/* <div className='row'>
            <div className=' col '>
                <Button className="my-2 me-5 mt-5 py-2" style={{ width: "100%", backgroundColor: "#3b5998" }}> <FacebookIcon style={{ fontSize: "45px" }} /> Login With FaceBook</Button>
                <Button className='my-2 py-2 bg-danger' style={{ width: "100%" }}> <GoogleIcon style={{ fontSize: "45px" }} />Login With Google</Button>

            </div>

            <Container className='my-5 border col' >
                <h1>Login to Neostore</h1>
                <Form>
                
                    {Errors.email.length>0 &&
                  <span style={{color:"red"}}>{Errors.email}</span>}
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Control type="email" placeholder="Email Address" className='py-2' name="email" onChange={handleRegisterloginData} />
                        <div className='placeIconEye'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                        </svg></div>
                    </Form.Group>
                    {Errors.password.length>0 &&
                  <span style={{color:"red"}}>{Errors.password}</span>}
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Control type={password} placeholder="Password" onChange={handleRegisterloginData} name="password" required  />
                        <div className='placeIconEye'>
                            <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </div>
                    </Form.Group>
                    
                    <Button className="text-black" style={{ width: "15%", backgroundColor: "grey", border: "none" }} onClick={submitLogin}>Login</Button><br/>
                    <span>Haven't Registered yet?</span><a href="/register" style={{ marginLeft: "10px", color: "black" }}>Register here</a> |  <a href="/forgotPassword" style={{ marginLeft: "10px", color: "black" }}>Forgot Password</a>
                </Form>
            </Container>
            </div> */}
            <Footer/>
        </div>
    )
}
