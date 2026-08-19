/* LaundryPro shared interactions */
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.page-loader');
  setTimeout(() => loader?.remove(), 350);

  const getCurrentPage = () => {
    const page = (location.pathname || '').split('/').pop();
    return page && page.length ? page : 'index.html';
  };

  const closeDropdown = (dropdownEl) => {
    if (!dropdownEl) return;
    dropdownEl.classList.remove('show');
    const menu = dropdownEl.querySelector('.dropdown-menu');
    const toggle = dropdownEl.querySelector('[data-home-toggle]');
    menu?.classList.remove('show');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };

  const convertHomeToDropdown = (nav) => {
    const navList = nav.querySelector('.navbar-nav');
    if (!navList) return;

    // Prevent double-run
    if (navList.querySelector('[data-home-dropdown]')) return;

    const homeLink = navList.querySelector('a.nav-link[href="index.html"]');
    const homeItem = homeLink?.closest('li.nav-item');
    if (!homeItem) return;

    const dropdown = document.createElement('li');
    dropdown.className = 'nav-item dropdown';
    dropdown.setAttribute('data-home-dropdown', '');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-link dropdown-toggle';
    toggle.textContent = 'Home';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('data-home-toggle', '');

    const menu = document.createElement('ul');
    menu.className = 'dropdown-menu';
    menu.innerHTML = `
      <li><a class="dropdown-item" href="index.html">Home</a></li>
      <li><a class="dropdown-item" href="home-2.html">Home 2</a></li>
    `;

    dropdown.append(toggle, menu);
    homeItem.replaceWith(dropdown);

    // Toggle logic (Bootstrap-like: uses `show` class, no Bootstrap JS required)
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = dropdown.classList.toggle('show');
      menu.classList.toggle('show', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', () => closeDropdown(dropdown));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown(dropdown);
    });

    // Keep mobile menu and dropdown in sync
    const menuContainer = nav.querySelector('[data-menu]');
    if (menuContainer) {
      const observer = new MutationObserver(() => {
        // If mobile menu closes, close dropdown too
        if (!menuContainer.classList.contains('show')) closeDropdown(dropdown);
      });
      observer.observe(menuContainer, { attributes: true, attributeFilter: ['class'] });
    }
  };

  const setActiveNavLink = (nav) => {
    const page = getCurrentPage();

    // Clear existing state
    nav.querySelectorAll('.nav-link, .dropdown-item').forEach((link) => {
      link.classList.remove('active');
    });

    // Mark active by href match
    const activeLink = nav.querySelector(
      `.nav-link[href="${page}"], .dropdown-item[href="${page}"]`
    );
    activeLink?.classList.add('active');

    // If active is in dropdown, also highlight its toggle
    const dropdown = activeLink?.closest('[data-home-dropdown]');
    const toggle = dropdown?.querySelector('.dropdown-toggle');
    toggle?.classList.add('active');
  };

  const nav = document.querySelector('.navbar');
  if (nav) {
    const menuButton = nav.querySelector('[data-menu-toggle]');
    const menu = nav.querySelector('[data-menu]');

    // Keep the RTL control available on every page that uses the shared navbar.
    // Some page headers predate the control, so add it when its markup is absent.
    if (!nav.querySelector('[data-direction]')) {
      const bookingButton = nav.querySelector('.nav-booking');
      if (bookingButton) {
        const directionButton = document.createElement('button');
        directionButton.className = 'btn btn-sm btn-light text-brand fw-bold';
        directionButton.type = 'button';
        directionButton.setAttribute('data-direction', '');
        directionButton.setAttribute('aria-label', 'Switch to RTL layout');
        directionButton.title = 'Switch to RTL layout';
        directionButton.textContent = 'RTL';
        bookingButton.insertAdjacentElement('afterend', directionButton);
      }
    }

    // Mobile menu toggle (custom collapse)
    menuButton?.addEventListener('click', () => {
      const open = menu?.classList.toggle('show');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Requested: Home dropdown -> Home + Home 2
    convertHomeToDropdown(nav);

    // Active link highlighting
    setActiveNavLink(nav);

    // Keep the original navbar layout on every page.
    nav.querySelector('.nav-user-menu')?.remove();
    nav.querySelectorAll('.nav-login-btn, .nav-signup-btn').forEach((btn) => {
      btn.classList.remove('d-none');
    });
  }

  // Sticky navbar & back-to-top
  const backToTop = document.querySelector('#backToTop');
  addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', scrollY > 20);
    if (backToTop) backToTop.style.display = scrollY > 450 ? 'block' : 'none';
  });
  backToTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Theme toggle
  const theme = document.querySelector('[data-theme]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const bookingButton = nav?.querySelector('.nav-booking');
  if (theme && bookingButton) bookingButton.insertAdjacentElement('beforebegin', theme);
  const syncTheme = () => {
    const dark = document.body.classList.contains('dark');
    if (themeIcon) themeIcon.textContent = dark ? '☀' : '☾';
    theme?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    theme?.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  const savedTheme = localStorage.getItem('laundryProTheme');
  document.body.classList.toggle('dark', savedTheme === 'dark');
  syncTheme();
  theme?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem(
      'laundryProTheme',
      document.body.classList.contains('dark') ? 'dark' : 'light'
    );
    syncTheme();
  });

  // Direction toggle: use Bootstrap's matching RTL build, starting in LTR.
  const direction = document.querySelector('[data-direction]');
  const bootstrapCss = document.querySelector("link[href*='bootstrap'][rel='stylesheet']");
  const applyDirection = (isRtl) => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (bootstrapCss) {
      bootstrapCss.href = bootstrapCss.href.replace(
        /bootstrap(\.rtl)?\.min\.css/,
        isRtl ? 'bootstrap.rtl.min.css' : 'bootstrap.min.css'
      );
    }
    direction?.setAttribute('aria-label', isRtl ? 'Switch to LTR layout' : 'Switch to RTL layout');
    direction?.setAttribute('title', isRtl ? 'Switch to LTR layout' : 'Switch to RTL layout');
    const directionLabel = direction?.querySelector('[data-direction-label]');
    if (directionLabel) directionLabel.textContent = isRtl ? 'LTR' : 'RTL';
    else if (direction) direction.textContent = isRtl ? 'LTR' : 'RTL';
  };
  // Read previously saved direction from localStorage so the choice
  // persists across page navigations.
  const savedDirection = localStorage.getItem('laundryProDirection');
  const initialIsRtl = savedDirection === 'rtl';
  applyDirection(initialIsRtl);

  direction?.addEventListener('click', () => {
    const isRtl = document.documentElement.dir !== 'rtl';
    applyDirection(isRtl);
    // Persist the user's choice so it applies on subsequent pages.
    try {
      localStorage.setItem('laundryProDirection', isRtl ? 'rtl' : 'ltr');
    } catch (e) {
      // ignore storage errors (e.g., privacy modes)
    }
  });

  // Animated counters
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const n = Number(el.dataset.counter || 0);
    if (!n) return;
    // Ensure numeric counters remain left-to-right inside RTL pages
    // by marking them with a bidi-isolation class.
    el.classList.add('bidi-ltr', 'inline-block');
    let x = 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const useCommas = el.hasAttribute('data-commas');
    const tick = () => {
      x += Math.ceil(n / 60);
      const currentVal = Math.min(x, n);
      const formattedVal = useCommas ? currentVal.toLocaleString() : String(currentVal);
      el.textContent = formattedVal + suffix;
      if (x < n) requestAnimationFrame(tick);
    };
    new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          tick();
          // Prevent re-run
          delete el.dataset.counter;
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    ).observe(el);
  });

  // Bootstrap-like validation for demo forms
  document.querySelectorAll('.needs-validation').forEach((form) => {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  document.querySelectorAll('footer .needs-validation').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) return;
      event.preventDefault();
      location.href = 'contact-confirmation.html';
    });
  });

  const customerLogin = document.querySelector('#customerLogin');
  customerLogin?.addEventListener('submit', () => {
    const email = document.querySelector('#customerEmail')?.value.trim();
    if (!email) return;
    const name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    localStorage.setItem('laundryProCustomerName', name || 'Customer');
  });

  const customerRegister = document.querySelector('#customerRegister');
  customerRegister?.addEventListener('submit', () => {
    const name = document.querySelector('#registerName')?.value.trim();
    if (!name) return;
    localStorage.setItem('laundryProCustomerName', name);
  });

  // Social Auth Handler mock
  window.handleSocialAuth = function (provider) {
    alert(`Connecting to ${provider} OAuth...`);
    localStorage.setItem('laundryProCustomerName', `${provider} User`);
    location.href = 'index.html';
  };

  // Add a consistent copyright notice to every shared site footer.
  document.querySelectorAll('footer.footer').forEach((footer) => {
    if (footer.querySelector('.footer-copyright')) return;

    const copyright = document.createElement('div');
    copyright.className = 'footer-copyright';
    copyright.innerHTML = `<div class="container"><small>&copy; ${new Date().getFullYear()} LaundryPro. All rights reserved.</small></div>`;
    footer.append(copyright);
  });

  // Simple service filtering (Services page)
  if (getCurrentPage() === 'services.html') {
    document.querySelector('[data-filter="home"]')?.remove();
  }

  document.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((x) => x.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.filter-item').forEach((item) => {
        const category = item.dataset.category || '';
        item.style.display =
          btn.dataset.filter === 'all' || category.includes(btn.dataset.filter || '')
            ? 'block'
            : 'none';
      });
    });
  });

  // Optional plugins
  if (window.AOS) AOS.init({ duration: 700, once: true });
  if (window.GLightbox) GLightbox({ selector: '.glightbox' });
  if (window.Swiper) {
    document.querySelectorAll('.swiper').forEach((swiperEl) => {
      new Swiper(swiperEl, {
        loop: true,
        autoplay: { delay: 4500 },
        pagination: { el: swiperEl.querySelector('.swiper-pagination'), clickable: true },
      });
    });
  }
});
