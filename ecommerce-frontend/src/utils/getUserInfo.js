import { server } from '../configs'

export const getUserInfo = async (token) => {
  const res = await fetch(`${server}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Lỗi không xác định')
  }

  return data
}
