import { server } from '../configs'

export const getProducts = async () => {
  const res = await fetch(`${server}/api/products`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Không thể lấy danh sách sản phẩm')
  }

  return data
}
