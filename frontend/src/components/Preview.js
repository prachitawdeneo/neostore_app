import { Button, Container, Table, TableBody, TableCell, TableHead, TableRow,Paper } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import ReactToPdf from 'react-to-pdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { specificOrder } from '../config/Myservice';


const options = {
    orientation: 'potrait',
    unit: 'in',
    format: 'A4'
}


export default function Preview() {
    const { state } = useLocation();
    console.log(state)
    const ref = React.createRef();
    const [order,setOrder]=useState()
    const [gst,setGST]=useState(0);
    const [orderTotal,setOrderTotal]=useState(0);
    const [subtotal,setSubTotal]=useState(0);

    useEffect(()=>{
        
            specificOrder({id:state.id})
            .then(res=>{
                // console.log(res.data)
                    if(res.data.err===1){
                        alert(res.data.message)
                    }
                    else if(res.data.err===0){
                        // console.log(res.data.specificOrder[0]);
                        let sum=0
                        setOrder(res.data.specificOrder[0])
                        res.data.specificOrder[0].products.forEach(pro=>{
                            sum +=pro.quantity*pro.price
                          })
                          setSubTotal(sum);
                          setGST(sum*5/100)
                          setOrderTotal(sum+(sum*5/100))
                    }       
            })
        
    },[])

    useEffect(()=>{
        console.log(order);
    },[order])


    return (
        <div   className=" p-3" >
        <div >
            <nav class="navbar">
                <div class="container-fluid">
                    <Link to="/order" style={{textDecoration:"none"}}><Button variant='contained'>Go Back</Button></Link>
                    <Button className=" d-flex justify-content-sm-end">
                        <ReactToPdf targetRef={ref} filename={`_invoice.pdf`} options={options} x={0} y={0} scale={0.6}>
                            {({ toPdf }) => (
                                <Button onClick={() => {
                                    // sendData();
                                    toPdf();
                                }} variant="contained">
                                    Save
                                </Button>
                            )}
                        </ReactToPdf>
                    </Button>

                </div>
            </nav>
            <div ref={ref} id='divToPrint' className=" p-3" style={{border:"2px solid grey",backgroundColor:'#669fb2'}}>

                <nav class="navbar  navbar-light bg-light" >
                    <div class="container-fluid " style={{ height: "100px" }}>
                        <img src="Neostore-logos.jpeg" alt="" height="100px" width=" 100px" opacity=" 2" class="d-inline-block align-text-top rounded-circle" style={{ marginLeft: "15px", marginTop: "5px" }} />
                        <h2 className='text-end' style={{color:'#dd802c'}}>INVOICE</h2>
                    </div>
                </nav>
                {order!==undefined && 
                <div>
                <div className='row m-0  bg-light'>
                    <div className='col text-start ml-4'>
                        <h6>From</h6>
                        <h5 style={{fontSize:'30px',fontWeight:'700',color:'#dd802c '}}>Neo<span style={{color:'#3e2a20'}}>STORE</span></h5>
                        <br />
                        <h6>To</h6>
                        <h6>{order.ship_address.address}</h6>
                        <h6>{order.ship_address.city}-{order.ship_address.pin}</h6>
                        <h6>{order.ship_address.state},{order.ship_address.country}</h6>
                    </div>
                    <div className='col text-right mr-4'>
                        <h6 style={{ textAlign: "right", marginRight: "15px" }}>Status</h6>
                        <h5 style={{ textAlign: "right", marginRight: "15px", color: "red", fontSize: "25px" }}>{order.ship_address.isDelivery ? "Out for Delivery" : ""}</h5>
                        <br />
                        <h6 style={{ textAlign: "right", marginRight: "15px" }}>Issued Date</h6>
                        <h5 style={{ textAlign: "right", marginRight: "15px" }}>{order.Date}</h5>
                        <h5 style={{ textAlign: "right", marginRight: "15px" }}>Amount</h5>
                        <h3 className='text-success' style={{ textAlign: "right", marginRight: "15px" }}><i class="fas fa-rupee-sign"></i> {order.total_cost}</h3>
                    </div>

                </div>
                <br />
                <div className=" mb-2">

                <Paper elevation={6}>
<Table  aria-label="simple table" className='table-responsive'>
<TableHead>
<TableRow>
<TableCell style={{width:'50%'}}>Product</TableCell>
<TableCell>Quantity</TableCell>
<TableCell>Price</TableCell>
<TableCell>Total</TableCell>
{/* <TableCell align="right"></TableCell> */}
</TableRow>
</TableHead>
<TableBody>
      {order.products!==undefined && order.products.map((pro,i)=>
<TableRow key={pro.id}

//   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
>
<TableCell component="th" scope="row">
 <div className='row'>
     <div className='col-md-4 col-sm-12'>
         <img src={pro.image} alt='product' height='80%' width='80%'
/>       </div>
     <div className='col-md-8 col-sm-12'>
         {pro.name}<br/>
         by {pro.producer}<br/>
         Status : {pro.stock >= pro.quantity ? <span className='text-success fw-bold'>In Stock</span> : <span className='text-danger fw-bold'>Out of Stock</span>}
     </div>
 </div>
</TableCell>
<TableCell ><span style={{marginRight:'5px',marginLeft:'5px'}}>{pro.quantity}</span></TableCell>
<TableCell >{pro.price}</TableCell>
<TableCell >{pro.quantity * pro.price}</TableCell>

{/* {console.log(subtotal=subtotal+(pro.quantity * pro.price))}  */}
{/* <TableCell className='btn text-danger' onClick={()=>deletePro(i)}><DeleteOutlinedIcon/></TableCell> */}
</TableRow>
)}
</TableBody>
</Table>
</Paper>

<div className='row justify-content-end'>
<Paper elevation={5}  style={{width:'500px',margin:'1%'}}>
                      <Container>
                      <h4>Review Order</h4>
                      <Table>
                          <TableHead>
                          <TableRow>
                              <TableCell>Subtotal</TableCell>
                              <TableCell className='fw-bold fs-6 text-end'>{subtotal}</TableCell>
                          </TableRow>
                          <TableRow>
                              <TableCell>GST(5%)</TableCell>
                              <TableCell className='fw-bold fs-6 text-end'>{gst}</TableCell>
                          </TableRow>
                          <TableRow>
                              <TableCell>Order Total</TableCell>
                              <TableCell className='fw-bolder fs-4 text-end'><i class="fas fa-rupee-sign"></i> {orderTotal}</TableCell>
                          </TableRow>
                      </TableHead>
                      </Table>
                      {/* <Button className='btn' style={{width:'100%',marginTop:'10%',marginBottom:'10%',backgroundColor:'orangered',color:'black'}} onClick={()=>{<Step2/>}}>Proceed To Pay</Button> */}
                      </Container>
                  </Paper>
                </div>
                <div className='row text-start'>
                <h4>Payment Method</h4>
                <h6>Paypal,Visa,MasterCard,etc</h6>
                <h6 className='mt-3'>Thankyou for bussiness.</h6>
                </div>
                <hr/>
                <div className="row mt-5">
    <div className="col copyright">
      <p className=""><small className="">© CopyRight 2022-Neosoft Technologies. All Rights Reserved. | Designed By: Prachi Tawde</small></p>
    </div>
  </div>
                </div>
                </div>
                } 
                    {/* 
                <Container className='d-flex flex-row-reverse'>
                   
                   
                    <Table style={{width:"500px"}}>
                        <TableHead>
                            
                                <TableCell colSpan={2}><h3>Invoice Summary</h3></TableCell>
                            
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Sub Total:</TableCell>
                                <TableCell className='text-end'>{state.amount}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>VAT(0%):</TableCell>
                                <TableCell className='text-end'>0</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total:</TableCell>
                                <TableCell className='text-end'>INR {state.amount}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Paid:</TableCell>
                                <TableCell className='text-end'>INR{state.user.status ?  state.amount : 0}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><h4>Balance:</h4></TableCell>
                                <TableCell className='text-end'><b>INR{state.user.status ? 0  :  state.amount}</b></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    
                </Container>
                    */}
            </div>


        </div> 
        </div>
    )
}
