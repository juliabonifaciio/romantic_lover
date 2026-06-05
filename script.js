const entryScreen = document.getElementById('entryScreen');
const enterButton = document.getElementById('enterButton');
const music = document.getElementById('backgroundMusic');
const musicButton = document.getElementById('musicButton');
const musicStatus = document.getElementById('musicStatus');
const siteHeader = document.getElementById('siteHeader');
const menuButton = document.getElementById('menuButton');
const mainNav = document.getElementById('mainNav');
const floatingHearts = document.getElementById('floatingHearts');

let musicStarted = false;
document.body.classList.add('locked');

enterButton.addEventListener('click', async () => {
  entryScreen.classList.add('hidden');
  document.body.classList.remove('locked');
  burstHearts(window.innerWidth / 2, window.innerHeight / 2, 18);

  try {
    await music.play();
    musicStarted = true;
  } catch (error) {
    musicStarted = false;
    console.info('Adicione o arquivo assets/audio/musica.mp3 para ativar a música.');
  }
  updateMusicButton();
});

musicButton.addEventListener('click', async () => {
  if (music.paused) {
    try {
      await music.play();
      musicStarted = true;
    } catch (error) {
      alert('Adicione uma música no caminho assets/audio/musica.mp3.');
    }
  } else {
    music.pause();
  }
  updateMusicButton();
});

function updateMusicButton() {
  const paused = music.paused || !musicStarted;
  musicButton.classList.toggle('paused', paused);
  musicStatus.textContent = paused ? 'Tocar música' : 'Pausar música';
  musicButton.setAttribute('aria-label', paused ? 'Tocar música' : 'Pausar música');
}

menuButton.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 24);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(section => sectionObserver.observe(section));

function updateRelationshipCounter() {
  const counter = document.getElementById('relationshipCounter');
  const start = new Date(counter.dataset.startDate);
  const now = new Date();
  if (Number.isNaN(start.getTime()) || now < start) return;

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const anchor = new Date(start);
  anchor.setFullYear(start.getFullYear() + years);
  anchor.setMonth(start.getMonth() + months);
  anchor.setDate(start.getDate() + days);
  const remainingMs = Math.max(0, now - anchor);
  const hours = Math.floor(remainingMs / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);

  document.getElementById('years').textContent = years;
  document.getElementById('months').textContent = months;
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}
updateRelationshipCounter();
setInterval(updateRelationshipCounter, 1000);

const filterButtons = document.querySelectorAll('.filter-button');
const galleryItems = [...document.querySelectorAll('.gallery-item')];
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    galleryItems.forEach(item => item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter));
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentImageIndex = 0;

function getVisibleGalleryItems() { return galleryItems.filter(item => !item.classList.contains('hidden')); }
function showLightboxImage(item) {
  if (!item) return;
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = item.querySelector('img').alt;
  lightboxCaption.textContent = item.dataset.caption;
}
function openLightbox(item) {
  const visibleItems = getVisibleGalleryItems();
  currentImageIndex = visibleItems.indexOf(item);
  showLightboxImage(visibleItems[currentImageIndex]);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('locked');
}
function navigateLightbox(direction) {
  const visibleItems = getVisibleGalleryItems();
  currentImageIndex = (currentImageIndex + direction + visibleItems.length) % visibleItems.length;
  showLightboxImage(visibleItems[currentImageIndex]);
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('locked');
}

galleryItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') navigateLightbox(-1);
  if (event.key === 'ArrowRight') navigateLightbox(1);
});

const openLetterButton = document.getElementById('openLetterButton');
const letter = document.getElementById('letter');
openLetterButton.addEventListener('click', event => {
  const isOpen = letter.classList.toggle('open');
  letter.setAttribute('aria-hidden', String(!isOpen));
  openLetterButton.querySelector('span').textContent = isOpen ? 'Fechar espaço da carta' : 'Abrir espaço da carta';
  burstHearts(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2, 10);
  if (isOpen) setTimeout(() => letter.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
});

function createFloatingHeart() {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = '♥';
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${10 + Math.random() * 22}px`;
  heart.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
  heart.style.animationDuration = `${8 + Math.random() * 8}s`;
  floatingHearts.appendChild(heart);
  setTimeout(() => heart.remove(), 17000);
}
setInterval(createFloatingHeart, 1000);

function burstHearts(x, y, amount = 12) {
  for (let index = 0; index < amount; index += 1) {
    const heart = document.createElement('span');
    heart.textContent = '♥';
    heart.style.position = 'fixed';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.zIndex = '1200';
    heart.style.pointerEvents = 'none';
    heart.style.color = index % 2 ? '#ff7692' : '#d41442';
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    const angle = (Math.PI * 2 * index) / amount;
    const distance = 45 + Math.random() * 90;
    heart.animate([
      { transform: 'translate(-50%, -50%) scale(.4)', opacity: 0 },
      { opacity: 1, offset: .15 },
      { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(1.2)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.2,1)' });
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1400);
  }
}

const canvas = document.getElementById('particles');
const context = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles();
}

function createParticles() {
  const amount = Math.min(90, Math.floor(window.innerWidth / 13));
  particles = Array.from({ length: amount }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.7 + .35,
    speed: Math.random() * .19 + .035,
    drift: (Math.random() - .5) * .1,
    alpha: Math.random() * .55 + .12
  }));
}

function animateParticles() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach(particle => {
    particle.y -= particle.speed;
    particle.x += particle.drift;
    if (particle.y < -5) {
      particle.y = window.innerHeight + 5;
      particle.x = Math.random() * window.innerWidth;
    }
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 104, 137, ${particle.alpha})`;
    context.fill();
  });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateParticles();
