import React, { useState, useEffect } from 'react'
import { Plus, FileText, Download } from 'lucide-react'
import { AppLayout } from './layout/AppLayout'
import { AssetTable } from './assets/AssetTable'
import { AssetForm } from './assets/AssetForm'
import { AssetFilters } from './assets/AssetFilters'
import { AssetDetail } from './assets/AssetDetail'
import { useAssets } from '../hooks/useAssets'
import { useToastContext } from '../contexts/ToastContext'
import { Asset, AssetFilters as AssetFiltersType } from '../types/assets'

export function Assets() {
  const { assets, categories, loading, createAsset, updateAsset, deleteAsset, fetchAssets } = useAssets()
  const { success, error, warning } = useToastContext()
  const [showForm, setShowForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [viewingAssetId, setViewingAssetId] = useState<string | null>(null)
  const [filters, setFilters] = useState<AssetFiltersType>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Asset | null>(null)

  // Apply filters when they change
  useEffect(() => {
    fetchAssets(filters)
  }, [filters])

  const handleCreateAsset = () => {
    setEditingAsset(null)
    setShowForm(true)
  }

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset)
    setShowForm(true)
    setViewingAssetId(null)
  }

  const handleViewAsset = (asset: Asset) => {
    setViewingAssetId(asset.id)
  }

  const handleDeleteAsset = (asset: Asset) => {
    setShowDeleteConfirm(asset)
  }

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return
    
    const { error: deleteError } = await deleteAsset(showDeleteConfirm.id)
    if (!deleteError) {
      success({
        title: 'Asset deleted',
        message: `"${showDeleteConfirm.name}" has been permanently deleted.`
      })
      setShowDeleteConfirm(null)
    } else {
      error({
        title: 'Delete failed',
        message: deleteError
      })
    }
  }

  const handleFormSubmit = async (formData: any) => {
    if (editingAsset) {
      const { error: updateError } = await updateAsset(editingAsset.id, formData)
      if (!updateError) {
        success({
          title: 'Asset updated',
          message: `"${formData.name}" has been updated successfully.`
        })
        setShowForm(false)
      }
      return { data: null, error: updateError }
    } else {
      const { error: createError } = await createAsset(formData)
      if (!createError) {
        success({
          title: 'Asset created',
          message: `"${formData.name}" has been added to your inventory.`
        })
        setShowForm(false)
      }
      return { data: null, error: createError }
    }
  }

  const handleExportAssets = () => {
    if (assets.length === 0) {
      warning({
        title: 'No assets to export',
        message: 'There are no assets available to export.'
      })
      return
    }

    // Create CSV content
    const headers = ['Name', 'Category', 'Serial Number', 'Brand', 'Model', 'Location', 'Status', 'Condition', 'Purchase Date', 'Purchase Price', 'Supplier']
    const csvContent = [
      headers.join(','),
      ...assets.map(asset => [
        `"${asset.name}"`,
        `"${asset.category?.name || ''}"`,
        `"${asset.serial_number || ''}"`,
        `"${asset.brand || ''}"`,
        `"${asset.model || ''}"`,
        `"${asset.location}"`,
        `"${asset.asset_status}"`,
        `"${asset.condition_status}"`,
        `"${asset.purchase_date || ''}"`,
        `"${asset.purchase_price || ''}"`,
        `"${asset.supplier_vendor || ''}"`
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `assets-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    success({
      title: 'Export completed',
      message: `${assets.length} assets exported successfully.`
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-geist text-2xl font-semibold text-gray-900 tracking-tight">
              Assets
            </h1>
            <p className="mt-1 font-manrope text-sm text-gray-600">
              Manage your digital asset inventory and tracking
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportAssets}
              className="inline-flex items-center px-4 py-2 text-sm font-manrope font-medium text-gray-700 bg-white border border-slate-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={handleCreateAsset}
              className="inline-flex items-center px-4 py-2 text-sm font-manrope font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </button>
          </div>
        </div>

        {/* Filters */}
        <AssetFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
        />

        {/* Assets Table */}
        <AssetTable
          assets={assets}
          onEdit={handleEditAsset}
          onDelete={handleDeleteAsset}
          onView={handleViewAsset}
          loading={loading}
        />

        {/* Asset Form Modal */}
        <AssetForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          categories={categories}
          initialData={editingAsset || undefined}
          title={editingAsset ? 'Edit Asset' : 'Add New Asset'}
        />

        {/* Asset Detail Modal */}
        {viewingAssetId && (
          <AssetDetail
            assetId={viewingAssetId}
            isOpen={!!viewingAssetId}
            onClose={() => setViewingAssetId(null)}
            onEdit={handleEditAsset}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowDeleteConfirm(null)} />
              
              <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="font-geist text-lg font-semibold text-gray-900 mb-4">
                  Delete Asset
                </h3>
                <p className="font-manrope text-sm text-gray-600 mb-6">
                  Are you sure you want to delete "{showDeleteConfirm.name}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-sm font-manrope font-medium text-gray-700 bg-white border border-slate-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-manrope font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}