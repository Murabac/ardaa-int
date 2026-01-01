'use client'

import { useEffect, useState } from 'react'
import { LayoutDashboard, Sparkles, Package, Users, Phone, FileText } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    teamMembers: 0,
    contactInfo: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats from APIs
        const [servicesRes, projectsRes, teamRes, contactRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/projects'),
          fetch('/api/team'),
          fetch('/api/contact-info')
        ])

        const services = await servicesRes.json()
        const projects = await projectsRes.json()
        const team = await teamRes.json()
        const contact = await contactRes.json()

        setStats({
          services: services.success ? services.data.length : 0,
          projects: projects.success ? projects.data.length : 0,
          teamMembers: team.success && team.data?.team_members ? team.data.team_members.length : 0,
          contactInfo: contact.success ? 1 : 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      name: 'Services',
      value: stats.services,
      icon: Package,
      href: '/admin/services',
      color: 'bg-blue-500'
    },
    {
      name: 'Projects',
      value: stats.projects,
      icon: FileText,
      href: '/admin/projects',
      color: 'bg-green-500'
    },
    {
      name: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      href: '/admin/team',
      color: 'bg-purple-500'
    },
    {
      name: 'Contact Info',
      value: stats.contactInfo,
      icon: Phone,
      href: '/admin/contact-info',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the Ardaa Interior Admin Panel</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-12 mb-4" />
              <div className="h-6 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/hero"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Sparkles className="w-5 h-5 text-[#1d2856]" />
              <span className="font-medium text-gray-700">Edit Hero Section</span>
            </Link>
            <Link
              href="/admin/services"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="w-5 h-5 text-[#1d2856]" />
              <span className="font-medium text-gray-700">Manage Services</span>
            </Link>
            <Link
              href="/admin/projects"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-5 h-5 text-[#1d2856]" />
              <span className="font-medium text-gray-700">Manage Projects</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-gray-600">
            <p className="text-sm">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  )
}


