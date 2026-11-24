'use strict';

/* ---- Menú móvil ---- */
const menuBtn = document.getElementById('menu-btn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

// Cierra el menú al pulsar un enlace
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  });
});

/* ---- Sombra del header al hacer scroll ---- */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- Enlace activo del menú ---- */
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-list a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

/* ---- Aparecer al hacer scroll ---- */
const revealItems = document.querySelectorAll('.card, .service, .photos img, .col');
revealItems.forEach(item => item.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(item => revealObserver.observe(item));

/* ---- Validación del formulario ---- */
const form = document.getElementById('form');
const formOk = document.getElementById('form-ok');

const rules = {
  nombre:   { test: v => v.trim().length >= 2, msg: 'Escribe tu nombre.' },
  email:    { test: v => /^[^\s@]+@([^\s@.]+\.)+[^\s@.]+$/.test(v), msg: 'Escribe un email válido.' },
  asunto:   { test: v => v.trim().length >= 3, msg: 'Escribe un asunto.' },
  mensaje:  { test: v => v.trim().length >= 10, msg: 'El mensaje debe tener al menos 10 caracteres.' }
};

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  Object.keys(rules).forEach(name => {
    const field = form.elements[name];
    const error = document.getElementById('error-' + name);
    if (rules[name].test(field.value)) {
      error.textContent = '';
    } else {
      error.textContent = rules[name].msg;
      valid = false;
    }
  });

  const terms = document.getElementById('terminos');
  const termsError = document.getElementById('error-terminos');
  if (terms.checked) {
    termsError.textContent = '';
  } else {
    termsError.textContent = 'Debes aceptar los términos.';
    valid = false;
  }

  // Si hay errores, no enviamos nada
  if (!valid) {
    formOk.textContent = '';
    return;
  }

  // Enviamos los datos a Formspree
  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
    .then(response => {
      if (response.ok) {
        formOk.textContent = '¡Mensaje enviado! Te responderemos pronto.';
        form.reset();
      } else {
        formOk.textContent = 'No se pudo enviar. Inténtalo de nuevo.';
      }
    })
    .catch(() => {
      formOk.textContent = 'Error de conexión. Inténtalo de nuevo.';
    });
});
