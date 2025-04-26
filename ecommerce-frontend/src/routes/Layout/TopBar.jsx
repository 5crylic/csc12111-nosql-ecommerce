import React from 'react'
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Tooltip } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import HistoryIcon from '@mui/icons-material/History'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './TopBar.css'

import { decodeJwtPayload } from '../../utils/decodeJWTPayload'

const TopBar = ({ showLogout = true }) => {
  const { token, setToken } = useAuth()
  const navigate = useNavigate()

  // 🔓 Decode token to get user info
  let userName = 'Chưa đăng nhập'
  if (token) {
    try {
      const decoded = decodeJwtPayload(token)
      userName = `👋 Xin chào, ${decoded.name || decoded.email || 'người dùng'}`
    } catch (err) {
      console.warn('Token decode error:', err)
    }
  }

  const handleLogout = () => {
    setToken(null)
    navigate('/login')
  }

  const onAboutMeClick = () => {
    navigate('/me')
  }

  const onCartClick = () => {
    navigate('/cart')
  }

  const onHistoryClick = () => {
    navigate('/history')
  }

  const backToHome = () => {
    navigate('/')
  }

  return (
    <AppBar position='static' className='topbar-appbar'>
      <Toolbar className='topbar-toolbar'>
        {/* Left: Logo or title */}
        <Typography variant='h6' className='topbar-title' onClick={backToHome}>
          Shopee Clone
        </Typography>

        {/* Right: Icons + User Info + Logout */}
        <Box className='topbar-right'>
          <Tooltip title='Lịch sử mua hàng'>
            <IconButton className='topbar-icon' onClick={onHistoryClick}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Hồ Sơ'>
            <IconButton className='topbar-icon' onClick={onAboutMeClick}>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Giỏ hàng'>
            <IconButton className='topbar-icon' onClick={onCartClick}>
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>

          <Typography className='topbar-username'>{userName}</Typography>

          {showLogout && (
            <Button variant='contained' size='small' onClick={handleLogout} className='topbar-logout-button'>
              Đăng xuất
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
