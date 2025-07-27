"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <AuthGuard>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <div className="flex h-screen bg-background overflow-hidden">
          <DashboardSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

          <div
            className={cn(
              "flex-1 flex flex-col transition-all duration-300 ease-in-out",
              sidebarOpen && !isMobile ? "ml-64" : "ml-16",
              isMobile && "ml-0",
            )}
          >
            {/* Top Bar */}
            <div className="h-16 border-b border-border bg-card flex items-center px-4 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hover:scale-110 transition-transform"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="ml-4">
                <h1 className="text-lg font-semibold">Dashboard</h1>
              </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </AuthGuard>
  )
}
