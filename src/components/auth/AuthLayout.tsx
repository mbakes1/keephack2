import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="font-geist text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 font-manrope text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-lg sm:px-10 border border-slate-200">
          {children}
        </div>
      </div>
    </div>
  )
}