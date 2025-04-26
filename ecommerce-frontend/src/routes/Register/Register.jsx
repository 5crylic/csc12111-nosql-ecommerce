import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../utils/register.js' // separate API file
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registerUser(formData)
      Swal.fire('Đăng ký thành công!', 'Bạn có thể đăng nhập ngay.', 'success')
      navigate('/login')
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className='shopee-register-container'>
      <Paper elevation={4} className='shopee-register-card'>
        <Typography variant='h5' className='shopee-register-title'>
          Tạo tài khoản Shopee
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label='Tên'
            name='name'
            fullWidth
            required
            margin='normal'
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label='Số điện thoại'
            name='phoneNumber'
            fullWidth
            required
            margin='normal'
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            label='Email'
            name='email'
            type='email'
            fullWidth
            required
            margin='normal'
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label='Mật khẩu'
            name='password'
            type='password'
            fullWidth
            required
            margin='normal'
            value={formData.password}
            onChange={handleChange}
          />
          <Button type='submit' fullWidth variant='contained' className='shopee-register-button' disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default Register
