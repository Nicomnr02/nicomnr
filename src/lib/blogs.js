// ============================================================
// Blog Markdown Loader & Parser
// Loads .md files from src/content/blogs/*.md eagerly via Vite
// ============================================================

/**
 * Parse frontmatter and body from a markdown string
 * @param {string} raw 
 */
export function parseMarkdown(raw) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = raw.match(frontmatterRegex);

  const meta = {
    title: '',
    date: '',
    readTime: '',
    tags: [],
    slug: '',
    excerpt: '',
  };

  let body = raw;

  if (match) {
    const yamlBlock = match[1];
    body = match[2];

    yamlBlock.split(/\r?\n/).forEach(line => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();

        // Handle tags array [a, b, c]
        if (val.startsWith('[') && val.endsWith(']')) {
          meta[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        } else {
          meta[key] = val.replace(/^['"]|['"]$/g, '');
        }
      }
    });
  }

  return {
    meta,
    body: body.trim(),
    html: renderMarkdownToHtml(body.trim())
  };
}

/**
 * Simple, fast Markdown-to-HTML converter
 * Converts headings, code fences, blockquotes, lists, links, bold, and paragraphs
 * @param {string} md 
 */
export function renderMarkdownToHtml(md) {
  let html = md;

  // Code blocks ```lang ... ```
  html = html.replace(/```([a-z0-9_-]*)\r?\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="md-code"><code class="language-${lang}">${escaped.trim()}</code></pre>`;
  });

  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Ordered and Unordered lists
  // Split into lines to cleanly wrap lists
  const lines = html.split(/\r?\n/);
  const out = [];
  let inUl = false;
  let inOl = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code blocks boundary
    if (line.includes('<pre class="md-code">') || line.includes('</pre>')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(line);
      continue;
    }

    // Unordered list item (- item)
    if (/^[-*]\s+(.*)$/.test(line)) {
      const content = line.replace(/^[-*]\s+/, '');
      if (!inUl) { out.push('<ul class="md-ul">'); inUl = true; }
      out.push(`<li>${content}</li>`);
      continue;
    }

    // Ordered list item (1. item)
    if (/^\d+\.\s+(.*)$/.test(line)) {
      const content = line.replace(/^\d+\.\s+/, '');
      if (!inOl) { out.push('<ol class="md-ol">'); inOl = true; }
      out.push(`<li>${content}</li>`);
      continue;
    }

    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }

    // Headings and pre tags pass through
    if (/^<h[1-6]/.test(line) || /^<pre/.test(line)) {
      out.push(line);
    } else if (line.trim().length > 0) {
      out.push(`<p class="md-p">${line}</p>`);
    }
  }

  if (inUl) out.push('</ul>');
  if (inOl) out.push('</ol>');

  return out.join('\n');
}

/**
 * Get all blogs sorted by date descending
 */
export function getAllBlogs() {
  const modules = import.meta.glob('/src/content/blogs/*.md', { query: '?raw', import: 'default', eager: true });
  
  const posts = Object.entries(modules).map(([filepath, content]) => {
    const filename = filepath.split('/').pop().replace('.md', '');
    const { meta, body, html } = parseMarkdown(content);
    return {
      ...meta,
      slug: meta.slug || filename,
      body,
      html,
      raw: content,
    };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

