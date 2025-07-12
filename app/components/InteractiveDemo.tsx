'use client';

import { useState } from 'react';

export default function InteractiveDemo() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [progressValue, setProgressValue] = useState(65);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    if (answer === 'B') {
      setProgressValue(75);
    }
  };

  return (
    <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Experience It Yourself
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See how our interactive learning works. Try this sample question from Indian Polity.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Sample Question */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8">
            <div className="mb-4">
              <span className="text-sm font-medium text-[#059669]">Indian Polity • Constitutional Framework</span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Which Article of the Indian Constitution deals with the &quot;Right to Constitutional Remedies&quot;?
            </h3>

            <div className="space-y-3">
              {[
                { id: 'A', text: 'Article 21' },
                { id: 'B', text: 'Article 32' },
                { id: 'C', text: 'Article 19' },
                { id: 'D', text: 'Article 14' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerClick(option.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    selectedAnswer === option.id
                      ? option.id === 'B'
                        ? 'bg-green-100 dark:bg-green-900/20 border-2 border-green-500'
                        : 'bg-red-100 dark:bg-red-900/20 border-2 border-red-500'
                      : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                  }`}
                  disabled={showFeedback}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {option.id}. {option.text}
                    </span>
                    {showFeedback && selectedAnswer === option.id && (
                      <span className={`text-lg ${option.id === 'B' ? 'text-green-600' : 'text-red-600'}`}>
                        {option.id === 'B' ? '✓' : '×'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showFeedback && (
              <div className={`mt-6 p-4 rounded-xl ${
                selectedAnswer === 'B' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
              }`}>
                {selectedAnswer === 'B' ? (
                  <p>
                    <strong>Excellent!</strong> Article 32 empowers citizens to approach the Supreme Court 
                    for enforcement of Fundamental Rights. Dr. Ambedkar called it the &quot;heart and soul&quot; 
                    of the Constitution.
                  </p>
                ) : (
                  <p>
                    <strong>Not quite.</strong> Article 32 is the correct answer. It provides five types of writs: 
                    Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto. Let&apos;s practice more 
                    questions on Fundamental Rights!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Progress Visualization */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Your Real-Time Progress
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Polity Understanding</span>
                    <span className="font-medium text-gray-900 dark:text-white">{progressValue}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1E3A8A] to-[#059669] transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${progressValue}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Questions Attempted</p>
                    <p className="text-2xl font-bold text-[#1E3A8A]">1,247</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</p>
                    <p className="text-2xl font-bold text-[#059669]">78%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                AI-Identified Weak Areas
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fundamental Rights</span>
                  <span className="text-sm font-medium text-orange-600">Needs Practice</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Parliamentary System</span>
                  <span className="text-sm font-medium text-green-600">Strong</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Constitutional Amendments</span>
                  <span className="text-sm font-medium text-yellow-600">Improving</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setSelectedAnswer(null);
                setShowFeedback(false);
              }}
              className="w-full py-3 px-6 bg-[#1E3A8A] text-white rounded-full font-medium hover:bg-[#0F1E4A] transition-colors duration-200"
            >
              Try Another Question
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}