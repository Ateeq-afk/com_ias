'use client';

import { useState } from 'react';

interface Course {
  id: number;
  title: string;
  description: string;
  modules: number;
  duration: string;
  level: string;
  color: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: 'Ancient & Medieval India',
    description: 'Indus Valley to Mughal Empire. 247 topics covering archaeological evidence to cultural synthesis.',
    modules: 18,
    duration: '12 weeks',
    level: 'Foundation',
    color: 'bg-gradient-to-br from-amber-50 to-orange-50',
  },
  {
    id: 2,
    title: 'Indian Polity & Governance',
    description: 'Constitution, Parliament, Judiciary. 156 topics from constitutional provisions to landmark judgments.',
    modules: 15,
    duration: '10 weeks',
    level: 'Core',
    color: 'bg-gradient-to-br from-blue-50 to-indigo-50',
  },
  {
    id: 3,
    title: 'Indian & World Geography',
    description: 'Physical features to economic geography. 189 topics covering monsoons to mineral distribution.',
    modules: 16,
    duration: '11 weeks',
    level: 'Foundation',
    color: 'bg-gradient-to-br from-green-50 to-emerald-50',
  },
  {
    id: 4,
    title: 'Indian Economy',
    description: 'Economic Survey to policy analysis. 134 topics from planning to contemporary challenges.',
    modules: 14,
    duration: '9 weeks',
    level: 'Advanced',
    color: 'bg-gradient-to-br from-purple-50 to-pink-50',
  },
  {
    id: 5,
    title: 'Ethics, Integrity & Aptitude',
    description: 'Philosophical foundations to case studies. 78 topics covering moral dilemmas to administrative ethics.',
    modules: 12,
    duration: '8 weeks',
    level: 'Core',
    color: 'bg-gradient-to-br from-gray-50 to-slate-50',
  },
  {
    id: 6,
    title: 'Current Affairs 2025',
    description: 'Daily updates linked to static syllabus. 1,247 curated articles with UPSC relevance analysis.',
    modules: 52,
    duration: 'Continuous',
    level: 'Essential',
    color: 'bg-gradient-to-br from-red-50 to-rose-50',
  },
];

export default function LearningPaths() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  return (
    <section id="courses" className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Structured Excellence
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
            Six comprehensive subjects. One integrated approach. 
            Built by India&apos;s finest educators and civil servants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`group relative p-8 rounded-2xl transition-all duration-500 cursor-pointer
                ${selectedCourse === course.id ? 'scale-[1.02] shadow-2xl' : 'hover:shadow-xl'}
                ${course.color} dark:bg-gray-800`}
              onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
            >
              <div className="absolute top-6 right-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                {course.level}
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 mt-8">
                {course.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Modules</span>
                  <span className="font-medium text-gray-900 dark:text-white">{course.modules}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Duration</span>
                  <span className="font-medium text-gray-900 dark:text-white">{course.duration}</span>
                </div>
              </div>

              <div className={`mt-6 overflow-hidden transition-all duration-300 ${
                selectedCourse === course.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <button className="w-full py-3 bg-[#1E3A8A] text-white rounded-xl font-medium hover:bg-[#0F1E4A] transition-colors">
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Not sure where to begin? Take our diagnostic assessment.
          </p>
          <button className="px-8 py-4 border-2 border-[#1E3A8A] text-[#1E3A8A] rounded-full font-medium hover:bg-[#1E3A8A] hover:text-white transition-all duration-200">
            Find Your Starting Point
          </button>
        </div>
      </div>
    </section>
  );
}