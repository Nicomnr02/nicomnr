<script>
  import { onMount } from 'svelte';
  import { EXPERIENCES } from '$lib/data.js';
  import { activeSection } from '$lib/stores.js';

  // ── View state ───────────────────────────────────────────────
  let view = 'wheel';
  let rot  = 0;
  let tgt  = 0;
  let last = null;
  let idle;
  let px, py, drag = 0, moved = 0;
  let dialogEl;
  let itemsEl;
  let dialogContent = null; // { x } when open

  $: isActive = $activeSection === 'lab';

  // ── Wheel animation loop ─────────────────────────────────────
  function spinLoop() {
    rot += (tgt - rot) * 0.12;
    if (Math.abs(tgt - rot) < 0.05) rot = tgt;
    if (rot !== last) {
      last = rot;
      const ring = document.getElementById('ring');
      if (ring) ring.style.setProperty('--rot', rot + 'deg');
    }
    requestAnimationFrame(spinLoop);
  }

  function nudge(d) {
    tgt += d;
    clearTimeout(idle);
    idle = setTimeout(() => { tgt = Math.round(tgt / 72) * 72; }, 160);
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
    if (view !== 'wheel' || $activeSection !== 'lab' || dialogEl?.open) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nudge(-72); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); nudge(72);  }
  }

  // ── Pointer drag on wheel ─────────────────────────────────────
  function onPointerMove(e) {
    if (!drag) return;
    const dx = e.clientX - px, dy = e.clientY - py;
    px = e.clientX; py = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    nudge((dx + dy) * 0.35);
  }
  function onPointerUp() { drag = 0; }

  onMount(() => {
    requestAnimationFrame(spinLoop);
    window.addEventListener('keydown',      onKeyDown);
    window.addEventListener('pointermove',  onPointerMove);
    window.addEventListener('pointerup',    onPointerUp);
    return () => {
      window.removeEventListener('keydown',      onKeyDown);
      window.removeEventListener('pointermove',  onPointerMove);
      window.removeEventListener('pointerup',    onPointerUp);
    };
  });
</script>

<section id="lab" class:on={isActive} class:in={isActive}>
  <h1>Lab, work experience</h1>

  <!-- View selector -->
  <div class="tools" role="group" aria-label="View">
    {#each ['list','wheel','grid'] as v}
      <button
        data-v={v}
        aria-pressed={view === v}
        on:click={() => setView(v)}
      >{v[0].toUpperCase() + v.slice(1)}</button>
    {/each}
  </div>

  <!-- Items container -->
  <div
    role="region"
    aria-label="Work experience items"
    class="items {view}"
    bind:this={itemsEl}
    on:wheel|preventDefault={e => { if (view !== 'wheel') return; nudge(-(e.deltaX + e.deltaY) * 0.25); }}
    on:pointerdown={e => { if (view !== 'wheel') return; drag = 1; moved = 0; px = e.clientX; py = e.clientY; }}
    on:keydown={e => { if (view !== 'wheel') return; if (e.key === 'ArrowRight') nudge(-72); if (e.key === 'ArrowLeft') nudge(72); }}
    on:click|capture={e => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved = 0; } }}
  >
    {#if view === 'wheel'}
      <div class="ring" id="ring">
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
    {:else if view === 'grid'}
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
    {:else}
      <!-- list view -->
      {#each EXPERIENCES as x, i}
        <button class="it" on:click={() => openDialog(i)}>
          <span>{x.t}{#if x.now}<span class="badge">Now</span>{/if}</span>
          <small>{x.tag}<br>{x.when}</small>
        </button>
      {/each}
    {/if}
  </div>

  <!-- Wheel nav controls -->
  {#if view === 'wheel'}
    <div class="tools" id="wh">
      <button aria-label="Previous" on:click={() => nudge(72)}>Prev</button>
      <button aria-label="Next"     on:click={() => nudge(-72)}>Next</button>
      <span class="mono mut" style="align-self:center;margin-left:.6rem">
        Scroll, drag or use the arrow keys
      </span>
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
