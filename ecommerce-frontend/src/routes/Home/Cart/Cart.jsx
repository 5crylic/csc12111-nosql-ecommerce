import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Divider
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import Swal from 'sweetalert2'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useCart } from '../../../context/CartContext.jsx'
import { getCart } from '../../../utils/getCart.js'
import { removeFromCart } from '../../../utils/removeProductFromCart.js'
import { getProductById } from '../../../utils/getProductDetails.js'
import './Cart.css'

const Cart = () => {
  const { token } = useAuth()
  const { updateCart } = useCart()
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchCart = async () => {
    try {
      const data = await getCart(token)
      // Optionally fetch product details
      const itemsWithImage = await Promise.all(
        data.items.map(async (item) => {
          const product = await getProductById(item.productId)
          return { ...item, image: product.image, name: product.name }
        })
      )
      setCartItems(itemsWithImage)
      setTotal(data.total)
      updateCart(itemsWithImage)
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(token, productId)

      // ✅ Immediately remove the item from UI
      const updatedItems = cartItems.filter((item) => item.productId !== productId)
      setCartItems(updatedItems)

      // ✅ Recalculate total locally
      const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setTotal(newTotal)

      updateCart(updatedItems)
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    }
  }

  const handleOrder = () => {
    navigate('/order')
  }

  useEffect(() => {
    fetchCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box className='cart-container'>
      <Typography variant='h5' className='cart-title'>
        Giỏ hàng của bạn
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : cartItems.length === 0 ? (
        <Typography variant='body1'>Giỏ hàng trống.</Typography>
      ) : (
        <>
          <Box className='cart-items'>
            {cartItems.map((item, index) => (
              <Card key={index} className='cart-card' elevation={2}>
                <CardMedia
                  component='img'
                  image={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className='cart-image'
                />
                <CardContent className='cart-info'>
                  <Typography className='cart-name'>{item.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Biến thể: {item.variant.color} / {item.variant.size}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Số lượng: {item.quantity}
                  </Typography>
                  <Typography className='cart-price'>₫{(item.price * item.quantity).toLocaleString()}</Typography>
                </CardContent>
                <IconButton className='remove-icon' onClick={() => handleRemove(item.productId)}>
                  <DeleteIcon />
                </IconButton>
              </Card>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box className='cart-summary'>
            <Typography variant='h6' className='cart-total'>
              Tổng cộng: ₫{total.toLocaleString()}
            </Typography>
            <Button variant='contained' className='order-button' onClick={handleOrder}>
              Đặt hàng
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Cart
