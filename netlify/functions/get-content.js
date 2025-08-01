const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Helper to generate ID from filename
function generateIdFromPath(filename) {
  const name = filename.replace(".md", "");
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function readMarkdownFiles(dirPath, type) {
  const items = [];

  if (!fs.existsSync(dirPath)) return items;

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    try {
      const filePath = path.join(dirPath, file);
      const rawContent = fs.readFileSync(filePath, "utf8");
      const { data, content: markdownContent } = matter(rawContent);

      const id = generateIdFromPath(file);
      const lang = data.language || "en";

      const localized = (enVal, arVal, fallback) => ({
        en: lang === "en" ? enVal : fallback,
        ar: lang === "ar" ? arVal : fallback
      });

      const common = {
        id,
        title: localized(data.title, data.title, `Untitled ${id}`),
        excerpt: localized(data.excerpt, data.excerpt, "Excerpt available in Arabic only"),
        content: localized(markdownContent, markdownContent, "Content available in Arabic only"),
        author: data.author || "ChatAT Team",
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        image: data.image || "/api/placeholder/600/400",
        language: lang,
        tags: data.tags || [],
        featured: false
      };

      if (type === "articles") {
        items.push({ ...common, category: data.category || "Faith" });
      } else if (type === "blog") {
        items.push({ ...common, category: data.category || "Stories" });
      } else if (type === "books") {
        items.push({
          ...common,
          description: localized(data.description, data.description, ""),
          genre: data.genre || "Spiritual",
          audience: data.audience || "General",
          formats: data.formats || ["Physical", "Digital"],
          isbn: data.isbn || ""
        });
      }
    } catch (err) {
      console.warn(`Failed to process file ${file}:`, err.message);
    }
  }

  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const { type, id } = event.queryStringParameters || {};
    const basePath = path.join(__dirname, "..", "..", "src", "data");

    let contentItems = [];
    if (type === "articles") contentItems = readMarkdownFiles(path.join(basePath, "articles"), "articles");
    else if (type === "blog") contentItems = readMarkdownFiles(path.join(basePath, "blog"), "blog");
    else if (type === "books") contentItems = readMarkdownFiles(path.join(basePath, "books"), "books");
    else return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid type parameter" }) };

    if (id) {
      const item = contentItems.find(i => i.id === parseInt(id));
      if (!item) return { statusCode: 404, headers, body: JSON.stringify({ error: `${type} item not found` }) };
      return { statusCode: 200, headers, body: JSON.stringify(item) };
    }

    return { statusCode: 200, headers, body: JSON.stringify(contentItems) };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};
