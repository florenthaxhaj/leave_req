"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const isLoggedIn = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="font-semibold">
          Leave Request System
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="secondary">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

