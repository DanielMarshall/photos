(async function () {
  const grid = document.getElementById('grid');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbZoom = document.getElementById('lb-zoom');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  const res = await fetch('images.json');
  const items = await res.json();

  let current = -1;
  let zoomed = false;

  items.forEach((item, i) => {
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = item.thumb;
    img.loading = 'lazy';
    img.alt = item.caption || 'Photo';
    fig.appendChild(img);
    if (item.caption) {
      const cap = document.createElement('figcaption');
      cap.textContent = item.caption;
      fig.appendChild(cap);
    }
    fig.addEventListener('click', () => open(i));
    grid.appendChild(fig);
  });

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
    lbImg.alt = item.caption || 'Photo';
    lbCaption.textContent = item.caption || '';
    lbZoom.textContent = zoomed ? 'Back to normal size' : 'View full resolution';
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function step(delta) {
    current = (current + delta + items.length) % items.length;
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
