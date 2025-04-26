import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { Box, Typography, CircularProgress, Button, Paper, Chip, Divider } from '@mui/material'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { getProductById } from '../../../utils/getProductDetails.js'
import { addToCart } from '../../../utils/addProductToCart.js'
import { TextField, Rating } from '@mui/material'
import { getReviews } from '../../../utils/getReviews.js'
import { postReview } from '../../../utils/postReview.js'
import './ProductDetails.css'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const [reviews, setReviews] = useState([])
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(5)

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id)
      setProduct(data)
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant)
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      Swal.fire('Chọn phiên bản!', 'Vui lòng chọn màu và size', 'warning')
      return
    }

    const payload = {
      productId: product.productId || product._id,
      quantity,
      variant: selectedVariant
    }

    try {
      await addToCart(token, payload)
      Swal.fire('✅ Đã thêm vào giỏ hàng!', '', 'success')
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    }
  }

  const fetchReviews = async () => {
    try {
      const data = await getReviews(product.productId)
      setReviews(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmitReview = async () => {
    if (!token) {
      return Swal.fire('Vui lòng đăng nhập để đánh giá', '', 'warning')
    }

    if (!newComment.trim()) {
      return Swal.fire('Vui lòng nhập bình luận', '', 'warning')
    }

    try {
      await postReview(token, product.productId, {
        rating: newRating,
        comment: newComment
      })
      Swal.fire('✅ Đánh giá thành công!', '', 'success')
      setNewComment('')
      setNewRating(5)
      fetchReviews()
    } catch (err) {
      Swal.fire('Lỗi', err.message, 'error')
    }
  }

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (product?.productId) fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  if (loading) {
    return (
      <Box className='product-detail-container'>
        <CircularProgress />
      </Box>
    )
  }

  if (!product) return null

  return (
    <Box className='product-detail-container'>
      <Paper elevation={3} className='product-detail-card'>
        <Box className='product-detail-image-wrapper'>
          <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} className='product-detail-image' />
        </Box>

        <Box className='product-detail-info'>
          <Typography variant='h5' className='product-name'>
            {product.name}
          </Typography>

          <Typography className='product-price'>
            {product.discountPrice ? (
              <>
                <span className='product-price-original'>₫{product.price.toLocaleString()}</span>{' '}
                <span className='product-price-discount'>₫{product.discountPrice.toLocaleString()}</span>
              </>
            ) : (
              <>₫{product.price.toLocaleString()}</>
            )}
          </Typography>

          <Typography className='product-description'>{product.description}</Typography>
          <Box className='quantity-group'>
            <Typography variant='subtitle1' fontWeight={600} mb={1}>
              Số lượng:
            </Typography>
            <Box className='quantity-controls'>
              <Button className='quantity-btn' onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                −
              </Button>
              <input
                className='quantity-input'
                type='number'
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (!isNaN(val)) {
                    setQuantity(Math.min(Math.max(1, val), product.stockQuantity))
                  }
                }}
              />
              <Button
                className='quantity-btn'
                onClick={() => setQuantity((prev) => Math.min(prev + 1, product.stockQuantity))}
              >
                +
              </Button>
            </Box>
          </Box>
          <Box className='variant-group'>
            <Typography variant='subtitle1' fontWeight={600} mb={1}>
              Phiên bản:
            </Typography>
            <Box className='variant-buttons'>
              {product.variants.map((variant, index) => {
                const label = `${variant.color} - ${variant.size}`
                const isSelected =
                  selectedVariant && selectedVariant.color === variant.color && selectedVariant.size === variant.size

                return (
                  <Button
                    key={index}
                    className={`variant-button ${isSelected ? 'variant-selected' : ''}`}
                    onClick={() => handleVariantClick(variant)}
                  >
                    {label}
                  </Button>
                )
              })}
            </Box>
          </Box>

          <Button variant='contained' className='add-to-cart-button' onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </Button>
        </Box>
      </Paper>

      <Box className='review-section'>
        <Typography variant='h6' className='review-title'>
          Đánh giá sản phẩm
        </Typography>

        <Box className='review-form'>
          <Rating value={newRating} onChange={(e, newValue) => setNewRating(newValue)} />
          <TextField
            multiline
            rows={2}
            fullWidth
            placeholder='Nhập đánh giá của bạn...'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className='review-input'
          />
          <Button variant='contained' onClick={handleSubmitReview} className='review-submit'>
            Gửi đánh giá
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {reviews.length === 0 ? (
          <Typography>Chưa có đánh giá nào.</Typography>
        ) : (
          <Box className='review-list'>
            {reviews.map((review, index) => (
              <Box key={index} className='review-item'>
                <Rating value={review.rating} readOnly size='small' />
                <Typography variant='body2' className='review-comment'>
                  {review.comment}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ProductDetails
