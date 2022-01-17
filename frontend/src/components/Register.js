import React,{useEffect, useState} from 'react'
import Footer from './Footer'
import Header from './Header'
import { Paper } from '@mui/material'
import { Form, Container, Button } from 'react-bootstrap';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import '../App.css'
import { addUser ,socialLogin} from '../config/Myservice';
import {useNavigate} from 'react-router'
import bcrypt from 'bcryptjs'
import { useDispatch } from 'react-redux';
import '../css/Login.css'
import SocialButton from "./SocialButton";
const regForName = RegExp(/^[A-Za-z]{3,10}$/);
const regForUName = RegExp(/^[A-Za-z]{2,12}$/);
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);
const RegForMobile=RegExp('^((\\+91-?)|0)?[0-9]{10}$')
const paperStyle={padding:20,height:'120vh', width:'80%', margin:'20px auto',backgroundColor:'#dadfe1',color:' #dd802c'}

export default function Register() {
    const dispatch = useDispatch()
    const [data, setData] = useState({});
    const [eye, seteye] = useState(true);
    const [password, setpassword] = useState("password");
    const [type, settype] = useState(false);
    const [select,setSelect]=useState()
    const navigate=useNavigate()
    const [Errors,SetError]=useState({
        first_name:'',
        last_name:'',
        email:'',
        password:'',
        phone_no:'',
        con_password:''
    })
    useEffect(()=>{

        dispatch({type:"cartLen"})
    },[])
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
    const handleRegisterData=(event)=>{
        const {name,value}=event.target;
        switch(name){
            case 'first_name':
              Errors.first_name= regForName.test(value)?'':' name should be between 2 to 10 letters';
              break;
              case 'last_name':
                Errors.last_name= regForName.test(value)?'':' last name should be between 2 to 10 letters';
                break;
              case 'phone_no':
                Errors.phone_no= RegForMobile.test(value)?'':'Phone Number should be valid';
           break;
         
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
          
        setData({...data,[name]:value})
        console.log(data)
    }

    const handleSocialLogin = (user) => {
        // setData({userData:user._profile})
        console.log(user) 
        socialLogin({email:user.profile.email,first_name:user.profile.firstName,last_name:user.profile.lastName,profile_pic:user.profile.profilePicURL,isSocialLogin:true})
            .then(res=>{
                if(res.data.err===1){
                    alert(res.data.message)
                }
                else if(res.data.err===0){
                    alert(res.data.message)
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

    const submitRegisterData = (e) => {
        e.preventDefault()
        // const saltRounds = 10;
        // localStorage.setItem('login_details',JSON.stringify(data))
        // const myPlaintextPassword = data.password;
        // const salt = bcrypt.genSaltSync(saltRounds);
        // const hash = bcrypt.hashSync(myPlaintextPassword, salt);
        // data.password = hash;
        // data.con_password = hash;
        // console.log(hash)
        console.log(data)
        addUser(data)
        .then(res=>{
            console.log(res.data)
            if(res.data.err === 0){
                alert(res.data.msg)
                navigate('/login',{replace:true})
            }
            else{
                alert("Enter Details!")
            }
            
        })
    }
    return (
        <div>
            <Header/>
            {/* <h1>Register</h1> */}
            {/* <Paper elevation={10} style={paperStyle }> */}
            <div className='centeredDiv row'>
            <SocialButton  provider="facebook"
      appId="960690884795692"
      onLoginSuccess={handleSocialLogin}
      onLoginFailure={handleSocialLoginFailure} className="my-2 me-5 py-2 col" style={{ width: "100%", backgroundColor: "#3b5998",color:'white' }}> <FacebookIcon style={{ fontSize: "45px" }} /> Login With FaceBook</SocialButton>
        <SocialButton  provider="google"
      appId="500500298722-n80vuro8isk3euqmns377q0n2q2u0bjl.apps.googleusercontent.com"
      onLoginSuccess={handleSocialLogin}
      onLoginFailure={handleSocialLoginFailure} className="my-2 me-5 py-2 bg-danger col" style={{ width: "100%",color:'white'}}> <GoogleIcon style={{ fontSize: "45px" }} /> Login With Google</SocialButton>

            </div>
            <Paper elevation={5} style={paperStyle }>
        <Container>
        <Form>
            <div className="text">
                <h3>Register</h3>   
            </div>
        <Form.Group className="input-text">
            <Form.Control type='text' name="first_name" placeholder="First Name" onChange={handleRegisterData} required/>
            <i class="fas fa-user fa-lock"></i>
            
        </Form.Group>
        {Errors.first_name.length>0 &&
                  <span style={{color:"red"}}>{Errors.first_name}</span>}
        

         <Form.Group className="input-text">
            <Form.Control type='text'   name="last_name" placeholder="Last Name" onChange={handleRegisterData} required/>
            <i class="fas fa-user fa-lock"></i>
        </Form.Group>
        {Errors.last_name.length>0 &&
                  <span style={{color:"red"}}>{Errors.last_name}</span>}


         <Form.Group className="input-text">
            <Form.Control type='text'   name="email" placeholder="Email" onChange={handleRegisterData} required/>
            <i class="fas fa-envelope"></i>
        </Form.Group>
        {Errors.email.length>0 &&
                  <span style={{color:"red"}}>{Errors.email}</span>}


         <Form.Group className="input-text">
            <Form.Control type={password}   name="password" placeholder="Password" onChange={handleRegisterData} required/>
            <i class="fas fa-lock"></i>
            <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye" }`}></i>
        </Form.Group>
        {Errors.password.length>0 &&
                  <span style={{color:"red"}}>{Errors.password}</span>}


         <Form.Group className="input-text">
            <Form.Control type={password}   name="con_password" placeholder="Confirm Password" onChange={handleRegisterData} required/>
            <i class="fas fa-lock"></i>
            <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye" }`}></i>
        </Form.Group>
        {Errors.con_password.length>0 &&
                  <span style={{color:"red"}}>{Errors.con_password}</span>}


         <Form.Group className="input-text">
            <Form.Control type='text'   name="phone_no" placeholder="Mobile no" onChange={handleRegisterData} required/>
            <i class="fas fa-phone"></i>
        </Form.Group>
        {Errors.phone_no.length>0 &&
                  <span style={{color:"red"}}>{Errors.phone_no}</span>}
       
<Form.Group className="input-text">
    <Form.Label>Gender</Form.Label>
       {['radio'].map((type) => (
    <div key={`inline-${type}`} className="mb-3">
      <Form.Check
        inline
        label="Female"
        name="gender"
        type={type}
        id={`inline-${type}-1`}
        value='Female'
      />
      <Form.Check
        inline
        label="Male"
        name="gender"
        type={type}
        id={`inline-${type}-2`}
        value='Male'
      />
      <Form.Check
        inline
        name='gender'
        label="Other"
        type={type}
        id={`inline-${type}-3`}
        value='Other'
      />
    </div>
  ))}
        </Form.Group>
           
        <div className="buttons">
                    <Button onClick={submitRegisterData} style={{backgroundColor:' #3e2a20', border:'1px solid  #3e2a20'}} type='submit'>Register</Button>
        </div>
        <span>Already Registered user?</span><a href="/login" style={{ marginLeft: "10px", color: "black" }}>Login here</a>
        </Form>
        </Container>
            </Paper>

           
            <Footer/>
        </div>
    )
}
