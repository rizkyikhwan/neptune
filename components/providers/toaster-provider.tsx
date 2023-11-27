"use client"

import useMobileView from '@/app/hooks/useMobileView'
import { Toaster } from 'sonner'

export default function ToasterProvider() {
  const { isMobile } = useMobileView()

  return <Toaster position={isMobile ? "top-center" : undefined} richColors />
}