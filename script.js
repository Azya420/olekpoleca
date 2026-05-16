const films = [
  { title: 'Interstellar', year: 2014, genre: 'Sci-Fi', rating: '8.7/10', time: '169 min', trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop', desc: 'Wizjonerska podróż przez czas i przestrzeń z wielkimi emocjami.' },
  { title: 'Parasite', year: 2019, genre: 'Thriller', rating: '8.5/10', time: '132 min', trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY', img: 'https://images.unsplash.com/photo-1489599735188-3fd1c7fcb1aa?q=80&w=1200&auto=format&fit=crop', desc: 'Mistrzowska satyra społeczna z zaskakującymi zwrotami.' },
  { title: 'Whiplash', year: 2014, genre: 'Dramat', rating: '8.5/10', time: '106 min', trailer: 'https://www.youtube.com/watch?v=7d_jQycdQGo', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop', desc: 'Historia obsesji na punkcie perfekcji i ceny sukcesu.' },
  { title: 'Mad Max: Fury Road', year: 2015, genre: 'Akcja', rating: '8.1/10', time: '120 min', trailer: 'https://www.youtube.com/watch?v=hEJnMQG9ev8', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop', desc: 'Dynamiczne kino akcji i spektakularna realizacja.' },
  { title: 'La La Land', year: 2016, genre: 'Musical', rating: '8.0/10', time: '128 min', trailer: 'https://www.youtube.com/watch?v=0pdqf4P9MB8', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop', desc: 'Nowoczesny musical o marzeniach, miłości i wyborach.' },
  { title: 'Dune', year: 2021, genre: 'Sci-Fi', rating: '8.0/10', time: '155 min', trailer: 'https://www.youtube.com/watch?v=n9xhJrPXop4', img: 'https://images.unsplash.com/photo-1581905764498-f1b60bae941a?q=80&w=1200&auto=format&fit=crop', desc: 'Epicki świat Arrakis i walka o przyszłość imperium.' }
];

const storageKey = 'olekpoleca-favorites';
const themeKey = 'olekpoleca-theme';
const app = {
  search: '',
  genre: 'Wszystkie',
  onlyFav: false,
  favorites: new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')),
};

const els = {
  grid: document.getElementById('filmGrid'),
  tpl: document.getElementById('filmCardTemplate'),
  search: document.getElementById('searchInput'),
  genreFilters: document.getElementById('genreFilters'),
  favoritesOnly: document.getElementById('favoritesOnly'),
  countAll: document.getElementById('countAll'),
  countFav: document.getElementById('countFav'),
  countGenres: document.getElementById('countGenres'),
  randomPick: document.getElementById('randomPick'),
  randomDialog: document.getElementById('randomDialog'),
  randomFilmTitle: document.getElementById('randomFilmTitle'),
  themeToggle: document.getElementById('themeToggle'),
};

function saveFavorites() {
  localStorage.setItem(storageKey, JSON.stringify([...app.favorites]));
}

function filterFilms() {
  return films.filter((film) => {
    const text = `${film.title} ${film.desc}`.toLowerCase();
    const searchMatch = text.includes(app.search.toLowerCase());
    const genreMatch = app.genre === 'Wszystkie' || film.genre === app.genre;
    const favMatch = !app.onlyFav || app.favorites.has(film.title);
    return searchMatch && genreMatch && favMatch;
  });
}

function renderGenres() {
  const genres = ['Wszystkie', ...new Set(films.map((f) => f.genre))];
  els.genreFilters.innerHTML = '';
  genres.forEach((g) => {
    const btn = document.createElement('button');
    btn.className = `btn btn-small ${app.genre === g ? 'btn-primary' : ''}`;
    btn.textContent = g;
    btn.onclick = () => { app.genre = g; renderAll(); };
    els.genreFilters.appendChild(btn);
  });
}

function renderStats() {
  els.countAll.textContent = films.length;
  els.countFav.textContent = app.favorites.size;
  els.countGenres.textContent = new Set(films.map((f) => f.genre)).size;
}

function renderCards() {
  const visible = filterFilms();
  els.grid.innerHTML = '';
  if (!visible.length) {
    els.grid.innerHTML = '<p class="glass" style="padding:1rem;">Brak filmów spełniających kryteria.</p>';
    return;
  }

  visible.forEach((film) => {
    const node = els.tpl.content.firstElementChild.cloneNode(true);
    node.querySelector('.thumb').src = film.img;
    node.querySelector('.thumb').alt = `Plakat filmu ${film.title}`;
    node.querySelector('.film-title').textContent = film.title;
    node.querySelector('.film-year').textContent = film.year;
    node.querySelector('.film-desc').textContent = film.desc;
    node.querySelector('.film-genre').textContent = film.genre;
    node.querySelector('.film-rating').textContent = `⭐ ${film.rating}`;
    node.querySelector('.film-time').textContent = `⏱ ${film.time}`;
    node.querySelector('.trailer-link').href = film.trailer;

    const favBtn = node.querySelector('.favorite-btn');
    const setFavUI = () => {
      const active = app.favorites.has(film.title);
      favBtn.textContent = active ? '♥' : '♡';
      favBtn.classList.toggle('active', active);
    };
    setFavUI();

    favBtn.onclick = () => {
      if (app.favorites.has(film.title)) app.favorites.delete(film.title);
      else app.favorites.add(film.title);
      saveFavorites();
      setFavUI();
      renderStats();
      if (app.onlyFav) renderCards();
    };

    els.grid.appendChild(node);
  });
}

function renderAll() {
  renderGenres();
  renderCards();
  renderStats();
}

els.search.addEventListener('input', (e) => {
  app.search = e.target.value;
  renderCards();
});
els.favoritesOnly.addEventListener('change', (e) => {
  app.onlyFav = e.target.checked;
  renderCards();
});
els.randomPick.addEventListener('click', () => {
  const pool = filterFilms();
  if (!pool.length) return;
  const random = pool[Math.floor(Math.random() * pool.length)];
  els.randomFilmTitle.textContent = `${random.title} (${random.year})`;
  els.randomDialog.showModal();
});

function applyTheme(theme) {
  document.documentElement.classList.toggle('light', theme === 'light');
  els.themeToggle.textContent = theme === 'light' ? '🌞' : '🌙';
}
els.themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.classList.contains('light');
  const next = isLight ? 'dark' : 'light';
  localStorage.setItem(themeKey, next);
  applyTheme(next);
});

applyTheme(localStorage.getItem(themeKey) || 'dark');
renderAll();
