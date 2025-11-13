import { useState } from 'react'
import type { FAQItem, NewFAQItem } from '@/app/db/schema/content'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus } from 'lucide-react'

interface FAQFormProps {
  faqs: FAQItem[]
  addFAQ: (faq: Partial<NewFAQItem>) => Promise<void>
  updateFAQ: (faq: FAQItem) => Promise<void>
  deleteFAQ: (id: string) => Promise<void>
  saving?: boolean
}

export function FAQForm({
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    saving,
  }: FAQFormProps) {
  const [newFAQ, setNewFAQ] = useState<Partial<NewFAQItem>>({
    question: '',
    answer: '',
    order: faqs.length,
  })
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null)

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
                    <Button variant="outline" size="sm" onClick={() => setEditingFAQ(null)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => { editingFAQ && updateFAQ(editingFAQ); setEditingFAQ(null) }} disabled={saving}>
                      {saving ? 'Saving...' : 'Update'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-medium">{faq.question}</p>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                  <div className="flex justify-end gap-1 mt-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditingFAQ(faq)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteFAQ(faq.id)}>
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
          onClick={() => { addFAQ(newFAQ); setNewFAQ({ question: '', answer: '', order: faqs.length + 1 }) }}
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
