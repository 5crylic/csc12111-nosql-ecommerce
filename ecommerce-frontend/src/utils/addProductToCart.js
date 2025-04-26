import { server } from '../configs'

export const addToCart = async (token, payload) => {
  const res = await fetch(`${server}/api/cart/add`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Không thể thêm sản phẩm vào giỏ hàng')
  }

  return data
}
