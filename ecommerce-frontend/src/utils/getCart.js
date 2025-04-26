import { server } from '../configs'

export const getCart = async (token) => {
  const res = await fetch(`${server}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Không thể lấy giỏ hàng')
  return data
}
