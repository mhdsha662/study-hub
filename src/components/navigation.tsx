"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Cambridge Study Hub
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/past-papers"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Past Papers
              </Link>
              <Link
                href="/books"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Books
              </Link>
              <Link
                href="/notes"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Notes
              </Link>
              <Link
                href="/syllabi"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Syllabi
              </Link>
            </div>
          </div>

          {/* Desktop user menu */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name || ""} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  {session.user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/bookmarks">
                      <FileText className="mr-2 h-4 w-4" />
                      Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/past-papers"
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Past Papers
            </Link>
            <Link
              href="/books"
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Books
            </Link>
            <Link
              href="/notes"
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Notes
            </Link>
            <Link
              href="/syllabi"
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Syllabi
            </Link>
            
            {status === "loading" ? (
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mx-3" />
            ) : session ? (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || ""} />
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={toggleMenu}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/bookmarks"
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Bookmarks
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      toggleMenu()
                    }}
                    className="text-gray-700 hover:text-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t pt-4 mt-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/auth/signin" onClick={toggleMenu}>
                    Sign in
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/auth/signup" onClick={toggleMenu}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}