import React from 'react'
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

function ContentDetail({ item, language, type = 'article', onBack }) {
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'المحتوى غير موجود' : 'Content Not Found'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar' ? 'المحتوى المطلوب غير متاح' : 'The requested content is not available'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 flex items-center space-x-2"
        >
          <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          <span>{language === 'ar' ? 'العودة' : 'Back'}</span>
        </Button>

        {/* Article Content */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          {item.image && (
            <div className="aspect-video bg-gray-200 relative overflow-hidden">
              <img
                src={item.image}
                alt={item.title[language] || item.title.en}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/800x400/e5e7eb/6b7280?text=${encodeURIComponent(item.title[language] || item.title.en)}`
                }}
              />
              {item.featured && (
                <div className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {language === 'ar' ? 'مميز' : 'Featured'}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-8 lg:p-12">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              {item.category && (
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
              )}
              {item.date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(item.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                </div>
              )}
              {item.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{item.author}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {item.title[language] || item.title.en}
            </h1>

            {/* Price (for books) */}
            {type === 'book' && item.price && (
              <div className="text-2xl font-bold text-blue-600 mb-6">
                {item.price}
                {item.available && (
                  <span className="ml-4 text-sm font-normal text-green-600">
                    {language === 'ar' ? 'متاح' : 'Available'}
                  </span>
                )}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {item.content?.[language] || item.description?.[language] || item.content?.en || item.description?.en}
              </div>
            </div>

            {/* Action Buttons */}
            {type === 'book' && (
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  {language === 'ar' ? 'اشتري الآن' : 'Buy Now'}
                </Button>
                <Button variant="outline" size="lg">
                  {language === 'ar' ? 'أضف إلى قائمة الرغبات' : 'Add to Wishlist'}
                </Button>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'شارك هذا المحتوى' : 'Share this content'}
              </h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  WhatsApp
                </Button>
                <Button variant="outline" size="sm">
                  {language === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default ContentDetail

