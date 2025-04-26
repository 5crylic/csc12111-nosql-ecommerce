import { server } from '../configs'

export const postReview = async (token, productId, review) => {
  const res = await fetch(`${server}/api/review/${productId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(review)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Gửi đánh giá thất bại')
  return data
}
