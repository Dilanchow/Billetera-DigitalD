'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, CreditCard, DollarSign, LogOut } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Inicio', href: '/dashboard' },
  { icon: CreditCard, label: 'Transacciones', href: '/transactions' },
  { icon: DollarSign, label: 'Pagar Servicios', href: '/pay-services' },
]

export function Navigation() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card p-4 md:left-0 md:top-0 md:h-screen md:w-20 md:flex-col">
      <div className="flex justify-around md:flex-col md:h-full">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
              pathname === item.href ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
            onMouseEnter={() => setHovered(item.label)}
            onMouseLeave={() => setHovered(null)}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1 md:hidden">{item.label}</span>
            {hovered === item.label && (
              <motion.span
                className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded hidden md:block"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {item.label}
              </motion.span>
            )}
            {pathname === item.href && (
              <motion.div
                className="absolute inset-0 bg-primary/10 rounded-lg z-[-1]"
                layoutId="active-nav-item"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        ))}
        <button className="flex flex-col items-center justify-center p-2 rounded-lg text-destructive hover:text-destructive/80 transition-colors duration-200">
          <LogOut size={24} />
          <span className="text-xs mt-1 md:hidden">Salir</span>
        </button>
      </div>
    </nav>
  )
}


