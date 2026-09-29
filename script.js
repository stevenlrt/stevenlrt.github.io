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

// Scroll reveal
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 60 + 'ms';
    io.observe(el);
  });
})();

// Active nav link on scroll
(function () {
  var links = document.querySelectorAll('.nav-links a');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && map[entry.target.id]) {
        links.forEach(function (l) { l.classList.remove('is-active'); });
        map[entry.target.id].classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  Object.keys(map).forEach(function (id) {
    var sec = document.getElementById(id);
    if (sec) io.observe(sec);
  });
})();
