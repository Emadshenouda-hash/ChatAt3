import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Calendar, User, Tag, ArrowLeft, Share2, BookOpen } from 'lucide-react'

function DynamicContentDetail({ type, getFunction, language }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        const data = await getFunction(parseInt(id))
        if (data) {
          setContent(data)
        } else {
          setError('Content not found')
        }
      } catch (err) {
        setError(err.message)
        console.error(`Failed to load ${type}:`, err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchContent()
    }
  }, [id, getFunction, type])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serene-blue mx-auto"></div>
            <p className="mt-4 text-gray-600 font-primary">Loading {type}...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
              {language === 'ar' ? 'المحتوى غير موجود' : 'Content Not Found'}
            </h1>
            <p className="text-gray-600 mb-8 font-primary">
              {language === 'ar' ? 'عذراً، لم نتمكن من العثور على المحتوى المطلوب.' : 'Sorry, we couldn\'t find the content you\'re looking for.'}
            </p>
            <Button onClick={() => navigate(-1)} className="bg-serene-blue hover:bg-deep-plum text-white font-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'العودة' : 'Go Back'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Get the appropriate title and content based on language
  const title = typeof content.title === 'object' ? content.title[language] || content.title.en : content.title
  const contentText = typeof content.content === 'object' ? content.content[language] || content.content.en : content.content
  const description = typeof content.description === 'object' ? content.description[language] || content.description.en : content.description

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (language === 'ar') {
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || content.excerpt?.[language] || content.excerpt?.en,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-serene-blue to-deep-plum py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gold-amber rounded-full animate-parallax-float"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-sky-teal rounded-full animate-cross-rotate"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline"
            className="mb-8 bg-white/10 border-white/20 text-white hover:bg-white/20 font-primary backdrop-blur-sm"
          >
            <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {language === 'ar' ? `العودة إلى ${type}` : `Back to ${type}`}
          </Button>

          {/* Title */}
          <h1 className={`text-4xl md:text-5xl font-bold text-white mb-6 font-hero leading-tight animate-fade-in-up ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {title}
          </h1>

          {/* Meta Information */}
          <div className={`flex flex-wrap items-center gap-6 text-white/80 mb-8 font-primary animate-slide-in-left ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formatDate(content.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{content.author}</span>
            </div>
            {(content.category || content.genre) && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>{content.category || content.genre}</span>
              </div>
            )}
            {content.language && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {content.language === 'ar' ? 'عربي' : 'English'}
              </span>
            )}
          </div>

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className={`flex flex-wrap gap-2 mb-8 animate-slide-in-right ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              {content.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-white/20 text-white rounded-full text-sm font-primary backdrop-blur-sm"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Button */}
          <Button 
            onClick={handleShare}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-primary backdrop-blur-sm animate-fade-in-up"
          >
            <Share2 className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
            {language === 'ar' ? 'مشاركة' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Featured Image */}
          {content.image && (
            <div className="mb-12 animate-fade-in-up">
              <img 
                src={content.image} 
                alt={title}
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          )}

          {/* Description (for books) */}
          {description && type === 'Books' && (
            <div className={`mb-8 p-6 bg-sky-teal/5 rounded-2xl border-l-4 border-sky-teal animate-slide-in-left ${language === 'ar' ? 'text-right border-r-4 border-l-0' : ''}`}>
              <h3 className="text-lg font-semibold text-sky-teal mb-3 font-heading">
                {language === 'ar' ? 'وصف الكتاب' : 'Book Description'}
              </h3>
              <p className="text-gray-700 font-primary leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Additional Book Information */}
          {type === 'Books' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-in-right">
              {content.isbn && (
                <div className="p-4 bg-warm-sand/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 font-heading">ISBN</h4>
                  <p className="text-gray-700 font-primary">{content.isbn}</p>
                </div>
              )}
              {content.audience && (
                <div className="p-4 bg-soft-rose/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 font-heading">
                    {language === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}
                  </h4>
                  <p className="text-gray-700 font-primary">{content.audience}</p>
                </div>
              )}
              {content.formats && content.formats.length > 0 && (
                <div className="p-4 bg-gold-amber/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 font-heading">
                    {language === 'ar' ? 'الصيغ المتاحة' : 'Available Formats'}
                  </h4>
                  <p className="text-gray-700 font-primary">{content.formats.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className={`prose prose-lg max-w-none animate-fade-in-up ${language === 'ar' ? 'prose-rtl' : ''}`}>
            <div 
              className={`text-gray-800 font-primary leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}
              style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
              dangerouslySetInnerHTML={{ __html: contentText }} 
            />
          </div>

          {/* Back to List Button */}
          <div className="mt-12 text-center animate-fade-in-up">
            <Link to={`/${type.toLowerCase()}`}>
              <Button className="bg-serene-blue hover:bg-deep-plum text-white px-8 py-3 font-primary">
                <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'ml-2 rotate-180' : 'mr-2'}`} />
                {language === 'ar' ? `العودة إلى جميع ${type}` : `Back to All ${type}`}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DynamicContentDetail

