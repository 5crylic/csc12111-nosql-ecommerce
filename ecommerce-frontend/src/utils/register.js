import { server } from '../configs'

export const registerUser = async (info) => {
  const res = await fetch(`${server}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(info)
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Đăng ký thất bại')
  }

  return data
}
