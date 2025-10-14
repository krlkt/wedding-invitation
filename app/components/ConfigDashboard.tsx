/**
 * T065: Configuration Dashboard Interface
 *
 * Main dashboard for managing wedding configuration.
 * Includes forms for basic settings, features, and content management.
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import LivePreview from './LivePreview'

export default function ConfigDashboard() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'features' | 'content'>('basic')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  //WIP: session check on dashboard load or time interval or user action?
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (!data.success) {
        window.location.href = '/login'
      }
    } catch (err) {
      console.error('Session check failed', err)
      window.location.href = '/login'
    }
  }

  useEffect(() => {
    fetchConfig()
    checkSession()
  }, [])

  async function fetchConfig() {
    try {
      const response = await fetch('/api/wedding/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateConfig(updates: any) {
    try {
      setSaving(true)
      const response = await fetch('/api/wedding/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setConfig(data.data)
        setRefreshTrigger((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to update config:', error)
    } finally {
      setSaving(false)
    }
  }

  async function toggleFeature(featureName: string, isEnabled: boolean) {
    try {
      const response = await fetch('/api/wedding/config/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureName, isEnabled }),
      })

      if (response.ok) {
        fetchConfig()
        setRefreshTrigger((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error)
    }
  }

  async function handlePublish() {
    try {
      setSaving(true)
      const response = await fetch('/api/wedding/publish', {
        method: 'POST',
      })

      if (response.ok) {
        fetchConfig()
      }
    } catch (error) {
      console.error('Failed to publish:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleUnpublish() {
    try {
      setSaving(true)
      const response = await fetch('/api/wedding/unpublish', {
        method: 'POST',
      })

      if (response.ok) {
        fetchConfig()
      }
    } catch (error) {
      console.error('Failed to unpublish:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-pink-600" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return <div className="p-8 text-center">No configuration found</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - Configuration */}
      <div className="w-1/2 overflow-auto border-r bg-white">
        <div className="sticky top-0 z-10 border-b bg-white">
          <div className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Wedding Configuration</h1>
              <Button asChild>
                <Link href="/admin/preview" target="_blank">
                  View Live Site
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-600">{config.subdomain}.yourdomain.com</p>
          </div>

          {/* Tabs */}
          <div className="flex border-t">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'basic'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'features'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'content'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Content
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
            <BasicInfoForm config={config} onUpdate={updateConfig} saving={saving} />
          )}
          {activeTab === 'features' && <FeaturesForm config={config} onToggle={toggleFeature} />}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <p className="text-gray-600">Content management coming soon...</p>
              <p className="text-sm text-gray-500">
                Manage love story, locations, FAQs, and other content here.
              </p>
            </div>
          )}
        </div>

        {/* Publish Section */}
        <div className="sticky bottom-0 border-t bg-white p-6">
          {config.isPublished ? (
            <button
              onClick={handleUnpublish}
              disabled={saving}
              className="w-full rounded-lg bg-gray-600 px-4 py-3 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? 'Unpublishing...' : 'Unpublish Wedding'}
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={saving}
              className="w-full rounded-lg bg-pink-600 px-4 py-3 text-white hover:bg-pink-700 disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish Wedding'}
            </button>
          )}
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-1/2">
        <LivePreview weddingConfigId={config.id} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}

function BasicInfoForm({ config, onUpdate, saving }: any) {
  const [formData, setFormData] = useState({
    groomName: config.groomName,
    brideName: config.brideName,
    weddingDate: config.weddingDate?.split('T')[0] || '',
    groomFather: config.groomFather || '',
    groomMother: config.groomMother || '',
    brideFather: config.brideFather || '',
    brideMother: config.brideMother || '',
    instagramLink: config.instagramLink || '',
    footerText: config.footerText || '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onUpdate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Groom Name</label>
          <input
            type="text"
            value={formData.groomName}
            onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Bride Name</label>
          <input
            type="text"
            value={formData.brideName}
            onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Wedding Date</label>
        <input
          type="date"
          value={formData.weddingDate}
          onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Groom&apos;s Father</label>
          <input
            type="text"
            value={formData.groomFather}
            onChange={(e) => setFormData({ ...formData, groomFather: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Groom&apos;s Mother</label>
          <input
            type="text"
            value={formData.groomMother}
            onChange={(e) => setFormData({ ...formData, groomMother: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Bride&apos;s Father</label>
          <input
            type="text"
            value={formData.brideFather}
            onChange={(e) => setFormData({ ...formData, brideFather: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Bride&apos;s Mother</label>
          <input
            type="text"
            value={formData.brideMother}
            onChange={(e) => setFormData({ ...formData, brideMother: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Instagram Link</label>
        <input
          type="url"
          value={formData.instagramLink}
          onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="https://instagram.com/..."
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Footer Text</label>
        <textarea
          value={formData.footerText}
          onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

function FeaturesForm({ config, onToggle }: any) {
  const features = [
    { name: 'love_story', label: 'Love Story', description: 'Timeline of your relationship' },
    { name: 'rsvp', label: 'RSVP', description: 'Guest response management' },
    { name: 'gallery', label: 'Gallery', description: 'Photo gallery' },
    { name: 'prewedding_videos', label: 'Pre-wedding Videos', description: 'Video embeds' },
    { name: 'faqs', label: 'FAQs', description: 'Frequently asked questions' },
    { name: 'dress_code', label: 'Dress Code', description: 'Attire guidelines' },
    { name: 'instagram_link', label: 'Instagram Link', description: 'Social media link' },
  ]

  return (
    <div className="space-y-4">
      {features.map((feature) => (
        <div key={feature.name} className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 className="font-medium">{feature.label}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
          <button
            onClick={() => onToggle(feature.name, !config.features[feature.name])}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.features[feature.name] ? 'bg-pink-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.features[feature.name] ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  )
}
