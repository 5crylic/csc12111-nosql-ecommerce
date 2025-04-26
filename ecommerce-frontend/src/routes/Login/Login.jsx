import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material'
import Swal from 'sweetalert2'
import { useAuth } from '../../context/AuthContext'

import './Login.css'

import { loginUser } from '../../utils/login.js'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setToken } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      const data = await loginUser(formData)
      setToken(data.token)
      Swal.fire('Đăng nhập thành công!', '', 'success')
      navigate('/')
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className='shopee-login-container'>
      <Paper elevation={4} className='shopee-login-card'>
        <Typography variant='h5' className='shopee-login-title'>
          Đăng nhập vào Shopee
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Button type='submit' fullWidth variant='contained' className='shopee-login-button' disabled={loading}>
            {loading ? <CircularProgress size={24} color='inherit' /> : 'Đăng nhập'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default Login
