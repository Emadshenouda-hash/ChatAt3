const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Helper function to process markdown content
function processMarkdown(content) {
  // For now, we'll return the raw markdown content
  // In a production environment, you might want to process it to HTML
  return content;
}

// Helper function to generate ID from filename
function generateIdFromPath(filename) {
  const name = filename.replace('.md', '');
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Helper function to read markdown files from a directory
function readMarkdownFiles(dirPath, type) {
  const items = [];
  
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory ${dirPath} does not exist`);
      return items;
    }

    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        try {
          const filePath = path.join(dirPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const { data, content: markdownContent } = matter(content);
          
          // Create item based on type
          let item;
          
          if (type === 'articles') {
            item = {
              id: generateIdFromPath(file),
              title: {
                en: data.language === 'en' ? data.title : `Article ${generateIdFromPath(file)}`,
                ar: data.language === 'ar' ? data.title : `مقال ${generateIdFromPath(file)}`
              },
              content: {
                en: data.language === 'en' ? markdownContent : 'Content available in Arabic only',
                ar: data.language === 'ar' ? markdownContent : 'المحتوى متوفر باللغة الإنجليزية فقط'
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
            };
          } else if (type === 'blog') {
            item = {
              id: generateIdFromPath(file),
              title: {
                en: data.language === 'en' ? data.title : `Blog Post ${generateIdFromPath(file)}`,
                ar: data.language === 'ar' ? data.title : `مقال مدونة ${generateIdFromPath(file)}`
              },
              content: {
                en: data.language === 'en' ? markdownContent : 'Content available in Arabic only',
                ar: data.language === 'ar' ? markdownContent : 'المحتوى متوفر باللغة الإنجليزية فقط'
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
            };
          } else if (type === 'books') {
            item = {
              id: generateIdFromPath(file),
              title: {
                en: data.language === 'en' ? data.title : `Book ${generateIdFromPath(file)}`,
                ar: data.language === 'ar' ? data.title : `كتاب ${generateIdFromPath(file)}`
              },
              content: {
                en: data.language === 'en' ? markdownContent : 'Content available in Arabic only',
                ar: data.language === 'ar' ? markdownContent : 'المحتوى متوفر باللغة الإنجليزية فقط'
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
            };
          }
          
          if (item) {
            items.push(item);
          }
        } catch (fileError) {
          console.warn(`Failed to process file ${file}:`, fileError);
        }
      }
    }
    
    // Sort by date (newest first)
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  
  return items;
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { type, id } = event.queryStringParameters || {};
    
    // Get the base path for the source files
    const basePath = path.join(process.cwd(), 'src', 'data');
    
    if (type === 'articles') {
      const articlesPath = path.join(basePath, 'articles');
      const articles = readMarkdownFiles(articlesPath, 'articles');
      
      if (id) {
        const article = articles.find(a => a.id === parseInt(id));
        if (!article) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Article not found' })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(article)
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(articles)
      };
    }
    
    if (type === 'blog') {
      const blogPath = path.join(basePath, 'blog');
      const blogPosts = readMarkdownFiles(blogPath, 'blog');
      
      if (id) {
        const post = blogPosts.find(p => p.id === parseInt(id));
        if (!post) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Blog post not found' })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(post)
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(blogPosts)
      };
    }
    
    if (type === 'books') {
      const booksPath = path.join(basePath, 'books');
      const books = readMarkdownFiles(booksPath, 'books');
      
      if (id) {
        const book = books.find(b => b.id === parseInt(id));
        if (!book) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Book not found' })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(book)
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(books)
      };
    }
    
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid type parameter. Use: articles, blog, or books' })
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

