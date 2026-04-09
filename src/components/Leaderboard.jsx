import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MEDALS = ['🥇', '🥈', '🥉']

function getBadgeForPct(pct) {
  if (pct >= 80) return { label: 'Expert', emoji: '🏆', color: 'text-amber-600 dark:text-amber-400' }
  if (pct >= 50) return { label: 'Intermediate', emoji: '🥈', color: 'text-slate-500 dark:text-slate-400' }
  return { label: 'Beginner', emoji: '🌱', color: 'text-emerald-600 dark:text-emerald-400' }
}

export default function Leaderboard({ onBack }) {
  const [entries, setEntries] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    try {
      const lb = JSON.parse(localStorage.getItem('leaderboard') || '[]')
      setEntries(lb)
    } catch {
      setEntries([])
    }
  }, [])

  const filtered = filter === 'All'
    ? entries
    : entries.filter((e) => e.mode === filter)

  const handleClear = () => {
    if (window.confirm('Clear all leaderboard data?')) {
      localStorage.removeItem('leaderboard')
      setEntries([])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400
                     hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-2xl font-extrabold gradient-text">🏆 Leaderboard</h2>
        {entries.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-400
                       font-medium transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        {['All', 'Normal', 'Challenge'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${filter === f
                ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {f === 'Challenge' ? '⚡ ' : f === 'Normal' ? '⏱ ' : '📋 '}{f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">🎯</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No scores yet!</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Complete a quiz to appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map((entry, idx) => {
              const badge = getBadgeForPct(entry.percentage)
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center gap-3 p-4
                    ${idx === 0 ? 'bg-amber-50/60 dark:bg-amber-900/10' : ''}`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center shrink-0">
                    {idx < 3
                      ? <span className="text-xl">{MEDALS[idx]}</span>
                      : <span className="text-sm font-bold text-gray-400 dark:text-gray-500">#{idx + 1}</span>
                    }
                  </div>

                  {/* Avatar placeholder */}
                  <div className="w-9 h-9 rounded-full shrink-0 bg-gradient-to-br from-violet-500 to-indigo-600
                                  flex items-center justify-center text-white font-bold text-sm">
                    {entry.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                        {entry.name}
                      </span>
                      <span className={`text-xs ${badge.color}`}>{badge.emoji}</span>
                      {entry.mode === 'Challenge' && (
                        <span className="text-xs text-orange-500">⚡</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {entry.score}/{entry.total} correct • {entry.date}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-violet-600 dark:text-violet-400">
                      {entry.points} <span className="text-xs font-normal">pts</span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{entry.percentage}%</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      {filtered.length > 0 && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-3">
          Showing {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </p>
      )}
    </motion.div>
  )
}
