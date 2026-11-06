<script>
  import { onMount } from 'svelte';
  import { EXPERIENCES } from '$lib/data.js';

  // ── View state ───────────────────────────────────────────────
  // Default to 'slider' with middle card (#3, index 2) active
  let view = 'slider';
  let currentIndex = 2; // 0=Card 1, 1=Card 2, 2=Card 3, 3=Card 4, 4=Card 5
  const TOTAL_ITEMS = EXPERIENCES.length;

  let dialogEl;
  let dialogContent = null;

  // Touch / pointer drag handling
  let startX = 0;
  let isDragging = false;
  let dragDelta = 0;

  function goToIndex(idx) {
    if (idx >= 0 && idx < TOTAL_ITEMS) {
      currentIndex = idx;
    }
  }

  function nextCard() {
    if (currentIndex < TOTAL_ITEMS - 1) {
      currentIndex += 1;
    }
  }

  function prevCard() {
    if (currentIndex > 0) {
      currentIndex -= 1;
    }
  }

  function handleCardClick(i) {
    if (Math.abs(dragDelta) > 10) return; // Ignore drag clicks
    if (currentIndex === i) {
      // Center card clicked -> open details dialog
      openDialog(i);
    } else {
      // Side card clicked -> slide to center
      goToIndex(i);
    }
  }

  // ── Open detail dialog ────────────────────────────────────────
  function openDialog(i) {
    dialogContent = EXPERIENCES[i];
    dialogEl.showModal();
  }
  function closeDialog() { dialogEl.close(); }

  // ── View switching ───────────────────────────────────────────
  function setView(v) {
    view = v;
  }

  // ── Keyboard ─────────────────────────────────────────────────
  function onKeyDown(e) {
    if (view !== 'slider' || dialogEl?.open) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nextCard(); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); prevCard(); }
  }

  // ── Horizontal wheel scroll (immediate, no delay) ────────────
  let hScrollAccum = 0;
  let lastScrollTime = 0;

  function onWheel(e) {
    if (view !== 'slider') return;

    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);

    if (isHorizontal) {
      e.preventDefault();
      const now = performance.now();
      hScrollAccum += e.deltaX;

      // Clean, immediate card transition without sluggish delay
      if (Math.abs(hScrollAccum) >= 12 && now - lastScrollTime > 70) {
        lastScrollTime = now;
        if (hScrollAccum > 0) {
          nextCard();
        } else {
          prevCard();
        }
        hScrollAccum = 0;
      }
    }
    // Vertical scroll (e.deltaY): do not preventDefault so natural page scrolling is preserved!
  }

  // ── Pointer drag on slider ────────────────────────────────────
  function onPointerDown(e) {
    if (view !== 'slider') return;
    isDragging = true;
    startX = e.clientX;
    dragDelta = 0;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    dragDelta = e.clientX - startX;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    if (dragDelta < -40) {
      nextCard();
    } else if (dragDelta > 40) {
      prevCard();
    }
    setTimeout(() => { dragDelta = 0; }, 50);
  }

  onMount(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  });
</script>

<section id="lab" class="page-section">
  <h1>Lab, work experience</h1>

  <!-- View selector -->
  <div class="tools" role="group" aria-label="View">
    {#each ['list', 'slider', 'grid'] as v}
      <button
        data-v={v}
        aria-pressed={view === v}
        on:click={() => setView(v)}
      >{v[0].toUpperCase() + v.slice(1)}</button>
    {/each}
  </div>

  <!-- Items container -->
  {#if view === 'slider'}
    <!-- Coverflow Perspective Slider matching 1 2 3 4 5 fanned layout -->
    <div
      class="slider-view"
      on:wheel={onWheel}
      on:pointerdown={onPointerDown}
      on:pointermove={onPointerMove}
      role="region"
      aria-label="Work experience slider"
    >
      <div class="slider-track">
        {#each EXPERIENCES as x, i}
          {@const offset = i - currentIndex}
          <button
            type="button"
            class="slider-card"
            data-offset={offset}
            style="--h:{x.h};"
            aria-label="{x.t} - Card {i + 1}"
            on:click={() => handleCardClick(i)}
          >
            <div class="p">
              <span class="card-abbr">{x.ab}</span>
              <span class="card-seq">0{i + 1}</span>
            </div>
            <div class="t">
              <div class="title-row">
                <strong>{x.t}</strong>
                {#if x.now}<span class="badge">Now</span>{/if}
              </div>
              <small>{x.tag} &bull; {x.when}</small>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <!-- Dots Navigation Indicator -->
    <div class="slider-dots" role="tablist" aria-label="Slider navigation dots">
      {#each EXPERIENCES as _, i}
        <button
          type="button"
          class="slider-dot"
          class:active={i === currentIndex}
          role="tab"
          aria-selected={i === currentIndex}
          aria-label="Go to card {i + 1}"
          on:click={() => goToIndex(i)}
        ></button>
      {/each}
    </div>

    <!-- Slider nav controls -->
    <div class="tools" id="wh">
      <button aria-label="Previous card" on:click={prevCard} disabled={currentIndex === 0}>Prev</button>
      <button aria-label="Next card" on:click={nextCard} disabled={currentIndex >= TOTAL_ITEMS - 1}>Next</button>
      <span class="mono mut" style="align-self:center;margin-left:.6rem">
        Card {currentIndex + 1} of {TOTAL_ITEMS} &bull; Click card for details
      </span>
    </div>
  {:else if view === 'grid'}
    <div class="items grid" role="region" aria-label="Work experience items">
      {#each EXPERIENCES as x, i}
        <button
          class="it"
          style="--h:{x.h};--i:{i}"
          on:click={() => openDialog(i)}
        >
          <span class="p">{x.ab}</span>
          <span class="t">
            <span>{x.t}</span>
            <small>{x.tag}{#if x.now}<span class="badge">Now</span>{/if}</small>
          </span>
        </button>
      {/each}
    </div>
  {:else}
    <!-- list view -->
    <div class="items list" role="region" aria-label="Work experience items">
      {#each EXPERIENCES as x, i}
        <button class="it" on:click={() => openDialog(i)}>
          <span>{x.t}{#if x.now}<span class="badge">Now</span>{/if}</span>
          <small>{x.tag}<br>{x.when}</small>
        </button>
      {/each}
    </div>
  {/if}

  <!-- Detail dialog -->
  <dialog bind:this={dialogEl} on:click={e => { if (e.target === dialogEl) closeDialog(); }}>
    {#if dialogContent}
      {@const x = dialogContent}
      <p class="mono mut">{x.when} :: {x.loc}</p>
      <h2>{x.t}</h2>
      <p class="mut">{x.role}</p>
      <ul>
        {#each x.pts as pt}<li>{pt}</li>{/each}
      </ul>
      <div class="chips">
        {#each x.st as s}<span>{s}</span>{/each}
      </div>
      <div class="row">
        <span></span>
        <button type="button" on:click={closeDialog}>Close</button>
      </div>
    {/if}
  </dialog>
</section>
