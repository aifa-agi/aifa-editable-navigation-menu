// @/app/layout.tsx

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Link from "next/link"
import { Toaster } from 'sonner'
import NavBarRoleSelector from '@/components/nav-bar-role-selector'
import { RoleProvider } from "@/app/contexts/role-provider"
import { DialogsProvider } from './contexts/dialogs-providers'
import { NavigationMenuProvider } from "@/app/contexts/navigation-menu-provider"

export const metadata: Metadata = {
  title: 'AIFA EDITABLE NAVIGATION MENU NEXTJS STARTER ',
  description: 'Take your Next.js project to the next level with a truly dynamic navigation menu! 🛠️✨ With the new editable-nav-bar-nextjs-starter, you can add, rename, reorder, and manage all your categories and links—directly from the live menu interface. Instantly assign roles, set badges, and experience real-time updates without diving into a separate admin panel. Perfect for SaaS, dashboards, and any modern web app looking for a seamless, in-menu admin experience.',
  generator: 'aifa.dev',
  icons: "/logo.png",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <NavigationMenuProvider>
          <RoleProvider>
            <DialogsProvider>
              <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                      <Link 
                        href="/" 
                        className="text-white font-bold text-xl hover:text-blue-400 transition-colors duration-150 cursor-pointer"
                      >
                        AIFA
                      </Link>
                    </div>
                    <div className="flex items-center ">
                      <NavBarRoleSelector />
                    </div>
                  </div>
                </div>
              </header>
              <main className="pt-16 h-screen overflow-hidden">
                {children}
              </main>
              <Toaster richColors position="top-center" />
            </DialogsProvider>
          </RoleProvider>
        </NavigationMenuProvider>
      </body>
    </html>
  );
}
