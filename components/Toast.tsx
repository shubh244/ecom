'use client'

import { useEffect } from 'react'
import { FiCheckCircle, FiX, FiAlertCircle } from 'react-icons/fi'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type]

  const Icon = type === 'success' ? FiCheckCircle : type === 'error' ? FiAlertCircle : FiCheckCircle

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        <Icon className="text-xl flex-shrink-0" />
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="hover:bg-white/20 rounded p-1">
          <FiX />
        </button>
      </div>
    </div>
  )
}

