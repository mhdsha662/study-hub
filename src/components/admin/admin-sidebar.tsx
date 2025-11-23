"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Upload,
  FileText,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  MessageSquare,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Upload Resources",
    href: "/admin/upload",
    icon: Upload,
  },
  {
    title: "Manage Resources",
    href: "/admin/resources",
    icon: FileText,
  },
  {
    title: "Manage Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">Admin Panel</span>
        </div>
      </div>
      
      <nav className="px-4 space-y-2">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}