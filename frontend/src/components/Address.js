import {  Container, Paper, Accordion,AccordionSummary,Typography, Button, AccordionDetails} from '@mui/material'
import jwt_decode from 'jwt-decode'
import React,{useState,useEffect} from 'react'
import Footer from './Footer'
import Header from './Header'
import { AddAddress, delAdd, editAddress, getAddress } from '../config/Myservice'
import { Form,Row,Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
const paperStyle={height:'auto', width:'auto', margin:'30px auto',paddingTop:'20px',paddingBottom:'20px',backgroundColor:'#dadfe1',color:' #dd802c'}
const regForPin = RegExp(/^[1-9][0-9]{5}$/);
const regForAdd = RegExp(/^[A-Za-z0-9\s]{3,100}$/);

export default function Address() {
    const dispatch = useDispatch()
    const [customer,setCustomer]=useState({});
    const [expanded, setExpanded] = useState(false);
    const [index,setIndex]=useState();
    const [user,setUser]=useState();
    const [address,setAddress]=useState()
    const [disAdd,setDisAdd]=useState()
    const [flag,setFlag]=useState(-1)
    const [select,setSelect]=useState()
    const [Errors,SetError]=useState({
        address:'',
        pin:'',
        city:'',
        state:'',
        country:'',
        
    })
    useEffect(()=>{
        dispatch({type:"cartLen"})
        if(localStorage.getItem('_token')!==undefined){
            let token=localStorage.getItem('_token');
            let decode=jwt_decode(token);
            console.log(decode)
            setCustomer(decode)
            console.log(customer);
            getAddress({id:decode.id})
            .then(res=>{
                if(res.data.err===1){
                    alert(res.data.message)
                }
                else if(res.data.err===0){
                    // alert(res.data.message)
                    setDisAdd(res.data.address)
                    console.log(res.data.address)
                    console.log(disAdd)
                    getAddress()
                    setFlag(-1)
                }
            })
        } 
                
    },[])

    function refreshPage() {
        window.location.reload(false);
    }
    
    const handleChangeAcc = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handler=(e)=>{
        const {name,value}=e.target
        
        switch(name){
            case 'address':
            Errors.address= regForAdd.test(value)?'':' Address should be between 2 to 100 letters';
            break;
            case 'pin':
              Errors.pin= regForPin.test(value)?'':' Pin should be between 2 to 6 digits';
              break;
            case 'city':
              Errors.city= regForAdd.test(value)?'':'Enter valid City name';
              break;
            case 'state':
                  Errors.state= regForAdd.test(value)?'':'Enter valid State name';
              break;
            case 'country':
                  Errors.country= regForAdd.test(value)?'':'Enter valid Country name';
              break;
            default:
              break;
        }
        setSelect({Errors,[name]:value},()=>{
            console.log(Errors)
          })
        setAddress({...address,[name]:value})
        console.log(address)
    }

    const addAddress=()=>{
        console.log(address)
        AddAddress({"address":address,"id":customer.id})
        .then(res=>{
            console.log(res.data)
            if(res.data.err===1){
                alert(res.data.message)
            }
            else if(res.data.err===0){
                alert(res.data.message)
                // setAddress(res.data.address)
                setFlag(-1)
            }
            getAdd()
        })
    }
    const getAdd=()=>{
        customer!== undefined && getAddress({id:customer.id})
        .then(res=>{
            if(res.data.err===1){
                alert(res.data.message)
            }
            else if(res.data.err===0){
                // alert(res.data.message)
                setDisAdd(res.data.address)
                console.log(res.data.address)
                console.log(disAdd)
                getAddress()
                setFlag(-1)
            }
        })
    
    }

    const deleteAdd=(id)=>{
        delAdd({"add_id":id,"id":customer.id})
        .then(res=>{
            if(res.data.err===1){
                alert(res.data.message)
            }
            else if(res.data.err===0){
                alert(res.data.message)
                // setTemp(prev=>!prev)
                getAddress()
                setFlag(-1)
                refreshPage()
            }
        })
    }

    const editAdd=(i)=>{
        setFlag(0)
        setIndex(i)
        console.log(i);
        disAdd.map(cust=>{ 
            setUser(cust.customer_address[i])
            setAddress(cust.customer_address[i])
            console.log(address);
        });
    }
            
            
    const updateAdd=(id)=>{
        console.log(id);
        console.log(user)
       
        console.log(address);
        editAddress(address)
        .then(res=>{
            if(res.data.err===1){
                alert(res.data.message)
            }
            else if(res.data.err===0){
                alert(res.data.message)
                // setTemp(prev=>!prev)
                getAddress()
                setFlag(-1)
                refreshPage()
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
                    <div className='col-3'>
                    <Accordion style={{margin:'30px auto'}}>
                        <AccordionSummary aria-controls="panel1a-content">
                            <i className="fas fa-chevron-down mt-1 mr-4"></i>
                            <Typography style={{marginLeft:"20px"}}><Link to='/order' style={{textDecoration:"none",color:"black"}}>Order</Link></Typography>
                        </AccordionSummary>
                    </Accordion>
                        <hr/>
                    <Accordion style={{margin:'30px auto'}}>
                        <AccordionSummary aria-controls="panel1a-content">
                        <i className="fas fa-chevron-down mt-1 mr-4"></i>
                            <Typography style={{marginLeft:"20px"}}>Account</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='row'>
                                <Button className='col mb-3'><Link to='/profile' style={{textDecoration:"none"}}>Profile</Link></Button>
                                <hr/>
                                <Button classname='col'><Link to='/getCustAddress' style={{textDecoration:"none"}}>Adresses</Link></Button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    
                    </div>
                    <div className='col-9'>
                        <Paper elevation={5} style={paperStyle}>
                            {flag===-1 && <Container className='text-start'>
                                <div className='row'>
                                    <h2 className='col-9'>Addresses</h2>
                                    <Paper className='col-3  bg-light' elevation={3} style={{width:"auto"}}>
                                        <Button style={{color:"black",backgroundColor:'' ,margin:'0px'}} onClick={()=>{setFlag(1)}   }>Add Address</Button>
                                    </Paper>
                                </div>
                                    <hr/>
                                    <div style={{height:"400px"}}>
                                    {disAdd!==undefined && disAdd.map(cust=>
                                    <div key={disAdd._id}>
                                        {cust.customer_address.map((add,i)=><div key={add.adsress_id}>
                                    <Accordion expanded={expanded === i} onChange={handleChangeAcc(i)}>
                                    {/* <Paper  elevation={6} > */}
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                                id="panel1a-header" style={{backgroundColor:' #e8b877',color:'#3e2a20'}}>
                                             <div className='row' style={{width:"100%"}}>
                                                 
                                                    <Typography className='col-10' >{add.address}</Typography>
                                                    <Button className='col-2 btn text-white bg-danger' onClick={()=>deleteAdd(add.address_id)}><i class="fas fa-times" style={{fontSize:"15px"}} ></i></Button>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails style={{backgroundColor:' #e8b877'}}>
                                            <Typography className='col-10' >{add.city}-{add.pin}</Typography>
                                            <Typography className='col-10' >{add.country}</Typography>
                                            <button className='btn btn-warning mt-4' style={{width:"70px"}} onClick={()=>editAdd(i)}>Edit</button>
                                
                                        </AccordionDetails>
                                    {/* </Paper> */}
                                    </Accordion>
                                        <hr/>
                                        </div>)}
                                        </div>)}
                                    </div>
                                    
                                </Container>}
                            {flag===1 && <Container>
                                <h3 className='text-start'>Add New Address</h3>
                                <hr/>
                                <Form className='text-start'>
                                    <Form.Group className="mb-3" >
                                      {/* <Form.Label>Address</Form.Label> */}
                                      <Form.Control as='textarea' name="address" placeholder='Address' style={{width:"50%",height:"100px"}} onChange={handler} defaultValue={flag===0? disAdd.customer_address[index].address:''} />
                                      <Form.Text className="text-muted">Max 100 characters!
                                        </Form.Text><br/>
                                        {Errors.address.length>0 &&
                  <span style={{color:"red"}}>{Errors.address}</span>}
                                    </Form.Group>
                                    <Row className="mb-3">
                                      <Form.Group as={Col} >
                                        <Form.Label>Pin Code</Form.Label>
                                        <Form.Control name="pin" type='number' defaultValue={customer.dob} onChange={handler}/>
                                        {Errors.pin.length>0 &&
                  <span style={{color:"red"}}>{Errors.pin}</span>}
                                      </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                      <Form.Group as={Col} >
                                        <Form.Label>City</Form.Label>
                                        <Form.Control name="city" type='text' defaultValue={customer.dob} onChange={handler}/>
                                        {Errors.city.length>0 &&
                  <span style={{color:"red"}}>{Errors.city}</span>}
                                      </Form.Group>
                                      <Form.Group as={Col} >
                                        <Form.Label>State</Form.Label>
                                        <Form.Control name="state" type='text' defaultValue={customer.dob} onChange={handler}/>
                                        {Errors.state.length>0 &&
                  <span style={{color:"red"}}>{Errors.state}</span>}
                                      </Form.Group>
                                    </Row>
                                    <Form.Group>
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control name="country" type='text' defaultValue={customer.dob} onChange={handler}/>
                                        {Errors.country.length>0 &&
                  <span style={{color:"red"}}>{Errors.country}</span>}
                                    </Form.Group>
                                </Form>
                                <div className='mt-3 text-start'>
                                    <Button className='btn' style={{marginRight:"20px"}} variant='outlined' onClick={addAddress}> <i class="fas fa-save mr-2" style={{fontSize:"20px",marginRight:"5px"}}></i>Save</Button>    
                                    <Button className='btn' variant='outlined' onClick={getAdd}><i class="fas fa-times" style={{fontSize:"20px",marginRight:"5px"}} ></i> Cancel</Button>
                                </div>
                            </Container>}


                            {flag ===0 && <Container>
                            <h3 className='text-start'>Edit Address</h3>
                            <hr/>
                            <Form className='text-start'>
                                <Form.Group className="mb-3" >
                                  {/* <Form.Label>Address</Form.Label> */}
                                  <Form.Control as='textarea' name="address" placeholder='Address' style={{width:"50%",height:"100px"}} onChange={handler} defaultValue={user.address} />
                                  <Form.Text className="text-muted">Max 100 characters!
                                    </Form.Text><br/>
                                    {Errors.address.length>0 &&
              <span style={{color:"red"}}>{Errors.address}</span>}
                                </Form.Group>
                                <Row className="mb-3">
                                  <Form.Group as={Col} >
                                    <Form.Label>Pin Code</Form.Label>
                                    <Form.Control name="pin" type='number' defaultValue={user.pin} onChange={handler}/>
                                    {Errors.pin.length>0 &&
              <span style={{color:"red"}}>{Errors.pin}</span>}
                                  </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                  <Form.Group as={Col} >
                                    <Form.Label>City</Form.Label>
                                    <Form.Control name="city" type='text' defaultValue={user.city} onChange={handler}/>
                                    {Errors.city.length>0 &&
              <span style={{color:"red"}}>{Errors.city}</span>}
                                  </Form.Group>
                                  <Form.Group as={Col} >
                                    <Form.Label>State</Form.Label>
                                    <Form.Control name="state" type='text' defaultValue={user.state} onChange={handler}/>
                                    {Errors.state.length>0 &&
              <span style={{color:"red"}}>{Errors.state}</span>}
                                  </Form.Group>
                                </Row>
                                <Form.Group>
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control name="country" type='text' defaultValue={user.country} onChange={handler}/>
                                    {Errors.country.length>0 &&
              <span style={{color:"red"}}>{Errors.country}</span>}
                                </Form.Group>
                            </Form>
                            <div className='mt-3 text-start'>
                                <Button className='btn' style={{marginRight:"20px"}} variant='outlined' onClick={()=>updateAdd(user.address_id)}> <i class="fas fa-save mr-2" style={{fontSize:"20px",marginRight:"5px"}}></i>Update</Button>    
                                <Button className='btn' variant='outlined' onClick={getAdd}><i class="fas fa-times" style={{fontSize:"20px",marginRight:"5px"}} ></i> Cancel</Button>
                            </div>
                        </Container>}
                        </Paper>
                    </div>
                </div>
            </Container>
            <Footer/>
        </>
    )
}
