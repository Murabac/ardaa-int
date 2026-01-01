'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Edit2, Trash2, X, ChevronUp, ChevronDown, Home, Building2, Landmark, Heart, LucideIcon } from 'lucide-react'
import type { Service } from '@/lib/supabase/services'
import { Toast } from '@/components/common/Toast'

// Available icons from lucide-react
const availableIcons: { name: string; component: LucideIcon }[] = [
  { name: 'Home', component: Home },
  { name: 'Building2', component: Building2 },
  { name: 'Landmark', component: Landmark },
  { name: 'Heart', component: Heart },
]

// Available categories (must match portfolio categories)
const categories = ['Residential', 'Office', 'Government', 'Mosque', 'Commercial']

// Available color gradients
const colorGradients = [
  { value: 'from-orange-500 to-red-500', label: 'Orange to Red' },
  { value: 'from-blue-500 to-indigo-500', label: 'Blue to Indigo' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink' },
  { value: 'from-emerald-500 to-teal-500', label: 'Emerald to Teal' },
  { value: 'from-green-500 to-emerald-500', label: 'Green to Emerald' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow to Orange' },
  { value: 'from-pink-500 to-rose-500', label: 'Pink to Rose' },
  { value: 'from-cyan-500 to-blue-500', label: 'Cyan to Blue' },
]

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [movingItemId, setMovingItemId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Service>>({
    icon: 'Home',
    title: '',
    description: '',
    color: 'from-orange-500 to-red-500',
    category: 'Residential',
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/services')
      const result = await response.json()
      if (result.success && result.data) {
        setServices(result.data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      setMessage({ type: 'error', text: 'Failed to fetch services' })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    // Get the last order (highest display_order + 1)
    const lastOrder = services.length > 0 
      ? Math.max(...services.map(service => service.display_order)) + 1 
      : 0
    
    setFormData({
      icon: 'Home',
      title: '',
      description: '',
      color: 'from-orange-500 to-red-500',
      category: 'Residential',
      display_order: lastOrder,
      is_active: true,
    })
    setEditingId(null)
    setShowAddForm(true)
  }

  const handleEdit = (service: Service) => {
    setFormData({
      icon: service.icon,
      title: service.title,
      description: service.description,
      color: service.color,
      category: service.category,
      display_order: service.display_order,
      is_active: service.is_active,
    })
    setEditingId(service.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Service deleted successfully!' })
        fetchServices()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete service' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete service' })
    }
  }

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const service = services.find(s => s.id === id)
    if (!service) return

    const sortedServices = [...services].sort((a, b) => a.display_order - b.display_order)
    const currentIndex = sortedServices.findIndex(s => s.id === id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= sortedServices.length) return

    const targetService = sortedServices[newIndex]
    const newOrder = targetService.display_order
    const oldOrder = service.display_order

    // Show confirmation with details
    const serviceTitle = service.title || 'Untitled'
    const targetTitle = targetService.title || 'Untitled'
    const confirmMessage = `Move "${serviceTitle}" from position ${oldOrder} to position ${newOrder}?\n\n"${targetTitle}" will move from position ${newOrder} to position ${oldOrder}.`
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      setMovingItemId(id)
      setMessage(null)

      // Update both services in parallel
      const [response1, response2] = await Promise.all([
        fetch('/api/admin/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            display_order: newOrder,
          }),
        }),
        fetch('/api/admin/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: targetService.id,
            display_order: oldOrder,
          }),
        }),
      ])

      const result1 = await response1.json()
      const result2 = await response2.json()

      if (result1.success && result2.success) {
        setMessage({ type: 'success', text: `Order updated! "${serviceTitle}" moved to position ${newOrder}.` })
        await fetchServices()
      } else {
        const errorMsg = result1.error || result2.error || 'Failed to update order'
        setMessage({ type: 'error', text: errorMsg })
        console.error('Order update error:', { result1, result2 })
      }
    } catch (error) {
      console.error('Order update exception:', error)
      setMessage({ type: 'error', text: 'Failed to update order. Please try again.' })
    } finally {
      setMovingItemId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      // Check if the display_order is already taken by another service
      const conflictingService = services.find(
        service => service.display_order === formData.display_order && service.id !== editingId
      )

      if (conflictingService) {
        // Get the last order for the conflicting service
        const lastOrder = services.length > 0 
          ? Math.max(...services.map(service => service.display_order)) + 1 
          : 0

        // First, move the conflicting service to the last position
        await fetch('/api/admin/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: conflictingService.id,
            display_order: lastOrder,
          }),
        })
      }

      const url = '/api/admin/services'
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId
        ? { id: editingId, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: editingId ? 'Service updated successfully!' : 'Service added successfully!' })
        setShowAddForm(false)
        setEditingId(null)
        fetchServices()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save service' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save service' })
    } finally {
      setSaving(false)
    }
  }

  const sortedServices = [...services].sort((a, b) => a.display_order - b.display_order)

  // Get icon component for preview
  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find(i => i.name === iconName)
    return icon ? icon.component : Home
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1d2856]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Services Management</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span className="text-sm sm:text-base">Add New Service</span>
          </button>
        </div>

        <Toast
          message={message?.text || ''}
          type={message?.type || 'success'}
          isVisible={!!message}
          onClose={() => setMessage(null)}
        />

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                  setFormData({
                    icon: 'Home',
                    title: '',
                    description: '',
                    color: 'from-orange-500 to-red-500',
                    category: 'Residential',
                    display_order: 0,
                    is_active: true,
                  })
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  >
                    {availableIcons.map((icon) => {
                      const IconComponent = icon.component
                      return (
                        <option key={icon.name} value={icon.name}>
                          {icon.name}
                        </option>
                      )
                    })}
                  </select>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                    <span className="text-sm text-gray-600">Preview:</span>
                    {(() => {
                      const IconComponent = getIconComponent(formData.icon || 'Home')
                      return <IconComponent className="w-5 h-5 text-[#1d2856]" />
                    })()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Gradient
                </label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                >
                  {colorGradients.map((gradient) => (
                    <option key={gradient.value} value={gradient.value}>
                      {gradient.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 mr-2">Preview:</span>
                  <div className={`inline-block w-16 h-8 rounded bg-gradient-to-r ${formData.color}`}></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={formData.display_order ?? 0}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    {services.length > 0 && (
                      <>
                        Current range: 0 - {Math.max(...services.map(service => service.display_order))}
                        {formData.display_order !== undefined && services.some(service => service.display_order === formData.display_order && service.id !== editingId) && (
                          <span className="text-orange-600 ml-2 block mt-1">
                            ⚠️ This order is taken - the existing service will be moved to the end
                          </span>
                        )}
                      </>
                    )}
                    {services.length === 0 && 'No services yet. This will be the first service (order 0).'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active ?? true}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#1d2856] border-gray-300 rounded focus:ring-[#1d2856]"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving || !formData.title || !formData.description}
                  className="flex items-center gap-2 px-6 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingId ? 'Update' : 'Add'} Service
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingId(null)
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[640px] sm:min-w-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Icon
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedServices.map((service, index) => {
                  const IconComponent = getIconComponent(service.icon)
                  return (
                    <tr key={service.id} className={!service.is_active ? 'opacity-50' : ''}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${service.color} text-white`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="text-sm text-gray-600">{service.icon}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <div className="text-xs sm:text-sm text-gray-900 font-medium">{service.title}</div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-gray-900">{service.category}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMove(service.id, 'up')}
                            disabled={index === 0 || movingItemId === service.id}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title={index === 0 ? 'Already at top' : `Move up to position ${sortedServices[index - 1]?.display_order || 0}`}
                          >
                            {movingItemId === service.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <ChevronUp size={16} />
                            )}
                          </button>
                          <span className="text-xs sm:text-sm text-gray-900 w-6 sm:w-8 text-center font-medium">{service.display_order}</span>
                          <button
                            onClick={() => handleMove(service.id, 'down')}
                            disabled={index === sortedServices.length - 1 || movingItemId === service.id}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title={index === sortedServices.length - 1 ? 'Already at bottom' : `Move down to position ${sortedServices[index + 1]?.display_order || 0}`}
                          >
                            {movingItemId === service.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            service.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {service.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-[#1d2856] hover:text-[#1d2856]/80"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {sortedServices.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No services found. Click &quot;Add New Service&quot; to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

