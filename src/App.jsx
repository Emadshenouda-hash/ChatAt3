import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { 
  BookOpen,
  FileText,
  MessageCircle,
  Building,
  Heart,
  HandHeart,
  Menu,
  X,
  Globe,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react'
import ContentList from './components/ContentList.jsx'
import ContentDetail from './components/ContentDetail.jsx'
import PrayerRequestForm from './components/PrayerRequestForm.jsx'
import SubscriptionForm from './components/SubscriptionForm.jsx'
import ContactForm from './components/ContactForm.jsx'

// Import data
import articlesData from './data/articles.json'
import booksData from './data/books.json'
import blogData from './data/blog.json'

import './App.css'
import './animations.css'
import './fonts.css'

// Language context
const LanguageContext = React.createContext()

// Translation data
const translations = {
  en: {
    title: "ChatAT",
    subtitle: "A place for those who have wandered... but are not lost.",
    description: "A safe and welcoming space for Christians in diaspora—and anyone seeking hope, grace, and connection.",
    nav: {
      books: "Books",
      articles: "Articles", 
      blog: "Blog",
      about: "About Us",
      church: "Church",
      surrender: "Surrender",
      prayer: "Need a Prayer?",
      subscribe: "Subscribe",
      contact: "Contact"
    },
    cards: {
      books: {
        title: "Books",
        description: "Discover spiritual readings and resources for your faith journey"
      },
      articles: {
        title: "Articles", 
        description: "Thoughtful pieces on faith, life, and finding your place in the world"
      },
      blog: {
        title: "Blog",
        description: "Stories, reflections, and updates from our community"
      },
      church: {
        title: "Church",
        description: "Find local communities and connect with fellow believers"
      },
      surrender: {
        title: "Surrender",
        description: "Resources for spiritual growth and surrendering to God's will"
      },
      prayer: {
        title: "Prayer Requests",
        description: "Share your prayer needs and pray for others in our community"
      }
    },
    cta: {
      title: "Join Our Community Today",
      description: "Start your journey of faith and connection with a community that understands you",
      button: "Get Started"
    },
    footer: {
      copyright: "© 2024 ChatAT. All rights reserved.",
      followUs: "Follow Us"
    }
  },
  ar: {
    title: "شتات",
    subtitle: "مكان لمن تاهوا... لكنهم ليسوا ضائعين.",
    description: "مساحة آمنة ومرحبة للمسيحيين في الشتات - ولكل من يبحث عن الأمل والنعمة والتواصل.",
    nav: {
      books: "الكتب",
      articles: "المقالات",
      blog: "المدونة", 
      about: "من نحن",
      church: "الكنيسة",
      surrender: "الاستسلام",
      prayer: "تحتاج صلاة؟",
      subscribe: "اشترك معنا",
      contact: "اتصل بنا"
    },
    cards: {
      books: {
        title: "الكتب",
        description: "اكتشف القراءات الروحية والموارد لرحلة إيمانك"
      },
      articles: {
        title: "المقالات",
        description: "مقالات مدروسة حول الإيمان والحياة وإيجاد مكانك في العالم"
      },
      blog: {
        title: "المدونة",
        description: "قصص وتأملات وتحديثات من مجتمعنا"
      },
      church: {
        title: "الكنيسة",
        description: "ابحث عن المجتمعات المحلية وتواصل مع المؤمنين الآخرين"
      },
      surrender: {
        title: "الاستسلام",
        description: "موارد للنمو الروحي والاستسلام لإرادة الله"
      },
      prayer: {
        title: "طلبات الصلاة",
        description: "شارك احتياجاتك للصلاة وصل من أجل الآخرين في مجتمعنا"
      }
    },
    cta: {
      title: "انضم إلى مجتمعنا اليوم",
      description: "ابدأ رحلتك في الإيمان والتواصل مع مجتمع يفهمك",
      button: "ابدأ الآن"
    },
    footer: {
      copyright: "© 2024 شتات. جميع الحقوق محفوظة.",
      followUs: "تابعنا",
      quickLinks: "روابط سريعة"
    }
  }
}

// Header Component
function Header({ language, setLanguage, t }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const navigation = [
    { name: t.nav.books, href: "/books" },
    { name: t.nav.articles, href: "/articles" },
    { name: t.nav.blog, href: "/blog" },
    { name: t.nav.about, href: "/about" }
  ]

  // Reverse navigation order for Arabic (RTL)
  const displayNavigation = language === 'ar' ? [...navigation].reverse() : navigation

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sky-teal/20 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex h-16 justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          {/* Logo - Always on the left for LTR, right for RTL */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-serene-blue transition-colors font-heading">
              <img src="/logo.png" alt="ChatAT Logo" className="h-8 w-auto animate-icon-pop" />
              <span className="text-spiritual-gradient">{t.title}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className={`ml-10 flex items-baseline space-x-8 ${language === 'ar' ? 'space-x-reverse mr-10 ml-0' : ''}`}>
              {displayNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-serene-blue px-3 py-2 text-sm font-medium transition-colors font-primary relative group"
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-spiritual-gradient transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Language Toggle & Mobile menu button */}
          <div className={`flex items-center space-x-4 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center space-x-2 border-sky-teal/30 text-serene-blue hover:bg-sky-teal/10 hover:border-sky-teal/50 transition-all duration-300 font-primary"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </Button>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm border-t border-sky-teal/20">
              {displayNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-serene-blue block px-3 py-2 text-base font-medium transition-colors font-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

// Footer Component
function Footer({ t, language }) {
  const footerNavigation = [
    { name: t.nav.church, href: "/church", icon: Building },
    { name: t.nav.surrender, href: "/surrender", icon: Heart },
    { name: t.nav.prayer, href: "/prayer", icon: HandHeart },
    { name: t.nav.subscribe, href: "/subscribe", icon: MessageCircle },
    { name: t.nav.contact, href: "/contact", icon: FileText },
  ]

  // Reverse footer navigation order for Arabic (RTL)
  const displayFooterNavigation = language === 'ar' ? [...footerNavigation].reverse() : footerNavigation

  const socialLinks = [
    { 
      name: 'Facebook', 
      href: '#', 
      icon: Facebook,
      color: 'text-blue-600 hover:text-blue-700'
    },
    { 
      name: 'Instagram', 
      href: '#', 
      icon: Instagram,
      color: 'text-pink-600 hover:text-pink-700'
    },
    { 
      name: 'YouTube', 
      href: '#', 
      icon: Youtube,
      color: 'text-red-600 hover:text-red-700'
    },
    { 
      name: 'X (Twitter)', 
      href: '#', 
      icon: X,
      color: 'text-gray-900 hover:text-gray-700'
    },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-deep-plum to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gold-amber rounded-full animate-parallax-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-sky-teal rounded-full animate-cross-rotate"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 animate-slide-in-left">
            <h3 className="text-2xl font-bold font-hero text-divine-gradient">{t.title}</h3>
            <p className="text-gray-300 text-sm font-primary leading-relaxed">{t.description}</p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4 animate-fade-in-up">
            <h4 className="text-lg font-semibold font-heading text-sky-teal">{t.footer.quickLinks}</h4>
            <ul className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {displayFooterNavigation.map((item) => {
                const IconComponent = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : 'space-x-2'} space-x-2 text-gray-300 hover:text-gold-amber transition-colors duration-300 font-primary group`}
                    >
                      <IconComponent className="h-4 w-4 group-hover:animate-icon-pop" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4 animate-slide-in-right">
            <h4 className="text-lg font-semibold font-heading text-sky-teal">{t.footer.followUs}</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`p-3 rounded-full bg-gray-800/50 backdrop-blur-sm ${social.color} hover:bg-gray-700/50 transition-all duration-300 hover:scale-110 animate-spiritual-glow hover-glassmorphism`}
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700/50 text-center">
          <p className="text-gray-400 text-sm font-primary">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}

// Homepage Component
function HomePage({ t }) {
  const cards = [
    {
      title: t.cards.books.title,
      description: t.cards.books.description,
      href: "/books",
      icon: BookOpen,
      color: "from-serene-blue to-sky-teal"
    },
    {
      title: t.cards.articles.title,
      description: t.cards.articles.description,
      href: "/articles",
      icon: FileText,
      color: "from-forest-green to-sky-teal"
    },
    {
      title: t.cards.blog.title,
      description: t.cards.blog.description,
      href: "/blog",
      icon: MessageCircle,
      color: "from-soft-rose to-gold-amber"
    },
    {
      title: t.cards.church.title,
      description: t.cards.church.description,
      href: "/church",
      icon: Building,
      color: "from-gold-amber to-warm-sand"
    },
    {
      title: t.cards.surrender.title,
      description: t.cards.surrender.description,
      href: "/surrender",
      icon: Heart,
      color: "from-deep-plum to-soft-rose"
    },
    {
      title: t.cards.prayer.title,
      description: t.cards.prayer.description,
      href: "/prayer",
      icon: HandHeart,
      color: "from-serene-blue to-deep-plum"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-divine-gradient py-20 lg:py-32 overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-image.jpg" 
            alt="Community gathering" 
            className="w-full h-full object-cover opacity-30 animate-parallax-float"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ivory-white/60 via-warm-sand/40 to-sky-teal/20"></div>
        </div>
        
        {/* Floating Spiritual Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 opacity-20 animate-cross-rotate">
          <div className="w-full h-full bg-gold-amber rounded-full"></div>
        </div>
        <div className="absolute bottom-20 right-10 w-12 h-12 opacity-20 animate-parallax-float">
          <div className="w-full h-full bg-soft-rose rounded-full"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-hero leading-tight">
              <span className="text-spiritual-gradient animate-typewriter inline-block">
                {t.title}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-primary leading-relaxed animate-slide-in-left">
              {t.subtitle}
            </p>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-primary leading-relaxed animate-slide-in-right">
              {t.description}
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-gradient-to-b from-white to-ivory-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => {
              const IconComponent = card.icon
              return (
                <Link
                  key={card.title}
                  to={card.href}
                  className={`group glassmorphism p-8 hover-lift hover-spiritual-glow hover-glassmorphism transition-all duration-500 block relative overflow-hidden animate-fade-in-up card-${index + 1} animate-border-pulse`}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${card.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-500 animate-icon-pop animate-spiritual-glow`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-serene-blue transition-colors font-heading">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-primary">
                    {card.description}
                  </p>

                  {/* Arrow with Enhanced Animation */}
                  <div className="mt-6 flex items-center text-sm font-medium text-gray-400 group-hover:text-serene-blue transition-colors font-primary">
                    <span className="mr-2">Learn more</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-spiritual-gradient animate-divine-radiance relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-10 right-20 w-20 h-20 opacity-10 animate-parallax-float"></div>
        <div className="absolute bottom-10 left-20 w-16 h-16 opacity-10 animate-cross-rotate"></div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-hero leading-tight">
              {t.cta.title}
            </h2>
            <p className="text-xl text-sky-teal/90 mb-8 font-primary leading-relaxed">
              {t.cta.description}
            </p>
            <Button
              size="lg"
              className="bg-white text-serene-blue hover:bg-ivory-white hover:text-deep-plum font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-spiritual-glow hover-scale font-primary"
            >
              {t.cta.button}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Content Detail Page Component
function ContentDetailPage({ t, data, type }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const content = data.find(item => item.slug === slug)

  if (!content) {
    return <div className="text-center py-20">Content not found.</div>
  }

  return (
    <div className="min-h-screen bg-ivory-white py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Button onClick={() => navigate(-1)} className="mb-8 bg-serene-blue hover:bg-deep-plum text-white font-primary">
          &larr; Back to {type}
        </Button>
        <h1 className="text-4xl font-bold text-deep-plum mb-6 font-heading">{content.title}</h1>
        <p className="text-gray-700 text-lg mb-8 font-primary leading-relaxed">{content.author}</p>
        <img src={content.image} alt={content.title} className="w-full h-64 object-cover rounded-lg mb-8 shadow-lg" />
        <div className="prose prose-lg max-w-none text-gray-800 font-primary leading-relaxed" dangerouslySetInnerHTML={{ __html: content.fullText }} />
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [language, setLanguage] = useState('en')
  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <Router>
        <Header language={language} setLanguage={setLanguage} t={t} />
        <Routes>
          <Route path="/" element={<HomePage t={t} />} />
          <Route path="/books" element={<ContentList t={t} data={booksData} type="Books" />} />
          <Route path="/books/:slug" element={<ContentDetailPage t={t} data={booksData} type="Books" />} />
          <Route path="/articles" element={<ContentList t={t} data={articlesData} type="Articles" />} />
          <Route path="/articles/:slug" element={<ContentDetailPage t={t} data={articlesData} type="Articles" />} />
          <Route path="/blog" element={<ContentList t={t} data={blogData} type="Blog" />} />
          <Route path="/blog/:slug" element={<ContentDetailPage t={t} data={blogData} type="Blog" />} />
          <Route path="/church" element={<ContentDetailPage t={t} data={[]} type="Church" />} />
          <Route path="/surrender" element={<ContentDetailPage t={t} data={[]} type="Surrender" />} />
          <Route path="/prayer" element={<PrayerRequestForm t={t} />} />
          <Route path="/subscribe" element={<SubscriptionForm t={t} />} />
          <Route path="/contact" element={<ContactForm t={t} />} />
          <Route path="/about" element={<ContentDetailPage t={t} data={[]} type="About Us" />} />
        </Routes>
        <Footer t={t} language={language} />
      </Router>
    </LanguageContext.Provider>
  )
}

export default App


