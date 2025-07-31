import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

// Import static fallback data
import staticArticles from '../data/articles.json'
import staticBlog from '../data/blog.json'
import staticBooks from '../data/books.json'

// Function to process markdown content
async function processMarkdown(content) {
  const result = await remark().use(html).process(content)
  return result.toString()
}

// Function to load articles from CMS
export async function loadArticles() {
  try {
    // Try to load CMS articles
    const cmsArticles = await loadCMSArticles()
    
    // If we have CMS articles, use them; otherwise fall back to static
    if (cmsArticles.length > 0) {
      return cmsArticles
    }
    
    return staticArticles
  } catch (error) {
    console.warn('Failed to load CMS articles, using static data:', error)
    return staticArticles
  }
}

// Function to load blog posts from CMS
export async function loadBlogPosts() {
  try {
    // Try to load CMS blog posts
    const cmsBlog = await loadCMSBlog()
    
    // If we have CMS blog posts, use them; otherwise fall back to static
    if (cmsBlog.length > 0) {
      return cmsBlog
    }
    
    return staticBlog
  } catch (error) {
    console.warn('Failed to load CMS blog posts, using static data:', error)
    return staticBlog
  }
}

// Function to load books from CMS
export async function loadBooks() {
  try {
    // Try to load CMS books
    const cmsBooks = await loadCMSBooks()
    
    // If we have CMS books, use them; otherwise fall back to static
    if (cmsBooks.length > 0) {
      return cmsBooks
    }
    
    return staticBooks
  } catch (error) {
    console.warn('Failed to load CMS books, using static data:', error)
    return staticBooks
  }
}

// Helper function to load CMS articles
async function loadCMSArticles() {
  try {
    // Try to fetch from Netlify function first
    const response = await fetch('/.netlify/functions/get-content?type=articles')
    if (response.ok) {
      const articles = await response.json()
      return articles
    }
    
    // Fallback to static import method for local development
    const articles = []
    const articleModules = import.meta.glob('../data/articles/*.md', { as: 'raw' })
    
    for (const path in articleModules) {
      try {
        const content = await articleModules[path]()
        const { data, content: markdownContent } = matter(content)
        const htmlContent = await processMarkdown(markdownContent)
        
        // Convert CMS format to match your existing JSON structure
        const article = {
          id: generateIdFromPath(path),
          title: {
            en: data.language === 'en' ? data.title : `Article ${generateIdFromPath(path)}`,
            ar: data.language === 'ar' ? data.title : `مقال ${generateIdFromPath(path)}`
          },
          content: {
            en: data.language === 'en' ? htmlContent : 'Content available in Arabic only',
            ar: data.language === 'ar' ? htmlContent : 'المحتوى متوفر باللغة الإنجليزية فقط'
          },
          excerpt: {
            en: data.language === 'en' ? data.excerpt : 'Excerpt available in Arabic only',
            ar: data.language === 'ar' ? data.excerpt : 'المقتطف متوفر باللغة الإنجليزية فقط'
          },
          author: data.author || 'ChatAT Team',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: data.category || 'Faith',
          featured: false,
          image: data.image || '/api/placeholder/600/400',
          language: data.language || 'en',
          tags: data.tags || []
        }
        
        articles.push(article)
      } catch (fileError) {
        console.warn(`Failed to process article file ${path}:`, fileError)
      }
    }
    
    // Sort by date (newest first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    return articles
  } catch (error) {
    console.warn('Failed to load CMS articles:', error)
    return []
  }
}

// Helper function to load CMS blog posts
async function loadCMSBlog() {
  try {
    // Try to fetch from Netlify function first
    const response = await fetch('/.netlify/functions/get-content?type=blog')
    if (response.ok) {
      const blogPosts = await response.json()
      return blogPosts
    }
    
    // Fallback to static import method for local development
    const blogPosts = []
    const blogModules = import.meta.glob('../data/blog/*.md', { as: 'raw' })
    
    for (const path in blogModules) {
      try {
        const content = await blogModules[path]()
        const { data, content: markdownContent } = matter(content)
        const htmlContent = await processMarkdown(markdownContent)
        
        const blogPost = {
          id: generateIdFromPath(path),
          title: {
            en: data.language === 'en' ? data.title : `Blog Post ${generateIdFromPath(path)}`,
            ar: data.language === 'ar' ? data.title : `مقال مدونة ${generateIdFromPath(path)}`
          },
          content: {
            en: data.language === 'en' ? htmlContent : 'Content available in Arabic only',
            ar: data.language === 'ar' ? htmlContent : 'المحتوى متوفر باللغة الإنجليزية فقط'
          },
          excerpt: {
            en: data.language === 'en' ? data.excerpt : 'Excerpt available in Arabic only',
            ar: data.language === 'ar' ? data.excerpt : 'المقتطف متوفر باللغة الإنجليزية فقط'
          },
          author: data.author || 'ChatAT Team',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: data.category || 'Stories',
          featured: false,
          image: data.image || '/api/placeholder/600/400',
          language: data.language || 'en',
          tags: data.tags || []
        }
        
        blogPosts.push(blogPost)
      } catch (fileError) {
        console.warn(`Failed to process blog file ${path}:`, fileError)
      }
    }
    
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
    return blogPosts
  } catch (error) {
    console.warn('Failed to load CMS blog posts:', error)
    return []
  }
}

// Helper function to load CMS books
async function loadCMSBooks() {
  try {
    // Try to fetch from Netlify function first
    const response = await fetch('/.netlify/functions/get-content?type=books')
    if (response.ok) {
      const books = await response.json()
      return books
    }
    
    // Fallback to static import method for local development
    const books = []
    const bookModules = import.meta.glob('../data/books/*.md', { as: 'raw' })
    
    for (const path in bookModules) {
      try {
        const content = await bookModules[path]()
        const { data, content: markdownContent } = matter(content)
        const htmlContent = await processMarkdown(markdownContent)
        
        const book = {
          id: generateIdFromPath(path),
          title: {
            en: data.language === 'en' ? data.title : `Book ${generateIdFromPath(path)}`,
            ar: data.language === 'ar' ? data.title : `كتاب ${generateIdFromPath(path)}`
          },
          content: {
            en: data.language === 'en' ? htmlContent : 'Content available in Arabic only',
            ar: data.language === 'ar' ? htmlContent : 'المحتوى متوفر باللغة الإنجليزية فقط'
          },
          description: {
            en: data.language === 'en' ? data.description : 'Description available in Arabic only',
            ar: data.language === 'ar' ? data.description : 'الوصف متوفر باللغة الإنجليزية فقط'
          },
          author: data.author || 'Unknown Author',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          genre: data.genre || 'Spiritual',
          audience: data.audience || 'General',
          formats: data.formats || ['Physical', 'Digital'],
          featured: false,
          image: data.image || '/api/placeholder/600/400',
          language: data.language || 'en',
          isbn: data.isbn || ''
        }
        
        books.push(book)
      } catch (fileError) {
        console.warn(`Failed to process book file ${path}:`, fileError)
      }
    }
    
    books.sort((a, b) => new Date(b.date) - new Date(a.date))
    return books
  } catch (error) {
    console.warn('Failed to load CMS books:', error)
    return []
  }
}

// Helper function to generate ID from file path
function generateIdFromPath(path) {
  const filename = path.split('/').pop().replace('.md', '')
  // Create a simple hash from filename for consistent IDs
  let hash = 0
  for (let i = 0; i < filename.length; i++) {
    const char = filename.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Function to get a single article by ID
export async function getArticleById(id) {
  const articles = await loadArticles()
  return articles.find(article => article.id === parseInt(id))
}

// Function to get a single blog post by ID
export async function getBlogPostById(id) {
  const blogPosts = await loadBlogPosts()
  return blogPosts.find(post => post.id === parseInt(id))
}

// Function to get a single book by ID
export async function getBookById(id) {
  const books = await loadBooks()
  return books.find(book => book.id === parseInt(id))
}

