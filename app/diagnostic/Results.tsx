'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  userInfo: any;
  results: any;
}

export default function Results({ userInfo, results }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [revealedSections, setRevealedSections] = useState<number[]>([]);

  useEffect(() => {
    // Dramatic reveal effect
    const timer = setTimeout(() => {
      setRevealedSections([1]);
      setTimeout(() => setRevealedSections([1, 2]), 500);
      setTimeout(() => setRevealedSections([1, 2, 3]), 1000);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Calculate derived metrics
  const overallScore = results.accuracy;
  const readinessMonths = calculateReadinessMonths(results, userInfo);
  const strengths = getTopStrengths(results.subjectAnalysis);
  const weaknesses = getCriticalGaps(results.subjectAnalysis);

  function calculateReadinessMonths(results: any, userInfo: any) {
    const baseHours = (100 - results.accuracy) * 10;
    const subjectMultiplier = Object.values(results.subjectAnalysis).filter((s: any) => 
      (s.correct / s.total) < 0.4
    ).length * 1.2 || 1;
    
    const experienceReducer = userInfo.experience === 'beginner' ? 1 : 
                             userInfo.experience === '6months' ? 0.9 :
                             userInfo.experience === '1year' ? 0.8 : 0.7;
    
    const totalHours = baseHours * subjectMultiplier * experienceReducer;
    const hoursPerDay = userInfo.studyHours === 'less2' ? 1.5 :
                       userInfo.studyHours === '2to4' ? 3 :
                       userInfo.studyHours === '4to6' ? 5 : 7;
    
    return Math.ceil(totalHours / (hoursPerDay * 30));
  }

  function getTopStrengths(subjectAnalysis: any) {
    return Object.entries(subjectAnalysis)
      .map(([subject, data]: any) => ({
        subject,
        score: (data.correct / data.total) * 100
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  function getCriticalGaps(subjectAnalysis: any) {
    return Object.entries(subjectAnalysis)
      .map(([subject, data]: any) => ({
        subject,
        score: (data.correct / data.total) * 100
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  }

  const renderPage = () => {
    switch(currentPage) {
      case 1:
        return <ExecutiveSummary />;
      case 2:
        return <VisualDashboard />;
      case 3:
        return <DeepDiveAnalysis />;
      case 4:
        return <PersonalizedPath />;
      case 5:
        return <NextSteps />;
      default:
        return <ExecutiveSummary />;
    }
  };

  // Page 1: Executive Summary
  const ExecutiveSummary = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Your UPSC Readiness Report
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Personalized analysis for {userInfo.name}
        </p>
      </div>

      {/* Overall Score Card */}
      <div className={`bg-gradient-to-br from-[#1E3A8A] to-[#059669] rounded-3xl p-8 text-white transition-all duration-1000 ${
        revealedSections.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="text-center">
          <p className="text-blue-100 mb-2">Overall Readiness Score</p>
          <div className="text-7xl font-bold mb-4">{Math.round(overallScore)}%</div>
          <p className="text-xl text-blue-100">
            Estimated time to exam readiness: <span className="font-semibold text-white">{readinessMonths} months</span>
          </p>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 transition-all duration-1000 ${
          revealedSections.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your Strengths
          </h3>
          <div className="space-y-3">
            {strengths.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{item.subject}</span>
                <span className="font-semibold text-green-700 dark:text-green-400">
                  {Math.round(item.score)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 transition-all duration-1000 ${
          revealedSections.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Critical Gaps
          </h3>
          <div className="space-y-3">
            {weaknesses.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{item.subject}</span>
                <span className="font-semibold text-red-700 dark:text-red-400">
                  {Math.round(item.score)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Study Hours Recommendation */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Based on your target of <span className="font-semibold">UPSC {userInfo.targetYear}</span>, 
          we recommend dedicating <span className="font-semibold text-[#1E3A8A] text-2xl mx-1">
            {userInfo.studyHours === 'less2' ? '3-4' :
             userInfo.studyHours === '2to4' ? '4-5' :
             userInfo.studyHours === '4to6' ? '6' : '8+'}
          </span> hours daily for optimal preparation.
        </p>
      </div>
    </div>
  );

  // Page 2: Visual Dashboard
  const VisualDashboard = () => {
    const subjects = Object.keys(results.subjectAnalysis);
    const scores = subjects.map(subject => 
      (results.subjectAnalysis[subject].correct / results.subjectAnalysis[subject].total) * 100
    );
    const topperBenchmark = subjects.map(() => 85); // Simulated topper scores

    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Performance Dashboard
        </h2>

        {/* Radar Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Subject-wise Performance vs UPSC Toppers
          </h3>
          
          {/* Bar Chart Simulation */}
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{subject}</span>
                  <span className="text-gray-500">Your Score: {Math.round(scores[index])}%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="absolute top-0 left-0 h-3 bg-gradient-to-r from-[#1E3A8A] to-[#059669] rounded-full transition-all duration-1000"
                      style={{ width: `${scores[index]}%` }}
                    />
                  </div>
                  <div 
                    className="absolute top-0 left-0 h-3 border-2 border-orange-500 rounded-full"
                    style={{ width: `${topperBenchmark[index]}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span className="text-orange-500">Topper Avg: {topperBenchmark[index]}%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Management Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Time Management Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average time per question</span>
                <span className="font-semibold">{Math.round(results.behavioralInsights.averageTime)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rushed answers (&lt;10s)</span>
                <span className="font-semibold text-orange-600">{results.behavioralInsights.rushedAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Overthought (&gt;70s)</span>
                <span className="font-semibold text-orange-600">{results.behavioralInsights.overthoughtAnswers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confidence Accuracy
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">High confidence wrong answers</span>
                <span className="font-semibold text-red-600">{results.behavioralInsights.highConfidenceWrong}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Answer changes</span>
                <span className="font-semibold">{results.behavioralInsights.totalChanges}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Tip: Trust your first instinct more often
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Page 3: Deep Dive Analysis
  const DeepDiveAnalysis = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
        Deep Dive Analysis
      </h2>

      {Object.entries(results.subjectAnalysis).map(([subject, data]: any) => {
        const score = (data.correct / data.total) * 100;
        const performance = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'needs improvement' : 'critical';
        
        return (
          <div key={subject} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {subject}
              </h3>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                performance === 'excellent' ? 'bg-green-100 text-green-700' :
                performance === 'good' ? 'bg-blue-100 text-blue-700' :
                performance === 'needs improvement' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {Math.round(score)}% - {performance}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Questions Attempted</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.total}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(data.totalTime / data.total)}s
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Why this matters for UPSC:</p>
              <p className="text-gray-700 dark:text-gray-300">
                {subject === 'Polity' && 'Strong foundation in Polity is crucial for both Prelims and Mains. It forms the backbone of governance questions.'}
                {subject === 'History' && 'History questions constitute 15-20% of Prelims. Modern History is particularly important for Mains.'}
                {subject === 'Geography' && 'Geography integrates with Current Affairs and Environment. Map-based questions are scoring if prepared well.'}
                {subject === 'Economy' && 'Economic concepts are tested in relation to current policies. Understanding basics helps in essay and ethics papers too.'}
                {subject === 'Current Affairs' && 'CA forms 30-40% of Prelims. Dynamic questions test your ability to link current events with static knowledge.'}
                {subject === 'Science & Technology' && 'S&T questions focus on applications and current developments. Conceptual clarity helps in quick elimination.'}
                {subject === 'Environment' && 'Environmental issues are integrated across papers. International conventions and Indian initiatives are frequently asked.'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Page 4: Personalized Path
  const PersonalizedPath = () => {
    const studyPlan = generateStudyPlan(results, userInfo);
    
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Your Personalized Study Path
        </h2>

        {/* 30-Day Quick Win Plan */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-3xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            30-Day Quick Win Plan
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Week 1-2: Foundation Building</h4>
              <ul className="space-y-2">
                {studyPlan.week1.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Week 3-4: Momentum Building</h4>
              <ul className="space-y-2">
                {studyPlan.week3.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Subject Priority */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Subject Priority Sequence
          </h3>
          <div className="space-y-3">
            {studyPlan.subjectPriority.map((subject, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-red-500' :
                  index === 1 ? 'bg-orange-500' :
                  index === 2 ? 'bg-yellow-500' : 'bg-green-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{subject.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subject.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Time Allocation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recommended Daily Schedule
          </h3>
          <div className="space-y-3">
            {studyPlan.dailySchedule.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-900 dark:text-white">{slot.time}</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{slot.activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Page 5: Next Steps (Soft Sell)
  const NextSteps = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          How Community IAS Addresses Your Specific Gaps
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Based on your diagnostic results, here&apos;s how our platform is uniquely positioned to help you succeed
        </p>
      </div>

      {/* Personalized Features */}
      <div className="grid md:grid-cols-2 gap-6">
        {weaknesses.map((weakness, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#059669] bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-[#059669] font-bold">{index + 1}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Your Gap: {weakness.subject} ({Math.round(weakness.score)}%)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Our Solution: Adaptive learning modules that start from basics and build up systematically
                </p>
                <p className="text-sm text-[#1E3A8A] font-medium">
                  Expected improvement: +40% in 6 weeks
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Story */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Success Story: Similar Profile to Yours
        </h3>
        <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          &ldquo;I started with a 45% diagnostic score, working full-time with only 3 hours daily. 
          Community IAS&apos;s bite-sized modules and weekend revision sessions helped me clear Prelims 
          in my second attempt. The weakness identification was spot-on!&rdquo;
        </blockquote>
        <p className="font-semibold text-gray-900 dark:text-white">
          - Amit Kumar, IAS 2023 (AIR 156)
        </p>
      </div>

      {/* Limited Time Offer */}
      <div className="bg-[#1E3A8A] rounded-3xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">
          Exclusive Offer for Diagnostic Test Takers
        </h3>
        <p className="text-xl mb-6 text-blue-100">
          Get 40% off on your personalized study plan + 1-on-1 mentorship session
        </p>
        <div className="bg-white/20 rounded-2xl p-6 mb-6 max-w-md mx-auto">
          <p className="text-3xl font-bold mb-2">₹999 <span className="text-lg line-through text-blue-200">₹1,665</span></p>
          <p className="text-blue-100">Valid for next 48 hours only</p>
        </div>
        <Link 
          href="/signup"
          className="inline-block px-10 py-4 bg-white text-[#1E3A8A] rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
        >
          Claim Your Personalized Plan
        </Link>
        <p className="mt-4 text-sm text-blue-100">
          15,247 aspirants started their journey this month
        </p>
      </div>
    </div>
  );

  function generateStudyPlan(results: any, userInfo: any) {
    const weakSubjects = getCriticalGaps(results.subjectAnalysis);
    
    return {
      week1: [
        `Focus on ${weakSubjects[0].subject} fundamentals - 2 hours daily`,
        'Complete NCERT basics for weakest topics',
        'Daily current affairs reading - 30 minutes',
        'Practice 20 MCQs from weak areas'
      ],
      week3: [
        'Integrate second weak subject into routine',
        'Start answer writing practice - 1 essay weekly',
        'Join study group for peer discussions',
        'Take weekly subject-wise tests'
      ],
      subjectPriority: weakSubjects.map((subject, index) => ({
        name: subject.subject,
        reason: index === 0 ? 'Critical gap - needs immediate attention' :
                index === 1 ? 'Secondary weakness - integrate after week 2' :
                'Maintenance mode - regular practice needed'
      })),
      dailySchedule: [
        { time: '6:00 - 7:30 AM', activity: 'Current Affairs + Revision' },
        { time: '8:00 - 9:00 PM', activity: `${weakSubjects[0].subject} Deep Study` },
        { time: '9:00 - 10:00 PM', activity: 'Practice Questions + Analysis' }
      ]
    };
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
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.print()}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Download Report
              </button>
              <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-full transition-all ${
                currentPage === page
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}