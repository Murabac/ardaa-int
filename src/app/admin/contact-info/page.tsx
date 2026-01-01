'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Edit2, Trash2, X } from 'lucide-react'
import type { ContactInfo, BusinessHour, SocialMediaLink } from '@/lib/supabase/contact'
import { Toast } from '@/components/common/Toast'

export default function ContactInfoAdminPage() {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<ContactInfo>>({
    contact_badge_text: 'Get in Touch',
    contact_heading: '',
    contact_description: '',
    phone_1: '',
    phone_2: '',
    email_1: '',
    email_2: '',
    address_lines: [],
    business_hours: [],
    footer_text: '',
    social_media_links: [],
    copyright_text: '© 2024 Ardaa Interior Firm. All rights reserved.',
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchContactInfos()
  }, [])

  const fetchContactInfos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contact-info')
      const result = await response.json()
      if (result.success && result.data) {
        setContactInfos(result.data)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      setMessage({ type: 'error', text: 'Failed to fetch contact info' })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    const lastOrder = contactInfos.length > 0 
      ? Math.max(...contactInfos.map(info => info.display_order)) + 1 
      : 0
    
    setFormData({
      contact_badge_text: 'Get in Touch',
      contact_heading: '',
      contact_description: '',
      phone_1: '',
      phone_2: '',
      email_1: '',
      email_2: '',
      address_lines: [],
      business_hours: [],
      footer_text: '',
      social_media_links: [],
      copyright_text: '© 2024 Ardaa Interior Firm. All rights reserved.',
      display_order: lastOrder,
      is_active: true,
    })
    setEditingId(null)
    setShowAddForm(true)
  }

  const handleEdit = (info: ContactInfo) => {
    setFormData({
      contact_badge_text: info.contact_badge_text || 'Get in Touch',
      contact_heading: info.contact_heading,
      contact_description: info.contact_description || '',
      phone_1: info.phone_1,
      phone_2: info.phone_2 || '',
      email_1: info.email_1,
      email_2: info.email_2 || '',
      address_lines: info.address_lines || [],
      business_hours: info.business_hours || [],
      footer_text: info.footer_text || '',
      social_media_links: info.social_media_links || [],
      copyright_text: info.copyright_text || '© 2024 Ardaa Interior Firm. All rights reserved.',
      display_order: info.display_order,
      is_active: info.is_active,
    })
    setEditingId(info.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact info?')) return

    try {
      const response = await fetch(`/api/admin/contact-info?id=${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Contact info deleted successfully!' })
        fetchContactInfos()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete contact info' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete contact info' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const url = '/api/admin/contact-info'
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
        setMessage({ type: 'success', text: editingId ? 'Contact info updated successfully!' : 'Contact info added successfully!' })
        setShowAddForm(false)
        setEditingId(null)
        fetchContactInfos()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save contact info' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save contact info' })
    } finally {
      setSaving(false)
    }
  }

  // Address lines handlers
  const addAddressLine = () => {
    setFormData({
      ...formData,
      address_lines: [...(formData.address_lines || []), '']
    })
  }

  const updateAddressLine = (index: number, value: string) => {
    const lines = [...(formData.address_lines || [])]
    lines[index] = value
    setFormData({ ...formData, address_lines: lines })
  }

  const removeAddressLine = (index: number) => {
    const lines = [...(formData.address_lines || [])]
    lines.splice(index, 1)
    setFormData({ ...formData, address_lines: lines })
  }

  // Business hours handlers
  const addBusinessHour = () => {
    setFormData({
      ...formData,
      business_hours: [...(formData.business_hours || []), { day: '', hours: '' }]
    })
  }

  const updateBusinessHour = (index: number, field: keyof BusinessHour, value: string) => {
    const hours = [...(formData.business_hours || [])]
    hours[index] = { ...hours[index], [field]: value }
    setFormData({ ...formData, business_hours: hours })
  }

  const removeBusinessHour = (index: number) => {
    const hours = [...(formData.business_hours || [])]
    hours.splice(index, 1)
    setFormData({ ...formData, business_hours: hours })
  }

  // Social media links handlers
  const addSocialMediaLink = () => {
    setFormData({
      ...formData,
      social_media_links: [...(formData.social_media_links || []), { platform: '', url: '' }]
    })
  }

  const updateSocialMediaLink = (index: number, field: keyof SocialMediaLink, value: string) => {
    const links = [...(formData.social_media_links || [])]
    links[index] = { ...links[index], [field]: value }
    setFormData({ ...formData, social_media_links: links })
  }

  const removeSocialMediaLink = (index: number) => {
    const links = [...(formData.social_media_links || [])]
    links.splice(index, 1)
    setFormData({ ...formData, social_media_links: links })
  }

  const sortedInfos = [...contactInfos].sort((a, b) => a.display_order - b.display_order)

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Info Management</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span className="text-sm sm:text-base">Add New Contact Info</span>
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
                {editingId ? 'Edit Contact Info' : 'Add New Contact Info'}
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
              {/* Contact Section Header */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Section Header</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={formData.contact_badge_text || ''}
                      onChange={(e) => setFormData({ ...formData, contact_badge_text: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heading *
                    </label>
                    <input
                      type="text"
                      value={formData.contact_heading || ''}
                      onChange={(e) => setFormData({ ...formData, contact_heading: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.contact_description || ''}
                    onChange={(e) => setFormData({ ...formData, contact_description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone 1 *
                    </label>
                    <input
                      type="text"
                      value={formData.phone_1 || ''}
                      onChange={(e) => setFormData({ ...formData, phone_1: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone 2
                    </label>
                    <input
                      type="text"
                      value={formData.phone_2 || ''}
                      onChange={(e) => setFormData({ ...formData, phone_2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email 1 *
                    </label>
                    <input
                      type="email"
                      value={formData.email_1 || ''}
                      onChange={(e) => setFormData({ ...formData, email_1: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email 2
                    </label>
                    <input
                      type="email"
                      value={formData.email_2 || ''}
                      onChange={(e) => setFormData({ ...formData, email_2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Address Lines */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address Lines
                  </label>
                  <button
                    type="button"
                    onClick={addAddressLine}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Plus size={16} />
                    Add Line
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.address_lines || []).map((line, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={line}
                        onChange={(e) => updateAddressLine(index, e.target.value)}
                        placeholder={`Address line ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                      />
                      <button
                        type="button"
                        onClick={() => removeAddressLine(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {(!formData.address_lines || formData.address_lines.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No address lines added yet. Click &quot;Add Line&quot; to add one.</p>
                  )}
                </div>
              </div>

              {/* Business Hours */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Business Hours
                  </label>
                  <button
                    type="button"
                    onClick={addBusinessHour}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Plus size={16} />
                    Add Hours
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.business_hours || []).map((hour, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Hours {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeBusinessHour(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={hour.day}
                          onChange={(e) => updateBusinessHour(index, 'day', e.target.value)}
                          placeholder="Day (e.g., Monday - Friday)"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                        />
                        <input
                          type="text"
                          value={hour.hours}
                          onChange={(e) => updateBusinessHour(index, 'hours', e.target.value)}
                          placeholder="Hours (e.g., 8:00 AM - 5:00 PM)"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  {(!formData.business_hours || formData.business_hours.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No business hours added yet. Click &quot;Add Hours&quot; to add one.</p>
                  )}
                </div>
              </div>

              {/* Footer Content */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Content</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Text
                  </label>
                  <textarea
                    value={formData.footer_text || ''}
                    onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Copyright Text
                  </label>
                  <input
                    type="text"
                    value={formData.copyright_text || ''}
                    onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Social Media Links
                  </label>
                  <button
                    type="button"
                    onClick={addSocialMediaLink}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Plus size={16} />
                    Add Link
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.social_media_links || []).map((link, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Link {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeSocialMediaLink(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={link.platform}
                          onChange={(e) => updateSocialMediaLink(index, 'platform', e.target.value)}
                          placeholder="Platform (e.g., Facebook, Instagram)"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateSocialMediaLink(index, 'url', e.target.value)}
                          placeholder="URL"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  {(!formData.social_media_links || formData.social_media_links.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No social media links added yet. Click &quot;Add Link&quot; to add one.</p>
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
                  disabled={saving || !formData.contact_heading || !formData.phone_1 || !formData.email_1}
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
                      {editingId ? 'Update' : 'Add'} Contact Info
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

        {/* Contact Info List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[640px] sm:min-w-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badge / Heading
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Details
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
                {sortedInfos.map((info) => (
                  <tr key={info.id} className={!info.is_active ? 'opacity-50' : ''}>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-900 font-medium">{info.contact_badge_text || 'N/A'}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{info.contact_heading}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <div>📞 {info.phone_1}</div>
                        <div>✉️ {info.email_1}</div>
                        <div>{info.address_lines?.length || 0} address lines</div>
                        <div>{info.business_hours?.length || 0} business hours</div>
                        <div>{info.social_media_links?.length || 0} social links</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          info.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {info.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(info)}
                          className="text-[#1d2856] hover:text-[#1d2856]/80"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(info.id)}
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
            {sortedInfos.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No contact info found. Click &quot;Add New Contact Info&quot; to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

