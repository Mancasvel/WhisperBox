'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const { sendMagicLink, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const success = await sendMagicLink(email)
      
      if (success) {
        setMessage('Magic link sent! Check your email.')
        setMessageType('success')
        setEmail('')
      } else {
        setMessage('Error sending the link. Please try again.')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Connection error. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-whisper-green-50 to-whisper-green-100 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-whisper-green-200/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse"></div>
      
      {/* Floating gentle lights */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-whisper-green-400 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-whisper-orange-400 rounded-full blur-sm animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-whisper-green-300 rounded-full blur-sm animate-pulse delay-2000"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-whisper-green-600 via-whisper-green-500 to-whisper-orange-500 bg-clip-text text-transparent cursor-pointer"
                style={{
                  textShadow: "0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.2)",
                  filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))"
                }}
              >
                WhisperBox
              </motion.h1>
            </Link>
            <p className="text-whisper-dark-600 text-lg font-journal">
              Your safe space for emotional wellbeing
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm border border-whisper-green-200 rounded-xl p-8 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-whisper-dark-700 mb-2 font-ui">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white border border-whisper-green-200 rounded-lg text-whisper-dark-800 placeholder-whisper-dark-400 focus:outline-none focus:border-whisper-green-500 focus:ring-2 focus:ring-whisper-green-200 transition-all duration-300 font-ui"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-whisper-green-500 to-whisper-green-600 hover:from-whisper-green-600 hover:to-whisper-green-700 disabled:from-whisper-dark-400 disabled:to-whisper-dark-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-whisper-green-300/30 font-ui"
                style={{
                  boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)"
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Magic Link...
                  </div>
                ) : (
                  'Send Magic Link'
                )}
              </button>
            </form>

            {/* Status message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 p-4 rounded-lg text-sm font-ui ${
                  messageType === 'success' 
                    ? 'bg-whisper-green-50 border border-whisper-green-200 text-whisper-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {message}
              </motion.div>
            )}

            {/* Additional information */}
            <div className="mt-6 text-center">
              <p className="text-xs text-whisper-dark-500 leading-relaxed font-ui">
                We'll send you a secure magic link to your email.<br />
                No password needed, just click the link to access your space.
              </p>
            </div>
          </motion.div>

          {/* Privacy information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-8 text-center"
          >
            <div className="bg-whisper-orange-50 backdrop-blur-sm border border-whisper-orange-200 rounded-xl p-4">
              <h3 className="text-whisper-orange-700 font-semibold mb-2 font-journal">🔒 Complete Privacy</h3>
              <p className="text-xs text-whisper-dark-600 leading-relaxed font-ui">
                Your journal entries are encrypted and completely private. 
                Only you can access your thoughts and emotional reflections.
              </p>
            </div>
          </motion.div>

          {/* Inspirational quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-8 p-4 border border-whisper-green-200 bg-whisper-green-50 backdrop-blur-sm rounded-xl text-center"
          >
            <p className="text-whisper-green-700 italic text-sm font-journal">
              "Every moment of self-reflection is a step toward healing and growth..."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 