<script>
  import { onMount, tick } from 'svelte';
  import { CONTACT } from '$lib/data.js';
  import { activeSection } from '$lib/stores.js';

  $: isActive = $activeSection === 'contact';

  // ── Reactive values ───────────────────────────────────────────
  let dateStr  = '';
  let jobId    = '';
  let recStr   = '';
  let repStr   = '';

  let topic    = CONTACT.defaultTopic;
  let fuStr    = CONTACT.defaultTopic;

  let statusMsg = CONTACT.statusUnsigned;
  let stStr    = 'Being written';
  let sdStr    = '';

  let signed      = false;
  let stampHit    = false;
  let sendDisabled = false;
  let sendHidden   = false;
  let clearHidden  = false;
  let copyHidden   = true;
  let copyLabel    = 'Keep a copy';
  let msgReadOnly  = false;
  let fromReadOnly = false;
  let sigDisabled  = false;

  // ── Send log (improvement) ────────────────────────────────────
  /** @type {{ time: string; text: string; ok?: boolean }[]} */
  let sendLog = [];
  let showLog = false;

  function logLine(text, ok = null) {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    sendLog = [...sendLog, { time, text, ok }];
  }

  // ── Refs ──────────────────────────────────────────────────────
  let canvasEl;
  let g;        // 2d context
  let dn = false;
  let canvasReady = false;

  let msgVal  = '';
  let fromVal = '';

  // ── Helpers ───────────────────────────────────────────────────
  const fmt = d => d.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).toUpperCase();

  function buildLetter() {
    return `Dear Nico,\n\nRE: ${topic}\n\n${msgVal}\n\nSincerely,\n${fromVal}`;
  }

  // ── Canvas signature pad ──────────────────────────────────────
  // FIX: fitCanvas is now also called reactively when isActive becomes true,
  // ensuring the canvas has real dimensions even if the custom event already fired.
  async function fitCanvas() {
    await tick(); // wait for section.on to be applied and canvas to be visible
    if (!canvasEl) return;
    const r = canvasEl.getBoundingClientRect();
    if (r.width === 0) return; // still hidden — will retry via reactive block
    const dpr = devicePixelRatio || 1;
    canvasEl.width  = r.width  * dpr;
    canvasEl.height = r.height * dpr;
    g = canvasEl.getContext('2d');
    g.scale(dpr, dpr);
    g.lineWidth   = 2;
    g.lineCap     = 'round';
    g.strokeStyle = '#1b1b1b';
    canvasReady = true;
  }

  // Reactive: whenever the section becomes visible and canvas isn't sized yet, fit it.
  $: if (isActive && canvasEl && !canvasReady) fitCanvas();

  function pos(e) {
    const r = canvasEl.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  function onCanvasDown(e) {
    if (!canvasReady) { fitCanvas(); return; }
    dn = true;
    canvasEl.setPointerCapture(e.pointerId);
    const [x, y] = pos(e);
    g.beginPath();
    g.moveTo(x, y);
  }
  function onCanvasMove(e) {
    if (!dn || !canvasReady) return;
    const [x, y] = pos(e);
    g.lineTo(x, y);
    g.stroke();
    if (!signed) {
      signed    = true;
      statusMsg = CONTACT.statusSigned;
      stStr     = 'Signed';
    }
  }
  function onCanvasUp() { dn = false; }

  // ── Contact actions ───────────────────────────────────────────
  function clearForm() {
    if (!g) return;
    g.clearRect(0, 0, canvasEl.width, canvasEl.height);
    signed    = false;
    statusMsg = CONTACT.statusUnsigned;
    stStr     = 'Being written';
    sendLog   = [];
    showLog   = false;
  }

  async function sendForm() {
    if (!msgVal.trim() || !fromVal.trim()) {
      statusMsg = 'ADD YOUR NAME AND A MESSAGE FIRST'; return;
    }
    if (!signed) {
      statusMsg = 'SIGN THE LETTER FIRST'; return;
    }
    sendLog   = [];
    showLog   = Boolean(CONTACT.showSendLog);
    statusMsg    = 'SENDING...';
    sendDisabled = true;
    await deliver(msgVal.trim(), fromVal.trim());
  }

  async function deliver(m, f) {
    logLine('Preparing payload…');

    const payload = {
      access_key: CONTACT.web3formsKey,
      name:       f,
      subject:    `New letter from ${f} :: ${topic} (${jobId})`,
      message:    buildLetter(),
      topic,
      job:        jobId,
    };

    logLine(`POST → api.web3forms.com`);

    let ok = false;
    let errorDetail = '';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      logLine(`HTTP ${res.status} ${res.statusText}`, res.ok);

      let data;
      try {
        data = await res.json();
        logLine(`Response: ${JSON.stringify(data)}`, data?.success);
      } catch (jsonErr) {
        logLine(`Could not parse response body`, false);
      }

      ok = res.ok && Boolean(data?.success);
      if (!ok) errorDetail = data?.message || `HTTP ${res.status}`;

    } catch (networkErr) {
      errorDetail = networkErr?.message || 'Network error';
      logLine(`Network error: ${errorDetail}`, false);
    }

    sendDisabled = false;

    if (ok) {
      logLine('Delivered ✓', true);
      stampIt();
    } else {
      logLine(`Failed — ${errorDetail || 'unknown error'}`, false);
      statusMsg  = `NOT DELIVERED. COPY YOUR LETTER AND EMAIL ${CONTACT.email.toUpperCase()}`;
      copyHidden = false;
      copyLabel  = 'Copy letter';
    }
  }

  function stampIt() {
    sdStr        = fmt(new Date());
    stampHit     = true;
    statusMsg    = 'RECEIVED';
    stStr        = 'Received';
    sendHidden   = true;
    clearHidden  = true;
    copyHidden   = false;
    copyLabel    = 'Keep a copy';
    msgReadOnly  = true;
    fromReadOnly = true;
    sigDisabled  = true;
  }

  async function copyLetter() {
    const t = buildLetter();
    try {
      await navigator.clipboard.writeText(t);
      copyLabel = 'Copied';
    } catch (_) {
      const a = document.createElement('textarea');
      a.value = t;
      document.body.appendChild(a);
      a.select();
      try { document.execCommand('copy'); copyLabel = 'Copied'; } catch (__) {}
      a.remove();
    }
  }

  // ── Mount ─────────────────────────────────────────────────────
  onMount(() => {
    const D   = new Date();
    dateStr   = fmt(D);
    recStr    = fmt(D);
    jobId     = 'NM-' + D.getFullYear() + String(D.getMonth()+1).padStart(2,'0') + String(D.getDate()).padStart(2,'0');
    const R   = new Date(D);
    R.setDate(R.getDate() + 3);
    repStr    = fmt(R);

    // Also handle the custom event for backward compat (e.g. first load on #contact)
    const handler = () => fitCanvas();
    window.addEventListener('fitcanvas', handler);

    fitCanvas();
    const timer = setTimeout(fitCanvas, 60);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (canvasEl && !signed) {
          fitCanvas();
        }
      }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('fitcanvas', handler);
      window.removeEventListener('resize', onResize);
    };
  });
</script>

<section id="contact" class="page-section">
  <h1>Contact</h1>
  <div class="ct">

    <!-- ── Letter ──────────────────────────────────────────────── -->
    <div class="letter">
      <div class="mono">{dateStr}</div>
      <p style="font-size:22px;margin:.8rem 0 0">{CONTACT.greeting}</p>

      <span class="re">RE ::</span>
      <div id="re">
        {#each CONTACT.topics as t}
          <span class="chip">
            <button
              type="button"
              aria-pressed={topic === t}
              on:click={() => { topic = t; fuStr = t; }}
            >{t}</button>
          </span>
        {/each}
      </div>

      <label for="from">FROM ::</label>
      <input
        id="from" type="text"
        placeholder={CONTACT.fromPlaceholder}
        bind:value={fromVal}
        readonly={fromReadOnly}
      >

      <label for="msg">MESSAGE ::</label>
      <textarea
        id="msg"
        placeholder={CONTACT.msgPlaceholder}
        bind:value={msgVal}
        readonly={msgReadOnly}
      ></textarea>

      <p style="margin:1.2rem 0 0">Sincerely,</p>
      <label for="sig">{CONTACT.signLabel}</label>
      <canvas
        id="sig"
        aria-label="Signature pad"
        bind:this={canvasEl}
        style={sigDisabled ? 'pointer-events:none' : ''}
        on:pointerdown={onCanvasDown}
        on:pointermove={onCanvasMove}
        on:pointerup={onCanvasUp}
      ></canvas>

      <div class="stamp" class:hit={stampHit} id="stamp" aria-hidden="true">
        <b>RECEIVED</b>
        <span>{sdStr}</span>
      </div>

      <div class="row">
        <span class="mono" id="state">{statusMsg}</span>
        <div class="row-actions">
          {#if !copyHidden}
            <button type="button" class="lnk" on:click={copyLetter}>{copyLabel}</button>{' '}
          {/if}
          {#if !clearHidden}
            <button type="button" on:click={clearForm}>Clear</button>{' '}
          {/if}
          {#if !sendHidden}
            <button type="button" class="go" disabled={sendDisabled} on:click={sendForm}>
              Send it
            </button>
          {/if}
        </div>
      </div>

      <!-- ── Send log (configured via CONTACT.showSendLog in data.js) ── -->
      {#if CONTACT.showSendLog && showLog && sendLog.length > 0}
        <div class="send-log mono">
          {#each sendLog as entry}
            <div class="log-line" class:log-ok={entry.ok === true} class:log-err={entry.ok === false}>
              <span class="log-time">{entry.time}</span>
              <span class="log-text">{entry.text}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- ── Ticket sidebar ───────────────────────────────────────── -->
    <aside class="ticket" aria-label="Intake ticket">
      <div>{CONTACT.ticketHeader}</div>
      <dl>
        <dt>JOB</dt>    <dd>{jobId || '--'}</dd>
        <dt>RECEIVED</dt><dd>{recStr || '--'}</dd>
        <dt>REPLY BY</dt><dd>{repStr || '--'}</dd>
        <dt>STATUS</dt>  <dd>{stStr}</dd>
        <dt>FILE UNDER</dt><dd>{fuStr}</dd>
      </dl>
      <p class="mut" style="margin-top:1.4rem">
        Email: <a href="mailto:{CONTACT.email}">{CONTACT.email}</a><br>
        Web: <a href="https://nicomnr.my.id">nicomnr.my.id</a>
      </p>
    </aside>
  </div>
</section>

<style>
  /* ── Send log ─────────────────────────────────────────────── */
  .send-log {
    margin-top: 1rem;
    border: 1px dashed #bbb6a8;
    border-radius: 4px;
    padding: .6rem .8rem;
    background: #fffefb;
    font-size: 11px;
    line-height: 1.6;
    color: #6b675e;
    max-height: 160px;
    overflow-y: auto;
  }
  .log-line {
    display: flex;
    gap: .6rem;
  }
  .log-time {
    color: #aaa9a3;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .log-text {
    word-break: break-all;
  }
  .log-ok  .log-text { color: #2a7a4f; }
  .log-err .log-text { color: #b5412a; }
</style>
