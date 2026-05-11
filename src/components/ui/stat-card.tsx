import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: string
  className?: string
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-2xl border border-white/10 bg-brand-card p-5 transition-all duration-200 hover:border-brand-accent/30 hover:shadow-lg hover:shadow-brand-accent/5',
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60">{title}</p>
          <p className="mt-1 text-3xl font-bold text-white">{value}</p>
          {trend && <p className="mt-1 text-xs text-brand-accent">{trend}</p>}
        </div>
        <div className="rounded-lg bg-brand-accent/10 p-2.5 text-brand-accent">
          {icon}
        </div>
      </div>
    </div>
  )
}
