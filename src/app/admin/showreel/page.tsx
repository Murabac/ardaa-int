'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Loader2, Plus, Edit2, Trash2, X, Upload, ChevronUp, ChevronDown, Video, Image as ImageIcon } from 'lucide-react'
import type { ShowreelImage } from '@/lib/supabase/showreel'
import Image from 'next/image'
import { Toast } from '@/components/common/Toast'

export default function ShowreelAdminPage() {
  const [items, setItems] = useState<ShowreelImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [movingItemId, setMovingItemId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<ShowreelImage>>({
    media_type: 'image',
    image_url: '',
    image_alt: '',
    title: '',
    description: '',
    display_order: 0,
    is_active: true,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/showreel')
      const result = await response.json()
      if (result.success && result.data) {
        setItems(result.data)
      }
    } catch (error) {
      console.error('Error fetching showreel items:', error)
      setMessage({ type: 'error', text: 'Failed to fetch showreel items' })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    const isVideo = file.type.startsWith('video/')
    const folder = isVideo ? 'videos' : 'showreel'
    const uploadKey = editingId || 'new'
    
    setUploading({ ...uploading, [uploadKey]: true })
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setFormData({ ...formData, image_url: result.url, media_type: isVideo ? 'video' : 'image' })
        setMessage({ type: 'success', text: `${isVideo ? 'Video' : 'Image'} uploaded successfully!` })
      } else {
        setMessage({ type: 'error', text: result.error || `Failed to upload ${isVideo ? 'video' : 'image'}` })
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to upload ${isVideo ? 'video' : 'image'}` })
    } finally {
      setUploading({ ...uploading, [uploadKey]: false })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
    if (e.target) {
      e.target.value = ''
    }
  }

  const handleAdd = () => {
    // Get the last order (highest display_order + 1)
    const lastOrder = items.length > 0 
      ? Math.max(...items.map(item => item.display_order)) + 1 
      : 0
    
    setFormData({
      media_type: 'image',
      image_url: '',
      image_alt: '',
      title: '',
      description: '',
      display_order: lastOrder,
      is_active: true,
    })
    setEditingId(null)
    setShowAddForm(true)
  }

  const handleEdit = (item: ShowreelImage) => {
    setFormData({
      media_type: item.media_type,
      image_url: item.image_url,
      image_alt: item.image_alt || '',
      title: item.title || '',
      description: item.description || '',
      display_order: item.display_order,
      is_active: item.is_active,
    })
    setEditingId(item.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/admin/showreel?id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Item deleted successfully!' })
        fetchItems()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete item' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete item' })
    }
  }

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const item = items.find(i => i.id === id)
    if (!item) return

    const sortedItems = [...items].sort((a, b) => a.display_order - b.display_order)
    const currentIndex = sortedItems.findIndex(i => i.id === id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= sortedItems.length) return

    const targetItem = sortedItems[newIndex]
    const newOrder = targetItem.display_order
    const oldOrder = item.display_order

    // Show confirmation with details
    const itemTitle = item.title || 'Untitled'
    const targetTitle = targetItem.title || 'Untitled'
    const confirmMessage = `Move "${itemTitle}" from position ${oldOrder} to position ${newOrder}?\n\n"${targetTitle}" will move from position ${newOrder} to position ${oldOrder}.`
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      setMovingItemId(id)
      setMessage(null)

      // Update both items in parallel for better performance
      const [response1, response2] = await Promise.all([
        fetch('/api/admin/showreel', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            display_order: newOrder,
          }),
        }),
        fetch('/api/admin/showreel', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: targetItem.id,
            display_order: oldOrder,
          }),
        }),
      ])

      const result1 = await response1.json()
      const result2 = await response2.json()

      if (result1.success && result2.success) {
        setMessage({ type: 'success', text: `Order updated! "${itemTitle}" moved to position ${newOrder}.` })
        // Refresh the list to show updated order
        await fetchItems()
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
      // Check if the display_order is already taken by another item
      const conflictingItem = items.find(
        item => item.display_order === formData.display_order && item.id !== editingId
      )

      if (conflictingItem) {
        // Get the last order for the conflicting item
        const lastOrder = items.length > 0 
          ? Math.max(...items.map(item => item.display_order)) + 1 
          : 0

        // First, move the conflicting item to the last position
        await fetch('/api/admin/showreel', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: conflictingItem.id,
            display_order: lastOrder,
          }),
        })
      }

      const url = '/api/admin/showreel'
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
        setMessage({ type: 'success', text: editingId ? 'Item updated successfully!' : 'Item added successfully!' })
        setShowAddForm(false)
        setEditingId(null)
        fetchItems()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save item' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save item' })
    } finally {
      setSaving(false)
    }
  }

  const sortedItems = [...items].sort((a, b) => a.display_order - b.display_order)

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Showreel Management</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span className="text-sm sm:text-base">Add New Item</span>
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
                {editingId ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                  setFormData({
                    media_type: 'image',
                    image_url: '',
                    image_alt: '',
                    title: '',
                    description: '',
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media Type
                </label>
                <select
                  value={formData.media_type}
                  onChange={(e) => setFormData({ ...formData, media_type: e.target.value as 'image' | 'video' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.media_type === 'video' ? 'Video' : 'Image'} Upload
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={formData.media_type === 'video' ? 'video/*' : 'image/*'}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading[editingId || 'new']}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {uploading[editingId || 'new'] ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload {formData.media_type === 'video' ? 'Video' : 'Image'}
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder={`Or enter ${formData.media_type} URL`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                  />
                  {formData.image_url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                      {formData.media_type === 'video' ? (
                        <video
                          src={formData.image_url}
                          controls
                          className="w-full h-full object-contain"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Image
                          src={formData.image_url}
                          alt="Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain"
                        />
                      )}
                    </div>
                  )}
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={formData.image_alt || ''}
                  onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
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
                />
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
                    {items.length > 0 && (
                      <>
                        Current range: 0 - {Math.max(...items.map(item => item.display_order))}
                        {formData.display_order !== undefined && items.some(item => item.display_order === formData.display_order && item.id !== editingId) && (
                          <span className="text-orange-600 ml-2 block mt-1">
                            ⚠️ This order is taken - the existing item will be moved to the end
                          </span>
                        )}
                      </>
                    )}
                    {items.length === 0 && 'No items yet. This will be the first item (order 0).'}
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
                  disabled={saving || !formData.image_url}
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
                      {editingId ? 'Update' : 'Add'} Item
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

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[640px] sm:min-w-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
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
                {sortedItems.map((item, index) => (
                  <tr key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        {item.media_type === 'video' ? (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                        ) : (
                          <Image
                            src={item.image_url}
                            alt={item.image_alt || item.title || 'Preview'}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {item.media_type === 'video' ? (
                          <Video className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-xs sm:text-sm text-gray-900 capitalize">{item.media_type}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-900 font-medium">{item.title || 'Untitled'}</div>
                      {item.description && (
                        <div className="text-xs sm:text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(item.id, 'up')}
                          disabled={index === 0 || movingItemId === item.id}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title={index === 0 ? 'Already at top' : `Move up to position ${sortedItems[index - 1]?.display_order || 0}`}
                        >
                          {movingItemId === item.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <ChevronUp size={16} />
                          )}
                        </button>
                        <span className="text-xs sm:text-sm text-gray-900 w-6 sm:w-8 text-center font-medium">{item.display_order}</span>
                        <button
                          onClick={() => handleMove(item.id, 'down')}
                          disabled={index === sortedItems.length - 1 || movingItemId === item.id}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title={index === sortedItems.length - 1 ? 'Already at bottom' : `Move down to position ${sortedItems[index + 1]?.display_order || 0}`}
                        >
                          {movingItemId === item.id ? (
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
                          item.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-[#1d2856] hover:text-[#1d2856]/80"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No showreel items found. Click &quot;Add New Item&quot; to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

