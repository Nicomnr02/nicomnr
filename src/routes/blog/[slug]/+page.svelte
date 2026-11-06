<script>
  import { PERSON } from '$lib/data.js';
  import AntigravitySprinkles from '$lib/components/AntigravitySprinkles.svelte';

  export let data;
  $: post = data.post;

  function formatDate(dStr) {
    try {
      return new Date(dStr)
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        .toUpperCase();
    } catch (_) { return dStr; }
  }
</script>

<svelte:head>
  <title>{post.title} :: {PERSON.shortName}</title>
  <meta name="description" content={post.excerpt} />
</svelte:head>

<AntigravitySprinkles />

<div class="page-wrap">
  <nav class="top-nav mono">
    <a href="/#blog" class="back-link">&larr; Back to blog</a>
    <a href="/" class="home-link">{PERSON.initials}</a>
  </nav>

  <main class="article-wrap">
    <header class="article-header">
      <div class="post-meta mono mut">
        <span>{formatDate(post.date)}</span>
        <span>&bull;</span>
        <span>{post.readTime}</span>
      </div>

      <h1 class="article-title">{post.title}</h1>

      <div class="blog-chips">
        {#each post.tags as tag}
          <span class="chip-item mono">{tag}</span>
        {/each}
      </div>
    </header>

    <article class="article-content">
      {@html post.html}
    </article>

    <footer class="article-footer">
      <a href="/#blog" class="back-btn mono">&larr; Back to all posts</a>
      <span class="mono mut" style="font-size:12px">&copy; {new Date().getFullYear()} {PERSON.shortName}</span>
    </footer>
  </main>
</div>

<style>
  /* ── Layout ─────────────────────────────────────────────────── */
  .page-wrap {
    min-height: 100vh;
    background: var(--bg);
    color: var(--fg);
  }

  .top-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .75rem 2rem;
    font-size: 13px;
    background: var(--bg);
    border-bottom: 1px solid var(--line);
    backdrop-filter: blur(8px);
  }

  .back-link, .home-link {
    color: var(--mut);
    text-decoration: none;
    transition: color .15s ease;
  }

  .back-link:hover, .home-link:hover {
    color: var(--fg);
  }

  .home-link {
    font-weight: 700;
    font-size: 15px;
    letter-spacing: -.02em;
  }

  /* ── Article ────────────────────────────────────────────────── */
  .article-wrap {
    max-width: 740px;
    margin: 0 auto;
    padding: 3rem 2rem 6rem;
  }

  .article-header {
    margin-bottom: 2.5rem;
  }

  .post-meta {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: .5rem;
    margin-bottom: 1rem;
  }

  .article-title {
    font-size: clamp(2rem, 5.5vw, 3.4rem);
    line-height: 1.08;
    letter-spacing: -.04em;
    font-weight: 800;
    margin: 0 0 1.25rem;
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
    background: var(--card);
    color: var(--mut);
  }

  /* ── Back button ────────────────────────────────────────────── */
  .article-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--line);
  }

  .back-btn {
    display: inline-block;
    border: 1px solid var(--line);
    border-radius: 99px;
    padding: .4rem 1rem;
    font-size: 12px;
    color: var(--fg);
    text-decoration: none;
    background: var(--card);
    transition: background .15s ease, color .15s ease;
  }

  .back-btn:hover {
    background: var(--fg);
    color: var(--bg);
  }

  /* ── Markdown Content ───────────────────────────────────────── */
  :global(.article-content) {
    font-size: 16px;
    line-height: 1.75;
    color: var(--fg);
  }

  :global(.article-content h1.md-h1) {
    font-size: clamp(1.9rem, 4vw, 2.8rem);
    line-height: 1.1;
    letter-spacing: -.03em;
    margin: 2rem 0 1rem;
    font-weight: 800;
  }

  :global(.article-content h2.md-h2) {
    font-size: clamp(1.3rem, 3vw, 1.65rem);
    letter-spacing: -.025em;
    margin: 2.5rem 0 .8rem;
    font-weight: 700;
    border-bottom: 1px solid var(--line);
    padding-bottom: .4rem;
  }

  :global(.article-content h3.md-h3) {
    font-size: 1.15rem;
    margin: 1.8rem 0 .6rem;
    font-weight: 600;
  }

  :global(.article-content p.md-p) {
    margin: 1.1rem 0;
    color: var(--fg);
    max-width: 68ch;
  }

  :global(.article-content .md-ul),
  :global(.article-content .md-ol) {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  :global(.article-content li) {
    margin: .45rem 0;
    max-width: 65ch;
  }

  :global(.article-content .md-inline-code) {
    font-family: var(--mono);
    font-size: 13px;
    background: var(--card);
    padding: .15rem .4rem;
    border-radius: 4px;
    border: 1px solid var(--line);
    color: var(--acc);
  }

  :global(.article-content pre.md-code) {
    font-family: var(--mono);
    font-size: 13px;
    background: #141414;
    color: #e5e5e5;
    padding: 1.4rem;
    border-radius: 10px;
    overflow-x: auto;
    margin: 1.8rem 0;
    border: 1px solid var(--line);
    line-height: 1.55;
  }

  :global(.article-content strong) {
    font-weight: 600;
    color: var(--fg);
  }

  :global(.article-content em) {
    font-style: italic;
    color: var(--mut);
  }

  /* ── Responsive ─────────────────────────────────────────────── */
  @media (max-width: 640px) {
    .article-wrap {
      padding: 2rem 1.1rem 4rem;
    }

    .top-nav {
      padding: .65rem 1.1rem;
    }
  }
</style>

