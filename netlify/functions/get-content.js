const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Generate consistent ID from filename
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

  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} not found.`);
    return items;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    try {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      const id = generateIdFromPath(file);
      const language = data.language || "en";
      const rawTitle = data.title || data.tte || ""; // catch both keys
      const rawImage = data.image || "";

      const item = {
        id,
        title: {
          en: language === "en" ? rawTitle || `Untitled ${id}` : `Article ${id}`,
          ar: language === "ar" ? rawTitle || `بدون عنوان ${id}` : `مقال ${id}`
        },
        content: {
          en: language === "en" ? content : "Content available in Arabic only",
          ar: language === "ar" ? content : "المحتوى متوفر باللغة الإنجليزية فقط"
        },
        excerpt: {
          en: language === "en" ? data.excerpt || "" : "Excerpt available in Arabic only",
          ar: language === "ar" ? data.excerpt || "" : "المقتطف متوفر باللغة الإنجليزية فقط"
        },
        author: data.author || "ChatAT Team",
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        image: rawImage.startsWith("/") ? rawImage : `/images/uploads/${rawImage}`,
        language,
        tags: data.tags || [],
        featured: false
      };

      if (type === "articles") {
        item.category = data.category || "Faith";
      } else if (type === "blog") {
        item.category = data.category || "Stories";
      } else if (type === "books") {
        item.description = data.description || "";
        item.genre = data.genre || "Spiritual";
        item.audience = data.audience || "General";
        item.formats = data.formats || ["Physical", "Digital"];
        item.isbn = data.isbn || "";
      }

      items.push(item);
    } catch (err) {
      console.warn(`Failed to process file: ${file}`, err);
    }
  }

  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

exports.handler = async (event) => {
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

    if (type === "articles") {
      contentItems = readMarkdownFiles(path.join(basePath, "articles"), "articles");
    } else if (type === "blog") {
      contentItems = readMarkdownFiles(path.join(basePath, "blog"), "blog");
    } else if (type === "books") {
      contentItems = readMarkdownFiles(path.join(basePath, "books"), "books");
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid type parameter. Use: articles, blog, or books." })
      };
    }

    if (id) {
      const item = contentItems.find((entry) => entry.id === parseInt(id));
      if (!item) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: `${type} item not found` }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify(item) };
    }

    return { statusCode: 200, headers, body: JSON.stringify(contentItems) };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", details: err.message })
    };
  }
};
