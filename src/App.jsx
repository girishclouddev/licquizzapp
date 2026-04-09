import { useState, useEffect } from 'react'
import Quiz from './components/Quiz'
import StartScreen from './components/StartScreen'
import Result from './components/Result'
import Leaderboard from './components/Leaderboard'

// Screens: 'start' | 'quiz' | 'result' | 'leaderboard'
export default function App() {
  const [screen, setScreen] = useState('start')
  const [quizResult, setQuizResult] = useState(null)
  const [challengeMode, setChallengeMode] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const handleStart = (isChallenge = false) => {
    setChallengeMode(isChallenge)
    setScreen('quiz')
  }

  const handleFinish = (result) => {
    setQuizResult(result)
    setScreen('result')
  }

  const handlePlayAgain = () => {
    setQuizResult(null)
    setScreen('start')
  }

  const handleChallenge = () => {
    setQuizResult(null)
    handleStart(true)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300
      bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50
      dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950`}>

      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur
                     shadow-lg border border-gray-200 dark:border-gray-700
                     hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Leaderboard button */}
      {screen !== 'leaderboard' && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setScreen('leaderboard')}
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur
                       shadow-lg border border-gray-200 dark:border-gray-700
                       hover:scale-110 active:scale-95 transition-all duration-200"
            title="Leaderboard"
          >
            <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        {screen === 'start' && (
          <StartScreen onStart={handleStart} />
        )}
        {screen === 'quiz' && (
          <Quiz
            challengeMode={challengeMode}
            onFinish={handleFinish}
            onQuit={() => setScreen('start')}
          />
        )}
        {screen === 'result' && quizResult && (
          <Result
            result={quizResult}
            challengeMode={challengeMode}
            onPlayAgain={handlePlayAgain}
            onChallenge={handleChallenge}
          />
        )}
        {screen === 'leaderboard' && (
          <Leaderboard onBack={() => setScreen('start')} />
        )}
      </div>
    </div>
  )
}
