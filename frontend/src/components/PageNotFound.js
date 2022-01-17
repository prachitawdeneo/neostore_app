import React from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function PageNotFound() {
    const navigate=useNavigate()
    const notify = () => toast("Wow so easy!");
    return (
        <>
            <Container className='mt-2' style={{width:'100%'}}>
            {/* <div>
        <button onClick={notify}>Notify!</button>
        <ToastContainer />
      </div> */}
                <img src='./pagenotfound.gif' alt='Page Not Found' onClick={()=>{navigate('/',{replace:true})}} />
            </Container>
        </>
    )
}
