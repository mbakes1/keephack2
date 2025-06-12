import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { AuthLayout } from './AuthLayout'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await resetPassword(email)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <AuthLayout 
        title="Check your email"
        subtitle="We've sent you a password reset link"
      >
        <div className="text-center py-4">
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm font-manrope text-green-600">
              If an account with that email exists, we've sent you a password reset link.
            </p>
          </div>
          <Link 
            to="/login"
            className="inline-flex items-center text-sm font-manrope text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Reset your password"
      subtitle="Enter your email to receive a reset link"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-manrope">
            {error}
          </div>
        )}
        
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

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-manrope font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <Send className="h-4 w-4 text-orange-300 group-hover:text-orange-200 transition-colors" />
          </span>
          {loading ? 'Sending reset link...' : 'Send reset link'}
        </button>

        <div className="text-center">
          <Link 
            to="/login"
            className="inline-flex items-center text-sm font-manrope text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}