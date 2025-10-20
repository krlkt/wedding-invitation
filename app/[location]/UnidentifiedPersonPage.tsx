"use client"

export default function UnidentifiedPerson() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 text-center px-4">
      <h2 className="text-2xl font-bold text-pink-600">
        Hmmm… we don’t recognize you 😅
      </h2>
      <p className="text-lg text-gray-700">
        Check your invitation link again or ask groom & bride for help 💌
      </p>
      <button
        onClick={() => (window.location.href = '/')}
        className="mt-4 rounded-lg bg-pink-500 px-6 py-2 text-white font-semibold hover:bg-pink-600 transition"
      >
        Go Back Home
      </button>
    </div>
  )
}
