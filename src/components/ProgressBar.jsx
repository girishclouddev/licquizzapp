import { motion } from 'framer-motion'

export default function ProgressBar({ current, total, score, streak, points }) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="w-full mb-4">
      {/* Top row: question count + streak + points */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          {current} <span className="text-gray-400 dark:text-gray-500">/ {total}</span>
        </span>

        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30
                         border border-orange-200 dark:border-orange-800
                         rounded-full px-2.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400"
            >
              <span className="fire">🔥</span>
              <span>{streak}</span>
            </motion.div>
          )}
          <div className="flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30
                          border border-violet-200 dark:border-violet-800
                          rounded-full px-2.5 py-1 text-xs font-bold text-violet-700 dark:text-violet-300">
            ⭐ {points}
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            ✅ {score}
          </div>
        </div>
      </div>

      {/* Progress bar track */}
      <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full
                     bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                        animate-[shimmer_2s_infinite]" />
      </div>

      {/* Percentage */}
      <div className="text-right mt-1 text-xs text-gray-400 dark:text-gray-500 font-medium">
        {pct}% complete
      </div>
    </div>
  )
}
