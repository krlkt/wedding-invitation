# useSnackbar Hook

Simple hook for showing toast notifications in your components.

## Basic Usage

```tsx
import { useSnackbar } from '@/app/context/SnackbarContext'

function MyComponent() {
  const { showSuccess, showWarning, showError } = useSnackbar()

  const handleSave = async () => {
    try {
      await saveData()
      showSuccess('Data saved successfully!')
    } catch (error) {
      showError('Failed to save data')
    }
  }

  return <button onClick={handleSave}>Save</button>
}
```

## Available Methods

### `showSuccess(message, options?)`

Shows a green success notification.

**Parameters:**

- `message` (string): The message to display
- `options` (object, optional):
  - `duration` (number): How long to show in milliseconds
  - `persist` (boolean): If true, user must click close button

```tsx
showSuccess('Changes saved!')

// Show for 5 seconds
showSuccess('Changes saved!', { duration: 5000 })

// Require user to close
showSuccess('Important: Please review', { persist: true })
```

### `showWarning(message, options?)`

Shows a yellow warning notification.

**Parameters:**

- `message` (string): The message to display
- `options` (object, optional):
  - `duration` (number): How long to show in milliseconds
  - `persist` (boolean): If true, user must click close button

```tsx
showWarning('Please review your input')

// Show for 8 seconds
showWarning('Please review your input', { duration: 8000 })

// Persistent warning
showWarning('Action required!', { persist: true })
```

### `showError(message, options?)`

Shows a red error notification.

**Parameters:**

- `message` (string): The message to display
- `options` (object, optional):
  - `duration` (number): How long to show in milliseconds
  - `persist` (boolean): If true, user must click close button

```tsx
showError('Something went wrong')

// Show for 10 seconds
showError('Something went wrong', { duration: 10000 })

// Critical error that requires acknowledgment
showError('Critical error occurred', { persist: true })
```

## Common Patterns

### Form Submission

```tsx
const handleSubmit = async (data) => {
  try {
    await submitForm(data)
    showSuccess('Form submitted successfully!')
  } catch (error) {
    showError('Failed to submit form. Please try again.')
  }
}
```

### API Errors

```tsx
const fetchData = async () => {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      showError('Failed to load data')
      return
    }
    showSuccess('Data loaded!')
  } catch (error) {
    showError('Network error occurred')
  }
}
```

### User Actions

```tsx
const handleDelete = () => {
  showWarning('Are you sure you want to delete this?')
  // ... deletion logic
}
```

## Controlling Duration & Persistence

By default, notifications auto-dismiss after a few seconds. You can control the behavior:

### Duration Control

```tsx
// Quick notification (2 seconds)
showSuccess('Copied!', { duration: 2000 })

// Standard notification - uses default
showSuccess('File uploaded')

// Important message (10 seconds)
showError('Please read this carefully', { duration: 10000 })

// Very long notification (30 seconds)
showWarning('Session will expire soon', { duration: 30000 })
```

### Persistent Notifications

Force users to manually close important notifications:

```tsx
// Critical error - user must acknowledge
showError('Payment failed. Please contact support.', { persist: true })

// Important action required
showWarning('You have unsaved changes', { persist: true })

// Confirmation that needs user acknowledgment
showSuccess('Account created! Please verify your email.', { persist: true })
```

### When to Use Persist

✅ **Use `persist: true` for:**

- Critical errors requiring user action
- Important confirmations that need acknowledgment
- Warnings about data loss or destructive actions
- Messages with important information users must read

❌ **Don't use `persist: true` for:**

- Simple success messages ("Saved!", "Copied!")
- Routine notifications
- Progress updates
- Non-critical information

### Duration Guidelines

- **Quick actions**: `{ duration: 2000 }` (2 seconds) - Copy, delete, simple confirmations
- **Standard messages**: No options - Most success/info messages
- **Important warnings**: `{ duration: 8000 }` (8-10 seconds) - Errors that need attention
- **Critical alerts**: `{ persist: true }` - Session timeouts, critical errors

## Notes

- The hook must be used inside a component wrapped by `SnackbarProvider`
- All methods accept a string message and optional options object
- Available options: `duration` (number in ms), `persist` (boolean)
- If no options are provided, Sonner's default behavior is used
- Multiple notifications can be shown at once
- Persistent notifications will show a close button

## Quick Reference

```tsx
// Default (auto-dismiss)
showSuccess('Done!')

// Custom duration
showError('Error occurred', { duration: 5000 })

// Persistent (requires close)
showWarning('Important!', { persist: true })

// Note: persist overrides duration
showError('Critical!', { persist: true, duration: 1000 }) // duration ignored
```

## Colors

- **Success**: Green background, dark green text
- **Warning**: Yellow background, dark yellow text
- **Error**: Red background, dark red text
