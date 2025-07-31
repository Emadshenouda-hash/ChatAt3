import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Mail, CheckCircle, Bell } from 'lucide-react'

function SubscriptionForm({ language }) {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const translations = {
    en: {
      title: "Stay Connected",
      subtitle: "Join our newsletter to receive updates, articles, and encouragement from the ChatAT community.",
      emailPlaceholder: "Enter your email address",
      subscribe: "Subscribe",
      subscribing: "Subscribing...",
      success: "Thank you for subscribing! You'll receive a confirmation email shortly.",
      benefits: [
        "Weekly articles and reflections",
        "Community updates and events",
        "Prayer requests and testimonies",
        "Exclusive content for subscribers"
      ],
      emailRequired: "Email address is required",
      emailInvalid: "Please enter a valid email address",
      privacy: "We respect your privacy. Unsubscribe at any time."
    },
    ar: {
      title: "ابق على تواصل",
      subtitle: "انضم إلى نشرتنا الإخبارية لتلقي التحديثات والمقالات والتشجيع من مجتمع شتات.",
      emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
      subscribe: "اشترك",
      subscribing: "جاري الاشتراك...",
      success: "شكراً لك على الاشتراك! ستتلقى رسالة تأكيد قريباً.",
      benefits: [
        "مقالات وتأملات أسبوعية",
        "تحديثات وأحداث المجتمع",
        "طلبات الصلاة والشهادات",
        "محتوى حصري للمشتركين"
      ],
      emailRequired: "عنوان البريد الإلكتروني مطلوب",
      emailInvalid: "يرجى إدخال عنوان بريد إلكتروني صحيح",
      privacy: "نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت."
    }
  }

  const t = translations[language]

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError(t.emailRequired)
      return
    }

    if (!validateEmail(email)) {
      setError(t.emailInvalid)
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubscribed(true)
    setIsSubmitting(false)
  }

  if (isSubscribed) {
    return (
      <div className="max-w-md mx-auto text-center py-8">
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 mb-4">
            {language === 'ar' ? 'تم الاشتراك بنجاح!' : 'Successfully Subscribed!'}
          </h3>
          <p className="text-green-700">
            {t.success}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4">
          <Bell className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.title}
        </h2>
        <p className="text-gray-600">
          {t.subtitle}
        </p>
      </div>

      {/* Benefits List */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">
          {language === 'ar' ? 'ما ستحصل عليه:' : 'What you\'ll receive:'}
        </h3>
        <ul className="space-y-2">
          {t.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscription Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder={t.emailPlaceholder}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{t.subscribing}</span>
            </div>
          ) : (
            t.subscribe
          )}
        </Button>
      </form>

      {/* Privacy Notice */}
      <p className="text-xs text-gray-500 text-center mt-4">
        {t.privacy}
      </p>
    </div>
  )
}

export default SubscriptionForm

