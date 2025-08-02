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
  showBackButton = true 
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
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
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
                className="font-ui"
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
          <div className="flex items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium font-ui">{user.name || user.email}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {user.aiChatsUsed || 0}/{user.aiChatsLimit || 10} AI chats
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="font-ui"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-journal font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground font-ui">{description}</p>
        </div>

        {/* Navigation Tabs */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-3">
            <nav className="flex items-center justify-center">
              <div className="flex items-center space-x-1 bg-muted/30 rounded-xl p-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.path
                  
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => router.push(item.path)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-whisper-green-500 to-whisper-green-600 text-white shadow-md'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      }`}
                      whileHover={{ scale: isActive ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline font-ui">{item.label}</span>
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