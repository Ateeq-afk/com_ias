'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Trophy, Target, Clock, Brain, ArrowRight, Download, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function TestResultsPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  
  const score = searchParams.get('score') || '0'
  const correct = searchParams.get('correct') || '0'
  const wrong = searchParams.get('wrong') || '0'
  const unattempted = searchParams.get('unattempted') || '0'

  const totalQuestions = parseInt(correct) + parseInt(wrong) + parseInt(unattempted)
  const accuracy = totalQuestions > 0 ? (parseInt(correct) / (parseInt(correct) + parseInt(wrong)) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h1>
          <p className="text-gray-600">Here's your performance summary</p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 p-8 mb-8 border border-gray-100"
        >
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">Your Score</p>
            <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {score}
            </p>
            <p className="text-gray-600 mt-2">out of {totalQuestions * 2} marks</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{correct}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Brain className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{wrong}</p>
              <p className="text-sm text-gray-600">Wrong</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{unattempted}</p>
              <p className="text-sm text-gray-600">Skipped</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{accuracy}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href={`/dashboard/tests/${params.id}/solutions`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-blue-200/50 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            View Solutions
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download Report
          </button>

          <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
        </motion.div>

        {/* Back to Tests */}
        <div className="text-center mt-8">
          <Link href="/dashboard/tests" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Tests
          </Link>
        </div>
      </div>
    </div>
  )
}