'use client';

export default function PainPoints() {
  const struggles = [
    {
      pain: 'Time Management',
      solution: 'Study effectively with just 2 hours daily',
      detail: 'Our bite-sized modules fit into your schedule. Morning commute? Lunch break? We&apos;ve got you covered.',
      stat: '87% users maintain daily streaks',
    },
    {
      pain: 'Information Overload',
      solution: 'Curated content, not endless PDFs',
      detail: 'Every lesson is crafted by AIR holders. We teach what matters, skip what doesn&apos;t.',
      stat: '4 hours saved daily',
    },
    {
      pain: 'Staying Motivated',
      solution: 'Daily streaks and peer competition',
      detail: 'Gamified learning with study buddies keeps you accountable and engaged throughout your journey.',
      stat: '73 days average streak',
    },
    {
      pain: 'Doubt Resolution',
      solution: 'Get answers within 2 hours',
      detail: 'Direct access to mentors who&apos;ve been where you are. No question too small or complex.',
      stat: '15 min avg response time',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            We Understand Your Struggles
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Every UPSC aspirant faces these challenges. We&apos;ve built solutions that actually work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {struggles.map((item, index) => (
            <div 
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.pain}
                </h3>
                <p className="text-xl text-[#059669] font-medium">
                  {item.solution}
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {item.detail}
              </p>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[#1E3A8A]">{item.stat}</span>
                  <svg 
                    className="w-12 h-12 text-gray-200 dark:text-gray-700 group-hover:text-[#059669] transition-colors duration-300" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#1E3A8A] rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Stop struggling. Start succeeding.
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join aspirants who&apos;ve transformed their preparation with our methodology.
          </p>
          <button className="px-8 py-4 bg-white text-[#1E3A8A] rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
            Start Your Free Trial Today
          </button>
        </div>
      </div>
    </section>
  );
}