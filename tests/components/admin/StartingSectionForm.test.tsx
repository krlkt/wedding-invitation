/**
 * Component Tests: StartingSectionForm
 *
 * Tests for the starting section content management form component.
 * These tests MUST FAIL initially (TDD approach) until the component is implemented.
 *
 * @see app/components/admin/sections/StartingSectionForm.tsx (to be implemented)
 */

import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StartingSectionForm } from '@/app/components/admin/sections/StartingSectionForm'

// Mock data
const mockWeddingConfig = {
    id: 'config-123',
    groomFirstName: 'John',
    groomLastName: 'Doe',
    brideFirstName: 'Jane',
    brideLastName: 'Smith',
    weddingDate: new Date('2050-01-01'),
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
    backgroundFileSize: 5242880,
    backgroundMimeType: 'image/jpeg',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
}

describe('StartingSectionForm - Rendering', () => {
    test('should render all form sections', () => {
        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
            />
        )

        expect(screen.getByText(/Display Names/i)).toBeInTheDocument()
        expect(screen.getByText(/Parent Information/i)).toBeInTheDocument()
        expect(screen.getByText(/Wedding Date/i)).toBeInTheDocument()
        expect(screen.getByText(/Background Media/i)).toBeInTheDocument()
    })

    test('should show placeholder text for groom display name', () => {
        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
            />
        )

        const groomInput = screen.getByPlaceholderText(/John Doe/i)
        expect(groomInput).toBeInTheDocument()
    })

    test('should show placeholder text for bride display name', () => {
        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
            />
        )

        const brideInput = screen.getByPlaceholderText(/Jane Smith/i)
        expect(brideInput).toBeInTheDocument()
    })

    test('should render parent info fields when showParentInfo is true', () => {
        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={mockStartingSectionContent}
                onUpdate={jest.fn()}
            />
        )

        expect(screen.getByLabelText(/Groom's Father Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Groom's Mother Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Bride's Father Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Bride's Mother Name/i)).toBeInTheDocument()
    })

    test('should hide parent info fields when showParentInfo is false', () => {
        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={{
                    ...mockStartingSectionContent,
                    showParentInfo: false,
                }}
                onUpdate={jest.fn()}
            />
        )

        expect(screen.queryByLabelText(/Groom's Father Name/i)).not.toBeInTheDocument()
        expect(screen.queryByLabelText(/Groom's Mother Name/i)).not.toBeInTheDocument()
    })
})

describe('StartingSectionForm - Form Interaction', () => {
    test('should toggle parent info section when checkbox is clicked', async () => {
        const user = userEvent.setup()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
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

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
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

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
            />
        )

        const input = screen.getByPlaceholderText(/John Doe/i)
        await user.clear(input)
        await user.type(input, 'Jonathan Doe')

        expect(input).toHaveValue('Jonathan Doe')
    })

    test('should update bride display name field', async () => {
        const user = userEvent.setup()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
            />
        )

        const input = screen.getByPlaceholderText(/Jane Smith/i)
        await user.clear(input)
        await user.type(input, 'Janet Smith')

        expect(input).toHaveValue('Janet Smith')
    })

    test('should update parent name fields when parent info is shown', async () => {
        const user = userEvent.setup()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={{
                    ...mockStartingSectionContent,
                    showParentInfo: true,
                }}
                onUpdate={jest.fn()}
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
        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
            />
        )

        const fileInput = screen.getByLabelText(/background media/i)
        expect(fileInput).toBeInTheDocument()
        expect(fileInput).toHaveAttribute('type', 'file')
    })

    test('should accept image and video files', () => {
        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
            />
        )

        const fileInput = screen.getByLabelText(/background media/i)
        expect(fileInput).toHaveAttribute('accept')
        expect(fileInput.getAttribute('accept')).toMatch(/image/)
        expect(fileInput.getAttribute('accept')).toMatch(/video/)
    })

    test('should show current background filename when media exists', () => {
        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={mockStartingSectionContent}
                onUpdate={jest.fn()}
            />
        )

        expect(screen.getByText(/hero-bg\.jpg/i)).toBeInTheDocument()
    })

    test('should display file size for current background', () => {
        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={mockStartingSectionContent}
                onUpdate={jest.fn()}
            />
        )

        // 5MB = 5242880 bytes
        expect(screen.getByText(/5\.0 MB/i)).toBeInTheDocument()
    })

    test('should show validation error for oversized image', async () => {
        const user = userEvent.setup()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
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

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
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

    test('should show validation error for unsupported file type', async () => {
        const user = userEvent.setup()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
            />
        )

        const fileInput = screen.getByLabelText(/background media/i)
        const unsupportedFile = new File(['pdf content'], 'document.pdf', {
            type: 'application/pdf',
        })

        await user.upload(fileInput, unsupportedFile)

        await waitFor(() => {
            expect(screen.getByText(/type|format/i)).toBeInTheDocument()
        })
    })
})

describe('StartingSectionForm - Confirmation Dialog', () => {
    test('should show confirmation dialog when replacing existing media', async () => {
        const user = userEvent.setup()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={mockStartingSectionContent}
                onUpdate={jest.fn()}
            />
        )

        const fileInput = screen.getByLabelText(/background media/i)
        const newFile = new File(['new content'], 'new-bg.jpg', {
            type: 'image/jpeg',
        })

        await user.upload(fileInput, newFile)

        await waitFor(() => {
            expect(screen.getByText(/replace existing/i)).toBeInTheDocument()
            expect(screen.getByText(/hero-bg\.jpg/i)).toBeInTheDocument()
        })
    })

    test('should cancel file upload when confirmation is rejected', async () => {
        const user = userEvent.setup()
        const onUpdate = jest.fn()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={mockStartingSectionContent}
                onUpdate={onUpdate}
            />
        )

        const fileInput = screen.getByLabelText(/background media/i)
        const newFile = new File(['new content'], 'new-bg.jpg', {
            type: 'image/jpeg',
        })

        await user.upload(fileInput, newFile)

        const cancelButton = await screen.findByRole('button', { name: /cancel/i })
        await user.click(cancelButton)

        // Should not trigger update
        expect(onUpdate).not.toHaveBeenCalled()
    })

    test('should not show confirmation when no existing media', async () => {
        const user = userEvent.setup()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
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
        const onUpdate = jest.fn()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={onUpdate}
            />
        )

        const groomInput = screen.getByPlaceholderText(/John Doe/i)
        await user.type(groomInput, 'Jonathan Doe')

        const submitButton = screen.getByRole('button', { name: /save|update/i })
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
        const onUpdate = jest.fn()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={onUpdate}
            />
        )

        // Enable parent info
        const checkbox = screen.getByRole('checkbox', { name: /show parent/i })
        await user.click(checkbox)

        // Fill parent names
        const groomFatherInput = screen.getByLabelText(/Groom's Father Name/i)
        await user.type(groomFatherInput, 'Robert Doe')

        const submitButton = screen.getByRole('button', { name: /save|update/i })
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
        const onUpdate = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 1000)))

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={onUpdate}
            />
        )

        const submitButton = screen.getByRole('button', { name: /save|update/i })
        await user.click(submitButton)

        expect(submitButton).toBeDisabled()
    })

    test('should show loading state during submission', async () => {
        const user = userEvent.setup()
        const onUpdate = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 1000)))

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={onUpdate}
            />
        )

        const submitButton = screen.getByRole('button', { name: /save|update/i })
        await user.click(submitButton)

        expect(screen.getByText(/saving|updating/i)).toBeInTheDocument()
    })
})

describe('StartingSectionForm - Validation', () => {
    test('should show error when groom display name exceeds 100 characters', async () => {
        const user = userEvent.setup()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
            />
        )

        const groomInput = screen.getByPlaceholderText(/John Doe/i)
        await user.type(groomInput, 'A'.repeat(101))

        const submitButton = screen.getByRole('button', { name: /save|update/i })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/100.*character/i)).toBeInTheDocument()
        })
    })

    test('should show error when bride display name exceeds 100 characters', async () => {
        const user = userEvent.setup()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={jest.fn()}
            />
        )

        const brideInput = screen.getByPlaceholderText(/Jane Smith/i)
        await user.type(brideInput, 'B'.repeat(101))

        const submitButton = screen.getByRole('button', { name: /save|update/i })
        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/100.*character/i)).toBeInTheDocument()
        })
    })

    test('should allow partial parent info (only groom parents)', async () => {
        const user = userEvent.setup()
        const onUpdate = jest.fn()

        render(
            <StartingSectionForm
                weddingConfig={mockWeddingConfig}
                startingSectionContent={null}
                onUpdate={onUpdate}
            />
        )

        // Enable parent info
        const checkbox = screen.getByRole('checkbox', { name: /show parent/i })
        await user.click(checkbox)

        // Fill only groom parent names
        const groomFatherInput = screen.getByLabelText(/Groom's Father Name/i)
        await user.type(groomFatherInput, 'Robert Doe')

        const groomMotherInput = screen.getByLabelText(/Groom's Mother Name/i)
        await user.type(groomMotherInput, 'Mary Doe')

        const submitButton = screen.getByRole('button', { name: /save|update/i })
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
