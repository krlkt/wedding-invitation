/**
 * FileInput Component
 *
 * A custom styled file input component with better UX than native file inputs.
 * Features:
 * - Custom styling with pointer cursor
 * - Shows selected filename
 * - Displays file size
 * - Upload icon
 * - Disabled state support
 * - Accepts forwarded refs
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional function to format file size display */
  formatFileSize?: (bytes: number) => string;
  /** File that has been selected */
  selectedFile?: File | null;
  /** Custom placeholder text when no file is selected */
  placeholder?: string;
  /** Show file size inline */
  showFileSize?: boolean;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      disabled,
      selectedFile,
      formatFileSize,
      placeholder = 'Choose file...',
      showFileSize = true,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className={cn('relative w-full', className)}>
        {/* Hidden native file input */}
        <input
          ref={ref}
          type="file"
          id={inputId}
          disabled={disabled}
          className="hidden"
          {...props}
        />

        {/* Custom styled file input button */}
        <label
          htmlFor={inputId}
          className={cn(
            'flex w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <span className="truncate text-muted-foreground">
            {selectedFile ? selectedFile.name : placeholder}
          </span>
          <div className="ml-2 flex items-center gap-2">
            {selectedFile && showFileSize && formatFileSize && (
              <span className="text-xs text-gray-600">{formatFileSize(selectedFile.size)}</span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
        </label>
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export { FileInput };
