'use client'

import { useState } from 'react'
import type { FAQItem, NewFAQItem } from '@/app/db/schema/content'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus } from 'lucide-react'

interface FAQFormProps {
  faqs: FAQItem[]
  setFaqs: (faqs: FAQItem[]) => void
}

export function FAQForm({ faqs, setFaqs }: FAQFormProps) {
  const [newFAQ, setNewFAQ] = useState<Partial<NewFAQItem>>({
    question: '',
    answer: '',
    order: faqs.length,
  })
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleAddFAQ() {
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
        setFaqs([...faqs, data.data])
        setNewFAQ({ question: '', answer: '', order: faqs.length + 1 })
      }
    } catch (err) {
      console.error('Failed to add FAQ', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateFAQ(updatedFAQ: FAQItem) {
    setSaving(true)
    try {
      const res = await fetch(`/api/wedding/faqs/${updatedFAQ.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFAQ),
      })
      const data = await res.json()

      if (data.success) {
        setFaqs(faqs.map((faq) => (faq.id === updatedFAQ.id ? data.data : faq)))
        setEditingFAQ(null)
      }
    } catch (err) {
      console.error('Failed to update FAQ', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteFAQ(id: string) {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    setSaving(true)

    try {
      const res = await fetch(`/api/wedding/faqs/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        setFaqs(faqs.filter((f) => f.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete FAQ', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <li key={faq.id} className="rounded-md border p-3">
              {editingFAQ?.id === faq.id ? (
                <>
                  <Input
                    value={editingFAQ.question}
                    onChange={(e) =>
                      setEditingFAQ({ ...editingFAQ, question: e.target.value })
                    }
                    className="mb-2"
                  />
                  <Textarea
                    value={editingFAQ.answer}
                    onChange={(e) =>
                      setEditingFAQ({ ...editingFAQ, answer: e.target.value })
                    }
                    rows={3}
                    className="mb-2"
                  />
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingFAQ(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUpdateFAQ(editingFAQ)}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Update'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-medium">{faq.question}</p>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                  <div className="flex justify-end gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingFAQ(faq)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFAQ(faq.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">No FAQs added yet.</p>
        )}
      </ul>

      <div className="mt-4 space-y-2 border-t pt-4">
        <h4 className="font-semibold">Add New FAQ</h4>
        <Input
          placeholder="Question"
          value={newFAQ.question || ''}
          onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
        />
        <Textarea
          placeholder="Answer"
          value={newFAQ.answer || ''}
          onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
          rows={3}
        />
        <Button
          onClick={handleAddFAQ}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {saving ? 'Saving...' : 'Add FAQ'}
        </Button>
      </div>
    </div>
  )
}
