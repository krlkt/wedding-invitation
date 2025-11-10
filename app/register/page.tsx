import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import RegisterForm from './RegisterForm'

async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value)
    return sessionData
  } catch {
    return null
  }
}

export default async function RegisterPage() {
  // Check if user is already authenticated
  const session = await getSession()

  if (session?.userId) {
    // User is already logged in, redirect to admin
    redirect('/admin')
  }

  return <RegisterForm />
}
