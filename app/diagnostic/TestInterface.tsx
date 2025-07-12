'use client';

import { useState, useEffect, useRef } from 'react';
import { questions } from './questionBank';

interface Props {
  userInfo: any;
  onComplete: (results: any) => void;
}

interface AnswerData {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeTaken: number;
  confidence: number;
  changesCount: number;
  isSkipped: boolean;
  isRushed: boolean; // < 10 seconds
  isOverthought: boolean; // > 70 seconds
}

export default function TestInterface({ userInfo, onComplete }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerData>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(50);
  const [timeLeft, setTimeLeft] = useState(90);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [changeCount, setChangeCount] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Reset for new question
    setSelectedAnswer(answers[currentQuestion.id]?.selectedAnswer || null);
    setConfidence(50);
    setTimeLeft(90);
    setQuestionStartTime(Date.now());
    setChangeCount(0);
    setShowComparison(false);

    // Start timer
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(true); // Auto-advance
          return 90;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentQuestionIndex]);

  // Show comparison after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComparison(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer && selectedAnswer !== answer) {
      setChangeCount(changeCount + 1);
    }
    setSelectedAnswer(answer);
  };

  const handleNext = (isAutoAdvance = false) => {
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    
    // Save answer data
    const answerData: AnswerData = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswer,
      isCorrect: selectedAnswer === currentQuestion.correctAnswer,
      timeTaken: Math.min(timeTaken, 90),
      confidence,
      changesCount: changeCount,
      isSkipped: !selectedAnswer,
      isRushed: timeTaken < 10,
      isOverthought: timeTaken > 70
    };

    setAnswers({ ...answers, [currentQuestion.id]: answerData });

    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate results and complete test
      const allAnswers = { ...answers, [currentQuestion.id]: answerData };
      onComplete(calculateResults(allAnswers));
    }
  };

  const calculateResults = (allAnswers: Record<string, AnswerData>) => {
    const answersArray = Object.values(allAnswers);
    
    // Calculate metrics
    const totalCorrect = answersArray.filter(a => a.isCorrect).length;
    const accuracy = (totalCorrect / questions.length) * 100;
    
    // Subject-wise analysis
    const subjectAnalysis = questions.reduce((acc, q) => {
      const answer = allAnswers[q.id];
      if (!acc[q.subject]) {
        acc[q.subject] = { correct: 0, total: 0, totalTime: 0 };
      }
      acc[q.subject].total++;
      acc[q.subject].totalTime += answer?.timeTaken || 0;
      if (answer?.isCorrect) acc[q.subject].correct++;
      return acc;
    }, {} as Record<string, any>);

    // Behavioral insights
    const rushedAnswers = answersArray.filter(a => a.isRushed).length;
    const overthoughtAnswers = answersArray.filter(a => a.isOverthought).length;
    const highConfidenceWrong = answersArray.filter(a => !a.isCorrect && a.confidence > 70).length;
    const averageTime = answersArray.reduce((sum, a) => sum + a.timeTaken, 0) / answersArray.length;

    return {
      accuracy,
      totalCorrect,
      totalQuestions: questions.length,
      subjectAnalysis,
      behavioralInsights: {
        rushedAnswers,
        overthoughtAnswers,
        highConfidenceWrong,
        averageTime,
        totalChanges: answersArray.reduce((sum, a) => sum + a.changesCount, 0)
      },
      detailedAnswers: allAnswers,
      userInfo
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Progress</span>
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#1E3A8A] to-[#059669] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
            
            {/* Timer */}
            <div className={`flex items-center space-x-2 ${timeLeft <= 20 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-medium">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Subject Badge */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {currentQuestion.subject}
              </span>
              <span className="text-sm text-gray-500">
                {currentQuestion.topic}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            
            {showComparison && (
              <span className="text-sm text-gray-500 animate-fade-in">
                Most aspirants answer in {currentQuestion.averageTime}s
              </span>
            )}
          </div>

          {/* Question */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(key)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    selectedAnswer === key
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-[#1E3A8A] shadow-md'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 dark:text-white mr-3">
                      {key}.
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{value}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Confidence Slider */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  How confident are you?
                </label>
                <span className="text-sm font-semibold text-[#1E3A8A]">{confidence}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #1E3A8A 0%, #1E3A8A ${confidence}%, #E5E7EB ${confidence}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Not sure</span>
                <span>Very confident</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleNext(false)}
              disabled={!selectedAnswer}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Skip Question →
            </button>
            
            <button
              onClick={() => handleNext(false)}
              disabled={!selectedAnswer}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                selectedAnswer
                  ? 'bg-[#1E3A8A] text-white hover:bg-[#0F1E4A]'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete Test' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #1E3A8A;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #1E3A8A;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: none;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}