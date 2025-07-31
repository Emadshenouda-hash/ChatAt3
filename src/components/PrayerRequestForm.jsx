import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Heart, Send, CheckCircle } from 'lucide-react'

function PrayerRequestForm({ language }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: '',
    isAnonymous: false,
    category: 'general'
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const translations = {
    en: {
      title: "Submit a Prayer Request",
      subtitle: "Share your prayer needs with our community. We believe in the power of prayer and are here to support you.",
      name: "Your Name",
      email: "Email Address",
      request: "Prayer Request",
      requestPlaceholder: "Please share what you would like us to pray for...",
      anonymous: "Submit anonymously",
      category: "Category",
      categories: {
        general: "General",
        health: "Health & Healing",
        family: "Family",
        work: "Work & Career",
        spiritual: "Spiritual Growth",
        guidance: "Guidance & Direction"
      },
      submit: "Submit Prayer Request",
      submitting: "Submitting...",
      success: "Thank you for sharing your prayer request with us. Our community will be praying for you.",
      required: "This field is required",
      emailInvalid: "Please enter a valid email address"
    },
    ar: {
      title: "تقديم طلب صلاة",
      subtitle: "شارك احتياجاتك للصلاة مع مجتمعنا. نؤمن بقوة الصلاة ونحن هنا لدعمك.",
      name: "اسمك",
      email: "عنوان البريد الإلكتروني",
      request: "طلب الصلاة",
      requestPlaceholder: "يرجى مشاركة ما تريد منا أن نصلي من أجله...",
      anonymous: "تقديم بشكل مجهول",
      category: "الفئة",
      categories: {
        general: "عام",
        health: "الصحة والشفاء",
        family: "العائلة",
        work: "العمل والمهنة",
        spiritual: "النمو الروحي",
        guidance: "الإرشاد والتوجيه"
      },
      submit: "تقديم طلب الصلاة",
      submitting: "جاري التقديم...",
      success: "شكراً لك على مشاركة طلب الصلاة معنا. سيصلي مجتمعنا من أجلك.",
      required: "هذا الحقل مطلوب",
      emailInvalid: "يرجى إدخال عنوان بريد إلكتروني صحيح"
    }
  }

  const t = translations[language]
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.isAnonymous && !formData.name.trim()) {
      newErrors.name = t.required
    }
    
    if (!formData.isAnonymous && !formData.email.trim()) {
      newErrors.email = t.required
    } else if (!formData.isAnonymous && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.emailInvalid
    }
    
    if (!formData.request.trim()) {
      newErrors.request = t.required
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            {language === 'ar' ? 'تم الإرسال بنجاح' : 'Successfully Submitted'}
          </h3>
          <p className="text-green-700 mb-6">
            {t.success}
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({
                name: '',
                email: '',
                request: '',
                isAnonymous: false,
                category: 'general'
              })
            }}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            {language === 'ar' ? 'تقديم طلب آخر' : 'Submit Another Request'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-4">
          <Heart className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.title}
        </h2>
        <p className="text-lg text-gray-600">
          {t.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Anonymous Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.isAnonymous}
            onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="anonymous" className="text-sm font-medium text-gray-700">
            {t.anonymous}
          </label>
        </div>

        {/* Name Field */}
        {!formData.isAnonymous && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {t.name}
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t.name}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
        )}

        {/* Email Field */}
        {!formData.isAnonymous && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t.email}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        )}

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            {t.category}
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {Object.entries(t.categories).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        {/* Prayer Request Field */}
        <div>
          <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-2">
            {t.request}
          </label>
          <textarea
            id="request"
            rows={6}
            value={formData.request}
            onChange={(e) => handleInputChange('request', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
              errors.request ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t.requestPlaceholder}
          />
          {errors.request && <p className="mt-1 text-sm text-red-600">{errors.request}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{t.submitting}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{t.submit}</span>
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

export default PrayerRequestForm

