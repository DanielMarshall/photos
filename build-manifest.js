const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, 'manifest.tsv');
const lines = fs.readFileSync(manifestPath, 'utf8').trim().split('\n');

function caption(original) {
  const noExt = original.replace(/\.[Jj][Pp][Gg]$/, '');
  const dated = noExt.match(/^\d{8}_\d{6}P\d+(.*)$/);
  let text;
  if (dated) {
    text = dated[1];
    text = text.replace(/^_?0*\d*/, '');
    text = text.replace(/-\s*copy$/i, '');
    text = text.trim();
  } else {
    text = noExt.replace(/[-_]+/g, ' ').trim();
  }
  return text;
}

const items = lines.map(line => {
  const [slug, original] = line.split('\t');
  return {
    thumb: `images/thumbs/${slug}.jpg`,
    medium: `images/medium/${slug}.jpg`,
    full: `images/full/${slug}.jpg`,
    caption: caption(original),
  };
});

items.sort((a, b) => a.thumb.localeCompare(b.thumb, undefined, { numeric: true, sensitivity: 'base' }));

fs.writeFileSync(path.join(__dirname, 'images.json'), JSON.stringify(items, null, 2));
console.log(`Wrote ${items.length} entries to images.json`);
