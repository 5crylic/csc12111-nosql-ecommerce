import { server } from '../configs'

export const removeFromCart = async (token, productId) => {
  const res = await fetch(`${server}/api/cart/remove/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Xóa sản phẩm thất bại')
  return data
}
