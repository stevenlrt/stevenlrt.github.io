// ============================================================
// SITE CONFIG (unchanged from the original site)
// ============================================================
var SITE_CONFIG = {
  resumeUrl: "https://drive.google.com/file/d/1lzU4dWfQADVitU-nukFwnJfsWAtlnhpb/view?usp=sharing",
  contactFormAccessKey: "9ff19a72-c3b6-49fc-8465-e15c095c96d0"
};

document.documentElement.classList.add('js');

// Resume links
(function () {
  ['resume-link-hero', 'resume-link-contact'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (SITE_CONFIG.resumeUrl) {
      el.setAttribute('href', SITE_CONFIG.resumeUrl);
    } else {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Resume link is not set up yet.');
      });
    }
  });
})();

// Contact form (Web3Forms)
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var statusEl = document.getElementById('cf-status');
  var submitBtn = form.querySelector('.form-submit');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.botcheck && form.botcheck.checked) return;

    if (!SITE_CONFIG.contactFormAccessKey) {
      statusEl.textContent = 'This form is not connected yet. Please email me directly for now.';
      statusEl.className = 'form-status error';
      return;
    }

    var data = {
      access_key: SITE_CONFIG.contactFormAccessKey,
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
      subject: 'New message from portfolio site'
    };

    submitBtn.disabled = true;
    statusEl.textContent = 'Sending...';
    statusEl.className = 'form-status';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        submitBtn.disabled = false;
        if (result.success) {
          statusEl.textContent = "Your message has been sent. I'll get back to you soon!";
          statusEl.className = 'form-status success';
          form.reset();
        } else {
          statusEl.textContent = 'Something went wrong. Please try again or email me directly.';
          statusEl.className = 'form-status error';
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        statusEl.textContent = 'Something went wrong. Please try again or email me directly.';
        statusEl.className = 'form-status error';
      });
  });
})();

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// FAQ accordion
document.querySelectorAll('.faq-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var expanded = this.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-btn').forEach(function (other) {
      if (other === btn) return;
      other.setAttribute('aria-expanded', 'false');
      if (other.nextElementSibling) other.nextElementSibling.classList.remove('open');
    });
    this.setAttribute('aria-expanded', String(!expanded));
    if (this.nextElementSibling) this.nextElementSibling.classList.toggle('open', !expanded);
  });
});

// Theme toggle (dark by default)
(function () {
  var root = document.documentElement, btn = document.getElementById('theme-toggle');
  if (!btn) return;
  function label() { btn.setAttribute('aria-label', 'Switch to ' + (root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark') + ' mode'); }
  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    label();
  });
  label();
})();

// Podcast embeds: set data-src on each .embed-slot in index.html
document.querySelectorAll('.embed-slot').forEach(function (slot) {
  var src = (slot.getAttribute('data-src') || '').trim();
  if (!src) return;
  var f = document.createElement('iframe');
  f.title = slot.getAttribute('data-title') || 'Podcast episode'; f.loading = 'lazy';
  f.referrerPolicy = 'strict-origin-when-cross-origin';
  f.allowFullscreen = true;
  f.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
  f.src = src;
  slot.innerHTML = ''; slot.appendChild(f); slot.classList.add('has-embed');
});

// Missing images show a short note instead of a broken icon
function markEmpty(img) {
  var h = img.parentElement, s = img.closest('[data-placeholder]') || h;
  h.classList.add('is-empty'); h.setAttribute('data-empty', s.getAttribute('data-placeholder') || 'Add image');
}
document.querySelectorAll('img').forEach(function (img) {
  if (img.complete && img.naturalWidth === 0) markEmpty(img);
  else img.addEventListener('error', function () { markEmpty(img); });
});

// Header gradient and blur only while scrolled
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  function check() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();
