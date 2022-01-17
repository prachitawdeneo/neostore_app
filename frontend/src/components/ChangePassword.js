import { Paper } from '@mui/material'
import React,{useState,useEffect} from 'react'
import { Form,Button, Container} from 'react-bootstrap'
import '../css/Login.css'
import jwt_decode from 'jwt-decode';
import { passChange } from '../config/Myservice';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import MyAccount from './MyAccount';
import bcrypt from 'bcryptjs'
const paperStyle={height:'70vh', width:500, margin:'30px auto',paddingTop:'20px',backgroundColor:'#e8b877',color:' #dd802c'}
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/);

export default function ChangePassword() {
    const dispatch = useDispatch()
    const [pass, setChangePass] = useState({});
    const [eye, seteye] = useState(true);
    const [customer,setCustomer]=useState('')
    const [password, setpassword] = useState("password");
    const [type, settype] = useState(false);
    const [select,setSelect]=useState()
    const navigate=useNavigate()
    
    const [Errors,SetError]=useState({
        old_password:'',
        password:'',
        con_password:''
    })
       useEffect(()=>{
        dispatch({type:"cartLen"})
            if(localStorage.getItem('_token')!==undefined){
        let token=localStorage.getItem('_token');
        let decode=jwt_decode(token);
        console.log(decode)
        setCustomer(decode)
    }
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

const handleClick=(e)=>{
    const {name}=e.target
    switch(name){
        case 'order':
            navigate('/order',{replace:true});
            break;
            case 'profile':
                navigate('/profile',{replace:true});
                break;
                case 'address' :
                    navigate('/getCustAddress',{replace:true})
                    break;
                    case 'changePass':
                        navigate('/changePassword',{replace:true});
                        break;
                        default:
                            break;
                        }
                    }

                    const handleChange=(event)=>{
        const {name,value}=event.target;
        switch(name){
            case 'old_password':
                Errors.old_password= regForPass.test(value)?'':'In-correct old password';
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

    const submitChange=(event)=>{
        event.preventDefault()
        // alert("Hello")
        console.log(pass)
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(pass.password, salt);
        // setChangePass({...pass,password:hash,con_password:hash})
        // let arr={"pass":hash,"email":customer.email}
        console.log(hash);
        console.log(pass)
        passChange({email:customer.email,password:hash,con_password:hash,old_password:pass.old_password})
        .then(res=>{
            console.log(res.data)
            if(res.data.err === 1){
                alert(res.data.message)
            }
            else if(res.data.err === 0){
                alert(res.data.message)
                navigate('/profile',{replace:true})
            }
        })
    }

    return (
        <>
         <Header/>
            <Container>
                <h2 className='text-start mt-2'>My Account</h2>
                <hr/>
                <div className='row'>
                    <div className='col-4 mt-4'>
                        <MyAccount/>
                    </div>
                    <div className='col-8'>
            <Paper elevation={5} style={paperStyle}>
        <Container>
        <Form>
            <div className="text" style={{color:"#3e2a20"}}>
                <h3>Change Password</h3>   
            </div>
        <Form.Group className="input-text">
            <Form.Control type={password}  name="old_password" placeholder="Enter old password" onChange={handleChange} required/>
            <i className="fa fa-lock"></i>
            <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye" }`}></i>
        </Form.Group>
        {Errors.old_password.length>0 &&
                  <span style={{color:"red"}}>{Errors.old_password}</span>}
        

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
                    <Button onClick={submitChange} style={{backgroundColor:' #3e2a20', border:'1px solid  #3e2a20'}}  type='submit'>Change Password</Button>
        </div>
        </Form>
        </Container>
            </Paper>
            </div>
            </div>

                
            </Container>
        <Footer/>
        </>
    )
}
