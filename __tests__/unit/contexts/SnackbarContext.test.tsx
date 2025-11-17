// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * Unit Tests: SnackbarContext
 *
 * Tests for the snackbar notification system context.
 */

import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { render, screen, renderHook } from '@testing-library/react'

// Create mock functions at module level for Jest hoisting
const mockSuccessFn = jest.fn()
const mockWarningFn = jest.fn()
const mockErrorFn = jest.fn()

// Mock sonner before importing the context
jest.mock('sonner', () => ({
  toast: {
    success: mockSuccessFn,
    warning: mockWarningFn,
    error: mockErrorFn,
  },
  Toaster: () => null,
}))

import { SnackbarProvider, useSnackbar } from '@/app/context/SnackbarContext'

describe('SnackbarContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('SnackbarProvider', () => {
    test('should render children correctly', () => {
      render(
        <SnackbarProvider>
          <div data-testid="test-child">Test Content</div>
        </SnackbarProvider>
      )

      expect(screen.getByTestId('test-child')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    test('should provide context value to descendants', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(result.current).toBeDefined()
      expect(result.current).toHaveProperty('showSuccess')
      expect(result.current).toHaveProperty('showWarning')
      expect(result.current).toHaveProperty('showError')
    })
  })

  describe('useSnackbar hook', () => {
    test('should throw error when used outside SnackbarProvider', () => {
      // Suppress console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useSnackbar())
      }).toThrow('useSnackbar must be used within a SnackbarProvider')

      consoleErrorSpy.mockRestore()
    })
  })

  describe('showSuccess', () => {
    test('should execute without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showSuccess('Success message')
      }).not.toThrow()
    })

    test('should handle empty string without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showSuccess('')
      }).not.toThrow()
    })

    test('should accept duration option without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showSuccess('Success message', { duration: 5000 })
      }).not.toThrow()
    })

    test('should accept persist option without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showSuccess('Persistent message', { persist: true })
      }).not.toThrow()
    })
  })

  describe('showWarning', () => {
    test('should execute without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showWarning('Warning message')
      }).not.toThrow()
    })

    test('should handle long messages without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      const longMessage =
        'This is a very long warning message that should still be handled correctly by the snackbar system without any issues or errors occurring.'

      expect(() => {
        result.current.showWarning(longMessage)
      }).not.toThrow()
    })

    test('should accept duration option without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showWarning('Warning message', { duration: 8000 })
      }).not.toThrow()
    })

    test('should accept persist option without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showWarning('Persistent warning', { persist: true })
      }).not.toThrow()
    })
  })

  describe('showError', () => {
    test('should execute without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showError('Error message')
      }).not.toThrow()
    })

    test('should handle messages with special characters without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      const specialMessage = 'Error: <script>alert("test")</script> & "quotes" & \'apostrophes\''

      expect(() => {
        result.current.showError(specialMessage)
      }).not.toThrow()
    })

    test('should accept duration option without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showError('Error message', { duration: 10000 })
      }).not.toThrow()
    })

    test('should accept persist option without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showError('Critical error', { persist: true })
      }).not.toThrow()
    })
  })

  describe('Options behavior', () => {
    test('should handle default behavior when no options provided', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showSuccess('Default message')
      }).not.toThrow()
    })

    test('should handle both persist and duration options together', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showError('Persistent with duration', {
          persist: true,
          duration: 5000,
        })
      }).not.toThrow()
    })

    test('should handle duration option alone', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showWarning('With duration only', { duration: 5000 })
      }).not.toThrow()
    })

    test('should handle persist false explicitly', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showSuccess('Not persistent', { persist: false })
      }).not.toThrow()
    })

    test('should handle zero duration', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showSuccess('Zero duration', { duration: 0 })
      }).not.toThrow()
    })
  })

  describe('Multiple notifications', () => {
    test('should handle multiple notifications in sequence without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showSuccess('First notification')
        result.current.showWarning('Second notification')
        result.current.showError('Third notification')
      }).not.toThrow()
    })

    test('should handle rapid successive calls without errors', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showSuccess('Message 1')
        result.current.showSuccess('Message 2')
        result.current.showSuccess('Message 3')
      }).not.toThrow()
    })

    test('should handle mixed options in sequence', () => {
      const { result } = renderHook(() => useSnackbar(), {
        wrapper: SnackbarProvider,
      })

      expect(() => {
        result.current.showSuccess('Quick', { duration: 2000 })
        result.current.showWarning('Persistent', { persist: true })
        result.current.showError('Default')
      }).not.toThrow()
    })
  })

  describe('Component integration', () => {
    test('should work correctly when used in a component', () => {
      function TestComponent() {
        const { showSuccess, showWarning, showError } = useSnackbar()

        return (
          <div>
            <button onClick={() => showSuccess('Test success')}>Show Success</button>
            <button onClick={() => showWarning('Test warning')}>Show Warning</button>
            <button onClick={() => showError('Test error')}>Show Error</button>
          </div>
        )
      }

      render(
        <SnackbarProvider>
          <TestComponent />
        </SnackbarProvider>
      )

      const successButton = screen.getByRole('button', { name: /show success/i })
      const warningButton = screen.getByRole('button', { name: /show warning/i })
      const errorButton = screen.getByRole('button', { name: /show error/i })

      expect(() => {
        successButton.click()
        warningButton.click()
        errorButton.click()
      }).not.toThrow()
    })
  })
})
