'use client';

/**
 * Love Story Section Form Component
 *
 * Form for managing love story timeline segments using react-hook-form's useFieldArray.
 * Features:
 * - Single form managing entire love story timeline
 * - Add, edit, remove, reorder items with drag-and-drop
 * - Auto-draft saving via context
 * - Change tracking without manual state
 */

import { useRef, useCallback, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLoveStorySegmentSchema } from '@/lib/validations/love-story-section';
import { useDraft } from '@/context/DraftContext';
import type { LoveStorySegment } from '@/db/schema/content';
import { z } from 'zod';
import { Button } from '@/components/shadcn/button';

import { Plus } from 'lucide-react';
import type { WeddingConfiguration } from '@/db/schema/weddings';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { type IconType } from '@/lib/icon-mapping';
import DraggableSegmentItem from './DraggableSegmentItem';

// Form schema for the entire love story timeline
const loveStoryFormSchema = z.object({
  segments: z.array(createLoveStorySegmentSchema),
});

type LoveStoryFormData = z.infer<typeof loveStoryFormSchema>;

interface LoveStoryFormProps {
  weddingConfig: WeddingConfiguration;
  loveStoryContent: LoveStorySegment[] | null;
  onChangeTracking?: (hasChanges: boolean, changedFields: Set<string>) => void;
}

export function LoveStoryForm({ loveStoryContent, onChangeTracking }: LoveStoryFormProps) {
  // Use draft context
  const { draft: draftSegments, setDraft: setDraftSegments } = useDraft('loveStory');

  // Initialize form data from draft or saved content
  const initialSegments = (draftSegments ?? loveStoryContent ?? []).map((segment) => ({
    title: segment.title ?? '',
    description: segment.description ?? '',
    date: segment.date ?? '',
    iconType: (segment.iconType ?? 'meet') as IconType,
    order: segment.order ?? 1,
  }));

  // Single form managing entire love story timeline
  const { register, control, reset, setValue } = useForm<LoveStoryFormData>({
    resolver: zodResolver(loveStoryFormSchema),
    defaultValues: {
      segments: initialSegments,
    },
  });

  // useFieldArray for managing love story segments
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'segments',
  });

  // Reset form when saved content changes (after save or discard)
  const prevLoveStoryContent = useRef(loveStoryContent);
  useEffect(() => {
    if (prevLoveStoryContent.current !== loveStoryContent) {
      prevLoveStoryContent.current = loveStoryContent;
      const resetSegments = (loveStoryContent ?? []).map((segment) => ({
        title: segment.title,
        description: segment.description,
        date: segment.date,
        iconType: segment.iconType as IconType,
        order: segment.order,
      }));
      reset({ segments: resetSegments });
    }
  }, [loveStoryContent, reset]);

  // Watch all form values for change tracking
  const watchedSegments = useWatch({
    control,
    name: 'segments',
  });

  // Auto-save to draft and track changes
  useEffect(() => {
    if (!watchedSegments) return;

    const savedSegments = loveStoryContent ?? [];

    // Normalize values for comparison (treat null, undefined, and empty string as equivalent)
    const normalizeValue = (val: string | null | undefined) => val?.trim() ?? '';

    // Convert watched values to draft format (only if we have actual content)
    const hasContent = watchedSegments.some(
      (seg) =>
        normalizeValue(seg?.title) || normalizeValue(seg?.description) || normalizeValue(seg?.date)
    );

    if (!hasContent && savedSegments.length === 0) {
      // No content and nothing saved - clear draft
      setDraftSegments(undefined);
      onChangeTracking?.(false, new Set());
      return;
    }

    // Detect changes by comparing with saved content (before building draft)
    let hasChanges = watchedSegments.length !== savedSegments.length;

    if (!hasChanges && savedSegments.length > 0) {
      // Check if any segment changed (normalized comparison)
      hasChanges = watchedSegments.some((watchedSeg, index) => {
        const savedSeg = savedSegments[index];
        if (!savedSeg) return true;
        return (
          normalizeValue(watchedSeg?.title) !== normalizeValue(savedSeg.title) ||
          normalizeValue(watchedSeg?.description) !== normalizeValue(savedSeg.description) ||
          normalizeValue(watchedSeg?.date) !== normalizeValue(savedSeg.date) ||
          watchedSeg?.iconType !== savedSeg.iconType ||
          (watchedSeg?.order ?? index + 1) !== savedSeg.order
        );
      });
    }

    // Only build and set draft if there are actual changes
    if (hasChanges) {
      const draft: Partial<LoveStorySegment>[] = watchedSegments.map((seg, index) => {
        const savedSeg = savedSegments[index];
        return {
          id: savedSeg?.id ?? crypto.randomUUID(),
          title: seg?.title ?? '',
          description: seg?.description ?? '',
          date: seg?.date ?? '',
          iconType: seg?.iconType ?? 'meet',
          order: seg?.order ?? index + 1,
          weddingConfigId: savedSeg?.weddingConfigId ?? 'TEMP',
          createdAt: savedSeg?.createdAt ?? new Date(),
          updatedAt: new Date(),
        };
      });
      setDraftSegments(draft);
    } else {
      setDraftSegments(undefined);
    }

    // Notify parent about changes
    const changedFields = hasChanges ? new Set(['loveStory']) : new Set<string>();
    onChangeTracking?.(hasChanges, changedFields);
  }, [watchedSegments, loveStoryContent, setDraftSegments, onChangeTracking]);

  // Add new segment
  const handleAddSegment = () => {
    const newOrder = fields.length + 1;
    append({
      title: '',
      description: '',
      date: '',
      iconType: 'meet',
      order: newOrder,
    });
  };

  // Remove segment (hard delete, no undo)
  const handleRemoveSegment = (index: number) => {
    remove(index);
  };

  // Move segment (drag-and-drop callback)
  const moveSegment = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      move(dragIndex, hoverIndex);
      // Update order fields after move
      setTimeout(() => {
        fields.forEach((_, idx) => {
          setValue(`segments.${idx}.order`, idx + 1);
        });
      }, 0);
    },
    [move, fields, setValue]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Existing Love Story Segments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Love Story Timeline</h3>

          {fields.length === 0 && (
            <p className="text-sm text-gray-500">No love story segments added yet.</p>
          )}

          <ul className="space-y-3">
            {fields.map((field, index) => (
              <DraggableSegmentItem
                key={field.id}
                index={index}
                field={field}
                watchedSegments={watchedSegments}
                savedSegments={loveStoryContent ?? []}
                register={register}
                setValue={setValue}
                onRemove={handleRemoveSegment}
                onMove={moveSegment}
              />
            ))}
          </ul>
        </div>

        {/* Add New Segment Button */}
        <div className="border-t pt-6">
          <Button type="button" onClick={handleAddSegment} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Love Story Segment
          </Button>
        </div>
      </div>
    </DndProvider>
  );
}
