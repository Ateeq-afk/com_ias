'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    price: 0,
    duration: 'Forever free',
    description: 'Begin your journey with essential resources',
    features: [
      'Access to basic study materials',
      'Daily current affairs updates',
      'Community discussion forums',
      'Monthly mock test',
      'Performance tracking dashboard',
    ],
  },
  {
    id: 'aspirant',
    name: 'Aspirant',
    price: 999,
    duration: 'per month',
    description: 'Comprehensive preparation with guided learning',
    features: [
      'Everything in Foundation',
      'All six subject modules',
      'Weekly live mentorship sessions',
      'Unlimited mock tests',
      'Personalized study plans',
      'Answer evaluation by experts',
      'Priority doubt resolution',
    ],
    recommended: true,
  },
  {
    id: 'achiever',
    name: 'Achiever',
    price: 2499,
    duration: 'per month',
    description: 'Elite preparation with personal guidance',
    features: [
      'Everything in Aspirant',
      'One-on-one mentorship',
      'Interview preparation',
      'Essay writing workshops',
      'Dedicated success manager',
      'Offline downloadable content',
      'Early access to new features',
      'Exclusive masterclasses',
    ],
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return 0;
    return billingCycle === 'yearly' ? Math.floor(basePrice * 10) : basePrice;
  };

  const getDiscount = (basePrice: number) => {
    if (basePrice === 0) return '';
    return billingCycle === 'yearly' ? '2 months free' : '';
  };

  return (
    <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your Path
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light mb-12">
            Transparent pricing. No hidden fees. Upgrade or downgrade anytime.
          </p>

          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-900 rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 ${
                plan.recommended
                  ? 'bg-[#1E3A8A] text-white ring-4 ring-[#1E3A8A] ring-offset-4 dark:ring-offset-black'
                  : 'bg-gray-50 dark:bg-gray-900'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#059669] text-white text-sm font-medium px-4 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-semibold mb-2 ${
                  plan.recommended ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${
                  plan.recommended ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className={`text-5xl font-light ${
                    plan.recommended ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {plan.price === 0 ? 'Free' : `₹${getPrice(plan.price)}`}
                  </span>
                  {plan.price !== 0 && (
                    <span className={`ml-2 text-sm ${
                      plan.recommended ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {plan.duration}
                    </span>
                  )}
                </div>
                {getDiscount(plan.price) && (
                  <p className="mt-2 text-sm text-[#059669] font-medium">
                    {getDiscount(plan.price)}
                  </p>
                )}
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
                        plan.recommended ? 'text-blue-200' : 'text-[#059669]'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={`text-sm ${
                      plan.recommended ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className={`block w-full py-3 px-6 text-center rounded-full font-medium transition-all duration-200 ${
                  plan.recommended
                    ? 'bg-white text-[#1E3A8A] hover:bg-gray-100'
                    : 'bg-[#1E3A8A] text-white hover:bg-[#0F1E4A]'
                }`}
              >
                {plan.price === 0 ? 'Start Free' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            All plans include 7-day free trial. No credit card required.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                For Institutions
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Bulk licenses for coaching centers and colleges
              </p>
              <Link href="/contact" className="text-[#1E3A8A] font-medium hover:underline">
                Contact Sales →
              </Link>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Scholarship Program
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Financial assistance for deserving candidates
              </p>
              <Link href="/scholarship" className="text-[#1E3A8A] font-medium hover:underline">
                Learn More →
              </Link>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Money Back Guarantee
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                30-day refund if not completely satisfied
              </p>
              <Link href="/guarantee" className="text-[#1E3A8A] font-medium hover:underline">
                View Policy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}