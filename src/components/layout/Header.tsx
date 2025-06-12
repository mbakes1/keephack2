import React, { useState } from 'react'
import { Bell, Menu, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <header className="sticky top-0 inset-x-0 z-40 w-full bg-white border-b border-slate-200 lg:pl-64">
      <nav className="px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Mobile menu button and logo */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-3">
            <h1 className="font-geist text-xl font-semibold text-gray-900 tracking-tight">
              Keep
            </h1>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-1 ml-auto">
          {/* Notifications */}
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:block font-manrope text-sm text-gray-700">
                {user?.email?.split('@')[0]}
              </span>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-slate-200">
                  <p className="font-manrope text-sm text-gray-500">Signed in as</p>
                  <p className="font-manrope text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center w-full px-4 py-2 text-sm font-manrope text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm font-manrope text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}