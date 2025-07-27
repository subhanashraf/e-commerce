"use client"

export function TopBanner() {
  const message =
    process.env.NEXT_PUBLIC_TOP_BANNER_MESSAGE || "🎉 Welcome to DarkStore - Premium E-commerce Experience!"

  return (
    <div className="w-full h-4 bg-green-500 flex items-center justify-center text-white text-xs font-medium animate-pulse">
      <div className="truncate px-2">{message}</div>
    </div>
  )
}
