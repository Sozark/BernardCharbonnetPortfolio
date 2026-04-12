/* ==========================================================================
   CAPC — Charbonnet & Associates Planners and Consultants, Inc.
   JavaScript: main.js
   Description: All interactive behavior for the CAPC website. Organized
                into three distinct features:
                  1. Active nav link highlighting on scroll
                  2. Contact form submission handler
                  3. Scroll-triggered fade-up animations (IntersectionObserver)
   ========================================================================== */


/* ==========================================================================
   FEATURE 1: ACTIVE NAVIGATION LINK HIGHLIGHTING
   As the user scrolls down the page, the nav link corresponding to the
   currently visible section lights up in gold so they always know where
   they are on the page.
   ========================================================================== */

/* Grab all sections and <div>s that have an id attribute — these correspond
   to the anchor links in the navigation (e.g., #about, #services, #projects) */
const sections = document.querySelectorAll('section[id], div[id]');

/* Grab all anchor tags inside the .nav-links list */
const navLinks = document.querySelectorAll('.nav-links a');

/* Listen for the 'scroll' event on the window object.
   Every time the user scrolls, we run the function inside to figure out
   which section is currently in view. */
window.addEventListener('scroll', () => {

  /* 'current' will hold the id of the section currently in view.
     We start it as an empty string and update it as we loop. */
  let current = '';

  /* Loop through every section on the page */
  sections.forEach(section => {
    /* offsetTop = how far from the top of the document this section starts.
       We subtract 100px so the nav highlights slightly before the section
       reaches the very top of the viewport, giving a more natural feel. */
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.id; /* Update current to this section's id */
    }
  });

  /* Now loop through all nav links and highlight the one that matches
     the currently visible section */
  navLinks.forEach(link => {
    /* link.getAttribute('href') returns something like "#about"
       We check if it matches "#" + current (e.g., "#about") */
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--gold-light)'; /* Highlight the active link */
    } else {
      link.style.color = ''; /* Reset all other links to their default CSS color */
    }
  });

}); /* End scroll event listener */


/* ==========================================================================
   FEATURE 2: CONTACT FORM SUBMISSION HANDLER
   When the user submits the contact form, we prevent the default browser
   behavior (which would try to submit the form to a server URL), show a
   success confirmation message in the button, and disable the button to
   prevent duplicate submissions.

   NOTE: This is a front-end-only handler. To actually send form data to an
   email address or database, you would connect this to a back-end service
   such as Formspree, EmailJS, or a custom server-side API endpoint.
   ========================================================================== */

/**
 * handleSubmit — Called when the contact form is submitted.
 * @param {Event} event — The form submit event object passed in via onsubmit="handleSubmit(event)"
 */
function handleSubmit(event) {

  /* Prevent the browser from reloading the page or navigating away,
     which is the default behavior for <form> submit events */
  event.preventDefault();

  /* Find the submit button inside the form that triggered this event.
     event.target refers to the <form> element itself. */
  const submitButton = event.target.querySelector('button[type="submit"]');

  /* Replace the button text with a success confirmation message */
  submitButton.textContent = "✓ Message Sent — We'll be in touch";

  /* Change the button to a green success style to reinforce the confirmation */
  submitButton.style.background = '#065F46'; /* Dark green */
  submitButton.style.color = '#D1FAE5';      /* Light green text */

  /* Disable the button so the user cannot submit the form again.
     This prevents duplicate messages from being sent. */
  submitButton.disabled = true;

} /* End handleSubmit */


/* ==========================================================================
   FEATURE 3: SCROLL-TRIGGERED FADE-UP ANIMATIONS (IntersectionObserver)
   Cards and project items start invisible and slightly shifted down.
   As the user scrolls down and each element enters the viewport, it
   smoothly fades in and rises up to its final position.

   IntersectionObserver is a modern browser API that efficiently watches
   whether elements are visible in the viewport — far better than listening
   to the scroll event and calling getBoundingClientRect() on every scroll tick.
   ========================================================================== */

/* Create a new IntersectionObserver instance.
   The callback function runs every time an observed element enters or exits
   the viewport. */
const scrollObserver = new IntersectionObserver((entries) => {

  /* 'entries' is an array of IntersectionObserverEntry objects —
      one for each element we are watching */
  entries.forEach(entry => {

    /* entry.isIntersecting is true when the element has scrolled into view */
    if (entry.isIntersecting) {

      /* Animate the element in by resetting the opacity and transform
         back to their "visible" state. The CSS transition property
         (set below when we initialize each element) handles the smooth animation. */
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';

      /* Optional enhancement: once the element has animated in, we could
         call scrollObserver.unobserve(entry.target) to stop watching it.
         This would slightly improve performance but means the element won't
         re-animate if the user scrolls back up. Left out here for simplicity. */
    }

  });

}, {
  /* threshold: 0.1 means the callback fires when at least 10% of the
     element is visible in the viewport. A value of 0 fires immediately when
     any pixel is visible; 1.0 requires the full element to be visible. */
  threshold: 0.1
}); /* End IntersectionObserver constructor */


/* Select all the card elements that should animate in on scroll.
   These are the service cards, individual project cards, team cards,
   and the justice definition cards. */
const animatedElements = document.querySelectorAll(
  '.service-card, .project-item, .team-card, .justice-def-card'
);

/* Loop through each element and set up its initial (hidden) state,
   then register it with the observer so it gets watched. */
animatedElements.forEach(element => {

  /* Start fully transparent — the element is invisible before it animates in */
  element.style.opacity = '0';

  /* Start shifted 20px down — the element will rise up as it fades in */
  element.style.transform = 'translateY(20px)';

  /* CSS transition definition:
       - 'opacity 0.6s ease' — opacity fades in over 0.6 seconds
       - 'transform 0.6s ease' — the upward movement takes 0.6 seconds
     These transitions activate automatically when JavaScript changes
     the opacity or transform values above. */
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

  /* Register this element with the IntersectionObserver.
     The observer will now call our callback whenever this element
     enters or leaves the viewport. */
  scrollObserver.observe(element);

}); /* End animatedElements.forEach */