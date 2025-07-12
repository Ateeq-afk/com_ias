'use client';

import { useState } from 'react';

interface UserInfo {
  name: string;
  email: string;
  phone?: string;
  experience: 'beginner' | '6months' | '1year' | '2plus';
  targetYear: '2025' | '2026';
  studyHours: 'less2' | '2to4' | '4to6' | '6plus';
}

interface Props {
  onComplete: (info: UserInfo) => void;
}

export default function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: '',
    experience: 'beginner',
    targetYear: '2025',
    studyHours: '2to4'
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(userInfo);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return userInfo.name.trim() !== '' && userInfo.email.trim() !== '';
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Step {step} of 3</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Your Background'}
              {step === 3 && 'What to Expect'}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#1E3A8A] to-[#059669] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Let&apos;s get to know you
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We&apos;ll use this to personalize your diagnostic report
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">We&apos;ll send your detailed report here</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                  <p className="mt-1 text-xs text-gray-500">For WhatsApp study tips and reminders</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Background */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Tell us about your preparation
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This helps us calibrate your personalized study plan
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    How long have you been preparing for UPSC?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'beginner', label: 'Just starting' },
                      { value: '6months', label: '< 6 months' },
                      { value: '1year', label: '6-12 months' },
                      { value: '2plus', label: '1+ years' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setUserInfo({ ...userInfo, experience: option.value as any })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          userInfo.experience === option.value
                            ? 'border-[#1E3A8A] bg-blue-50 dark:bg-blue-900/20 text-[#1E3A8A] dark:text-blue-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Which year are you targeting?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: '2025', label: 'UPSC 2025' },
                      { value: '2026', label: 'UPSC 2026' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setUserInfo({ ...userInfo, targetYear: option.value as any })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          userInfo.targetYear === option.value
                            ? 'border-[#1E3A8A] bg-blue-50 dark:bg-blue-900/20 text-[#1E3A8A] dark:text-blue-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    How many hours can you dedicate daily?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'less2', label: '< 2 hours' },
                      { value: '2to4', label: '2-4 hours' },
                      { value: '4to6', label: '4-6 hours' },
                      { value: '6plus', label: '6+ hours' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setUserInfo({ ...userInfo, studyHours: option.value as any })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          userInfo.studyHours === option.value
                            ? 'border-[#1E3A8A] bg-blue-50 dark:bg-blue-900/20 text-[#1E3A8A] dark:text-blue-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Expectations */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  You&apos;re all set!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Here&apos;s what your personalized report will include
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 space-y-4">
                {[
                  {
                    title: 'Subject-wise Strength Analysis',
                    description: 'Detailed breakdown of your performance in each subject'
                  },
                  {
                    title: 'Topic-level Improvement Areas',
                    description: 'Specific topics that need your immediate attention'
                  },
                  {
                    title: 'Recommended Study Sequence',
                    description: 'Optimized learning path based on your current level'
                  },
                  {
                    title: 'Expected Timeline to Readiness',
                    description: 'Realistic timeline based on your starting point and availability'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#059669] bg-opacity-20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-[#059669] text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                  <strong>Test Duration:</strong> 30 minutes • 20 questions • All subjects covered
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`ml-auto px-8 py-3 rounded-full font-medium transition-all ${
                isStepValid()
                  ? 'bg-[#1E3A8A] text-white hover:bg-[#0F1E4A]'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Start Test' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}