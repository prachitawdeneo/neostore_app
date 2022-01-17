import { Paper } from '@mui/material'
import React,{useState,useEffect} from 'react'
import { Form,Button, Container} from 'react-bootstrap'
import '../css/Login.css'
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { passReset, sendOTP } from '../config/Myservice';
import bcrypt from 'bcryptjs'
const paperStyle={height:'100vh', width:500, margin:'30px auto',paddingTop:'20px'}
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

export default function ForgetPassword() {
    const dispatch = useDispatch()
    const [pass, setChangePass] = useState({});
    const [eye, seteye] = useState(true);
    const [customer,setCustomer]=useState('')
    const [password, setpassword] = useState("password");
    const [type, settype] = useState(false);
    const [select,setSelect]=useState()
    const [Errors,SetError]=useState({
        email:'',
        password:'',
        con_password:''
    })
    useEffect(()=>{
       dispatch({type:"cartLen"})
//     if(localStorage.getItem('_token')!==undefined){
//         let token=localStorage.getItem('_token');
//         let decode=jwt_decode(token);
//         console.log(decode)
//         setCustomer(decode)
//     }
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

    const handleChange=(event)=>{
        const {name,value}=event.target;
        switch(name){
            case 'email':
                Errors.email= regForEmail.test(value)?'':'invalid email';
                break;
            case 'password':
                Errors.password= regForPass.test(value)?'':'Password must be between 6 to 16 characters and must contain one number and one special character';
                break;
            case 'con_password':
                Errors.con_password=regForPass.test(value)   ?'':'Password does not match!';
                break;
            default:
                break;
            
          }
          setSelect({Errors,[name]:value},()=>{
            console.log(Errors)
          })
          
        setChangePass({...pass,[name]:value})
        console.log(pass)
    }

    const sendMail=()=>{
        sendOTP({"email":pass.email})
        .then(res=>{
            console.log(res.data);
            if(res.data.err===1){
                alert(res.data.message)
            }
            else if(res.data.err===0){
                alert(res.data.message)
            }
        })
    }

    const submitReset=(event)=>{
        event.preventDefault()
        // alert("Hello")
        console.log(pass);
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(pass.password, salt);
        passReset({email:pass.email,password:hash,con_password:hash,otp:pass.otp})
        .then(res=>{
            console.log(res.data)
            if(res.data.err === 1){
                alert(res.data.message)
            }
            else if(res.data.err === 0){
                alert(res.data.message)
            }
        })
    }
    return (
        <>
             <Paper elevation={5} style={paperStyle}>
        <Container>
        <Form noValidate>
            <div className="text">
                <h3>Change Password</h3>   
            </div>
        <Form.Group className="input-text">
            <Form.Control type='text'  name="email" placeholder="Enter Email id" onChange={handleChange} required/>
            <i class="fas fa-envelope"></i>
            {/* <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye" }`}></i> */}
        </Form.Group>
        {Errors.email.length>0 &&
                  <span style={{color:"red"}}>{Errors.email}</span>}
        
        <div className="buttons">
                    <Button onClick={sendMail}  >Send Mail</Button>
        </div>

        
         <Form.Group className="input-text">
            <Form.Control type='number'  name="otp" placeholder="Enter Verification Code" onChange={handleChange} required/>
            {/* <i className="fa fa-lock"></i>
            <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye" }`}></i> */}
        </Form.Group>
        {/* {Errors.password.length>0 &&
                  <span style={{color:"red"}}>{Errors.password}</span>} */}

         <Form.Group className="input-text">
            <Form.Control type={password}  name="password" placeholder="Enter new password" onChange={handleChange} required/>
            <i className="fa fa-lock"></i>
            <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye" }`}></i>
        </Form.Group>
        {Errors.password.length>0 &&
                  <span style={{color:"red"}}>{Errors.password}</span>}
       

        <Form.Group className="input-text">
            <Form.Control type={password}  name="con_password" placeholder="Repeat password" onChange={handleChange} required/>
            <i className="fa fa-lock"></i>
            <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye" }`}></i>
        </Form.Group>              
        {Errors.con_password.length>0 &&
                  <span style={{color:"red"}}>{Errors.con_password}</span>}
        
           
        <div className="buttons">
                    <Button onClick={submitReset}  type='submit'>Reset Password</Button>
        </div>
        </Form>
        </Container>
            </Paper>
        </>
    )
}
