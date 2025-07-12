'use client';

import { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  rank: string;
  year: string;
  quote: string;
  currentPosition: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ananya Sharma',
    rank: 'AIR 3',
    year: '2023',
    quote: 'Community IAS transformed my preparation. The adaptive learning paths helped me identify and strengthen my weak areas systematically.',
    currentPosition: 'IAS Officer, Maharashtra Cadre',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    rank: 'AIR 12',
    year: '2023',
    quote: 'The mentorship from serving officers provided insights no book could offer. It bridged the gap between theory and administrative reality.',
    currentPosition: 'IPS Officer, AGMUT Cadre',
  },
  {
    id: 3,
    name: 'Priya Patel',
    rank: 'AIR 27',
    year: '2022',
    quote: 'The integrated approach helped me see connections across subjects. Current affairs became meaningful when linked to static portions.',
    currentPosition: 'IFS Officer, Ministry of External Affairs',
  },
];

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section id="testimonials" className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
            From aspirants to administrators. Their journey, their words.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-12 md:p-16">
              <blockquote className="text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {testimonials[activeTestimonial].name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {testimonials[activeTestimonial].rank} • UPSC {testimonials[activeTestimonial].year}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {testimonials[activeTestimonial].currentPosition}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeTestimonial 
                          ? 'w-8 bg-[#1E3A8A]' 
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-5xl font-light text-[#1E3A8A] mb-2">142</div>
            <p className="text-gray-600 dark:text-gray-400">Selections in UPSC 2024</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-light text-[#059669] mb-2">73%</div>
            <p className="text-gray-600 dark:text-gray-400">Prelims Qualification Rate</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-light text-[#F59E0B] mb-2">12</div>
            <p className="text-gray-600 dark:text-gray-400">Top 100 Ranks in 2024</p>
          </div>
        </div>
      </div>
    </section>
  );
}