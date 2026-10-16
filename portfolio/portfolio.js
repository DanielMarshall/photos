(() => {
  // Portfolio view: shows only photos tagged in build_data.py's PORTFOLIO
  // (the "portfolio" field in images.json). The main gallery is untouched.
  const GROUPS = {
    macro: [['macro', 'Macro'], ['detail', 'Product & detail'], ['texture', 'Fine art textures']],
    wildlife: [['wildlife', 'Wildlife & nature']],
  };
  const HERO_SECONDS = 6;
  // Trim a hair off each side of the photo area so no border line peeks through.
  const EDGE = 0.002;

  const $ = (id) => document.getElementById(id);
  let items = [];
  let shown = [];
  let lbIndex = 0;

  const titleOf = (item) => item.portfolio_title || item.title;

  // A box that shows just the photo area of a medium (see .ph in the CSS).
  function framed(item, { lazy = true } = {}) {
    const [fx, fy, fw, fh] = item.medium_frame || [0, 0, 1, 1];
    const x = fx + EDGE, y = fy + EDGE, w = fw - 2 * EDGE, h = fh - 2 * EDGE;
    const box = document.createElement('div');
    box.className = 'ph';
    box.style.setProperty('--iw', `${100 / w}%`);
    box.style.setProperty('--il', `${(-x / w) * 100}%`);
    box.style.setProperty('--it', `${(-y / h) * 100}%`);
    // Until the medium loads, guess the shape from the original photo size.
    setRatio(box, item.size ? item.size[0] / item.size[1] : 1.5);
    const img = document.createElement('img');
    img.alt = titleOf(item);
    img.decoding = 'async';
    if (lazy) img.loading = 'lazy';
    img.addEventListener('load', () => {
      setRatio(box, (img.naturalWidth * w) / (img.naturalHeight * h));
    });
    img.src = `../${item.medium}`;
    box.appendChild(img);
    return box;
  }

  function setRatio(box, r) {
    box.style.setProperty('--ar', String(r));
    box.style.setProperty('--arn', String(r));
  }

  // ---------- hero ----------
  function buildHero() {
    const heroes = items.filter((i) => i.portfolio_hero).sort((a, b) => a.portfolio_hero - b.portfolio_hero);
    if (!heroes.length) return;
    const wrap = $('hero-slides');
    const slides = heroes.map((item, n) => {
      const s = document.createElement('div');
      s.className = 'hero-slide';
      s.appendChild(framed(item, { lazy: n > 0 }));
      wrap.appendChild(s);
      return s;
    });
    let cur = 0;
    const show = (n) => {
      slides[cur].classList.remove('on');
      cur = n;
      slides[cur].classList.add('on');
      $('hero-caption').textContent = titleOf(heroes[cur]);
    };
    slides[0].classList.add('on');
    $('hero-caption').textContent = titleOf(heroes[0]);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced && slides.length > 1) {
      setInterval(() => { if (!document.hidden) show((cur + 1) % slides.length); }, HERO_SECONDS * 1000);
    }
  }

  // ---------- gallery ----------
  function buildGrid(tab) {
    const grid = $('grid');
    grid.innerHTML = '';
    shown = [];
    const groups = GROUPS[tab];
    groups.forEach(([key, label]) => {
      const list = items.filter((i) => i.portfolio === key).sort((a, b) => a.portfolio_order - b.portfolio_order);
      if (!list.length) return;
      if (groups.length > 1) {
        const h = document.createElement('h3');
        h.className = 'group-label';
        h.textContent = label;
        grid.appendChild(h);
      }
      list.forEach((item) => {
        const index = shown.push(item) - 1;
        const tile = document.createElement('button');
        tile.className = 'tile';
        tile.type = 'button';
        tile.setAttribute('aria-label', `Open ${titleOf(item)}`);
        tile.appendChild(framed(item));
        const cap = document.createElement('span');
        cap.className = 'tile-cap';
        cap.textContent = titleOf(item);
        tile.appendChild(cap);
        tile.addEventListener('click', () => openLightbox(index));
        grid.appendChild(tile);
      });
    });
  }

  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
      buildGrid(btn.dataset.tab);
    });
  });

  // ---------- lightbox ----------
  function renderLightbox() {
    const item = shown[lbIndex];
    const holder = $('lb-photo');
    holder.innerHTML = '';
    holder.appendChild(framed(item, { lazy: false }));
    const where = item.location ? ` · ${item.location}` : '';
    $('lb-caption').textContent = `${titleOf(item)}${where}`;
  }
  function openLightbox(i) {
    lbIndex = i;
    renderLightbox();
    $('lightbox').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    $('lightbox').hidden = true;
    document.body.style.overflow = '';
  }
  function step(d) {
    lbIndex = (lbIndex + d + shown.length) % shown.length;
    renderLightbox();
  }
  $('lb-close').addEventListener('click', closeLightbox);
  $('lb-prev').addEventListener('click', () => step(-1));
  $('lb-next').addEventListener('click', () => step(1));
  $('lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if ($('lightbox').hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
  let touchX = null;
  $('lightbox').addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  $('lightbox').addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });

  // ---------- nav background once past the hero ----------
  const nav = $('topnav');
  const onScroll = () => nav.classList.toggle('solid', window.scrollY > window.innerHeight * 0.6);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  $('year').textContent = new Date().getFullYear();

  fetch('../images.json', { cache: 'no-cache' })
    .then((r) => r.json())
    .then((all) => {
      items = all.filter((i) => i.portfolio);
      buildHero();
      buildGrid('macro');
    })
    .catch(() => {
      $('grid').textContent = 'Photos could not be loaded. Please refresh the page.';
    });
})();
