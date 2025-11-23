"use client"

import { useState, useEffect } from "react"
import { VariantProps } from "class-variance-authority"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Badge,
  badgeVariants,
} from "@/components/ui/badge"
import {
  Users,
  Plus,
  Search,
  Mail,
  Calendar,
  Shield,
  BookOpen,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  id: string
  email: string
  name?: string
  role: "ADMIN" | "STUDENT"
  hasBookAccess: boolean
  isActive: boolean
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "STUDENT" as const,
    hasBookAccess: false,
  })

  useEffect(() => {
    // Mock data - replace with actual API call
    setUsers([
      {
        id: "1",
        email: "admin@cambridge.com",
        name: "Admin User",
        role: "ADMIN",
        hasBookAccess: true,
        isActive: true,
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        email: "student1@example.com",
        name: "John Student",
        role: "STUDENT",
        hasBookAccess: true,
        isActive: true,
        createdAt: "2024-02-20",
      },
      {
        id: "3",
        email: "student2@example.com",
        name: "Jane Smith",
        role: "STUDENT",
        hasBookAccess: false,
        isActive: true,
        createdAt: "2024-03-10",
      },
      {
        id: "4",
        email: "inactive@example.com",
        name: "Inactive User",
        role: "STUDENT",
        hasBookAccess: false,
        isActive: false,
        createdAt: "2024-01-05",
      },
    ])
  }, [])

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = () => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...newUser,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setUsers(prev => [...prev, user])
    setNewUser({
      email: "",
      name: "",
      role: "STUDENT",
      hasBookAccess: false,
    })
    setIsAddUserOpen(false)
  }

  const toggleBookAccess = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, hasBookAccess: !user.hasBookAccess } : user
    ))
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ))
  }

  const getRoleBadgeVariant = (role: string): VariantProps<typeof badgeVariants>["variant"] => {
    return role === "ADMIN" ? "destructive" : "secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600">Add, remove, and manage user permissions</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and set their permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasBookAccess"
                  checked={newUser.hasBookAccess}
                  onChange={(e) => setNewUser(prev => ({ ...prev, hasBookAccess: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hasBookAccess">Grant book access</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-gray-500">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === "ADMIN").length}</p>
                <p className="text-xs text-gray-500">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.hasBookAccess).length}</p>
                <p className="text-xs text-gray-500">Book Access</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-green-600"></div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Book Access</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name || "No name"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookAccess(user.id)}
                      className="flex items-center space-x-1"
                    >
                      {user.hasBookAccess ? (
                        <>
                          <ToggleRight className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Granted</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-400">Denied</span>
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{user.createdAt}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Note:</strong> Book access is controlled through unique login credentials. 
          Each user with book access receives their own unique credentials that cannot be shared.
        </AlertDescription>
      </Alert>
    </div>
  )
}