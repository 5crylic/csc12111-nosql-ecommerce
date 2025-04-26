import React, { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Paper, Avatar, Chip } from '@mui/material'
import { useAuth } from '../../../context/AuthContext'
import Swal from 'sweetalert2'
import { getUserInfo } from '../../../utils/getUserInfo'
import './AboutMe.css'

const AboutMe = () => {
  const { token } = useAuth()
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const data = await getUserInfo(token)
      setUserInfo(data)
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box className='aboutme-container'>
      {loading ? (
        <CircularProgress />
      ) : userInfo ? (
        <Paper elevation={3} className='aboutme-card'>
          <Box className='aboutme-header'>
            <Avatar
              alt={userInfo.name}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}`}
              sx={{ width: 80, height: 80 }}
            />
            <Box className='aboutme-info'>
              <Typography variant='h6' className='aboutme-name'>
                {userInfo.name}
              </Typography>
              <Chip label='Đang hoạt động' color='success' className='aboutme-status' size='small' />
            </Box>
          </Box>

          <Box className='aboutme-detail'>
            <Typography>
              <strong>Email:</strong> {userInfo.email}
            </Typography>
            <Typography>
              <strong>Số điện thoại:</strong> {userInfo.phoneNumber}
            </Typography>
          </Box>
        </Paper>
      ) : null}
    </Box>
  )
}

export default AboutMe
