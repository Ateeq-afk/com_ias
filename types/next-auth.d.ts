import { UserRole } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name?: string
    image?: string
    role: UserRole
    emailVerified?: Date | null
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      role: UserRole
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    role: UserRole
  }
}