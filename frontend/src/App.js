import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { lazy, Suspense } from 'react';

import './App.css';
import Terms from './components/Terms';
import PageNotFound from './components/PageNotFound';
import {ToastContainer} from 'react-toastify'
const Address=lazy(()=>import('./components/Address'))
const Cart=lazy(()=>import('./components/Cart'))
const ChangePassword=lazy(()=>import('./components/ChangePassword'))
const ForgetPassword=lazy(()=>import('./components/ForgetPassword'))
const Home=lazy(()=>import('./components/Home'))
const Login=lazy(()=>import('./components/Login'))
const Order=lazy(()=>import('./components/Order'))
const Preview=lazy(()=>import('./components/Preview'))
const Products=lazy(()=>import('./components/Products'))
const Profile=lazy(()=>import('./components/Profile'))
const Register=lazy(()=>import('./components/Register'))
const SpecificProduct=lazy(()=>import('./components/SpecificProduct'))
// import Address from './components/Address';
// import Cart from './components/Cart';
// import ChangePassword from './components/ChangePassword';
// import ForgetPassword from './components/ForgetPassword';
// import Home from './components/Home';
// import Login from './components/Login';
// import Order from './components/Order';
// import Preview from './components/Preview';
// import Products from './components/Products';
// import Profile from './components/Profile';
// import Register from './components/Register';
// import SpecificProduct from './components/SpecificProduct';

function App() {
  return (
    <div className="App">
    <Suspense fallback={<div style={{height:'100%',width:'100%'}}><img src='./load.gif' alt='Lazy Loading' style={{height:'100%',width:'100%'}}/></div>}>
    <ToastContainer position="top-right"
hideProgressBar={false}
autoClose={5000}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
      // style={{color:'#669fb2'}}
    />
      <Router>
        <Routes>
          <Route path='/' exact element={<Home/>}/>
          <Route path='/commonProducts' exact element={<Products/>}/>
          <Route path='/order' exact element={<Order/>}/>
          <Route path='/register' exact element={<Register/>}/>
          <Route path='/login' exact element={<Login/>}/>
          <Route path='/changePassword' exact element={<ChangePassword/>}/>
          <Route path='/forgotPassword' exact element={<ForgetPassword/>}/>
          <Route path='/profile' exact element={<Profile/>}/>
          <Route path='/getCustAddress' exact element={<Address/>}/>
          <Route path='/specificProduct' exact element={<SpecificProduct/>}/>
          <Route path='/getCartData' exact element={<Cart/>}/>
          <Route path='/preview' exact element={<Preview/>}/>
          <Route path='/terms' exact element={<Terms/>}/>
          <Route path='*'  element={<PageNotFound/>}/>
        </Routes>
      </Router>

</Suspense>
      
    </div>
  );
}

export default App;
