import { server } from '../configs'

export const getProductById = async (id) => {
  const res = await fetch(`${server}/api/products/${id}`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Không thể lấy chi tiết sản phẩm')
  }

  return data
}
