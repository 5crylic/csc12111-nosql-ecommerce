import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, Divider, CircularProgress } from '@mui/material'
import Swal from 'sweetalert2'
import { useAuth } from '../../../context/AuthContext.jsx'
import { getOrderHistory } from '../../../utils/getOrderHistory.js'
import './History.css'

const History = () => {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const data = await getOrderHistory(token)
      console.log('Fetched Orders:', data)
      data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(data)
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box className='order-history-container'>
      <Typography variant='h5' className='order-history-title'>
        Lịch sử đơn hàng
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : orders.length === 0 ? (
        <Typography>Chưa có đơn hàng nào.</Typography>
      ) : (
        <Box className='order-list'>
          {orders.map((order) => (
            <Card key={order.orderId} className='order-card' elevation={2}>
              <CardContent>
                <Box className='order-header'>
                  <Typography className='order-id'>Mã đơn hàng: {order.orderId}</Typography>
                  <Typography className='order-status'>
                    Trạng thái: <span className={`status-chip ${order.status.toLowerCase()}`}>{order.status}</span>
                  </Typography>
                </Box>

                <Typography className='order-date'>Ngày đặt: {order.orderDate}</Typography>

                <Divider sx={{ my: 1 }} />

                <Box className='order-items'>
                  {order.items.map((item, idx) => (
                    <Box key={idx} className='order-item'>
                      <Typography className='item-name'>Sản phẩm: {item.productName}</Typography>
                      <Typography>
                        Số lượng: {item.quantity} × ₫{item.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default History
