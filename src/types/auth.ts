import { DefaultSession, DefaultUser } from "next-auth"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      hasBookAccess: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: UserRole
    hasBookAccess: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    hasBookAccess: boolean
  }
}