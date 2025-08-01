import React from 'react'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

function ContentList({ items, language, type = 'article' }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {language === 'ar' ? 'لا توجد عناصر متاحة حالياً' : 'No items available at the moment'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => {
        const title =
          typeof item.title === 'object'
            ? item.title?.[language] || item.title?.en || 'Untitled'
            : item.title || 'Untitled'

        const excerpt =
          typeof item.excerpt === 'object'
            ? item.excerpt?.[language] || item.excerpt?.en || ''
            : item.excerpt || ''

        const description =
          typeof item.description === 'object'
            ? item.description?.[language] || item.description?.en || ''
            : item.description || ''

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* Image */}
            {item.image && (
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/600x400/e5e7eb/6b7280?text=${encodeURIComponent(
                      title
                    )}`
                  }}
                />
                {item.featured && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {language === 'ar' ? 'مميز' : 'Featured'}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Category & Date */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                {item.category && (
                  <span className="bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
                )}
                {item.date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(item.date).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US'
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{title}</h3>

              {/* Description/Excerpt */}
              <p className="text-gray-600 mb-4 line-clamp-3">{excerpt || description}</p>

              {/* Author */}
              {item.author && (
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span>{item.author}</span>
                </div>
              )}

              {/* Price (for books) */}
              {type === 'book' && item.price && (
                <div className="text-lg font-bold text-blue-600 mb-4">{item.price}</div>
              )}

              {/* Action Button */}
              <Button
                variant="outline"
                className="w-full group"
                onClick={() => {
                  window.location.href = `/${type}s/${item.id}`
                }}
              >
                <span className={language === 'ar' ? 'ml-2' : 'mr-2'}>
                  {type === 'book'
                    ? language === 'ar'
                      ? 'عرض التفاصيل'
                      : 'View Details'
                    : language === 'ar'
                    ? 'اقرأ المزيد'
                    : 'Read More'}
                </span>
                <ArrowRight
                  className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${
                    language === 'ar' ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ContentList
