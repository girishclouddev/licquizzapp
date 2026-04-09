import { useState } from 'react'
import { motion } from 'framer-motion'

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const FILTERS = ['All', 'Correct', 'Wrong']

export default function ReviewMode({ answers, onBack }) {
  const [filter, setFilter] = useState('All')

  const filtered = answers.filter((a) => {
    if (filter === 'Correct') return a.isCorrect
    if (filter === 'Wrong') return !a.isCorrect
    return true
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium
                     hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Results
        </button>
        <h2 className="font-bold text-xl text-gray-800 dark:text-white">📋 Review</h2>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${filter === f
                ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {f === 'Correct' ? '✅ ' : f === 'Wrong' ? '❌ ' : '📋 '}{f}
            <span className="ml-1 text-xs opacity-60">
              ({f === 'All' ? answers.length : f === 'Correct' ? answers.filter(a => a.isCorrect).length : answers.filter(a => !a.isCorrect).length})
            </span>
          </button>
        ))}
      </div>

      {/* Question list */}
      <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1 pb-2">
        {filtered.map((answer, i) => (
          <ReviewCard key={i} answer={answer} globalIdx={answers.indexOf(answer) + 1} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <div className="text-4xl mb-2">🎉</div>
            <p>No questions in this category!</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ReviewCard({ answer, globalIdx }) {
  const [expanded, setExpanded] = useState(false)
  const { question, selected, correct, isCorrect } = answer

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card overflow-hidden border-l-4
        ${isCorrect
          ? 'border-l-emerald-500 dark:border-l-emerald-400'
          : 'border-l-red-500 dark:border-l-red-400'}`}
    >
      {/* Question header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white
          ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {globalIdx}
        </span>
        <p className="gujarati-text text-sm text-gray-700 dark:text-gray-200 leading-snug flex-1">
          {question.question}
        </p>
        <span className="shrink-0 text-gray-400 dark:text-gray-500 text-xs mt-0.5">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Expanded options */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3 flex flex-col gap-2">
          {question.options.map((opt, idx) => {
            const isCorrectOpt = idx === correct
            const isUserOpt = idx === selected
            const isWrongSelect = isUserOpt && !isCorrectOpt

            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 p-3 rounded-xl text-sm
                  ${isCorrectOpt
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                    : isWrongSelect
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-700/50 border border-transparent'}`}
              >
                <span className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold
                  ${isCorrectOpt
                    ? 'bg-emerald-500 text-white'
                    : isWrongSelect
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                  {OPTION_LABELS[idx]}
                </span>
                <span className={`gujarati-text leading-snug flex-1
                  ${isCorrectOpt
                    ? 'text-emerald-700 dark:text-emerald-300 font-medium'
                    : isWrongSelect
                    ? 'text-red-700 dark:text-red-300 font-medium line-through opacity-70'
                    : 'text-gray-600 dark:text-gray-400'}`}>
                  {opt}
                </span>
                <span className="shrink-0">
                  {isCorrectOpt ? '✓' : isWrongSelect ? '✗' : ''}
                </span>
              </div>
            )
          })}

          {/* Timeout case */}
          {selected === null && (
            <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">
              ⏰ Time expired — no answer given
            </p>
          )}
        </div>
      )}
    </motion.div>
  )
}
