'use client'

import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/AuthContext'
import Logo from '@/components/ui/Logo'
import { 
  ArrowLeft, 
  Home,
  Edit3, 
  Wind, 
  Brain, 
  LifeBuoy, 
  User,
  LogOut,
  Heart
} from 'lucide-react'

interface FeatureNavigationProps {
  title: string
  description: string
  showBackButton?: boolean
}

const navigationItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/journal', icon: Edit3, label: 'Journal' },
  { path: '/breathing', icon: Wind, label: 'Breathing' },
  { path: '/grounding', icon: Brain, label: 'Grounding' },
  { path: '/crisis', icon: LifeBuoy, label: 'Crisis Support' },
]

export default function FeatureNavigation({ 
  title, 
  description, 
  showBackButton = false 
}: FeatureNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push('/dashboard')
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/40 shadow-sm"
    >
      <div className="container mx-auto px-4 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          {/* Left: Back Button + Logo */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md hover:bg-white/80 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Logo 
                size="lg" 
                showText={true} 
                onClick={handleGoHome}
                textClassName="text-xl font-journal font-semibold"
              />
            </motion.div>
          </div>

          {/* Right: User Info + Logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block text-right bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md">
                  <p className="text-sm font-bold text-gray-900">{user.name || user.email}</p>
                  <div className="flex items-center justify-end mt-1">
                    <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200 text-xs">
                      <User className="w-3 h-3 mr-1" />
                      {user.aiChatsUsed || 0}/{user.aiChatsLimit || 10} AI chats
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl px-4 py-2 shadow-md font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
          <p className="text-gray-600 text-lg">{description}</p>
        </div>

        {/* Navigation Tabs */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
          <CardContent className="p-4">
            <nav className="flex items-center justify-center">
              <div className="flex items-center space-x-2 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl p-2 border border-white/40 shadow-inner">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.path
                  
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => router.push(item.path)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'
                      }`}
                      whileHover={{ scale: isActive ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </nav>
          </CardContent>
        </Card>
      </div>
    </motion.header>
  )
} 