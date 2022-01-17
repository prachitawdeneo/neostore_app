import jwt_decode from 'jwt-decode'
import { getCustomer } from '../config/Myservice';


export const cartLength = (state = 0, action) => {
    console.log(state)
    switch (action.type) {
        case "cartLen": 
            if(localStorage.getItem("_token") && !(localStorage.getItem("cart"))){
                let cartArr=[]
                let len=0
                let token=localStorage.getItem("_token");
                let decode=jwt_decode(token);
                // getCustomer({id:decode.id})
                // .then(res=>{
                //     // console.log(res.data.customer_details.cart)
                //     cartArr=res.data.customer_details.cart
                // })
                decode.cart.forEach(pro=>{
                            len +=pro.quantity
                          })
                          console.log(len);
                return len;
                // return decode.cart.length
            }
            else if((localStorage.getItem("_token") && localStorage.getItem('cart'))){
                let len=0
                let cartArr=JSON.parse(localStorage.getItem("cart"))
                cartArr!==null && cartArr.forEach(pro=>{
                    len +=pro.quantity
                  })
                  console.log(len);
                return len;
                // return JSON.parse(localStorage.getItem("cart")).length
            }
            else if(!localStorage.getItem("_token")){
                if(localStorage.getItem("cart")){
                    let len=0
                    let cartArr=JSON.parse(localStorage.getItem("cart"))
                    cartArr!==null && cartArr.forEach(pro=>{
                        len +=pro.quantity
                    })
                    console.log(len);
                return len;
                    // return JSON.parse(localStorage.getItem("cart")).length
                }
                else{
                    return 0;
                }
            }

        case "addCart":return state+1; 
        case "delCart":return state-1;
        case "logout": return 0;
        case "oldCart":return action.payload
        default: return 0
    }

}

