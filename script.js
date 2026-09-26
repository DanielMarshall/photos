(async function () {
  const main = document.getElementById('sections');
  const lightbox = document.getElementById('lightbox');
  const lbViewport = document.getElementById('lb-viewport');
  const lbImg = document.getElementById('lb-img');
  const lbInfo = document.querySelector('.lb-info');
  const lbTitle = document.getElementById('lb-title');
  const lbMeta = document.getElementById('lb-meta');
  const lbZoom = document.getElementById('lb-zoom');
  const lbFullscreenBtn = document.getElementById('lb-fullscreen-btn');
  const lbSampleBtns = document.getElementById('lb-sample-btns');
  const lbDetailBtns = document.getElementById('lb-detail-btns');
  const lbDetailHi = document.getElementById('lb-detail-hi');
  const cropBar = document.getElementById('crop-bar');
  const cropEditorBox = document.getElementById('crop-editor-box');
  const cropEditorControls = document.getElementById('crop-editor-controls');
  const ratioPicker = document.getElementById('ratio-picker');
  const addDetailBtn = document.getElementById('add-detail-btn');
  const removeDetailBtn = document.getElementById('remove-detail-btn');
  const exportCropsBtn = document.getElementById('export-crops-btn');
  const exportCountEl = document.getElementById('export-count');
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
  const viewSwitcher = document.getElementById('view-switcher');
  const lbHeart = document.getElementById('lb-heart');
  const heartCountEl = document.getElementById('heart-count');

  const res = await fetch('images.json?v=' + Date.now());
  const items = await res.json();

  const SECTION_ORDER = [
    ['Gladesville', 'Garden'],
    ['Gladesville', 'Ants'],
    ['Gladesville', 'Experiments in Liquids'],
    ['Gladesville', 'Dinosaurs'],
    ['Gladesville', 'Frank photos of Frankie'],
    ["Gladesville", "Michael's Flowers"],
    ["Gladesville", "Michael's Fender"],
    ["Gladesville", "Michael's Studio"],
    ['Gladesville', 'Banjo Paterson Park'],
    ['Gladesville', 'Boronia Park Reserve'],
    ['Gladesville', 'Planes'],
    ['Gladesville', 'People'],
    ['Gladesville', 'Uncategorized'],
    ['Gladesville', 'Moss'],
    ['Gladesville', 'Indoor Macro'],
    ['Hornsby Heights', null],
    ['Artarmon', null],
    ['Sydney CBD', null],
    ['Chinese Garden of Friendship', null],
    ['Sydney Town Hall', null],
    ['Queen Victoria Building', null],
    ['Darling Harbour Piano', null],
  ];

  const SECTION_LABELS = {
    'Gladesville|Garden': 'Gladesville: Garden',
    'Gladesville|Ants': 'Gladesville: Ants',
    'Gladesville|Banjo Paterson Park': 'Gladesville: Banjo Paterson Park',
    'Gladesville|Boronia Park Reserve': 'Gladesville: Boronia Park Reserve',
    'Gladesville|Experiments in Liquids': 'Gladesville: Experiments in Liquids',
    'Gladesville|Dinosaurs': 'The Last of the Dinosaurs',
    'Gladesville|Frank photos of Frankie': 'Frank photos of Frankie',
    "Gladesville|Michael's Flowers": "Michael's Flowers",
    "Gladesville|Michael's Fender": "Michael's Fender",
    "Gladesville|Michael's Studio": "Michael's Studio",
    'Gladesville|Moss': 'Gladesville: Moss',
    'Gladesville|Indoor Macro': 'Gladesville: Indoor Macro',
    'Gladesville|Planes': 'Gladesville: Planes',
    'Gladesville|People': 'Gladesville: Timmy',
    'Gladesville|Uncategorized': 'Gladesville: Night and Odd Shots',
    'Hornsby Heights|null': 'Hornsby Heights',
    'Artarmon|null': 'Artarmon',
    'Sydney CBD|null': 'Sydney CBD and Darling Harbour',
    'Sydney Town Hall|null': 'Sydney Town Hall: Ukraine Solidarity Protest',
    'Queen Victoria Building|null': 'Queen Victoria Building: Public Piano',
    'Chinese Garden of Friendship|null': 'Chinese Garden of Friendship',
    'Darling Harbour Piano|null': 'Darling Harbour: Street Piano',
  };

  // Shown on each category's card on the home view, and again as an intro
  // line in the category's own detail view.
  const SECTION_DESCRIPTIONS = {
    'Gladesville|Ants': "Ants rushing madly around a weed in the back yard. A narrow aperture let the flash freeze them as best it could; a lower flash power and wider aperture might still beat the sunlight for sharper shots, but it's a good idea of what to expect from ants in motion.",
    'Gladesville|Banjo Paterson Park': 'Shoreline macro and telephoto views across the bay to Abbotsford, where the Sydney Rowing Club and Abbotsford Rowing Club sit side by side.',
    'Gladesville|Boronia Park Reserve': 'A macro walk at Boronia Park Reserve -- spiders, a snail shell, seed pods and other finds.',
    'Gladesville|Garden': 'Backyard macro photography — spiders, insects, and other garden life, including focus-stacked composites.',
    'Gladesville|Experiments in Liquids': 'Macro tests of oil and glitter in liquid, exploring focus and lighting technique.',
    'Gladesville|Dinosaurs': "They like roasted almonds enough that they will fight each other off to see who gets to almost take off one of my fingers, and hang around for some photos afterwards, until Timmy came to investigate, and their extinction paranoia kicked in and they went to their next stop.",
    'Gladesville|Frank photos of Frankie': "Extreme close-up macro shots of Frankie's facial features. Don't ask about the eyeshadow.",
    "Gladesville|Michael's Flowers": 'Macro photos of a tiny flower arrangement Michael put together.',
    "Gladesville|Michael's Fender": "Michael dialling in the tone on his Fender bass amp.",
    "Gladesville|Michael's Studio": "Michael's new home studio, freshly set up in the living room — the same setup as his Fender amp session.",
    'Gladesville|Moss': 'Macro shots of a moss sample on the kitchen counter.',
    'Gladesville|Indoor Macro': "Macro shots of curious objects found around the house — an old hard drive, a mandarin peel, and a wine cork — plus a Farmer's Friend seed from the back yard, brought inside for tripod and coloured-light experiments.",
    'Gladesville|Planes': 'Planes photographed from the yard, some with the MC-20 teleconverter for extra reach.',
    'Gladesville|People': 'Timmy the dog, at home.',
    'Gladesville|Uncategorized': "A few photos that don't fit anywhere else yet.",
    'Hornsby Heights|null': "Family photos at mum and dad's house in Hornsby Heights.",
    'Artarmon|null': 'Portraits of colleagues at work in Artarmon.',
    'Sydney CBD|null': 'Snapshots around Darling Harbour and the Sydney CBD.',
    'Chinese Garden of Friendship|null': 'Water dragons and the waterfall at the Chinese Garden of Friendship, Darling Harbour.',
    'Sydney Town Hall|null': 'A Ukraine solidarity protest at Sydney Town Hall.',
    'Queen Victoria Building|null': 'The public piano, clock, and mall interior at the QVB.',
    'Darling Harbour Piano|null': 'A student playing the public piano at Darling Harbour.',
  };

  function groupKey(item) {
    return `${item.category}|${item.subcategory}`;
  }

  // A stack and its example slice are linked (build_data.py sets `sample` on
  // the stack and `sample_of` on the slice, each holding the other's
  // original_filename). Only the stack appears in the grids, category counts,
  // hover slideshows and the whole-site slideshow -- the slice is reached
  // from the stack's lightbox instead, so it doesn't distract from the
  // finished stack. It keeps its slot in `items` (and so its _index) since
  // the lightbox still opens it by index.
  const indexByOriginal = new Map();
  items.forEach((item, i) => indexByOriginal.set(item.original_filename, i));

  // Indexes of the photos this one links to: a stack's example slices, or a
  // slice's stack.
  function linkedIndices(item) {
    const partners = item.samples || (item.sample_of ? [item.sample_of] : []);
    return partners.map((name) => indexByOriginal.get(name)).filter((i) => i !== undefined);
  }

  // True for an example slice whose stack exists on the site. Slices get no
  // Final Frame/Detail crops of their own -- those belong to the stack.
  function isSlice(item) {
    return !!item.sample_of && indexByOriginal.has(item.sample_of);
  }

  const groups = new Map();
  items.forEach((item, i) => {
    item._index = i;
    if (isSlice(item)) return;
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

  // Chronological order (all non-slice items) -- items.json is already
  // datetime-sorted overall, so this is just "every real photo, in the order
  // it already comes in". Used by the Timeline view.
  const chronoOrder = items.map((item) => item._index).filter((i) => !isSlice(items[i]));

  // ---------------- Visitor hearts ----------------
  // Any visitor can heart photos; the set lives only in their own browser
  // (localStorage), keyed by each photo's slug (its thumbnail filename, which
  // is stable across rebuilds). The My Hearts view lets them copy or email
  // the list so friends can send the photographer their picks.
  const HEARTS_KEY = 'photoHearts';
  const HEART_NAME_KEY = 'photoHeartsName';
  const indexBySlug = new Map();
  items.forEach((item, i) => indexBySlug.set(slugOf(item), i));

  function slugOf(item) {
    return item.thumb.split('/').pop().replace(/\.[^.]+$/, '');
  }

  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode etc. */ }
  }

  // Kept in the order they were hearted, so the sent list reads the way the
  // visitor built it.
  let hearts = [];
  try {
    const saved = JSON.parse(storageGet(HEARTS_KEY) || '[]');
    if (Array.isArray(saved)) hearts = saved.filter((slug) => indexBySlug.has(slug));
  } catch (e) { hearts = []; }

  function isHearted(item) {
    return hearts.includes(slugOf(item));
  }

  function toggleHeart(item) {
    const slug = slugOf(item);
    hearts = isHearted(item) ? hearts.filter((s) => s !== slug) : hearts.concat(slug);
    storageSet(HEARTS_KEY, JSON.stringify(hearts));
    syncHearts();
  }

  // Every heart on the page (grid buttons, the lightbox button, the nav
  // count) reflects the same list, so update them all after any change.
  function syncHearts() {
    document.querySelectorAll('.heart-btn').forEach((btn) => {
      const on = hearts.includes(btn.dataset.slug);
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on);
      btn.innerHTML = on ? '&#9829;' : '&#9825;';
    });
    syncLbHeart();
    heartCountEl.hidden = !hearts.length;
    heartCountEl.textContent = hearts.length;
    updateSlideshowBtn();
    // The My Hearts grid itself changes when a heart is removed, but not
    // while a photo is open over it -- close() redraws it instead.
    if (location.hash === '#/hearts' && lightbox.hidden) renderHearts(true);
  }

  // Called on every route change and heart change. Looked up here rather than
  // via the slideshow's own const, since route() first runs before that code.
  function updateSlideshowBtn() {
    const btn = document.getElementById('slideshow-start');
    const inHearts = location.hash === '#/hearts';
    btn.innerHTML = inHearts ? '&#9654; Hearted slideshow' : '&#9654; Slideshow';
    btn.disabled = inHearts && !hearts.length;
  }

  function syncLbHeart() {
    if (current < 0) return;
    const on = isHearted(items[current]);
    lbHeart.classList.toggle('on', on);
    lbHeart.setAttribute('aria-pressed', on);
    lbHeart.innerHTML = on ? '&#9829; Hearted' : '&#9825; Heart';
  }

  function makeHeartBtn(item) {
    const btn = document.createElement('button');
    btn.className = 'heart-btn';
    btn.dataset.slug = slugOf(item);
    btn.setAttribute('aria-label', 'Heart this photo');
    const on = isHearted(item);
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on);
    btn.innerHTML = on ? '&#9829;' : '&#9825;';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleHeart(item);
    });
    return btn;
  }

  function sectionLabelOf(item) {
    return SECTION_LABELS[groupKey(item)] || item.category;
  }

  function photoLink(item) {
    return `${location.origin}${location.pathname}#/p/${slugOf(item)}`;
  }

  function heartsListText(name) {
    const who = name ? ` from ${name}` : '';
    const lines = [`Photo hearts${who} (${hearts.length} photo${hearts.length === 1 ? '' : 's'})`, ''];
    hearts.forEach((slug, n) => {
      const item = items[indexBySlug.get(slug)];
      lines.push(`${n + 1}. ${item.title || item.original_filename} (${sectionLabelOf(item)})`);
      lines.push(`   ${photoLink(item)}`);
    });
    return lines.join('\n');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Older browsers / non-secure contexts: fall back to a hidden textarea.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      ta.remove();
      return ok;
    }
  }

  function renderHearts(keepScroll) {
    document.body.classList.remove('home-view');
    const scrollY = window.scrollY;
    main.innerHTML = '';

    const section = document.createElement('section');
    section.className = 'photo-section hearts-view';

    const heading = document.createElement('h2');
    heading.textContent = 'My Hearts';
    section.appendChild(heading);

    const intro = document.createElement('p');
    intro.className = 'section-intro';
    intro.textContent = 'Tap the heart on any photo you think is one of the best. Your hearts are saved in this browser only. When you are happy with your list, copy it or email it to Dan to help pick the favourites.';
    section.appendChild(intro);

    if (!hearts.length) {
      const empty = document.createElement('p');
      empty.className = 'hearts-empty';
      empty.textContent = 'No hearts yet. Open Categories, Timeline or Map and tap the heart on a photo.';
      section.appendChild(empty);
      main.appendChild(section);
      if (!keepScroll) window.scrollTo(0, 0);
      return;
    }

    const send = document.createElement('div');
    send.className = 'hearts-send';
    send.innerHTML = `
      <label class="hearts-name-label">Your name
        <input type="text" class="hearts-name" id="hearts-name" placeholder="So Dan knows who sent it" autocomplete="name">
      </label>
      <div class="hearts-send-btns">
        <button class="hearts-btn primary" id="hearts-copy">Copy my list</button>
        <a class="hearts-btn" id="hearts-email" href="#">Email my list</a>
      </div>
      <p class="hearts-status" id="hearts-status" aria-live="polite"></p>
      <textarea class="hearts-fallback" id="hearts-fallback" readonly hidden></textarea>
    `;
    section.appendChild(send);

    const nameInput = send.querySelector('#hearts-name');
    const copyBtn = send.querySelector('#hearts-copy');
    const emailLink = send.querySelector('#hearts-email');
    const statusEl = send.querySelector('#hearts-status');
    const fallback = send.querySelector('#hearts-fallback');
    nameInput.value = storageGet(HEART_NAME_KEY) || '';

    // No address filled in: friends who send it already know where to.
    function updateEmailLink() {
      const name = nameInput.value.trim();
      const subject = `Photo hearts${name ? ` from ${name}` : ''}`;
      emailLink.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(heartsListText(name))}`;
    }
    updateEmailLink();
    nameInput.addEventListener('input', () => {
      storageSet(HEART_NAME_KEY, nameInput.value.trim());
      updateEmailLink();
    });

    copyBtn.addEventListener('click', async () => {
      const text = heartsListText(nameInput.value.trim());
      const ok = await copyText(text);
      if (ok) {
        fallback.hidden = true;
        statusEl.textContent = 'Copied! Paste it into a message to Dan.';
      } else {
        fallback.value = text;
        fallback.hidden = false;
        fallback.select();
        statusEl.textContent = "Couldn't copy automatically. Select the text below and copy it.";
      }
    });

    const grid = document.createElement('div');
    grid.className = 'grid';
    currentOrder = hearts.map((slug) => indexBySlug.get(slug));
    currentOrder.forEach((idx) => grid.appendChild(makeGridFigure(items[idx])));
    section.appendChild(grid);

    main.appendChild(section);
    if (keepScroll) window.scrollTo(0, scrollY);
    else window.scrollTo(0, 0);
  }

  // One photo tile for a .grid (category pages and My Hearts).
  function makeGridFigure(item) {
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
    fig.appendChild(makeHeartBtn(item));
    fig.addEventListener('click', () => open(item._index));
    return fig;
  }

  function renderHome() {
    document.body.classList.add('home-view');
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

      const thumbWrap = document.createElement('div');
      thumbWrap.className = 'card-thumb-wrap';

      const thumb = document.createElement('img');
      thumb.className = 'category-card-thumb';
      thumb.src = groupItems[0].thumb;
      thumb.alt = SECTION_LABELS[key] || cat;
      thumbWrap.appendChild(thumb);

      const shutterTop = document.createElement('div');
      shutterTop.className = 'shutter shutter-top';
      const shutterBottom = document.createElement('div');
      shutterBottom.className = 'shutter shutter-bottom';
      thumbWrap.appendChild(shutterTop);
      thumbWrap.appendChild(shutterBottom);

      card.appendChild(thumbWrap);

      // Hover: cycle through this category's thumbnails, swapping behind a
      // quick camera-shutter close/open rather than a straight cut.
      const SHUTTER_MS = 50;
      let hoverTimer = null;
      let shutterTimeout = null;
      let hoverPos = 0;

      function openShutters() {
        shutterTop.classList.remove('closed');
        shutterBottom.classList.remove('closed');
      }

      function goToThumb(index, animate) {
        if (!animate) {
          thumb.src = groupItems[index].thumb;
          openShutters();
          return;
        }
        shutterTop.classList.add('closed');
        shutterBottom.classList.add('closed');
        shutterTimeout = setTimeout(() => {
          thumb.src = groupItems[index].thumb;
          openShutters();
        }, SHUTTER_MS);
      }

      card.addEventListener('mouseenter', () => {
        if (groupItems.length < 2) return;
        hoverTimer = setInterval(() => {
          hoverPos = (hoverPos + 1) % groupItems.length;
          goToThumb(hoverPos, true);
        }, 700);
      });
      card.addEventListener('mouseleave', () => {
        clearInterval(hoverTimer);
        clearTimeout(shutterTimeout);
        hoverTimer = null;
        hoverPos = 0;
        goToThumb(0, false);
      });

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

    document.body.classList.remove('home-view');
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

    groupItems.forEach((item) => grid.appendChild(makeGridFigure(item)));

    section.appendChild(grid);

    if (cat === 'Gladesville' && sub === 'Experiments in Liquids') {
      const videoBlock = document.createElement('div');
      videoBlock.className = 'section-video';
      videoBlock.innerHTML = `
        <h3>Focus? What's That Again?</h3>
        <video controls playsinline preload="metadata" poster="video/glitter-oil-poster.jpg">
          <source src="video/glitter-oil-focus-attempts.mp4" type="video/mp4">
          Your browser doesn't support embedded video.
        </video>
        <p class="video-caption">Getting the focus right and an interesting enough shot seems to be the main challenges, but i might be more stable if I used less pizza boxes as structural supports. The MC-20 x2 magnification extender does make for more interesting shots I think, but requires a lot of stability and light. Works for flash, but not so good for backlight.</p>
      `;
      section.appendChild(videoBlock);
    }

    if (cat === 'Gladesville' && sub === 'Garden') {
      const videoBlock = document.createElement('div');
      videoBlock.className = 'section-video';
      videoBlock.innerHTML = `
        <h3>Why not every macro shot is a stack</h3>
        <video controls loop playsinline preload="metadata" poster="video/spider-poster.jpg">
          <source src="video/spider-focus-stack-audio.mp4" type="video/mp4">
          Your browser doesn't support embedded video.
        </video>
        <p class="video-caption">A focus-stack attempt derailed by the spider's own movement, played back at half speed. Most bursts above are single frames or small stacks rather than the full sequence for exactly this reason. Music generated with Gemini.</p>
      `;
      section.appendChild(videoBlock);
    }

    main.appendChild(section);
    window.scrollTo(0, 0);
  }

  // ---------------- Timeline view ----------------
  // A horizontally pannable/zoomable strip, grouped by calendar day. Zoomed
  // all the way out, each day is one small cluster marker (count + date).
  // Zooming in breaks a day open into its own individual thumbnails, which
  // then grow and pick up more label detail (date -> title -> full EXIF
  // settings) the larger they get -- one continuous zoom axis (thumbnail
  // pixel size) drives both the day-vs-item switch and the label detail.
  // `tlZoom` is the single value the wheel/pinch/drag controls, but it drives
  // two things at different rates: visual thumbnail size (thumbPxFor), which
  // saturates at TL_MAX_THUMB early, and the time axis's scale (tlPxPerDay),
  // which keeps growing well past that -- otherwise photos taken minutes or
  // seconds apart could never be pulled apart horizontally no matter how far
  // in you zoomed, since thumbnail size alone runs out of room fast relative
  // to how many pixels a burst actually needs to lay out one-after-another.
  const TL_MIN_ZOOM = 8;
  const TL_MAX_ZOOM = 800000;
  const TL_MAX_THUMB = 220;
  const TL_CLUSTER_BELOW = 22; // thumb px below this: show day clusters, not items
  const TL_GAP = 4;

  function thumbPxFor(zoom) {
    return Math.min(TL_MAX_THUMB, zoom);
  }

  function parseDt(s) {
    if (!s) return null;
    // "YYYY:MM:DD HH:MM:SS", parsed as naive wall-clock time so every viewer
    // (regardless of their own timezone) sees the same date/time components
    // the camera recorded.
    const d = new Date(s.replace(':', '-').replace(':', '-').replace(' ', 'T'));
    return isNaN(d) ? null : d;
  }

  function fmtShortDate(d) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function fmtDateTime(d) {
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
  function fmtTimeOnly(d) {
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }
  function settingsLine(s) {
    if (!s) return '';
    const bits = [];
    if (s.aperture) bits.push(s.aperture);
    if (s.shutter) bits.push(s.shutter);
    if (s.iso) bits.push(`ISO ${s.iso}`);
    if (s.focal) bits.push(s.focal);
    return bits.join(' · ');
  }

  let tlDayGroups = null;
  function getDayGroups() {
    if (tlDayGroups) return tlDayGroups;
    const map = new Map();
    chronoOrder.forEach((idx) => {
      const item = items[idx];
      const dt = parseDt(item.settings && item.settings.datetime);
      if (!dt) return;
      const key = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
      if (!map.has(key)) {
        map.set(key, { key, date: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()), indices: [] });
      }
      map.get(key).indices.push(idx);
    });
    tlDayGroups = Array.from(map.values()).sort((a, b) => a.date - b.date);
    const epoch = tlDayGroups.length ? tlDayGroups[0].date.getTime() : 0;
    tlDayGroups.forEach((g) => { g.dayOffset = (g.date.getTime() - epoch) / 86400000; });
    return tlDayGroups;
  }

  // ---------------- Map view ----------------
  // Checked: none of the source photos (including still-available raw .ORF
  // files from recent sessions) carry real GPS EXIF -- the camera never
  // recorded it, so there's no per-photo coordinate to plot even though the
  // published copies also had GPS stripped as a belt-and-braces privacy step.
  // Per the photographer: home, workplace and the parents' house should stay
  // masked to generic suburb-level pins (already all any of them are named as
  // in the photo captions); every public spot should be as precise as
  // possible instead, so a viewer could go find the same location. These
  // pins are hand-geocoded to the specific named landmark/park (not measured
  // GPS) -- a real improvement over a suburb blur, but still only as accurate
  // as general map knowledge; nudge lat/lng below if any look off.
  const PLACES = {
    gladesville: { label: 'Gladesville (home)', lat: -33.8367, lng: 151.1275, mask: true },
    artarmon: { label: 'Artarmon (work)', lat: -33.8113, lng: 151.1852, mask: true },
    hornsby: { label: "Hornsby Heights (mum & dad's)", lat: -33.6698, lng: 151.0989, mask: true },
    ashfield: { label: 'Ashfield', lat: -33.8886, lng: 151.1256 },
    banjo: { label: 'Banjo Paterson Park, Gladesville', lat: -33.8341, lng: 151.1301 },
    boronia: { label: 'Boronia Park Reserve, Hunters Hill', lat: -33.8250, lng: 151.1417 },
    darling: { label: 'Darling Harbour', lat: -33.8688, lng: 151.2005 },
    chinesegarden: { label: 'Chinese Garden of Friendship', lat: -33.8756, lng: 151.2038 },
    townhall: { label: 'Sydney Town Hall', lat: -33.8734, lng: 151.2064 },
    qvb: { label: 'Queen Victoria Building', lat: -33.8715, lng: 151.2067 },
    dhpiano: { label: 'Darling Harbour Piano', lat: -33.8709, lng: 151.2013 },
  };

  function placeKey(item) {
    // The 4 Darling Harbour-area landmarks share overlapping/identical
    // `location` text with each other and with plain Sydney CBD wandering
    // shots (e.g. the Piano's location is just "Darling Harbour, Sydney",
    // same as a generic CBD walk) -- category is what actually distinguishes
    // them.
    if (item.category === 'Chinese Garden of Friendship') return 'chinesegarden';
    if (item.category === 'Sydney Town Hall') return 'townhall';
    if (item.category === 'Queen Victoria Building') return 'qvb';
    if (item.category === 'Darling Harbour Piano') return 'dhpiano';
    const l = (item.location || '').toLowerCase();
    if (l.includes('banjo paterson')) return 'banjo';
    if (l.includes('boronia park')) return 'boronia';
    if (l.includes('darling harbour')) return 'darling';
    if (l.includes('hornsby heights')) return 'hornsby';
    if (l === 'artarmon') return 'artarmon';
    if (l === 'ashfield') return 'ashfield';
    return 'gladesville';
  }

  let mapPlaceGroups = null;
  function getPlaceGroups() {
    if (mapPlaceGroups) return mapPlaceGroups;
    const map = new Map();
    chronoOrder.forEach((idx) => {
      const key = placeKey(items[idx]);
      if (!map.has(key)) map.set(key, { key, place: PLACES[key], indices: [] });
      map.get(key).indices.push(idx);
    });
    mapPlaceGroups = Array.from(map.values());
    return mapPlaceGroups;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // The time axis's scale grows at 1.3px/day per zoom unit while thumbnails
  // are still growing (zoom <= TL_MAX_THUMB), then 10x faster -- 13 -- once
  // they have saturated (see thumbPxFor). A single *13 everywhere made the
  // angled stems / single-row squeeze arrive an order of magnitude sooner,
  // but it also pushed the minimum zoom's scale to 104px/day, so the
  // opening "whole date range" overview no longer fit on screen (Sep 17-26
  // started off the right-hand edge). Splitting the rate keeps the overview
  // and thumbnail growth exactly as they were, and only speeds up the part
  // past saturation, which is where all the extra scrolling was spent.
  // tlZoomForPxPerDay is the exact inverse, used by the initial auto-fit.
  const TL_SLOW_RATE = 1.3;
  const TL_FAST_RATE = 13;
  const TL_KNEE_PX = TL_MAX_THUMB * TL_SLOW_RATE;
  function tlPxPerDay(zoom) {
    if (zoom <= TL_MAX_THUMB) return Math.max(zoom * TL_SLOW_RATE, 26);
    return TL_KNEE_PX + (zoom - TL_MAX_THUMB) * TL_FAST_RATE;
  }
  function tlZoomForPxPerDay(px) {
    if (px <= TL_KNEE_PX) return px / TL_SLOW_RATE;
    return TL_MAX_THUMB + (px - TL_KNEE_PX) / TL_FAST_RATE;
  }
  function tlLabelLines(thumbPx) {
    if (thumbPx < 55) return 0;
    if (thumbPx < 95) return 1;
    if (thumbPx < 150) return 2;
    return 3;
  }

  const TL_LANE_GAP = 10; // distance from the axis to the nearest lane's near edge

  let tlZoom = 60;
  let tlPanPx = 0;
  let tlViewportEl = null;
  let tlTrackEl = null;
  let tlClusterLayer = null;
  let tlItemLayer = null;
  let tlStemLayer = null;
  let tlDayLabelLayer = null;
  let tlItemNodes = new Map(); // item index -> { wrap, img, lines: [el,el,el] }
  let tlClusterNodes = new Map(); // day key -> element
  let tlStemNodes = new Map(); // item index -> element
  let tlDayLabelNodes = new Map(); // day key -> element
  let tlLayoutScheduled = false;

  function scheduleTlLayout() {
    if (tlLayoutScheduled) return;
    tlLayoutScheduled = true;
    requestAnimationFrame(() => { tlLayoutScheduled = false; layoutTimeline(); });
  }

  function tlZoomTo(newZoom, cursorX) {
    newZoom = Math.min(TL_MAX_ZOOM, Math.max(TL_MIN_ZOOM, newZoom));
    if (newZoom === tlZoom) return;
    const oldPxPerDay = tlPxPerDay(tlZoom);
    const newPxPerDay = tlPxPerDay(newZoom);
    const trackX = cursorX - tlPanPx;
    tlPanPx = cursorX - trackX * (newPxPerDay / oldPxPerDay);
    tlZoom = newZoom;
    scheduleTlLayout();
  }

  function computeClusterLayout(groupsList, pxPerDay) {
    let runningRight = -Infinity;
    const blocks = [];
    groupsList.forEach((g) => {
      const idealX = g.dayOffset * pxPerDay;
      const dot = Math.max(14, Math.min(34, 10 + Math.sqrt(g.indices.length) * 6));
      const x = Math.max(idealX, runningRight + TL_GAP * 4);
      blocks.push({ group: g, x, width: dot, height: dot });
      runningRight = x + dot;
    });
    return { blocks, totalWidth: runningRight + 400 };
  }

  function ensureClusterNode(key) {
    let el = tlClusterNodes.get(key);
    if (el) return el;
    el = document.createElement('div');
    el.className = 'tl-cluster';
    el.innerHTML = '<div class="tl-cluster-dot"></div><div class="tl-cluster-label"></div>';
    tlClusterLayer.appendChild(el);
    tlClusterNodes.set(key, el);
    return el;
  }

  function ensureItemNode(idx) {
    let node = tlItemNodes.get(idx);
    if (node) return node;
    const item = items[idx];
    const wrap = document.createElement('figure');
    wrap.className = 'tl-item';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = item.thumb;
    img.alt = item.title || item.caption || 'Photo';
    wrap.appendChild(img);
    const lines = [0, 1, 2].map(() => {
      const l = document.createElement('figcaption');
      l.className = 'tl-item-line';
      wrap.appendChild(l);
      return l;
    });
    // The viewport captures the pointer for drag/pinch (see
    // attachTimelineGestures), which under pointer capture can leave the
    // browser's own synthesized "click" un-fired on this nested element --
    // so taps are detected directly from the pointerup coordinates instead
    // (see endPointer below), via this expando rather than a click listener.
    wrap.__tlTap = () => {
      currentOrder = chronoOrder;
      open(idx);
    };
    tlItemLayer.appendChild(wrap);
    node = { wrap, img, lines };
    tlItemNodes.set(idx, node);
    return node;
  }

  function ensureStemNode(idx) {
    let el = tlStemNodes.get(idx);
    if (el) return el;
    el = document.createElement('div');
    el.className = 'tl-stem';
    tlStemLayer.appendChild(el);
    tlStemNodes.set(idx, el);
    return el;
  }

  function ensureDayLabelNode(key) {
    let el = tlDayLabelNodes.get(key);
    if (el) return el;
    el = document.createElement('div');
    el.className = 'tl-day-label';
    tlDayLabelLayer.appendChild(el);
    tlDayLabelNodes.set(key, el);
    return el;
  }

  function layoutClusters(blocks) {
    const seen = new Set();
    blocks.forEach(({ group, x, width, height }) => {
      seen.add(group.key);
      const el = ensureClusterNode(group.key);
      el.style.left = `${x}px`;
      el.style.top = `${(tlViewportEl.clientHeight - height) / 2}px`;
      const dot = el.querySelector('.tl-cluster-dot');
      dot.style.width = `${width}px`;
      dot.style.height = `${height}px`;
      dot.textContent = group.indices.length;
      el.querySelector('.tl-cluster-label').textContent = fmtShortDate(group.date);
      el.__tlTap = () => {
        tlZoom = 100;
        tlPanPx = -(group.dayOffset * tlPxPerDay(tlZoom)) + tlViewportEl.clientWidth / 2;
        scheduleTlLayout();
      };
    });
    tlClusterNodes.forEach((el, key) => { el.style.display = seen.has(key) ? '' : 'none'; });
  }

  // Every photo sits at its own exact-timestamp x position, one row deep on
  // the center axis whenever there's room; when photos are close enough in
  // time that their thumbnails would overlap at the current zoom, later ones
  // fan out into "lanes" above/below the axis instead of ever moving off
  // their true time position horizontally (a classic timeline/Gantt lane
  // assignment: greedy first-fit, alternating sides so it grows evenly).
  // A straight line is just this at 0/180 degrees -- one drawing routine for
  // both the ordinary vertical stem and a nudged, angled one.
  function positionStemLine(el, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    el.style.left = `${x1}px`;
    el.style.top = `${y1}px`;
    el.style.width = `${Math.hypot(dx, dy)}px`;
    el.style.transform = `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)`;
  }

  function layoutIndividualItems(groupsList, pxPerDay, thumbPx, labelLines) {
    const epoch = groupsList.length ? groupsList[0].date.getTime() : 0;
    const contentH = thumbPx + (labelLines > 0 ? labelLines * 13 + 4 : 0);
    const laneH = contentH + TL_GAP;
    const centerY = tlViewportEl.clientHeight / 2;
    const halfW = thumbPx / 2 + TL_GAP / 2;

    const laneEndX = new Map(); // signed lane key -> rightmost occupied x in that lane
    function assignLane(x) {
      for (let r = 1; r < 200; r++) {
        for (const side of [1, -1]) {
          const key = side * r;
          const end = laneEndX.get(key);
          if (end === undefined || x - halfW >= end) {
            laneEndX.set(key, x + halfW);
            return key;
          }
        }
      }
      return 1; // pathological fallback; practically unreachable
    }

    // Pass 1: true time position + the lane the ordinary above/below fan
    // would need. Once that never needs more than one lane per side *for
    // whatever's actually on screen*, further zooming condenses it onto a
    // single shared row instead of keeping two -- "pushing all images along
    // the same timeline". Judged only over the visible range (with a little
    // margin either side, so it doesn't flicker right at the viewport edge):
    // a real photo library almost always has some tight burst *somewhere*
    // (a few frames a second apart), and requiring the entire dataset to fit
    // one lane before ever condensing would mean it could never happen at
    // all just because of one cluster you've since zoomed/panned away from.
    // The margin is a handful of thumbnail-widths, not a whole viewport --
    // large enough to avoid flicker right at the edge, but small enough that
    // a dense day just outside the current view doesn't reach in and block
    // squeeze mode for an already-sparse visible area (a full viewport-width
    // margin was tried first and did exactly that: at any normal zoom level
    // it's wide enough to still catch a neighboring shoot day).
    const viewLeft = -tlPanPx;
    const viewRight = viewLeft + tlViewportEl.clientWidth;
    const viewMargin = thumbPx * 4;
    const positioned = [];
    let maxVisibleRank = 0;
    chronoOrder.forEach((idx) => {
      const item = items[idx];
      const dt = parseDt(item.settings && item.settings.datetime);
      if (!dt) return;
      const x = ((dt.getTime() - epoch) / 86400000) * pxPerDay;
      const lane = assignLane(x);
      if (x >= viewLeft - viewMargin && x <= viewRight + viewMargin) {
        maxVisibleRank = Math.max(maxVisibleRank, Math.abs(lane));
      }
      positioned.push({ idx, item, dt, x, lane });
    });

    // Pass 2 (only in the single-row regime): photos too close in time to
    // literally sit at their own x are nudged right just enough to clear
    // their neighbor -- their real position never changes, only where this
    // draws them -- so the connecting stem (below) ends up angled from the
    // nudged thumbnail back down to where it really belongs on the axis.
    const squeeze = maxVisibleRank <= 1;
    if (squeeze) {
      let nextLeft = -Infinity;
      positioned.forEach((p) => {
        const left = Math.max(p.x - thumbPx / 2, nextLeft);
        p.drawX = left + thumbPx / 2;
        nextLeft = left + thumbPx + TL_GAP;
      });
    }

    const seenItems = new Set();
    const dayRanges = new Map(); // day key -> {minX, maxX, minDt, maxDt, date}
    let maxRight = 0;

    positioned.forEach(({ idx, item, dt, x, lane, drawX }) => {
      const side = squeeze ? 1 : lane > 0 ? 1 : -1;
      const rank = squeeze ? 1 : Math.abs(lane);
      const renderX = squeeze ? drawX : x;
      const anchorDist = TL_LANE_GAP + (rank - 1) * laneH;
      const wrapTop = side > 0 ? centerY - anchorDist - contentH : centerY + anchorDist;

      seenItems.add(idx);
      maxRight = Math.max(maxRight, renderX + halfW, x + halfW);

      const node = ensureItemNode(idx);
      node.wrap.style.left = `${renderX - thumbPx / 2}px`;
      node.wrap.style.top = `${wrapTop}px`;
      node.wrap.style.width = `${thumbPx}px`;
      node.img.style.width = `${thumbPx}px`;
      node.img.style.height = `${thumbPx}px`;
      const text = [fmtDateTime(dt), item.title || item.caption || '', settingsLine(item.settings)];
      node.lines.forEach((el, li) => {
        el.hidden = li >= labelLines;
        el.textContent = text[li] || '';
      });
      node.wrap.style.display = '';

      // Straight when this photo sits at its real time position (the usual
      // case); angled whenever a nudge moved it, pointing from the drawn
      // thumbnail back to its true spot on the axis.
      const stem = ensureStemNode(idx);
      const nearY = side > 0 ? wrapTop + contentH : wrapTop;
      positionStemLine(stem, x, centerY, renderX, nearY);
      stem.style.display = '';

      const dayKey = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
      const range = dayRanges.get(dayKey);
      if (!range) {
        dayRanges.set(dayKey, { minX: x, maxX: x, minDt: dt, maxDt: dt, date: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()) });
      } else {
        range.minX = Math.min(range.minX, x);
        range.maxX = Math.max(range.maxX, x);
        if (dt < range.minDt) range.minDt = dt;
        if (dt > range.maxDt) range.maxDt = dt;
      }
    });

    tlItemNodes.forEach((node, idx) => { if (!seenItems.has(idx)) node.wrap.style.display = 'none'; });
    tlStemNodes.forEach((el, idx) => { if (!seenItems.has(idx)) el.style.display = 'none'; });

    // Shared per-day date/time label, standing in for individual labels
    // until photos are large enough to carry their own -- so the timeline
    // never goes from "day, N photos" straight to bare unlabeled thumbnails.
    const seenDayLabels = new Set();
    dayRanges.forEach((range, key) => {
      seenDayLabels.add(key);
      const el = ensureDayLabelNode(key);
      const sameTime = range.maxDt - range.minDt < 2 * 60 * 1000;
      el.textContent = sameTime
        ? `${fmtShortDate(range.date)} · ${fmtTimeOnly(range.minDt)}`
        : `${fmtShortDate(range.date)} · ${fmtTimeOnly(range.minDt)}–${fmtTimeOnly(range.maxDt)}`;
      el.style.left = `${(range.minX + range.maxX) / 2}px`;
    });
    tlDayLabelNodes.forEach((el, key) => { el.style.display = seenDayLabels.has(key) ? '' : 'none'; });

    return maxRight + 200;
  }

  function layoutTimeline() {
    if (!tlViewportEl) return;
    const groupsList = getDayGroups();
    const thumbPx = thumbPxFor(tlZoom);
    const clustered = thumbPx < TL_CLUSTER_BELOW;
    const pxPerDay = tlPxPerDay(tlZoom);
    const labelLines = tlLabelLines(thumbPx);

    tlClusterLayer.style.display = clustered ? '' : 'none';
    tlItemLayer.style.display = clustered ? 'none' : '';
    tlStemLayer.style.display = clustered ? 'none' : '';
    tlDayLabelLayer.style.display = !clustered && labelLines === 0 ? '' : 'none';

    let totalWidth;
    if (clustered) {
      const layout = computeClusterLayout(groupsList, pxPerDay);
      totalWidth = layout.totalWidth;
      layoutClusters(layout.blocks);
    } else {
      totalWidth = layoutIndividualItems(groupsList, pxPerDay, thumbPx, labelLines);
    }
    tlTrackEl.style.width = `${totalWidth}px`;
    tlTrackEl.style.transform = `translateX(${tlPanPx}px)`;
  }

  function attachTimelineGestures(viewport) {
    const pointers = new Map();
    let dragLast = null;
    let dragMoved = false;
    let pinchStartDist = null;
    let pinchStartPx = null;

    const dist = (pts) => Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);

    viewport.addEventListener('pointerdown', (e) => {
      viewport.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      dragMoved = false;
      if (pointers.size === 2) {
        pinchStartDist = dist(Array.from(pointers.values()));
        pinchStartPx = tlZoom;
        dragLast = null;
      } else {
        dragLast = { x: e.clientX, y: e.clientY };
      }
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinchStartDist) {
        const pts = Array.from(pointers.values());
        const scale = dist(pts) / pinchStartDist;
        const midX = (pts[0].x + pts[1].x) / 2 - viewport.getBoundingClientRect().left;
        tlZoomTo(pinchStartPx * scale, midX);
        return;
      }
      if (dragLast) {
        const dx = e.clientX - dragLast.x;
        const dy = e.clientY - dragLast.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
        tlPanPx += dx;
        dragLast = { x: e.clientX, y: e.clientY };
        scheduleTlLayout();
      }
    });
    const endPointer = (e) => {
      const wasTap = pointers.size === 1 && !dragMoved;
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStartDist = null;
      if (pointers.size === 0) dragLast = null;
      // The viewport holds pointer capture for the drag/pinch gesture above,
      // which can leave the browser's own "click" un-fired on the tapped
      // child -- so a plain tap (no drag) is resolved here instead, by
      // hit-testing whatever DOM element is actually at the release point.
      if (wasTap) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const target = el && el.closest('.tl-item, .tl-cluster');
        if (target && target.__tlTap) target.__tlTap();
      }
    };
    viewport.addEventListener('pointerup', endPointer);
    viewport.addEventListener('pointercancel', endPointer);
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      tlZoomTo(tlZoom * Math.pow(1.0022, -e.deltaY), cursorX);
    }, { passive: false });
  }

  function renderTimeline() {
    document.body.classList.remove('home-view');
    main.innerHTML = '';

    const view = document.createElement('div');
    view.className = 'timeline-view';
    view.innerHTML = `
      <p class="tl-hint">Scroll or pinch to zoom &middot; drag to pan &middot; click a photo to open it</p>
      <div class="tl-viewport" id="tl-viewport">
        <div class="tl-track" id="tl-track">
          <div class="tl-axis"></div>
          <div class="tl-stems" id="tl-stems"></div>
          <div class="tl-clusters" id="tl-clusters"></div>
          <div class="tl-day-labels" id="tl-day-labels"></div>
          <div class="tl-items" id="tl-items"></div>
        </div>
      </div>
    `;
    main.appendChild(view);

    tlViewportEl = view.querySelector('#tl-viewport');
    tlTrackEl = view.querySelector('#tl-track');
    tlClusterLayer = view.querySelector('#tl-clusters');
    tlItemLayer = view.querySelector('#tl-items');
    tlStemLayer = view.querySelector('#tl-stems');
    tlDayLabelLayer = view.querySelector('#tl-day-labels');
    tlItemNodes = new Map();
    tlClusterNodes = new Map();
    tlStemNodes = new Map();
    tlDayLabelNodes = new Map();

    const groupsList = getDayGroups();
    if (groupsList.length) {
      // Default to an overview that fits the whole date range in view.
      const span = groupsList[groupsList.length - 1].dayOffset - groupsList[0].dayOffset || 1;
      requestAnimationFrame(() => {
        const width = tlViewportEl.clientWidth || 1000;
        // span is start-of-first-day to start-of-last-day, so the last day's
        // own photos need one more day of room, plus the 40px pan inset on
        // both sides -- plain width / span put that whole day off the right.
        tlZoom = Math.min(TL_MAX_ZOOM, Math.max(TL_MIN_ZOOM, tlZoomForPxPerDay((width - 80) / (span + 1))));
        tlPanPx = 40;
        layoutTimeline();
      });
    }

    attachTimelineGestures(tlViewportEl);
    currentOrder = chronoOrder;
  }

  window.addEventListener('resize', () => { if (tlViewportEl && tlViewportEl.isConnected) scheduleTlLayout(); });

  const MAP_CLUSTER_ZOOM = 13; // below this Leaflet zoom level: place clusters. At/above: individual thumbnails.

  function mapThumbPx(zoom) {
    return Math.min(160, Math.max(36, (zoom - MAP_CLUSTER_ZOOM) * 42 + 36));
  }
  let mapInstance = null;
  const mapMarkers = new Map(); // place key -> L.Marker
  // The one place currently browsed in the side panel -- only one at a time
  // by construction (there's a single panel), cleared on deselect (clicking
  // empty map or the panel's close button) or leaving/re-entering the view.
  let mapSelectedKey = null;
  const MAP_STACK_DEPTH = 12; // visual layers max -- the count badge still shows the real total
  let mapPanelEl = null;
  let mapPanelHeaderEl = null;
  let mapPanelGridEl = null;

  function mapZoomToPlace(group) {
    mapInstance.setView([group.place.lat, group.place.lng], MAP_CLUSTER_ZOOM + 1.5, { animate: true });
  }

  // These build plain HTML strings, not L.divIcon objects -- see
  // upsertMarker() for why: a divIcon has to be centered via a real
  // `iconAnchor` (measured from this HTML once it's actually in the DOM),
  // never via a CSS transform on the content, or the marker's visual
  // position and its actual clickable area quietly drift apart.
  function clusterIconHtml(group) {
    // Masked places (home/work/parents) get a visibly different (muted)
    // dot -- an honest signal that this pin is a deliberate generalization,
    // not this photo's real spot, the way the precise ones are.
    return `<div class="map-cluster">
      <div class="map-cluster-dot${group.place.mask ? ' masked' : ''}">${group.indices.length}</div>
      <div class="map-cluster-label">${escapeHtml(group.place.label)}${group.place.mask ? ' <span class="map-mask-note">(approx.)</span>' : ''}</div>
    </div>`;
  }

  // The place currently open in the side panel: collapses back to a compact,
  // highlighted pin instead of growing a grid on the map itself, so the
  // panel is the only place its photos are browsed and the pin's real
  // location stays visible and unobscured.
  function activeIconHtml(group) {
    return `<div class="map-cluster map-active">
      <div class="map-cluster-dot active">${group.indices.length}</div>
      <div class="map-cluster-label active">${escapeHtml(group.place.label)}${group.place.mask ? ' <span class="map-mask-note">(approx.)</span>' : ''}</div>
    </div>`;
  }

  // A place with more than one photo: a single representative thumbnail with
  // real photos from the same place peeking out behind it (capped at
  // MAP_STACK_DEPTH layers purely for how it looks -- a stack of 169 offset
  // photos would just be noise), plus a count badge with the real total.
  // Replaces the old on-map grid entirely -- every place, capped or not,
  // reads as "here's a stack, click it" and opens the side panel; growing a
  // full grid in place (even when alone in view) always risked being its own
  // kind of visual mess at 100+ photos.
  function stackIconHtml(group, thumbPx) {
    const n = group.indices.length;
    const depth = Math.min(n, MAP_STACK_DEPTH);
    const step = 4;
    const boxSize = thumbPx + (depth - 1) * step;
    let layers = '';
    for (let i = depth - 1; i >= 0; i--) {
      const item = items[group.indices[i]];
      const off = i * step;
      layers += `<img class="map-stack-layer" style="width:${thumbPx}px;height:${thumbPx}px;left:${off}px;top:${off}px;z-index:${depth - i}" src="${item.thumb}" loading="lazy" alt="">`;
    }
    const maskNote = group.place.mask ? ' <span class="map-mask-note">(approx.)</span>' : '';
    return `<div class="map-cluster map-stack${group.place.mask ? ' masked' : ''}">
      <div class="map-stack-photos" style="width:${boxSize}px;height:${boxSize}px">
        ${layers}
        <div class="map-stack-count${group.place.mask ? ' masked' : ''}">${n}</div>
      </div>
      <div class="map-cluster-label">${escapeHtml(group.place.label)}${maskNote}</div>
    </div>`;
  }

  // Centers a divIcon on its marker's lat/lng via a real Leaflet `iconAnchor`
  // (measured from the actual rendered content) rather than a CSS transform.
  // A transform only moves where the content *paints* -- Leaflet's own click
  // handling is bound to the icon wrapper's untransformed layout box, so a
  // transform-centered marker's clickable area silently only overlaps a
  // quarter of what's visible (whichever corner the shift happens to leave
  // behind), making clicks work "at random" depending on exactly where within
  // the marker you click. Costs a second layout pass to measure, but these
  // are simple divs and there are only a handful of markers.
  function upsertMarker(group, html, attachClick) {
    let marker = mapMarkers.get(group.key);
    const provisional = L.divIcon({ html, className: 'map-icon-wrap', iconSize: null });
    if (!marker) {
      marker = L.marker([group.place.lat, group.place.lng], { icon: provisional }).addTo(mapInstance);
      attachClick(marker);
      mapMarkers.set(group.key, marker);
    } else {
      marker.setIcon(provisional);
    }
    const el = marker.getElement();
    const w = el && el.offsetWidth;
    const h = el && el.offsetHeight;
    if (w && h) {
      marker.setIcon(L.divIcon({ html, className: 'map-icon-wrap', iconSize: [w, h], iconAnchor: [w / 2, h / 2] }));
    }
    return marker;
  }

  // All of a place's photos, 2 columns wide, scrolling if they don't fit --
  // opened by clicking a capped grid's "+N more" instead of expanding it in
  // place, so only one place is ever "open" at a time and its pin can stay a
  // small, unobscured, highlighted marker rather than growing into a big grid
  // that might overlap its neighbors.
  function openMapPanel(group) {
    mapSelectedKey = group.key;
    mapPanelHeaderEl.textContent = `${group.place.label} · ${group.indices.length} photo${group.indices.length === 1 ? '' : 's'}`;
    mapPanelGridEl.innerHTML = '';
    group.indices.forEach((idx) => {
      const item = items[idx];
      const fig = document.createElement('figure');
      fig.className = 'map-panel-item';
      const img = document.createElement('img');
      img.src = item.thumb;
      img.loading = 'lazy';
      img.alt = '';
      const cap = document.createElement('figcaption');
      cap.textContent = item.title || item.caption || '';
      fig.append(img, cap, makeHeartBtn(item));
      fig.addEventListener('click', () => {
        currentOrder = chronoOrder;
        open(idx);
      });
      mapPanelGridEl.appendChild(fig);
    });
    mapPanelEl.hidden = false;
  }

  function closeMapPanel() {
    mapPanelEl.hidden = true;
    mapSelectedKey = null;
    layoutMapMarkers();
  }

  function layoutMapMarkers() {
    const zoom = mapInstance.getZoom();
    const clustered = zoom < MAP_CLUSTER_ZOOM;
    const thumbPx = mapThumbPx(zoom);
    const groups = getPlaceGroups();
    groups.forEach((group) => {
      const active = group.key === mapSelectedKey;
      const html = active ? activeIconHtml(group)
        : clustered ? clusterIconHtml(group)
        : stackIconHtml(group, thumbPx);
      upsertMarker(group, html, (marker) => {
        marker.on('click', (e) => {
          if (e.originalEvent.target.closest('.map-active')) {
            closeMapPanel();
            return;
          }
          // Any stack (capped preview or not) opens the side panel rather
          // than ever growing a grid in place.
          if (e.originalEvent.target.closest('.map-stack')) {
            openMapPanel(group);
            layoutMapMarkers();
            return;
          }
          mapZoomToPlace(group);
        });
      });
    });
  }

  function renderMap() {
    document.body.classList.remove('home-view');
    // Re-entering the Map view (e.g. Categories -> Map -> Categories -> Map)
    // would otherwise leak the previous Leaflet instance and its listeners,
    // since #sections gets wiped and a fresh #map-viewport div created each time.
    if (mapInstance) { mapInstance.remove(); mapInstance = null; }
    main.innerHTML = '';

    const view = document.createElement('div');
    view.className = 'timeline-view';
    view.innerHTML = `
      <p class="tl-hint">Scroll or pinch to zoom &middot; drag to pan &middot; click a place, then a photo</p>
      <div class="map-view-wrap">
        <div class="map-viewport" id="map-viewport"></div>
        <div class="map-side-panel" id="map-side-panel" hidden>
          <button class="map-panel-close" id="map-panel-close" aria-label="Close">&times;</button>
          <div class="map-panel-header" id="map-panel-header"></div>
          <div class="map-panel-scroll">
            <div class="map-panel-grid" id="map-panel-grid"></div>
          </div>
        </div>
      </div>
    `;
    main.appendChild(view);

    mapPanelEl = view.querySelector('#map-side-panel');
    mapPanelHeaderEl = view.querySelector('#map-panel-header');
    mapPanelGridEl = view.querySelector('#map-panel-grid');
    mapPanelEl.querySelector('#map-panel-close').addEventListener('click', closeMapPanel);

    mapMarkers.clear();
    mapSelectedKey = null;
    // Zoom control moved off the default top-left, which the side panel
    // occupies once a place is open.
    mapInstance = L.map('map-viewport', { attributionControl: true, zoomControl: false });
    L.control.zoom({ position: 'topright' }).addTo(mapInstance);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    const groupsList = getPlaceGroups();
    const bounds = L.latLngBounds(groupsList.map((g) => [g.place.lat, g.place.lng]));
    mapInstance.fitBounds(bounds, { padding: [60, 60], maxZoom: MAP_CLUSTER_ZOOM - 1 });

    mapInstance.on('zoomend moveend', layoutMapMarkers);
    // Clicking empty map (not a marker -- Leaflet markers don't bubble their
    // clicks up to the map by default) closes the side panel.
    mapInstance.on('click', () => {
      if (mapSelectedKey) closeMapPanel();
    });
    layoutMapMarkers();
    currentOrder = chronoOrder;

    // The view container isn't sized until it's in the layout -- Leaflet
    // measures its container on init, so a late invalidateSize catches the
    // case where fonts/layout shift the height slightly after that.
    requestAnimationFrame(() => mapInstance.invalidateSize());
  }

  function setActiveView(name) {
    viewSwitcher.querySelectorAll('.view-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === name);
    });
  }

  function route() {
    updateSlideshowBtn();
    const m = location.hash.match(/^#\/c\/(.+)$/);
    if (m) {
      const key = decodeURIComponent(m[1]);
      if (groups.has(key)) {
        setActiveView('home');
        return renderCategory(key);
      }
    }
    if (location.hash === '#/timeline') {
      setActiveView('timeline');
      return renderTimeline();
    }
    if (location.hash === '#/map') {
      setActiveView('map');
      return renderMap();
    }
    if (location.hash === '#/hearts') {
      setActiveView('hearts');
      return renderHearts();
    }
    // A shared photo link (from a sent hearts list): show its category with
    // the photo open, then swap the address to the category so closing the
    // photo and re-opening the same link both behave normally.
    const p = location.hash.match(/^#\/p\/(.+)$/);
    if (p && indexBySlug.has(decodeURIComponent(p[1]))) {
      const item = items[indexBySlug.get(decodeURIComponent(p[1]))];
      const key = groupKey(isSlice(item) ? items[indexByOriginal.get(item.sample_of)] : item);
      history.replaceState(null, '', `#/c/${encodeURIComponent(key)}`);
      setActiveView('home');
      renderCategory(key);
      // Deferred: on first load route() runs before the lightbox code below
      // has been set up.
      setTimeout(() => open(item._index));
      return;
    }
    currentOrder = globalOrder;
    setActiveView('home');
    renderHome();
  }

  window.addEventListener('hashchange', route);
  heartCountEl.hidden = !hearts.length;
  heartCountEl.textContent = hearts.length;
  route();

  let current = -1;
  let zoomed = false; // viewing the full-resolution source (vs medium)
  let fullLoaded = false;
  let zoomScale = 'fit'; // 'fit' | 1 | 0.5 | 0.25 | custom number (<=1)

  // The full-resolution image is fetched with progress and kept as a blob
  // URL for as long as we're on the same photo, so toggling back and forth
  // doesn't re-download it. Released whenever we move to a different photo.
  let fullObjectURL = null;
  let loadToken = 0;

  // Set by a "View detail" button so that, once the full-resolution image
  // has loaded, the lightbox lands on that detail rather than the Final Frame.
  let pendingView = null;

  function releaseFullObjectURL() {
    pendingView = null;
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

  // Curated "Final Frame" / "Detail" crops for the full-resolution view.
  // Specs are given as a center point + a standard aspect ratio + a size
  // (fraction of the image's natural height) so the actual crop rectangle
  // is computed correctly against each photo's real pixel dimensions,
  // rather than guessing width/height fractions by hand. Every entry here
  // was set by the photographer in the crop editor. Any photo without an
  // entry still gets a "Final Frame" button, which shows the whole image.
  const CROPS = {
    'Orb Weaver1.jpg': {
      final: { ratio: [3, 2], center: [0.500864561100154, 0.3651296829971182], size: 0.5236131123919308 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5248559427570341, 0.3569884726224784], size: 0.3117936104106629 },
      ],
    },
    'Orb Weaver2.jpg': {
      final: { ratio: [1, 1], center: [0.5354430379746835, 0.47524613220815753], size: 0.6754746835443037 },
    },
    'Orb Weaver3.jpg': {
      final: { ratio: [1, 1], center: [0.5442048727596109, 0.5355336892747573], size: 0.4680731364275668 },
    },
    'Spider back.jpg': {
      final: { ratio: [4, 5], center: [0.6955867127266709, 0.3047514988285933], size: 0.3727305475504322 },
    },
    'Grub Stack PMax.jpg': {
      final: { ratio: [1, 1], center: [0.5465525123878241, 0.40223914898741103], size: 0.7880220038656199 },
      details: [
        { label: "Detail #1", ratio: [3, 2], center: [0.5835397428490615, 0.30345488742672405], size: 0.2018953962601729 },
      ],
    },
    'Grub and Slug.jpg': {
      final: { ratio: [3, 2], center: [0.5794300569943399, 0.3738399493383645], size: 0.747679898676729 },
    },
    '11092026_200012P9111035 under spider stack.jpg': {
      final: { ratio: [3, 2], center: [0.5143236538192776, 0.5962327705875108], size: 0.7654657991561022 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.4010179785183055, 0.5663028736000029], size: 0.15363306068851362 },
      ],
    },
    '11092026_200200P9111040.jpg': {
      final: { ratio: [1, 1], center: [0.36976815727223383, 0.4410695757025882], size: 0.83398600896558 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.4737328134619331, 0.39002834659457797], size: 0.18866750476461167 },
      ],
    },
    '11092026_200213P9111041.jpg': {
      final: { ratio: [1, 1], center: [0.625, 0.5], size: 0.9721620423159762 },
    },
    '11092026_200240P9111043.jpg': {
      final: { ratio: [3, 2], center: [0.5133786891165125, 0.43351070568858485], size: 0.8572912707462309 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.42945782102202545, 0.2178259217027746], size: 0.25 },
      ],
    },
    'Spider underside.jpg': {
      final: { ratio: [4, 5], center: [0.4720263773018377, 0.6086532370454834], size: 0.4711294818193335 },
    },
    '11092026_200243P9111044.jpg': {
      final: { ratio: [3, 2], center: [0.5352710894889873, 0.41729380463702015], size: 0.8153258161239918 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.903817511069725, 0.15458000760167234], size: 0.25 },
      ],
    },
    '11092026_200244P9111045.jpg': {
      final: { ratio: [3, 2], center: [0.5074900228050171, 0.48702647915874825], size: 0.8755732927910808 },
    },
    '11092026_200254P9111048.jpg': {
      final: { ratio: [3, 2], center: [0.63845496009122, 0.6786266311921956], size: 0.6427467376156089 },
    },
    '11092026_200303P9111050.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5681096900476996, 0.198365640440897], size: 0.21446851640694295 },
      ],
    },
    '11092026_200310P9111051.jpg': {
      final: { ratio: [1, 1], center: [0.40270044278900063, 0.5], size: 1 },
    },
    '11092026_200402P9111059.jpg': {
      final: { ratio: [4, 5], center: [0.672706714049524, 0.5], size: 1 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.47810759962752514, 0.5421639427340681], size: 0.20395286963131887 },
      ],
    },
    '11092026_200404P9111060.jpg': {
      final: { ratio: [4, 5], center: [0.7, 0.5], size: 1 },
    },
    '11092026_200407P9111061.jpg': {
      final: { ratio: [4, 5], center: [0.6301381577697117, 0.5], size: 1 },
    },
    '11092026_200828P9111073.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5227036614721905], size: 0.8888888888888888 },
    },
    '11092026_200832P9111074.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.46798428987710633], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.33678784590341837, 0.3888754913545711], size: 0.23113560180384404 },
      ],
    },
    '11092026_201904P9111337 stack.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.536095274293678], size: 0.8888888888888888 },
    },
    '12092026_185356P9120006UV Spider 2stack.jpg': {
      final: { ratio: [4, 5], center: [0.42667060910703725, 0.5946185688941454], size: 0.7321111768184505 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.43494973388527497, 0.6371969248965109], size: 0.21525724423418086 },
      ],
    },
    '12092026_081712P9120052wasp stack.jpg': {
      final: { ratio: [3, 2], center: [0.5481433249087605, 0.5113518307360954], size: 0.8033007557177592 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.632901016430471, 0.29637140844728344], size: 0.20291210259150402 },
      ],
    },
    'P9150707 20 stacked.jpg': {
      final: { ratio: [1, 1], center: [0.4942869385131758, 0.5], size: 1 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.3971648932371634, 0.39640315170558693], size: 0.21537051584184347 },
      ],
    },
    'STACK-2-Spider.jpg': {
      final: { ratio: [4, 5], center: [0.476031379969645, 0.49842298499371657], size: 0.926524037158416 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.4927366270711962, 0.6679790026246719], size: 0.21156983755408953 },
      ],
    },
    '13092026_100530P9130342glitter oil.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8681253696037847 },
    },
    '13092026_102322P9130373glitter oil.jpg': {
      final: { ratio: [3, 2], center: [0.5047309284447072, 0.5473092844470727], size: 0.8507786319731913 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.35452395032525136, 0.7964715158683225], size: 0.22156514882712403 },
      ],
    },
    '13092026_102344P9130374glitter oil.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8888888888888888 },
    },
    '13092026_103907P9130382glitter oil.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5441553321506012], size: 0.8888888888888888 },
    },
    '13092026_104026P9130383glitter oil.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8888888888888888 },
    },
    '13092026_104210P9130388glitter oil.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8888888888888888 },
    },
    '13092026_104233P9130389glitter oil Negativish.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8888888888888888 },
    },
    '13092026_104646P9130394glitter oil.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5555555555555556], size: 0.8888888888888888 },
    },
    '13092026_104923P9130397glitter oil.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8888888888888888 },
    },
    '13092026_105930P9130554glitter oil.jpg': {
      final: { ratio: [1, 1], center: [0.5272028385570668, 0.4041247782377291], size: 0.8082495564754582 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.47989355410999407, 0.4684604770352848], size: 0.21525724423418094 },
      ],
    },
    '13092026_131750P9130002glitter oil mc-20.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.539424403705894], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.8607332939089297, 0.8469347526118668], size: 0.22629607727183132 },
      ],
    },
    '13092026_132032P9130105_01glitter oil mc-20.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.39591957421644, 0.8027794204612655], size: 0.22787305342006706 },
      ],
    },
    '13092026_132219P9130202_01glitter oil mc-20 22Stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.4731914054799921], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.6573033707865168, 0.4353439779223339], size: 0.21998817267888826 },
      ],
    },
    '13092026_132615P9130301_01glitter oil mc-20 10stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.46530652473881334], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.24571259609698398, 0.37068795584466785], size: 0.22156514882712408 },
      ],
    },
    '13092026_132831P9130485_01glitter oil mc-20.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5410013798541297], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5638675340035482, 0.5898876404494382], size: 0.2152572442341809 },
      ],
    },
    '13092026_132858P9130486_01glitter oil mc-20.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5283855706682437], size: 0.8888888888888888 },
    },
    '13092026_133011P9130487_01glitter oil mc-20.jpg': {
      final: { ratio: [1, 1], center: [0.38290952099349496, 0.5], size: 1 },
    },
    '13092026_133107P9130488_01glitter oil mc-20.jpg': {
      final: { ratio: [1, 1], center: [0.46215257244234176, 0.47664104080425784], size: 0.9532820816085157 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.16055588409225313, 0.4889611669623497], size: 0.17267888823181549 },
      ],
    },
    '13092026_133445P9130490_01glitter oil mc-20.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.47161442933175635], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.11561206386753398, 0.19879755568697022], size: 0.2184111965306525 },
      ],
    },
    '15092026_140105P9150003 fluids redux.jpg': {
      final: { ratio: [3, 2], center: [0.4506948551153163, 0.5047309284447072], size: 0.8012352979827846 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.09432288586635129, 0.7318154937906565], size: 0.23891188645771738 },
      ],
    },
    '15092026_140445P9150300 fluids redux 17stacked.jpg': {
      final: { ratio: [1, 1], center: [0.47161442933175635, 0.5], size: 1 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5804257835600236, 0.40538143110585456], size: 0.2152572442341809 },
      ],
    },
    '15092026_141441P9150645 fluids redux 20stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8888888888888888 },
    },
    '15092026_141528P9150748 fluids redux 40stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8888888888888888 },
    },
    '13092026_095951P9130128glitter oil 40Stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8643743007450784 },
    },
    '13092026_100420P9130288glitter oil 16Stacked.jpg': {
      final: { ratio: [3, 2], center: [0.49885738770263505, 0.4465020576131687], size: 0.8827949566362763 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.19949296579304437, 0.670630103073151], size: 0.23212882953652791 },
      ],
    },
    '13092026_105840P9130459glitter oi 9Stackedl.jpg': {
      final: { ratio: [1, 1], center: [0.5171391844604728, 0.32327596467423647], size: 0.6465519293484729 },
    },
    '13092026_131948P9130028_01glitter oil mc-20 32Stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.4908591016210812], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5868385345997287, 0.5853150515365755], size: 0.21537051584184336 },
      ],
    },
    '15092026_140211P9150010 fluids redux 12stacked.jpg': {
      final: { ratio: [1, 1], center: [0.4360137113475684, 0.5365635935156752], size: 0.9268728129686497 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.32860815539527244, 0.4131614654002714], size: 0.1792115975148182 },
      ],
    },
    '15092026_140325P9150080 fluids redux 12 stack.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.46038944035801854], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.47371991716060846, 0.4649598895474779], size: 0.21425170796734033 },
      ],
    },
    '15092026_170642P9150014_01 mickaels flowers 25stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.4444444444444444], size: 0.8743696946661599 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.3834201610259026, 0.38963641221188644], size: 0.21534743642678456 },
      ],
    },
    '15092026_170801P9150100 mickaels flowers 25 stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5405422526289118], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5186527742358555, 0.5], size: 0.232446020450295 },
      ],
    },
    '19092026_123136P9190262 whelk 28stacked ----.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.48911908289412964], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5979270647382419, 0.5979282539528332], size: 0.20434508051392908 },
      ],
    },
    '19092026_123302P9190280 barnicles 1 10stacked ------.jpg': {
      final: { ratio: [1, 1], center: [0.5163211774563736, 0.4968911665411799], size: 0.9711825711024216 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.6235746293125433, 0.2948169917178734], size: 0.2137930196973745 },
      ],
    },
    '19092026_123346P9190370 barnicles 2 40stacked ----.jpg': {
      final: { ratio: [3, 2], center: [0.6352326132099531, 0.42383358025890755], size: 0.6 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.7180042988815623, 0.534197168047021], size: 0.1873679352974037 },
      ],
    },
    '19092026_124517P9190537 bay landscape.jpg': {
      final: { ratio: [3, 2], center: [0.6025695214948662, 0.6021956087824352], size: 0.46215412312629633 },
    },
    '16092026_184141P9160208 indoor macro 24stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5267235598075808, 0.583232839138351], size: 0.7816373095301652 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.45800599407685894, 0.5847461634863209], size: 0.2242557518148069 },
      ],
    },
    '16092026_184614P9160360 indoor macro 40stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.47427348608450975], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5283743283264466, 0.5090799460878201], size: 0.21460830909649814 },
      ],
    },
    '16092026_184801P9160518 indoor macro 50stacked.jpg': {
      final: { ratio: [3, 2], center: [0.49546010746776853, 0.5393464330472204], size: 0.8602894232815492 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.7723935519338878, 0.33050767302735806], size: 0.1798018490931877 },
      ],
    },
    '14092026_192938P9140110work and moss 20stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.529533917858791], size: 0.8614666569515621 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.4685234434769937, 0.621244504893984], size: 0.21690185315619456 },
      ],
    },
    '14092026_193312P9140182work and moss mass stack.jpg': {
      final: { ratio: [3, 2], center: [0.5139895806768917, 0.468911665411799], size: 0.828823905633951 },
    },
    '14092026_193540P9140324work and moss 30 stack.jpg': {
      final: { ratio: [3, 2], center: [0.5069947903384459, 0.44599886117385446], size: 0.8563999600601256 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.4067361288207221, 0.6181356714351638], size: 0.15926699536103756 },
      ],
    },
    '14092026_194038P9140624work and moss messy 100stack.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8687206016888089 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.4895078144923312, 0.5450780851528915], size: 0.20912976950914436 },
      ],
    },
    '14092026_194042P9140652work and moss 50 stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5435834213925091], size: 0.8809557355876483 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.48985576161039784, 0.5856639661852765], size: 0.20366326171187038 },
      ],
    },
    '17092026_163801P9170008 mix.jpg': {
      final: { ratio: [1, 1], center: [0.375, 0.5], size: 1 },
    },
    '18092026_195938P9180089 mix.jpg': {
      final: { ratio: [3, 2], center: [0.638903960933261, 0.325596257264813], size: 0.6 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.572924579489962, 0.36263776014662263], size: 0.1608869703619746 },
      ],
    },
    '18092026_195212P9180088 mix.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.4521547254443292], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.7002532103454512, 0.35492078037957897], size: 0.1686039501290182 },
      ],
    },
    '17092026_163848P9170010 mix.jpg': {
      final: { ratio: [1, 1], center: [0.5, 0.5], size: 1 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5180342015815149, 0.5631208171891511], size: 0.25 },
      ],
    },
    '17092026_174152P9170014 mix.jpg': {
      final: { ratio: [2, 1], center: [0.5045085503953788, 0.5270517787953505], size: 0.6492603029235646 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.4650587344358148, 0.5240460255958671], size: 0.25 },
      ],
    },
    'Bus-Stop.jpg': {
      final: { ratio: [1, 1], center: [0.5293055775699618, 0.5187155101561582], size: 0.9625689796876834 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.2633011042426163, 0.7344487495597041], size: 0.15254197487378185 },
      ],
    },
    '13092026_180538P9130001Frank.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.4669367148056828], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5879167327098854, 0.20994481624985326], size: 0.20666901491135367 },
      ],
    },
    '13092026_183135P9130095_01Frank.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5495949277914759], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.2125799122946056, 0.7314429963602207], size: 0.25 },
      ],
    },
    '13092026_183206P9130141_01Frank.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8888888888888888 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5755182191225938, 0.42786192321239874], size: 0.2277092873077375 },
      ],
    },
    'STACK-DANDELION-ZS-PMax.jpg': {
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5, 0.5], size: 0.18736847083303776 },
      ],
    },
    '13092026_162544P9130056_02last dinosaurs mc-20.jpg': {
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.35910780014441446, 0.3301749442291887], size: 0.5147117529646588 },
      ],
    },
    '13092026_162533P9130054_02last dinosaurs mc-20.jpg': {
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.2339955266726546, 0.4759539744041329], size: 0.25 },
      ],
    },
    '13092026_162523P9130052_02last dinosaurs mc-20.jpg': {
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.4492788080519892, 0.484971234002583], size: 0.28632147469766356 },
      ],
    },
    '13092026_162459P9130048_02last dinosaurs mc-20.jpg': {
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.3805234145224635, 0.43988493601033224], size: 0.3163790066924974 },
      ],
    },
    '13092026_162341P9130040_02last dinosaurs mc-20.jpg': {
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5834081823145066, 0.3166490548315134], size: 0.3629681812844898 },
      ],
    },
    '13092026_162344P9130042_02last dinosaurs mc-20.jpg': {
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.46844014723234884, 0.33768932722789713], size: 0.3885170834800987 },
      ],
    },
    '25092026_174459P9250013.jpg': {
      final: { ratio: [3, 2], center: [0.5075735873672672, 0.4113302806152401], size: 0.4584041976548738 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.47520297282541696, 0.4519079488082658], size: 0.15857696371961955 },
      ],
    },
    '25092026_175348P9250067 10stacked.jpg': {
      final: { ratio: [3, 2], center: [0.5, 0.5], size: 0.8096527659712269 },
      details: [
        { label: "Detail #1", ratio: [1, 1], center: [0.5034973951692229, 0.5450780851528914], size: 0.20757535277973438 },
      ],
    },
  };
  // Photos with no curated crop show the whole image as their Final Frame.
  const DEFAULT_FINAL_CROP = { x: 0, y: 0, w: 1, h: 1 };

  // Converts a {ratio, center, size} spec into a {x, y, w, h} rect in
  // fractions of the natural image -- size is a fraction of natural height,
  // width is derived from the target ratio and the image's real pixel
  // dimensions so the on-screen crop is a true 1:1 / 4:5 / 16:9 / etc.
  function rectFromSpec(spec, naturalWidth, naturalHeight) {
    const h = spec.size;
    const cropHpx = h * naturalHeight;
    const cropWpx = cropHpx * (spec.ratio[0] / spec.ratio[1]);
    const w = cropWpx / naturalWidth;
    const x = Math.min(Math.max(spec.center[0] - w / 2, 0), 1 - w);
    const y = Math.min(Math.max(spec.center[1] - h / 2, 0), 1 - h);
    return { x, y, w, h };
  }

  // The largest `size` (fraction of natural height) that still keeps the
  // box fully on the photo for a given center + ratio -- used to cap
  // resizing and ratio switches so a box near an edge can't grow (or
  // reshape) into void beyond the image's own bounds. Moving the box is
  // already trapped separately, by clamping center to keep the box (at its
  // existing size) fully in bounds.
  function maxSizeInBounds(center, ratio, naturalWidth, naturalHeight) {
    const naturalAspect = naturalHeight / naturalWidth; // height-per-width
    const widthFracPerSize = (ratio[0] / ratio[1]) * naturalAspect;
    const maxByHeight = 2 * Math.min(center[1], 1 - center[1]);
    const maxByWidth = (2 * Math.min(center[0], 1 - center[0])) / widthFracPerSize;
    return Math.min(maxByHeight, maxByWidth);
  }

  // Frames the full-resolution view on a specific crop rectangle (fractions
  // of the natural image), locking panning to exactly that region. Unlike
  // the free zoom levels, this is allowed to exceed native (1:1) resolution
  // if the crop is small -- the point is to fill the frame with the curated
  // composition, not to cap at pixel-peeping scale. Contain-fit, not
  // cover-fit: the crop's own aspect ratio (portrait, square, panoramic,
  // ...) is usually nothing like the lightbox viewport's, so filling the
  // viewport edge to edge on the mismatched axis (cover-fit) would zoom in
  // well past the curated rectangle and chop off content the photographer
  // explicitly kept in frame -- e.g. a 4:5 portrait crop in a wide viewport
  // would only fill left-right and slice the top and bottom off.
  // Returns the scale and pixel crop size so the caller can dim whatever's
  // left over on the non-matching axis.
  function frameRect(rect) {
    const cropWpx = rect.w * lbImg.naturalWidth;
    const cropHpx = rect.h * lbImg.naturalHeight;
    const scale = Math.min(lbViewport.clientWidth / cropWpx, lbViewport.clientHeight / cropHpx);
    setViewportMode('zoomed');
    lbViewport.classList.add('framed');
    const w = lbImg.naturalWidth * scale;
    const h = lbImg.naturalHeight * scale;
    const focusX = rect.x + rect.w / 2;
    const focusY = rect.y + rect.h / 2;
    lbImg.style.width = `${w}px`;
    lbImg.style.height = `${h}px`;
    // A curated crop is locked to one exact composition, so position the
    // image directly (absolute left/top) rather than through scrollLeft/Top.
    // Native scrolling can only shift content within [0, size - viewport],
    // which can't center an off-center focus point once the scaled image
    // ends up SMALLER than the viewport on an axis -- there's nowhere left
    // to scroll, so it just sits pinned at flex-start instead of centered on
    // the crop. Absolute positioning has no such clamp: the image can be
    // pushed however far the focus point demands, showing blank space on
    // one side while the opposite edge is clipped by overflow:hidden.
    lbImg.style.position = 'absolute';
    lbImg.style.left = `${lbViewport.clientWidth / 2 - focusX * w}px`;
    lbImg.style.top = `${lbViewport.clientHeight / 2 - focusY * h}px`;
    // An earlier pan leaves the viewport scrolled; an absolutely placed image
    // would have that offset applied on top of its own left/top.
    lbViewport.scrollLeft = 0;
    lbViewport.scrollTop = 0;
    return { scale, cropWpx, cropHpx };
  }

  function showCropView(rect, btn) {
    if (!fullLoaded) return;
    hideSpotlight();
    lbSelect.hidden = true;
    zoomScale = 'crop';
    zoomButtons.forEach((b) => b.classList.remove('active'));
    cropBar.querySelectorAll('.crop-btn').forEach((b) => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    // showSpotlight() dims the leftover viewport space on the non-matching
    // axis so it still reads as a clean frame rather than neighbouring image
    // content bleeding in around it.
    const { scale, cropWpx, cropHpx } = frameRect(rect);
    showSpotlight(scale, cropWpx, cropHpx);
  }

  // ---- Hidden crop-editing tool (ctrl+click a Final Frame/Detail button) ----
  // Lets the photographer visually redefine a Final Frame / Detail crop on
  // the live site, accumulating changes across as many photos as they like
  // in one browsing session, then export everything as one JSON blob to
  // hand back for the CROPS config above. Never surfaced in the normal UI.
  const RATIO_PRESETS = [
    { label: 'Portrait', ratio: [4, 5] },
    { label: 'Square', ratio: [1, 1] },
    { label: 'Landscape', ratio: [3, 2] },
    { label: 'Wide', ratio: [16, 9] },
    { label: 'Panoramic', ratio: [2, 1] },
  ];
  const CROP_EDITS_KEY = 'gallery-crop-edits';

  let cropEdits = {};
  try {
    cropEdits = JSON.parse(localStorage.getItem(CROP_EDITS_KEY) || '{}');
  } catch (e) {
    cropEdits = {};
  }
  // Example slices carry no crops of their own, so drop any edits this
  // browser still holds for them (from before that rule) rather than letting
  // them count toward -- and reappear in -- the next export.
  let purgedSliceEdits = false;
  Object.keys(cropEdits).forEach((name) => {
    const it = items[indexByOriginal.get(name)];
    if (it && isSlice(it)) {
      delete cropEdits[name];
      purgedSliceEdits = true;
    }
  });
  // Saved edits identical to what's now baked into CROPS are already on the
  // site, so drop them: the export count then means "not on the site yet",
  // and a stale copy can't mask a later change to the baked one. Anything
  // that differs (or has no baked counterpart) is kept untouched.
  const sameCrop = (a, b) => !!a && !!b && !!a.full === !!b.full && (a.full || (
    a.ratio[0] === b.ratio[0] && a.ratio[1] === b.ratio[1] &&
    a.center[0] === b.center[0] && a.center[1] === b.center[1] &&
    a.size === b.size && (a.label || '') === (b.label || '')));
  let prunedRedundant = false;
  Object.keys(cropEdits).forEach((name) => {
    const edit = cropEdits[name];
    const base = CROPS[name];
    if (!base || !edit) return;
    if (edit.final && sameCrop(edit.final, base.final)) { delete edit.final; prunedRedundant = true; }
    if (edit.details && base.details && edit.details.length === base.details.length
        && edit.details.every((d, i) => sameCrop(d, base.details[i]))) { delete edit.details; prunedRedundant = true; }
    if (!edit.final && !edit.details) delete cropEdits[name];
  });
  if (purgedSliceEdits || prunedRedundant) saveCropEdits();
  updateExportButton();

  function saveCropEdits() {
    localStorage.setItem(CROP_EDITS_KEY, JSON.stringify(cropEdits));
    updateExportButton();
  }

  function updateExportButton() {
    const count = Object.keys(cropEdits).length;
    exportCropsBtn.hidden = count === 0;
    exportCountEl.textContent = String(count);
  }

  function getEffectiveConfig(filename) {
    const base = CROPS[filename];
    const edit = cropEdits[filename];
    if (!base && !edit) return null;
    return {
      final: (edit && edit.final) || (base && base.final) || null,
      details: (edit && edit.details) || (base && base.details) || null,
    };
  }

  exportCropsBtn.addEventListener('click', () => {
    const json = JSON.stringify(cropEdits, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crop-edits.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(json).then(() => {
        exportCropsBtn.classList.add('copied');
        setTimeout(() => exportCropsBtn.classList.remove('copied'), 1500);
      }).catch(() => {});
    }
  });

  // Currently-being-edited crop, if any: { filename, kind: 'final'|'detail',
  // index (for detail), spec: {ratio, center, size} }. `spec` is the live,
  // in-progress version -- committed into cropEdits on every drag release.
  let editing = null;

  // Page-absolute (client) rect of the displayed image -- the same
  // coordinate space as mouse events (e.clientX/clientY), so drag math
  // never has to mix "relative to the viewport" with "relative to the
  // page" (that mismatch was the cause of the erratic resize behaviour).
  function imgPageRect() {
    const r = lbImg.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  function renderEditorBox() {
    if (!editing || !editing.spec || editing.spec.full) {
      cropEditorBox.hidden = true;
      return;
    }
    const rect = rectFromSpec(editing.spec, lbImg.naturalWidth, lbImg.naturalHeight);
    // offsetLeft/offsetTop/offsetWidth/offsetHeight are relative to the
    // nearest positioned ancestor (.lb-viewport) and do NOT include scroll
    // -- exactly what CSS left/top on an absolutely-positioned sibling
    // needs. Using getBoundingClientRect() here (screen/scroll-space)
    // double-counts the scroll offset once the browser re-applies it while
    // rendering the box, which is what made it drift at roughly 2x the
    // image's own pan/scroll speed.
    const baseLeft = lbImg.offsetLeft;
    const baseTop = lbImg.offsetTop;
    const w = lbImg.offsetWidth;
    const h = lbImg.offsetHeight;
    cropEditorBox.hidden = false;
    cropEditorBox.style.left = `${baseLeft + rect.x * w}px`;
    cropEditorBox.style.top = `${baseTop + rect.y * h}px`;
    cropEditorBox.style.width = `${rect.w * w}px`;
    cropEditorBox.style.height = `${rect.h * h}px`;
  }

  // The edit layer's details for a photo. An edit's `details` replaces the
  // baked-in list wholesale (see getEffectiveConfig), so the first time a
  // photo's details are touched, seed it with copies of the baked ones --
  // otherwise editing Detail #1 of two would silently drop Detail #2.
  function editableDetails(filename) {
    const entry = cropEdits[filename] || (cropEdits[filename] = {});
    if (!entry.details) {
      const base = CROPS[filename] && CROPS[filename].details;
      entry.details = base ? base.map((d) => ({ ...d, ratio: d.ratio.slice(), center: d.center.slice() })) : [];
    }
    return entry.details;
  }

  function commitEditingSpec() {
    if (!editing) return;
    const filename = editing.filename;
    const entry = cropEdits[filename] || (cropEdits[filename] = {});
    if (editing.kind === 'final') {
      // "Full image" only has to be stored when it overrides a baked-in
      // crop; otherwise it's simply the default, i.e. no final at all.
      const baked = CROPS[filename] && CROPS[filename].final;
      if (editing.spec.full && !baked) delete entry.final;
      else entry.final = editing.spec;
    } else {
      editableDetails(filename)[editing.index] = editing.spec;
    }
    if (!entry.final && !(entry.details && entry.details.length)) delete cropEdits[filename];
    saveCropEdits();
    if (editing.kind === 'final') {
      const finalBtn = cropBarButton('final');
      if (finalBtn) finalBtn.classList.toggle('ghost', !finalCropRect(items[current]));
    }
  }

  function highlightRatioButton() {
    // Only a Detail can be removed -- the Final Frame always has to exist
    // (as either a crop or the full image), so it never gets this button.
    removeDetailBtn.hidden = !editing || editing.kind !== 'detail';
    const buttons = ratioPicker.querySelectorAll('.ratio-btn');
    buttons.forEach((b) => {
      if (b.dataset.full) {
        b.hidden = !editing || editing.kind !== 'final';
        b.classList.toggle('active', !!(editing && editing.spec && editing.spec.full));
        return;
      }
      const r = JSON.parse(b.dataset.ratio);
      const match = editing && editing.spec && !editing.spec.full && r[0] === editing.spec.ratio[0] && r[1] === editing.spec.ratio[1];
      b.classList.toggle('active', !!match);
    });
  }

  function buildRatioPicker() {
    ratioPicker.innerHTML = '';
    // Final Frame only: show the whole photo, no crop (and still allow details).
    const fullBtn = document.createElement('button');
    fullBtn.className = 'ratio-btn';
    fullBtn.textContent = 'Full image';
    fullBtn.dataset.full = '1';
    fullBtn.hidden = true;
    fullBtn.addEventListener('click', () => {
      if (!editing || editing.kind !== 'final') return;
      editing.spec = { full: true };
      highlightRatioButton();
      renderEditorBox();
      commitEditingSpec();
    });
    ratioPicker.appendChild(fullBtn);
    RATIO_PRESETS.forEach((preset) => {
      const btn = document.createElement('button');
      btn.className = 'ratio-btn';
      btn.textContent = preset.label;
      btn.dataset.ratio = JSON.stringify(preset.ratio);
      btn.addEventListener('click', () => {
        if (!editing) return;
        if (!editing.spec || editing.spec.full) {
          // Coming back from "Full image": start with the largest box of this shape.
          const cap = maxSizeInBounds([0.5, 0.5], preset.ratio, lbImg.naturalWidth, lbImg.naturalHeight);
          editing.spec = { ratio: preset.ratio, center: [0.5, 0.5], size: Math.min(cap, 1) };
        } else {
          editing.spec.ratio = preset.ratio;
          // Switching to a more extreme shape (e.g. Square -> Panoramic)
          // at the same size and center can push the new box off the
          // photo's edges just as growing a corner handle can -- cap it
          // the same way.
          const cap = maxSizeInBounds(editing.spec.center, preset.ratio, lbImg.naturalWidth, lbImg.naturalHeight);
          editing.spec.size = Math.min(editing.spec.size, cap);
        }
        highlightRatioButton();
        renderEditorBox();
        commitEditingSpec();
      });
      ratioPicker.appendChild(btn);
    });
  }
  buildRatioPicker();

  function startEditing(item, kind, index, initialSpec) {
    editing = {
      filename: item.original_filename,
      kind,
      index,
      spec: !initialSpec ? null
        : initialSpec.full ? { full: true }
        : { ...initialSpec, ratio: initialSpec.ratio.slice(), center: initialSpec.center.slice() },
    };
    if (!editing.spec) {
      // A Final Frame nobody has cropped is the whole image; open it that way
      // (no box) instead of inventing a crop. Details always need a box.
      editing.spec = kind === 'final' ? { full: true } : { ratio: [4, 5], center: [0.5, 0.5], size: 0.6 };
    }
    // Editing always starts at the plain fit view (whole photo) with the box
    // overlaid on top, regardless of whatever zoom/preview was showing right
    // before -- moving or resizing the box no longer auto-reframes to the
    // cropped magnification (it used to; that made the box a moving target
    // to edit and hid whether a positioning bug was in the box math or in
    // the reframe). Use the zoom-level buttons or a plain preview click
    // whenever you want to actually check the framing.
    zoomScale = 'fit';
    hideSpotlight();
    setViewportMode('fit');
    lbImg.style.width = '';
    lbImg.style.height = '';
    cropEditorControls.hidden = false;
    highlightRatioButton();
    renderEditorBox();
    // Register the photo (with whatever the box currently shows) as soon as
    // edit mode is entered, rather than waiting for a drag or ratio click --
    // otherwise glancing at a photo's default box and moving on leaves no
    // trace that it was ever opened, which reads as "nothing happened".
    commitEditingSpec();
  }

  function stopEditing() {
    editing = null;
    cropEditorControls.hidden = true;
    cropEditorBox.hidden = true;
    // Editing normally sits at fit view, but you can still use the zoom-level
    // buttons while editing to check the box up close -- closing without
    // picking a preview should return to the normal full-photo view rather
    // than leaving it parked mid-zoom. If we're not in full-res view at all,
    // render() handles its own reset right after.
    if (zoomed) {
      zoomScale = 'fit';
      hideSpotlight();
      setViewportMode('fit');
      lbImg.style.width = '';
      lbImg.style.height = '';
    }
  }

  addDetailBtn.addEventListener('click', () => {
    const item = items[current];
    const filename = item.original_filename;
    const details = editableDetails(filename);
    const index = details.length;
    const label = `Detail #${index + 1}`;
    const spec = { label, ratio: [1, 1], center: [0.5, 0.5], size: 0.25 };
    details.push(spec);
    saveCropEdits();
    buildCropBar(item);
    startEditing(item, 'detail', index, spec);
    // buildCropBar ran while the previous crop was still the one being edited
    // and highlighted that one; the new detail is what's being edited now.
    cropBar.querySelectorAll('.crop-btn').forEach((b) => b.classList.remove('active'));
    const newBtn = cropBarButton('detail', index);
    if (newBtn) newBtn.classList.add('active');
  });

  removeDetailBtn.addEventListener('click', () => {
    if (!editing || editing.kind !== 'detail') return;
    const item = items[current];
    const filename = editing.filename;
    const details = editableDetails(filename);
    details.splice(editing.index, 1);
    // An empty override list only needs to be kept around if the baked-in
    // config actually has details to override -- if both are empty it's a
    // no-op, so drop it rather than leave clutter in cropEdits.
    const entry = cropEdits[filename];
    const bakedDetails = (CROPS[filename] && CROPS[filename].details) || [];
    if (details.length === 0 && bakedDetails.length === 0) delete entry.details;
    if (entry && !entry.final && !entry.details) delete cropEdits[filename];
    saveCropEdits();
    stopEditing();
    buildCropBar(item);
  });

  // Dragging the box body moves it; dragging a corner handle resizes it
  // (uniformly, keeping the locked ratio, growing/shrinking around the
  // fixed center) -- both expressed in fractions of the natural image so
  // they work correctly no matter the current zoom level.
  let dragMode = null; // 'move' | 'resize'
  let dragStart = null;

  cropEditorBox.addEventListener('mousedown', (e) => {
    if (!editing || !editing.spec || editing.spec.full) return;
    const corner = e.target.dataset && e.target.dataset.corner;
    e.preventDefault();
    e.stopPropagation();
    dragStart = {
      x: e.clientX,
      y: e.clientY,
      center: editing.spec.center.slice(),
      size: editing.spec.size,
      img: imgPageRect(),
    };
    dragMode = corner ? 'resize' : 'move';
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragMode || !editing) return;
    const img = dragStart.img;
    if (dragMode === 'move') {
      const dxFrac = (e.clientX - dragStart.x) / img.width;
      const dyFrac = (e.clientY - dragStart.y) / img.height;
      const rect = rectFromSpec({ ...editing.spec, center: dragStart.center }, lbImg.naturalWidth, lbImg.naturalHeight);
      editing.spec.center = [
        Math.min(Math.max(dragStart.center[0] + dxFrac, rect.w / 2), 1 - rect.w / 2),
        Math.min(Math.max(dragStart.center[1] + dyFrac, rect.h / 2), 1 - rect.h / 2),
      ];
    } else {
      // Resize around the fixed center: the dragged corner's distance from
      // center (along whichever axis its own natural pixel span is taller,
      // so panoramic/portrait ratios resize predictably from any corner)
      // becomes the new half-size.
      const fx = (e.clientX - img.left) / img.width;
      const fy = (e.clientY - img.top) / img.height;
      // `size` is defined as a fraction of the image's natural HEIGHT, so a
      // vertical mouse offset from center maps to it directly. A horizontal
      // offset has to be converted through the image's own aspect (which,
      // since it's rendered at uniform scale, equals img.width/img.height)
      // and the locked ratio first. Averaging both keeps a diagonal drag on
      // any corner tracking the cursor smoothly instead of only ever
      // reading one axis.
      const imgAspect = img.width / img.height;
      const sizeFromY = Math.abs(fy - dragStart.center[1]) * 2;
      const sizeFromX = Math.abs(fx - dragStart.center[0]) * 2 * imgAspect * (editing.spec.ratio[1] / editing.spec.ratio[0]);
      const cap = maxSizeInBounds(editing.spec.center, editing.spec.ratio, lbImg.naturalWidth, lbImg.naturalHeight);
      const newSize = Math.min(Math.max((sizeFromY + sizeFromX) / 2, 0.04), 1, cap);
      editing.spec.size = newSize;
    }
    renderEditorBox();
  });

  document.addEventListener('mouseup', () => {
    if (dragMode) {
      dragMode = null;
      commitEditingSpec();
    }
  });

  // Always re-reads cropEdits/CROPS fresh rather than trusting a spec
  // captured in a button's closure -- buildCropBar only runs once per
  // photo-view, so a stale captured spec would keep reappearing every time
  // you ctrl+click back into an already-edited crop after editing a
  // different one on the same photo in between.
  function resolveSpec(filename, kind, index) {
    const cfg = getEffectiveConfig(filename);
    if (kind === 'final') return (cfg && cfg.final) || null;
    return (cfg && cfg.details && cfg.details[index]) || null;
  }

  // The Final Frame as fractions of the ORIGINAL image, or null when the
  // final frame is the whole image (uncropped).
  function finalCropRect(item) {
    const spec = resolveSpec(item.original_filename, 'final');
    if (!spec || spec.full) return null;
    const [nw, nh] = item.size || [lbImg.naturalWidth, lbImg.naturalHeight];
    return rectFromSpec(spec, nw, nh);
  }

  function cropBarButton(kind, index) {
    return cropBar.querySelector(`[data-kind="${kind}"]` + (kind === 'detail' ? `[data-index="${index}"]` : ''));
  }

  function buildCropBar(item) {
    cropBar.innerHTML = '';
    const config = getEffectiveConfig(item.original_filename);

    const addButton = (label, kind, index) => {
      const btn = document.createElement('button');
      btn.className = 'crop-btn';
      btn.textContent = label;
      btn.dataset.kind = kind;
      if (index !== undefined) btn.dataset.index = index;
      btn.addEventListener('click', (e) => {
        const spec = resolveSpec(item.original_filename, kind, index);
        if (e.ctrlKey || e.metaKey) {
          cropBar.querySelectorAll('.crop-btn').forEach((b) => b.classList.remove('active'));
          if (editing && editing.filename === item.original_filename && editing.kind === kind && editing.index === index) {
            stopEditing();
          } else {
            startEditing(item, kind, index, spec);
            btn.classList.add('active');
          }
          return;
        }
        stopEditing();
        const rect = spec && !spec.full ? rectFromSpec(spec, lbImg.naturalWidth, lbImg.naturalHeight) : DEFAULT_FINAL_CROP;
        showCropView(rect, btn);
      });
      cropBar.appendChild(btn);
    };

    addButton('Final Frame', 'final', undefined);
    // An uncropped Final Frame means nothing to a visitor, so keep its button
    // almost invisible -- still there (ctrl+click) to open the editor and
    // add details.
    cropBarButton('final').classList.toggle('ghost', !finalCropRect(item));

    // The full-resolution view opens on the Final Frame, so when that's a
    // crop, offer a way back to the whole photo.
    if (finalCropRect(item)) {
      const orig = document.createElement('button');
      orig.className = 'crop-btn';
      orig.textContent = 'Original image';
      orig.dataset.kind = 'original';
      orig.addEventListener('click', () => {
        if (editing) stopEditing();
        hideSpotlight();
        cropBar.querySelectorAll('.crop-btn').forEach((b) => b.classList.remove('active'));
        orig.classList.add('active');
        setZoom('fit');
      });
      cropBar.appendChild(orig);
    }

    if (config && config.details) {
      config.details.forEach((spec, index) => {
        addButton(spec.label, 'detail', index);
      });
    }

    // Re-show the editor UI if we were mid-edit on this same photo (e.g.
    // right after "+ Add Detail" rebuilt the bar to add its button).
    if (editing && editing.filename === item.original_filename) {
      cropEditorControls.hidden = false;
      highlightRatioButton();
      renderEditorBox();
      const editingBtn = cropBarButton(editing.kind, editing.index);
      if (editingBtn) editingBtn.classList.add('active');
    } else {
      stopEditing();
    }
  }

  // ---- "View detail" buttons (medium view) and the hover highlight ----
  function hideDetailHighlight() {
    lbDetailHi.classList.remove('on');
  }

  // Dims everything in the medium image except where the detail sits. The
  // medium shows the Final Frame inside a border, so the detail's rectangle
  // (a fraction of the ORIGINAL) is mapped through the crop the medium was
  // made from, then through where the photo sits inside its border.
  function showDetailHighlight(item, index) {
    const spec = resolveSpec(item.original_filename, 'detail', index);
    if (!spec || !item.size || !lbImg.naturalWidth || zoomed) return;
    const d = rectFromSpec(spec, item.size[0], item.size[1]);
    const c = item.medium_crop || [0, 0, 1, 1];
    const f = item.medium_frame || [0, 0, 1, 1];
    const x0 = Math.max(0, (d.x - c[0]) / c[2]);
    const y0 = Math.max(0, (d.y - c[1]) / c[3]);
    const x1 = Math.min(1, (d.x + d.w - c[0]) / c[2]);
    const y1 = Math.min(1, (d.y + d.h - c[1]) / c[3]);
    if (x1 <= x0 || y1 <= y0) return;          // the detail lies outside this frame
    const w = lbImg.offsetWidth;
    const h = lbImg.offsetHeight;
    lbDetailHi.style.left = `${lbImg.offsetLeft + (f[0] + x0 * f[2]) * w}px`;
    lbDetailHi.style.top = `${lbImg.offsetTop + (f[1] + y0 * f[3]) * h}px`;
    lbDetailHi.style.width = `${(x1 - x0) * f[2] * w}px`;
    lbDetailHi.style.height = `${(y1 - y0) * f[3] * h}px`;
    lbDetailHi.classList.add('on');
  }

  function buildDetailButtons(item) {
    lbDetailBtns.innerHTML = '';
    if (zoomed || isSlice(item)) return;
    const cfg = getEffectiveConfig(item.original_filename);
    const details = (cfg && cfg.details) || [];
    details.forEach((spec, index) => {
      const btn = document.createElement('button');
      btn.className = 'lb-zoom';
      btn.textContent = details.length === 1 ? 'View detail' : `View ${spec.label}`;
      btn.addEventListener('mouseenter', () => showDetailHighlight(item, index));
      btn.addEventListener('focus', () => showDetailHighlight(item, index));
      btn.addEventListener('mouseleave', hideDetailHighlight);
      btn.addEventListener('blur', hideDetailHighlight);
      btn.addEventListener('click', () => {
        hideDetailHighlight();
        pendingView = { kind: 'detail', index };
        goFullRes();
      });
      lbDetailBtns.appendChild(btn);
    });
  }

  function render() {
    const item = items[current];
    hideDetailHighlight();
    buildDetailButtons(item);
    fullLoaded = false;
    zoomScale = 'fit';
    zoomBar.hidden = !zoomed;
    lbFullscreenBtn.hidden = !zoomed;
    lbFullscreenBtn.textContent = document.fullscreenElement === document.documentElement ? 'Exit fullscreen' : 'Fullscreen';
    updateLbFullscreenClass();
    // No Final Frame/Detail buttons on an example slice -- only its stack has them.
    const hasCrops = zoomed && !isSlice(item);
    cropBar.hidden = !hasCrops;
    if (hasCrops) {
      buildCropBar(item);
    } else {
      cropBar.innerHTML = '';
      // The crop editor (box + controls) only makes sense over the full-res
      // view -- leaving it open when dropping back to medium stranded a
      // stale, wrongly-sized box whose dimming outline blacked out the image.
      stopEditing();
    }
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
    syncLbHeart();

    // Stack <-> example slice links: a thumbnail pill per partner photo.
    lbSampleBtns.innerHTML = '';
    const partners = linkedIndices(item);
    partners.forEach((partnerIndex, n) => {
      const btn = document.createElement('button');
      btn.className = 'lb-sample';
      const thumb = document.createElement('img');
      thumb.src = items[partnerIndex].thumb;
      thumb.alt = '';
      const label = document.createElement('span');
      label.textContent = !item.samples ? 'Back to stack' : partners.length === 1 ? 'Sample slice' : `Sample slice ${n + 1}`;
      btn.append(thumb, label);
      btn.addEventListener('click', () => open(partnerIndex));
      lbSampleBtns.appendChild(btn);
    });

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
    if (location.hash === '#/hearts') renderHearts(true);
    document.body.style.overflow = '';
    resetZoomState();
    releaseFullObjectURL();
    lbLoading.hidden = true;
    stopEditing();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  // The fullscreen CSS treatment is derived state, not something toggled
  // directly: it's on exactly when both true fullscreen is active AND the
  // full-resolution view is showing. Re-run after any change to either (the
  // fullscreen button, a fullscreenchange event, or render() switching photos
  // and always dropping back to medium view) so it self-corrects rather than
  // needing every call site to remember to update it.
  function updateLbFullscreenClass() {
    lightbox.classList.toggle('lb-fullscreen', zoomed && document.fullscreenElement === document.documentElement);
  }

  lbFullscreenBtn.addEventListener('click', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  });

  document.addEventListener('fullscreenchange', () => {
    lbFullscreenBtn.textContent = document.fullscreenElement === document.documentElement ? 'Exit fullscreen' : 'Fullscreen';
    updateLbFullscreenClass();
    // The viewport just changed size -- Fit needs recomputing, and a numeric
    // zoom level should re-center rather than leave stale scroll/framing from
    // the old (windowed) dimensions.
    if (zoomed && fullLoaded) setZoom(zoomScale, { instant: true });
  });

  function step(delta) {
    releaseFullObjectURL();
    // An example slice isn't in any grid order, so step from its stack's
    // position -- otherwise indexOf() is -1 and "next" would jump to the
    // start of the category instead of the photo after the stack.
    const here = items[current];
    const anchor = isSlice(here) ? indexByOriginal.get(here.sample_of) : current;
    let order = currentOrder;
    let pos = order.indexOf(anchor);
    if (pos === -1) {
      order = globalOrder;
      pos = Math.max(order.indexOf(anchor), 0);
    }
    const nextPos = (pos + delta + order.length) % order.length;
    current = order[nextPos];
    zoomed = false;
    render();
  }

  function setViewportMode(mode) {
    cancelZoomAnim();
    lbViewport.classList.remove('framed');
    lbViewport.classList.toggle('fit', mode === 'fit');
    lbViewport.classList.toggle('zoomed', mode === 'zoomed');
    lbViewport.classList.toggle('selectable', mode === 'fit' && zoomed);
    // A framed crop (see frameRect()) positions the image with absolute
    // left/top instead of the normal flex layout + scroll. Clear that here,
    // the one place every mode transition passes through, so leaving a
    // framed view doesn't leave it stuck off in a corner of whatever comes
    // next -- frameRect() re-applies its own left/top immediately after
    // calling this, for the case where we're just entering framed mode.
    lbImg.style.position = '';
    lbImg.style.left = '';
    lbImg.style.top = '';
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

  // ---- Animated zoom ----
  // One requestAnimationFrame loop drives size AND position together, so the
  // point at the centre of the view stays exactly there for the whole zoom.
  // (The old version ran a CSS width/height transition and a native
  // smooth-scroll side by side; the two never stay in step, so the centre
  // drifted mid-zoom and the scroll got clamped against a half-grown image.)
  const ZOOM_MS = 450;
  let zoomAnimFrame = 0;

  function cancelZoomAnim() {
    if (zoomAnimFrame) cancelAnimationFrame(zoomAnimFrame);
    zoomAnimFrame = 0;
  }

  // Like CSS cubic-bezier(): (x1, y1, x2, y2) -> easing function of t in 0..1.
  function cubicBezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
    const sampleY = (t) => ((ay * t + by) * t + cy) * t;
    const slopeX = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const err = sampleX(t) - x;
        if (Math.abs(err) < 1e-6) return sampleY(t);
        const slope = slopeX(t);
        if (Math.abs(slope) < 1e-6) break;
        t -= err / slope;
      }
      let lo = 0, hi = 1;
      t = x;
      for (let i = 0; i < 24; i++) {
        const err = sampleX(t) - x;
        if (Math.abs(err) < 1e-6) break;
        if (err > 0) hi = t; else lo = t;
        t = (lo + hi) / 2;
      }
      return sampleY(t);
    };
  }
  // A touch of ease-in so it doesn't lurch off the mark, then a long,
  // gentle settle -- fast at the start, slowing toward the end, like a lens.
  const zoomEase = cubicBezier(0.25, 0.8, 0.25, 1);

  // Where the image's top-left sits inside the viewport (<= 0 when it overflows)
  // along one axis: keep `focus` (a 0-1 fraction of the image) at the centre of
  // the view, but never pull the image's edge past the viewport's edge, and
  // centre it when it's smaller than the viewport. This is exactly what native
  // scrolling would settle on, which is why the hand-off at the end is seamless.
  function axisOffset(view, size, focus) {
    if (size <= view) return (view - size) / 2;
    return Math.min(0, Math.max(view - size, view / 2 - focus * size));
  }

  // scale: 'fit' | number. Options: focus -- {x, y} fraction (0-1) of the
  // natural image to end up centred (default: whatever is centred right now);
  // onDone -- called once the zoom has landed; instant -- skip the animation.
  function setZoom(scale, opts = {}) {
    zoomScale = scale;
    zoomButtons.forEach((b) => {
      const isFit = scale === 'fit' && b.dataset.zoom === 'fit';
      const isNum = typeof scale === 'number' && Number(b.dataset.zoom) === scale;
      b.classList.toggle('active', isFit || isNum);
    });
    if (scale !== 'fit' && !fullLoaded) return;

    const nw = lbImg.naturalWidth;
    const nh = lbImg.naturalHeight;
    const vw = lbViewport.clientWidth;
    const vh = lbViewport.clientHeight;
    const w1 = scale === 'fit' ? nw * Math.min(1, vw / nw, vh / nh) : nw * scale;
    const h1 = w1 * nh / nw;

    // Where things stand right now, measured from the DOM so it's right
    // whatever state we're in: fit, scrolled zoom, a framed crop, or the
    // middle of another zoom that this press interrupts.
    const vpRect = lbViewport.getBoundingClientRect();
    const r = lbImg.getBoundingClientRect();
    const w0 = r.width;
    const h0 = r.height;
    const x0 = r.left - vpRect.left;
    const y0 = r.top - vpRect.top;
    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const f0 = w0 > 0 && h0 > 0
      ? { x: clamp01((vw / 2 - x0) / w0), y: clamp01((vh / 2 - y0) / h0) }
      : { x: 0.5, y: 0.5 };
    const f1 = opts.focus || f0;

    const land = () => {
      if (scale === 'fit') {
        setViewportMode('fit');
        lbImg.style.width = '';
        lbImg.style.height = '';
      } else {
        setViewportMode('zoomed');
        lbImg.style.width = `${w1}px`;
        lbImg.style.height = `${h1}px`;
        lbImg.offsetWidth; // lay out before scrolling
        // Smaller than the viewport on an axis? Nothing to scroll -- the
        // stylesheet centres it there.
        lbViewport.scrollLeft = w1 > vw ? -axisOffset(vw, w1, f1.x) : 0;
        lbViewport.scrollTop = h1 > vh ? -axisOffset(vh, h1, f1.y) : 0;
      }
      if (editing) renderEditorBox();
      if (opts.onDone) opts.onDone();
    };

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nothingToAnimate = Math.abs(w1 - w0) < 0.5 && Math.abs(f1.x - f0.x) < 0.001 && Math.abs(f1.y - f0.y) < 0.001;
    if (opts.instant || reduceMotion || nothingToAnimate || !(w0 > 0 && h0 > 0) || !(nw > 0)) {
      land();
      return;
    }

    // Take over positioning: overflow hidden + an absolutely placed image,
    // starting exactly where it is on screen now.
    setViewportMode('zoomed');
    lbViewport.classList.add('framed');
    lbImg.style.position = 'absolute';
    lbImg.style.width = `${w0}px`;
    lbImg.style.height = `${h0}px`;
    lbImg.style.left = `${x0}px`;
    lbImg.style.top = `${y0}px`;
    // x0/y0 already include any panning. Leftover scroll would be applied a
    // second time on top of an absolutely placed image, so zero it.
    lbViewport.scrollLeft = 0;
    lbViewport.scrollTop = 0;
    if (editing) renderEditorBox();

    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ZOOM_MS);
      if (t >= 1) {
        zoomAnimFrame = 0;
        land();
        return;
      }
      const e = zoomEase(t);
      // Interpolate size geometrically so each frame is the same *ratio*
      // bigger than the last -- that's what makes a zoom feel steady.
      const w = w0 * Math.pow(w1 / w0, e);
      const h = h0 * Math.pow(h1 / h0, e);
      const fx = f0.x + (f1.x - f0.x) * e;
      const fy = f0.y + (f1.y - f0.y) * e;
      lbImg.style.width = `${w}px`;
      lbImg.style.height = `${h}px`;
      lbImg.style.left = `${axisOffset(vw, w, fx)}px`;
      lbImg.style.top = `${axisOffset(vh, h, fy)}px`;
      if (editing) renderEditorBox();
      zoomAnimFrame = requestAnimationFrame(tick);
    };
    zoomAnimFrame = requestAnimationFrame(tick);
  }

  // Keeps the crop-editor overlay aligned through panning, zoom-level
  // changes, and window resizes -- it has to track the image's on-screen
  // rect at any magnification.
  lbViewport.addEventListener('scroll', () => {
    if (editing) renderEditorBox();
  });
  window.addEventListener('resize', () => {
    if (editing) renderEditorBox();
  });

  lbImg.addEventListener('load', () => {
    if (zoomed) {
      fullLoaded = true;
      setZoom(zoomScale, { instant: true });
      openDefaultFullView();
    }
  });

  // Full resolution opens on the Final Frame (or the detail that was asked
  // for), not the whole original -- that's what the crop bar's "Original
  // image" button is for. An uncropped photo just opens whole.
  function openDefaultFullView() {
    const item = items[current];
    const want = pendingView;
    pendingView = null;
    if (isSlice(item)) return;
    if (want && want.kind === 'detail') {
      const spec = resolveSpec(item.original_filename, 'detail', want.index);
      if (spec) {
        showCropView(rectFromSpec(spec, lbImg.naturalWidth, lbImg.naturalHeight), cropBarButton('detail', want.index));
        return;
      }
    }
    const rect = finalCropRect(item);
    if (rect) showCropView(rect, cropBarButton('final'));
  }

  zoomButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      hideSpotlight();
      cropBar.querySelectorAll('.crop-btn').forEach((b) => b.classList.remove('active'));
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
    if (zoomAnimFrame) return; // mid-zoom: the image is being positioned by the animation
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
      // Keep the crop-editor box glued to the image on every pan frame --
      // don't wait for the (slightly async) scroll event to catch up.
      if (editing) renderEditorBox();
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

    // Keep the drawn box on screen while it zooms, then swap it for the
    // spotlight dimming over whatever extra image got revealed.
    setZoom(scale, {
      focus: { x: fx, y: fy },
      onDone: () => {
        lbSelect.hidden = true;
        showSpotlight(scale, selWNatural, selHNatural);
      },
    });
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

  lbHeart.addEventListener('click', () => {
    if (current >= 0) toggleHeart(items[current]);
  });

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
    // Mid-zoom the animation owns the image's position, so arrows do nothing.
    if (zoomAnimFrame && e.key.startsWith('Arrow')) return;
    // 'crop' (a curated Final Frame/Detail) is intentionally excluded: it's
    // positioned with absolute left/top, not scroll (see frameRect()), so
    // scrollBy() would be a silent no-op.
    if (zoomed && zoomScale !== 'fit' && zoomScale !== 'crop') {
      const pan = (dx, dy) => {
        hideSpotlight();
        lbViewport.scrollBy(dx, dy);
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
  // Photos change behind a camera shutter: two blades close from the top and
  // bottom (3x the thumbnail hover shutter's 50ms), stay shut ~half a second
  // while the photo swaps, then open. A black layer fades in lock-step with
  // how far the blades are closed, like the light being cut off. Controls
  // (speed panel, side arrows, close) slide away after 3s without the mouse
  // moving and come back on any movement or tap.
  const ssStartBtn = document.getElementById('slideshow-start');
  const ssEl = document.getElementById('slideshow');
  const ssClose = document.getElementById('ss-close');
  const ssStage = document.getElementById('ss-stage');
  const ssImg = document.getElementById('ss-img');
  const ssShutterTop = document.getElementById('ss-shutter-top');
  const ssShutterBottom = document.getElementById('ss-shutter-bottom');
  const ssDim = document.getElementById('ss-dim');
  const ssTitle = document.getElementById('ss-title');
  const ssLocation = document.getElementById('ss-location');
  const ssDesc = document.getElementById('ss-desc');
  const ssBar = document.querySelector('.ss-bar');
  const ssStatus = document.getElementById('ss-status');
  const ssPlayBtn = document.getElementById('ss-play');
  const ssSpeedsEl = document.getElementById('ss-speeds');
  const ssProgressBar = document.getElementById('ss-progress-bar');
  const ssPrevBtn = document.getElementById('ss-prev');
  const ssNextBtn = document.getElementById('ss-next');

  const SS_SPEEDS = [20, 15, 10, 7, 5]; // seconds per photo, slowest first
  const SS_SPEED_KEY = 'slideshowSpeed';
  const SS_CLOSE_MS = 150;
  const SS_HOLD_MS = 500;
  const SS_OPEN_MS = 150;
  const SS_UI_IDLE_MS = 3000;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let ssSpeed = Number(storageGet(SS_SPEED_KEY)) || 10;
  if (!SS_SPEEDS.includes(ssSpeed)) ssSpeed = 10;
  let ssOrder = [];
  let ssPos = 0;
  let ssPaused = false;
  let ssTimer = null;
  let ssRemaining = 0; // ms left on the current photo (while paused)
  let ssDeadline = 0; // when the current photo's time runs out (while playing)
  let ssUiTimer = null;
  let ssAnim = null; // { frame, token } of the running shutter transition
  let ssClosure = 0; // 0 = shutter open, 1 = fully shut

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

  // Blades and the black layer are both driven from one number so they can
  // never drift apart.
  function ssSetClosure(c) {
    ssClosure = c;
    const blade = reduceMotion ? 0 : c;
    ssShutterTop.style.transform = `translateY(${(blade - 1) * 100}%)`;
    ssShutterBottom.style.transform = `translateY(${(1 - blade) * 100}%)`;
    ssDim.style.opacity = c;
    // The caption goes dark with the photo, so the new title arrives with it.
    ssBar.style.opacity = 1 - c;
  }

  const easeIn = (t) => t * t * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function ssAnimate(from, to, ms, ease, token) {
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = (now) => {
        if (!ssAnim || ssAnim.token !== token) return resolve(false);
        const t = ms ? Math.min(1, (now - start) / ms) : 1;
        ssSetClosure(from + (to - from) * ease(t));
        if (t < 1) ssAnim.frame = requestAnimationFrame(tick);
        else resolve(true);
      };
      ssAnim.frame = requestAnimationFrame(tick);
    });
  }

  function ssWaitForImage(img, maxMs) {
    return new Promise((resolve) => {
      if (img.complete && img.naturalWidth) return resolve();
      const done = () => { clearTimeout(t); img.onload = img.onerror = null; resolve(); };
      const t = setTimeout(done, maxMs);
      img.onload = done;
      img.onerror = done;
    });
  }

  // Close the shutter (from wherever it is), hold, swap to ssOrder[pos], open.
  // Stepping again mid-transition just retargets it: the newest photo wins.
  async function ssGoTo(pos, { first = false } = {}) {
    ssPos = pos;
    clearTimeout(ssTimer);
    ssProgressReset();
    if (ssAnim && ssAnim.running) return; // the running transition picks up the new ssPos
    const token = {};
    if (ssAnim) cancelAnimationFrame(ssAnim.frame);
    ssAnim = { token, frame: 0, running: true };
    const closeMs = reduceMotion ? 250 : SS_CLOSE_MS;
    const openMs = reduceMotion ? 250 : SS_OPEN_MS;
    if (!first) {
      if (!(await ssAnimate(ssClosure, 1, closeMs * (1 - ssClosure), easeIn, token))) return;
    }
    const holdStart = performance.now();
    let shown = -1;
    // Keep swapping while shut in case the target moved during the hold.
    while (shown !== ssPos) {
      shown = ssPos;
      const item = items[ssOrder[shown]];
      ssImg.src = item.medium;
      ssImg.alt = item.title || item.caption || 'Photo';
      ssRenderInfo(item);
      await ssWaitForImage(ssImg, 4000);
      const left = SS_HOLD_MS - (performance.now() - holdStart);
      if (left > 0) await new Promise((r) => setTimeout(r, left));
      if (!ssAnim || ssAnim.token !== token) return;
    }
    if (!(await ssAnimate(1, 0, openMs, easeOut, token))) return;
    ssAnim.running = false;
    if (shown !== ssPos) return ssGoTo(ssPos);
    ssStartTimer(ssSpeed * 1000);
  }

  function ssStartTimer(ms) {
    clearTimeout(ssTimer);
    ssRemaining = ms;
    ssProgressStart(ms, ssSpeed * 1000);
    if (ssPaused) return;
    ssDeadline = performance.now() + ms;
    ssTimer = setTimeout(() => ssStep(1), ms);
  }

  // Thin bar along the bottom of the panel filling up to the next photo --
  // the at-a-glance "yes, it's running" sign.
  function ssProgressReset() {
    ssProgressBar.style.transition = 'none';
    ssProgressBar.style.width = '0%';
  }

  function ssProgressStart(msLeft, msTotal) {
    ssProgressBar.style.transition = 'none';
    ssProgressBar.style.width = `${(1 - msLeft / msTotal) * 100}%`;
    void ssProgressBar.offsetWidth;
    if (ssPaused) return;
    ssProgressBar.style.transition = `width ${msLeft}ms linear`;
    ssProgressBar.style.width = '100%';
  }

  function ssProgressFreeze() {
    const w = ssProgressBar.getBoundingClientRect().width;
    const total = ssProgressBar.parentElement.getBoundingClientRect().width || 1;
    ssProgressBar.style.transition = 'none';
    ssProgressBar.style.width = `${(w / total) * 100}%`;
  }

  function ssStep(delta) {
    if (!ssOrder.length) return;
    ssGoTo((ssPos + delta + ssOrder.length) % ssOrder.length);
  }

  function ssTransitioning() {
    return !!(ssAnim && ssAnim.running);
  }

  function ssTogglePause() {
    ssPaused = !ssPaused;
    if (ssPaused) {
      if (!ssTransitioning()) {
        clearTimeout(ssTimer);
        ssRemaining = Math.max(0, ssDeadline - performance.now());
        ssProgressFreeze();
      }
    } else if (!ssTransitioning()) {
      ssStartTimer(ssRemaining || ssSpeed * 1000);
    }
    ssRenderControls();
    ssShowUi();
  }

  function ssSetSpeed(sec) {
    ssSpeed = sec;
    storageSet(SS_SPEED_KEY, String(sec));
    // A new speed starts the current photo's count again at that speed.
    if (!ssTransitioning()) ssStartTimer(sec * 1000);
    ssRenderControls();
  }

  function ssRenderControls() {
    ssStatus.textContent = ssPaused ? `Paused · ${ssSpeed}s per photo` : `Playing · ${ssSpeed}s per photo`;
    ssPlayBtn.innerHTML = ssPaused ? '&#9654;' : '&#10074;&#10074;';
    ssPlayBtn.setAttribute('aria-label', ssPaused ? 'Play' : 'Pause');
    ssSpeedsEl.querySelectorAll('button').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.speed) === ssSpeed);
    });
  }

  SS_SPEEDS.forEach((sec) => {
    const btn = document.createElement('button');
    btn.className = 'ss-speed';
    btn.dataset.speed = sec;
    btn.textContent = `${sec}s`;
    btn.addEventListener('click', (e) => { e.stopPropagation(); ssSetSpeed(sec); ssShowUi(); });
    ssSpeedsEl.appendChild(btn);
  });

  // Controls stay up while paused, so it's obvious nothing is moving.
  function ssShowUi() {
    ssEl.classList.remove('ss-ui-hidden');
    clearTimeout(ssUiTimer);
    ssUiTimer = setTimeout(() => {
      if (!ssPaused) ssEl.classList.add('ss-ui-hidden');
    }, SS_UI_IDLE_MS);
  }

  // The slideshow plays whatever the current view is showing: all photos on
  // the Categories home, one section on a category page, the hearted photos
  // on My Hearts, and on the Timeline / Map only what is on screen right now
  // (so the zoomed-all-the-way-out overview is still every photo).
  // Timeline "on screen" is judged by time (left/right) only: in the
  // overview, busy days fan out into more lanes than fit vertically, and
  // those photos still count as part of the range being looked at.
  function inTimeRange(el, box) {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.right > box.left && r.left < box.right;
  }

  function timelineVisibleOrder() {
    if (!tlViewportEl || !tlViewportEl.isConnected) return chronoOrder;
    const box = tlViewportEl.getBoundingClientRect();
    const shown = new Set();
    tlClusterNodes.forEach((el, key) => {
      if (!inTimeRange(el, box)) return;
      const group = getDayGroups().find((g) => g.key === key);
      if (group) group.indices.forEach((i) => shown.add(i));
    });
    tlItemNodes.forEach((node, idx) => { if (inTimeRange(node.wrap, box)) shown.add(idx); });
    return chronoOrder.filter((i) => shown.has(i));
  }

  function mapVisibleOrder() {
    if (!mapInstance) return chronoOrder;
    const placeGroups = getPlaceGroups();
    const open = mapSelectedKey && placeGroups.find((g) => g.key === mapSelectedKey);
    if (open) return open.indices.slice();
    const bounds = mapInstance.getBounds();
    const shown = new Set();
    placeGroups.forEach((g) => {
      if (g.place && bounds.contains([g.place.lat, g.place.lng])) g.indices.forEach((i) => shown.add(i));
    });
    return chronoOrder.filter((i) => shown.has(i));
  }

  function slideshowOrder() {
    const hash = location.hash;
    if (hash === '#/hearts') return hearts.map((slug) => indexBySlug.get(slug));
    if (hash === '#/timeline') return timelineVisibleOrder();
    if (hash === '#/map') return mapVisibleOrder();
    const m = hash.match(/^#\/c\/(.+)$/);
    const groupItems = m && groups.get(decodeURIComponent(m[1]));
    if (groupItems) return groupItems.map((item) => item._index);
    return globalOrder;
  }

  function ssOpen() {
    ssOrder = slideshowOrder();
    if (!ssOrder.length) return;
    ssPaused = false;
    ssEl.hidden = false;
    document.body.style.overflow = 'hidden';
    ssSetClosure(1);
    ssRenderControls();
    ssShowUi();
    ssPreloadAll();
    ssGoTo(0, { first: true });
    if (ssEl.requestFullscreen) {
      ssEl.requestFullscreen().catch(() => {});
    }
  }

  function ssCloseFn() {
    clearTimeout(ssTimer);
    clearTimeout(ssUiTimer);
    if (ssAnim) cancelAnimationFrame(ssAnim.frame);
    ssAnim = null;
    ssEl.hidden = true;
    ssEl.classList.remove('ss-ui-hidden');
    document.body.style.overflow = '';
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  ssStartBtn.addEventListener('click', ssOpen);
  ssClose.addEventListener('click', ssCloseFn);
  ssPlayBtn.addEventListener('click', (e) => { e.stopPropagation(); ssTogglePause(); });
  ssPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); ssStep(-1); ssShowUi(); });
  ssNextBtn.addEventListener('click', (e) => { e.stopPropagation(); ssStep(1); ssShowUi(); });

  // Mouse: any movement brings the controls back. Touch: a tap while they're
  // hidden only brings them back; a tap while they're showing pauses/plays,
  // the same as a mouse click on the photo.
  ssEl.addEventListener('mousemove', () => { if (!ssEl.hidden) ssShowUi(); });
  ssStage.addEventListener('click', (e) => {
    if (e.pointerType === 'touch' || ssLastPointerTouch) {
      ssLastPointerTouch = false;
      if (ssEl.classList.contains('ss-ui-hidden')) return ssShowUi();
    }
    ssTogglePause();
  });
  let ssLastPointerTouch = false;
  ssStage.addEventListener('pointerdown', (e) => { ssLastPointerTouch = e.pointerType === 'touch'; });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && !ssEl.hidden) ssCloseFn();
  });

  document.addEventListener('keydown', (e) => {
    if (ssEl.hidden) return;
    if (e.key === 'Escape') return ssCloseFn();
    if (e.key === 'ArrowRight') { ssShowUi(); return ssStep(1); }
    if (e.key === 'ArrowLeft') { ssShowUi(); return ssStep(-1); }
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
