/* ==========================================================================
   CAPC — Charbonnet & Associates Planners and Consultants, Inc.
   main.js

   1. Mobile navigation toggle (open / close / escape / link click)
   2. Active nav link highlighting (IntersectionObserver scrollspy)
   3. Contact form submission handler (front-end only)
   4. Scroll-triggered reveal animations
   5. Footer year
   ========================================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


  /* ======================================================================
     1. MOBILE NAVIGATION TOGGLE
     ====================================================================== */
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  function closeNav() {
    if (!header) return;
    header.classList.remove('nav-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    }
  }

  function openNav() {
    if (!header) return;
    header.classList.add('nav-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
    }
  }

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      if (header.classList.contains('nav-open')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (primaryNav) {
    primaryNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* Close the menu if the viewport grows back to desktop width */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080) closeNav();
  });


  /* ======================================================================
     2. ACTIVE NAV LINK HIGHLIGHTING (scrollspy)
     ====================================================================== */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      {
        /* Trigger when a section crosses the upper third of the viewport */
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
      }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }


  /* ======================================================================
     3. CONTACT FORM SUBMISSION HANDLER (front-end only)
     ====================================================================== */
  var form = document.querySelector('.contact-form');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var status = document.getElementById('formStatus');
      var submitButton = form.querySelector('button[type="submit"]');

      /* Minimal native validation feedback */
      if (!form.checkValidity()) {
        if (status) {
          status.textContent =
            'Please complete the required fields before sending.';
        }
        form.reportValidity();
        return;
      }

      if (submitButton) {
        submitButton.textContent = "✓ Message Sent — We'll be in touch";
        submitButton.style.background = '#065F46';
        submitButton.style.borderColor = '#065F46';
        submitButton.style.color = '#D1FAE5';
        submitButton.disabled = true;
      }
      if (status) {
        status.textContent =
          'Thank you. A member of the CAPC team will respond shortly.';
      }
      form.reset();
    });
  }


  /* ======================================================================
     4. SCROLL-TRIGGERED REVEAL ANIMATIONS
     ====================================================================== */
  var revealEls = document.querySelectorAll(
    '.service-card, .project-item, .project-featured, .team-card, .justice-def-card'
  );

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) {
      el.classList.add('reveal', 'is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });

    /* Failsafe: never leave content hidden if the observer misfires */
    window.setTimeout(function () {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }, 2500);
  }


  /* ======================================================================
     5. FOOTER YEAR
     ====================================================================== */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
