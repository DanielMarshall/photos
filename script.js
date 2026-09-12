(async function () {
  const main = document.getElementById('sections');
  const lightbox = document.getElementById('lightbox');
  const lbViewport = document.getElementById('lb-viewport');
  const lbImg = document.getElementById('lb-img');
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

  const res = await fetch('images.json');
  const items = await res.json();

  const SECTION_ORDER = [
    ['Gladesville', 'Garden'],
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

  const flatOrder = [];

  SECTION_ORDER.forEach(([cat, sub]) => {
    const key = `${cat}|${sub}`;
    const groupItems = groups.get(key);
    if (!groupItems || !groupItems.length) return;

    const section = document.createElement('section');
    section.className = 'photo-section';

    const heading = document.createElement('h2');
    heading.textContent = SECTION_LABELS[key] || cat;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'grid';

    groupItems.forEach((item) => {
      flatOrder.push(item._index);
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
    main.appendChild(section);
  });

  let current = -1;
  let zoomed = false; // viewing the full-resolution source (vs medium)
  let fullLoaded = false;
  let zoomScale = 'fit'; // 'fit' | 1 | 0.5 | 0.25 | custom number (<=1)
  let currentFocus = { x: 0.5, y: 0.5 }; // fraction of natural image currently centered

  function open(i) {
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
    lbImg.style.width = '';
    lbImg.style.height = '';
    lbImg.src = zoomed ? item.full : item.medium;
    lbImg.alt = item.title || item.caption || 'Photo';
    lbTitle.textContent = item.title || item.caption || '(untitled)';
    lbZoom.textContent = zoomed ? 'Back to normal size' : 'View full resolution';

    lbMeta.innerHTML = '';
    addMeta('File', item.original_filename);
    addMeta('Location', [item.category, item.subcategory].filter(Boolean).join(' – '));
    if (item.location) addMeta('Where', item.location);
    if (item.description) addMeta('Notes', item.description);
    const s = item.settings;
    if (s) {
      const bits = [];
      if (s.aperture) bits.push(s.aperture);
      if (s.shutter) bits.push(s.shutter);
      if (s.iso) bits.push(`ISO ${s.iso}`);
      if (s.focal) bits.push(s.focal);
      if (bits.length) addMeta('Settings', bits.join(' · '));
      if (s.lens) addMeta('Lens', s.lens);
      if (s.datetime) addMeta('Taken', s.datetime);
    }
  }

  function addMeta(label, value) {
    if (!value) return;
    const row = document.createElement('div');
    row.className = 'meta-row';
    const l = document.createElement('span');
    l.className = 'meta-label';
    l.textContent = label;
    const v = document.createElement('span');
    v.className = 'meta-value';
    v.textContent = value;
    row.appendChild(l);
    row.appendChild(v);
    lbMeta.appendChild(row);
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function step(delta) {
    const pos = flatOrder.indexOf(current);
    const nextPos = (pos + delta + flatOrder.length) % flatOrder.length;
    current = flatOrder[nextPos];
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
  lbZoom.addEventListener('click', () => { zoomed = !zoomed; render(); });

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
    if (!flatOrder.length) return;
    ssOrder = flatOrder.slice();
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
})();
