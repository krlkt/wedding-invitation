import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { SectionFieldWrapper } from '@/components/admin/sections/SectionFieldWrapper';
import { Trash2, GripVertical } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
import { ICON_OPTIONS, getIconComponent } from '@/lib/icon-mapping';
import { LoveStorySegment } from '@/db/schema/content';
import { useRef } from 'react';
import { createLoveStorySegmentSchema } from '@/lib/validations/love-story-section';
import { Button } from '@/components/shadcn/button';

// Draggable segment item component
interface DraggableSegmentItemProps {
  index: number;
  field: any; // Required by react-hook-form useFieldArray pattern
  watchedSegments: any[];
  savedSegments: LoveStorySegment[];
  register: any;
  setValue: any;
  onRemove: (index: number) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

const ITEM_TYPE = 'LOVE_STORY_SEGMENT';

interface DragItem {
  index: number;
}

export default function DraggableSegmentItem({
  index,
  field: _field,
  watchedSegments,
  savedSegments,
  register,
  setValue,
  onRemove,
  onMove,
}: DraggableSegmentItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const watchedSegment = watchedSegments?.[index];
  const savedSegment = savedSegments?.[index];

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: ITEM_TYPE,
    item: () => ({ index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(ref));

  // Normalize values for comparison
  const normalizeValue = (val: string | null | undefined) => val?.trim() ?? '';

  // Determine if this item has changes
  const hasChanges =
    !savedSegment ||
    normalizeValue(watchedSegment?.title) !== normalizeValue(savedSegment.title) ||
    normalizeValue(watchedSegment?.description) !== normalizeValue(savedSegment.description) ||
    normalizeValue(watchedSegment?.date) !== normalizeValue(savedSegment.date) ||
    watchedSegment?.iconType !== savedSegment.iconType;

  return (
    <li
      ref={ref}
      data-handler-id={handlerId}
      className={`rounded-lg border p-4 transition-all ${
        hasChanges ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-400' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex gap-3">
        {/* Drag handle */}
        <div ref={drag as any} className="cursor-move pt-7">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        <div className="flex-1 space-y-3">
          {/* Title */}
          <SectionFieldWrapper
            isChanged={hasChanges}
            value={watchedSegment?.title}
            validationSchema={createLoveStorySegmentSchema.shape.title}
          >
            <Label htmlFor={`segment-title-${index}`}>Title {index + 1}</Label>
            <Input
              {...register(`segments.${index}.title` as const)}
              id={`segment-title-${index}`}
              placeholder="e.g., First Met"
            />
          </SectionFieldWrapper>

          {/* Date */}
          <SectionFieldWrapper
            isChanged={hasChanges}
            value={watchedSegment?.date}
            validationSchema={createLoveStorySegmentSchema.shape.date}
          >
            <Label htmlFor={`segment-date-${index}`}>Date</Label>
            <Input
              {...register(`segments.${index}.date` as const)}
              id={`segment-date-${index}`}
              placeholder="e.g., September 2019, July & October 2023"
            />
          </SectionFieldWrapper>

          {/* Icon */}
          <SectionFieldWrapper
            isChanged={hasChanges}
            value={watchedSegment?.iconType}
            validationSchema={createLoveStorySegmentSchema.shape.iconType}
          >
            <Label htmlFor={`segment-icon-${index}`}>Icon</Label>
            <Select
              value={watchedSegment?.iconType ?? 'meet'}
              onValueChange={(value) => setValue(`segments.${index}.iconType`, value)}
            >
              <SelectTrigger id={`segment-icon-${index}`}>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6">{getIconComponent(option.value)}</span>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SectionFieldWrapper>

          {/* Description */}
          <SectionFieldWrapper
            isChanged={hasChanges}
            value={watchedSegment?.description}
            validationSchema={createLoveStorySegmentSchema.shape.description}
          >
            <Label htmlFor={`segment-description-${index}`}>Description</Label>
            <Textarea
              {...register(`segments.${index}.description` as const)}
              id={`segment-description-${index}`}
              placeholder="Enter description"
              rows={3}
              className="h-auto"
            />
          </SectionFieldWrapper>

          {/* Hidden order field */}
          <input
            type="hidden"
            {...register(`segments.${index}.order` as const, {
              valueAsNumber: true,
            })}
            value={index + 1}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
