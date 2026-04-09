import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

// Renders text with \n as <br/> line breaks (safe — data comes from our local JSON)
function TextWithBreaks({ text, className }) {
  const lines = text.split('\n')
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </span>
  )
}

function getOptionClass(idx, selectedIdx, correctIdx, revealed) {
  if (!revealed) {
    return selectedIdx === idx ? 'option-btn border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 shadow-md' : 'option-btn option-default'
  }
  // Revealed
  if (idx === correctIdx - 1) return 'option-btn option-selected-correct'
  if (idx === selectedIdx && selectedIdx !== correctIdx - 1) return 'option-btn option-selected-wrong'
  return 'option-btn border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  timeLimit,
  onAnswer,
  challengeMode,
}) {
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const timerRef = useRef(null)
  const answeredRef = useRef(false)

  // Reset on new question
  useEffect(() => {
    setSelectedIdx(null)
    setRevealed(false)
    setTimeLeft(timeLimit)
    answeredRef.current = false
  }, [question.id, timeLimit])

  // Timer countdown
  useEffect(() => {
    if (revealed) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleReveal(null)   // time out
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [question.id, revealed])

  const handleReveal = (idx) => {
    if (answeredRef.current) return
    answeredRef.current = true
    clearInterval(timerRef.current)
    setSelectedIdx(idx)
    setRevealed(true)

    // Delay before moving to next
    setTimeout(() => {
      onAnswer(idx, question.correct - 1)
    }, 1400)
  }

  const timerPct = (timeLeft / timeLimit) * 100
  const timerColor =
    timerPct > 60 ? 'from-emerald-400 to-green-500' :
    timerPct > 30 ? 'from-amber-400 to-yellow-500' :
    'from-red-500 to-rose-600'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full"
      >
        {/* Timer bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {challengeMode ? '⚡ Challenge' : '⏱ Timer'}
            </span>
            <motion.span
              key={timeLeft}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className={`text-sm font-bold tabular-nums
                ${timeLeft <= 5 ? 'text-red-500 dark:text-red-400' :
                  timeLeft <= 10 ? 'text-amber-500 dark:text-amber-400' :
                  'text-gray-700 dark:text-gray-300'}`}
            >
              {timeLeft}s
            </motion.span>
          </div>
          <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${timerColor}`}
              animate={{ width: `${timerPct}%` }}
              transition={{ duration: 0.9, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-5 p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="shrink-0 mt-0.5 w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/40
                             flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400">
              {questionNumber}
            </span>
            <TextWithBreaks
              text={question.question}
              className="text-gray-800 dark:text-gray-100 font-medium leading-relaxed gujarati-text text-base"
            />
          </div>
        </div>

        {/* Options */}
        <div className="grid gap-3">
          {question.options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileHover={!revealed ? { scale: 1.01 } : {}}
              whileTap={!revealed ? { scale: 0.98 } : {}}
              onClick={() => !revealed && handleReveal(idx)}
              disabled={revealed}
              className={getOptionClass(idx, selectedIdx, question.correct, revealed)}
            >
              <div className="flex items-start gap-3">
                {/* Label badge */}
                <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                  transition-colors duration-200
                  ${revealed && idx === question.correct - 1
                    ? 'bg-white/30 text-white'
                    : revealed && idx === selectedIdx && selectedIdx !== question.correct - 1
                    ? 'bg-white/30 text-white'
                    : 'bg-violet-100 dark:bg-gray-600 text-violet-700 dark:text-gray-200'
                  }`}>
                  {OPTION_LABELS[idx]}
                </span>
                <span className="gujarati-text leading-snug text-left">{opt}</span>

                {/* Result icon */}
                {revealed && (
                  <span className="ml-auto shrink-0 text-lg">
                    {idx === question.correct - 1 ? '✓' :
                     idx === selectedIdx ? '✗' : ''}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Timeout message */}
        {revealed && selectedIdx === null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm font-semibold text-red-500 dark:text-red-400"
          >
            ⏰ Time's up!
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
