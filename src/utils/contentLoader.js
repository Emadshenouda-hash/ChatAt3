import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

// Import static fallback data
import staticArticles from '../data/articles.json'
import staticBlog from '../data/blog.json'
import staticBooks from '../data/books.json'

// Function to process markdown content (only used for static fallback)
async function processMarkdown(content) {
  const result = await remark().use(html).process(content)
  return result.toString()
}

// Helper function to generate ID from file path (only used for static fallback)
function generateIdFromPath(path) {
  const filename = path.split('/').pop().replace('.md', '')
  let hash = 0
  for (let i = 0; i < filename.length; i++) {
    const char = filename.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Function to load articles
export async function loadArticles() {
  try {
    const response = await fetch('/.netlify/functions/get-content?type=articles')
    if (response.ok) {
      const articles = await response.json()
      return articles
    }
  } catch (error) {
    console.warn('Failed to fetch articles from Netlify function:', error)
  }
  // Fallback to static data if Netlify function fails or is not available
  return staticArticles
}

// Function to load blog posts
export async function loadBlogPosts() {
  try {
    const response = await fetch('/.netlify/functions/get-content?type=blog')
    if (response.ok) {
      const blogPosts = await response.json()
      return blogPosts
    }
  } catch (error) {
    console.warn('Failed to fetch blog posts from Netlify function:', error)
  }
  // Fallback to static data if Netlify function fails or is not available
  return staticBlog
}

// Function to load books
export async function loadBooks() {
  try {
    const response = await fetch('/.netlify/functions/get-content?type=books')
    if (response.ok) {
      const books = await response.json()
      return books
    }
  } catch (error) {
    console.warn('Failed to fetch books from Netlify function:', error)
  }
  // Fallback to static data if Netlify function fails or is not available
  return staticBooks
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


