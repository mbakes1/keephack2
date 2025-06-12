export interface AssetCategory {
  id: string
  name: string
  description?: string
  icon?: string
  created_at: string
  updated_at: string
}

export interface Asset {
  id: string
  name: string
  description?: string
  category_id?: string
  serial_number?: string
  model?: string
  brand?: string
  purchase_date?: string
  purchase_price?: number
  supplier_vendor?: string
  warranty_start_date?: string
  warranty_end_date?: string
  warranty_details?: string
  location: string
  condition_status: 'excellent' | 'good' | 'fair' | 'poor'
  asset_status: 'active' | 'in_repair' | 'retired' | 'disposed'
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
  // Relations
  category?: AssetCategory
  assignments?: AssetAssignment[]
  maintenance?: AssetMaintenance[]
  documents?: AssetDocument[]
}

export interface AssetAssignment {
  id: string
  asset_id: string
  assigned_to_name: string
  assigned_to_email?: string
  department?: string
  assignment_date: string
  return_date?: string
  notes?: string
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface AssetMaintenance {
  id: string
  asset_id: string
  maintenance_type: 'scheduled' | 'repair' | 'inspection' | 'cleaning'
  description: string
  scheduled_date?: string
  completed_date?: string
  cost?: number
  performed_by?: string
  notes?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  created_by?: string
  created_at: string
  updated_at: string
}

export interface AssetDocument {
  id: string
  asset_id: string
  document_name: string
  document_type: 'photo' | 'manual' | 'receipt' | 'warranty' | 'other'
  file_url?: string
  file_size?: number
  mime_type?: string
  uploaded_by?: string
  created_at: string
}

export interface AssetFilters {
  search?: string
  category?: string
  status?: string
  condition?: string
  location?: string
  dateFrom?: string
  dateTo?: string
}

export interface AssetFormData {
  name: string
  description?: string
  category_id?: string
  serial_number?: string
  model?: string
  brand?: string
  purchase_date?: string
  purchase_price?: number
  supplier_vendor?: string
  warranty_start_date?: string
  warranty_end_date?: string
  warranty_details?: string
  location: string
  condition_status: 'excellent' | 'good' | 'fair' | 'poor'
  asset_status: 'active' | 'in_repair' | 'retired' | 'disposed'
  notes?: string
}

export const SOUTH_AFRICAN_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
] as const

export const ASSET_CONDITIONS = [
  { value: 'excellent', label: 'Excellent', color: 'green' },
  { value: 'good', label: 'Good', color: 'blue' },
  { value: 'fair', label: 'Fair', color: 'yellow' },
  { value: 'poor', label: 'Poor', color: 'red' }
] as const

export const ASSET_STATUSES = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'in_repair', label: 'In Repair', color: 'yellow' },
  { value: 'retired', label: 'Retired', color: 'gray' },
  { value: 'disposed', label: 'Disposed', color: 'red' }
] as const