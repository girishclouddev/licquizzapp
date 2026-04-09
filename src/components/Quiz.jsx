import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuestionCard from './QuestionCard'
import ProgressBar from './ProgressBar'
import allQuestions from '../data/quiz.json'

const NORMAL_TIMER = 15
const CHALLENGE_TIMER = 10
const QUESTIONS_PER_QUIZ = 20
const BASE_POINTS = 10
const STREAK_BONUS = 5

function shuffleArray(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function prepareQuestions(challengeMode) {
  const pool = challengeMode ? shuffleArray(allQuestions) : allQuestions
  return pool.slice(0, QUESTIONS_PER_QUIZ)
}

// Floating feedback popup
function FeedbackBubble({ correct, points, streak, show }) {
  if (!show) return null
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.4 }}
          className={`fixed top-24 left-1/2 -translate-x-1/2 z-50
                      px-5 py-2.5 rounded-2xl font-bold text-white shadow-xl
                      ${correct
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                        : 'bg-gradient-to-r from-red-500 to-rose-600'}`}
        >
          {correct
            ? `+${points} pts${streak >= 3 ? ` 🔥×${streak}` : ' ✓'}`
            : 'Incorrect ✗'}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Quiz({ challengeMode, onFinish, onQuit }) {
  const [questions] = useState(() => prepareQuestions(challengeMode))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answers, setAnswers] = useState([])   // [{selected, correct, isCorrect}]
  const [feedback, setFeedback] = useState({ show: false, correct: false, pts: 0, streak: 0 })
  const [showQuit, setShowQuit] = useState(false)

  const timeLimit = challengeMode ? CHALLENGE_TIMER : NORMAL_TIMER
  const currentQ = questions[currentIdx]
  const totalQ = questions.length

  const handleAnswer = useCallback((selectedIdx, correctIdx) => {
    const isCorrect = selectedIdx === correctIdx

    // Calculate points
    let earned = 0
    let newStreak = isCorrect ? streak + 1 : 0
    if (isCorrect) {
      earned = BASE_POINTS + (newStreak >= 3 ? STREAK_BONUS * Math.floor(newStreak / 3) : 0)
    }

    setAnswers((prev) => [...prev, {
      question: currentQ,
      selected: selectedIdx,
      correct: correctIdx,
      isCorrect,
    }])

    setStreak(newStreak)
    if (isCorrect) {
      setScore((s) => s + 1)
      setPoints((p) => p + earned)
    }

    setFeedback({ show: true, correct: isCorrect, pts: earned, streak: newStreak })
    setTimeout(() => setFeedback((f) => ({ ...f, show: false })), 1200)

    // Advance
    setTimeout(() => {
      if (currentIdx + 1 >= totalQ) {
        // Finish: compute final result
        const finalAnswers = [...answers, {
          question: currentQ,
          selected: selectedIdx,
          correct: correctIdx,
          isCorrect,
        }]
        const finalScore = isCorrect ? score + 1 : score
        const finalPoints = isCorrect ? points + earned : points
        const pct = Math.round((finalScore / totalQ) * 100)

        onFinish({
          score: finalScore,
          total: totalQ,
          points: finalPoints,
          percentage: pct,
          answers: finalAnswers,
          challengeMode,
        })
      } else {
        setCurrentIdx((i) => i + 1)
      }
    }, 1500)
  }, [currentIdx, totalQ, streak, score, points, answers, currentQ, onFinish, challengeMode])

  return (
    <div className="w-full max-w-2xl relative">
      {/* Feedback bubble */}
      <FeedbackBubble
        correct={feedback.correct}
        points={feedback.pts}
        streak={feedback.streak}
        show={feedback.show}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {challengeMode && (
            <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30
                             text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
              ⚡ Challenge
            </span>
          )}
        </div>
        <button
          onClick={() => setShowQuit(true)}
          className="text-xs text-gray-400 hover:text-red-400 dark:hover:text-red-400
                     transition-colors font-medium px-3 py-1.5 rounded-xl
                     hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          ✕ Quit
        </button>
      </div>

      {/* Progress */}
      <ProgressBar
        current={currentIdx + 1}
        total={totalQ}
        score={score}
        streak={streak}
        points={points}
      />

      {/* Question card */}
      <div className="card p-5 sm:p-6">
        <QuestionCard
          key={currentQ.id}
          question={currentQ}
          questionNumber={currentIdx + 1}
          totalQuestions={totalQ}
          timeLimit={timeLimit}
          onAnswer={handleAnswer}
          challengeMode={challengeMode}
        />
      </div>

      {/* Quit confirmation modal */}
      <AnimatePresence>
        {showQuit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="card p-6 max-w-sm w-full text-center"
            >
              <div className="text-4xl mb-3">🚪</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Quit Quiz?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                Your progress will be lost. Are you sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuit(false)}
                  className="flex-1 py-2.5 rounded-2xl border-2 border-gray-200 dark:border-gray-600
                             text-gray-600 dark:text-gray-300 font-semibold
                             hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Continue
                </button>
                <button
                  onClick={onQuit}
                  className="flex-1 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600
                             text-white font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  Quit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
