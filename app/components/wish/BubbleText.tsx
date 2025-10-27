import { FC } from 'react'
import './bubbletext.css'

interface BubbleTextProps {
  name: string
  message: string
  createdAt: string
}

const BubbleText: FC<BubbleTextProps> = ({ name, message, createdAt }) => {
  return (
    <div className="speech-bubble relative rounded-lg bg-blue-50 p-2 px-4 text-left shadow-md">
      <div className="leading-none">
        <span className="text-md mr-2 font-semibold text-primary-main">{name}</span>
        <span className="text-sm text-gray-600">{formatTimeAgo(createdAt)}</span>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  )
}

function formatTimeAgo(dateString: string): string {
  // Handle undefined, null, or empty string
  if (!dateString) {
    return 'Recently'
  }

  // Convert Singapore Time (SGT, UTC+8) to UTC
  // Handle both ISO format and space-separated format
  let singaporeTime: Date
  if (dateString.includes('T')) {
    // Already ISO format
    singaporeTime = new Date(dateString)
  } else {
    // Convert space to T and add Z
    singaporeTime = new Date(`${dateString.replace(' ', 'T')  }Z`)
  }

  // Check if date is valid
  if (isNaN(singaporeTime.getTime())) {
    return 'Recently'
  }

  const now = new Date() // Local system time
  const diffInSeconds = Math.floor((now.getTime() - singaporeTime.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Less than a minute ago'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  // More than 7 days → Pretty format with user's local time
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Convert to user's timezone
  }).format(singaporeTime)
}

export default BubbleText
