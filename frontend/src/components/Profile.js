import { Paper } from '@mui/material'
import React,{useEffect,useState} from 'react'
import { Button, Container, Form ,Col,Row } from 'react-bootstrap'
import Footer from './Footer'
import Header from './Header'
import jwt_decode from 'jwt-decode';
import ReorderIcon from '@mui/icons-material/Reorder';
import { useNavigate } from 'react-router-dom'
import { updatePro, updateProData } from '../config/Myservice'
import { useDispatch } from 'react-redux';
import MyAccount from './MyAccount'
const regForName = RegExp(/^[A-Za-z]{3,10}$/);
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const RegForMobile=RegExp('^((\\+91-?)|0)?[0-9]{10}$')
const paperStyle={height:'90vh', width:'auto', margin:'30px auto',paddingTop:'20px',backgroundColor:'#dadfe1',color:' #dd802c'}

function refreshPage() {
  window.location.reload(false);
}

export default function Profile() {
  const dispatch = useDispatch()
  const [data, setData] = useState({});
    const [customer,setCustomer]=useState('');
    const [flag,setFlag]=useState(0);
    const[photo,setPhoto]=useState({profile:null})
    const [select,setSelect]=useState()
    const [Errors,SetError]=useState({
      first_name:'',
      last_name:'',
      email:'',
      dob:'',
      phone_no:'',
      
    })
    const navigate=useNavigate()
    
    
    useEffect(()=>{
      dispatch({type:"cartLen"})
      if(localStorage.getItem('_token')!==undefined){
                let token=localStorage.getItem('_token');
                let decode=jwt_decode(token);
                console.log(decode)
                setCustomer(decode)
                setData(decode)
              
            }
          },[])
    
    
    const handleChange=(event)=>{
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
            default:
              break;
          
        }
        setSelect({Errors,[name]:value},()=>{
          console.log(Errors)
        })
        
      setData({...data,[name]:value})
      console.log(data)
    }
    const handlePic=(event)=>{
      console.log(event.target.files[0])
        setPhoto({profile:event.target.files[0],loaded:0})
        console.log(photo);
      
    }

    const editProfile=()=>{
        setFlag(1)
    }
    const updateProfile=(event)=>{
      event.preventDefault()
      // updatePro({"data":data,"file":formData})
      updateProData(data)
      .then(res=>{
        if(res.data.err===0) alert(res.data.message)
                    else alert(res.data.message)
      })
     
      
    }

    const updateProfilePic=(e)=>{
      e.preventDefault()
      console.log(photo)
      localStorage.removeItem('_token')
      const formData = new FormData();
      formData.append('file',photo.profile)
      formData.append('id',customer.id)
      
      console.log(formData);
      updatePro(formData)
      .then(res=>{
        localStorage.setItem('_token',res.data.token)
        if(res.data.err===1 ) alert(res.data.message)
        else if(res.data.err===0){
          alert(res.data.message)
          refreshPage()
        }
      })
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
    return (
        <>
        <Header/>
            <Container>
                <h2 className='text-start mt-2'>My Account</h2>
                <hr/>
                <div className='row'>
                    <div className='col-4 mt-5'>
                      {/* {data!==undefined&&   
  <img src={data.profile_pic} alt="userIcon" height="100px" style={{ borderRadius: "100%" }} />

    } */}
            {/* <img src={data.profile_pic} alt='profile pic' height='200px' width='200px' className='rounded-circle'/>
                        <Container>
                        <p className='text-danger' style={{'fontWeight':'bold','fontSize':'20px'}}>{customer.first_name} {customer.last_name}</p>
                        <div>
                            <button className='btn text-primary border-primary mb-3' style={{'width':'100%'}} name="order" onClick={handleClick}><i class="fas fa-shopping-basket " ></i> Order</button>
                            <button className='btn text-primary border-primary mb-3' style={{'width':'100%'}} name="profile" onClick={handleClick}><i class="fas fa-id-badge"></i> Profile</button>
                            <button className='btn text-primary border-primary mb-3' style={{'width':'100%'}} name="address" onClick={handleClick}><i class="fas fa-map-marker-alt"></i> Address</button>
                            <button className='btn text-primary border-primary mb-3' style={{'width':'100%'}} name="changePass" onClick={handleClick}><i class="fas fa-exchange-alt"></i> Change Password</button>
                            
                        </div>
                        </Container> */}
                        <MyAccount/>
                    </div>
                    <div className='col-8'>
                        <Paper elevation={5} style={paperStyle}>
                            {flag===0 && <Container >
                            <h3 className='text-start'>Profile</h3>
                            <hr/>
                            <table className='table table-borderless text-start table-responsive mt-5 mb-5' style={{color:' #dd802c '}}>
                                <tbody>
                                    <tr >
                                        <td className='col-4 '><b>First Name</b></td>
                                        <td>{customer.first_name}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Last Name</b></td>
                                        <td>{customer.last_name}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Gender</b></td>
                                        <td>{customer.gender}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Date of Birth</b></td>
                                        <td>{customer.dob}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Mobile Number</b></td>
                                        <td>{customer.phone_no}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Email</b></td>
                                        <td>{customer.email}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <hr/>

                            <div className='text-start justify-content-start'>
                            <button className=' btn  ' style={{color:' #dd802c ',border:'1px solid #dd802c'}} onClick={editProfile}><i class="fas fa-pen"></i> Edit</button>
                            </div>
                            </Container>}
                            
                            {flag===1 && 
                            <Container>
                                <h3 className='text-start'>Edit Profile</h3>
                                <hr/>
                                <Form className='text-start' >
                                  <Row className="mb-3">
                                    <Form.Group as={Col} >
                                      <Form.Label>First Name</Form.Label>
                                      <Form.Control type="text" name="first_name" placeholder="Enter first name" defaultValue={customer.first_name} onChange={handleChange}/>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                      <Form.Label>Last Name</Form.Label>
                                      <Form.Control type="text" name="last_name" placeholder="Enter last name" defaultValue={customer.last_name} onChange={handleChange}/>
                                    </Form.Group>
                                  </Row>

                                    <Form.Group className="mb-3" >
                                      <Form.Label>Gender</Form.Label>
                                      {['radio'].map((type) => (
                                      <div key={`inline-${type}`} className="mb-3">
                                        <Form.Check
                                          inline
                                          label="Male"
                                          name="gender"
                                          value="Male"
                                          type={type}
                                          id={`inline-${type}-1`}
                                          onChange={handleChange}/>
                                        <Form.Check
                                          inline
                                          label="Female"
                                          name="gender"
                                          value="Female"
                                          type={type}
                                          id={`inline-${type}-2`}
                                          onChange={handleChange}/>
                                        <Form.Check
                                          inline
                                          label="Others"
                                          name="gender"
                                          value="Others"
                                          type={type}
                                          id={`inline-${type}-3`}
                                          onChange={handleChange}/>
                                      </div>
                                    ))}
                                    </Form.Group>
                                      
                                      
                                    <Row className="mb-3">
                                      <Form.Group as={Col} >
                                        <Form.Label>DOB</Form.Label>
                                        <Form.Control name="dob" type='date' defaultValue={customer.dob} onChange={handleChange}/>
                                      </Form.Group>
                                      
                                      <Form.Group as={Col} >
                                        <Form.Label>Mobile no</Form.Label>
                                        <Form.Control type='text' name="phone_no" placeholder='Enter mobile no' defaultValue={customer.phone_no} onChange={handleChange}/>
                                      </Form.Group>
                                      
                                      <Form.Group as={Col} >
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type='text' name="email" placeholder='Enter mail'  defaultValue={customer.email} onChange={handleChange}/>
                                      </Form.Group>
                                    </Row>

                                    <Button style={{backgroundColor:' #3e2a20', border:'1px solid  #3e2a20'}} type="submit" onClick={updateProfile}>
                                      Update
                                    </Button>
                                </Form>
                                <Form encType="multipart/form-data">
                                    <Form.Group className="mb-3" >
                                      <Form.Label>Profile Picture</Form.Label>
                                      <Form.Control type='file' name="file"   onChange={handlePic} />
                                    </Form.Group>
                                    <Button style={{backgroundColor:' #3e2a20', border:'1px solid  #3e2a20'}} type="submit" onClick={updateProfilePic}>
                                      Update Profile Photo
                                    </Button> 
                                  </Form>
                            </Container>}
                        </Paper>

                    </div>

                </div>
            </Container>
        <Footer/>
        </>
    )
}
