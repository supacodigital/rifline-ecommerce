import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Users, Package, BarChart2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import api from '../../api/axios'
import s from './Reports.module.css'

// Couleurs du thème
const GOLD   = '#c9a96e'
const MUTED  = '#3a3835'
const TEXT   = '#8a8480'

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className={s.statCard}>
      <div className={s.statTop}>
        <p className={s.statLabel}>{label}</p>
        <Icon size={18} strokeWidth={1.5} className={s.statIcon} />
      </div>
      <p className={s.statValue}>{value}</p>
      {sub && <p className={s.statSub}>{sub}</p>}
    </div>
  )
}

// Tooltip personnalisé pour les graphiques
function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  return (
    <div className={s.tooltip}>
      <p className={s.tooltipLabel}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className={s.tooltipValue} style={{ color: entry.color }}>
          {entry.name} : {currency ? `${Number(entry.value).toFixed(2)} €` : entry.value}
        </p>
      ))}
    </div>
  )
}

const STATUS_LABELS = {
  pending:    'En attente',
  paid:       'Payée',
  processing: 'En prépa.',
  shipped:    'Expédiée',
  delivered:  'Livrée',
  cancelled:  'Annulée',
  refunded:   'Remboursée',
}

const STATUS_COLORS = {
  pending:    '#c9a96e',
  paid:       '#6db87a',
  processing: '#6db87a',
  shipped:    '#5ba3cc',
  delivered:  '#6db87a',
  cancelled:  '#e05c5c',
  refunded:   '#e05c5c',
}

const PERIOD_OPTIONS = [
  { label: '30 jours',  days: 30  },
  { label: '90 jours',  days: 90  },
  { label: '12 mois',   days: 365 },
]

export default function AdminReports() {
  const [dashboard, setDashboard]   = useState(null)
  const [dailyData, setDailyData]   = useState([])
  const [period,    setPeriod]      = useState(30)
  const [loading,   setLoading]     = useState(true)
  const [loadingChart, setLoadingChart] = useState(false)

  // Chargement du dashboard (stats + top produits + statuts)
  useEffect(() => {
    api.get('/reports/dashboard')
      .then(res => setDashboard(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Chargement du graphique CA par jour
  useEffect(() => {
    setLoadingChart(true)
    api.get(`/reports/revenue/day?days=${period}`)
      .then(res => {
        const rows = res.data || []
        // Formater les dates pour l'affichage
        setDailyData(rows.map(r => ({
          ...r,
          day: new Date(r.day).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
          revenue_eur: Number(r.revenue_eur || 0),
          order_count: Number(r.order_count || 0),
        })))
      })
      .catch(() => {})
      .finally(() => setLoadingChart(false))
  }, [period])

  const s2 = dashboard?.stats

  // CA mensuel depuis le dashboard
  const monthlyData = (dashboard?.revenueByMonth || []).map(r => ({
    month: r.month,
    revenue_eur: Number(r.revenue_eur || 0),
    order_count: Number(r.order_count || 0),
  }))

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <p className={s.eyebrow}>Analyse</p>
          <h1 className={s.title}>Rapports</h1>
        </div>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className={s.statsGrid}>
        <StatCard
          icon={TrendingUp}
          label="Chiffre d'affaires"
          value={loading ? '—' : `${Number(s2?.total_revenue_eur || 0).toFixed(2)} €`}
          sub="Commandes non annulées"
        />
        <StatCard
          icon={ShoppingBag}
          label="Commandes"
          value={loading ? '—' : (s2?.total_orders || 0)}
          sub="Total cumulé"
        />
        <StatCard
          icon={Users}
          label="Clients"
          value={loading ? '—' : (s2?.total_customers || 0)}
          sub="Comptes actifs"
        />
        <StatCard
          icon={Package}
          label="Panier moyen"
          value={loading ? '—' : `${Number(s2?.avg_order_eur || 0).toFixed(2)} €`}
          sub="Par commande"
        />
      </div>

      {/* ===== GRAPHIQUE CA JOURNALIER ===== */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h2 className={s.cardTitle}>Chiffre d'affaires</h2>
          <div className={s.periodBtns}>
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt.days}
                className={`${s.periodBtn} ${period === opt.days ? s.periodActive : ''}`}
                onClick={() => setPeriod(opt.days)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loadingChart ? (
          <div className={s.chartPlaceholder}>
            <div className={s.spinner} />
          </div>
        ) : dailyData.length === 0 ? (
          <div className={s.chartPlaceholder}>
            <BarChart2 size={32} strokeWidth={1} style={{ color: 'rgba(201,169,110,0.2)', margin: '0 auto var(--space-3)' }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Aucune donnée sur cette période</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GOLD} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={MUTED} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: TEXT, fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: TEXT, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v} €`} width={60} />
              <Tooltip content={<CustomTooltip currency />} />
              <Area
                type="monotone"
                dataKey="revenue_eur"
                name="CA"
                stroke={GOLD}
                strokeWidth={1.5}
                fill="url(#goldGrad)"
                dot={false}
                activeDot={{ r: 4, fill: GOLD, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ===== CA MENSUEL + COMMANDES ===== */}
      {monthlyData.length > 0 && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>CA mensuel (12 mois)</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={MUTED} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: TEXT, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v} €`} width={60} />
              <Tooltip content={<CustomTooltip currency />} />
              <Bar dataKey="revenue_eur" name="CA" fill={GOLD} radius={[2, 2, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ===== TOP PRODUITS + STATUTS ===== */}
      <div className={s.row2}>
        {/* Top produits */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Top produits</h2>
          </div>
          {loading ? (
            <p className={s.empty}>Chargement…</p>
          ) : (dashboard?.topProducts || []).length === 0 ? (
            <p className={s.empty}>Aucune donnée</p>
          ) : (
            <div className={s.topList}>
              {(dashboard.topProducts).map((p, i) => {
                const max = dashboard.topProducts[0].total_qty
                const pct = Math.round((p.total_qty / max) * 100)
                return (
                  <div key={p.product_id} className={s.topItem}>
                    <div className={s.topItemHeader}>
                      <div className={s.topItemLeft}>
                        <span className={s.topRank}>#{i + 1}</span>
                        <span className={s.topName}>{p.product_name}</span>
                      </div>
                      <div className={s.topItemRight}>
                        <span className={s.topQty}>{p.total_qty} ventes</span>
                        <span className={s.topRevenue}>{Number(p.total_revenue_eur || 0).toFixed(2)} €</span>
                      </div>
                    </div>
                    <div className={s.topBar}>
                      <div className={s.topBarFill} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Statuts commandes */}
        <div className={s.card}>
          <div className={s.cardHeader}>
            <h2 className={s.cardTitle}>Répartition par statut</h2>
          </div>
          {loading ? (
            <p className={s.empty}>Chargement…</p>
          ) : (
            <div className={s.statusList}>
              {(dashboard?.ordersByStatus || []).map(row => {
                const total = (dashboard?.ordersByStatus || []).reduce((acc, r) => acc + Number(r.count), 0)
                const pct   = total > 0 ? Math.round((Number(row.count) / total) * 100) : 0
                const color = STATUS_COLORS[row.status] || TEXT
                return (
                  <div key={row.status} className={s.statusItem}>
                    <div className={s.statusRow}>
                      <span className={s.statusDot} style={{ background: color }} />
                      <span className={s.statusLabel}>{STATUS_LABELS[row.status] || row.status}</span>
                      <span className={s.statusCount}>{row.count}</span>
                      <span className={s.statusPct}>{pct}%</span>
                    </div>
                    <div className={s.statusBar}>
                      <div className={s.statusBarFill} style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
