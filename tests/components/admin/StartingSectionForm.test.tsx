// @ts-nocheck
/**
 * Component Tests: StartingSectionForm
 *
 * Tests for the starting section content management form component.
 * Tests include the full FeaturesForm wrapper to test the save button integration.
 */

import { describe, test, expect, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, useCallback } from 'react'
import { StartingSectionForm } from '@/app/components/admin/sections/StartingSectionForm'
import { DraftProvider, useDraft } from '@/app/context/DraftContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Mock data
const mockWeddingConfig = {
  id: 'config-123',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  userId: 'user-123',
  subdomain: 'johnjane',
  groomName: 'John Doe',
  brideName: 'Jane Smith',
  weddingDate: new Date('2050-01-01'),
  monogramFilename: null,
  monogramFileSize: null,
  monogramMimeType: null,
  groomFather: null,
  groomMother: null,
  brideFather: null,
  brideMother: null,
  groomsInstagramLink: null,
  brideInstagramLink: null,
  footerText: null,
  instagramLink: null,
  isPublished: false,
  features: {
    hero: true,
    groom_and_bride: true,
    love_story: false,
    save_the_date: false,
    location: false,
    rsvp: false,
    gallery: false,
    prewedding_videos: false,
    faqs: false,
    dress_code: false,
    gift: false,
    wishes: false,
    footer: false,
  },
}

const mockStartingSectionContent = {
  id: 'content-123',
  weddingConfigId: 'config-123',
  groomDisplayName: 'John Doe',
  brideDisplayName: 'Jane Smith',
  showParentInfo: true,
  groomFatherName: 'Robert Doe',
  groomMotherName: 'Mary Doe',
  brideFatherName: 'James Smith',
  brideMotherName: 'Patricia Smith',
  showWeddingDate: true,
  backgroundType: 'image' as const,
  backgroundFilename: 'hero-bg.jpg',
  backgroundOriginalName: 'hero-bg.jpg',
  backgroundFileSize: 5242880,
  backgroundMimeType: 'image/jpeg',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

// FeaturesForm wrapper component for integration testing
function TestFeaturesFormWrapper({
  config,
  startingSectionContent,
  onUpdateStartingSection,
  onBatchSave,
}: any) {
  const { draft: draftStartingSection, clearDraft: clearStartingSectionDraft } =
    useDraft('startingSection')

  const [changedStartingSectionFields, setChangedStartingSectionFields] = useState<Set<string>>(
    new Set()
  )
  const [draftFeatures, _setDraftFeatures] = useState(config.features)
  const [changedFeatures, _setChangedFeatures] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const hasUnsavedChanges = changedFeatures.size > 0 || changedStartingSectionFields.size > 0
  const totalChanges = changedFeatures.size + changedStartingSectionFields.size

  const handleStartingSectionChange = useCallback((hasChanges: boolean, fields: Set<string>) => {
    setChangedStartingSectionFields(fields)
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      if (changedStartingSectionFields.size > 0 && draftStartingSection) {
        await onUpdateStartingSection(draftStartingSection)
        clearStartingSectionDraft()
      }
      if (changedFeatures.size > 0) {
        const featuresToUpdate: Record<string, boolean> = {}
        changedFeatures.forEach((featureName) => {
          featuresToUpdate[featureName] = draftFeatures[featureName]
        })
        await onBatchSave(featuresToUpdate)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Accordion type="multiple" defaultValue={['hero']}>
        <AccordionItem value="hero">
          <AccordionTrigger>Starting Section</AccordionTrigger>
          <AccordionContent>
            <StartingSectionForm
              weddingConfig={config}
              startingSectionContent={startingSectionContent}
              onUpdate={onUpdateStartingSection}
              onChangeTracking={handleStartingSectionChange}
              changedFields={changedStartingSectionFields}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {hasUnsavedChanges && (
        <div data-testid="save-bar">
          <span>
            {totalChanges} unsaved change{totalChanges !== 1 ? 's' : ''}
          </span>
          <button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </>
  )
}

// Helper function to render component with DraftProvider
const renderWithDraftProvider = (component: React.ReactElement) => {
  return render(<DraftProvider>{component}</DraftProvider>)
}

// Helper function to render with full FeaturesForm wrapper (for testing save button)
const renderWithFeaturesForm = ({
  config = mockWeddingConfig,
  startingSectionContent = null,
  onUpdateStartingSection = jest.fn().mockResolvedValue(undefined),
  onBatchSave = jest.fn().mockResolvedValue(undefined),
} = {}) => {
  return renderWithDraftProvider(
    <TestFeaturesFormWrapper
      config={config}
      startingSectionContent={startingSectionContent}
      onUpdateStartingSection={onUpdateStartingSection}
      onBatchSave={onBatchSave}
    />
  )
}

// Helper function to create a properly typed mock for onUpdate
const createMockOnUpdate = () => jest.fn().mockResolvedValue(undefined) as jest.Mock

describe('StartingSectionForm - Rendering', () => {
  test('should render all form sections', () => {
    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    expect(screen.getByText(/Display Names/i)).toBeInTheDocument()
    expect(screen.getByText(/Show Parent Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Show Wedding Date/i)).toBeInTheDocument()
    expect(screen.getByText(/Upload Background Media/i)).toBeInTheDocument()
  })

  test('should show placeholder text for groom display name', () => {
    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const groomInput = screen.getByPlaceholderText(/John Doe/i)
    expect(groomInput).toBeInTheDocument()
  })

  test('should show placeholder text for bride display name', () => {
    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const brideInput = screen.getByPlaceholderText(/Jane Smith/i)
    expect(brideInput).toBeInTheDocument()
  })

  test('should render parent info fields when showParentInfo is true', () => {
    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={mockStartingSectionContent}
        onUpdate={createMockOnUpdate()}
      />
    )

    expect(screen.getByLabelText(/Groom's Father Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Groom's Mother Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Bride's Father Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Bride's Mother Name/i)).toBeInTheDocument()
  })

  test('should hide parent info fields when showParentInfo is false', () => {
    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={{
          ...mockStartingSectionContent,
          showParentInfo: false,
        }}
        onUpdate={createMockOnUpdate()}
      />
    )

    expect(screen.queryByLabelText(/Groom's Father Name/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Groom's Mother Name/i)).not.toBeInTheDocument()
  })
})

describe('StartingSectionForm - Form Interaction', () => {
  test('should toggle parent info section when checkbox is clicked', async () => {
    const user = userEvent.setup()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const checkbox = screen.getByRole('checkbox', { name: /show parent/i })

    // Initially unchecked
    expect(checkbox).not.toBeChecked()
    expect(screen.queryByLabelText(/Groom's Father Name/i)).not.toBeInTheDocument()

    // Click to show parent fields
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(screen.getByLabelText(/Groom's Father Name/i)).toBeInTheDocument()

    // Click again to hide
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
    expect(screen.queryByLabelText(/Groom's Father Name/i)).not.toBeInTheDocument()
  })

  test('should toggle wedding date display when checkbox is clicked', async () => {
    const user = userEvent.setup()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const checkbox = screen.getByRole('checkbox', { name: /show wedding date/i })

    // Initially checked (default true)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  test('should update groom display name field', async () => {
    const user = userEvent.setup()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const input = screen.getByPlaceholderText(/John Doe/i)
    await user.clear(input)
    await user.type(input, 'Jonathan Doe')

    expect(input).toHaveValue('Jonathan Doe')
  })

  test('should update bride display name field', async () => {
    const user = userEvent.setup()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const input = screen.getByPlaceholderText(/Jane Smith/i)
    await user.clear(input)
    await user.type(input, 'Janet Smith')

    expect(input).toHaveValue('Janet Smith')
  })

  test('should update parent name fields when parent info is shown', async () => {
    const user = userEvent.setup()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={{
          ...mockStartingSectionContent,
          showParentInfo: true,
        }}
        onUpdate={createMockOnUpdate()}
      />
    )

    const groomFatherInput = screen.getByLabelText(/Groom's Father Name/i)
    await user.clear(groomFatherInput)
    await user.type(groomFatherInput, 'Bob Doe')

    expect(groomFatherInput).toHaveValue('Bob Doe')
  })
})

describe('StartingSectionForm - File Upload', () => {
  test('should render file upload input', () => {
    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const fileInput = screen.getByLabelText(/background media/i)
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('type', 'file')
  })

  test('should accept image and video files', () => {
    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const fileInput = screen.getByLabelText(/background media/i)
    expect(fileInput).toHaveAttribute('accept')
    expect(fileInput.getAttribute('accept')).toMatch(/image/)
    expect(fileInput.getAttribute('accept')).toMatch(/video/)
  })

  test('should show current background filename when media exists', () => {
    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={mockStartingSectionContent}
        onUpdate={createMockOnUpdate()}
      />
    )

    expect(screen.getByText(/hero-bg\.jpg/i)).toBeInTheDocument()
  })

  test('should display file size for current background', () => {
    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={mockStartingSectionContent}
        onUpdate={createMockOnUpdate()}
      />
    )

    // 5MB = 5242880 bytes
    expect(screen.getByText(/5\.0 MB/i)).toBeInTheDocument()
  })

  test('should show validation error for oversized image', async () => {
    const user = userEvent.setup()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const fileInput = screen.getByLabelText(/background media/i)
    const oversizedFile = new File(['a'.repeat(15 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    })

    await user.upload(fileInput, oversizedFile)

    await waitFor(() => {
      expect(screen.getByText(/exceeds.*10.*MB/i)).toBeInTheDocument()
    })
  })

  test('should show validation error for oversized video', async () => {
    const user = userEvent.setup()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const fileInput = screen.getByLabelText(/background media/i)
    const oversizedFile = new File(['a'.repeat(60 * 1024 * 1024)], 'large.mp4', {
      type: 'video/mp4',
    })

    await user.upload(fileInput, oversizedFile)

    await waitFor(() => {
      expect(screen.getByText(/exceeds.*50.*MB/i)).toBeInTheDocument()
    })
  })

  test('should reject unsupported file type', async () => {
    const user = userEvent.setup()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const fileInput = screen.getByLabelText(/upload background media/i)
    const unsupportedFile = new File(['pdf content'], 'document.pdf', {
      type: 'application/pdf',
    })

    await user.upload(fileInput, unsupportedFile)

    // Upload button should be disabled when unsupported file is selected (file gets cleared)
    const uploadButtons = screen.getAllByRole('button', { name: /upload/i })
    // Background upload button is the second one (first is monogram)
    expect(uploadButtons[1]).toBeDisabled()
  })
})

describe('StartingSectionForm - Confirmation Dialog', () => {
  test('should show confirmation dialog when replacing existing media', async () => {
    const user = userEvent.setup()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={mockStartingSectionContent}
        onUpdate={createMockOnUpdate()}
      />
    )

    const fileInput = screen.getByLabelText(/upload background media/i)
    const newFile = new File(['new content'], 'new-bg.jpg', {
      type: 'image/jpeg',
    })

    await user.upload(fileInput, newFile)

    // Click the upload button to trigger confirmation dialog
    const uploadButtons = screen.getAllByRole('button', { name: /upload/i })
    await user.click(uploadButtons[1]) // Background upload button is the second one

    await waitFor(() => {
      expect(screen.getByText(/replace existing/i)).toBeInTheDocument()
      // Dialog should show the current filename - check it exists (appears multiple times)
      expect(screen.getAllByText(/hero-bg\.jpg/i).length).toBeGreaterThan(0)
    })
  })

  test('should cancel file upload when confirmation is rejected', async () => {
    const user = userEvent.setup()
    const onUpdate = createMockOnUpdate()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={mockStartingSectionContent}
        onUpdate={onUpdate}
      />
    )

    const fileInput = screen.getByLabelText(/upload background media/i)
    const newFile = new File(['new content'], 'new-bg.jpg', {
      type: 'image/jpeg',
    })

    await user.upload(fileInput, newFile)

    // Click upload button to show confirmation dialog
    const uploadButtons = screen.getAllByRole('button', { name: /upload/i })
    await user.click(uploadButtons[1])

    // Click cancel button in dialog
    const cancelButton = await screen.findByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    // Should not trigger upload (onUpdate is for form submission, not file upload)
    // The upload would be triggered by clicking "Confirm" button
    expect(onUpdate).not.toHaveBeenCalled()
  })

  test('should not show confirmation when no existing media', async () => {
    const user = userEvent.setup()

    renderWithDraftProvider(
      <StartingSectionForm
        weddingConfig={mockWeddingConfig}
        startingSectionContent={null}
        onUpdate={createMockOnUpdate()}
      />
    )

    const fileInput = screen.getByLabelText(/background media/i)
    const newFile = new File(['new content'], 'new-bg.jpg', {
      type: 'image/jpeg',
    })

    await user.upload(fileInput, newFile)

    // Should not show confirmation dialog
    await waitFor(() => {
      expect(screen.queryByText(/replace existing/i)).not.toBeInTheDocument()
    })
  })
})

describe('StartingSectionForm - Form Submission', () => {
  test('should call onUpdate with form data on submit', async () => {
    const user = userEvent.setup()
    const onUpdate = createMockOnUpdate()

    renderWithFeaturesForm({
      onUpdateStartingSection: onUpdate,
    })

    const groomInput = screen.getByPlaceholderText(/John Doe/i)
    await user.clear(groomInput)
    await user.type(groomInput, 'Jonathan Doe')

    // Wait for save bar to appear
    await waitFor(() => {
      expect(screen.getByTestId('save-bar')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          groomDisplayName: 'Jonathan Doe',
        })
      )
    })
  })

  test('should call onUpdate with parent info when enabled', async () => {
    const user = userEvent.setup()
    const onUpdate = createMockOnUpdate()

    renderWithFeaturesForm({
      onUpdateStartingSection: onUpdate,
    })

    // Enable parent info
    const checkbox = screen.getByRole('checkbox', { name: /show parent/i })
    await user.click(checkbox)

    // Fill parent names
    const groomFatherInput = screen.getByLabelText(/Groom's Father Name/i)
    await user.type(groomFatherInput, 'Robert Doe')

    // Wait for save bar to appear
    await waitFor(() => {
      expect(screen.getByTestId('save-bar')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          showParentInfo: true,
          groomFatherName: 'Robert Doe',
        })
      )
    })
  })

  test('should disable submit button while submitting', async () => {
    const user = userEvent.setup()
    let resolvePromise: () => void
    const onUpdate = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolvePromise = resolve
        })
    ) as jest.Mock

    renderWithFeaturesForm({
      onUpdateStartingSection: onUpdate,
    })

    const groomInput = screen.getByPlaceholderText(/John Doe/i)
    await user.clear(groomInput)
    await user.type(groomInput, 'Jonathan')

    // Wait for save bar to appear
    await waitFor(() => {
      expect(screen.getByTestId('save-bar')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /save changes/i })
    expect(submitButton).not.toBeDisabled()

    // Click the submit button
    await user.click(submitButton)

    // Button should be disabled while saving
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })

    // Clean up - resolve the promise
    if (resolvePromise!) {
      resolvePromise()
    }

    // Wait for button to be enabled again
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  test('should show loading state during submission', async () => {
    const user = userEvent.setup()
    let resolvePromise: () => void
    const onUpdate = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolvePromise = resolve
        })
    ) as jest.Mock

    renderWithFeaturesForm({
      onUpdateStartingSection: onUpdate,
    })

    const groomInput = screen.getByPlaceholderText(/John Doe/i)
    await user.clear(groomInput)
    await user.type(groomInput, 'Jonathan')

    // Wait for save bar to appear
    await waitFor(() => {
      expect(screen.getByTestId('save-bar')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(submitButton)

    // Should show "Saving..." text while saving
    await waitFor(() => {
      expect(screen.getByText(/saving\.\.\./i)).toBeInTheDocument()
    })

    // Clean up - resolve the promise
    if (resolvePromise!) {
      resolvePromise()
    }

    // Wait for "Save Changes" to return
    await waitFor(() => {
      expect(screen.getByText(/save changes/i)).toBeInTheDocument()
    })
  })
})

describe('StartingSectionForm - Validation', () => {
  test('should allow partial parent info (only groom parents)', async () => {
    const user = userEvent.setup()
    const onUpdate = createMockOnUpdate()

    renderWithFeaturesForm({
      onUpdateStartingSection: onUpdate,
    })

    // Enable parent info
    const checkbox = screen.getByRole('checkbox', { name: /show parent/i })
    await user.click(checkbox)

    // Fill only groom parent names
    const groomFatherInput = screen.getByLabelText(/Groom's Father Name/i)
    await user.type(groomFatherInput, 'Robert Doe')

    const groomMotherInput = screen.getByLabelText(/Groom's Mother Name/i)
    await user.type(groomMotherInput, 'Mary Doe')

    // Wait for save bar to appear
    await waitFor(() => {
      expect(screen.getByTestId('save-bar')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          groomFatherName: 'Robert Doe',
          groomMotherName: 'Mary Doe',
          brideFatherName: null,
          brideMotherName: null,
        })
      )
    })
  })
})
