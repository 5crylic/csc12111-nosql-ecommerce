import { server } from '../configs'

export const getReviews = async (productId) => {
  const res = await fetch(`${server}/api/review/${productId}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Không thể lấy đánh giá')
  return data
}
