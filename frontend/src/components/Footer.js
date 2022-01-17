import React, { useEffect } from 'react'
import '../css/footer.css'
import { Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux';

export default function Footer() {
  const dispatch = useDispatch()
  const subscribe=()=>{
    Swal.fire("Thank You!", "You Have subscribe!", "success");
  }
  useEffect(()=>{

    dispatch({type:"cartLen"})
  },[])
  return (
        <div>
             <div className="mt-5 pt-5 pb-2 footer" style={{backgroundColor:'#669fb2',color:'#dd802c'}}>
<div className=" p-3" style={{backgroundColor:'#dadfe1',marginLeft:"1%",marginRight:'1%'}}>
  <div className="row">
    <div className="col-lg-5 col-xs-12 about-company">
      <h3>About Company</h3>
      <p className="pr-4 ">Neosoft TechNology is here for your Easy and quick service for shopping.<br/>Contact Information:<br/>Email: contact@neosofttech.com<br/>Phone:01244858930<br/>MUMBAI INDIA  </p>
    
     </div>
    <div className="col-lg-3 col-xs-12 links">
      <h3 className="mt-lg-0 mt-sm-3">Information</h3>
        <ul className="m-0 p-0">
          <li>- <a href="/terms"  style={{color:'#dd802c'}}>Terms and Conditions</a></li>
         
        </ul>
        <p className="pr-5 ">Gaurentee and return policy<br/>Contact Us <br/>Privacy policy<br/><a href='https://www.google.com/maps/place/NeoSOFT+Technologies/@19.01803,72.828343,15z/data=!4m5!3m4!1s0x0:0x641bfb9a4619f398!8m2!3d19.0180041!4d72.8283' target='blank' style={{color:'#dd802c'}}>Locate Us</a> </p>
        
    </div>

    <div className="col-lg-4 col-xs-12" style={{color:'#dd802c'}}>
          <h5 className="text-uppercase mb-4">Sign up to our newsletter</h5>

          <div className="form-outline form-white mb-4">
          <p  className="pr-5">SignUp to get More Exclusive Offer for our Favourite Brand</p>
            <input type="email" id="form5Example2" className="form-control"  placeholder='Enter Email Address' required />
          
          </div>
          <Button variant="light" style={{color:'#dd802c',border: 'solid #dd802c'}} type="submit" onClick={subscribe}>Subscribe</Button>
        
        </div>
 
  </div>
  <div className="row mt-5">
    <div className="col copyright">
      <p className=""><small className="">© CopyRight 2022-Neosoft Technologies. All Rights Reserved. | Designed By: Prachi Tawde</small></p>
    </div>
  </div>
</div>
</div>

        </div>
    )
}
