import React, { useState } from 'react'
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { AssetFilters as AssetFiltersType, AssetCategory, SOUTH_AFRICAN_PROVINCES, ASSET_CONDITIONS, ASSET_STATUSES } from '../../types/assets'

interface AssetFiltersProps {
  filters: AssetFiltersType
  onFiltersChange: (filters: AssetFiltersType) => void
  categories: AssetCategory[]
}

export function AssetFilters({ filters, onFiltersChange, categories }: AssetFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof AssetFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')
  const hasAdvancedFilters = filters.condition || filters.dateFrom || filters.dateTo

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-geist text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-sm font-manrope text-orange-600 hover:text-orange-700 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear all</span>
            </button>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-1 text-sm font-manrope text-gray-600 hover:text-gray-700 transition-colors"
          >
            <span>Advanced Filters</span>
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {hasAdvancedFilters && !showAdvanced && (
              <div className="h-2 w-2 bg-orange-500 rounded-full ml-1"></div>
            )}
          </button>
        </div>
      </div>

      {/* Essential Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
              placeholder="Search assets..."
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
          >
            <option value="">All categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
          >
            <option value="">All statuses</option>
            {ASSET_STATUSES.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters - Collapsible */}
      {showAdvanced && (
        <div className="border-t border-slate-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
              >
                <option value="">All locations</option>
                {SOUTH_AFRICAN_PROVINCES.map(province => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={filters.condition || ''}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
              >
                <option value="">All conditions</option>
                {ASSET_CONDITIONS.map(condition => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                Purchase Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-manrope font-medium text-gray-700 mb-2">
                Purchase Date To
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-manrope text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}