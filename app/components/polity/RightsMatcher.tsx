'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, RefreshCw, Lightbulb, Trophy, Sparkles, ArrowRight, Link2 } from 'lucide-react'

interface MatchItem {
  id: string
  content: string
  pairId: string
}

interface MatchPair {
  left: MatchItem
  right: MatchItem
}

const matchingPairs: MatchPair[] = [
  {
    left: { id: 'l1', content: 'Right to Equality', pairId: 'p1' },
    right: { id: 'r1', content: 'Articles 14-18', pairId: 'p1' }
  },
  {
    left: { id: 'l2', content: 'Right to Freedom', pairId: 'p2' },
    right: { id: 'r2', content: 'Articles 19-22', pairId: 'p2' }
  },
  {
    left: { id: 'l3', content: 'Right Against Exploitation', pairId: 'p3' },
    right: { id: 'r3', content: 'Articles 23-24', pairId: 'p3' }
  },
  {
    left: { id: 'l4', content: 'Right to Freedom of Religion', pairId: 'p4' },
    right: { id: 'r4', content: 'Articles 25-28', pairId: 'p4' }
  },
  {
    left: { id: 'l5', content: 'Cultural and Educational Rights', pairId: 'p5' },
    right: { id: 'r5', content: 'Articles 29-30', pairId: 'p5' }
  },
  {
    left: { id: 'l6', content: 'Right to Constitutional Remedies', pairId: 'p6' },
    right: { id: 'r6', content: 'Article 32', pairId: 'p6' }
  }
]

interface RightsMatcherProps {
  onComplete: (stats: { attempts: number; hintsUsed: number; timeSpent: number }) => void
}

export default function RightsMatcher({ onComplete }: RightsMatcherProps) {
  // Shuffle the right items for the game
  const [leftItems] = useState(() => matchingPairs.map(pair => pair.left))
  const [rightItems, setRightItems] = useState(() => {
    const items = matchingPairs.map(pair => pair.right)
    return items.sort(() => Math.random() - 0.5)
  })

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matches, setMatches] = useState<Set<string>>(new Set())
  const [incorrectAttempts, setIncorrectAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [hintPair, setHintPair] = useState<string | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [startTime] = useState(Date.now())
  const [attempts, setAttempts] = useState(0)
  const [showResult, setShowResult] = useState<{ correct: boolean; leftId: string; rightId: string } | null>(null)

  // Check for match when both items are selected
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const leftItem = leftItems.find(item => item.id === selectedLeft)
      const rightItem = rightItems.find(item => item.id === selectedRight)
      
      if (leftItem && rightItem) {
        setAttempts(prev => prev + 1)
        const isMatch = leftItem.pairId === rightItem.pairId
        
        setShowResult({ correct: isMatch, leftId: selectedLeft, rightId: selectedRight })
        
        setTimeout(() => {
          if (isMatch) {
            setMatches(prev => new Set(prev).add(leftItem.pairId))
          } else {
            setIncorrectAttempts(prev => prev + 1)
          }
          
          setSelectedLeft(null)
          setSelectedRight(null)
          setShowResult(null)
        }, 1000)
      }
    }
  }, [selectedLeft, selectedRight, leftItems, rightItems])

  // Check for completion
  useEffect(() => {
    if (matches.size === matchingPairs.length) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      setTimeout(() => {
        onComplete({ attempts, hintsUsed, timeSpent })
      }, 1500)
    }
  }, [matches, attempts, hintsUsed, startTime, onComplete])

  const handleHint = () => {
    if (hintsUsed >= 3) return
    
    // Find an unmatched pair
    const unmatchedPair = matchingPairs.find(pair => !matches.has(pair.pairId))
    if (unmatchedPair) {
      setHintPair(unmatchedPair.left.pairId)
      setShowHint(true)
      setHintsUsed(prev => prev + 1)
      
      setTimeout(() => {
        setShowHint(false)
        setHintPair(null)
      }, 3000)
    }
  }

  const resetGame = () => {
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatches(new Set())
    setIncorrectAttempts(0)
    setShowHint(false)
    setHintPair(null)
    setHintsUsed(0)
    setAttempts(0)
    setRightItems(prev => [...prev].sort(() => Math.random() - 0.5))
  }

  // Remove getItemStyle function as we're handling styles inline now

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 p-10 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Link2 className="w-8 h-8 text-blue-600" />
            Rights Matcher
          </h2>
          <p className="text-gray-600 text-lg">Connect each right with its constitutional articles</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 bg-blue-50/50 backdrop-blur-sm rounded-2xl border border-blue-100">
            <span className="text-sm font-semibold text-blue-700">
              {matches.size} of {matchingPairs.length} matched
            </span>
          </div>
          {incorrectAttempts >= 3 && hintsUsed < 3 && (
            <motion.button
              onClick={handleHint}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 rounded-2xl hover:from-yellow-200 hover:to-amber-200 transition-all font-semibold shadow-lg shadow-yellow-100/50 border border-yellow-200"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm">Hint ({3 - hintsUsed} left)</span>
            </motion.button>
          )}
          <motion.button
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100/80 backdrop-blur-sm text-gray-700 rounded-2xl hover:bg-gray-200/80 transition-all font-semibold border border-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </motion.button>
        </div>
      </div>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl flex items-start gap-4"
        >
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Hint Active</p>
            <p className="text-sm text-gray-700">
              Look for the glowing items - they belong together!
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column - Rights */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Fundamental Rights
          </h3>
          <div className="space-y-4">
            {leftItems.map((item, index) => {
              const isMatched = matches.has(item.pairId)
              const isSelected = selectedLeft === item.id
              const isHinted = showHint && hintPair === item.pairId
              const isInResult = showResult && showResult.leftId === item.id
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => !isMatched && setSelectedLeft(item.id)}
                  disabled={isMatched}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full p-5 rounded-2xl border transition-all text-left relative overflow-hidden ${
                    isMatched
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 cursor-not-allowed'
                      : isInResult
                      ? showResult.correct
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 animate-pulse'
                        : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-400'
                      : isHinted
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400 animate-pulse shadow-lg shadow-yellow-200/50'
                      : isSelected
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 shadow-lg shadow-blue-200/50'
                      : 'bg-white/80 backdrop-blur-sm border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-gray-200/50'
                  }`}
                  whileHover={!isMatched ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isMatched ? { scale: 0.98 } : {}}
                  animate={isInResult && !showResult.correct ? { x: [-5, 5, -5, 5, 0] } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{item.content}</span>
                    {isMatched && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Right Column - Articles */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            Article Numbers
          </h3>
          <div className="space-y-4">
            {rightItems.map((item, index) => {
              const isMatched = matches.has(item.pairId)
              const isSelected = selectedRight === item.id
              const isHinted = showHint && hintPair === item.pairId
              const isInResult = showResult && showResult.rightId === item.id
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => !isMatched && setSelectedRight(item.id)}
                  disabled={isMatched}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full p-5 rounded-2xl border transition-all text-left relative overflow-hidden ${
                    isMatched
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 cursor-not-allowed'
                      : isInResult
                      ? showResult.correct
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 animate-pulse'
                        : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-400'
                      : isHinted
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400 animate-pulse shadow-lg shadow-yellow-200/50'
                      : isSelected
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 shadow-lg shadow-blue-200/50'
                      : 'bg-white/80 backdrop-blur-sm border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-gray-200/50'
                  }`}
                  whileHover={!isMatched ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isMatched ? { scale: 0.98 } : {}}
                  animate={isInResult && !showResult.correct ? { x: [-5, 5, -5, 5, 0] } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{item.content}</span>
                    {isMatched && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Completion Animation */}
      <AnimatePresence>
        {matches.size === matchingPairs.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl text-center max-w-md border border-gray-100"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Perfect Match! 🎆
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  You've mastered the constitutional articles!
                </p>
              </motion.div>
              <motion.div 
                className="flex justify-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-blue-50 rounded-2xl px-6 py-4">
                  <p className="text-2xl font-bold text-blue-600">{attempts}</p>
                  <p className="text-sm text-gray-600 font-medium">Attempts</p>
                </div>
                <div className="bg-purple-50 rounded-2xl px-6 py-4">
                  <p className="text-2xl font-bold text-purple-600">{hintsUsed}</p>
                  <p className="text-sm text-gray-600 font-medium">Hints Used</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex items-center justify-center gap-2 text-green-600"
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold">+50 XP Earned</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}