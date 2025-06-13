import React, { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const toastStyles = {
  success: {
    container: 'bg-white border-l-4 border-green-500 shadow-lg',
    icon: 'text-green-500',
    title: 'text-green-800',
    message: 'text-green-600'
  },
  error: {
    container: 'bg-white border-l-4 border-red-500 shadow-lg',
    icon: 'text-red-500',
    title: 'text-red-800',
    message: 'text-red-600'
  },
  warning: {
    container: 'bg-white border-l-4 border-yellow-500 shadow-lg',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    message: 'text-yellow-600'
  },
  info: {
    container: 'bg-white border-l-4 border-blue-500 shadow-lg',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    message: 'text-blue-600'
  }
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const Icon = toastIcons[type]
  const styles = toastStyles[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  return (
    <div className={`
      ${styles.container}
      rounded-lg p-4 mb-3 transform transition-all duration-300 ease-in-out
      animate-in slide-in-from-right-full
    `}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${styles.icon}`} />
        </div>
        <div className="ml-3 flex-1">
          <h4 className={`font-manrope text-sm font-semibold ${styles.title}`}>
            {title}
          </h4>
          {message && (
            <p className={`mt-1 font-manrope text-sm ${styles.message}`}>
              {message}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onClose(id)}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}