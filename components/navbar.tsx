"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useState } from "react"

export function Navbar() {
  const { totalItems } = useCart()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/shop", label: t("shop") },
    { href: "/cart", label: t("cart") },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="h-8 w-8" />
              <span className="text-2xl font-bold">DarkStore</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-6 absolute left-1/2 -translate-x-1/2">

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors hover:scale-105 transform duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <LanguageSwitcher />

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:scale-110 transition-transform">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/login">
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="text-xl font-bold mb-6">DarkStore</SheetTitle>
              <div className="flex flex-col space-y-4 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  href="/login"
                  className="text-lg hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t("login")}
                </Link>

                {/* Mobile Icons */}
                <div className="flex items-center gap-4 mt-6">
                  <LanguageSwitcher />

                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse">
                          {totalItems}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
