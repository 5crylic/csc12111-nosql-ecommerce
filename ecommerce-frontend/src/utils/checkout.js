import { server } from '../configs'

export const checkoutOrder = async (token, payload) => {
  const res = await fetch(`${server}/api/order/checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Đặt hàng thất bại')
  return data
}
