import { server } from '../configs'

export const loginUser = async (credentials) => {
  const res = await fetch(server + '/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })

  const data = await res.json()
  console.log(data)
  if (!res.ok) {
    throw new Error(data.error || 'Đăng nhập thất bại')
  }

  return data
}
