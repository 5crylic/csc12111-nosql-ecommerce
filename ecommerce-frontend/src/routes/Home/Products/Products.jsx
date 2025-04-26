// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Grid, Card, CardMedia, CardContent, Typography, Paper } from '@mui/material'
import Swal from 'sweetalert2'
import { getProducts } from '../../../utils/getProducts.js' // 👈 We'll create this
import './Products.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const navigateToProductDetails = (id) => {
    navigate(`/product/${id}`)
  }

  return (
    <Box className='products-container'>
      <Typography variant='h5' className='products-title'>
        Danh sách sản phẩm
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={0} className='products-grid'>
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={2}>
              <Card className='product-card' elevation={3} onClick={() => navigateToProductDetails(product._id)}>
                <CardMedia
                  component='img'
                  height='160'
                  image={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                  className='product-image'
                />
                <CardContent>
                  <Typography className='product-name'>{product.name}</Typography>
                  <Typography className='product-price'>₫{product.price.toLocaleString()}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Tồn kho: {product.stockQuantity}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default Products
