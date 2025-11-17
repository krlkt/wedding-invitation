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

### `showSuccess(message)`
Shows a green success notification.

```tsx
showSuccess('Changes saved!')
```

### `showWarning(message)`
Shows a yellow warning notification.

```tsx
showWarning('Please review your input')
```

### `showError(message)`
Shows a red error notification.

```tsx
showError('Something went wrong')
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

## Notes

- The hook must be used inside a component wrapped by `SnackbarProvider`
- All methods accept a string message
- Notifications auto-dismiss after a few seconds
- Multiple notifications can be shown at once

## Colors

- **Success**: Green background, dark green text
- **Warning**: Yellow background, dark yellow text
- **Error**: Red background, dark red text
