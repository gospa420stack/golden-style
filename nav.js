document.addEventListener('DOMContentLoaded', () => {
  const navigation = document.querySelector('.nav');
  if (!navigation) {
    return;
  }

  const navigationSpacer = document.createElement('div');
  navigationSpacer.className = 'nav-spacer';
  navigationSpacer.setAttribute('aria-hidden', 'true');
  navigation.insertAdjacentElement('afterend', navigationSpacer);

  const syncScrollNavigation = () => {
    const flowElement = navigationSpacer.classList.contains('is-active')
      ? navigationSpacer
      : navigation;
    const navigationBottom = flowElement.getBoundingClientRect().bottom + window.scrollY;
    const isOutOfView = window.scrollY >= navigationBottom;
    const wasFixed = navigation.classList.contains('is-fixed');

    if (isOutOfView && !wasFixed) {
      navigationSpacer.style.height = `${navigation.getBoundingClientRect().height}px`;
    }
    navigation.classList.toggle('is-fixed', isOutOfView);
    navigationSpacer.classList.toggle('is-active', isOutOfView);
  };

  syncScrollNavigation();
  window.addEventListener('scroll', syncScrollNavigation, { passive: true });
  window.addEventListener('resize', syncScrollNavigation);

  const menuButton = navigation?.querySelector('.mobile-menu-toggle');
  const menu = navigation?.querySelector('.nav-links');

  if (!menuButton || !menu) {
    return;
  }

  const closeMenu = () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Otvori navigacioni meni');
    document.body.classList.remove('navigation-open');
  };

  const openMenu = () => {
    menu.classList.add('open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Zatvori navigacioni meni');
    document.body.classList.add('navigation-open');
  };

  menuButton.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target)) {
      closeMenu();
    }
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 701px)').matches) {
      closeMenu();
    }
  });
});
