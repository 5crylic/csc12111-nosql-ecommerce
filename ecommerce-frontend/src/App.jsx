import Login from './routes/Login/Login.jsx'
import Register from './routes/Register/Register.jsx'
import Home from './routes/Home/Home.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route element={<Login />} path='/login'></Route>
          <Route element={<Register />} path='/register'></Route>
          <Route
            path='/*'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
