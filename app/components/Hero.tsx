'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(1247);

  useEffect(() => {
    setMounted(true);
    // Simulate decreasing seats for UPSC 2025 batch
    const interval = setInterval(() => {
      setCurrentBatch(prev => Math.max(prev - 1, 850));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black" />
      
      <div className="relative max-w-6xl mx-auto">
        <div
          className={`transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
              UPSC 2025 Batch • {currentBatch} seats remaining
            </span>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
              Master UPSC Through
              <span className="block text-[#1E3A8A] mt-2">Active Learning,</span>
              <span className="block text-[#059669] mt-2">Not Passive Reading</span>
            </h1>
            
            <p className="mt-8 text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Join 78,000+ UPSC aspirants who achieved 68% average score improvement through our 
              comprehensive preparation strategy designed by IAS officers
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                142 successful candidates in UPSC 2024
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                4.2M+ UPSC practice questions attempted
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Average rank improvement: 847 positions
              </span>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup" 
                className="inline-flex items-center justify-center px-8 py-4 bg-[#1E3A8A] text-white font-medium rounded-full hover:bg-[#0F1E4A] transition-all duration-200 group"
              >
                Take Free Diagnostic Test
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link 
                href="#demo" 
                className="inline-flex items-center justify-center px-8 py-4 text-[#1E3A8A] font-medium hover:text-[#0F1E4A] transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch 2-min Demo
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">50K+</div>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">73%</div>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Better Retention</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">2hrs</div>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Daily Commitment</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">₹0</div>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">To Start</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}