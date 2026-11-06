<script>
  import { getAllBlogs } from '$lib/blogs.js';

  const blogs = getAllBlogs();

  function formatDate(dStr) {
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    } catch (_) {
      return dStr;
    }
  }
</script>

<section id="blog" class="page-section">
  <h1>Blog &amp; Writing</h1>
  <p class="lede">
    Architectural notes, engineering trade-offs, and lessons learned from building backend pipelines and scalable systems.
  </p>

  <div class="blog-list">
    {#each blogs as post}
      <a class="blog-card" href="/blog/{post.slug}">
        <div class="card-meta mono mut">
          <span>{formatDate(post.date)}</span>
          <span class="meta-dot">&bull;</span>
          <span>{post.readTime}</span>
        </div>

        <h2 class="card-title">
          <span>{post.title}</span>
          <span class="title-arrow">&rarr;</span>
        </h2>

        <p class="card-excerpt">
          {post.excerpt}
        </p>

        <div class="blog-chips">
          {#each post.tags as tag}
            <span class="chip-item mono">{tag}</span>
          {/each}
        </div>
      </a>
    {/each}
  </div>
</section>

<style>
  /* ── Blog List Styles ───────────────────────────────────────── */
  .blog-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .blog-card {
    display: block;
    text-decoration: none;
    color: inherit;
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 1.6rem;
    background: var(--card);
    cursor: pointer;
    transition: transform .2s cubic-bezier(.2, .7, .2, 1), border-color .2s ease, box-shadow .2s ease;
  }

  .blog-card:hover {
    transform: translateY(-2px);
    border-color: var(--fg);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .card-meta {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: .5rem;
    margin-bottom: .6rem;
  }

  .meta-dot {
    opacity: 0.5;
  }

  .card-title {
    font-size: clamp(1.4rem, 3.5vw, 1.9rem);
    letter-spacing: -.03em;
    font-weight: 700;
    line-height: 1.15;
    margin: 0 0 .8rem;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
  }

  .title-arrow {
    color: var(--mut);
    font-family: var(--mono);
    font-size: 1.2rem;
    transition: transform .2s ease, color .2s ease;
    flex-shrink: 0;
  }

  .blog-card:hover .title-arrow {
    transform: translateX(4px);
    color: var(--acc);
  }

  .card-excerpt {
    color: var(--mut);
    font-size: 15px;
    line-height: 1.6;
    margin: 0 0 1.2rem;
    max-width: 68ch;
  }

  .blog-chips {
    display: flex;
    flex-wrap: wrap;
    gap: .4rem;
  }

  .chip-item {
    font-size: 11px;
    padding: .15rem .6rem;
    border-radius: 99px;
    border: 1px solid var(--line);
    background: var(--bg);
    color: var(--mut);
  }
</style>
