'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  textClassName?: string
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12'
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl'
}

export default function Logo({ 
  size = 'lg', 
  showText = true, 
  textClassName,
  className,
  onClick 
}: LogoProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("relative", sizeClasses[size])}>
        <Image
          src="/whisperbox_logo.png"
          alt="WhisperBox Logo"
          width={48}
          height={48}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold bg-gradient-to-r from-whisper-green-600 to-whisper-green-700 bg-clip-text text-transparent",
            textSizeClasses[size],
            textClassName
          )}>
            WhisperBox
          </span>
          {size === 'lg' || size === 'xl' ? (
            <span className="text-xs text-gray-500 -mt-1">Mental Health Companion</span>
          ) : null}
        </div>
      )}
    </div>
  )
}

export function LogoIcon({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <Image
        src="/whisperbox_logo.png"
        alt="WhisperBox"
        width={48}
        height={48}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  )
}