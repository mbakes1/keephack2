import React, { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { AssetFormData, AssetCategory, SOUTH_AFRICAN_PROVINCES, ASSET_CONDITIONS, ASSET_STATUSES } from '../../types/assets'

interface AssetFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AssetFormData) => Promise<{ data: any; error: string | null }>
  categories: AssetCategory[]
  initialData?: Partial<AssetFormData>
  title: string
}

export function AssetForm({ isOpen, onClose, onSubmit, categories, initialData, title }: AssetFormProps) {
  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    description: '',
    category_id: '',
    serial_number: '',
    model: '',
    brand: '',
    purchase_date: '',
    purchase_price: undefined,
    supplier_vendor: '',
    warranty_start_date: '',
    warranty_end_date: '',
    warranty_details: '',
    location: '',
    condition_status: 'excellent',
    asset_status: 'active',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await onSubmit(formData)
    
    if (error) {
      setError(error)
    } else {
      onClose()
      // Reset form
      setFormData({
        name: '',
        description: '',
        category_id: '',
        serial_number: '',
        model: '',
        brand: '',
        purchase_date: '',
        purchase_price: undefined,
        supplier_vendor: '',
        warranty_start_date: '',
        warranty_end_date: '',
        warranty_details: '',
        location: '',
        condition_status: 'excellent',
        asset_status: 'active',
        notes: ''
      })
    }
    
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'purchase_price' ? (value ? parseFloat(value) : undefined) : value
    }))
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
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-manrope">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-geist text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                    placeholder="Enter asset name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                      placeholder="Enter brand"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                      placeholder="Enter model"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                    placeholder="Enter serial number"
                  />
                </div>
              </div>

              {/* Purchase & Status Information */}
              <div className="space-y-4">
                <h3 className="font-geist text-lg font-semibold text-gray-900">Purchase & Status</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      name="purchase_date"
                      value={formData.purchase_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                      Purchase Price (R)
                    </label>
                    <input
                      type="number"
                      name="purchase_price"
                      value={formData.purchase_price || ''}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                    Supplier/Vendor
                  </label>
                  <input
                    type="text"
                    name="supplier_vendor"
                    value={formData.supplier_vendor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                    placeholder="Enter supplier or vendor"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                      Warranty Start
                    </label>
                    <input
                      type="date"
                      name="warranty_start_date"
                      value={formData.warranty_start_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                      Warranty End
                    </label>
                    <input
                      type="date"
                      name="warranty_end_date"
                      value={formData.warranty_end_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                  >
                    <option value="">Select province</option>
                    {SOUTH_AFRICAN_PROVINCES.map(province => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <select
                      name="condition_status"
                      value={formData.condition_status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                    >
                      {ASSET_CONDITIONS.map(condition => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="asset_status"
                      value={formData.asset_status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                    >
                      {ASSET_STATUSES.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-manrope font-medium text-gray-700 bg-white border border-slate-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-manrope font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Asset
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}