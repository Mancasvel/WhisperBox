'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import Logo from '@/components/ui/Logo'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCrisisMenu, setShowCrisisMenu] = useState(false)

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-md border-b border-white/40 sticky top-0 z-40 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Logo size="lg" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  Journal
                </Link>
                <Link 
                  href="/conversations" 
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  My Entries
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowCrisisMenu(!showCrisisMenu)}
                    className="text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-1"
                  >
                    <span>🆘</span>
                    Support
                  </button>
                  <AnimatePresence>
                    {showCrisisMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-72 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 p-6 z-50"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                            <span className="text-white text-sm">🆘</span>
                          </div>
                          <h3 className="font-bold text-gray-900">Crisis Resources</h3>
                        </div>
                        <div className="space-y-3">
                          <a 
                            href="tel:988" 
                            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:from-red-100 hover:to-orange-100 transition-colors"
                          >
                            <span className="text-xl">📞</span>
                            <div>
                              <div className="font-semibold text-red-700">988 - Crisis Lifeline</div>
                              <div className="text-sm text-red-600">Call now for immediate help</div>
                            </div>
                          </a>
                          <a 
                            href="sms:741741" 
                            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-colors"
                          >
                            <span className="text-xl">💬</span>
                            <div>
                              <div className="font-semibold text-blue-700">Text HOME to 741741</div>
                              <div className="text-sm text-blue-600">Crisis text line</div>
                            </div>
                          </a>
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-gray-600 text-sm leading-relaxed">
                              If you're in immediate danger, call 911 or go to your nearest emergency room.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Hello, {user?.name || user?.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowCrisisMenu(!showCrisisMenu)}
                    className="text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-1"
                  >
                    <span>🆘</span>
                    Crisis Support
                  </button>
                  <AnimatePresence>
                    {showCrisisMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-72 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 p-6 z-50"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                            <span className="text-white text-sm">🆘</span>
                          </div>
                          <h3 className="font-bold text-gray-900">Immediate Help</h3>
                        </div>
                        <div className="space-y-3">
                          <a 
                            href="tel:988" 
                            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:from-red-100 hover:to-orange-100 transition-colors"
                          >
                            <span className="text-xl">📞</span>
                            <div>
                              <div className="font-semibold text-red-700">988 - Suicide & Crisis Lifeline</div>
                              <div className="text-sm text-red-600">24/7 crisis support</div>
                            </div>
                          </a>
                          <a 
                            href="sms:741741" 
                            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-colors"
                          >
                            <span className="text-xl">💬</span>
                            <div>
                              <div className="font-semibold text-blue-700">Crisis Text Line: HOME to 741741</div>
                              <div className="text-sm text-blue-600">Text support available</div>
                            </div>
                          </a>
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-gray-600 text-sm leading-relaxed">
                              Free, confidential support 24/7. You're not alone.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link 
                  href="/auth/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/login"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <motion.span
                animate={showMobileMenu ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block w-5 h-0.5 bg-gray-600 mb-1 origin-center"
              />
              <motion.span
                animate={showMobileMenu ? { opacity: 0 } : { opacity: 1 }}
                className="block w-5 h-0.5 bg-gray-600 mb-1"
              />
              <motion.span
                animate={showMobileMenu ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block w-5 h-0.5 bg-gray-600 origin-center"
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 py-4"
            >
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/" 
                      className="block text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      📝 Journal
                    </Link>
                    <Link 
                      href="/conversations" 
                      className="block text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      📚 My Entries
                    </Link>
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium text-gray-800 mb-2">Crisis Support</div>
                      <div className="space-y-1 text-sm">
                        <a 
                          href="tel:988" 
                          className="block text-red-600 hover:text-red-700 font-medium"
                        >
                          📞 988 - Crisis Lifeline
                        </a>
                        <a 
                          href="sms:741741" 
                          className="block text-blue-600 hover:text-blue-700 font-medium"
                        >
                          💬 Text HOME to 741741
                        </a>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="px-3 py-2 text-sm text-gray-600">
                        Signed in as {user?.name || user?.email?.split('@')[0]}
                      </div>
                      <button
                        onClick={() => {
                          logout()
                          setShowMobileMenu(false)
                        }}
                        className="block w-full text-left text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium text-gray-800 mb-2">Need Help Now?</div>
                      <div className="space-y-1 text-sm">
                        <a 
                          href="tel:988" 
                          className="block text-red-600 hover:text-red-700 font-medium"
                        >
                          📞 988 - Suicide & Crisis Lifeline
                        </a>
                        <a 
                          href="sms:741741" 
                          className="block text-blue-600 hover:text-blue-700 font-medium"
                        >
                          💬 Crisis Text Line: HOME to 741741
                        </a>
                        <p className="text-gray-500 text-xs mt-2">
                          Free, confidential support 24/7
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3 space-y-2">
                      <Link 
                        href="/auth/login"
                        className="block text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        href="/auth/login"
                        className="block bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-3 py-3 rounded-2xl transition-all text-center mx-3 font-semibold shadow-lg"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Get Started
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close menus */}
      {(showMobileMenu || showCrisisMenu) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowMobileMenu(false)
            setShowCrisisMenu(false)
          }}
        />
      )}
    </motion.nav>
  )
} 