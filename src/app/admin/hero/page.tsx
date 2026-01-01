'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Loader2, CheckCircle2, Upload } from 'lucide-react'
import type { HeroSection } from '@/lib/supabase/hero'
import Image from 'next/image'
import { Toast } from '@/components/common/Toast'

const categories = ['Residential', 'Office', 'Government', 'Mosque']

export default function HeroAdminPage() {
  const [heroData, setHeroData] = useState<HeroSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({})
  
  const fileInputRefs = {
    project1: useRef<HTMLInputElement>(null),
    project2: useRef<HTMLInputElement>(null),
    project3: useRef<HTMLInputElement>(null),
  }

  useEffect(() => {
    fetchHeroData()
  }, [])

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/hero')
      const result = await response.json()
      if (result.success && result.data) {
        setHeroData(result.data)
      }
    } catch (error) {
      console.error('Error fetching hero data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, projectKey: 'project1' | 'project2' | 'project3') => {
    const fieldName = `featured_project_${projectKey === 'project1' ? '1' : projectKey === 'project2' ? '2' : '3'}_image_url`
    setUploading({ ...uploading, [projectKey]: true })
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'hero')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setHeroData({ ...heroData, [fieldName]: result.url } as HeroSection)
        setMessage({ type: 'success', text: 'Image uploaded successfully!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload image' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' })
    } finally {
      setUploading({ ...uploading, [projectKey]: false })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, projectKey: 'project1' | 'project2' | 'project3') => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, projectKey)
    }
    // Reset input
    if (e.target) {
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      // Clean the data to only include valid fields
      const cleanData = {
        id: heroData?.id,
        badge_text: heroData?.badge_text,
        title_line1: heroData?.title_line1,
        description: heroData?.description,
        features: heroData?.features || [],
        featured_image_url: heroData?.featured_image_url,
        featured_project_title: heroData?.featured_project_title,
        featured_project_1_title: heroData?.featured_project_1_title,
        featured_project_1_image_url: heroData?.featured_project_1_image_url,
        featured_project_1_category: heroData?.featured_project_1_category,
        featured_project_2_title: heroData?.featured_project_2_title,
        featured_project_2_image_url: heroData?.featured_project_2_image_url,
        featured_project_2_category: heroData?.featured_project_2_category,
        featured_project_3_title: heroData?.featured_project_3_title,
        featured_project_3_image_url: heroData?.featured_project_3_image_url,
        featured_project_3_category: heroData?.featured_project_3_category,
        gallery_images: heroData?.gallery_images || [],
        is_active: heroData?.is_active,
        display_order: heroData?.display_order
      }

      const response = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Hero section updated successfully!' })
        await fetchHeroData()
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update hero section' })
        // Clear error after 5 seconds
        setTimeout(() => setMessage(null), 5000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update hero section' })
      // Clear error after 5 seconds
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#1d2856]" />
      </div>
    )
  }

  if (!heroData) {
    return <div className="text-center py-12">No hero data found</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hero Section</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your hero section content</p>
      </div>

      <Toast
        message={message?.text || ''}
        type={message?.type || 'success'}
        isVisible={!!message}
        onClose={() => setMessage(null)}
        duration={message?.type === 'success' ? 3000 : 5000}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Form Section */}
        <div className="space-y-4 sm:space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={heroData.badge_text || ''}
                  onChange={(e) => setHeroData({ ...heroData, badge_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title Line 1
                </label>
                <input
                  type="text"
                  value={heroData.title_line1}
                  onChange={(e) => setHeroData({ ...heroData, title_line1: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={heroData.description}
                  onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (one per line)
                </label>
                <textarea
                  value={heroData.features.join('\n')}
                  onChange={(e) => setHeroData({ ...heroData, features: e.target.value.split('\n').filter(f => f.trim()) })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>
            </div>


            {/* Featured Projects */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2">Featured Projects</h2>
              
              {/* Project 1 */}
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-gray-900">Featured Project 1</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={heroData.featured_project_1_title || ''}
                    onChange={(e) => setHeroData({ ...heroData, featured_project_1_title: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRefs.project1}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'project1')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.project1.current?.click()}
                        disabled={uploading.project1}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {uploading.project1 ? (
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
                      value={heroData.featured_project_1_image_url || ''}
                      onChange={(e) => setHeroData({ ...heroData, featured_project_1_image_url: e.target.value || null })}
                      placeholder="Or enter image URL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                    />
                    {heroData.featured_project_1_image_url && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={heroData.featured_project_1_image_url}
                          alt="Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={heroData.featured_project_1_category || ''}
                    onChange={(e) => setHeroData({ ...heroData, featured_project_1_category: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project 2 */}
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-gray-900">Featured Project 2</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={heroData.featured_project_2_title || ''}
                    onChange={(e) => setHeroData({ ...heroData, featured_project_2_title: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRefs.project2}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'project2')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.project2.current?.click()}
                        disabled={uploading.project2}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {uploading.project2 ? (
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
                      value={heroData.featured_project_2_image_url || ''}
                      onChange={(e) => setHeroData({ ...heroData, featured_project_2_image_url: e.target.value || null })}
                      placeholder="Or enter image URL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                    />
                    {heroData.featured_project_2_image_url && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={heroData.featured_project_2_image_url}
                          alt="Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={heroData.featured_project_2_category || ''}
                    onChange={(e) => setHeroData({ ...heroData, featured_project_2_category: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project 3 */}
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-gray-900">Featured Project 3</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={heroData.featured_project_3_title || ''}
                    onChange={(e) => setHeroData({ ...heroData, featured_project_3_title: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRefs.project3}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'project3')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.project3.current?.click()}
                        disabled={uploading.project3}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {uploading.project3 ? (
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
                      value={heroData.featured_project_3_image_url || ''}
                      onChange={(e) => setHeroData({ ...heroData, featured_project_3_image_url: e.target.value || null })}
                      placeholder="Or enter image URL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black text-sm"
                    />
                    {heroData.featured_project_3_image_url && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={heroData.featured_project_3_image_url}
                          alt="Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={heroData.featured_project_3_category || ''}
                    onChange={(e) => setHeroData({ ...heroData, featured_project_3_category: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d2856] text-black"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>


            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => fetchHeroData()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-[#1d2856] text-white rounded-lg hover:bg-[#1d2856]/90 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:sticky lg:top-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="bg-gradient-to-br from-[#1d2856] to-[#1d2856] p-8">
              {/* Badge */}
              {heroData.badge_text && (
                <span className="inline-block px-4 py-1 bg-[#E87842] text-white text-sm rounded-full mb-4">
                  {heroData.badge_text}
                </span>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {heroData.title_line1}
              </h1>

              {/* Description */}
              <p className="text-lg text-white/90 mb-6 max-w-2xl">
                {heroData.description}
              </p>

              {/* Features */}
              {heroData.features.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {heroData.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-white">
                      <CheckCircle2 className="w-5 h-5 text-[#E87842]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}


              {/* Featured Projects Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {heroData.featured_project_1_image_url && (
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={heroData.featured_project_1_image_url}
                      alt={heroData.featured_project_1_title || 'Featured Project 1'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                {heroData.featured_project_2_image_url && (
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={heroData.featured_project_2_image_url}
                      alt={heroData.featured_project_2_title || 'Featured Project 2'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                {heroData.featured_project_3_image_url && (
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={heroData.featured_project_3_image_url}
                      alt={heroData.featured_project_3_title || 'Featured Project 3'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
