'use client'

import { useState } from 'react'
import type { FAQItem } from '@/app/db/schema/content'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus } from 'lucide-react'

interface FAQFormProps {
  faqs: FAQItem[]
  setFaqs: (faqs: FAQItem[]) => void
  onChange: (changedFAQs: FAQItem[], deletedIds: string[]) => void
  changedFAQs: FAQItem[]
  deletedIds: string[]
}

export function FAQForm({ faqs, setFaqs, onChange, changedFAQs, deletedIds }: FAQFormProps) {
  const [newFAQ, setNewFAQ] = useState<Partial<FAQItem>>({ question: '', answer: '' })
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null)

  function handleAddFAQ() {
    if (!newFAQ.question?.trim() || !newFAQ.answer?.trim()) return

    const newItem: FAQItem = {
      id: crypto.randomUUID(),
      question: newFAQ.question,
      answer: newFAQ.answer,
      order: faqs.length + 1,
      weddingConfigId: 'TEMP',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updated = [...faqs, newItem]
    setFaqs(updated)
    onChange([...changedFAQs, newItem], deletedIds)
    setNewFAQ({ question: '', answer: '' })
  }

  function handleEditSave() {
    if (!editingFAQ) return
    const updated = faqs.map(f => (f.id === editingFAQ.id ? editingFAQ : f))
    setFaqs(updated)
    onChange([...changedFAQs.filter(f => f.id !== editingFAQ.id), editingFAQ], deletedIds)
    setEditingFAQ(null)
  }

  function handleDeleteFAQ(id: string) {
    const updated = faqs.filter(f => f.id !== id)
    setFaqs(updated)
    onChange(changedFAQs.filter(f => f.id !== id), [...deletedIds, id])
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2 mt-2">
        {faqs.length > 0 ? (
          faqs.map(faq => {
            const isChanged = changedFAQs.some(f => f.id === faq.id)
            return (
              <li
                key={faq.id}
                className={`rounded-md border p-3 transition-all ${
                  isChanged ? 'bg-yellow-50 ring-2 ring-yellow-400' : ''
                }`}
              >
                {editingFAQ?.id === faq.id ? (
                  <>
                    <Input
                      value={editingFAQ.question}
                      onChange={e =>
                        setEditingFAQ({ ...editingFAQ, question: e.target.value })
                      }
                      className="mb-2"
                    />
                    <Textarea
                      value={editingFAQ.answer}
                      onChange={e =>
                        setEditingFAQ({ ...editingFAQ, answer: e.target.value })
                      }
                      rows={3}
                      className="mb-2"
                    />
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="sm" onClick={() => setEditingFAQ(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleEditSave}>
                        Update
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
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteFAQ(faq.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            )
          })
        ) : (
          <p className="text-sm text-gray-500">No FAQs added yet.</p>
        )}
      </ul>

      <div className="mt-4 space-y-2 border-t pt-4">
        <h4 className="font-semibold">Add New FAQ</h4>

        <Input
          placeholder="Question"
          value={newFAQ.question ?? ''}
          onChange={e => setNewFAQ({ ...newFAQ, question: e.target.value })}
        />

        <Textarea
          placeholder="Answer"
          value={newFAQ.answer ?? ''}
          onChange={e => setNewFAQ({ ...newFAQ, answer: e.target.value })}
          rows={3}
        />

        <Button
          className="w-full flex items-center justify-center gap-2"
          onClick={handleAddFAQ}
        >
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>
    </div>
  )
}
