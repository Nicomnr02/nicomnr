<script>
  import '../app.css';
  import { PERSON, NAV_LINKS, PAGE_TITLES } from '$lib/data.js';
  import { activeSection } from '$lib/stores.js';
  import { onMount } from 'svelte';

  // ── State ───────────────────────────────────────────────────
  let clock = 'UT::--:--';
  const MODES = ['system', 'light', 'dark'];
  let mi = 0;
  let menuOpen = false;
  let currentSec = 'me';

  function toggleMenu() {
    menuOpen = !menuOpen;
  }
  function closeMenu() {
    menuOpen = false;
  }

  // ── Clock ───────────────────────────────────────────────────
  function tickClock() {
    const d = new Date();
    clock = 'UT::' + d.toISOString().slice(11, 16);
  }

  // ── Theme ───────────────────────────────────────────────────
  function applyTheme() {
    const m = MODES[mi];
    if (m === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.dataset.theme = m;
    }
    window.dispatchEvent(new CustomEvent('themechange'));
  }
  function cycleTheme() {
    mi = (mi + 1) % MODES.length;
    try { localStorage.setItem('theme', MODES[mi]); } catch (_) {}
    applyTheme();
  }
  $: themeLabel = 'Theme: ' + MODES[mi];

  // ── Navigation & Section Spy ────────────────────────────────
  $: navTag = currentSec[0].toUpperCase() + currentSec.slice(1);

  function scrollToSection(e, href) {
    e.preventDefault();
    closeMenu();
    const id = href.replace(/^#/, '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      try {
        history.pushState(null, '', href);
      } catch (_) {}
      currentSec = id;
      activeSection.set(id);
      document.title = PAGE_TITLES[id] || PAGE_TITLES.me;
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && menuOpen) {
      closeMenu();
    }
  }

  const SECTIONS = ['me', 'lab', 'education', 'blog', 'contact'];
  let observer;

  onMount(() => {
    try { mi = Math.max(0, MODES.indexOf(localStorage.getItem('theme'))); } catch (_) {}
    applyTheme();
    tickClock();
    const timer = setInterval(tickClock, 30000);
    window.addEventListener('keydown', handleKeydown);

    // Scroll spy & emerge observer for the melded long page
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (SECTIONS.includes(id)) {
            currentSec = id;
            activeSection.set(id);
            document.title = PAGE_TITLES[id] || PAGE_TITLES.me;
          }
          entry.target.classList.add('emerged');

          if (id === 'education') {
            window.dispatchEvent(new CustomEvent('educationenter'));
          }
          if (id === 'me') {
            window.dispatchEvent(new CustomEvent('drawlines'));
          }
          if (id === 'contact') {
            window.dispatchEvent(new CustomEvent('fitcanvas'));
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-10% 0px -40% 0px',
      threshold: 0.05
    });

    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Immediately reveal any sections already in the viewport on mount
    // (handles browser Back navigation where sections are already scrolled into view)
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        el.classList.add('emerged');
        currentSec = id;
        activeSection.set(id);
        document.title = PAGE_TITLES[id] || PAGE_TITLES.me;
      }
    });

    // Check if initial URL has hash or path to scroll to
    const initialHash = window.location.hash ? window.location.hash.slice(1) : (window.location.pathname.replace(/^\//, '') || 'me');
    if (SECTIONS.includes(initialHash)) {
      currentSec = initialHash;
      const el = document.getElementById(initialHash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    }

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeydown);
      if (observer) observer.disconnect();
    };
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=IBM+Plex+Mono:wght@400;500&display=swap"
  >
  <meta
    name="description"
    content="Backend-leaning software engineer in Jakarta. Notification pipelines, approval flows and payment services in Go."
  >
</svelte:head>

<!-- Hidden SVG filter for contact stamp -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="rough">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" result="n"/>
    <feColorMatrix in="n" type="matrix"
      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75" result="m"/>
    <feComposite in="SourceGraphic" in2="m" operator="in"/>
  </filter>
</svg>

<div class="bar mono">
  <span id="clock">{clock}</span>
  <span>{PERSON.locationShort}</span>
  <span>{PERSON.status}</span>
</div>

<nav>
  <a class="logo" href="#me" on:click={(e) => scrollToSection(e, '#me')}>
    {PERSON.initials}<small class="mono mut" style="margin-left:.5rem;font-weight:400">{navTag}</small>
  </a>

  <!-- Desktop Navigation Menu -->
  <ul class="nav-desktop">
    {#each NAV_LINKS as link}
      <li>
        <a
          href={link.href}
          aria-current={currentSec === link.href.replace(/^#/, '') ? 'page' : undefined}
          on:click={(e) => scrollToSection(e, link.href)}
        >{link.label}</a>
      </li>
    {/each}
    <li>
      <button class="mono theme-btn" aria-label="Change theme" on:click={cycleTheme}>
        {themeLabel}
      </button>
    </li>
  </ul>

  <!-- Modern Mobile Hamburger Button -->
  <button
    type="button"
    class="burger-btn"
    class:open={menuOpen}
    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
    aria-expanded={menuOpen}
    on:click={toggleMenu}
  >
    <span class="burger-line top"></span>
    <span class="burger-line mid"></span>
    <span class="burger-line bot"></span>
  </button>
</nav>

<!-- Modern Mobile Menu Drawer -->
{#if menuOpen}
  <div
    class="mobile-backdrop"
    on:click={closeMenu}
    role="presentation"
  ></div>

  <div class="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
    <div class="mobile-menu-header">
      <span class="mono mut">Navigation</span>
      <button class="mono theme-btn mobile-theme-btn" aria-label="Change theme" on:click={cycleTheme}>
        {themeLabel}
      </button>
    </div>
    <ul class="mobile-nav-links">
      {#each NAV_LINKS as link}
        <li>
          <a
            href={link.href}
            class:active={currentSec === link.href.replace(/^#/, '')}
            aria-current={currentSec === link.href.replace(/^#/, '') ? 'page' : undefined}
            on:click={(e) => scrollToSection(e, link.href)}
          >
            <span>{link.label}</span>
            <span class="link-arrow">&rarr;</span>
          </a>
        </li>
      {/each}
    </ul>
    <div class="mobile-menu-footer mono mut">
      <span>{PERSON.locationShort}</span>
      <span>•</span>
      <span>{PERSON.status}</span>
    </div>
  </div>
{/if}

<main>
  <slot />
</main>
