'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Loader2, Plus, Edit2, Trash2, X, Upload } from 'lucide-react'
import type { TeamSection, TeamMember } from '@/lib/supabase/team'
import Image from 'next/image'
import { Toast } from '@/components/common/Toast'

export default function TeamAdminPage() {
  const [teamSections, setTeamSections] = useState<TeamSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<TeamSection>>({
    badge_text: 'Our Team',
    heading: '',
    description: '',
    team_members: [],
    display_order: 0,
    is_active: true,
  })

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  useEffect(() => {
    fetchTeamSections()
  }, [])

  const fetchTeamSections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/team')
      const result = await response.json()
      if (result.success && result.data) {
        setTeamSections(result.data)
      }
    } catch (error) {
      console.error('Error fetching team sections:', error)
      setMessage({ type: 'error', text: 'Failed to fetch team sections' })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, memberIndex: number) => {
    const uploadKey = `${editingId || 'new'}-${memberIndex}`
    
    setUploading({ ...uploading, [uploadKey]: true })
    setMessage(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'team')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      const result = await response.json()

      if (result.success) {
        const members = [...(formData.team_members || [])]
        if (members[memberIndex]) {
          members[memberIndex] = { ...members[memberIndex], image: result.url }
          setFormData({ ...formData, team_members: members })
        }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, memberIndex: number) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, memberIndex)
    }
    if (e.target) {
      e.target.value = ''
    }
  }

  const handleAdd = () => {
    const lastOrder = teamSections.length > 0 
      ? Math.max(...teamSections.map(section => section.display_order)) + 1 
      : 0
    
    setFormData({
      badge_text: 'Our Team',
      heading: '',
      description: '',
      team_members: [],
      display_order: lastOrder,
      is_active: true,
    })
    setEditingId(null)
    setShowAddForm(true)
  }

  const handleEdit = (section: TeamSection) => {
    setFormData({
      badge_text: section.badge_text || 'Our Team',
      heading: section.heading,
      description: section.description || '',
      team_members: section.team_members || [],
      display_order: section.display_order,
      is_active: section.is_active,
    })
    setEditingId(section.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team section?')) return

    try {
      const response = await fetch(`/api/admin/team?id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Team section deleted successfully!' })
        fetchTeamSections()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete team section' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete team section' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const url = '/api/admin/team'
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
        setMessage({ type: 'success', text: editingId ? 'Team section updated successfully!' : 'Team section added successfully!' })
        setShowAddForm(false)
        setEditingId(null)
        fetchTeamSections()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save team section' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save team section' })
    } finally {
      setSaving(false)
    }
  }

  // Team members handlers
  const addTeamMember = () => {
    setFormData({
      ...formData,
      team_members: [...(formData.team_members || []), { name: '', role: '', image: '', bio: '' }]
    })
  }

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const members = [...(formData.team_members || [])]
    members[index] = { ...members[index], [field]: value }
    setFormData({ ...formData, team_members: members })
  }

  const removeTeamMember = (index: number) => {
    const members = [...(formData.team_members || [])]
    members.splice(index, 1)
    setFormData({ ...formData, team_members: members })
  }

  const sortedSections = [...teamSections].sort((a, b) => a.display_order - b.display_order)

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Team Section Management</h1>
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
                {editingId ? 'Edit Team Section' : 'Add New Team Section'}
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
                    Heading *
                  </label>
                  <input
                    type="text"
                    value={formData.heading || ''}
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                    required
                  />
                </div>
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

              {/* Team Members */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Team Members
                  </label>
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Plus size={16} />
                    Add Member
                  </button>
                </div>
                <div className="space-y-4">
                  {(formData.team_members || []).map((member, index) => {
                    const uploadKey = `${editingId || 'new'}-${index}`
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Team Member {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                              placeholder="Full Name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Role *</label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                              placeholder="Job Title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
                          <textarea
                            value={member.bio}
                            onChange={(e) => updateTeamMember(index, 'bio', e.target.value)}
                            placeholder="Short bio or description"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Image</label>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                ref={(el) => (fileInputRefs.current[index] = el)}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, index)}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRefs.current[index]?.click()}
                                disabled={uploading[uploadKey]}
                                className="flex items-center gap-2 px-3 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              >
                                {uploading[uploadKey] ? (
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
                              value={member.image}
                              onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                              placeholder="Or enter image URL"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                            />
                            {member.image && (
                              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                  src={member.image}
                                  alt={member.name || 'Team member'}
                                  fill
                                  sizes="96px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {(!formData.team_members || formData.team_members.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No team members added yet. Click "Add Member" to add one.</p>
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
                  disabled={saving || !formData.heading}
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

        {/* Team Sections List */}
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
                      <div className="text-xs sm:text-sm text-gray-600">{section.heading}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-600">
                        {section.team_members?.length || 0} team members
                      </div>
                      {section.description && (
                        <div className="text-xs sm:text-sm text-gray-500 truncate max-w-xs mt-1">
                          {section.description}
                        </div>
                      )}
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
                No team sections found. Click "Add New Section" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

