'use client';

export default function Features() {
  const methodologies = [
    {
      number: '01',
      title: 'Adaptive Learning',
      description: 'Our AI-powered engine adapts to your learning pace, identifying knowledge gaps and optimizing your study path. Every aspirant receives a personalized journey.',
    },
    {
      number: '02',
      title: 'Expert Mentorship',
      description: 'Learn from officers who have walked this path. IAS, IPS, and IFS officers share insights, strategies, and real administrative experiences.',
    },
    {
      number: '03',
      title: 'Integrated Approach',
      description: 'Connect dots across subjects. Our curriculum links history with polity, geography with economy, creating a holistic understanding.',
    },
    {
      number: '04',
      title: 'Active Recall',
      description: 'Move beyond passive reading. Interactive exercises, case studies, and simulations ensure deep comprehension and long-term retention.',
    },
    {
      number: '05',
      title: 'Performance Analytics',
      description: 'Track every metric that matters. From reading speed to concept mastery, get actionable insights to optimize your preparation.',
    },
    {
      number: '06',
      title: 'Community Learning',
      description: 'Join study groups, participate in discussions, and learn from peers. Excellence is amplified in community.',
    },
  ];

  return (
    <section id="methodology" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Our Methodology
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            Six principles that define our approach to civil services preparation. 
            Built on research, refined through results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {methodologies.map((method) => (
            <div key={method.number} className="relative">
              <div className="flex items-start space-x-6">
                <span className="text-6xl font-light text-[#059669] leading-none">
                  {method.number}
                </span>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {method.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 bg-[#1E3A8A] rounded-3xl p-12 md:p-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your preparation?
          </h3>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join 78,000+ aspirants who achieved 68% average score improvement. Your journey to civil services begins here.
          </p>
          <button className="px-10 py-4 bg-white text-[#1E3A8A] rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}