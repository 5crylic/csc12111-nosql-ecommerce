export const decodeJwtPayload = (token) => {
  try {
    const [, payloadBase64] = token.split('.')
    if (!payloadBase64) return null

    // Base64URL → Base64
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')

    // Decode and parse JSON
    const decodedPayload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      )
    )

    return decodedPayload
  } catch (err) {
    console.warn('Invalid token:', err)
    return null
  }
}
