import React from 'react'
import { 
  Home, 
  FolderOpen,
  X
} from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  active?: boolean
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    {
      name: 'Assets',
      icon: FolderOpen,
      href: '/assets',
      active: location.pathname === '/assets'
    }
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span className="font-geist text-white font-bold text-lg">K</span>
              </div>
              <h1 className="font-geist text-xl font-semibold text-gray-900 tracking-tight">
                Keep
              </h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`flex items-center py-3 px-4 text-sm font-manrope rounded-lg transition-colors ${
                      item.active 
                        ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${
                      item.active ? 'text-orange-500' : 'text-gray-500'
                    }`} />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-slate-200 flex-shrink-0">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="font-manrope text-white text-sm font-medium">
                  K
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-manrope text-sm font-medium text-gray-900 truncate">
                  Keep Workspace
                </p>
                <p className="font-manrope text-xs text-gray-500 truncate">
                  Free Plan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}