'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How is this different from traditional coaching institutes?',
    answer: 'Unlike traditional coaching with fixed schedules and one-size-fits-all approach, we offer personalized learning paths that adapt to your pace. Our AI identifies your weak areas and creates a custom study plan. Plus, you can learn anytime, anywhere - no need to relocate or commute.',
  },
  {
    question: 'Can working professionals manage this?',
    answer: 'Absolutely! Our platform is designed for busy schedules. With just 2 hours daily commitment and bite-sized 10-minute modules, you can prepare effectively. 68% of our successful candidates were working professionals who studied during commutes, lunch breaks, and evenings.',
  },
  {
    question: 'What if I&apos;m starting from absolute zero?',
    answer: 'Perfect! Our diagnostic test identifies your current level and creates a foundation-first approach. We&apos;ll start with basics and gradually build your expertise. Many toppers started as complete beginners on our platform.',
  },
  {
    question: 'How accurate is the weakness identification?',
    answer: 'Our AI analyzes patterns across millions of responses with 94% accuracy. It tracks not just what you get wrong, but why - whether it&apos;s conceptual gaps, silly mistakes, or time pressure. This precision helps create targeted improvement plans.',
  },
  {
    question: 'Do I still need to buy books and materials?',
    answer: 'No additional materials needed. Our comprehensive content covers the entire UPSC syllabus with summaries of standard books, current affairs integration, and practice questions. Everything is included in your subscription.',
  },
  {
    question: 'What about answer writing practice for Mains?',
    answer: 'We provide structured answer writing modules with daily questions, model answers, and expert evaluation. Our mentors (previous year toppers) personally review and provide feedback on your answers within 48 hours.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about preparing with Community IAS
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                  {faq.question}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              } overflow-hidden`}>
                <div className="px-8 pb-6">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions?
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center text-[#1E3A8A] font-medium hover:underline"
          >
            Talk to our counselors
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}