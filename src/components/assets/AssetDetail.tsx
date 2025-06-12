import React, { useState, useEffect } from 'react'
import { X, Edit, Calendar, MapPin, DollarSign, Package, AlertTriangle, Clock } from 'lucide-react'
import { Asset } from '../../types/assets'
import { useAssets } from '../../hooks/useAssets'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface AssetDetailProps {
  assetId: string
  isOpen: boolean
  onClose: () => void
  onEdit: (asset: Asset) => void
}

export function AssetDetail({ assetId, isOpen, onClose, onEdit }: AssetDetailProps) {
  const { getAsset } = useAssets()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && assetId) {
      fetchAsset()
    }
  }, [isOpen, assetId])

  const fetchAsset = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await getAsset(assetId)
    
    if (error) {
      setError(error)
    } else {
      setAsset(data)
    }
    
    setLoading(false)
  }

  const isWarrantyExpiring = (warrantyEndDate?: string) => {
    if (!warrantyEndDate) return false
    const endDate = new Date(warrantyEndDate)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
    return endDate <= thirtyDaysFromNow && endDate >= today
  }

  const isWarrantyExpired = (warrantyEndDate?: string) => {
    if (!warrantyEndDate) return false
    const endDate = new Date(warrantyEndDate)
    const today = new Date()
    return endDate < today
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="font-geist text-xl font-semibold text-gray-900 tracking-tight">
              Asset Details
            </h2>
            <div className="flex items-center space-x-2">
              {asset && (
                <button
                  onClick={() => onEdit(asset)}
                  className="inline-flex items-center px-3 py-2 text-sm font-manrope font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 font-manrope text-sm text-gray-600">Loading asset details...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="font-manrope text-red-600">{error}</p>
              </div>
            ) : asset ? (
              <div className="space-y-6">
                {/* Warranty Alerts */}
                {(isWarrantyExpiring(asset.warranty_end_date) || isWarrantyExpired(asset.warranty_end_date)) && (
                  <div className={`p-4 rounded-md border ${
                    isWarrantyExpired(asset.warranty_end_date) 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center">
                      <AlertTriangle className={`h-5 w-5 mr-3 ${
                        isWarrantyExpired(asset.warranty_end_date) ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <p className={`font-manrope text-sm ${
                        isWarrantyExpired(asset.warranty_end_date) ? 'text-red-700' : 'text-yellow-700'
                      }`}>
                        {isWarrantyExpired(asset.warranty_end_date) 
                          ? 'Warranty has expired' 
                          : 'Warranty expires within 30 days'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-geist text-lg font-semibold text-gray-900">Basic Information</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-manrope font-medium text-gray-500">Name</label>
                        <p className="font-manrope text-gray-900">{asset.name}</p>
                      </div>
                      
                      {asset.description && (
                        <div>
                          <label className="block text-sm font-manrope font-medium text-gray-500">Description</label>
                          <p className="font-manrope text-gray-900">{asset.description}</p>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-manrope font-medium text-gray-500">Category</label>
                        <p className="font-manrope text-gray-900">{asset.category?.name || 'Uncategorized'}</p>
                      </div>
                      
                      {asset.brand && (
                        <div>
                          <label className="block text-sm font-manrope font-medium text-gray-500">Brand</label>
                          <p className="font-manrope text-gray-900">{asset.brand}</p>
                        </div>
                      )}
                      
                      {asset.model && (
                        <div>
                          <label className="block text-sm font-manrope font-medium text-gray-500">Model</label>
                          <p className="font-manrope text-gray-900">{asset.model}</p>
                        </div>
                      )}
                      
                      {asset.serial_number && (
                        <div>
                          <label className="block text-sm font-manrope font-medium text-gray-500">Serial Number</label>
                          <p className="font-manrope text-gray-900 font-mono">{asset.serial_number}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-geist text-lg font-semibold text-gray-900">Status & Location</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-manrope font-medium text-gray-500">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-manrope font-medium ${
                          asset.asset_status === 'active' ? 'bg-green-100 text-green-800' :
                          asset.asset_status === 'in_repair' ? 'bg-yellow-100 text-yellow-800' :
                          asset.asset_status === 'retired' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {asset.asset_status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-manrope font-medium text-gray-500">Condition</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-manrope font-medium ${
                          asset.condition_status === 'excellent' ? 'bg-green-100 text-green-800' :
                          asset.condition_status === 'good' ? 'bg-blue-100 text-blue-800' :
                          asset.condition_status === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {asset.condition_status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-manrope font-medium text-gray-500">Location</label>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="font-manrope text-gray-900">{asset.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Information */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-geist text-lg font-semibold text-gray-900 mb-4">Purchase Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {asset.purchase_date && (
                      <div>
                        <label className="block text-sm font-manrope font-medium text-gray-500">Purchase Date</label>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="font-manrope text-gray-900">{formatDate(asset.purchase_date)}</p>
                        </div>
                      </div>
                    )}
                    
                    {asset.purchase_price && (
                      <div>
                        <label className="block text-sm font-manrope font-medium text-gray-500">Purchase Price</label>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="font-manrope text-gray-900">{formatCurrency(asset.purchase_price)}</p>
                        </div>
                      </div>
                    )}
                    
                    {asset.supplier_vendor && (
                      <div>
                        <label className="block text-sm font-manrope font-medium text-gray-500">Supplier/Vendor</label>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-gray-400 mr-2" />
                          <p className="font-manrope text-gray-900">{asset.supplier_vendor}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warranty Information */}
                {(asset.warranty_start_date || asset.warranty_end_date || asset.warranty_details) && (
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-geist text-lg font-semibold text-gray-900 mb-4">Warranty Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {asset.warranty_start_date && (
                        <div>
                          <label className="block text-sm font-manrope font-medium text-gray-500">Warranty Start</label>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <p className="font-manrope text-gray-900">{formatDate(asset.warranty_start_date)}</p>
                          </div>
                        </div>
                      )}
                      
                      {asset.warranty_end_date && (
                        <div>
                          <label className="block text-sm font-manrope font-medium text-gray-500">Warranty End</label>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <p className={`font-manrope ${
                              isWarrantyExpired(asset.warranty_end_date) ? 'text-red-600' :
                              isWarrantyExpiring(asset.warranty_end_date) ? 'text-yellow-600' :
                              'text-gray-900'
                            }`}>
                              {formatDate(asset.warranty_end_date)}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {asset.warranty_details && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-manrope font-medium text-gray-500">Warranty Details</label>
                          <p className="font-manrope text-gray-900">{asset.warranty_details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {asset.notes && (
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-geist text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <p className="font-manrope text-gray-900 whitespace-pre-wrap">{asset.notes}</p>
                  </div>
                )}

                {/* Metadata */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-geist text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-manrope font-medium text-gray-500">Created</label>
                      <p className="font-manrope text-gray-900">{formatDate(asset.created_at)}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-manrope font-medium text-gray-500">Last Updated</label>
                      <p className="font-manrope text-gray-900">{formatDate(asset.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}