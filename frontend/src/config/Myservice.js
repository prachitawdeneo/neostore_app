import axios from 'axios'
import { MAIN_URL } from './Url'
let token = localStorage.getItem('_token')

export function addUser(data){
    // console.log(data)
return axios.post(`${MAIN_URL}register`,data)
}
export function logUser(data){
    // console.log(data)
return axios.post(`${MAIN_URL}login`,data)
}
export function passChange(data){
    console.log(data)
return axios.post(`${MAIN_URL}changePassword`,data)
}
export function passReset(data){
    console.log(data)
return axios.post(`${MAIN_URL}recoverPassword`,data)
}
export function sendOTP(data){
    console.log(data)
return axios.post(`${MAIN_URL}forgotPassword`,data)
}
export function updatePro(data){
    console.log(data)
return axios.post(`${MAIN_URL}profilepic`,data,{})
}
export function updateProData(data){
    console.log(data)
return axios.post(`${MAIN_URL}profile`,data)
}
export function getAddress(data){
    console.log(data)
return axios.post(`${MAIN_URL}getCustAddress`,data)
}
export function AddAddress(data){
    console.log(data)
return axios.post(`${MAIN_URL}address`,data)
}
export function delAdd(id){
    console.log(id)
return axios.post(`${MAIN_URL}deleteAddress`,id)
}
export function editAddress(id){
    console.log(id)
return axios.post(`${MAIN_URL}updateAddress`,id)
}
export function getProducts(){
return axios.get(`${MAIN_URL}commonProducts`)
}
export function getCategories(){
return axios.get(`${MAIN_URL}category`)
}
export function getColors(){
    return axios.get(`${MAIN_URL}color`)
}
export function getSpecificProduct(id){
    return axios.post(`${MAIN_URL}specificProduct`,id)
}
export function addCart(id){
    return axios.post(`${MAIN_URL}addtoCart`,id)
}
export function getCustomer(id){
return axios.post(`${MAIN_URL}getcustomer`,id)
}
export function updateShipAdd(id){
return axios.post(`${MAIN_URL}updateshipadd`,id)
}
export function postOrder(data){
return axios.post(`${MAIN_URL}placeOrder`,data)
}
export function getOrder(data){
return axios.post(`${MAIN_URL}getOrderDetails`,data)
}
export function filterCatCol(data){
    console.log(data)
return axios.post(`${MAIN_URL}filterCatCol`,data)
}
export function ratePro(data){
    console.log(data)
return axios.put(`${MAIN_URL}rateProduct`,data)
}
export function specificOrder(data){
    console.log(data)
return axios.post(`${MAIN_URL}getOrder`,data)
}
export function socialLogin(data){
    console.log(data)
return axios.post(`${MAIN_URL}sociallogin`,data)
}
export function findSocialUser(data){
    console.log(data)
return axios.post(`${MAIN_URL}findsocialuser`,data)
}

