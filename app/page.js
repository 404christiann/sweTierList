'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import companiesData from '../data/companies.json'

// Register plugins once, client-side only
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Tier config ─────────────────────────────────────────────────────────────

const TIERS = [
  {
    id: 'easy',
    label: 'EASY',
    emoji: '🟢',
    desc: 'Take-home, pair programming, no timed DSA puzzles',
    headerBg: 'bg-green-50 dark:bg-green-950',
    headerBorder: 'border-green-200 dark:border-green-800',
    headerText: 'text-green-800 dark:text-green-200',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cardBorder: 'border-green-200 dark:border-green-800',
  },
  {
    id: 'medium-easy',
    label: 'MEDIUM-EASY',
    emoji: '🔵',
    desc: '1–2 LC easy/medium rounds, architectural or practical emphasis',
    headerBg: 'bg-blue-50 dark:bg-blue-950',
    headerBorder: 'border-blue-200 dark:border-blue-800',
    headerText: 'text-blue-800 dark:text-blue-200',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    cardBorder: 'border-blue-200 dark:border-blue-800',
  },
  {
    id: 'medium',
    label: 'MEDIUM',
    emoji: '🟡',
    desc: 'Standard LC medium/hard loop + system design, coachable with prep',
    headerBg: 'bg-amber-50 dark:bg-amber-950',
    headerBorder: 'border-amber-200 dark:border-amber-800',
    headerText: 'text-amber-800 dark:text-amber-200',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    cardBorder: 'border-amber-200 dark:border-amber-800',
  },
  {
    id: 'medium-hard',
    label: 'MEDIUM-HARD',
    emoji: '🟠',
    desc: 'LC medium/hard expected, multi-round loops, strong prep required',
    headerBg: 'bg-orange-50 dark:bg-orange-950',
    headerBorder: 'border-orange-200 dark:border-orange-800',
    headerText: 'text-orange-800 dark:text-orange-200',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    cardBorder: 'border-orange-200 dark:border-orange-800',
  },
  {
    id: 'hard',
    label: 'HARD',
    emoji: '🔴',
    desc: 'LC hard is the norm, deep system design, extensive multi-round loops',
    headerBg: 'bg-red-50 dark:bg-red-950',
    headerBorder: 'border-red-200 dark:border-red-800',
    headerText: 'text-red-800 dark:text-red-200',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cardBorder: 'border-red-200 dark:border-red-800',
  },
  {
    id: 'brutal',
    label: 'BRUTAL',
    emoji: '💀',
    desc: 'Elite-level, multi-hour sessions, theoretical CS + systems mastery',
    headerBg: 'bg-rose-950',
    headerBorder: 'border-rose-800',
    headerText: 'text-rose-100',
    badge: 'bg-rose-900 text-rose-100',
    cardBorder: 'border-rose-800',
  },
]

const REGION_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ba', label: 'Bay Area' },
  { id: 'sc', label: 'SoCal' },
  { id: 'both', label: 'Both' },
  { id: 'remote', label: '🌐 Remote' },
  { id: 'global', label: '🌍 Global' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function regionMatches(company, filter) {
  if (filter === 'all') return true
  if (filter === 'remote') return company.remote === true
  if (filter === 'ba') return company.region === 'ba' || company.region === 'both'
  if (filter === 'sc') return company.region === 'sc' || company.region === 'both'
  if (filter === 'both') return company.region === 'both'
  if (filter === 'global') return company.region === 'global'
  return true
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RegionTag({ region, remote }) {
  const tags = []
  if (region === 'ba') tags.push({ label: 'BA', cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' })
  if (region === 'sc') tags.push({ label: 'SC', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' })
  if (region === 'both') {
    tags.push({ label: 'BA', cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' })
    tags.push({ label: 'SC', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' })
  }
  if (region === 'global') tags.push({ label: 'Global', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' })
  if (remote) tags.push({ label: 'Remote', cls: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200' })
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map((t) => (
        <span key={t.label} className={`text-xs font-semibold px-1.5 py-0.5 rounded ${t.cls}`}>
          {t.label}
        </span>
      ))}
    </div>
  )
}

function CompanyCard({ company, tier, onClick }) {
  const cardRef = useRef(null)

  function handleMouseEnter() {
    gsap.to(cardRef.current, {
      y: -3,
      scale: 1.02,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      duration: 0.2,
      ease: 'power2.out',
    })
  }

  function handleMouseLeave() {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      duration: 0.25,
      ease: 'power2.out',
    })
  }

  function handleMouseDown() {
    gsap.to(cardRef.current, { scale: 0.97, duration: 0.1, ease: 'power2.in' })
  }

  function handleMouseUp() {
    gsap.to(cardRef.current, { scale: 1.02, duration: 0.15, ease: 'back.out(2)' })
  }

  return (
    <button
      ref={cardRef}
      onClick={() => onClick(company)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`company-card text-left w-full bg-white dark:bg-slate-800 border ${tier.cardBorder} rounded-xl p-4 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400`}
    >
      <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight">{company.name}</div>
      <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-snug">{company.interview_style}</div>
      <RegionTag region={company.region} remote={company.remote} />
    </button>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function Modal({ company, tier, onClose }) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  const [saved, setSaved] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem('sweTierList_saved') || '[]')
      return list.includes(company.name)
    } catch {
      return false
    }
  })

  // Animate in on mount
  useEffect(() => {
    gsap.from(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    })
    gsap.from(contentRef.current, {
      scale: 0.88,
      opacity: 0,
      y: 24,
      duration: 0.38,
      ease: 'back.out(1.6)',
    })
  }, [])

  // Animate out, then call onClose
  const handleClose = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, ease: 'power2.in' })
    gsap.to(contentRef.current, {
      scale: 0.9,
      opacity: 0,
      y: 12,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  function toggleSave() {
    try {
      const list = JSON.parse(localStorage.getItem('sweTierList_saved') || '[]')
      const next = saved
        ? list.filter((n) => n !== company.name)
        : [...list, company.name]
      localStorage.setItem('sweTierList_saved', JSON.stringify(next))
      setSaved(!saved)
    } catch {}
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">{tier.emoji}</span>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{company.name}</h2>
            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${tier.badge}`}>
              {tier.label}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Interview Style</div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{company.interview_style}</div>
        </div>

        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Details</div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{company.detail}</p>
        </div>

        <div className="mb-5">
          <RegionTag region={company.region} remote={company.remote} />
        </div>

        {company.sources?.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Sources</div>
            <div className="flex flex-wrap gap-1">
              {company.sources.map((s) => (
                <span key={s} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={toggleSave}
          className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
            saved
              ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300'
              : 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-800 hover:bg-slate-700'
          }`}
        >
          {saved ? '✓ Saved to my list' : '+ Add to my list'}
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [darkMode, setDarkMode] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)

  const headerRef = useRef(null)
  const mainRef = useRef(null)
  const isFirstRender = useRef(true)

  // ── Filtered data ────────────────────────────────────────────────────────
  const filteredByTier = useMemo(() => {
    const q = search.trim().toLowerCase()
    return TIERS.map((tier) => {
      const companies = companiesData.filter((c) => {
        const matchesTier = c.tier === tier.id
        const matchesRegion = regionMatches(c, regionFilter)
        const matchesSearch = !q || c.name.toLowerCase().includes(q)
        return matchesTier && matchesRegion && matchesSearch
      })
      return { tier, companies }
    })
  }, [search, regionFilter])

  const totalCount = useMemo(
    () => filteredByTier.reduce((sum, { companies }) => sum + companies.length, 0),
    [filteredByTier]
  )

  // ── Initial page-load animation ──────────────────────────────────────────
  useEffect(() => {
    // Header slides down
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
    })

    // Batch cards as they scroll into view
    const batchCtx = gsap.context(() => {
      ScrollTrigger.batch('.company-card', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 22, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              stagger: 0.04,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            }
          ),
        once: true,
        start: 'top 92%',
        batchMax: 10,
      })

      // Tier headers slide in from left
      ScrollTrigger.batch('.tier-header', {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.45,
              stagger: 0.06,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            }
          ),
        once: true,
        start: 'top 90%',
      })
    }, mainRef)

    return () => {
      batchCtx.revert()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  // ── Filter / search change animation ─────────────────────────────────────
  useEffect(() => {
    // Skip the very first render (handled by ScrollTrigger above)
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Kill lingering scroll triggers so they don't re-fire on stale elements
    ScrollTrigger.getAll().forEach((t) => t.kill())

    // Let React paint the new DOM, then stagger the visible cards in
    requestAnimationFrame(() => {
      const cards = document.querySelectorAll('.company-card')
      if (!cards.length) return
      gsap.fromTo(
        cards,
        { opacity: 0, y: 14, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.32,
          stagger: { amount: Math.min(cards.length * 0.025, 0.5), from: 'start' },
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      )
    })
  }, [filteredByTier])

  // ── Filter button click with spring press ────────────────────────────────
  function handleFilterClick(e, filterId) {
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.92 },
      { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }
    )
    setRegionFilter(filterId)
  }

  // ── Dark mode toggle with spin ────────────────────────────────────────────
  function handleDarkToggle(e) {
    gsap.fromTo(
      e.currentTarget,
      { rotation: 0 },
      { rotation: 360, duration: 0.45, ease: 'power2.inOut' }
    )
    setDarkMode((d) => !d)
  }

  const regionLabel = REGION_FILTERS.find((r) => r.id === regionFilter)?.label || 'All'
  const selectedTier = selectedCompany ? TIERS.find((t) => t.id === selectedCompany.tier) : null

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">

        {/* ── Sticky header ──────────────────────────────────────────────── */}
        <header
          ref={headerRef}
          className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  SWE Interview Difficulty
                </h1>
                <p className="text-xs text-slate-400">Bay Area + SoCal · 2026 · Mid-level (2–5 YOE)</p>
              </div>
              <button
                onClick={handleDarkToggle}
                className="text-xl p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            {/* Search + region filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🔍</span>
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-shadow"
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                {REGION_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={(e) => handleFilterClick(e, f.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      regionFilter === f.id
                        ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-100 dark:text-slate-800 dark:border-slate-100'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300">{totalCount}</span> companies · {regionLabel}
              {search && <span> · matching &ldquo;{search}&rdquo;</span>}
            </p>
          </div>
        </header>

        {/* ── Tier sections ──────────────────────────────────────────────── */}
        <main ref={mainRef} className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {filteredByTier.map(({ tier, companies }) => {
            if (companies.length === 0) return null
            return (
              <section key={tier.id} className="tier-section">
                <div
                  className={`tier-header flex items-center gap-3 px-4 py-3 rounded-xl border ${tier.headerBg} ${tier.headerBorder} mb-3`}
                >
                  <span className="text-xl">{tier.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm tracking-wide ${tier.headerText}`}>{tier.label}</div>
                    <div className={`text-xs opacity-75 ${tier.headerText} hidden sm:block`}>{tier.desc}</div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tier.badge}`}>
                    {companies.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {companies.map((c) => (
                    <CompanyCard
                      key={c.name}
                      company={c}
                      tier={tier}
                      onClick={setSelectedCompany}
                    />
                  ))}
                </div>
              </section>
            )
          })}

          {totalCount === 0 && (
            <div className="text-center py-24 text-slate-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm">No companies match your filters.</p>
            </div>
          )}
        </main>

        <footer className="text-center text-xs text-slate-400 py-8 px-4">
          Data compiled from Glassdoor, Blind, interviewing.io, HelloInterview, and community Teamblind posts · April 2026
          <br />
          Calibrated for mid-level SWE (2–5 YOE) · Senior-level bars are generally one tier higher
        </footer>

        {/* ── Modal ──────────────────────────────────────────────────────── */}
        {selectedCompany && (
          <Modal
            company={selectedCompany}
            tier={selectedTier}
            onClose={() => setSelectedCompany(null)}
          />
        )}
      </div>
    </div>
  )
}
