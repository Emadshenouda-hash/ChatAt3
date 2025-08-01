import React, { useEffect, useState, useContext } from 'react';
import { LanguageContext } from '@/App';
import { loadBlogPosts } from '@/utils/contentLoader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function Blog() {
  const { language, t } = useContext(LanguageContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await loadBlogPosts();
      setPosts(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredPosts = posts.filter(post => post.language === language);

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-deep-plum mb-8 font-heading">
          {t.nav.blog}
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : filteredPosts.length === 0 ? (
          <p>No blog posts available.</p>
        ) : (
          <ul className="space-y-6">
            {filteredPosts.map(post => (
              <li key={post.id} className="border border-gray-200 p-4 rounded shadow-md">
                <h2 className="text-2xl font-semibold text-sky-teal font-heading">
                  {post.title[language]}
                </h2>
                <p className="text-gray-600 mb-2 text-sm">{post.date} - {post.author}</p>
                <p className="text-gray-800 font-primary mb-4">
                  {post.excerpt[language]}
                </p>
                <Link to={`/blog/${post.id}`}>
                  <Button className="bg-serene-blue text-white hover:bg-deep-plum font-primary">
                    {language === 'en' ? 'Read More' : 'اقرأ المزيد'}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Blog;
