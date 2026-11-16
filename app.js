// All public gallery media and educator portraits are managed in the project files.
// Add gallery entries in gallery-data.js and set educator photo paths in this array.
const quotes = [
  {
    quote: 'Every great discovery begins with the courage to ask one more question.',
    name: 'ATL Lab Educator',
    title: 'Innovation & making · Replace with your teacher’s quote',
    photo: '' https://github.com/codetech1210-ai/codetech/blob/main/+91%2091404%2059673%2020261116_100742.jpg.jpeg?raw=true'
  },
  {
    quote: 'Physics helps us notice the remarkable ideas hiding inside everyday things.',
    name: 'Physics Educator',
    title: 'Physics · Replace with your teacher’s quote',
    photo: '' https://github.com/codetech1210-ai/codetech/blob/main/WhatsApp%20Image%202026-11-15%20at%2010.13.14%20PM.jpeg?raw=true'
  },
  {
    quote: 'When we look up at the night sky, we remember how much there is to explore.',
    name: 'Astronomy Educator',
    title: 'Astronomy · Replace with your teacher’s quote',
    photo: ''https://github.com/codetech1210-ai/codetech/blob/main/WhatsApp%20Image%202026-11-16%20at%2010.22.04%20AM.jpeg?raw=true'
  }
];

let quoteIndex = 0;
let activeFilter = 'All';

const quoteText = document.querySelector('#teacher-quote');
const quoteImage = document.querySelector('#teacher-photo');
const portraitPlaceholder = document.querySelector('#portrait-placeholder');
const grid = document.querySelector('#gallery-grid');
const mediaDialog = document.querySelector('#media-dialog');

function showQuote(index) {
  quoteIndex = (index + quotes.length) % quotes.length;
  const quote = quotes[quoteIndex];
  quoteText.textContent = quote.quote;
  document.querySelector('#teacher-name').textContent = quote.name;
  document.querySelector('#teacher-title').textContent = quote.title;
  document.querySelector('#quote-count').textContent =
    `${String(quoteIndex + 1).padStart(2, '0')} / ${String(quotes.length).padStart(2, '0')}`;

  if (quote.photo) {
    quoteImage.src = quote.photo;
    quoteImage.alt = `${quote.name} portrait`;
    quoteImage.hidden = false;
    portraitPlaceholder.hidden = true;
    quoteImage.onerror = () => {
      quoteImage.hidden = true;
      portraitPlaceholder.hidden = false;
    };
  } else {
    quoteImage.removeAttribute('src');
    quoteImage.hidden = true;
    portraitPlaceholder.hidden = false;
  }
}

document.querySelector('#quote-prev').addEventListener('click', () => showQuote(quoteIndex - 1));
document.querySelector('#quote-next').addEventListener('click', () => showQuote(quoteIndex + 1));

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(() => showQuote(quoteIndex + 1), 7500);
}

// Mobile navigation closes after a destination is selected and reports its state accessibly.
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

function closeNavigation() {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  menuToggle.textContent = '☰';
}

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));

function setActiveFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.filter').forEach(button => {
    const selected = button.dataset.filter === activeFilter;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  renderGallery();
}

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => setActiveFilter(button.dataset.filter));
});

document.querySelectorAll('.world-card').forEach(card => {
  card.addEventListener('click', () => setActiveFilter(card.dataset.category));
});

function renderGallery() {
  const codeItems = Array.isArray(window.siteGalleryItems) ? window.siteGalleryItems : [];
  const visible = codeItems.filter(item =>
    activeFilter === 'All' || item.category === activeFilter
  );

  grid.replaceChildren();

  if (!visible.length) {
    const empty = document.createElement('div');
    empty.className = 'gallery-empty';
    const symbol = document.createElement('span');
    symbol.textContent = '✧';
    const heading = document.createElement('h3');
    heading.textContent = 'Our discoveries are on their way.';
    const description = document.createElement('p');
    description.textContent = 'School moments will appear here as they are added to the website.';
    empty.append(symbol, heading, description);
    grid.append(empty);
    return;
  }

  for (const item of visible) {
    if (!item || !item.name || !item.src) continue;

    const isVideo = item.type === 'video' ||
      item.type?.startsWith('video/') ||
      /\.(mp4|webm|ogg)(?:$|[?#])/i.test(item.src);

    const card = document.createElement('article');
    card.className = 'media-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${item.name}, ${item.category}. Press Enter or Space to view.`);

    const media = document.createElement(isVideo ? 'video' : 'img');
    media.src = item.src;
    if (isVideo) {
      media.muted = true;
      media.playsInline = true;
      media.preload = 'metadata';
      media.setAttribute('aria-label', item.name);
    } else {
      media.alt = item.name;
      media.loading = 'lazy';
    }

    const label = document.createElement('div');
    label.className = 'media-card-label';
    const name = document.createElement('b');
    name.textContent = item.name;
    const category = document.createElement('span');
    category.textContent = item.category || '';
    label.append(name, category);
    card.append(media, label);

    const openMedia = () => {
      const view = mediaDialog.querySelector('.media-view');
      view.replaceChildren();
      const expanded = document.createElement(isVideo ? 'video' : 'img');
      expanded.src = item.src;
      if (isVideo) {
        expanded.controls = true;
        expanded.autoplay = true;
        expanded.playsInline = true;
      } else {
        expanded.alt = item.name;
      }
      view.append(expanded);
      mediaDialog.showModal();
    };

    card.addEventListener('click', openMedia);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMedia();
      }
    });
    grid.append(card);
  }

  if (!grid.children.length) {
    const empty = document.createElement('div');
    empty.className = 'gallery-empty';
    empty.textContent = 'No gallery items are configured yet.';
    grid.append(empty);
  }
}

mediaDialog.querySelector('.dialog-close').addEventListener('click', () => mediaDialog.close());
mediaDialog.addEventListener('close', () => mediaDialog.querySelector('.media-view').replaceChildren());

renderGallery();
showQuote(0);
