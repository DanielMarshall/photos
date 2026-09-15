(async function () {
  const main = document.getElementById('sections');
  const lightbox = document.getElementById('lightbox');
  const lbViewport = document.getElementById('lb-viewport');
  const lbImg = document.getElementById('lb-img');
  const lbInfo = document.querySelector('.lb-info');
  const lbTitle = document.getElementById('lb-title');
  const lbMeta = document.getElementById('lb-meta');
  const lbZoom = document.getElementById('lb-zoom');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  const zoomBar = document.getElementById('zoom-bar');
  const zoomButtons = Array.from(zoomBar.querySelectorAll('.zoom-btn'));
  const lbSelect = document.getElementById('lb-select');
  const lbDimA = document.getElementById('lb-dim-a');
  const lbDimB = document.getElementById('lb-dim-b');
  const lbLoading = document.getElementById('lb-loading');
  const lbProgressBar = document.getElementById('lb-progress-bar');
  const lbLoadingLabel = document.getElementById('lb-loading-label');

  const res = await fetch('images.json?v=' + Date.now());
  const items = await res.json();

  const SECTION_ORDER = [
    ['Gladesville', 'Garden'],
    ['Gladesville', 'Experiments in Liquids'],
    ['Gladesville', 'Dinosaurs'],
    ['Gladesville', 'Frank photos of Frankie'],
    ['Gladesville', 'Planes'],
    ['Gladesville', 'People'],
    ['Gladesville', 'Uncategorized'],
    ['Hornsby Heights', null],
    ['Artarmon', null],
    ['Sydney CBD', null],
    ['Chinese Garden of Friendship', null],
    ['Sydney Town Hall', null],
    ['Queen Victoria Building', null],
    ['Darling Harbour Piano', null],
  ];

  const SECTION_LABELS = {
    'Gladesville|Garden': 'Gladesville — Garden',
    'Gladesville|Experiments in Liquids': 'Gladesville — Experiments in Liquids',
    'Gladesville|Dinosaurs': 'The Last of the Dinosaurs',
    'Gladesville|Frank photos of Frankie': 'Frank photos of Frankie',
    'Gladesville|Planes': 'Gladesville — Planes',
    'Gladesville|People': 'Gladesville — People',
    'Gladesville|Uncategorized': 'Gladesville — Other',
    'Hornsby Heights|null': 'Hornsby Heights',
    'Artarmon|null': 'Artarmon',
    'Sydney CBD|null': 'Sydney CBD (Darling Harbour)',
    'Sydney Town Hall|null': 'Sydney Town Hall — Ukraine Solidarity Protest',
    'Queen Victoria Building|null': 'Queen Victoria Building — Public Piano',
    'Chinese Garden of Friendship|null': 'Chinese Garden of Friendship',
    'Darling Harbour Piano|null': 'Darling Harbour Piano',
  };

  // Shown on each category's card on the home view, and again as an intro
  // line in the category's own detail view.
  const SECTION_DESCRIPTIONS = {
    'Gladesville|Garden': 'Backyard macro photography — spiders, insects, and other garden life, including focus-stacked composites.',
    'Gladesville|Experiments in Liquids': 'Macro tests of oil and glitter in liquid, exploring focus and lighting technique.',
    'Gladesville|Dinosaurs': "They like roasted almonds enough that they will fight each other off to see who gets to almost take off one of my fingers, and hang around for some photos afterwards, until Timmy came to investigate, and their extinction paranoia kicked in and they went to their next stop.",
    'Gladesville|Frank photos of Frankie': "Extreme close-up macro shots of Frankie's facial features.",
    'Gladesville|Planes': 'Planes photographed from the yard, some with the MC-20 teleconverter for extra reach.',
    'Gladesville|People': 'Family and friends around home.',
    'Gladesville|Uncategorized': "A few photos that don't fit anywhere else yet.",
    'Hornsby Heights|null': "Family photos at mum and dad's house in Hornsby Heights.",
    'Artarmon|null': 'Photos taken around Artarmon.',
    'Sydney CBD|null': 'Snapshots around Darling Harbour and the Sydney CBD.',
    'Chinese Garden of Friendship|null': 'Water dragons and the waterfall at the Chinese Garden of Friendship, Darling Harbour.',
    'Sydney Town Hall|null': 'A Ukraine solidarity protest at Sydney Town Hall.',
    'Queen Victoria Building|null': 'The public piano, clock, and mall interior at the QVB.',
    'Darling Harbour Piano|null': 'A public piano at Darling Harbour.',
  };

  function groupKey(item) {
    return `${item.category}|${item.subcategory}`;
  }

  const groups = new Map();
  items.forEach((item, i) => {
    item._index = i;
    const key = groupKey(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });

  // Full site order (category order, then within-category order) -- used by
  // the whole-site slideshow regardless of which view is currently showing.
  const globalOrder = [];
  SECTION_ORDER.forEach(([cat, sub]) => {
    const key = `${cat}|${sub}`;
    const groupItems = groups.get(key);
    if (!groupItems || !groupItems.length) return;
    groupItems.forEach((item) => globalOrder.push(item._index));
  });

  // Lightbox prev/next steps through whichever category grid is currently
  // open -- set each time a category detail view is rendered.
  let currentOrder = globalOrder;

  function renderHome() {
    main.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'category-grid';

    SECTION_ORDER.forEach(([cat, sub]) => {
      const key = `${cat}|${sub}`;
      const groupItems = groups.get(key);
      if (!groupItems || !groupItems.length) return;

      const card = document.createElement('a');
      card.className = 'category-card';
      card.href = `#/c/${encodeURIComponent(key)}`;

      const thumb = document.createElement('img');
      thumb.className = 'category-card-thumb';
      thumb.src = groupItems[0].thumb;
      thumb.alt = SECTION_LABELS[key] || cat;
      card.appendChild(thumb);

      const body = document.createElement('div');
      body.className = 'category-card-body';

      const heading = document.createElement('h2');
      heading.textContent = SECTION_LABELS[key] || cat;
      body.appendChild(heading);

      const desc = SECTION_DESCRIPTIONS[key];
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc;
        body.appendChild(p);
      }

      const count = document.createElement('div');
      count.className = 'category-count';
      count.textContent = `${groupItems.length} photo${groupItems.length === 1 ? '' : 's'}`;
      body.appendChild(count);

      card.appendChild(body);
      grid.appendChild(card);
    });

    main.appendChild(grid);
    window.scrollTo(0, 0);
  }

  function renderCategory(key) {
    const groupItems = groups.get(key);
    if (!groupItems || !groupItems.length) return renderHome();
    const [cat, sub] = key.split('|');

    main.innerHTML = '';

    const back = document.createElement('a');
    back.className = 'back-link';
    back.href = '#';
    back.textContent = '← All categories';
    main.appendChild(back);

    const section = document.createElement('section');
    section.className = 'photo-section';

    const heading = document.createElement('h2');
    heading.textContent = SECTION_LABELS[key] || cat;
    section.appendChild(heading);

    const desc = SECTION_DESCRIPTIONS[key];
    if (desc) {
      const intro = document.createElement('p');
      intro.className = 'section-intro';
      intro.textContent = desc;
      section.appendChild(intro);
    }

    const grid = document.createElement('div');
    grid.className = 'grid';

    currentOrder = groupItems.map((item) => item._index);

    groupItems.forEach((item) => {
      const fig = document.createElement('figure');
      const img = document.createElement('img');
      img.src = item.thumb;
      img.loading = 'lazy';
      img.alt = item.title || item.caption || 'Photo';
      fig.appendChild(img);

      const label = item.title || item.original_filename;
      if (label) {
        const cap = document.createElement('figcaption');
        cap.textContent = label;
        if (!item.title) cap.classList.add('filename');
        fig.appendChild(cap);
      }
      fig.addEventListener('click', () => open(item._index));
      grid.appendChild(fig);
    });

    section.appendChild(grid);

    if (cat === 'Gladesville' && sub === 'Experiments in Liquids') {
      const videoBlock = document.createElement('div');
      videoBlock.className = 'section-video';
      videoBlock.innerHTML = `
        <h3>Focus? what's that again?</h3>
        <video controls playsinline preload="metadata" poster="video/glitter-oil-poster.jpg">
          <source src="video/glitter-oil-focus-attempts.mp4" type="video/mp4">
          Your browser doesn't support embedded video.
        </video>
        <p class="video-caption">Getting the focus right and an interesting enough shot seems to be the main challenges, but i might be more stable if I used less pizza boxes as structural supports. The MC-20 x2 magnification extender does make for more interesting shots I think, but requires a lot of stability and light. Works for flash, but not so good for backlight.</p>
      `;
      section.appendChild(videoBlock);
    }

    main.appendChild(section);
    window.scrollTo(0, 0);
  }

  function route() {
    const m = location.hash.match(/^#\/c\/(.+)$/);
    if (m) {
      const key = decodeURIComponent(m[1]);
      if (groups.has(key)) return renderCategory(key);
    }
    currentOrder = globalOrder;
    renderHome();
  }

  window.addEventListener('hashchange', route);
  route();

  let current = -1;
  let zoomed = false; // viewing the full-resolution source (vs medium)
  let fullLoaded = false;
  let zoomScale = 'fit'; // 'fit' | 1 | 0.5 | 0.25 | custom number (<=1)
  let currentFocus = { x: 0.5, y: 0.5 }; // fraction of natural image currently centered

  // The full-resolution image is fetched with progress and kept as a blob
  // URL for as long as we're on the same photo, so toggling back and forth
  // doesn't re-download it. Released whenever we move to a different photo.
  let fullObjectURL = null;
  let loadToken = 0;

  function releaseFullObjectURL() {
    loadToken++;
    if (fullObjectURL) {
      URL.revokeObjectURL(fullObjectURL);
      fullObjectURL = null;
    }
  }

  function open(i) {
    releaseFullObjectURL();
    current = i;
    zoomed = false;
    render();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function render() {
    const item = items[current];
    fullLoaded = false;
    zoomScale = 'fit';
    currentFocus = { x: 0.5, y: 0.5 };
    zoomBar.hidden = !zoomed;
    lightbox.classList.toggle('full-view', zoomed);
    setViewportMode('fit');
    hideSpotlight();
    lbSelect.hidden = true;
    lbLoading.hidden = true;
    lbProgressBar.style.width = '0%';
    lbImg.style.width = '';
    lbImg.style.height = '';
    lbImg.src = zoomed ? fullObjectURL : item.medium;
    lbImg.alt = item.title || item.caption || 'Photo';
    lbZoom.textContent = zoomed ? 'Back to normal size' : 'View full resolution';

    // Medium view already has the caption baked into its border -- the HTML
    // panel is only useful once you're looking at the un-bordered full-res
    // image, and even then kept to as few lines as possible.
    lbInfo.classList.toggle('info-hidden', !zoomed);
    lbMeta.innerHTML = '';
    if (zoomed) {
      lbTitle.textContent = item.title || item.caption || '(untitled)';
      const s = item.settings;
      const line = [];
      // Only show the raw filename when there's no real title yet -- once a
      // photo has a proper name, the filename is just noise (and for some
      // sets, like Experiments in Liquids, deliberately hidden).
      if (!item.title && item.original_filename) line.push(item.original_filename);
      if (s) {
        const bits = [];
        if (s.aperture) bits.push(s.aperture);
        if (s.shutter) bits.push(s.shutter);
        if (s.iso) bits.push(`ISO ${s.iso}`);
        if (s.focal) bits.push(s.focal);
        if (bits.length) line.push(bits.join(' · '));
        if (s.datetime) line.push(s.datetime);
      }
      addMeta(line.join('  ·  '));
      if (item.description) addMeta(item.description);
    }
  }

  function addMeta(text) {
    if (!text) return;
    const row = document.createElement('div');
    row.className = 'meta-row';
    row.textContent = text;
    lbMeta.appendChild(row);
  }

  function resetZoomState() {
    zoomed = false;
    zoomScale = 'fit';
    fullLoaded = false;
    hideSpotlight();
    setViewportMode('fit');
    lbImg.style.width = '';
    lbImg.style.height = '';
    lbSelect.hidden = true;
    lightbox.classList.remove('full-view');
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    resetZoomState();
    releaseFullObjectURL();
    lbLoading.hidden = true;
  }

  function step(delta) {
    releaseFullObjectURL();
    const pos = currentOrder.indexOf(current);
    const nextPos = (pos + delta + currentOrder.length) % currentOrder.length;
    current = currentOrder[nextPos];
    zoomed = false;
    render();
  }

  function setViewportMode(mode) {
    lbViewport.classList.toggle('fit', mode === 'fit');
    lbViewport.classList.toggle('zoomed', mode === 'zoomed');
    lbViewport.classList.toggle('selectable', mode === 'fit' && zoomed);
  }

  function hideSpotlight() {
    lbDimA.hidden = true;
    lbDimB.hidden = true;
  }

  // Dims the image area revealed outside the originally-selected region
  // once that selection has been scaled to fill the viewport's width or height.
  // Uses position:fixed screen coordinates since the viewport itself scrolls.
  function showSpotlight(scale, selWNatural, selHNatural) {
    const rect = lbViewport.getBoundingClientRect();
    const vw = rect.width;
    const vh = rect.height;
    const onScreenW = selWNatural * scale;
    const onScreenH = selHNatural * scale;

    if (onScreenW >= vw - 1) {
      const barH = Math.max(0, (vh - onScreenH) / 2);
      if (barH < 1) return hideSpotlight();
      lbDimA.style.cssText = `left:${rect.left}px; top:${rect.top}px; width:${vw}px; height:${barH}px;`;
      lbDimB.style.cssText = `left:${rect.left}px; top:${rect.bottom - barH}px; width:${vw}px; height:${barH}px;`;
    } else {
      const barW = Math.max(0, (vw - onScreenW) / 2);
      if (barW < 1) return hideSpotlight();
      lbDimA.style.cssText = `top:${rect.top}px; left:${rect.left}px; height:${vh}px; width:${barW}px;`;
      lbDimB.style.cssText = `top:${rect.top}px; left:${rect.right - barW}px; height:${vh}px; width:${barW}px;`;
    }
    lbDimA.hidden = false;
    lbDimB.hidden = false;
  }

  // scale: 'fit' | number (<=1). focus: fraction (0-1) of the natural image to center on.
  function setZoom(scale, focus) {
    zoomScale = scale;
    zoomButtons.forEach((b) => {
      const isFit = scale === 'fit' && b.dataset.zoom === 'fit';
      const isNum = typeof scale === 'number' && Number(b.dataset.zoom) === scale;
      b.classList.toggle('active', isFit || isNum);
    });

    if (scale === 'fit') {
      setViewportMode('fit');
      lbImg.style.width = '';
      lbImg.style.height = '';
      return;
    }
    if (!fullLoaded) return;
    setViewportMode('zoomed');
    const w = lbImg.naturalWidth * scale;
    const h = lbImg.naturalHeight * scale;
    lbImg.style.width = `${w}px`;
    lbImg.style.height = `${h}px`;
    const f = focus || currentFocus;
    currentFocus = f;
    lbViewport.scrollTo({
      left: f.x * w - lbViewport.clientWidth / 2,
      top: f.y * h - lbViewport.clientHeight / 2,
      behavior: 'smooth',
    });
  }

  // Keep currentFocus in sync with wherever the view has been panned to,
  // so switching zoom levels afterwards doesn't jump back to image center.
  function syncFocusFromScroll() {
    const w = parseFloat(lbImg.style.width) || lbImg.naturalWidth || 1;
    const h = parseFloat(lbImg.style.height) || lbImg.naturalHeight || 1;
    currentFocus = {
      x: (lbViewport.scrollLeft + lbViewport.clientWidth / 2) / w,
      y: (lbViewport.scrollTop + lbViewport.clientHeight / 2) / h,
    };
  }

  lbImg.addEventListener('load', () => {
    if (zoomed) {
      fullLoaded = true;
      setZoom(zoomScale);
    }
  });

  zoomButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      hideSpotlight();
      const z = btn.dataset.zoom;
      setZoom(z === 'fit' ? 'fit' : Number(z));
    });
  });

  // Drag-to-pan when zoomed in; drag-to-select-a-region-to-zoom when at fit.
  let isPanning = false;
  let panStart = { x: 0, y: 0, scrollLeft: 0, scrollTop: 0 };
  let isSelecting = false;
  let selStart = { x: 0, y: 0 };

  lbViewport.addEventListener('mousedown', (e) => {
    if (lbViewport.classList.contains('zoomed')) {
      hideSpotlight();
      isPanning = true;
      panStart = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: lbViewport.scrollLeft,
        scrollTop: lbViewport.scrollTop,
      };
      lbViewport.classList.add('dragging');
      e.preventDefault();
    } else if (lbViewport.classList.contains('selectable')) {
      isSelecting = true;
      const rect = lbViewport.getBoundingClientRect();
      selStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      lbSelect.style.left = `${selStart.x}px`;
      lbSelect.style.top = `${selStart.y}px`;
      lbSelect.style.width = '0px';
      lbSelect.style.height = '0px';
      lbSelect.hidden = false;
      e.preventDefault();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isPanning) {
      lbViewport.scrollLeft = panStart.scrollLeft - (e.clientX - panStart.x);
      lbViewport.scrollTop = panStart.scrollTop - (e.clientY - panStart.y);
      syncFocusFromScroll();
    } else if (isSelecting) {
      const rect = lbViewport.getBoundingClientRect();
      const curX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const curY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      const x = Math.min(curX, selStart.x);
      const y = Math.min(curY, selStart.y);
      const w = Math.abs(curX - selStart.x);
      const h = Math.abs(curY - selStart.y);
      lbSelect.style.left = `${x}px`;
      lbSelect.style.top = `${y}px`;
      lbSelect.style.width = `${w}px`;
      lbSelect.style.height = `${h}px`;
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (isPanning) {
      isPanning = false;
      lbViewport.classList.remove('dragging');
    }
    if (isSelecting) {
      isSelecting = false;
      const selW = parseFloat(lbSelect.style.width);
      const selH = parseFloat(lbSelect.style.height);
      if (selW > 12 && selH > 12 && fullLoaded) {
        zoomToSelection(selW, selH);
      } else {
        lbSelect.hidden = true;
      }
    }
  });

  function zoomToSelection(selW, selH) {
    const imgRect = lbImg.getBoundingClientRect();
    const viewportRect = lbViewport.getBoundingClientRect();
    const selLeft = parseFloat(lbSelect.style.left) + viewportRect.left;
    const selTop = parseFloat(lbSelect.style.top) + viewportRect.top;

    // Selection in fractions of the (letterboxed) displayed image.
    const fx1 = (selLeft - imgRect.left) / imgRect.width;
    const fy1 = (selTop - imgRect.top) / imgRect.height;
    const fracW = selW / imgRect.width;
    const fracH = selH / imgRect.height;
    const fx = Math.min(Math.max(fx1 + fracW / 2, 0), 1);
    const fy = Math.min(Math.max(fy1 + fracH / 2, 0), 1);
    const selWNatural = fracW * lbImg.naturalWidth;
    const selHNatural = fracH * lbImg.naturalHeight;

    // Never zoom in past native resolution (1:1).
    const scaleX = lbViewport.clientWidth / selWNatural;
    const scaleY = lbViewport.clientHeight / selHNatural;
    const scale = Math.min(scaleX, scaleY, 1);

    setZoom(scale, { x: fx, y: fy });

    // Keep the drawn box on screen through the zoom transition, then swap it
    // for the spotlight dimming over whatever extra image got revealed.
    setTimeout(() => {
      lbSelect.hidden = true;
      showSpotlight(scale, selWNatural, selHNatural);
    }, 260);
  }

  const PAN_STEP = 100;

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => step(-1));
  lbNext.addEventListener('click', () => step(1));
  async function goFullRes() {
    if (fullObjectURL) {
      // already fetched for this photo (toggled back to medium and now
      // returning to full-res) -- reuse it, no network round-trip needed.
      zoomed = true;
      render();
      return;
    }
    const item = items[current];
    const myToken = loadToken;

    lbZoom.disabled = true;
    let revealed = false;
    const revealTimer = setTimeout(() => {
      revealed = true;
      lbLoadingLabel.textContent = 'Loading full resolution…';
      lbProgressBar.style.width = '0%';
      lbLoading.hidden = false;
    }, 150);

    const cleanup = () => {
      clearTimeout(revealTimer);
      if (revealed) lbLoading.hidden = true;
      lbZoom.disabled = false;
    };

    try {
      const response = await fetch(item.full);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const total = Number(response.headers.get('Content-Length')) || 0;

      let blob;
      if (response.body && total) {
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (myToken !== loadToken) return; // user moved on -- abandon
          chunks.push(value);
          received += value.length;
          lbProgressBar.style.width = `${Math.min(100, (received / total) * 100)}%`;
        }
        blob = new Blob(chunks);
      } else {
        blob = await response.blob();
      }

      if (myToken !== loadToken) return; // moved on while awaiting the blob

      fullObjectURL = URL.createObjectURL(blob);
      zoomed = true;
      render();
    } catch (err) {
      console.error('Failed to load full-resolution image', err);
    } finally {
      cleanup();
    }
  }

  lbZoom.addEventListener('click', () => {
    if (zoomed) {
      zoomed = false;
      render();
    } else {
      goFullRes();
    }
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') return close();
    if (zoomed && zoomScale !== 'fit') {
      const pan = (dx, dy) => {
        hideSpotlight();
        lbViewport.scrollBy(dx, dy);
        syncFocusFromScroll();
      };
      if (e.key === 'ArrowLeft') return pan(-PAN_STEP, 0);
      if (e.key === 'ArrowRight') return pan(PAN_STEP, 0);
      if (e.key === 'ArrowUp') return pan(0, -PAN_STEP);
      if (e.key === 'ArrowDown') return pan(0, PAN_STEP);
    }
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // ---- Slideshow ----
  const ssStartBtn = document.getElementById('slideshow-start');
  const ssEl = document.getElementById('slideshow');
  const ssClose = document.getElementById('ss-close');
  const ssStage = document.getElementById('ss-stage');
  const ssImgA = document.getElementById('ss-img-a');
  const ssImgB = document.getElementById('ss-img-b');
  const ssTitle = document.getElementById('ss-title');
  const ssLocation = document.getElementById('ss-location');
  const ssDesc = document.getElementById('ss-desc');

  const SLIDE_DURATION = 10000;
  let ssOrder = [];
  let ssPos = 0;
  let ssTimer = null;
  let ssShowingA = false;
  let ssPaused = false;

  function ssPreloadAll() {
    ssOrder.forEach((idx) => {
      const preload = new Image();
      preload.src = items[idx].medium;
    });
  }

  function ssRenderInfo(item) {
    ssTitle.textContent = item.title || item.caption || '';
    const loc = [item.category, item.subcategory].filter(Boolean).join(' – ');
    ssLocation.textContent = item.location ? `${loc} · ${item.location}` : loc;
    ssDesc.textContent = item.description || '';
  }

  function ssShow(pos) {
    ssPos = pos;
    const item = items[ssOrder[pos]];
    const incoming = ssShowingA ? ssImgB : ssImgA;
    const outgoing = ssShowingA ? ssImgA : ssImgB;
    ssShowingA = !ssShowingA;

    const reveal = () => {
      incoming.classList.add('visible');
      outgoing.classList.remove('visible');
      ssRenderInfo(item);
    };
    incoming.onload = reveal;
    incoming.src = item.medium;
    incoming.alt = item.title || item.caption || 'Photo';
    if (incoming.complete) reveal();
  }

  function ssScheduleNext() {
    clearTimeout(ssTimer);
    if (ssPaused) return;
    ssTimer = setTimeout(() => ssStep(1), SLIDE_DURATION);
  }

  function ssStep(delta) {
    const next = (ssPos + delta + ssOrder.length) % ssOrder.length;
    ssShow(next);
    ssScheduleNext();
  }

  function ssTogglePause() {
    ssPaused = !ssPaused;
    if (ssPaused) clearTimeout(ssTimer);
    else ssScheduleNext();
  }

  function ssOpen() {
    if (!globalOrder.length) return;
    ssOrder = globalOrder.slice();
    ssPaused = false;
    ssShowingA = false;
    ssImgA.classList.remove('visible');
    ssImgB.classList.remove('visible');
    ssEl.hidden = false;
    document.body.style.overflow = 'hidden';
    ssShow(0);
    ssScheduleNext();
    ssPreloadAll();
    if (ssEl.requestFullscreen) {
      ssEl.requestFullscreen().catch(() => {});
    }
  }

  function ssCloseFn() {
    clearTimeout(ssTimer);
    ssEl.hidden = true;
    document.body.style.overflow = '';
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  ssStartBtn.addEventListener('click', ssOpen);
  ssClose.addEventListener('click', ssCloseFn);
  ssStage.addEventListener('click', ssTogglePause);

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && !ssEl.hidden) ssCloseFn();
  });

  document.addEventListener('keydown', (e) => {
    if (ssEl.hidden) return;
    if (e.key === 'Escape') return ssCloseFn();
    if (e.key === 'ArrowRight') return ssStep(1);
    if (e.key === 'ArrowLeft') return ssStep(-1);
    if (e.key === ' ') { e.preventDefault(); ssTogglePause(); }
  });

  // ---- Background caching ----
  // First warm the browser cache with every thumbnail across the whole site
  // (most aren't in the DOM yet -- they only appear once a category is
  // opened), then, once that's done, offer to also cache every
  // medium-resolution image so opening photos and paging through the
  // lightbox feels instant. The medium step stays opt-in (remembered via
  // localStorage) since it can add up to tens of MB; thumbnails are small
  // enough to just warm proactively.
  const PRECACHE_CHOICE_KEY = 'gallery-precache-choice';

  function precacheAll(urlOf, onProgress) {
    const total = items.length;
    let done = 0;
    let idx = 0;
    const CONCURRENCY = 6;
    return new Promise((resolve) => {
      function loadNext() {
        if (idx >= total) return;
        const item = items[idx++];
        const img = new Image();
        img.onload = img.onerror = () => {
          done++;
          if (onProgress) onProgress(done, total);
          if (idx < total) loadNext();
          else if (done >= total) resolve();
        };
        img.src = urlOf(item);
      }
      for (let i = 0; i < CONCURRENCY && i < total; i++) loadNext();
    });
  }

  function precacheThumbs() {
    return precacheAll((item) => item.thumb);
  }

  function precacheMediums(onProgress) {
    return precacheAll((item) => item.medium, onProgress);
  }

  function showPrecacheOffer() {
    const banner = document.createElement('div');
    banner.className = 'precache-banner';
    banner.innerHTML = `
      <p class="precache-msg">Cache the full gallery in the background for faster browsing?</p>
      <div class="precache-actions">
        <button class="precache-btn precache-yes">Yes, cache it</button>
        <button class="precache-btn precache-no">No thanks</button>
      </div>
    `;
    document.body.appendChild(banner);
    const msg = banner.querySelector('.precache-msg');

    banner.querySelector('.precache-yes').addEventListener('click', () => {
      localStorage.setItem(PRECACHE_CHOICE_KEY, 'accepted');
      banner.querySelector('.precache-actions').remove();
      precacheMediums((done, total) => {
        msg.textContent = `Caching photos… ${done}/${total}`;
        if (done >= total) {
          msg.textContent = 'All photos cached for faster browsing.';
          setTimeout(() => banner.remove(), 2500);
        }
      });
    });

    banner.querySelector('.precache-no').addEventListener('click', () => {
      localStorage.setItem(PRECACHE_CHOICE_KEY, 'declined');
      banner.remove();
    });
  }

  precacheThumbs().then(() => {
    const precacheChoice = localStorage.getItem(PRECACHE_CHOICE_KEY);
    if (precacheChoice === 'accepted') {
      precacheMediums();
    } else if (precacheChoice !== 'declined') {
      showPrecacheOffer();
    }
  });
})();
