import { Container } from '@mui/material'
import React,{useEffect,useState} from 'react'
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router';

export default function MyAccount() {
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const [customer,setCustomer]=useState('');
    useEffect(()=>{
        dispatch({type:"cartLen"})
        if(localStorage.getItem('_token')!==undefined){
                  let token=localStorage.getItem('_token');
                  let decode=jwt_decode(token);
                  console.log(decode)
                  setCustomer(decode)
                //   setData(decode)
                
              }
            },[])
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
        {console.log(customer.profile_pic)}
        {
                  
                  customer!==undefined&&   
  <img src={customer.profile_pic} alt="userIcon" height="100px" style={{ borderRadius: "100%" }} />

    }
            {/* <img src={customer.profile_pic} alt='profile pic' height='200px' width='200px' className='rounded-circle'/> */}
                        <Container>
                        <p className='' style={{'fontWeight':'bold','fontSize':'20px',color:'#3e2a20'}}>{customer.first_name} {customer.last_name}</p>
                        <div>
                            <div className='p-1 mb-3' style={{backgroundColor:'#dadfe1'}}>
                            <button className='btn p-2 fw-bold' style={{'width':'100%',color:'#dd802c ',border:'1px solid #dd802c'}} name="order" onClick={handleClick}><i class="fas fa-shopping-basket " ></i> Order</button>
                            </div>
                            <div className='p-1 mb-3' style={{backgroundColor:'#dadfe1'}}>
                            <button className='btn p-2   fw-bold' style={{'width':'100%',backgroundColor:'#dadfe1 ',color:'#dd802c ',border:'1px solid #dd802c'}} name="profile" onClick={handleClick}><i class="fas fa-id-badge"></i> Profile</button>
                            </div>
                            <div className='p-1 mb-3' style={{backgroundColor:'#dadfe1'}}>
                            <button className='btn p-2  fw-bold' style={{'width':'100%',backgroundColor:'#dadfe1 ',color:'#dd802c ',border:'1px solid #dd802c'}} name="address" onClick={handleClick}><i class="fas fa-map-marker-alt"></i> Address</button>
                            </div>
                            <div className='p-1 mb-3' style={{backgroundColor:'#dadfe1'}}>
                            <button className='btn p-2  fw-bold' style={{'width':'100%',backgroundColor:'#dadfe1 ',color:'#dd802c ',border:'1px solid #dd802c'}} name="changePass" onClick={handleClick}><i class="fas fa-exchange-alt"></i> Change Password</button>
                            </div>
                            
                        </div>
                        </Container>
        </>
    )
}
