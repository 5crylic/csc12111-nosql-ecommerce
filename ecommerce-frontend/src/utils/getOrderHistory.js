import { server } from '../configs'

export const getOrderHistory = async (token) => {
  const res = await fetch(`${server}/api/order/history`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Không thể lấy lịch sử đơn hàng')
  return data
}
