import React, { useState } from 'react'
import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Asset, ASSET_CONDITIONS, ASSET_STATUSES } from '../../types/assets'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface AssetTableProps {
  assets: Asset[]
  onEdit: (asset: Asset) => void
  onDelete: (asset: Asset) => void
  onView: (asset: Asset) => void
  loading?: boolean
}

type SortField = 'name' | 'category' | 'purchase_date' | 'purchase_price' | 'location' | 'asset_status' | 'condition_status'
type SortDirection = 'asc' | 'desc'

export function AssetTable({ assets, onEdit, onDelete, onView, loading }: AssetTableProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedAssets = [...assets].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    // Handle nested category name
    if (sortField === 'category') {
      aValue = a.category?.name || ''
      bValue = b.category?.name || ''
    }

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1

    // Convert to strings for comparison
    aValue = String(aValue).toLowerCase()
    bValue = String(bValue).toLowerCase()

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const getStatusBadge = (status: string, type: 'condition' | 'asset') => {
    const configs = type === 'condition' ? ASSET_CONDITIONS : ASSET_STATUSES
    const config = configs.find(c => c.value === status)
    if (!config) return null

    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-manrope font-medium ${colorClasses[config.color as keyof typeof colorClasses]}`}>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 font-manrope text-sm text-gray-600">Loading assets...</p>
        </div>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-8 text-center">
          <p className="font-manrope text-gray-600">No assets found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  {getSortIcon('category')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center space-x-1">
                  <span>Location</span>
                  {getSortIcon('location')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('purchase_price')}
              >
                <div className="flex items-center space-x-1">
                  <span>Value</span>
                  {getSortIcon('purchase_price')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('condition_status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Condition</span>
                  {getSortIcon('condition_status')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('asset_status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('asset_status')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-manrope font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('purchase_date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Purchase Date</span>
                  {getSortIcon('purchase_date')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-manrope font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-manrope text-sm font-medium text-gray-900">
                      {asset.name}
                    </div>
                    {asset.serial_number && (
                      <div className="font-manrope text-sm text-gray-500">
                        SN: {asset.serial_number}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-manrope text-sm text-gray-900">
                    {asset.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-manrope text-sm text-gray-900">
                    {asset.location}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-manrope text-sm text-gray-900">
                    {asset.purchase_price ? formatCurrency(asset.purchase_price) : '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(asset.condition_status, 'condition')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(asset.asset_status, 'asset')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-manrope text-sm text-gray-900">
                    {asset.purchase_date ? formatDate(asset.purchase_date) : '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === asset.id ? null : asset.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {activeDropdown === asset.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-10">
                        <button
                          onClick={() => {
                            onView(asset)
                            setActiveDropdown(null)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm font-manrope text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-3" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            onEdit(asset)
                            setActiveDropdown(null)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm font-manrope text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onDelete(asset)
                            setActiveDropdown(null)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm font-manrope text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}