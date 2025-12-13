import { Navigate, Route, Routes } from 'react-router-dom'

import { Dashboard } from './pages/Dashboard'
import { Panti } from './pages/Panti'
import { Transaksi } from './pages/Transaksi'
import { Withdraw } from './pages/Withdraw'
import { Login } from './pages/Login'
import { useAuthStore } from './store/useAuthStore'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const address = useAuthStore((state) => state.address)

  if (!isAuthenticated || !address) {
    return <Navigate to="/login" replace />
  }

  return children
}

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/panti"
        element={
          <ProtectedRoute>
            <Panti />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transaksi"
        element={
          <ProtectedRoute>
            <Transaksi />
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdraw"
        element={
          <ProtectedRoute>
            <Withdraw />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

