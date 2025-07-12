'use client';

import { useState } from 'react';
import Link from 'next/link';
import OnboardingFlow from './OnboardingFlow';
import TestInterface from './TestInterface';
import Results from './Results';

type TestStage = 'landing' | 'onboarding' | 'test' | 'results';

export default function DiagnosticTest() {
  const [stage, setStage] = useState<TestStage>('landing');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);

  const handleStartTest = () => {
    setStage('onboarding');
  };

  const handleOnboardingComplete = (info: any) => {
    setUserInfo(info);
    setStage('test');
  };

  const handleTestComplete = (results: any) => {
    setTestResults(results);
    setStage('results');
  };

  if (stage === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (stage === 'test') {
    return <TestInterface userInfo={userInfo} onComplete={handleTestComplete} />;
  }

  if (stage === 'results') {
    return <Results userInfo={userInfo} results={testResults} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-semibold text-xl text-gray-900 dark:text-white">
              Community IAS
            </Link>
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Landing Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free Diagnostic Test
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Discover Your UPSC Readiness
              <span className="block text-[#1E3A8A] mt-2">in 30 Minutes</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
              Get a personalized study plan based on your current knowledge level. 
              Our AI-powered assessment identifies your strengths and improvement areas across all subjects.
            </p>

            <button
              onClick={handleStartTest}
              className="inline-flex items-center px-10 py-4 bg-[#1E3A8A] text-white text-lg font-medium rounded-full hover:bg-[#0F1E4A] transition-all duration-200 group"
            >
              Start Free Assessment
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Taken by 15,000+ aspirants
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Instant results
              </span>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-lg mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Your Personalized Report Will Include
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Subject-wise Strength Analysis
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Detailed breakdown of your performance in each subject
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Topic-level Improvement Areas
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Specific topics that need your immediate attention
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Recommended Study Sequence
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Optimized learning path based on your current level
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Expected Timeline to Readiness
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Realistic timeline based on your starting point
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Structure Info */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Test Structure
            </h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                20 Questions
              </span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                30 Minutes
              </span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                All Subjects Covered
              </span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                Instant Analysis
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}