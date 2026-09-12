(async function () {
  const main = document.getElementById('sections');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbMeta = document.getElementById('lb-meta');
  const lbZoom = document.getElementById('lb-zoom');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  const res = await fetch('images.json');
  const items = await res.json();

  const SECTION_ORDER = [
    ['Gladesville', 'Insects'],
    ['Gladesville', 'Planes'],
    ['Gladesville', 'People'],
    ['Gladesville', 'Uncategorized'],
    ['Sydney CBD', null],
    ['Chinese Garden of Friendship', null],
  ];

  const SECTION_LABELS = {
    'Gladesville|Insects': 'Gladesville — Insects',
    'Gladesville|Planes': 'Gladesville — Planes',
    'Gladesville|People': 'Gladesville — People',
    'Gladesville|Uncategorized': 'Gladesville — Other',
    'Sydney CBD|null': 'Sydney CBD (Darling Harbour)',
    'Chinese Garden of Friendship|null': 'Chinese Garden of Friendship',
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

      const label = item.title || item.caption;
      if (label) {
        const cap = document.createElement('figcaption');
        cap.textContent = label;
        fig.appendChild(cap);
      }
      fig.addEventListener('click', () => open(item._index));
      grid.appendChild(fig);
    });

    section.appendChild(grid);
    main.appendChild(section);
  });

  let current = -1;
  let zoomed = false;

  function open(i) {
    current = i;
    zoomed = false;
    render();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function render() {
    const item = items[current];
    lbImg.src = zoomed ? item.full : item.medium;
    lbImg.alt = item.title || item.caption || 'Photo';
    lbTitle.textContent = item.title || item.caption || '(untitled)';
    lbZoom.textContent = zoomed ? 'Back to normal size' : 'View full resolution';

    lbMeta.innerHTML = '';
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

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => step(-1));
  lbNext.addEventListener('click', () => step(1));
  lbZoom.addEventListener('click', () => { zoomed = !zoomed; render(); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
