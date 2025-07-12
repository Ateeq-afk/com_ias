'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Zap, Star, CreditCard, Calendar, AlertCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    id: 'MONTHLY',
    name: 'Monthly',
    price: 999,
    originalPrice: 1299,
    duration: '1 month',
    popular: false,
    features: [
      'All interactive lessons',
      'Unlimited practice tests',
      'Performance analytics',
      'Mobile app access',
      'Email support'
    ]
  },
  {
    id: 'QUARTERLY',
    name: 'Quarterly',
    price: 2499,
    originalPrice: 3897,
    duration: '3 months',
    popular: true,
    savings: '36% off',
    features: [
      'Everything in Monthly',
      'Priority support',
      'Advanced analytics',
      'Offline content download',
      'Live doubt sessions'
    ]
  },
  {
    id: 'YEARLY',
    name: 'Yearly',
    price: 7999,
    originalPrice: 15588,
    duration: '12 months',
    popular: false,
    savings: '49% off',
    features: [
      'Everything in Quarterly',
      'Personal mentor',
      'Mock interview sessions',
      'Physical study materials',
      'WhatsApp support group'
    ]
  }
]

export default function SubscriptionPage() {
  const { data: session } = useSession()
  const [selectedPlan, setSelectedPlan] = useState('QUARTERLY')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState<any>(null)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!session?.user) {
      toast.error('Please sign in to continue')
      return
    }

    setIsLoading(true)

    try {
      const plan = plans.find(p => p.id === selectedPlan)
      
      // Create order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          amount: plan?.price
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Razorpay payment options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Community IAS',
        description: `${plan?.name} Subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: session.user.name,
          email: session.user.email,
        },
        theme: {
          color: '#1E3A8A'
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: orderData.paymentId,
                plan: selectedPlan
              })
            })

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed')
            }

            const verifyData = await verifyResponse.json()
            
            if (verifyData.success) {
              toast.success('Payment successful! Welcome to Premium!')
              // Refresh the page or update UI
              window.location.reload()
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed')
          }
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of your UPSC preparation with our premium features
        </p>
      </motion.div>

      {/* Current Subscription */}
      {currentSubscription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">Current Plan</h2>
          </div>
          <p className="text-green-700">
            You're currently on the <strong>{currentSubscription.plan}</strong> plan.
            Expires on {new Date(currentSubscription.endDate).toLocaleDateString()}
          </p>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all cursor-pointer ${
              selectedPlan === plan.id
                ? 'border-blue-500 shadow-blue-200/50'
                : plan.popular
                ? 'border-purple-200'
                : 'border-gray-200'
            } ${plan.popular ? 'scale-105' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                  Most Popular
                </div>
              </div>
            )}

            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500 line-through">₹{plan.originalPrice}</span>
                </div>
                <p className="text-gray-600">per {plan.duration}</p>
                {plan.savings && (
                  <div className="mt-2">
                    <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                      {plan.savings}
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className={`w-4 h-4 rounded-full border-4 mx-auto ${
                selectedPlan === plan.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedPlan === plan.id && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-2xl shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <CreditCard className="w-6 h-6" />
          )}
          {isLoading ? 'Processing...' : `Subscribe to ${plans.find(p => p.id === selectedPlan)?.name}`}
        </button>

        <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
          Secure payment powered by Razorpay. Cancel anytime. No hidden charges.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          {
            icon: Zap,
            title: 'Instant Access',
            description: 'Get immediate access to all premium content after payment'
          },
          {
            icon: Calendar,
            title: 'Flexible Billing',
            description: 'Cancel or upgrade your plan anytime with prorated billing'
          },
          {
            icon: Star,
            title: 'Money Back Guarantee',
            description: '7-day money back guarantee if you\'re not satisfied'
          }
        ].map((feature, index) => (
          <div key={index} className="text-center">
            <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}