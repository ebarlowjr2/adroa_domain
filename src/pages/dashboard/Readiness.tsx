import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Mail, QrCode, Bot, TrendingUp, Lock } from 'lucide-react'

const premiumFeatures = [
  {
    title: 'Random Phishing Tests',
    description: 'Send simulated phishing emails to employees at random intervals to test awareness and response.',
    icon: Mail,
  },
  {
    title: 'Quarterly Readiness Checks',
    description: 'Automated quarterly assessments to measure security posture and identify training gaps.',
    icon: Shield,
  },
  {
    title: 'AI Scam Simulations',
    description: 'Test employee resilience against AI-generated voice, email, and chat-based social engineering attacks.',
    icon: Bot,
  },
  {
    title: 'QR Code Scam Tests',
    description: 'Deploy fake QR codes to test whether employees scan unknown codes without verification.',
    icon: QrCode,
  },
  {
    title: 'Department Risk Trends',
    description: 'Track security awareness metrics by department over time with detailed analytics and reporting.',
    icon: TrendingUp,
  },
]

export default function Readiness() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">Readiness Testing</h1>
          <Badge variant="warning">Premium</Badge>
        </div>
        <p className="text-sm text-white/60">
          Advanced security readiness testing and employee risk assessment tools
        </p>
      </div>

      {/* Premium Banner */}
      <div className="mb-8 rounded-2xl border border-brand-accent/30 bg-gradient-to-r from-brand-accent/10 to-transparent p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-brand-accent/20 p-3">
            <Lock size={24} className="text-brand-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Upgrade to Premium</h2>
            <p className="mt-1 text-sm text-white/60">
              Unlock advanced readiness testing features including phishing simulations,
              AI scam tests, and department-level risk analytics. Contact us to learn more
              about the Premium plan.
            </p>
            <button className="mt-4 rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-brand-accent-light">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {premiumFeatures.map((feature) => (
          <Card key={feature.title} className="relative overflow-hidden opacity-75">
            <div className="absolute right-3 top-3">
              <Lock size={14} className="text-white/30" />
            </div>
            <CardHeader>
              <div className="mb-3 inline-flex rounded-lg bg-white/5 p-2.5 text-white/50">
                <feature.icon size={20} />
              </div>
              <CardTitle className="text-white/80">{feature.title}</CardTitle>
            </CardHeader>
            <CardDescription>{feature.description}</CardDescription>
          </Card>
        ))}
      </div>

      {/* Coming Soon Timeline */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-brand-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Roadmap</h3>
        <div className="space-y-4">
          {[
            { phase: 'Phase 1', label: 'Email Phishing Simulations', status: 'Planned' },
            { phase: 'Phase 2', label: 'QR Code & USB Drop Tests', status: 'Planned' },
            { phase: 'Phase 3', label: 'AI Voice & Chat Simulations', status: 'Research' },
            { phase: 'Phase 4', label: 'Full Department Risk Dashboard', status: 'Research' },
          ].map((item) => (
            <div key={item.phase} className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-white/50">
                {item.phase.split(' ')[1]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white/70">{item.label}</p>
              </div>
              <Badge variant="outline">{item.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
