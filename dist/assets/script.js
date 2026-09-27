const root = document.documentElement;
const themeButton = document.querySelector('[data-theme-toggle]');
const savedTheme = localStorage.getItem('theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  if (themeButton) {
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    themeButton.textContent = theme === 'dark' ? '☀' : '☾';
  }
}
setTheme(savedTheme || preferredTheme);
themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

const menuButton = document.querySelector('[data-menu-toggle]');
const navLinks = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible'));
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = contactForm.querySelector('[data-form-status]');
  const submit = contactForm.querySelector('button[type="submit"]');
  status.textContent = 'Sending…';
  submit.disabled = true;
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send your message.');
    contactForm.reset();
    status.textContent = 'Message sent. Thank you!';
  } catch (error) {
    status.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
});
