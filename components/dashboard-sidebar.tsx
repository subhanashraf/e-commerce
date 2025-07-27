"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingCart, Users, Home, PlusCircle, LogOut, Store } from "lucide-react"
import { useState, useEffect } from "react"

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Add Product",
    href: "/dashboard/add-product",
    icon: PlusCircle,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
]

interface DashboardSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("darkstore-auth")
    router.push("/login")
  }

  const handleLinkClick = () => {
    if (isMobile) {
      onToggle()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col z-50 transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16",
          isMobile && !isOpen && "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {isOpen && (
            <Link href="/" className="flex items-center space-x-2 min-w-0">
              <Store className="h-6 w-6 flex-shrink-0" />
              <span className="text-lg font-bold truncate">DarkStore Admin</span>
            </Link>
          )}
          {!isOpen && (
            <div className="flex justify-center w-full">
              <Store className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href} onClick={handleLinkClick}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start hover:scale-105 transition-transform",
                    isActive && "bg-secondary",
                    !isOpen && "justify-center px-2",
                  )}
                >
                  <Icon className={cn("h-4 w-4 flex-shrink-0", isOpen && "mr-3")} />
                  {isOpen && <span className="truncate">{item.title}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-border space-y-1">
          <Link href="/" onClick={handleLinkClick}>
            <Button
              variant="outline"
              className={cn(
                "w-full bg-transparent hover:scale-105 transition-transform",
                !isOpen && "justify-center px-2",
              )}
            >
              <Home className={cn("h-4 w-4 flex-shrink-0", isOpen && "mr-2")} />
              {isOpen && <span className="truncate">Back to Store</span>}
            </Button>
          </Link>
          <Button
            variant="destructive"
            className={cn("w-full hover:scale-105 transition-transform", !isOpen && "justify-center px-2")}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-4 w-4 flex-shrink-0", isOpen && "mr-2")} />
            {isOpen && <span className="truncate">Logout</span>}
          </Button>
        </div>
      </div>
    </>
  )
}
