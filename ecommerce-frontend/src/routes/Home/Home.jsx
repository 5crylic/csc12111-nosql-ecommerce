import { Routes, Route } from 'react-router-dom'

import { CartProvider } from '../../context/CartContext.jsx'

import TopBar from '../Layout/TopBar.jsx'

import AboutMe from './AboutMe/AboutMe.jsx'
import Products from './Products/Products.jsx'
import ProductDetails from './ProductDetails/ProductDetails.jsx'
import Cart from './Cart/Cart.jsx'
import History from './History/History.jsx'
import Order from './Order/Order.jsx'

const Home = () => {
  return (
    <CartProvider>
      <div>
        <TopBar />
        <Routes>
          <Route element={<Products />} path='/'></Route>
          <Route element={<AboutMe />} path='/me'></Route>
          <Route element={<ProductDetails />} path='/product/:id'></Route>
          <Route element={<Cart />} path='/cart'></Route>
          <Route element={<Order />} path='/order'></Route>
          <Route element={<History />} path='/history'></Route>
        </Routes>
      </div>
    </CartProvider>
  )
}

export default Home
