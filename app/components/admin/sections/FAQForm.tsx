import type { FAQItem, NewFAQItem } from '@/app/db/schema/content'
import { Button } from '@mui/material'
import { useState } from 'react'

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

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {faqs.length > 0
          ? faqs.map((faq) => (
              <li key={faq.id} className="rounded-md border p-3">
                <p className="font-medium">{faq.question}</p>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </li>
            ))
          : <p className="text-sm text-gray-500">No FAQs added yet.</p>}
      </ul>

      <div className="mt-4 space-y-2 border-t pt-4">
        <h4 className="font-semibold">Add New FAQ</h4>
        <input
          type="text"
          placeholder="Question"
          value={newFAQ.question || ''}
          onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Answer"
          value={newFAQ.answer || ''}
          onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
          className="w-full rounded-md border px-3 py-2 text-sm"
          rows={3}
        />
        <Button
          onClick={handleAddFAQ}
          disabled={saving}
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          {saving ? 'Saving...' : 'Add FAQ'}
        </Button>
      </div>
    </div>
  )
}
