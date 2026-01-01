'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Loader2, Plus, Edit2, Trash2, X, ChevronUp, ChevronDown, Upload, Star } from 'lucide-react'
import type { Project } from '@/lib/supabase/projects'
import Image from 'next/image'
import { Toast } from '@/components/common/Toast'

// Available categories (must match service categories)
const categories = ['Residential', 'Office', 'Government', 'Mosque']

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [movingItemId, setMovingItemId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'Residential',
    image_url: '',
    image_alt: '',
    display_order: 0,
    is_featured: false,
    is_active: true,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/projects')
      const result = await response.json()
      if (result.success && result.data) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setMessage({ type: 'error', text: 'Failed to fetch projects' })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    const uploadKey = editingId || 'new'
    
    setUploading({ ...uploading, [uploadKey]: true })
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'projects')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setFormData({ ...formData, image_url: result.url })
        setMessage({ type: 'success', text: 'Image uploaded successfully!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload image' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' })
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
    const lastOrder = projects.length > 0 
      ? Math.max(...projects.map(project => project.display_order)) + 1 
      : 0
    
    setFormData({
      title: '',
      description: '',
      category: 'Residential',
      image_url: '',
      image_alt: '',
      display_order: lastOrder,
      is_featured: false,
      is_active: true,
    })
    setEditingId(null)
    setShowAddForm(true)
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      image_url: project.image_url,
      image_alt: project.image_alt || '',
      display_order: project.display_order,
      is_featured: project.is_featured,
      is_active: project.is_active,
    })
    setEditingId(project.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Project deleted successfully!' })
        fetchProjects()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete project' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete project' })
    }
  }

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const project = projects.find(p => p.id === id)
    if (!project) return

    const sortedProjects = [...projects].sort((a, b) => a.display_order - b.display_order)
    const currentIndex = sortedProjects.findIndex(p => p.id === id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= sortedProjects.length) return

    const targetProject = sortedProjects[newIndex]
    const newOrder = targetProject.display_order
    const oldOrder = project.display_order

    // Show confirmation with details
    const projectTitle = project.title || 'Untitled'
    const targetTitle = targetProject.title || 'Untitled'
    const confirmMessage = `Move "${projectTitle}" from position ${oldOrder} to position ${newOrder}?\n\n"${targetTitle}" will move from position ${newOrder} to position ${oldOrder}.`
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      setMovingItemId(id)
      setMessage(null)

      // Update both projects in parallel
      const [response1, response2] = await Promise.all([
        fetch('/api/admin/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            display_order: newOrder,
          }),
        }),
        fetch('/api/admin/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: targetProject.id,
            display_order: oldOrder,
          }),
        }),
      ])

      const result1 = await response1.json()
      const result2 = await response2.json()

      if (result1.success && result2.success) {
        setMessage({ type: 'success', text: `Order updated! "${projectTitle}" moved to position ${newOrder}.` })
        await fetchProjects()
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
      // Check if the display_order is already taken by another project
      const conflictingProject = projects.find(
        project => project.display_order === formData.display_order && project.id !== editingId
      )

      if (conflictingProject) {
        // Get the last order for the conflicting project
        const lastOrder = projects.length > 0 
          ? Math.max(...projects.map(project => project.display_order)) + 1 
          : 0

        // First, move the conflicting project to the last position
        await fetch('/api/admin/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: conflictingProject.id,
            display_order: lastOrder,
          }),
        })
      }

      const url = '/api/admin/projects'
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
        setMessage({ type: 'success', text: editingId ? 'Project updated successfully!' : 'Project added successfully!' })
        setShowAddForm(false)
        setEditingId(null)
        fetchProjects()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save project' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save project' })
    } finally {
      setSaving(false)
    }
  }

  const sortedProjects = [...projects].sort((a, b) => a.display_order - b.display_order)

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects Management</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span className="text-sm sm:text-base">Add New Project</span>
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
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                  setFormData({
                    title: '',
                    description: '',
                    category: 'Residential',
                    image_url: '',
                    image_alt: '',
                    display_order: 0,
                    is_featured: false,
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
                    Title *
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
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Project['category'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                    required
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
                  Description *
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
                  Image Upload *
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
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
                          Upload Image
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="Or enter image URL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                  />
                  {formData.image_url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={formData.image_url}
                        alt={formData.image_alt || formData.title || 'Preview'}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Alt Text
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
                    {projects.length > 0 && (
                      <>
                        Current range: 0 - {Math.max(...projects.map(project => project.display_order))}
                        {formData.display_order !== undefined && projects.some(project => project.display_order === formData.display_order && project.id !== editingId) && (
                          <span className="text-orange-600 ml-2 block mt-1">
                            ⚠️ This order is taken - the existing project will be moved to the end
                          </span>
                        )}
                      </>
                    )}
                    {projects.length === 0 && 'No projects yet. This will be the first project (order 0).'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured ?? false}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-[#1d2856] border-gray-300 rounded focus:ring-[#1d2856]"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Star size={16} className="text-yellow-500" />
                    Featured
                  </label>
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
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving || !formData.title || !formData.description || !formData.image_url}
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
                      {editingId ? 'Update' : 'Add'} Project
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

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[640px] sm:min-w-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
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
                {sortedProjects.map((project, index) => (
                  <tr key={project.id} className={!project.is_active ? 'opacity-50' : ''}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={project.image_url}
                          alt={project.image_alt || project.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                        {project.is_featured && (
                          <div className="absolute top-1 right-1 bg-yellow-500 rounded-full p-1">
                            <Star size={12} className="text-white fill-white" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-900 font-medium">{project.title}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm text-gray-900">{project.category}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(project.id, 'up')}
                          disabled={index === 0 || movingItemId === project.id}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title={index === 0 ? 'Already at top' : `Move up to position ${sortedProjects[index - 1]?.display_order || 0}`}
                        >
                          {movingItemId === project.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <ChevronUp size={16} />
                          )}
                        </button>
                        <span className="text-xs sm:text-sm text-gray-900 w-6 sm:w-8 text-center font-medium">{project.display_order}</span>
                        <button
                          onClick={() => handleMove(project.id, 'down')}
                          disabled={index === sortedProjects.length - 1 || movingItemId === project.id}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title={index === sortedProjects.length - 1 ? 'Already at bottom' : `Move down to position ${sortedProjects[index + 1]?.display_order || 0}`}
                        >
                          {movingItemId === project.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            project.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {project.is_featured && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                            <Star size={12} className="fill-yellow-600" />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-[#1d2856] hover:text-[#1d2856]/80"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
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
            {sortedProjects.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No projects found. Click &quot;Add New Project&quot; to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

