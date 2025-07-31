import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { MessageCircle, Send, CheckCircle, User, Mail, MessageSquare } from 'lucide-react'

function ContactForm({ language }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const translations = {
    en: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      name: "Full Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message",
      namePlaceholder: "Your full name",
      emailPlaceholder: "your.email@example.com",
      subjectPlaceholder: "What is this about?",
      messagePlaceholder: "Tell us more about your inquiry...",
      send: "Send Message",
      sending: "Sending...",
      success: "Thank you for your message! We'll get back to you within 24 hours.",
      required: "This field is required",
      emailInvalid: "Please enter a valid email address",
      contactInfo: {
        title: "Other ways to reach us",
        email: "hello@chatat.org",
        response: "We typically respond within 24 hours"
      }
    },
    ar: {
      title: "تواصل معنا",
      subtitle: "نحب أن نسمع منك. أرسل لنا رسالة وسنرد في أقرب وقت ممكن.",
      name: "الاسم الكامل",
      email: "عنوان البريد الإلكتروني",
      subject: "الموضوع",
      message: "الرسالة",
      namePlaceholder: "اسمك الكامل",
      emailPlaceholder: "your.email@example.com",
      subjectPlaceholder: "ما هو موضوع رسالتك؟",
      messagePlaceholder: "أخبرنا المزيد عن استفسارك...",
      send: "إرسال الرسالة",
      sending: "جاري الإرسال...",
      success: "شكراً لك على رسالتك! سنعود إليك خلال 24 ساعة.",
      required: "هذا الحقل مطلوب",
      emailInvalid: "يرجى إدخال عنوان بريد إلكتروني صحيح",
      contactInfo: {
        title: "طرق أخرى للتواصل معنا",
        email: "hello@chatat.org",
        response: "نرد عادة خلال 24 ساعة"
      }
    }
  }

  const t = translations[language]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = t.required
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.required
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.emailInvalid
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = t.required
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t.required
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
            {language === 'ar' ? 'تم الإرسال بنجاح!' : 'Message Sent Successfully!'}
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
                subject: '',
                message: ''
              })
            }}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl mb-4">
          <MessageCircle className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.title}
        </h2>
        <p className="text-lg text-gray-600">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t.name}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t.namePlaceholder}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t.emailPlaceholder}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                {t.subject}
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t.subjectPlaceholder}
                />
              </div>
              {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {t.message}
              </label>
              <textarea
                id="message"
                rows={6}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t.messagePlaceholder}
              />
              {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t.sending}</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>{t.send}</span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t.contactInfo.title}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-medium text-gray-900">{t.contactInfo.email}</p>
                  <p className="text-sm text-gray-600">{t.contactInfo.response}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm

