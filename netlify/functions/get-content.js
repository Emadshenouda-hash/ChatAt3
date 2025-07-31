const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Helper function to generate ID from filename
function generateIdFromPath(filename) {
  const name = filename.replace(".md", "");
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
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
      if (file.endsWith(".md")) {
        try {
          const filePath = path.join(dirPath, file);
          const content = fs.readFileSync(filePath, "utf8");
          const { data, content: markdownContent } = matter(content);

          const language = data.language || "en";
          const id = generateIdFromPath(file);

          const commonFields = {
            id,
            title: data.title || `Untitled ${id}`,
            content: markdownContent,
            excerpt: data.excerpt || "",
            author: data.author || "ChatAT Team",
            date: data.date ? new Date(data.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            image: data.image || "/api/placeholder/600/400",
            language,
            tags: data.tags || [],
            featured: false
          };

          if (type === "articles") {
            items.push({
              ...commonFields,
              category: data.category || "Faith"
            });
          } else if (type === "blog") {
            items.push({
              ...commonFields,
              category: data.category || "Stories"
            });
          } else if (type === "books") {
            items.push({
              ...commonFields,
              description: data.description || "",
              genre: data.genre || "Spiritual",
              audience: data.audience || "General",
              formats: data.formats || ["Physical", "Digital"],
              isbn: data.isbn || ""
            });
          }
        } catch (fileError) {
          console.warn(`Failed to process file ${file}:`, fileError);
        }
      }
    }

    items.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return items;
}

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
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
        body: JSON.stringify({ error: "Invalid type parameter. Use: articles, blog, or books" })
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
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};
