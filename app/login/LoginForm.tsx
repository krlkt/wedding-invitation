'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginFormContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.success) {
        const redirect = searchParams.get('redirect') || '/admin'
        router.push(redirect)
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Wedding Admin</h1>
          <p className="text-gray-600">Sign in to manage your wedding</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-blue-500 px-4 py-3 font-semibold text-white transition-all hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Registration Link */}
          <div className="pt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-pink-500 hover:text-pink-600">
              Create your wedding website
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Default credentials:</p>
          <p className="mt-1 font-mono text-xs">karel@wedding.com / changeme123</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  )
}
