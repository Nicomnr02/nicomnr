<script>
  import { onMount } from 'svelte';
  import { PERSON, DB_TABLES, FK_ROW_IDS } from '$lib/data.js';
  import { activeSection } from '$lib/stores.js';

  let svgEl;    // the <svg id="lines"> element
  let cvEl;     // the .cv container

  // ── Draw relation lines ──────────────────────────────────────
  function draw() {
    if (!svgEl) return;
    const pk = document.getElementById('person.id');
    if (!pk || !pk.offsetWidth) return;
    const col = getComputedStyle(document.documentElement)
      .getPropertyValue('--acc').trim();
    let s = '';
    FK_ROW_IDS.forEach(id => {
      const f = document.getElementById(id);
      if (!f) return;
      const ftb = f.closest('.tb');
      const ptb = pk.closest('.tb');
      const left = ftb.offsetLeft + ftb.offsetWidth / 2 < ptb.offsetLeft + ptb.offsetWidth / 2;
      const a = anchor(f, left ? 'r' : 'l');
      const b = anchor(pk, left ? 'l' : 'r');
      const dx = Math.max(50, Math.abs(a.x - b.x) / 2);
      const sa = left ? 1 : -1;
      s += `<path d="M${a.x} ${a.y} C${a.x+sa*dx} ${a.y} ${b.x-sa*dx} ${b.y} ${b.x} ${b.y}" fill="none" stroke="${col}" stroke-width="1.5"/>` +
           `<circle cx="${a.x}" cy="${a.y}" r="3.5" fill="${col}"/>` +
           `<circle cx="${b.x}" cy="${b.y}" r="3.5" fill="${col}"/>`;
    });
    svgEl.innerHTML = s;
  }

  function anchor(row, side) {
    const t = row.closest('.tb');
    return {
      x: t.offsetLeft + (side === 'r' ? t.offsetWidth : 0),
      y: t.offsetTop + row.offsetTop + row.offsetHeight / 2,
    };
  }

  // ── Draggable tables ─────────────────────────────────────────
  function makeDraggable(el) {
    const h = el.querySelector('h3');
    let ox, oy, on = false;
    h.onpointerdown = e => {
      on = true;
      ox = e.clientX - el.offsetLeft;
      oy = e.clientY - el.offsetTop;
      h.setPointerCapture(e.pointerId);
    };
    h.onpointermove = e => {
      if (!on) return;
      el.style.left = Math.max(0, Math.min(cvEl.clientWidth  - el.offsetWidth,  e.clientX - ox)) + 'px';
      el.style.top  = Math.max(0, Math.min(cvEl.clientHeight - el.offsetHeight, e.clientY - oy)) + 'px';
      draw();
    };
    h.onpointerup = () => on = false;
  }

  onMount(() => {
    // Set initial positions from data
    DB_TABLES.forEach(tb => {
      const el = document.getElementById(tb.id);
      if (el) {
        el.style.left = tb.x + 'px';
        el.style.top  = tb.y + 'px';
        makeDraggable(el);
      }
    });

    draw();
    requestAnimationFrame(() => draw());

    window.addEventListener('drawlines',   draw);
    window.addEventListener('themechange', draw);
    return () => {
      window.removeEventListener('drawlines',   draw);
      window.removeEventListener('themechange', draw);
    };
  });
</script>

<section id="me" class="page-section emerged">
  <h1>{PERSON.shortName}, {PERSON.title}</h1>
  <p class="lede">{PERSON.lede}</p>

  <div class="wrap">
    <div class="cv" id="cv" bind:this={cvEl}>
      <svg id="lines" width="1020" height="660" bind:this={svgEl}></svg>

      {#each DB_TABLES as tb}
        <div
          class="tb"
          class:wide={tb.wide}
          id={tb.id}
          style="--c:{tb.color}"
        >
          <h3>{tb.label}</h3>
          {#each tb.rows as row}
            <div class="r" id={row.id ?? undefined}>
              <b>
                {row.key}
                {#if row.tag}<em>{row.tag}</em>{/if}
              </b>
              <i>
                {#if row.isEmail}
                  <a href="mailto:{row.value}">{row.value}</a>
                {:else if row.isLink}
                  <a href={row.href}>{row.value}</a>
                {:else}
                  {row.value}
                {/if}
              </i>
            </div>
          {/each}
          {#if tb.note}
            <div class="note">{tb.note}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <p class="hint mono mut">
    <span class="desktop-hint">experience.person_id, education.person_id and skill.person_id all reference person.id</span>
    <span class="mobile-hint">Scroll diagram horizontally to explore &bull; Drag headers to rearrange</span>
  </p>
</section>
