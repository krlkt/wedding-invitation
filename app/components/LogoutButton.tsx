'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LogoutButtonProps {
  className?: string
  fullWidth?: boolean
}

export default function LogoutButton({ className, fullWidth }: LogoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (res.ok) {
        router.push('/admin/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const defaultClasses = 'bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={className || `${defaultClasses} ${widthClass}`}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
