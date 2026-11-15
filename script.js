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
