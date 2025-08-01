// src/pages/Articles.jsx
import React, { useEffect, useState, useContext } from 'react'
import { LanguageContext } from '@/App'
import { loadArticles } from '@/utils/contentLoader'
import DynamicContentList from '@/components/DynamicContentList'

export default function ArticlesPage() {
  const { language, t } = useContext(LanguageContext)
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetchContent() {
      const data = await loadArticles()
      setItems(data)
    }
    fetchContent()
  }, [])

  return <DynamicContentList t={t} type="Articles" loadFunction={loadArticles} language={language} />
}
