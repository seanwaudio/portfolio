// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => revealObserver.observe(el));

// Navbar background on scroll
const navbar = document.getElementById('navbar');
const onScroll = () => {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Flip clock — shows local time in East Sussex, UK regardless of visitor's own timezone
const flipDigits = document.querySelectorAll('.flip-digit');

function setDigit(el, newVal) {
  const front = el.querySelector('.flip-front');
  const back = el.querySelector('.flip-back');
  const current = el.dataset.value;

  if (current === undefined) {
    front.textContent = newVal;
    back.textContent = newVal;
    el.dataset.value = newVal;
    return;
  }

  if (current === newVal) return;

  front.textContent = current;
  back.textContent = newVal;
  el.classList.remove('flipping');
  void el.offsetWidth; // restart animation
  el.classList.add('flipping');
  el.dataset.value = newVal;

  el.addEventListener('animationend', function handler() {
    el.classList.remove('flipping');
    front.textContent = newVal;
    el.removeEventListener('animationend', handler);
  });
}

function updateClock() {
  if (!flipDigits.length) return;
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const hh = parts.find((p) => p.type === 'hour').value;
  const mm = parts.find((p) => p.type === 'minute').value;
  const digits = (hh + mm).split('');

  flipDigits.forEach((el) => {
    const pos = Number(el.dataset.pos);
    setDigit(el, digits[pos]);
  });
}

updateClock();
setInterval(updateClock, 1000);

// YouTube facade — custom thumbnail + play button, real player loads only on click
document.querySelectorAll('.yt-facade').forEach((facade) => {
  const id = facade.dataset.ytId;
  const hqUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const maxresUrl = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

  facade.style.backgroundImage = `url('${hqUrl}')`;
  const probe = new Image();
  probe.onload = () => {
    if (probe.naturalWidth > 480) facade.style.backgroundImage = `url('${maxresUrl}')`;
  };
  probe.src = maxresUrl;

  const loadVideo = () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = facade.getAttribute('aria-label') || 'YouTube video';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
  };

  facade.addEventListener('click', loadVideo);
  facade.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      loadVideo();
    }
  });
});
