import React, { createContext, useContext } from 'react'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/ui/ToastContainer'

interface ToastContextType {
  success: (options: { title: string; message?: string; duration?: number }) => string
  error: (options: { title: string; message?: string; duration?: number }) => string
  warning: (options: { title: string; message?: string; duration?: number }) => string
  info: (options: { title: string; message?: string; duration?: number }) => string
  removeToast: (id: string) => void
  clear: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast()

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}