import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoginModal } from '../components/LoginModal'

export const Login = () => {
  const {
    isAuthenticated,
    connectors,
    isProcessing,
    loginWithConnector,
    authError,
  } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <LoginModal
        connectors={connectors}
        isProcessing={isProcessing}
        onConnect={(connector) => loginWithConnector(connector)}
        error={authError}
      />
    </div>
  )
}

