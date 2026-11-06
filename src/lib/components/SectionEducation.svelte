<script>
  import { onMount } from 'svelte';
  import { EDUCATION } from '$lib/data.js';
  import { activeSection } from '$lib/stores.js';

  $: isActive = $activeSection === 'education';

  let cards = [];

  let swung = false;

  function doSwing() {
    if (swung) return;
    swung = true;
    cards.forEach(c => {
      if (!c) return;
      c.classList.add('swing');
      c.addEventListener('animationend', () => c.classList.remove('swing'), { once: true });
    });
  }

  // Swing animation triggered when the section scrolls into view
  onMount(() => {
    window.addEventListener('educationenter', doSwing);
    return () => window.removeEventListener('educationenter', doSwing);
  });
</script>

<section id="education" class="page-section">
  <h1>Education</h1>
  <div class="edu">
    {#each EDUCATION as edu, i}
      <a
        class="pass"
        href={edu.url}
        target="_blank"
        rel="noopener"
        title={edu.title}
        bind:this={cards[i]}
      >
        <i class="lan"></i>
        <i class="clip"></i>
        <div class="frame">
          <div class="card">
            <div class="top">
              <span>Education pass</span>
              <span>{edu.year}</span>
            </div>
            <div class="tile" aria-hidden="true">{edu.abbr}</div>
            <div class="who">
              <strong>{edu.name}</strong>
              <em>{edu.degree}</em>
            </div>
            <div class="foot">
              <span>{edu.score}</span>
              <span>{edu.period}</span>
            </div>
          </div>
        </div>
      </a>
    {/each}
  </div>
</section>
