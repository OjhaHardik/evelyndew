/* Evelyn Dew motion layer: intro loader, smooth scroll, page transitions and
   scroll choreography, on GSAP 3.13 (ScrollTrigger, SplitText) and Lenis.
   Progressive by design: without this file (or with reduced motion) the site is
   complete and still. Every animation here answers one of: a page arriving, a
   section entering, or the logo explaining itself. */
(function () {
  'use strict';

  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const loader = $('[data-loader]');
  const curtain = $('[data-curtain]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const libs = window.gsap && window.ScrollTrigger && window.SplitText;

  function standDown() {
    root.classList.remove('is-intro', 'is-entering');
    root.classList.add('motion-ready');
    if (loader) loader.remove();
    try { sessionStorage.setItem('ed-intro', '1'); } catch (e) { /* private mode */ }
  }
  if (reduced || !libs) { standDown(); return; }

  const { gsap, ScrollTrigger, SplitText } = window;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const headerH = () => parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 72;

  /* ---------------------------------------------------------------- Smooth scroll */
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -headerH() }
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener('ed:lock', () => lenis && lenis.stop());
  document.addEventListener('ed:unlock', () => lenis && lenis.start());
  window.EDMotion = {
    scrollTo(target) {
      if (lenis) lenis.scrollTo(target, { offset: -(headerH() + 24) });
      else target.scrollIntoView({ block: 'start' });
    }
  };

  /* ---------------------------------------------------------------- Initial states
     GSAP takes over the hidden states before .motion-ready lifts the CSS failsafe,
     so nothing flashes between the two. */
  const reveals = $$('[data-reveal]');
  const heroIn = $$('[data-hero-in]');
  const heroTitle = $('[data-hero-title]');
  const splits = $$('[data-split]');
  const clips = $$('[data-clip]');
  const setIf = (els, vars) => { if (els.length) gsap.set(els, vars); };
  setIf(reveals, { autoAlpha: 0, y: 40 });
  setIf(heroIn, { autoAlpha: 0, y: 30 });
  setIf([heroTitle, ...splits].filter(Boolean), { autoAlpha: 0 });
  setIf(clips, { clipPath: 'inset(100% 0% 0% 0%)' });
  root.classList.add('motion-ready');

  const fontsReady = () => (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, wait(2500)]) : Promise.resolve());

  /* ---------------------------------------------------------------- Intro loader (first view of a session) */
  function heroAssetReady() {
    const film = $('[data-hero-video]');
    if (film && film.getAttribute('src') && film.readyState < 3) {
      return new Promise((r) => {
        film.addEventListener('canplay', r, { once: true });
        film.addEventListener('error', r, { once: true });
      });
    }
    const artEl = $('[data-pdp-art]');
    if (artEl) {
      const m = /url\(["']?([^"')]+)/.exec(artEl.style.backgroundImage);
      if (m) return new Promise((r) => { const im = new Image(); im.onload = im.onerror = r; im.src = m[1]; });
    }
    return Promise.resolve();
  }

  function intro() {
    if (!loader || !root.classList.contains('is-intro')) {
      if (loader) loader.remove();
      return Promise.resolve();
    }
    loader.style.animation = 'none'; // the scripts are here; retire the CSS failsafe
    if (lenis) lenis.stop();
    root.style.overflow = 'hidden';

    const markSvg = $('.loader__mark', loader);
    const symbol = document.getElementById('mark');
    if (symbol) markSvg.replaceChildren(...[...symbol.children].map((n) => n.cloneNode(true)));
    const paths = $$('path', markSvg);
    paths.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    gsap.set(paths, { fillOpacity: 0, stroke: 'currentColor', strokeWidth: 0.6 });
    const word = $('.loader__word', loader);
    gsap.set(word, { clipPath: 'inset(0% 100% 0% 0%)' });
    const count = $('[data-loader-count]', loader);
    const bar = $('[data-loader-bar]', loader);
    const prog = { v: 0 };
    const render = () => {
      count.textContent = Math.round(prog.v * 100);
      bar.style.transform = `scaleX(${prog.v})`;
    };

    // the drop draws itself, fills, and the wordmark is unveiled beside the count
    gsap.timeline()
      .to(paths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.14 }, 0.15)
      .to(paths, { fillOpacity: 1, duration: 0.8, ease: 'power1.out' }, 1.3)
      .to(paths, { strokeOpacity: 0, duration: 0.5 }, 1.6)
      .to(word, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }, 1.05);
    const crawl = gsap.to(prog, { v: 0.9, duration: 2, ease: 'power2.out', onUpdate: render });

    return new Promise((resolve) => {
      const ready = Promise.all([fontsReady(), heroAssetReady(), wait(2200)]);
      Promise.race([ready, wait(4500)]).then(() => {
        crawl.kill();
        gsap.to(prog, { v: 1, duration: 0.55, ease: 'power2.inOut', onUpdate: render, onComplete: exit });
      });
      function exit() {
        // the film has been playing behind the panel; start it from its first shot as the page is revealed
        const film = $('[data-hero-video]');
        if (film && !film.paused) { try { film.currentTime = 0; } catch (e) { /* not seekable yet */ } }
        gsap.timeline({
          onComplete() {
            loader.remove();
            root.classList.remove('is-intro');
            root.style.overflow = '';
            if (lenis) lenis.start();
            try { sessionStorage.setItem('ed-intro', '1'); } catch (e) { /* private mode */ }
          }
        })
          .to([$('.loader__center', loader), $('.loader__foot', loader)], { y: -32, autoAlpha: 0, duration: 0.6, ease: 'power3.in' })
          .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.15, ease: 'expo.inOut' }, 0.3)
          .add(resolve, 0.62); // the page starts arriving while the panel lifts
      }
    });
  }

  /* ---------------------------------------------------------------- Page transitions */
  function enter() {
    if (!curtain || !root.classList.contains('is-entering')) return Promise.resolve();
    curtain.style.animation = 'none';
    curtain.classList.add('is-moving');
    return new Promise((resolve) => {
      gsap.fromTo(curtain, { yPercent: 0 }, {
        yPercent: -101, duration: 1.05, ease: 'expo.inOut', delay: 0.08,
        onStart: () => setTimeout(resolve, 380),
        onComplete() {
          root.classList.remove('is-entering');
          curtain.classList.remove('is-moving');
          gsap.set(curtain, { yPercent: 101 });
        }
      });
    });
  }

  function leave(dest) {
    try { sessionStorage.setItem('ed-nav', '1'); } catch (e) { /* private mode */ }
    if (lenis) lenis.stop();
    let gone = false;
    const go = () => { if (!gone) { gone = true; window.location.href = dest; } };
    curtain.classList.add('is-moving');
    gsap.fromTo(curtain, { yPercent: 101 }, { yPercent: 0, duration: 0.75, ease: 'expo.inOut', onComplete: go });
    setTimeout(go, 1300); // never strand a visitor on the curtain
  }

  if (curtain) {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.getAttribute('href'), location.href);
      if (url.origin !== location.origin || !/^https?:$|^file:$/.test(url.protocol)) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page (anchors)
      if (!/(\.html|\/)$/.test(url.pathname)) return;
      e.preventDefault();
      leave(url.href);
    });
    // back/forward cache: a restored page must not keep the curtain down
    window.addEventListener('pageshow', (e) => {
      if (!e.persisted) return;
      gsap.set(curtain, { yPercent: 101 });
      curtain.classList.remove('is-moving');
      root.classList.remove('is-entering');
      if (lenis) lenis.start();
    });
  }

  /* ---------------------------------------------------------------- Header */
  const header = $('[data-header]');
  if (header) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        header.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > window.innerHeight * 0.6);
      }
    });
  }

  /* ---------------------------------------------------------------- Arrival: hero */
  function heroArrive() {
    const tl = gsap.timeline();
    if (heroTitle) {
      const split = SplitText.create(heroTitle, { type: 'lines,chars', mask: 'lines', linesClass: 'split-line' });
      gsap.set(heroTitle, { autoAlpha: 1 });
      tl.from(split.chars, { yPercent: 118, duration: 1.6, ease: 'expo.out', stagger: 0.045 }, 0);
    }
    const media = $('[data-hero-media]') || $('[data-pdp-art]');
    if (media) tl.fromTo(media, { scale: 1.16 }, { scale: 1, duration: 2.6, ease: 'expo.out' }, 0);
    if (heroIn.length) tl.to(heroIn, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08 }, 0.45);
    const toggle = $('[data-video-toggle]');
    if (toggle) tl.from(toggle, { autoAlpha: 0, duration: 1 }, 0.9);
    return tl;
  }

  /* ---------------------------------------------------------------- Scroll choreography */
  function scrollScenes() {
    const mm = gsap.matchMedia();

    // Section headings rise line by line out of their own masks.
    splits.forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { autoAlpha: 1 });
          return gsap.from(self.lines, {
            yPercent: 112, duration: 1.3, ease: 'expo.out', stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          });
        }
      });
    });

    // Copy and cards fade up in reading order, in small batches.
    ScrollTrigger.batch(reveals, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.25, ease: 'expo.out', stagger: 0.09, overwrite: true })
    });

    // Photographs open like a shutter, then settle.
    clips.forEach((el) => {
      const img = $('img', el);
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' });
      if (img) tl.from(img, { scale: 1.3, duration: 2, ease: 'expo.out' }, 0.1);
    });

    // Slow drift on framed photographs.
    $$('[data-parallax]').forEach((img) => {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Home hero: the film sinks and the words lift away as you leave it.
    const hero = $('.hero');
    if (hero) {
      gsap.to('[data-hero-media]', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__content', { yPercent: -14, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 30%', scrub: true } });
    }
    const pdpHero = $('[data-pdp-hero]');
    if (pdpHero) {
      gsap.to('[data-pdp-art]', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: pdpHero, start: 'top top', end: 'bottom top', scrub: true } });
    }

    // The name, explained: pinned on wide screens, a gentle reveal on small ones.
    $$('[data-story]').forEach((story) => {
      const svg = $('[data-story-svg]', story);
      const paths = $$('[data-story-mark] path', svg);
      const ring = (k) => $(`[data-ring="${k}"]`, svg);
      const line = (k) => $(`[data-line="${k}"]`, svg);
      const dot = (k) => $(`[data-dot="${k}"]`, svg);
      const def = (k) => $(`[data-def="${k}"]`, story);
      const statement = $('[data-story-statement]', story);
      const undrawn = (els) => els.forEach((el) => { const L = el.getTotalLength(); gsap.set(el, { strokeDasharray: L, strokeDashoffset: L }); });

      mm.add('(min-width: 900px)', () => {
        undrawn([...paths, ring('e'), ring('d'), line('e'), line('d')]);
        gsap.set(paths, { fillOpacity: 0, stroke: 'currentColor', strokeWidth: 0.45 });
        gsap.set([dot('e'), dot('d')], { scale: 0, transformOrigin: '50% 50%' });
        gsap.set([def('e'), def('d'), statement], { autoAlpha: 0, y: 26 });
        const callout = (k, at) => {
          tl.to(ring(k), { strokeDashoffset: 0, duration: 0.55 }, at)
            .to(line(k), { strokeDashoffset: 0, duration: 0.35 }, '>-0.05')
            .to(dot(k), { scale: 1, duration: 0.12 }, '>-0.04')
            .to(def(k), { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '<');
        };
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: story, start: 'top top', end: '+=240%', pin: true, scrub: 1, anticipatePin: 1 }
        });
        tl.to(paths, { strokeDashoffset: 0, duration: 1, stagger: 0.06 })
          .to(paths, { fillOpacity: 1, duration: 0.4 }, '-=0.3')
          .to(paths, { strokeOpacity: 0, duration: 0.25 }, '<0.2');
        callout('e', '+=0.2');
        callout('d', '+=0.3');
        tl.to(statement, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.25')
          .to({}, { duration: 0.45 }); // a beat to read before the page moves on
      });

      mm.add('(max-width: 899px)', () => {
        undrawn([ring('e'), ring('d')]);
        gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 75%', once: true } })
          .from(paths, { fillOpacity: 0, duration: 1.2, ease: 'power2.out', stagger: 0.1 })
          .to([ring('e'), ring('d')], { strokeDashoffset: 0, duration: 1.4, ease: 'expo.inOut', stagger: 0.25 }, 0.2)
          .from([def('e'), def('d'), statement], { autoAlpha: 0, y: 26, duration: 1.1, ease: 'expo.out', stagger: 0.15 }, 0.5);
      });
    });

    // Ritual: each card settles back and dims as the next one lands on it.
    mm.add('(min-width: 768px)', () => {
      const cards = $$('.stack__card');
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const st = { trigger: next, start: 'top bottom', end: () => `top ${headerH() + 20 + (i + 1) * 16}px`, scrub: true };
        gsap.to(card, { scale: 0.93, ease: 'none', scrollTrigger: st });
        gsap.to($('.stack__dim', card), { opacity: 0.6, ease: 'none', scrollTrigger: { ...st } });
      });
      cards.forEach((card) => {
        gsap.from($('.stack__art', card), { scale: 1.25, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 30%', scrub: true } });
      });
    });

    // Closer: the photograph opens out to the full frame as it arrives.
    const closer = $('[data-closer]');
    if (closer) {
      const media = $('.closer__media', closer);
      const st = { trigger: closer, start: 'top bottom', end: 'top top', scrub: true };
      gsap.fromTo(media, { clipPath: 'inset(12% 16% 12% 16%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: st });
      gsap.fromTo($('img', media), { scale: 1.22 }, { scale: 1, ease: 'none', scrollTrigger: { ...st } });
    }

    // Shop slideshow and gallery images get a soft settle; footer wordmark rises in.
    const word = $('.footer__word');
    if (word) gsap.from(word, { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 98%', once: true } });

    fontsReady().then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  /* ---------------------------------------------------------------- Run */
  const entering = root.classList.contains('is-entering');
  if (entering && loader) loader.remove(); // the intro already played this session
  const arrival = entering ? enter() : intro();
  // text is split into lines/characters only once the real fonts are in, so the masks fit the glyphs
  arrival.then(fontsReady).then(() => {
    heroArrive();
    scrollScenes();
  });
})();
