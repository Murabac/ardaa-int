'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { usePathname } from 'next/navigation'

export default function AdminLayoutWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // For login page, render without layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}

