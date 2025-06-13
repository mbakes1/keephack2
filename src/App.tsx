import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './components/auth/Login'
import { Signup } from './components/auth/Signup'
import { ForgotPassword } from './components/auth/ForgotPassword'
import { Dashboard } from './components/Dashboard'
import { Assets } from './components/Assets'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ToastProvider } from './contexts/ToastContext'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/dashboard" replace /> : <Signup />} 
            />
            <Route 
              path="/forgot-password" 
              element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assets" 
              element={
                <ProtectedRoute>
                  <Assets />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App