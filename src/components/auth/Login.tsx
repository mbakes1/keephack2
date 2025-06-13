import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToastContext } from '../../contexts/ToastContext'
import { AuthLayout } from './AuthLayout'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { signIn } = useAuth()
  const { success, error } = useToastContext()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error: signInError } = await signIn(email, password)
    
    if (signInError) {
      error({
        title: 'Sign in failed',
        message: signInError.message
      })
    } else {
      success({
        title: 'Welcome back!',
        message: 'You have been signed in successfully.'
      })
      navigate('/dashboard')
    }
    
    setLoading(false)
  }

  return (
    <AuthLayout 
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-manrope font-medium text-gray-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm transition-colors"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-manrope font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm transition-colors"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link 
              to="/forgot-password" 
              className="font-manrope text-orange-500 hover:text-orange-600 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-manrope font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <LogIn className="h-4 w-4 text-orange-300 group-hover:text-orange-200 transition-colors" />
          </span>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="text-center">
          <span className="text-sm font-manrope text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  )
}