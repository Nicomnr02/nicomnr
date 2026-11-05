<script>
  import { onMount } from 'svelte';
  import { EDUCATION } from '$lib/data.js';
  import { activeSection } from '$lib/stores.js';

  $: isActive = $activeSection === 'education';

  let cards = [];

  // Swing animation triggered once when the section is first entered
  onMount(() => {
    window.addEventListener('educationenter', () => {
      cards.forEach(c => {
        if (!c) return;
        c.classList.add('swing');
        c.addEventListener('animationend', () => c.classList.remove('swing'), { once: true });
      });
    });
  });
</script>

<section id="education" class:on={isActive} class:in={isActive}>
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
