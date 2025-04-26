import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Button, Card, CardContent, CardMedia, Divider } from '@mui/material'
import Swal from 'sweetalert2'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useCart } from '../../../context/CartContext.jsx'
import { checkoutOrder } from '../../../utils/checkout'
import './Order.css'

const Order = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { cartItems, total, clearCart } = useCart()

  const [address, setAddress] = useState('')

  const handlePurchase = async () => {
    if (!address.trim()) {
      Swal.fire('Vui lòng nhập địa chỉ giao hàng', '', 'warning')
      return
    }

    try {
      const result = await checkoutOrder(token, {
        address,
        paymentMethod: 'COD'
      })

      Swal.fire('✅ Đặt hàng thành công!', `Mã đơn hàng: ${result.orderId}`, 'success')

      // ✅ Clear local cart
      clearCart()
      setAddress('')
      navigate('/history')
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    }
  }

  return (
    <Box className='order-container'>
      <Typography variant='h5' className='order-title'>
        Đặt hàng
      </Typography>

      <TextField
        label='Địa chỉ giao hàng'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        multiline
        rows={3}
        className='order-address'
      />

      <Typography variant='subtitle1' className='order-method'>
        Hình thức thanh toán: <strong>COD</strong>
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant='h6' gutterBottom>
        Giỏ hàng:
      </Typography>

      {cartItems.length === 0 ? (
        <Typography>Giỏ hàng trống.</Typography>
      ) : (
        <>
          <Box className='order-cart-items'>
            {cartItems.map((item, index) => (
              <Card key={index} className='order-cart-card' elevation={1}>
                <CardMedia
                  component='img'
                  image={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className='order-cart-image'
                />
                <CardContent className='order-cart-content'>
                  <Typography className='order-cart-name'>{item.name}</Typography>
                  <Typography variant='body2'>
                    Số lượng: {item.quantity} × ₫{item.price.toLocaleString()}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Biến thể: {item.variant.color} / {item.variant.size}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box className='order-footer'>
            <Typography variant='h6' className='order-total'>
              Tổng cộng: ₫{total.toLocaleString()}
            </Typography>
            <Button variant='contained' className='order-button' onClick={handlePurchase}>
              Đặt hàng
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Order
