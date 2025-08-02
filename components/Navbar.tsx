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
      className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40"
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
                        className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                      >
                        <h3 className="font-semibold text-gray-800 mb-3">Crisis Resources</h3>
                        <div className="space-y-2 text-sm">
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
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-gray-600 text-xs">
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
                        className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                      >
                        <h3 className="font-semibold text-gray-800 mb-3">Immediate Help</h3>
                        <div className="space-y-2 text-sm">
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
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-gray-600 text-xs">
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
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
                        className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-center mx-3"
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