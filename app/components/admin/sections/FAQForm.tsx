'use client'

import { useState, useEffect } from 'react'
import type { FAQItem } from '@/app/db/schema/content'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus, Undo } from 'lucide-react'

interface FAQFormProps {
  originalFAQs?: FAQItem[]
  resetChanged?: boolean
  onChangeTracking?: (changed: FAQItem[], deletedIds: string[]) => void
}

export function FAQForm({ originalFAQs = [], resetChanged, onChangeTracking }: FAQFormProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>(originalFAQs)
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null)
  const [newFAQ, setNewFAQ] = useState<Partial<FAQItem>>({ question: '', answer: '' })
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setFaqs(originalFAQs)
    setDeletedIds([])
    setChangedIds(new Set())
  }, [originalFAQs])

  useEffect(() => {
    if (resetChanged) {
      setFaqs(originalFAQs)
      setDeletedIds([])
      setChangedIds(new Set())
      setEditingFAQ(null)
    }
  }, [resetChanged, originalFAQs])

  useEffect(() => {
    const changed = faqs.filter(f => changedIds.has(f.id))
    onChangeTracking?.(changed, deletedIds)
  }, [faqs, deletedIds, changedIds, onChangeTracking])

  const handleAddFAQ = () => {
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

    setFaqs(prev => [...prev, newItem])
    setChangedIds(prev => new Set(prev).add(newItem.id))
    setNewFAQ({ question: '', answer: '' })
  }

  const handleEditSave = () => {
    if (!editingFAQ) return

    setFaqs(prev => prev.map(f => (f.id === editingFAQ.id ? { ...editingFAQ } : f)))
    setChangedIds(prev => new Set(prev).add(editingFAQ.id))
    setEditingFAQ(null)
  }

    const handleDeleteFAQ = (id: string) => {
    const faq = faqs.find(f => f.id === id);
    if (!faq) return;

    if (faq.weddingConfigId === 'TEMP') {
      setFaqs(prev => prev.filter(f => f.id !== id));
      setChangedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setDeletedIds(prev =>
        prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
      );
      setChangedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-2 mt-2">
        {faqs.length === 0 && <p className="text-sm text-gray-500">No FAQs added yet.</p>}

        {faqs.map(faq => {
          const isChanged = changedIds.has(faq.id)
          const isDeleted = deletedIds.includes(faq.id)
          const isEditing = editingFAQ?.id === faq.id && !isDeleted

          return (
            <li
              key={faq.id}
              className={`rounded-md border p-3 transition-all ${
                  isDeleted
                    ? 'opacity-50'
                    : isChanged && 'bg-yellow-50 ring-2 ring-yellow-400'
                }`}
            >
              {isEditing ? (
                <>
                  <Input
                    value={editingFAQ.question}
                    onChange={e => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                    className="mb-2"
                  />
                  <Textarea
                    value={editingFAQ.answer}
                    onChange={e => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
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
                  <p className={`font-medium ${isDeleted ? 'line-through' : ''}`}>{faq.question}</p>
                  <p className={`text-sm text-gray-600 ${isDeleted ? 'line-through' : ''}`}>{faq.answer}</p>
                  <div className="flex justify-end gap-1 mt-2">
                    {!isDeleted && (
                      <Button variant="ghost" size="sm" onClick={() => setEditingFAQ(faq)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className={isDeleted ? 'text-black' : 'text-red-600'}
                    >
                      {isDeleted ? <Undo className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </>
              )}
            </li>
          )
        })}
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

        <Button className="w-full flex items-center justify-center gap-2" onClick={handleAddFAQ}>
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>
    </div>
  )
}
