'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ValueProposition() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const comparisons = [
    {
      traditional: '500-page PDFs',
      modern: '10-minute interactive modules',
      impact: '3x better retention',
    },
    {
      traditional: 'Passive video lectures',
      modern: 'Practice-while-you-learn exercises',
      impact: '5x more engagement',
    },
    {
      traditional: 'Guessing your weak areas',
      modern: 'AI-identified improvement zones',
      impact: '73% faster progress',
    },
    {
      traditional: 'Isolated preparation',
      modern: 'Peer learning with study groups',
      impact: '2x motivation boost',
    },
    {
      traditional: 'Fixed study schedules',
      modern: 'Adaptive learning paths',
      impact: 'Fits your lifestyle',
    },
    {
      traditional: 'Overwhelming content',
      modern: 'Curated, relevant material',
      impact: 'Save 4hrs daily',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Why We&apos;re Different
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Traditional methods haven&apos;t changed in decades. 
            We&apos;ve reimagined UPSC preparation for the digital age.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6">
            {comparisons.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl cursor-pointer"
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-400 text-xl font-bold">×</span>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Traditional</p>
                      <p className="text-gray-900 dark:text-white font-medium">{item.traditional}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-xl font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Our Method</p>
                      <p className="text-gray-900 dark:text-white font-medium">{item.modern}</p>
                    </div>
                  </div>

                  <div className={`text-right transition-all duration-300 ${
                    hoveredItem === index ? 'opacity-100 transform translate-x-0' : 'opacity-70 transform -translate-x-2'
                  }`}>
                    <p className="text-2xl font-bold text-[#059669]">{item.impact}</p>
                  </div>
                </div>

                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-green-50 dark:to-green-900/10 rounded-2xl transition-opacity duration-300 pointer-events-none ${
                  hoveredItem === index ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Ready to experience the difference?
            </p>
            <Link href="/demo" className="inline-flex items-center px-8 py-4 bg-[#1E3A8A] text-white rounded-full font-medium hover:bg-[#0F1E4A] transition-colors duration-200">
              Try Interactive Demo
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

