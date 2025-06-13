import { useState, useCallback } from 'react'
import { ToastProps } from '../components/ui/Toast'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  title: string
  message?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((type: ToastType, options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: ToastProps = {
      id,
      type,
      ...options,
      onClose: () => removeToast(id)
    }

    setToasts(prev => [...prev, toast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((options: ToastOptions) => {
    return addToast('success', options)
  }, [addToast])

  const error = useCallback((options: ToastOptions) => {
    return addToast('error', { duration: 7000, ...options })
  }, [addToast])

  const warning = useCallback((options: ToastOptions) => {
    return addToast('warning', { duration: 6000, ...options })
  }, [addToast])

  const info = useCallback((options: ToastOptions) => {
    return addToast('info', options)
  }, [addToast])

  const clear = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
    clear
  }
}