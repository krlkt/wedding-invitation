'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FAQItem, NewFAQItem } from '@/app/db/schema/content'

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFAQs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/wedding/faqs')
      const data = await res.json()
      if (res.ok && data.success) {
        setFaqs(data.data)
      } else {
        setError('Failed to fetch FAQs')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to fetch FAQs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFAQs()
  }, [fetchFAQs])

  const addFAQ = async (newFAQ: Partial<NewFAQItem>) => {
    if (!newFAQ.question?.trim() || !newFAQ.answer?.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/wedding/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFAQ),
      })
      const data = await res.json()
      if (data.success) {
        setFaqs((prev) => [...prev, data.data])
      }
    } catch (err) {
      console.error(err)
      setError('Failed to add FAQ')
    } finally {
      setSaving(false)
    }
  }

  const updateFAQ = async (updatedFAQ: FAQItem) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/wedding/faqs/${updatedFAQ.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFAQ),
      })
      const data = await res.json()
      if (data.success) {
        setFaqs((prev) => prev.map((f) => (f.id === updatedFAQ.id ? data.data : f)))
      }
    } catch (err) {
      console.error(err)
      setError('Failed to update FAQ')
    } finally {
      setSaving(false)
    }
  }

  const deleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/wedding/faqs/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setFaqs((prev) => prev.filter((f) => f.id !== id))
      }
    } catch (err) {
      console.error(err)
      setError('Failed to delete FAQ')
    } finally {
      setSaving(false)
    }
  }

  return { faqs, loading, saving, error, fetchFAQs, addFAQ, updateFAQ, deleteFAQ }
}
