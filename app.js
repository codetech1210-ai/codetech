const quotes = [
  { quote: 'Every great discovery begins with the courage to ask one more question.', name: 'ATL Lab Educator', title: 'Innovation & making · Replace with your teacher’s quote' },
  { quote: 'Physics helps us notice the remarkable ideas hiding inside everyday things.', name: 'Physics Educator', title: 'Physics · Replace with your teacher’s quote' },
  { quote: 'When we look up at the night sky, we remember how much there is to explore.', name: 'Astronomy Educator', title: 'Astronomy · Replace with your teacher’s quote' }
];
let quoteIndex = 0;
const quoteText = document.querySelector('#teacher-quote');
function showQuote(index) {
  quoteIndex = (index + quotes.length) % quotes.length;
  const q = quotes[quoteIndex];
  quoteText.textContent = q.quote;
  document.querySelector('#teacher-name').textContent = q.name;
  document.querySelector('#teacher-title').textContent = q.title;
  document.querySelector('#quote-count').textContent = `0${quoteIndex + 1} / 0${quotes.length}`;
  loadTeacherPhoto(q.name);
}
document.querySelector('#quote-prev').addEventListener('click', () => showQuote(quoteIndex - 1));
document.querySelector('#quote-next').addEventListener('click', () => showQuote(quoteIndex + 1));
setInterval(() => showQuote(quoteIndex + 1), 7500);

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.textContent = '☰';
}));

const dbPromise = new Promise((resolve, reject) => {
  const request = indexedDB.open('beyond-the-stars-gallery', 2);
  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains('media')) db.createObjectStore('media', { keyPath: 'id', autoIncrement: true });
    if (!db.objectStoreNames.contains('teacherPhotos')) db.createObjectStore('teacherPhotos', { keyPath: 'educator' });
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});
async function dbAction(mode, callback) {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', mode);
    const result = callback(tx.objectStore('media'));
    tx.oncomplete = () => resolve(result?.result);
    tx.onerror = () => reject(tx.error);
  });
}
async function loadTeacherPhoto(educator) {
  try {
    const photo = await dbAction('readonly', store => store.get(educator));
    const image = document.querySelector('#teacher-photo');
    const placeholder = document.querySelector('#portrait-placeholder');
    if (image.dataset.url) URL.revokeObjectURL(image.dataset.url);
    if (photo?.file) {
      const url = URL.createObjectURL(photo.file);
      image.src = url; image.dataset.url = url; image.hidden = false; placeholder.hidden = true;
    } else {
      image.removeAttribute('src'); image.hidden = true; placeholder.hidden = false;
    }
  } catch (_) { /* Keep the portrait placeholder visible when browser storage is unavailable. */ }
}
document.querySelector('#teacher-photo-upload').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file || !file.type.startsWith('image/')) return;
  const educator = quotes[quoteIndex].name;
  try {
    await dbAction('readwrite', store => store.put({ educator, file }));
    await loadTeacherPhoto(educator);
  } catch (_) {
    alert('This browser could not save the teacher photo. Try a smaller image or a device with more available storage.');
  }
});
const grid = document.querySelector('#gallery-grid');
const categoryDialog = document.querySelector('#category-dialog');
const mediaDialog = document.querySelector('#media-dialog');
let pendingFiles = [];
let activeFilter = 'All';
document.querySelector('#media-upload').addEventListener('change', event => {
  pendingFiles = [...event.target.files];
  event.target.value = '';
  if (!pendingFiles.length) return;
  document.querySelector('#selected-files').textContent = `${pendingFiles.length} item${pendingFiles.length === 1 ? '' : 's'} selected`;
  categoryDialog.showModal();
});
categoryDialog.addEventListener('close', async () => {
  const category = categoryDialog.returnValue;
  if (!['ATL Lab', 'Physics', 'Astronomy'].includes(category)) { pendingFiles = []; return; }
  try {
    for (const file of pendingFiles) await dbAction('readwrite', store => store.add({ file, name: file.name, type: file.type, category, added: Date.now() }));
    pendingFiles = [];
    await renderGallery();
  } catch (error) {
    alert('This browser could not save the selected media. Try smaller files or a device with more available storage.');
  }
});
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === button));
  renderGallery();
}));
document.querySelectorAll('.world-card').forEach(card => card.addEventListener('click', () => {
  activeFilter = card.dataset.category;
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b.dataset.filter === activeFilter));
}));

async function renderGallery() {
  try {
    const savedItems = await dbAction('readonly', store => store.getAll());
    const codeItems = (window.siteGalleryItems || []).map((item, index) => ({ ...item, id: `code-${index}`, codeManaged: true, added: 0 }));
    const visible = [...(savedItems || []), ...codeItems]
      .filter(item => activeFilter === 'All' || item.category === activeFilter)
      .sort((a, b) => (b.added || 0) - (a.added || 0));
    grid.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement('div'); empty.className = 'gallery-empty';
      empty.innerHTML = '<span>✧</span><h3>Your discoveries belong here.</h3><p>Add school photos and videos to start your gallery.</p><label class="button button-outline" for="media-upload">Add your first moments</label>';
      grid.append(empty); return;
    }
    for (const item of visible) {
      const url = item.file ? URL.createObjectURL(item.file) : item.src;
      const isVideo = item.type === 'video' || item.type?.startsWith('video/');
      const card = document.createElement('article'); card.className = 'media-card';
      const media = isVideo ? document.createElement('video') : document.createElement('img');
      media.src = url;
      if (media.tagName === 'VIDEO') { media.muted = true; media.playsInline = true; media.preload = 'metadata'; }
      media.alt = item.name;
      const label = document.createElement('div'); label.className = 'media-card-label';
      const name = document.createElement('b'); name.textContent = item.name;
      const category = document.createElement('span'); category.textContent = item.category;
      label.append(name, category);
      card.append(media, label);
      if (!item.codeManaged) {
        const remove = document.createElement('button'); remove.className = 'media-delete'; remove.type = 'button'; remove.setAttribute('aria-label', `Remove ${item.name}`); remove.textContent = '×';
        remove.addEventListener('click', async e => { e.stopPropagation(); await dbAction('readwrite', store => store.delete(item.id)); URL.revokeObjectURL(url); renderGallery(); });
        card.append(remove);
      }
      card.addEventListener('click', () => {
        const view = mediaDialog.querySelector('.media-view'); view.replaceChildren();
        const expanded = isVideo ? document.createElement('video') : document.createElement('img');
        expanded.src = url; if (expanded.tagName === 'VIDEO') { expanded.controls = true; expanded.autoplay = true; }
        expanded.alt = item.name; view.append(expanded); mediaDialog.showModal();
      });
      grid.append(card);
    }
  } catch (error) {
    grid.innerHTML = '<div class="gallery-empty"><h3>Gallery storage is unavailable.</h3><p>Try opening this site in a modern browser with storage enabled.</p></div>';
  }
}
mediaDialog.querySelector('.dialog-close').addEventListener('click', () => mediaDialog.close());
mediaDialog.addEventListener('close', () => mediaDialog.querySelector('.media-view').replaceChildren());
renderGallery();
showQuote(0);
