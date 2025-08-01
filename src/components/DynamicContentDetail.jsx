import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Calendar, User, Tag, ArrowRight } from 'lucide-react'

function DynamicContentList({ t, type, loadFunction, language }) {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        const data = await loadFunction()
        setContent(data || [])
      } catch (err) {
        setError(err.message)
        console.error(`Failed to load ${type}:`, err)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [loadFunction, type])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serene-blue mx-auto"></div>
          <p className="mt-4 text-gray-600 font-primary">Loading {type}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center py-20">
          <p className="text-red-600 font-primary">Error loading {type}: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-deep-plum mb-4 font-hero">{type}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-primary leading-relaxed">
            {type === 'Articles' && (language === 'ar' ? 'مقالات مدروسة حول الإيمان والحياة' : 'Thoughtful pieces on faith and life')}
            {type === 'Blog' && (language === 'ar' ? 'قصص وتأملات من مجتمعنا' : 'Stories and reflections from our community')}
            {type === 'Books' && (language === 'ar' ? 'موارد روحية لرحلة إيمانك' : 'Spiritual resources for your faith journey')}
          </p>
        </div>

        {content.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 font-primary text-lg">
              {language === 'ar' ? 'لا يوجد محتوى متاح حالياً' : 'No content available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.map((item, index) => (
              <ContentCard 
                key={item.id || index} 
                item={item} 
                type={type} 
                language={language}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ContentCard({ item, type, language, index }) {
  const getSafeText = (field, fallback = '') => {
    if (typeof field === 'object' && field !== null) {
      return field[language] || field.en || fallback
    }
    return typeof field === 'string' ? field : fallback
  }

  const title = getSafeText(item.title, 'Untitled')
  const excerpt = getSafeText(item.excerpt, '')
  const description = getSafeText(item.description, '')

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return language === 'ar'
      ? date.toLocaleDateString('ar-EG')
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const generateSlug = (text) => {
    return (text || 'untitled')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const slug = generateSlug(title)
  const linkPath = `/${type.toLowerCase()}/${item.id}`

  return (
    <div className={`group glassmorphism hover-lift transition-all duration-500 overflow-hidden animate-fade-in-up card-${index + 1}`}>
      <div className="relative overflow-hidden">
        <img 
          src={item.image || '/default.jpg'} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.featured && (
          <div className="absolute top-4 left-4 bg-gold-amber text-white px-3 py-1 rounded-full text-sm font-primary">
            {language === 'ar' ? 'مميز' : 'Featured'}
          </div>
        )}
        {item.language && (
          <div className="absolute top-4 right-4 bg-serene-blue text-white px-3 py-1 rounded-full text-sm font-primary">
            {item.language === 'ar' ? 'عربي' : 'EN'}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className={`flex items-center gap-4 text-sm text-gray-500 mb-3 font-primary ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{item.date ? formatDate(item.date) : '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{item.author || 'Unknown'}</span>
          </div>
        </div>

        <h3 className={`text-xl font-bold text-gray-900 mb-3 group-hover:text-serene-blue font-heading line-clamp-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {title}
        </h3>

        <p className={`text-gray-600 mb-4 font-primary line-clamp-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {excerpt || description}
        </p>

        <div className={`flex items-center justify-between mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sky-teal/10 text-sky-teal font-primary">
            {item.category || item.genre || '—'}
          </span>
          {item.tags?.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400 font-primary">
                {item.tags.slice(0, 2).join(', ')}
              </span>
            </div>
          )}
        </div>

        <Link to={linkPath}>
          <Button 
            variant="outline" 
            className={`w-full group-hover:bg-serene-blue group-hover:text-white group-hover:border-serene-blue font-primary ${language === 'ar' ? 'flex-row-reverse' : ''}`}
          >
            <span>{language === 'ar' ? 'اقرأ المزيد' : 'Read More'}</span>
            <ArrowRight className={`h-4 w-4 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default DynamicContentList
