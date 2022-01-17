import { Container, Paper,Box,Tabs,Tab, Typography, Rating,Avatar,Button} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getSpecificProduct, ratePro } from '../config/Myservice'
import Footer from './Footer'
import Header from './Header'
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {Modal} from 'react-bootstrap'
import StarIcon from '@mui/icons-material/Star';
import {WhatsappShareButton,WhatsappIcon,PinterestShareButton,FacebookMessengerShareButton,InstapaperShareButton,FacebookIcon,EmailShareButton,EmailIcon,TwitterShareButton,TwitterIcon} from 'react-share'

const labels = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent',
};


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
          <Box sx={{ pt: 3,pb:3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function refreshPage() {
    window.location.reload(false);
  }

  function MyVerticallyCenteredModal(props) {
    const [rating, setRating] = React.useState(2);
    const [hover, setHover] = React.useState(-1);

    const rateProduct=()=>{
      if(localStorage.getItem('specificProductId')!==undefined){
        let id=localStorage.getItem('specificProductId')
        console.log(id)
        ratePro({value:rating,id:id})
        .then(res=>{
          console.log(res.data);
          props.onHide()
          refreshPage()
        })
      }
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Rate Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Rating
          size="large"
          className='col-5 pt-1'
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit"/>}
        />
        {rating !== null && (
          <Box className='col-7 fs-4'>{labels[hover !== -1 ? hover : rating]}</Box>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-success p-5 pt-2 pb-2' onClick={rateProduct}>Submit</button>
          <button className='btn btn-danger p-5 pt-2 pb-2' onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }
 
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  export default function SpecificProduct() {
    const dispatch = useDispatch()
    const [specific_Product,setSpecificProduct]=useState([])
    const [flag,setFlag]=useState(0)
    const [index,setIndex]=useState(0)
    const [value, setValue] =useState(0);
    const [modalShow, setModalShow] = React.useState(false);
    const [rating, setRating] = React.useState(2);
    const [hover, setHover] = React.useState(-1);
    const url="http://localhost:3000/specificProduct";
    
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    
    useEffect(()=>{
      dispatch({type:"cartLen"})
        if(localStorage.getItem('specificProductId')!==undefined){
        let id=localStorage.getItem('specificProductId')
        console.log(id);
        getSpecificProduct({id:id})
        .then(res=>{
            if(res.data.success){
                console.log(res.data);
                setSpecificProduct(res.data.specific_product)
                // specificProduct.current=res.data.specificProduct
            }
        })
    }
    
    },[])

    useEffect(()=>{
        console.log(specific_Product);
    },[specific_Product])

    const changePhoto=(i)=>{
        // alert(i)
        setFlag(1)
        setIndex(i)
        
    }

    const addToCart=(pro)=>{
      // alert(pro._id)
      if(!localStorage.getItem('_token') && !localStorage.getItem('cart')){
          let arr=[{id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1}]
          alert('Product Added!!')
          arr.push()
          localStorage.setItem('cart',JSON.stringify(arr))
          refreshPage()
      }
      else if(!localStorage.getItem('_token') && localStorage.getItem('cart')){
          let cart=JSON.parse(localStorage.getItem('cart'))
              console.log(cart)
              if(cart.some(c=>c.id===pro._id)){
                      alert("Product already Added!!")
                  }
                  else{
                      
                      alert('Product Added!!')
                      cart.push({id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1})
                      localStorage.setItem('cart',JSON.stringify(cart))
                      refreshPage()
                  }
      }
      else if(localStorage.getItem('_token') && localStorage.getItem('cart')){
          let cart=JSON.parse(localStorage.getItem('cart'))
              console.log(cart.some(c=>c.id===pro._id))
                  if(cart.some(c=>c.id===pro._id)){
                      alert("Product already Added!!")
                  }
                  else{
                      
                      alert('Product Added!!')
                      cart.push({id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1})
                      localStorage.setItem('cart',JSON.stringify(cart))
                      refreshPage()
                  }
      }
      else if(localStorage.getItem('_token') && !localStorage.getItem('cart')){
          let arr=[{id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1}]
          alert('Product Added!!')
          arr.push()
          localStorage.setItem('cart',JSON.stringify(arr))
          refreshPage()
      }
  //     if(localStorage.getItem('_token')!==undefined){
  //         if(localStorage.getItem('cart') !== null)
  //         {
  //             let cart=JSON.parse(localStorage.getItem('cart'))
  //             console.log(cart.some(c=>c.id===pro._id))
  //                 if(cart.some(c=>c.id===pro._id)){
  //                     alert("Product already Added!!")
  //                 }
  //                 else{
                      
  //                     alert('Product Added!!')
  //                     cart.push({id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1})
  //                     localStorage.setItem('cart',JSON.stringify(cart))
  //                     refreshPage()
  //                 }
              
  //         }  
  //    else{
  //     let arr=[{id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1}]
  //     alert('Product Added!!')
  //      arr.push()
  //      localStorage.setItem('cart',JSON.stringify(arr))
  //      refreshPage()
  //        } 
  //     }
  //     else{
  //         if(localStorage.getItem('cart') !== null)
  //         {
  //             let cart=JSON.parse(localStorage.getItem('cart'))
  //             console.log(cart)
  //                 if(cart.includes(pro._id)){
  //                     alert("Product already Added!!")
  //                 }
  //                 else{
                      
  //                     alert('Product Added!!')
  //                     cart.push({id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1})
  //                     localStorage.setItem('cart',JSON.stringify(cart))
  //                     refreshPage()
  //                 }
              
  //         }  
  //    else{
  //     let arr=[{id:pro._id,image:pro.productImage,name:pro.productName,price:pro.productCost,producer:pro.productProducer,stock:pro.productStock,quantity:1}]
  //     alert('Product Added!!')
  //      arr.push()
  //      localStorage.setItem('cart',JSON.stringify(arr))
  //      refreshPage()
  //        } 
  //     }
  }

  const rateProduct=()=>{
    if(localStorage.getItem('specificProductId')!==undefined){
      let id=localStorage.getItem('specificProductId')
      console.log(id)
      console.log(specific_Product[0])
      ratePro({value:rating,id:id,productRating:specific_Product[0].RatingsArray})
      .then(res=>{
        console.log(res.data);
        setModalShow(false)
        refreshPage()
      })
    }
  }

    return (
        <>
        <Header/>
            <Container>
                {specific_Product.map(pro=>
                <Paper key={pro._id} elevation={5} style={{marginTop:'4%'}}>
                <div className='row '> 
                    <div className='col-6'>
                       <Container>
                            <img src={flag ? pro.subImages[index] :pro.productImage} className='pt-5 pb-5' height='400px' width='90%' alt='Product'/>
                            
                        </Container>
                        <div className='row p-2'>
                            {pro.subImages.map((sub,index)=>
                            <img key={Math.random()} className={sub.length === 3?'col-4 p-3':'col-3 p-3'} src={sub} height='130px' width='100px' alt='Product' onClick={()=>changePhoto(index)}/>
                                )}                              
                        </div>
                    </div>
                    <div className='col-6'>
                        <Container  className='pt-5 pb-5 text-start'>
                            <h2>{pro.productName}</h2>
                            <Rating name="half-rating-read"  precision={0.5} readOnly value={pro.productRating}  />
                            <hr/>
                            <h6>Price:  <span className='text-success fw-bold' tyle={{fontSize:'20px'}}><i class="fas fa-rupee-sign"></i> {pro.productCost}</span></h6>
                            <h6 className='row'><p className='col-1'>Color:</p> <p className=' col-11 rounded border pt-1 text-start'style={{height:'20px',width:'40px',backgroundColor:`${pro.colorId.color_name}`,marginLeft:'2rem'}} ></p></h6>
                            <h4>Share <i class="fas fa-share-alt btn fs-4"></i></h4>
                            <div className='row container justify-content-center mt-5'>
                            <FacebookMessengerShareButton className='col' 
                              url={url}  appId="598247578289958"
                              quote={'Welcome to Neostore, Please find the below link to get exciting offer upto 50% and check this product'+ pro.productName+ "at Rs. "+ pro.productCost }><Avatar className='m-2' sx={{bgcolor:'#3b5998'}}><i class="fab fa-facebook btn" style={{color:'white'}}></i></Avatar>
                            </FacebookMessengerShareButton>
                            <EmailShareButton   className='col'
                               url={url}
                                subject={'Neostore Offeres'}
                                 body={'Welcome to Neostore, Please find the below link to get exciting offer upto 50% and check this product'+ pro.productName+ "at Rs. "+ pro.productCost }><Avatar className='m-2' sx={{bgcolor:'#DB4437'}}><i class="  fab fa-google btn" style={{color:'white'}}></i></Avatar>
                            </EmailShareButton>
                            <WhatsappShareButton className='col'
                                    url={url}
                                    title={"Welcome to Neostore, Please find the below link to get exciting offer upto 50% and check this product " + pro.productName+ "at Rs. "+ pro.productCost}
                                    hashtag="#react"
                                 ><Avatar className='m-2' sx={{bgcolor:'#25D366'}}><i class="  fab fa-whatsapp btn" style={{color:'white'}}></i></Avatar>
                            </WhatsappShareButton>

                            <InstapaperShareButton  className='col'
                                    url={url}
                                    title={"Welcome to Neostore, Please find the below link to get exciting offer upto 50% and check this product " + pro.productName+ "at Rs. "+ pro.productCost}
                                    hashtag="#react">
                                      <Avatar className='m-2' sx={{bgcolor:'#DD2A7B'}}><i class="  fab fa-instagram btn" style={{color:'white'}}></i></Avatar>
                              </InstapaperShareButton>
                            <PinterestShareButton className='col'
                                    url={url}
                                    title={"Welcome to Neostore, Please find the below link to get exciting offer upto 50% and check this product " + pro.productName+ "at Rs. "+ pro.productCost}
                                    hashtag="#react">
                                <Avatar className='m-2' sx={{bgcolor:'#E60023'}}><i class="  fab fa-pinterest btn" style={{color:'white'}}></i></Avatar>
                            </PinterestShareButton>
                            <TwitterShareButton url={url} className='col'
                                title={"Checkout NeoStore offers " + pro.productName+ "at Rs. "+ pro.productCost} hashtag='#neostore'><Avatar className='m-2' sx={{bgcolor:'#1DA1F2'}}><i class="  fab fa-twitter btn" style={{color:'white'}}></i></Avatar>
                              </TwitterShareButton>
                            </div>
                            <Button variant='contained' className='bg-primary m-3' onClick={()=>addToCart(pro)}>Add to cart</Button>
                            <Button variant='contained' className='bg-warning m-3'  onClick={() => setModalShow(true)}>Rate Product</Button>
                        </Container>
                    </div>
                </div>
                <Box sx={{ width: '100%',paddingLeft:'2%',paddingRight:'2%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={value} onChange={handleChange}>
                        <Tab label="Description" />
                        <Tab label="Features" />
                      </Tabs>
                    </Box>
                    <TabPanel className='text-start' value={value} index={0}>
                      {pro.productDescrip}
                    </TabPanel>
                    <TabPanel className='text-start' value={value} index={1}>
                      Product Material : {pro.productMaterial}<br/>
                      Product Stock : {pro.productStock}<br/>
                      Product Rating : {pro.productRating}
                    </TabPanel>
                </Box>

                <Modal
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Rate Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Rating
          size="large"
          className='col-5 pt-1'
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit"/>}
        />
        {rating !== null && (
          <Box className='col-7 fs-4'>{labels[hover !== -1 ? hover : rating]}</Box>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-success p-5 pt-2 pb-2' onClick={rateProduct}>Submit</button>
          <button className='btn btn-danger p-5 pt-2 pb-2' onClick={()=>{setModalShow(false)}}>Close</button>
        </Modal.Footer>
      </Modal>
                </Paper>
                )}
            </Container>
            
        <Footer/>
        {/* <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      /> */}
        </>
    )
}
