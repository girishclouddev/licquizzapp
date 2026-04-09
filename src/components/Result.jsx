import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReviewMode from './ReviewMode'

function getBadge(pct) {
  if (pct >= 80) return { label: 'Expert', emoji: '🏆', color: 'from-amber-400 to-yellow-500', text: 'text-amber-800 dark:text-amber-200', bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-300 dark:border-amber-700' }
  if (pct >= 50) return { label: 'Intermediate', emoji: '🥈', color: 'from-slate-400 to-gray-500', text: 'text-slate-700 dark:text-slate-200', bg: 'bg-slate-50 dark:bg-slate-800/50', border: 'border-slate-300 dark:border-slate-600' }
  return { label: 'Beginner', emoji: '🌱', color: 'from-emerald-400 to-green-500', text: 'text-emerald-800 dark:text-emerald-200', bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-300 dark:border-emerald-700' }
}

function getMotivation(pct) {
  if (pct === 100) return '🎉 Perfect Score! Extraordinary!'
  if (pct >= 80) return "🌟 Excellent! You're an LIC Expert!"
  if (pct >= 60) return '👍 Good job! Keep learning!'
  if (pct >= 40) return "📚 Keep studying, you'll get there!"
  return "💪 Don't give up! Try again!"
}

function saveToLeaderboard({ score, total, points, percentage, challengeMode }) {
  try {
    const lb = JSON.parse(localStorage.getItem('leaderboard') || '[]')
    const entry = {
      id: Date.now(),
      name: 'Player',
      score,
      total,
      points,
      percentage,
      mode: challengeMode ? 'Challenge' : 'Normal',
      date: new Date().toLocaleDateString('gu-IN'),
    }
    lb.unshift(entry)
    const sorted = lb.sort((a, b) => b.points - a.points).slice(0, 50)
    localStorage.setItem('leaderboard', JSON.stringify(sorted))
  } catch { /* ignore */ }
}

function StatCard({ icon, label, value, colorClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 border ${colorClass} text-center`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs font-medium opacity-70 mt-0.5">{label}</div>
    </motion.div>
  )
}

// Circular progress ring
function ScoreRing({ pct }) {
  const radius = 54
  const circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ

  return (
    <div className="relative w-40 h-40 mx-auto mb-4">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor"
          className="text-gray-200 dark:text-gray-700" strokeWidth="10" />
        <motion.circle
          cx="64" cy="64" r={radius} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold gradient-text">{pct}%</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">Score</span>
      </div>
    </div>
  )
}

export default function Result({ result, challengeMode, onPlayAgain, onChallenge }) {
  const { score, total, points, percentage, answers } = result
  const wrong = total - score
  const badge = getBadge(percentage)
  const motivation = getMotivation(percentage)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    saveToLeaderboard(result)
  }, [])

  if (showReview) {
    return <ReviewMode answers={answers} onBack={() => setShowReview(false)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg"
    >
      <div className="card p-6 sm:p-8">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`mx-auto mb-4 px-6 py-3 rounded-2xl border-2 ${badge.bg} ${badge.border} ${badge.text}
                      flex items-center gap-2 w-fit`}
        >
          <span className="text-2xl">{badge.emoji}</span>
          <span className="font-bold text-lg">{badge.label}</span>
        </motion.div>

        {/* Score ring */}
        <ScoreRing pct={percentage} />

        {/* Motivation */}
        <p className="text-center text-gray-600 dark:text-gray-300 font-medium mb-5 text-base">
          {motivation}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard
            icon="✅"
            label="Correct"
            value={score}
            colorClass="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
          />
          <StatCard
            icon="❌"
            label="Wrong"
            value={wrong}
            colorClass="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
          />
          <StatCard
            icon="⭐"
            label="Points"
            value={points}
            colorClass="bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300"
          />
        </div>

        {/* Mode tag */}
        {challengeMode && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                             bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800
                             text-orange-600 dark:text-orange-400 text-xs font-semibold">
              ⚡ Challenge Mode
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button onClick={onPlayAgain} className="btn-primary py-3.5 text-base">
            🔄 Play Again
          </button>
          <button
            onClick={onChallenge}
            className="w-full py-3.5 rounded-2xl border-2 border-orange-400 text-orange-600
                       dark:text-orange-400 font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20
                       hover:scale-105 active:scale-95 transition-all duration-200"
          >
            ⚡ Challenge Mode
          </button>
          <button
            onClick={() => setShowReview(true)}
            className="w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-600
                       text-gray-600 dark:text-gray-300 font-semibold
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            📋 Review Answers
          </button>
        </div>
      </div>
    </motion.div>
  )
}
