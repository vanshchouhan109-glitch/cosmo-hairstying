/**
 * Cosmo Hairstyling Rotterdam — Grand Opening Preloader
 *
 * Sequence:
 *  0.0s  → Overlay visible, intro text fades in
 *  0.9s  → Intro text fades out, scissors enter from left
 *  1.1s  → Scissors begin traversal; cut-line grows in sync
 *  2.9s  → Scissors exit right edge
 *  3.0s  → .split class added → halves slide apart
 *  3.9s  → Preloader removed from DOM, scroll restored
 */

(function () {
  'use strict';

  /* ── Build preloader HTML ────────────────────────────────── */
  function buildPreloader() {
    const el = document.createElement('div');
    el.id = 'preloader';
    el.setAttribute('aria-hidden', 'true');

    el.innerHTML = `
      <!-- Top half -->
      <div class="pre-half pre-top">
        <div class="pre-brand">
          <span class="pre-brand-main">Cosmo Hairstyling</span>
          <span class="pre-brand-sub">Rotterdam</span>
        </div>
      </div>

      <!-- Bottom half -->
      <div class="pre-half pre-bottom">
        <div class="pre-brand">
          <span class="pre-brand-main">Cosmo Hairstyling</span>
          <span class="pre-brand-sub">Rotterdam Weena</span>
        </div>
      </div>

      <!-- Intro text (centre, shown before the cut) -->
      <div class="pre-intro-text" id="pre-intro">
        <span class="pre-welcome">Welcome to</span>
        <span class="pre-title">Cosmo <em>Hairstyling</em></span>
        <span class="pre-tagline">Premium Hairstyling in Rotterdam</span>
        <div class="pre-deco">
          <span class="pre-deco-line"></span>
          <span class="pre-deco-dot"></span>
          <span class="pre-deco-line"></span>
        </div>
      </div>

      <!-- Cut line that grows with the scissors -->
      <div class="pre-cut-line" id="pre-cut-line"></div>

      <!-- Scissors icon -->
      <div class="pre-scissors" id="pre-scissors">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Pivot circle -->
          <circle cx="50" cy="50" r="6" fill="#C5A059"/>
          <!-- Upper blade -->
          <path d="M50 50 L8 20" stroke="#C5A059" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="6" cy="18" rx="8" ry="6" fill="none" stroke="#C5A059" stroke-width="3.5" transform="rotate(-30 6 18)"/>
          <!-- Lower blade -->
          <path d="M50 50 L8 80" stroke="#E8D5A3" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="6" cy="82" rx="8" ry="6" fill="none" stroke="#E8D5A3" stroke-width="3.5" transform="rotate(30 6 82)"/>
          <!-- Handle accent lines (upper) -->
          <path d="M50 50 L90 44" stroke="#C5A059" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/>
          <!-- Handle accent lines (lower) -->
          <path d="M50 50 L90 56" stroke="#E8D5A3" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/>
        </svg>
      </div>
    `;

    return el;
  }

  /* ── Timing constants (ms) ───────────────────────────────── */
  const T_HIDE_INTRO    = 900;   // intro text starts fading
  const T_SCISSORS_START = 1100; // scissors begin moving
  const T_CUT_DURATION  = 1800; // how long the cut takes
  const T_SPLIT         = T_SCISSORS_START + T_CUT_DURATION + 100; // halves split
  const T_REMOVE        = T_SPLIT + 900; // DOM removal

  /* ── Main ────────────────────────────────────────────────── */
  function initPreloader() {
    // Lock scroll
    document.body.classList.add('preloading');

    const preloader = buildPreloader();
    document.body.prepend(preloader);

    const intro    = document.getElementById('pre-intro');
    const cutLine  = document.getElementById('pre-cut-line');
    const scissors = document.getElementById('pre-scissors');

    // Get viewport width once scissors are in DOM
    const vw = window.innerWidth;
    const scissorW = scissors.offsetWidth || 80;

    // Start scissors just off-screen left
    scissors.style.transform = `translateY(-50%) translateX(${-scissorW - 10}px)`;
    scissors.style.opacity = '0';

    /* ── Step 1: hide intro text ──────────────────────────── */
    setTimeout(() => {
      intro.classList.add('hidden');
    }, T_HIDE_INTRO);

    /* ── Step 2: animate scissors + cut line together ─────── */
    setTimeout(() => {
      scissors.style.opacity = '1';
      scissors.style.transition = `transform ${T_CUT_DURATION}ms cubic-bezier(0.45, 0, 0.55, 1), opacity 0.25s ease`;

      // Scissors travel from -scissorW to vw + scissorW
      const destination = vw + scissorW + 10;
      scissors.style.transform = `translateY(-50%) translateX(${destination}px)`;

      // Cut line grows in sync using requestAnimationFrame
      const startTime = performance.now();
      const totalWidth = vw;

      function growLine(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / T_CUT_DURATION, 1);
        // ease-in-out curve
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        cutLine.style.width = (eased * totalWidth) + 'px';

        if (progress < 1) {
          requestAnimationFrame(growLine);
        }
      }

      requestAnimationFrame(growLine);

    }, T_SCISSORS_START);

    /* ── Step 3: split the halves ─────────────────────────── */
    setTimeout(() => {
      preloader.classList.add('split');
    }, T_SPLIT);

    /* ── Step 4: remove from DOM ──────────────────────────── */
    setTimeout(() => {
      preloader.remove();
      document.body.classList.remove('preloading');
    }, T_REMOVE);
  }

  /* Run as soon as the script is parsed (before DOMContentLoaded)
     so the overlay is present immediately on paint.             */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }

})();
