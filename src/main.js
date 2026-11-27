import './style.css';

// Update only these values when the final event details are confirmed.
const EVENT_DETAILS = {
  venue: 'Grand Plus',
  date: '12 / 12',
  location: 'https://maps.app.goo.gl/iNenUyX3Kj2JmJQb8?g_st=aw'
};

const envelopeScene = document.querySelector('#envelope-scene');
const guestInput = document.querySelector('#guest-name');
const openButton = document.querySelector('#open-invitation');
const formNote = document.querySelector('#form-note');
const invitationReveal = document.querySelector('#invitation-reveal');
const guestDisplay = document.querySelector('#guest-display');
const returnButton = document.querySelector('#return-to-envelope');
const musicToggle = document.querySelector('.music-toggle');
const musicLabel = document.querySelector('.music-label');
const audio = document.querySelector('#wedding-audio');

const detailNodes = {
  venue: document.querySelector('#venue-name'),
  date: document.querySelector('#wedding-date'),
  location: document.querySelector('#venue-location')
};

Object.entries(EVENT_DETAILS).forEach(([key, value]) => {
  if (!detailNodes[key]) return;
  if (key === 'location') {
    detailNodes[key].href = value;
    detailNodes[key].textContent = 'Open in Google Maps';
    detailNodes[key].target = '_blank';
    detailNodes[key].rel = 'noopener noreferrer';
  } else {
    detailNodes[key].textContent = value;
  }
});

let invitationIsOpen = false;
let musicWasRequested = false;

const setMusicButton = (isPlaying) => {
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
  musicLabel.textContent = isPlaying ? 'Pause music' : 'Play music';
};

const tryStartMusic = () => {
  musicWasRequested = true;
  audio.volume = 0.28;
  const playAttempt = audio.play();
  if (playAttempt && typeof playAttempt.then === 'function') {
    playAttempt.then(() => setMusicButton(true)).catch(() => setMusicButton(false));
  }
};

const showFieldError = () => {
  formNote.textContent = 'A name would make this invitation feel even more personal.';
  formNote.classList.add('is-error');
  guestInput.focus();
};

const openInvitation = () => {
  const exactName = guestInput.value;
  if (!exactName.trim()) {
    showFieldError();
    return;
  }

  formNote.textContent = 'A little note, prepared especially for you.';
  formNote.classList.remove('is-error');
  guestDisplay.textContent = exactName;
  invitationIsOpen = true;
  envelopeScene.classList.add('is-opening');

  window.setTimeout(() => {
    invitationReveal.classList.add('is-visible');
    invitationReveal.setAttribute('aria-hidden', 'false');
    invitationReveal.focus({ preventScroll: true });
    invitationReveal.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 480);
};

const closeInvitation = () => {
  invitationIsOpen = false;
  invitationReveal.classList.remove('is-visible');
  invitationReveal.setAttribute('aria-hidden', 'true');
  envelopeScene.classList.remove('is-opening');
  window.setTimeout(() => guestInput.focus(), 520);
};

openButton.addEventListener('click', openInvitation);
returnButton.addEventListener('click', closeInvitation);
guestInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') openInvitation();
  if (guestInput.value.trim()) {
    formNote.textContent = 'Your name will appear just as you write it.';
    formNote.classList.remove('is-error');
  }
});

audio.addEventListener('play', () => setMusicButton(true));
audio.addEventListener('pause', () => setMusicButton(false));
musicToggle.addEventListener('click', () => {
  if (audio.paused) tryStartMusic();
  else audio.pause();
});

// Try autoplay on entry. If the browser blocks it, the first intentional interaction starts music.
window.addEventListener('load', tryStartMusic, { once: true });
window.addEventListener('pointerdown', () => {
  if (!musicWasRequested && audio.paused) tryStartMusic();
}, { once: true, passive: true });

// Keep the primary action usable for keyboard users without changing the guest's exact text.
openButton.addEventListener('focus', () => formNote.classList.remove('is-error'));
