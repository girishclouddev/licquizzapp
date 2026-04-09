import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import quizData from '../data/quiz.json'

const TOTAL = quizData.length

const stats = [
  { label: 'પ્રશ્નો', value: TOTAL, icon: '📝' },
  { label: 'વિષય', value: 'LIC', icon: '🏛️' },
  { label: 'ભાષા', value: 'ગુજરાતી', icon: '🇮🇳' },
]

export default function StartScreen({ onStart }) {
  const [bestScore, setBestScore] = useState(null)

  useEffect(() => {
    try {
      const lb = JSON.parse(localStorage.getItem('leaderboard') || '[]')
      if (lb.length > 0) {
        setBestScore(lb[0])
      }
    } catch { /* ignore */ }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg"
    >
      {/* Hero card */}
      <div className="card p-8 text-center">
        {/* Logo / Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="mx-auto mb-6 w-24 h-24 rounded-3xl
                     bg-gradient-to-br from-violet-500 to-indigo-600
                     flex items-center justify-center shadow-2xl shadow-violet-400/40"
        >
          <span className="text-5xl">🎯</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-extrabold gradient-text mb-1 tracking-tight">
            LIC QuizzApp
          </h1>
          <p className="text-sm font-medium text-violet-500 dark:text-violet-400 mb-2 uppercase tracking-widest">
            Gujarati • Insurance Knowledge
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            જ્ઞાન ચકાસો, આત્મવિશ્વાસ વધારો
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {stats.map((s) => (
            <div key={s.label}
              className="bg-violet-50 dark:bg-gray-700/60 rounded-2xl p-3 border border-violet-100 dark:border-gray-600">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-lg font-bold text-gray-800 dark:text-white">{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Best score banner */}
        {bestScore && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20
                       border border-amber-200 dark:border-amber-800 flex items-center gap-3"
          >
            <span className="text-2xl">🏆</span>
            <div className="text-left">
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Best Score</div>
              <div className="font-bold text-amber-800 dark:text-amber-300">
                {bestScore.name} — {bestScore.score} pts ({bestScore.percentage}%)
              </div>
            </div>
          </motion.div>
        )}

        {/* Mode info */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="rounded-2xl p-3 border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20">
            <div className="font-semibold text-violet-700 dark:text-violet-300 mb-1">⏱ Normal Mode</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">60 sec / question</div>
          </div>
          <div className="rounded-2xl p-3 border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
            <div className="font-semibold text-orange-700 dark:text-orange-300 mb-1">⚡ Challenge</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">30 sec + randomized</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => onStart(false)}
            className="btn-primary text-lg py-4"
          >
            🚀 Start Quiz
          </button>
          <button
            onClick={() => onStart(true)}
            className="w-full py-4 rounded-2xl border-2 border-orange-400 text-orange-600
                       dark:text-orange-400 font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20
                       hover:scale-105 active:scale-95 transition-all duration-200"
          >
            ⚡ Challenge Mode
          </button>
        </motion.div>
      </div>

      {/* Footer tip */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4"
      >
        Tip: Consecutive correct answers build a streak and bonus points! 🔥
      </motion.p>
    </motion.div>
  )
}
