/* Evelyn Dew site behaviour, shared by every page.
   Content, commerce and controls live here and work without the motion layer
   (js/motion.js). Product data comes from js/products.js. Each block below only
   runs when its container is on the page. */
(function () {
  'use strict';

  const { products } = window.ED;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const byId = (id) => products.find((p) => p.id === id);
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  const price = (n) => inr.format(n);
  const href = (p) => `product.html?p=${encodeURIComponent(p.slug)}`;
  const photo = (name) => `assets/img/photos/${name}.webp`;
  const art = (p) => `assets/img/gradients/${p.site.art}.webp`;
  const icon = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  // the motion layer listens for these to pause and resume smooth scrolling
  const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  // Horizontal swipe on touch and pen; the element needs touch-action: pan-y.
  function onSwipe(el, fn) {
    let x0 = null;
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    el.addEventListener('pointercancel', () => { x0 = null; });
    el.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) fn(dx < 0 ? 1 : -1);
    });
  }

  /* ---------------------------------------------------------------- Shared markup */
  document.body.insertAdjacentHTML('beforeend', `
    <dialog class="bag" data-bag aria-labelledby="bag-title">
      <div class="bag__head">
        <h2 id="bag-title">Your bag</h2>
        <button class="icon-btn" type="button" aria-label="Close bag" data-close>${icon('i-x')}</button>
      </div>
      <div class="bag__items" data-bag-items data-lenis-prevent></div>
      <div class="bag__foot" data-bag-foot></div>
    </dialog>
    <div class="toast" role="status" aria-live="polite" data-toast>${icon('i-check')}<span data-toast-text></span></div>`);

  const card = (p, i) => `
    <article class="card" data-reveal style="--d:${i * 0.08}s">
      <a class="card__media" href="${href(p)}" tabindex="-1" aria-hidden="true">
        <img class="card__img" src="${photo(p.photos.product)}" alt="" loading="lazy" width="1400" height="2100">
        <img class="card__img card__img--alt" src="${photo(p.photos.model)}" alt="" loading="lazy" width="1400" height="2100">
        <span class="card__bar" style="background-image:url('${art(p)}')"></span>
      </a>
      <div class="card__body">
        <h3 class="card__name"><a href="${href(p)}">${p.name}</a></h3>
        <p class="card__tag">${p.headline}</p>
        <div class="card__row">
          <span class="card__price">${price(p.price)} <span class="muted">/ ${p.qty}</span></span>
          <button class="link" type="button" data-add="${p.id}">Add to bag</button>
        </div>
      </div>
    </article>`;

  /* ---------------------------------------------------------------- Home: hero film */
  const film = $('[data-hero-video]');
  if (film) {
    const toggle = $('[data-video-toggle]');
    const label = $('[data-video-label]', toggle);
    const small = window.matchMedia('(max-width: 767px), (orientation: portrait) and (max-width: 1023px)');
    const saveData = navigator.connection && navigator.connection.saveData;
    let userPaused = prefersReduced() || saveData;
    let visible = true;
    const setSources = () => {
      film.poster = small.matches ? film.dataset.posterMobile : film.dataset.poster;
      const src = small.matches ? film.dataset.srcMobile : film.dataset.src;
      if (!film.getAttribute('src') || !film.getAttribute('src').endsWith(src)) {
        film.src = src;
        film.preload = 'auto';
      }
    };
    const sync = () => {
      toggle.setAttribute('aria-pressed', String(userPaused));
      label.textContent = userPaused ? 'Play the film' : 'Pause the film';
      if (userPaused || !visible) { film.pause(); return; }
      if (!film.getAttribute('src')) setSources();
      const played = film.play();
      if (played) played.catch(() => { /* autoplay refused: the poster stays, the button offers play */ userPaused = true; toggle.setAttribute('aria-pressed', 'true'); label.textContent = 'Play the film'; });
    };
    film.poster = small.matches ? film.dataset.posterMobile : film.dataset.poster;
    if (!userPaused) setSources();
    small.addEventListener('change', () => { if (film.getAttribute('src')) { setSources(); sync(); } });
    toggle.addEventListener('click', () => { userPaused = !userPaused; sync(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.05 }).observe(film);
    }
    sync();
  }

  /* ---------------------------------------------------------------- Home: collection index */
  const index = $('[data-index]');
  if (index) {
    index.innerHTML = products.map((p, i) => `
      <li class="index__row" data-reveal style="--d:${i * 0.08}s">
        <a class="index__link" href="${href(p)}">
          <span class="index__art" style="background-image:url('${art(p)}')" aria-hidden="true"></span>
          <span class="index__thumb" aria-hidden="true"><img src="${photo(p.photos.product)}" alt="" loading="lazy" width="1400" height="2100"></span>
          <span class="index__name">${p.name}</span>
          <span class="index__cat">${p.category}, ${p.qty}</span>
          <span class="index__price">${price(p.price)}</span>
          ${icon('i-arrow', 'icon index__arrow')}
        </a>
      </li>`).join('');
  }

  /* ---------------------------------------------------------------- Home: ritual stack */
  const stack = $('[data-stack]');
  if (stack) {
    stack.innerHTML = products.map((p, i) => `
      <article class="stack__card" style="--i:${i}" aria-labelledby="ritual-${p.id}">
        <div class="stack__media"><img src="${photo(p.photos.model)}" alt="" loading="lazy" width="1400" height="2100"></div>
        <div class="stack__body">
          <span class="stack__art" style="background-image:url('${art(p)}')" aria-hidden="true"></span>
          <p class="label">${p.ritual.when}</p>
          <div class="stack__main">
            <h3 class="stack__verb" id="ritual-${p.id}">${p.ritual.verb}</h3>
            <p class="stack__product"><a href="${href(p)}">${p.name}</a></p>
            <p class="stack__lead">${p.headline}</p>
          </div>
          <div class="stack__foot">
            <p class="stack__actives">${p.actives}</p>
            <div class="stack__actions">
              <a class="btn btn--light" href="${href(p)}#how-to-use">How to use</a>
              <button class="link link--light" type="button" data-add="${p.id}">Add to bag</button>
            </div>
          </div>
        </div>
        <span class="stack__dim" aria-hidden="true"></span>
      </article>`).join('');
  }

  /* ---------------------------------------------------------------- The name, explained */
  // The story diagram draws the mark from real paths (so it can be drawn on);
  // under 900px it crops to the mark alone and the two words sit below it.
  $$('[data-story]').forEach((story) => {
    const svg = $('[data-story-svg]', story);
    const holder = $('[data-story-mark]', svg);
    const symbol = document.getElementById('mark');
    if (symbol && holder) {
      holder.replaceChildren(...[...symbol.children].map((n) => n.cloneNode(true)));
    }
    const narrow = window.matchMedia('(max-width: 899px)');
    const frame = () => svg.setAttribute('viewBox', narrow.matches ? '108 -6 146 152' : '-60 -10 480 164');
    frame();
    narrow.addEventListener('change', frame);
  });

  /* ---------------------------------------------------------------- Shop */
  const shopGrid = $('[data-shop-grid]');
  if (shopGrid) {
    const serum = byId('serum');
    shopGrid.innerHTML = products.map((p, i) => card(p, i)).join('') + `
      <a class="promo" href="science.html#ingredients" data-reveal style="--d:.24s">
        <span class="promo__art" style="background-image:url('${art(serum)}')" aria-hidden="true"></span>
        <span class="label">Science</span>
        <span class="promo__title">Inside every drop</span>
        <span class="link link--light">Read about our ingredients</span>
      </a>`;
  }

  const slider = $('[data-slider]');
  if (slider) {
    $('[data-slides]', slider).innerHTML = products.map((p, i) => `
      <div class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${products.length}: ${p.name}">
        <div class="slide__media"><img src="${photo(p.photos.model)}" alt="" width="1400" height="2100" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></div>
        <div class="slide__panel">
          <span class="slide__art" style="background-image:url('${art(p)}')" aria-hidden="true"></span>
          <div class="slide__copy">
            <p class="label">${p.category}, ${p.qty}</p>
            <h2 class="slide__name">${p.name}</h2>
            <p class="slide__tag">${p.headline}</p>
            <p class="slide__price">${price(p.price)}</p>
            <a class="btn btn--light" href="${href(p)}">View product ${icon('i-arrow')}</a>
          </div>
        </div>
      </div>`).join('');
    const pager = $('[data-pager]', slider);
    pager.insertAdjacentHTML('afterbegin', products.map((p, i) => `
      <button type="button" data-go="${i}" aria-label="Show ${p.name}">
        <span>${p.shortName}</span><span class="feature__bar"><span class="feature__fill"></span></span>
      </button>`).join(''));

    const slides = $$('.slide', slider);
    const goes = $$('[data-go]', slider);
    const playBtn = $('[data-slider-toggle]', slider);
    let at = 0;
    let stopped = prefersReduced();
    const show = (i, dir) => {
      slider.dataset.dir = dir;
      at = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === at));
      goes.forEach((b, k) => b.setAttribute('aria-current', String(k === at)));
    };
    const setPlaying = () => {
      slider.classList.toggle('is-playing', !stopped);
      playBtn.setAttribute('aria-pressed', String(stopped));
      playBtn.setAttribute('aria-label', stopped ? 'Play the slideshow' : 'Pause the slideshow');
    };
    slider.addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]');
      if (b && +b.dataset.go !== at) show(+b.dataset.go, +b.dataset.go > at ? 'next' : 'prev');
    });
    playBtn.addEventListener('click', () => { stopped = !stopped; setPlaying(); });
    // Autoplay: the active progress bar is a CSS animation; when it fills, move on.
    slider.addEventListener('animationend', (e) => { if (e.target.classList.contains('feature__fill')) show(at + 1, 'next'); });
    onSwipe(slider, (d) => show(at + d, d > 0 ? 'next' : 'prev'));
    show(0, 'next');
    setPlaying();
  }

  const actives = $('[data-actives]');
  if (actives) {
    actives.innerHTML = products.map((p, i) => `
      <li data-reveal style="--d:${i * 0.08}s">
        <img class="thumb" src="${photo(p.photos.product)}" alt="" loading="lazy" width="1400" height="2100">
        <div><a class="label" href="${href(p)}">${p.name}</a><p class="banner__act">${p.actives}</p></div>
      </li>`).join('');
  }

  /* ---------------------------------------------------------------- Science */
  const spotlight = $('[data-spotlight]');
  if (spotlight) {
    const section = spotlight.closest('.spotlight');
    const items = products.flatMap((p) => p.heroIngredients.map((h) => ({ ...h, p })));
    spotlight.innerHTML = items.map((h, i) => `
      <article class="spot" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}: ${h.name}" style="--accent:${h.p.site.accent}">
        <div class="spot__intro">
          <span class="spot__tag">${h.tag}</span>
          <h3 class="spot__name">${h.name}</h3>
          ${h.inci ? `<p class="spot__inci">INCI: ${h.inci}</p>` : ''}
          <p class="spot__found">Found in <a href="${href(h.p)}">${h.p.name}</a></p>
        </div>
        <div class="spot__visual" aria-hidden="true">
          <span class="spot__ring"></span>
          <img class="spot__photo" src="${photo(h.p.photos.model)}" alt="" loading="lazy" width="1400" height="2100">
        </div>
        <div class="spot__boxes">
          <div class="spot__box"><h4>What it is</h4><p>${h.about}</p></div>
          <div class="spot__box"><h4>What it does</h4><p>${cap(h.desc)}.</p></div>
        </div>
      </article>`).join('');
    $('[data-spot-dots]', section).innerHTML = items.map((h, i) => `
      <button class="dot" type="button" data-spot="${i}" style="--accent:${h.p.site.accent}" aria-label="${h.name}"></button>`).join('');

    const slides = $$('.spot', spotlight);
    const dots = $$('[data-spot]', section);
    const status = $('[data-spot-status]', section);
    let at = 0;
    const show = (i, dir, announce = true) => {
      section.dataset.dir = dir;
      at = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === at));
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === at)));
      spotlight.style.setProperty('--turn', `${at * 33}deg`); // the orbit dot travels a step per ingredient
      if (announce) status.textContent = `${items[at].name}, ${at + 1} of ${items.length}`;
    };
    section.addEventListener('click', (e) => {
      const t = e.target.closest('[data-spot], [data-spot-prev], [data-spot-next]');
      if (!t) return;
      if (t.hasAttribute('data-spot-prev')) show(at - 1, 'prev');
      else if (t.hasAttribute('data-spot-next')) show(at + 1, 'next');
      else if (+t.dataset.spot !== at) show(+t.dataset.spot, +t.dataset.spot > at ? 'next' : 'prev');
    });
    section.addEventListener('keydown', (e) => {
      if (e.target.closest('a, input')) return;
      if (e.key === 'ArrowRight') show(at + 1, 'next');
      if (e.key === 'ArrowLeft') show(at - 1, 'prev');
    });
    onSwipe(spotlight, (d) => show(at + d, d > 0 ? 'next' : 'prev'));
    show(0, 'next', false);
  }

  const freeFrom = $('[data-freefrom]');
  if (freeFrom) {
    freeFrom.innerHTML = products.map((p, i) => `
      <div class="freefrom__item" data-reveal style="--d:${i * 0.08}s">
        <img class="thumb" src="${photo(p.photos.product)}" alt="" loading="lazy" width="1400" height="2100">
        <div>
          <h3><a href="${href(p)}">${p.name}</a></h3>
          <ul>${p.freeFrom.map((f) => `<li>${icon('i-check')}${f}</li>`).join('')}</ul>
        </div>
      </div>`).join('');
  }

  // A product's full ingredient list, set like the panel printed on its carton.
  const labelCard = $('[data-label-card]');
  if (labelCard) {
    const p = byId(labelCard.dataset.labelCard);
    labelCard.innerHTML = `
      <span class="label-card__bar" style="background-image:url('${art(p)}')" aria-hidden="true"></span>
      <p class="label muted">${p.name}, ${p.qty}</p>
      <p class="label-card__title">Ingredients</p>
      <p class="label-card__list">${p.ingredients}</p>
      <p class="label-card__free">${p.freeFrom.join(' / ')}</p>`;
  }

  /* ---------------------------------------------------------------- Product page */
  const pdp = $('[data-pdp]');
  let pdpQty = 1;
  if (pdp) {
    const slug = new URLSearchParams(location.search).get('p');
    const p = products.find((x) => x.slug === slug);
    if (!p) {
      pdp.innerHTML = `
        <div class="empty">
          <h1 class="d2">We could not find that product.</h1>
          <p class="muted">It may have moved. Everything we make is in the shop.</p>
          <a class="btn" href="shop.html">Go to the shop</a>
        </div>`;
    } else {
      renderProduct(p);
    }
  }

  function renderProduct(p) {
    document.title = `${p.name} | Evelyn Dew`;
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', `${p.headline} ${p.name}, ${p.qty}. Full ingredient list, how to use and hero ingredients.`);
    document.documentElement.style.setProperty('--accent', p.site.accent);
    const shots = p.photos.gallery;
    const [first, ...rest] = p.name.split(' ');
    pdp.innerHTML = `
      <section class="pdp-hero" data-header-over data-pdp-hero aria-labelledby="pdp-title">
        <span class="pdp-hero__art" style="background-image:url('${art(p)}')" data-pdp-art aria-hidden="true"></span>
        <span class="pdp-hero__shade" aria-hidden="true"></span>
        <svg class="pdp-hero__mark" viewBox="113 -2 136 144" aria-hidden="true" focusable="false"><use href="#mark" x="113" y="-2" width="136" height="144"/></svg>
        <div class="pdp-hero__inner">
          <div class="pdp-hero__copy">
            <nav class="crumbs crumbs--light" aria-label="Breadcrumb" data-hero-in>
              <a href="index.html">Home</a><span aria-hidden="true">/</span><a href="shop.html">Shop</a><span aria-hidden="true">/</span><span aria-current="page">${p.shortName}</span>
            </nav>
            <p class="label" data-hero-in>${p.category}, ${p.qty}</p>
            <h1 class="pdp-hero__name" id="pdp-title" data-hero-title>${first} <em>${rest.join(' ')}</em></h1>
            <p class="pdp-hero__lead" data-hero-in>${p.headline}</p>
          </div>
          <div class="pdp-hero__buy" data-hero-in>
            <p class="pdp-hero__price">${price(p.price)}<small>MRP incl. of all taxes</small></p>
            <a class="btn btn--light" href="#details">Details and ingredients</a>
          </div>
        </div>
      </section>

      <section class="wrap pdp" id="details" aria-label="Product details">
        <div class="gallery" data-gallery>
          <div class="gallery__main">
            ${shots.map((k, i) => `<img class="${i ? '' : 'is-active'}" src="${photo(k)}" alt="" width="1400" height="2100" ${i ? 'loading="lazy"' : ''}>`).join('')}
            <button class="gallery__arrow gallery__arrow--prev" type="button" data-gal="-1" aria-label="Previous image">${icon('i-arrow')}</button>
            <button class="gallery__arrow gallery__arrow--next" type="button" data-gal="1" aria-label="Next image">${icon('i-arrow')}</button>
          </div>
          <div class="gallery__thumbs" role="group" aria-label="Product images">
            ${shots.map((k, i) => `<button type="button" data-shot="${i}" aria-pressed="${i === 0}" aria-label="Image ${i + 1} of ${shots.length}"><img src="${photo(k)}" alt="" loading="lazy" width="1400" height="2100"></button>`).join('')}
          </div>
        </div>
        <div class="pdp__info">
          <h2 class="pdp__name">${p.name}</h2>
          <p class="pdp__actives">${p.actives}<br>${p.claims.join(' / ')}</p>
          <p class="pdp__price">${price(p.price)}<small>MRP incl. of all taxes</small></p>
          <div class="pdp__row"><span class="label muted">Size</span><div class="chips"><span class="chip chip--on">${p.qty}</span></div></div>
          <div class="pdp__buy">
            <div class="qty" role="group" aria-label="Quantity">
              <button type="button" data-pdp-step="-1" aria-label="Decrease quantity">${icon('i-minus')}</button>
              <output data-pdp-qty aria-live="polite">1</output>
              <button type="button" data-pdp-step="1" aria-label="Increase quantity">${icon('i-plus')}</button>
            </div>
            <button class="btn btn--accent" type="button" data-pdp-add="${p.id}">Add to bag</button>
          </div>
          <div class="chips">${p.freeFrom.map((f) => `<span class="chip">${f}</span>`).join('')}</div>
          <div class="tabs" data-tabs>
            <div class="tabs__list" role="tablist" aria-label="Product details">
              <button type="button" role="tab" id="tab-use" aria-controls="how-to-use" aria-selected="true">How to use</button>
              <button type="button" role="tab" id="tab-ing" aria-controls="ingredients" aria-selected="false" tabindex="-1">Ingredients</button>
              <button type="button" role="tab" id="tab-care" aria-controls="care" aria-selected="false" tabindex="-1">Caution</button>
            </div>
            <div class="tabs__panel" role="tabpanel" id="how-to-use" aria-labelledby="tab-use" tabindex="0">
              <ol>${p.howTo.map((s) => `<li>${s}</li>`).join('')}</ol>
            </div>
            <div class="tabs__panel" role="tabpanel" id="ingredients" aria-labelledby="tab-ing" tabindex="0" hidden>
              <h4>Hero ingredients</h4>
              <ul>${p.heroIngredients.map((h) => `<li><strong>${h.name}</strong>: ${h.desc}</li>`).join('')}</ul>
              <h4>Full ingredient list</h4>
              <p>${p.ingredients}</p>
            </div>
            <div class="tabs__panel" role="tabpanel" id="care" aria-labelledby="tab-care" tabindex="0" hidden>
              <h4>Caution</h4><p>${p.caution}</p>
              <h4>Storage</h4><p>${p.storage}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="benefits" aria-labelledby="benefits-title">
        <div class="frame benefits__media"><img src="${photo(p.photos.model)}" alt="" loading="lazy" data-parallax></div>
        <div class="benefits__panel">
          <p class="label muted">Key benefits</p>
          <h2 class="d2" id="benefits-title" data-split>${p.headline}</h2>
          <ul class="benefits__list" data-reveal>${p.benefits.map((b) => `<li>${b}</li>`).join('')}</ul>
        </div>
      </section>

      <section class="wrap section" aria-labelledby="hi-title">
        <div class="sec-head"><h2 class="d1" id="hi-title" data-split>Hero <em>ingredients</em></h2></div>
        <div class="hero-ing">
          <div class="frame hero-ing__media" data-clip><img src="${photo(p.photos.gallery[2] || p.photos.product)}" alt="" loading="lazy" data-parallax></div>
          <ul class="hero-ing__list">
            ${p.heroIngredients.map((h, i) => `
              <li data-reveal style="--d:${i * 0.06}s">
                <h3>${h.name}</h3>
                <p class="does">${cap(h.desc)}.</p>
                ${h.about ? `<p class="about">${h.about}</p>` : ''}
              </li>`).join('')}
          </ul>
        </div>
        <div style="display:grid;justify-items:center;margin-top:clamp(48px,6vw,88px)"><a class="btn" href="science.html#ingredients">More on our science</a></div>
      </section>

      <section class="wrap section" aria-labelledby="see-title" style="padding-top:0">
        <div class="sec-head sec-head--center"><h2 class="d2" id="see-title" data-split>See also</h2></div>
        <div class="see-also">${products.filter((o) => o !== p).map((o, i) => card(o, i)).join('')}</div>
      </section>`;

    // Gallery: arrows, thumbnails and swipe all move through the same shots.
    const gal = $('[data-gallery]', pdp);
    const pics = $$('.gallery__main img', gal);
    const thumbs = $$('[data-shot]', gal);
    let g = 0;
    const showPic = (i) => {
      g = (i + pics.length) % pics.length;
      pics.forEach((im, k) => im.classList.toggle('is-active', k === g));
      thumbs.forEach((t, k) => t.setAttribute('aria-pressed', String(k === g)));
    };
    gal.addEventListener('click', (e) => {
      const t = e.target.closest('[data-gal], [data-shot]');
      if (!t) return;
      if (t.dataset.gal) showPic(g + +t.dataset.gal);
      else if (+t.dataset.shot !== g) showPic(+t.dataset.shot);
    });
    onSwipe($('.gallery__main', gal), (d) => showPic(g + d));

    // Tabs, with arrow keys between them. A #how-to-use or #ingredients link opens that tab.
    const tabs = $$('[role="tab"]', pdp);
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
    };
    const tabBox = $('[data-tabs]', pdp);
    // the open tab is kept in the URL (#how-to-use, #ingredients, #care) so it can be shared
    const remember = (t) => { try { history.replaceState(null, '', `${location.pathname}${location.search}#${t.getAttribute('aria-controls')}`); } catch (e) { /* file:// or sandboxed */ } };
    tabBox.addEventListener('click', (e) => { const t = e.target.closest('[role="tab"]'); if (t) { select(t); remember(t); } });
    tabBox.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0 || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      e.preventDefault();
      const t = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      select(t, true);
      remember(t);
    });
    const deep = tabs.find((t) => '#' + t.getAttribute('aria-controls') === location.hash);
    if (deep) {
      select(deep);
      requestAnimationFrame(() => {
        if (window.EDMotion) window.EDMotion.scrollTo(tabBox);
        else tabBox.scrollIntoView({ block: 'center' });
      });
    }
  }

  /* ---------------------------------------------------------------- Header over dark tops */
  // The header goes light while it sits over a dark first section (home film, product hero).
  const over = $('[data-header-over]');
  if (over && 'IntersectionObserver' in window) {
    const root = document.documentElement;
    const headerH = () => parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 72;
    let io;
    const watch = () => {
      if (io) io.disconnect();
      io = new IntersectionObserver(([e]) => root.classList.toggle('is-over', e.isIntersecting), {
        rootMargin: `0px 0px -${Math.max(window.innerHeight - headerH(), 1)}px 0px`
      });
      io.observe(over);
    };
    watch();
    window.addEventListener('resize', watch, { passive: true });
  }

  /* ---------------------------------------------------------------- Dialogs */
  function openDialog(d) {
    if (d.open) return;
    d.classList.remove('is-closing');
    d.showModal();
    emit('ed:lock');
  }
  function closeDialog(d) {
    if (!d.open || d.classList.contains('is-closing')) return;
    const finish = () => { d.classList.remove('is-closing'); d.close(); emit('ed:unlock'); };
    if (prefersReduced() || !d.getAnimations) return finish();
    d.classList.add('is-closing');
    const anims = d.getAnimations();
    if (!anims.length) return finish();
    Promise.all(anims.map((a) => a.finished)).then(finish, finish);
  }
  function wireDialog(d) {
    d.addEventListener('cancel', (e) => { e.preventDefault(); closeDialog(d); });
    d.addEventListener('click', (e) => {
      if (e.target === d) closeDialog(d); // click on backdrop
      if (e.target.closest('[data-close]')) closeDialog(d);
    });
  }

  /* ---------------------------------------------------------------- Bag */
  const bagDialog = $('[data-bag]');
  const MAX_QTY = 10;
  const cleanQty = (n) => Math.min(MAX_QTY, Math.max(1, parseInt(n, 10) || 1));
  // Only known product ids and whole quantities survive a reload; storage is never trusted as markup.
  let bag = (Array.isArray(store.get('ed-bag', [])) ? store.get('ed-bag', []) : [])
    .filter((l) => l && typeof l.id === 'string' && byId(l.id))
    .map((l) => ({ id: l.id, qty: cleanQty(l.qty) }));

  function saveBag() { store.set('ed-bag', bag); renderBag(); }
  function addToBag(id, qty = 1) {
    if (!byId(id)) return;
    const line = bag.find((l) => l.id === id);
    if (line) line.qty = cleanQty(line.qty + qty); else bag.push({ id, qty: cleanQty(qty) });
    saveBag();
    toast(`${byId(id).name} added to your bag`);
  }
  function setQty(id, qty) {
    if (qty <= 0) bag = bag.filter((l) => l.id !== id);
    else { const l = bag.find((x) => x.id === id); if (l) l.qty = cleanQty(qty); }
    saveBag();
  }
  function renderBag() {
    $$('[data-bag-count]').forEach((n) => { n.textContent = bag.reduce((s, l) => s + l.qty, 0); });
    const items = $('[data-bag-items]');
    const foot = $('[data-bag-foot]');
    if (!bag.length) {
      items.innerHTML = `
        <div class="bag__empty">
          <p>Your bag is empty.</p>
          <p>Start with the step you need most.</p>
          <a class="btn" href="shop.html">Go to the shop</a>
        </div>`;
      foot.innerHTML = '';
      return;
    }
    items.innerHTML = bag.map((l) => {
      const p = byId(l.id);
      return `
        <div class="bag-item">
          <div class="bag-item__img"><img src="${photo(p.photos.product)}" alt="" width="76" height="95"></div>
          <div>
            <p class="bag-item__name"><a href="${href(p)}">${p.name}</a></p>
            <p class="bag-item__meta">${p.qty}</p>
            <div class="qty" role="group" aria-label="Quantity for ${p.name}">
              <button type="button" data-qty="${p.id}" data-step="-1" aria-label="Decrease quantity">${icon('i-minus')}</button>
              <output aria-live="polite">${l.qty}</output>
              <button type="button" data-qty="${p.id}" data-step="1" aria-label="Increase quantity">${icon('i-plus')}</button>
            </div>
          </div>
          <div class="bag-item__right">
            <span>${price(p.price * l.qty)}</span>
            <button class="bag-item__remove" type="button" data-remove="${p.id}">Remove</button>
          </div>
        </div>`;
    }).join('');
    const subtotal = bag.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
    foot.innerHTML = `
      <div class="bag__row"><span>Subtotal</span><span class="num">${price(subtotal)}</span></div>
      <p class="bag__note">MRP incl. of all taxes. Shipping calculated at checkout.</p>
      <button class="btn btn--solid btn--block" type="button" disabled>Checkout opens soon</button>`;
  }

  /* ---------------------------------------------------------------- Toast */
  let toastTimer;
  function toast(msg) {
    const t = $('[data-toast]');
    $('[data-toast-text]', t).textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 3400);
  }

  /* ---------------------------------------------------------------- Events */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.dataset.add) addToBag(t.dataset.add);
    if (t.hasAttribute('data-bag-open')) openDialog(bagDialog);
    if (t.dataset.qty) {
      const l = bag.find((x) => x.id === t.dataset.qty);
      if (l) setQty(l.id, l.qty + Number(t.dataset.step));
    }
    if (t.dataset.remove) setQty(t.dataset.remove, 0);
    if (t.dataset.pdpStep) {
      pdpQty = cleanQty(pdpQty + Number(t.dataset.pdpStep));
      $('[data-pdp-qty]').textContent = pdpQty;
    }
    if (t.dataset.pdpAdd) addToBag(t.dataset.pdpAdd, pdpQty);
  });

  /* ---------------------------------------------------------------- Menu */
  const menu = $('#menu');
  const menuBtn = $('[data-menu-open]');
  const backdrop = ['.site-header', 'main', '.site-footer'].map((s) => $(s)).filter(Boolean);
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    backdrop.forEach((el) => { el.inert = open; });
    emit(open ? 'ed:lock' : 'ed:unlock');
    (open ? $('[data-menu-close]') : menuBtn).focus();
  }
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(true));
    $('[data-menu-close]').addEventListener('click', () => setMenu(false));
    $$('[data-menu-link]').forEach((a) => a.addEventListener('click', () => { if (menu.classList.contains('is-open')) setMenu(false); }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
    window.matchMedia('(min-width: 768px)').addEventListener('change', (m) => { if (m.matches && menu.classList.contains('is-open')) setMenu(false); });
  }

  /* ---------------------------------------------------------------- Newsletter */
  const form = $('[data-newsletter]');
  if (form) {
    const input = $('#email');
    const err = $('#email-error');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        input.setAttribute('aria-invalid', 'true');
        err.hidden = false;
        err.textContent = v ? 'That email looks incomplete. Check for a missing @ or domain.' : 'Enter your email to join the list.';
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      err.hidden = true;
      $('[data-form-row]').outerHTML = `<p class="news__success" role="status">${icon('i-check')} You are on the list. See you soon.</p>`;
    });
    input.addEventListener('blur', () => { if (!input.value) { input.removeAttribute('aria-invalid'); err.hidden = true; } });
  }

  /* ---------------------------------------------------------------- Boot */
  renderBag();
  wireDialog(bagDialog);
  document.documentElement.classList.add('ui-ready');
  emit('ed:content');
})();
