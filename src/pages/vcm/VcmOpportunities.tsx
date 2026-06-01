import { useEffect, useState } from 'react'
import { VcmLayout } from '@/components/vcm/VcmLayout'
import { supabase } from '@/lib/supabase'
import type { TrainingOpportunity } from '@/lib/vcm-types'
import { Compass, ExternalLink, Filter, Sparkles } from 'lucide-react'

export default function VcmOpportunities() {
  const [opportunities, setOpportunities] = useState<TrainingOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    unit_type: '',
    cost: '',
    delivery_method: '',
  })

  useEffect(() => {
    supabase
      .from('training_opportunities')
      .select('*')
      .eq('active', true)
      .order('title')
      .then(({ data }) => {
        setOpportunities((data || []) as TrainingOpportunity[])
        setLoading(false)
      })
  }, [])

  const categories = [...new Set(opportunities.map(o => o.category))].sort()
  const unitTypes = [...new Set(opportunities.map(o => o.unit_type))].sort()

  const filtered = opportunities.filter(o => {
    if (filters.category && o.category !== filters.category) return false
    if (filters.unit_type && o.unit_type !== filters.unit_type) return false
    if (filters.cost) {
      const isFree = o.cost.toLowerCase() === 'free' || o.cost.toLowerCase() === 'included'
      if (filters.cost === 'free' && !isFree) return false
      if (filters.cost === 'paid' && isFree) return false
    }
    if (filters.delivery_method && o.delivery_method !== filters.delivery_method) return false
    return true
  })

  if (loading) {
    return (
      <VcmLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      </VcmLayout>
    )
  }

  return (
    <VcmLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Training Opportunities</h1>
        <p className="text-sm text-white/40">Discover courses, webinars, and events to earn CEU/CPE/PDU credits</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Filter size={16} className="text-white/40" />
        <select
          value={filters.category}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-brand-accent focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filters.unit_type}
          onChange={e => setFilters(prev => ({ ...prev, unit_type: e.target.value }))}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-brand-accent focus:outline-none"
        >
          <option value="">All Unit Types</option>
          {unitTypes.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select
          value={filters.cost}
          onChange={e => setFilters(prev => ({ ...prev, cost: e.target.value }))}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-brand-accent focus:outline-none"
        >
          <option value="">Any Cost</option>
          <option value="free">Free / Included</option>
          <option value="paid">Paid</option>
        </select>
        <select
          value={filters.delivery_method}
          onChange={e => setFilters(prev => ({ ...prev, delivery_method: e.target.value }))}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-brand-accent focus:outline-none"
        >
          <option value="">Any Delivery</option>
          <option value="virtual">Virtual</option>
          <option value="in-person">In Person</option>
          <option value="self-paced">Self-Paced</option>
          <option value="hybrid">Hybrid</option>
        </select>
        {(filters.category || filters.unit_type || filters.cost || filters.delivery_method) && (
          <button
            onClick={() => setFilters({ category: '', unit_type: '', cost: '', delivery_method: '' })}
            className="text-xs text-brand-accent hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Opportunities Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-brand-card py-16 text-center">
          <Compass size={48} className="mx-auto mb-4 text-white/20" />
          <h3 className="text-lg font-semibold text-white">No matching opportunities</h3>
          <p className="mt-2 text-sm text-white/40">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map(opp => (
            <div key={opp.id} className="rounded-2xl border border-white/10 bg-brand-card p-5 transition-all hover:border-brand-accent/30">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{opp.title}</h3>
                  <p className="text-xs text-white/40">{opp.provider}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  opp.cost.toLowerCase() === 'free' || opp.cost.toLowerCase() === 'included'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {opp.cost}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/50">{opp.category}</span>
                {opp.estimated_units && (
                  <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-xs text-brand-accent">
                    ~{opp.estimated_units} {opp.unit_type}
                  </span>
                )}
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs capitalize text-white/50">
                  {opp.delivery_method}
                </span>
              </div>
              {opp.registration_url && (
                <a
                  href={opp.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-brand-accent hover:underline"
                >
                  Learn more <ExternalLink size={10} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Coming Soon */}
      <div className="mt-8 rounded-2xl border border-brand-accent/20 bg-brand-accent/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-brand-accent" />
          <h2 className="text-lg font-semibold text-white">Coming Soon</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Vendor Monitoring', desc: 'Automatic tracking of new courses from CompTIA, ISC2, ISACA, and more.' },
            { title: 'Webinar Discovery', desc: 'Find live and recorded webinars that count toward your certifications.' },
            { title: 'CEU/CPE Opportunity Alerts', desc: 'Get notified when new credit-eligible training matches your certifications.' },
            { title: 'Renewal Reminders', desc: 'Automated email reminders before your certifications expire.' },
            { title: 'Personalized Recommendations', desc: 'AI-powered suggestions based on your certification portfolio.' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/5 p-4">
              <h4 className="text-sm font-medium text-white">{item.title}</h4>
              <p className="mt-1 text-xs text-white/40">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </VcmLayout>
  )
}
