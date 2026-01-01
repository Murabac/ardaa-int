'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Edit2, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react'
import type { AboutSection, Stat, Value } from '@/lib/supabase/about'
import { Toast } from '@/components/common/Toast'

export default function AboutAdminPage() {
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<AboutSection>>({
    badge_text: 'About Ardaa',
    main_heading: '',
    description_paragraphs: [],
    stats: [],
    values: [],
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchAboutSections()
  }, [])

  const fetchAboutSections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/about')
      const result = await response.json()
      if (result.success && result.data) {
        setAboutSections(result.data)
      }
    } catch (error) {
      console.error('Error fetching about sections:', error)
      setMessage({ type: 'error', text: 'Failed to fetch about sections' })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    const lastOrder = aboutSections.length > 0 
      ? Math.max(...aboutSections.map(section => section.display_order)) + 1 
      : 0
    
    setFormData({
      badge_text: 'About Ardaa',
      main_heading: '',
      description_paragraphs: [],
      stats: [],
      values: [],
      display_order: lastOrder,
      is_active: true,
    })
    setEditingId(null)
    setShowAddForm(true)
  }

  const handleEdit = (section: AboutSection) => {
    setFormData({
      badge_text: section.badge_text || 'About Ardaa',
      main_heading: section.main_heading,
      description_paragraphs: section.description_paragraphs || [],
      stats: section.stats || [],
      values: section.values || [],
      display_order: section.display_order,
      is_active: section.is_active,
    })
    setEditingId(section.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this about section?')) return

    try {
      const response = await fetch(`/api/admin/about?id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'About section deleted successfully!' })
        fetchAboutSections()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete about section' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete about section' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const url = '/api/admin/about'
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
        setMessage({ type: 'success', text: editingId ? 'About section updated successfully!' : 'About section added successfully!' })
        setShowAddForm(false)
        setEditingId(null)
        fetchAboutSections()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save about section' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save about section' })
    } finally {
      setSaving(false)
    }
  }

  // Description paragraphs handlers
  const addDescriptionParagraph = () => {
    setFormData({
      ...formData,
      description_paragraphs: [...(formData.description_paragraphs || []), '']
    })
  }

  const updateDescriptionParagraph = (index: number, value: string) => {
    const paragraphs = [...(formData.description_paragraphs || [])]
    paragraphs[index] = value
    setFormData({ ...formData, description_paragraphs: paragraphs })
  }

  const removeDescriptionParagraph = (index: number) => {
    const paragraphs = [...(formData.description_paragraphs || [])]
    paragraphs.splice(index, 1)
    setFormData({ ...formData, description_paragraphs: paragraphs })
  }

  // Stats handlers
  const addStat = () => {
    setFormData({
      ...formData,
      stats: [...(formData.stats || []), { number: '', label: '', icon: '' }]
    })
  }

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const stats = [...(formData.stats || [])]
    stats[index] = { ...stats[index], [field]: value }
    setFormData({ ...formData, stats })
  }

  const removeStat = (index: number) => {
    const stats = [...(formData.stats || [])]
    stats.splice(index, 1)
    setFormData({ ...formData, stats })
  }

  // Values handlers
  const addValue = () => {
    setFormData({
      ...formData,
      values: [...(formData.values || []), { icon: '', title: '', description: '' }]
    })
  }

  const updateValue = (index: number, field: keyof Value, value: string) => {
    const values = [...(formData.values || [])]
    values[index] = { ...values[index], [field]: value }
    setFormData({ ...formData, values })
  }

  const removeValue = (index: number) => {
    const values = [...(formData.values || [])]
    values.splice(index, 1)
    setFormData({ ...formData, values })
  }

  const sortedSections = [...aboutSections].sort((a, b) => a.display_order - b.display_order)

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">About Section Management</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span className="text-sm sm:text-base">Add New Section</span>
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
                {editingId ? 'Edit About Section' : 'Add New About Section'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.badge_text || ''}
                    onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Heading *
                  </label>
                  <input
                    type="text"
                    value={formData.main_heading || ''}
                    onChange={(e) => setFormData({ ...formData, main_heading: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                    required
                  />
                </div>
              </div>

              {/* Description Paragraphs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description Paragraphs
                  </label>
                  <button
                    type="button"
                    onClick={addDescriptionParagraph}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Plus size={16} />
                    Add Paragraph
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.description_paragraphs || []).map((paragraph, index) => (
                    <div key={index} className="flex gap-2">
                      <textarea
                        value={paragraph}
                        onChange={(e) => updateDescriptionParagraph(index, e.target.value)}
                        rows={2}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                        placeholder={`Paragraph ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeDescriptionParagraph(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {(!formData.description_paragraphs || formData.description_paragraphs.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No paragraphs added yet. Click &quot;Add Paragraph&quot; to add one.</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Stats
                  </label>
                  <button
                    type="button"
                    onClick={addStat}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Plus size={16} />
                    Add Stat
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.stats || []).map((stat, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Stat {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeStat(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={stat.number}
                          onChange={(e) => updateStat(index, 'number', e.target.value)}
                          placeholder="Number (e.g., 15+)"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateStat(index, 'label', e.target.value)}
                          placeholder="Label (e.g., Years of Excellence)"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                        />
                        <input
                          type="hidden"
                          value={stat.icon || ''}
                        />
                      </div>
                    </div>
                  ))}
                  {(!formData.stats || formData.stats.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No stats added yet. Click &quot;Add Stat&quot; to add one.</p>
                  )}
                </div>
              </div>

              {/* Values */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Core Values
                  </label>
                  <button
                    type="button"
                    onClick={addValue}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Plus size={16} />
                    Add Value
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.values || []).map((value, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Value {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeValue(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={value.title}
                          onChange={(e) => updateValue(index, 'title', e.target.value)}
                          placeholder="Title"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                        />
                        <input
                          type="text"
                          value={value.description}
                          onChange={(e) => updateValue(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                        />
                        <input
                          type="hidden"
                          value={value.icon || ''}
                        />
                      </div>
                    </div>
                  ))}
                  {(!formData.values || formData.values.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No values added yet. Click &quot;Add Value&quot; to add one.</p>
                  )}
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
                  disabled={saving || !formData.main_heading}
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
                      {editingId ? 'Update' : 'Add'} Section
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

        {/* About Sections List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[640px] sm:min-w-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badge / Heading
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content Summary
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
                {sortedSections.map((section) => (
                  <tr key={section.id} className={!section.is_active ? 'opacity-50' : ''}>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-900 font-medium">{section.badge_text || 'N/A'}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{section.main_heading}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-600">
                        <div>{section.description_paragraphs?.length || 0} paragraphs</div>
                        <div>{section.stats?.length || 0} stats</div>
                        <div>{section.values?.length || 0} values</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          section.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {section.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(section)}
                          className="text-[#1d2856] hover:text-[#1d2856]/80"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(section.id)}
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
            {sortedSections.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No about sections found. Click &quot;Add New Section&quot; to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

