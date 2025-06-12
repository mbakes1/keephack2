import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Asset, AssetCategory, AssetFilters, AssetFormData } from '../types/assets'

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [categories, setCategories] = useState<AssetCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to sanitize date fields
  const sanitizeDateFields = (data: AssetFormData | Partial<AssetFormData>) => {
    const sanitized = { ...data }
    
    // Convert empty strings to null for date fields
    const dateFields = ['purchase_date', 'warranty_start_date', 'warranty_end_date'] as const
    
    dateFields.forEach(field => {
      if (field in sanitized && sanitized[field] === '') {
        sanitized[field] = null
      }
    })
    
    return sanitized
  }

  // Fetch assets with filters
  const fetchAssets = async (filters?: AssetFilters) => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('assets')
        .select(`
          *,
          category:asset_categories(*)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,serial_number.ilike.%${filters.search}%`)
      }
      if (filters?.category) {
        query = query.eq('category_id', filters.category)
      }
      if (filters?.status) {
        query = query.eq('asset_status', filters.status)
      }
      if (filters?.condition) {
        query = query.eq('condition_status', filters.condition)
      }
      if (filters?.location) {
        query = query.eq('location', filters.location)
      }
      if (filters?.dateFrom) {
        query = query.gte('purchase_date', filters.dateFrom)
      }
      if (filters?.dateTo) {
        query = query.lte('purchase_date', filters.dateTo)
      }

      const { data, error } = await query

      if (error) throw error
      setAssets(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets')
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('asset_categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  // Create asset
  const createAsset = async (assetData: AssetFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Sanitize date fields before sending to database
      const sanitizedData = sanitizeDateFields(assetData)

      const { data, error } = await supabase
        .from('assets')
        .insert([{ ...sanitizedData, created_by: user.id }])
        .select(`
          *,
          category:asset_categories(*)
        `)
        .single()

      if (error) throw error
      
      // Add to local state
      setAssets(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create asset'
      return { data: null, error }
    }
  }

  // Update asset
  const updateAsset = async (id: string, assetData: Partial<AssetFormData>) => {
    try {
      // Sanitize date fields before sending to database
      const sanitizedData = sanitizeDateFields(assetData)

      const { data, error } = await supabase
        .from('assets')
        .update(sanitizedData)
        .eq('id', id)
        .select(`
          *,
          category:asset_categories(*)
        `)
        .single()

      if (error) throw error
      
      // Update local state
      setAssets(prev => prev.map(asset => asset.id === id ? data : asset))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update asset'
      return { data: null, error }
    }
  }

  // Delete asset
  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remove from local state
      setAssets(prev => prev.filter(asset => asset.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete asset'
      return { error }
    }
  }

  // Get asset by ID
  const getAsset = async (id: string) => {
    try {
      // First get the asset with category - ensure clean query
      const { data: asset, error: assetError } = await supabase
        .from('assets')
        .select(`
          id,
          name,
          description,
          category_id,
          serial_number,
          model,
          brand,
          purchase_date,
          purchase_price,
          supplier_vendor,
          warranty_start_date,
          warranty_end_date,
          warranty_details,
          location,
          condition_status,
          asset_status,
          notes,
          created_by,
          created_at,
          updated_at,
          category:asset_categories(
            id,
            name,
            description,
            icon
          )
        `)
        .eq('id', id)
        .single()

      if (assetError) throw assetError

      // Then get related data in separate queries
      const [assignmentsResult, maintenanceResult, documentsResult] = await Promise.allSettled([
        supabase
          .from('asset_assignments')
          .select('*')
          .eq('asset_id', id)
          .order('created_at', { ascending: false }),
        supabase
          .from('asset_maintenance')
          .select('*')
          .eq('asset_id', id)
          .order('created_at', { ascending: false }),
        supabase
          .from('asset_documents')
          .select('*')
          .eq('asset_id', id)
          .order('created_at', { ascending: false })
      ])

      // Handle results safely
      const assignments = assignmentsResult.status === 'fulfilled' ? assignmentsResult.value.data || [] : []
      const maintenance = maintenanceResult.status === 'fulfilled' ? maintenanceResult.value.data || [] : []
      const documents = documentsResult.status === 'fulfilled' ? documentsResult.value.data || [] : []

      // Combine the data
      const data = {
        ...asset,
        assignments,
        maintenance,
        documents
      }

      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch asset'
      return { data: null, error }
    }
  }

  useEffect(() => {
    fetchAssets()
    fetchCategories()
  }, [])

  return {
    assets,
    categories,
    loading,
    error,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    getAsset,
    refetch: () => fetchAssets()
  }
}