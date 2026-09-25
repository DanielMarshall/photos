(async function () {
  const main = document.getElementById('sections');
  const lightbox = document.getElementById('lightbox');
  const lbViewport = document.getElementById('lb-viewport');
  const lbImg = document.getElementById('lb-img');
  const lbInfo = document.querySelector('.lb-info');
  const lbTitle = document.getElementById('lb-title');
  const lbMeta = document.getElementById('lb-meta');
  const lbZoom = document.getElementById('lb-zoom');
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
    'Gladesville|Experiments in Liquids': 'Gladesville: Experiments in Liquids',
    'Gladesville|Dinosaurs': 'The Last of the Dinosaurs',
    'Gladesville|Frank photos of Frankie': 'Frank photos of Frankie',
    "Gladesville|Michael's Flowers": "Michael's Flowers",
    "Gladesville|Michael's Fender": "Michael's Fender",
    "Gladesville|Michael's Studio": "Michael's Studio",
    'Gladesville|Moss': 'Gladesville: Moss',
    'Gladesville|Indoor Macro': 'Gladesville: Indoor Macro',
    'Gladesville|Planes': 'Gladesville: Planes',
    'Gladesville|People': 'Gladesville: People',
    'Gladesville|Uncategorized': 'Gladesville: Other',
    'Hornsby Heights|null': 'Hornsby Heights',
    'Artarmon|null': 'Artarmon',
    'Sydney CBD|null': 'Sydney CBD (Darling Harbour)',
    'Sydney Town Hall|null': 'Sydney Town Hall: Ukraine Solidarity Protest',
    'Queen Victoria Building|null': 'Queen Victoria Building: Public Piano',
    'Chinese Garden of Friendship|null': 'Chinese Garden of Friendship',
    'Darling Harbour Piano|null': 'Darling Harbour Piano',
  };

  // Shown on each category's card on the home view, and again as an intro
  // line in the category's own detail view.
  const SECTION_DESCRIPTIONS = {
    'Gladesville|Ants': "Ants rushing madly around a weed in the back yard. A narrow aperture let the flash freeze them as best it could; a lower flash power and wider aperture might still beat the sunlight for sharper shots, but it's a good idea of what to expect from ants in motion.",
    'Gladesville|Banjo Paterson Park': 'Shoreline macro and telephoto views across the bay to Abbotsford, where the Sydney Rowing Club and Abbotsford Rowing Club sit side by side.',
    'Gladesville|Garden': 'Backyard macro photography — spiders, insects, and other garden life, including focus-stacked composites.',
    'Gladesville|Experiments in Liquids': 'Macro tests of oil and glitter in liquid, exploring focus and lighting technique.',
    'Gladesville|Dinosaurs': "They like roasted almonds enough that they will fight each other off to see who gets to almost take off one of my fingers, and hang around for some photos afterwards, until Timmy came to investigate, and their extinction paranoia kicked in and they went to their next stop.",
    'Gladesville|Frank photos of Frankie': "Extreme close-up macro shots of Frankie's facial features. Don't ask about the eyeshadow.",
    "Gladesville|Michael's Flowers": 'Macro photos of a tiny flower arrangement Michael put together.',
    "Gladesville|Michael's Fender": "Michael dialling in the tone on his Fender bass amp.",
    "Gladesville|Michael's Studio": "Michael's new home studio, freshly set up in the living room — the same setup as his Fender amp session.",
    'Gladesville|Moss': 'Macro shots of a moss sample on the kitchen counter.',
    'Gladesville|Indoor Macro': 'Macro shots of curious objects found around the house — an old hard drive, a mandarin peel, and a wine cork.',
    'Gladesville|Planes': 'Planes photographed from the yard, some with the MC-20 teleconverter for extra reach.',
    'Gladesville|People': 'Family and friends around home.',
    'Gladesville|Uncategorized': "A few photos that don't fit anywhere else yet.",
    'Hornsby Heights|null': "Family photos at mum and dad's house in Hornsby Heights.",
    'Artarmon|null': 'Portraits of colleagues at work in Artarmon.',
    'Sydney CBD|null': 'Snapshots around Darling Harbour and the Sydney CBD.',
    'Chinese Garden of Friendship|null': 'Water dragons and the waterfall at the Chinese Garden of Friendship, Darling Harbour.',
    'Sydney Town Hall|null': 'A Ukraine solidarity protest at Sydney Town Hall.',
    'Queen Victoria Building|null': 'The public piano, clock, and mall interior at the QVB.',
    'Darling Harbour Piano|null': 'A public piano at Darling Harbour.',
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
    document.body.style.overflow = '';
    resetZoomState();
    releaseFullObjectURL();
    lbLoading.hidden = true;
    stopEditing();
  }

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
