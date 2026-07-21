(() => {
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('[data-site-navigation]');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      navigation.classList.toggle('is-open', !open);
      body.classList.toggle('menu-open', !open);
    });
  }

  document.querySelectorAll('.menu-item-has-children > button, [data-submenu-toggle]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const item = button.closest('.menu-item-has-children');
      const open = item.classList.toggle('submenu-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  document.querySelectorAll('[data-faq-button]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      item.querySelector('.faq-answer').hidden = !open;
    });
  });

  document.querySelectorAll('[data-gallery-more]').forEach((button) => {
    button.addEventListener('click', () => {
      button.closest('.client-work').querySelectorAll('[data-gallery-hidden]').forEach((item) => {
        item.hidden = false;
      });
      button.remove();
    });
  });

  const lightbox = document.querySelector('[data-lightbox]');
  if (lightbox) {
    const image = lightbox.querySelector('img');
    const caption = lightbox.querySelector('p');
    const close = () => {
      lightbox.hidden = true;
      body.classList.remove('lightbox-open');
      image.removeAttribute('src');
    };
    document.querySelectorAll('[data-gallery-open]').forEach((button) => {
      button.addEventListener('click', () => {
        image.src = button.dataset.galleryOpen;
        image.alt = button.dataset.galleryAlt || '';
        caption.textContent = button.dataset.galleryAlt || '';
        lightbox.hidden = false;
        body.classList.add('lightbox-open');
        lightbox.querySelector('button').focus();
      });
    });
    lightbox.querySelector('[data-lightbox-close]').addEventListener('click', close);
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !lightbox.hidden) close(); });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
})();
