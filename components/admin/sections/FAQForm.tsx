'use client'

/**
 * FAQ Section Form Component
 *
 * Form for managing FAQ items using react-hook-form's useFieldArray.
 * Features:
 * - Single form managing entire FAQ list
 * - Add, edit, remove items inline
 * - Auto-draft saving via context
 * - Change tracking without manual state
 */

import { useEffect, useRef } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFaqItemSchema } from '@/lib/validations/faq-section'
import { useDraft } from '@/context/DraftContext'
import type { FAQItem } from '@/db/schema/content'
import { z } from 'zod'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { SectionFieldWrapper } from '@/components/admin/sections/SectionFieldWrapper'
import { Trash2, Plus } from 'lucide-react'
import type { WeddingConfiguration } from '@/db/schema/weddings'

// Form schema for the entire FAQ list
const faqFormSchema = z.object({
  faqs: z.array(createFaqItemSchema),
})

type FAQFormData = z.infer<typeof faqFormSchema>

interface FAQFormProps {
  weddingConfig: WeddingConfiguration
  faqSectionContent: FAQItem[] | null
  onChangeTracking?: (hasChanges: boolean, changedFields: Set<string>) => void
}

export function FAQForm({ faqSectionContent, onChangeTracking }: FAQFormProps) {
  // Use draft context
  const { draft: draftFAQs, setDraft: setDraftFAQs } = useDraft('faqs')

  // Initialize form data from draft or saved content
  const initialFaqs = (draftFAQs ?? faqSectionContent ?? []).map((faq) => ({
    question: faq.question ?? '',
    answer: faq.answer ?? '',
    order: faq.order ?? 1,
  }))

  // Single form managing entire FAQ list
  const { register, control, reset } = useForm<FAQFormData>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      faqs: initialFaqs,
    },
  })

  // useFieldArray for managing FAQ items
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'faqs',
  })

  // Reset form when saved content changes (after save or discard)
  const prevFaqSectionContent = useRef(faqSectionContent)
  useEffect(() => {
    if (prevFaqSectionContent.current !== faqSectionContent) {
      prevFaqSectionContent.current = faqSectionContent
      const resetFaqs = (faqSectionContent ?? []).map((faq) => ({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
      }))
      reset({ faqs: resetFaqs })
    }
  }, [faqSectionContent, reset])

  // Watch all form values for change tracking
  const watchedFaqs = useWatch({
    control,
    name: 'faqs',
  })

  // Auto-save to draft and track changes
  useEffect(() => {
    if (!watchedFaqs) return

    const savedFaqs = faqSectionContent ?? []

    // Normalize values for comparison (treat null, undefined, and empty string as equivalent)
    const normalizeValue = (val: string | null | undefined) => val?.trim() ?? ''

    // Convert watched values to draft format (only if we have actual content)
    const hasContent = watchedFaqs.some(
      (faq) => normalizeValue(faq?.question) || normalizeValue(faq?.answer)
    )

    if (!hasContent && savedFaqs.length === 0) {
      // No content and nothing saved - clear draft
      setDraftFAQs(undefined)
      onChangeTracking?.(false, new Set())
      return
    }

    // Detect changes by comparing with saved content (before building draft)
    let hasChanges = watchedFaqs.length !== savedFaqs.length

    if (!hasChanges && savedFaqs.length > 0) {
      // Check if any FAQ item changed (normalized comparison)
      hasChanges = watchedFaqs.some((watchedFaq, index) => {
        const savedFaq = savedFaqs[index]
        if (!savedFaq) return true
        return (
          normalizeValue(watchedFaq?.question) !== normalizeValue(savedFaq.question) ||
          normalizeValue(watchedFaq?.answer) !== normalizeValue(savedFaq.answer) ||
          (watchedFaq?.order ?? index + 1) !== savedFaq.order
        )
      })
    }

    // Only build and set draft if there are actual changes
    if (hasChanges) {
      const draft: Partial<FAQItem>[] = watchedFaqs.map((faq, index) => {
        const savedFaq = savedFaqs[index]
        return {
          id: savedFaq?.id ?? crypto.randomUUID(),
          question: faq?.question ?? '',
          answer: faq?.answer ?? '',
          order: faq?.order ?? index + 1,
          weddingConfigId: savedFaq?.weddingConfigId ?? 'TEMP',
          createdAt: savedFaq?.createdAt ?? new Date(),
          updatedAt: new Date(),
        }
      })
      setDraftFAQs(draft)
    } else {
      setDraftFAQs(undefined)
    }

    // Notify parent about changes
    const changedFields = hasChanges ? new Set(['faqs']) : new Set<string>()
    onChangeTracking?.(hasChanges, changedFields)
  }, [watchedFaqs, faqSectionContent, setDraftFAQs, onChangeTracking])

  // Add new FAQ item
  const handleAddFaq = () => {
    const newOrder = fields.length + 1
    append({
      question: '',
      answer: '',
      order: newOrder,
    })
  }

  // Remove FAQ item (hard delete, no undo)
  const handleRemoveFaq = (index: number) => {
    remove(index)
  }

  return (
    <div className="space-y-6">
      {/* Existing FAQ Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">FAQ Items</h3>

        {fields.length === 0 && <p className="text-sm text-gray-500">No FAQs added yet.</p>}

        <ul className="space-y-3">
          {fields.map((field, index) => {
            const watchedFaq = watchedFaqs?.[index]
            const savedFaq = faqSectionContent?.[index]

            // Normalize values for comparison
            const normalizeValue = (val: string | null | undefined) => val?.trim() ?? ''

            // Determine if this item has changes
            const hasChanges =
              !savedFaq ||
              normalizeValue(watchedFaq?.question) !== normalizeValue(savedFaq.question) ||
              normalizeValue(watchedFaq?.answer) !== normalizeValue(savedFaq.answer)

            return (
              <li
                key={field.id}
                className={`rounded-lg border p-4 transition-all ${
                  hasChanges ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-400' : ''
                }`}
              >
                <div className="space-y-3">
                  <SectionFieldWrapper
                    isChanged={hasChanges}
                    value={watchedFaq?.question}
                    validationSchema={createFaqItemSchema.shape.question}
                  >
                    <Label htmlFor={`faq-question-${index}`}>Question {index + 1}</Label>
                    <Input
                      {...register(`faqs.${index}.question` as const)}
                      id={`faq-question-${index}`}
                      placeholder="Enter question"
                    />
                  </SectionFieldWrapper>

                  <SectionFieldWrapper
                    isChanged={hasChanges}
                    value={watchedFaq?.answer}
                    validationSchema={createFaqItemSchema.shape.answer}
                  >
                    <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                    <Textarea
                      {...register(`faqs.${index}.answer` as const)}
                      id={`faq-answer-${index}`}
                      placeholder="Enter answer"
                      rows={3}
                    />
                  </SectionFieldWrapper>

                  {/* Hidden field for order */}
                  <input
                    type="hidden"
                    {...register(`faqs.${index}.order` as const, {
                      valueAsNumber: true,
                    })}
                    value={index + 1}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFaq(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Add New FAQ Button */}
      <div className="border-t pt-6">
        <Button type="button" onClick={handleAddFaq} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add FAQ
        </Button>
      </div>
    </div>
  )
}
