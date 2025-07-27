"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    home: "Home",
    shop: "Shop",
    cart: "Cart",
    login: "Login",
    dashboard: "Dashboard",

    // Home Page
    "hero.title1": "Premium Electronics",
    "hero.subtitle1": "Discover cutting-edge technology",
    "hero.title2": "Fashion Forward",
    "hero.subtitle2": "Style that speaks volumes",
    "hero.title3": "Fitness & Wellness",
    "hero.subtitle3": "Gear up for your best self",
    "featured.title": "Featured Products",
    "featured.subtitle": "Discover our handpicked selection of premium products",

    // Product
    "product.addToCart": "Add to Cart",
    "product.buyNow": "Buy Now",
    "product.inStock": "in stock",
    "product.outOfStock": "Out of stock",

    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.continueShopping": "Continue Shopping",
    "cart.checkout": "Proceed to Checkout",
    "cart.clear": "Clear Cart",

    // Company
    "company.about": "About Us",
    "company.mission": "Our Mission",
    "company.vision": "Our Vision",
    "company.values": "Our Values",
    "company.contact": "Contact Us",

    // FAQ
    "faq.title": "Frequently Asked Questions",

    // Footer
    "footer.company": "Company",
    "footer.support": "Support",
    "footer.legal": "Legal",
    "footer.follow": "Follow Us",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    shop: "المتجر",
    cart: "السلة",
    login: "تسجيل الدخول",
    dashboard: "لوحة التحكم",

    // Home Page
    "hero.title1": "إلكترونيات متميزة",
    "hero.subtitle1": "اكتشف أحدث التقنيات",
    "hero.title2": "أزياء عصرية",
    "hero.subtitle2": "أسلوب يتحدث عن نفسه",
    "hero.title3": "اللياقة والصحة",
    "hero.subtitle3": "استعد لأفضل ما لديك",
    "featured.title": "المنتجات المميزة",
    "featured.subtitle": "اكتشف مجموعتنا المختارة من المنتجات المتميزة",

    // Product
    "product.addToCart": "أضف للسلة",
    "product.buyNow": "اشتري الآن",
    "product.inStock": "متوفر",
    "product.outOfStock": "غير متوفر",

    // Cart
    "cart.title": "سلة التسوق",
    "cart.empty": "سلتك فارغة",
    "cart.continueShopping": "متابعة التسوق",
    "cart.checkout": "إتمام الشراء",
    "cart.clear": "إفراغ السلة",

    // Company
    "company.about": "من نحن",
    "company.mission": "مهمتنا",
    "company.vision": "رؤيتنا",
    "company.values": "قيمنا",
    "company.contact": "اتصل بنا",

    // FAQ
    "faq.title": "الأسئلة الشائعة",

    // Footer
    "footer.company": "الشركة",
    "footer.support": "الدعم",
    "footer.legal": "قانوني",
    "footer.follow": "تابعنا",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("darkstore-language")
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguage(savedLang)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("darkstore-language", language)
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
