/* ============================================
   BREAK OUT CAFE — Main JavaScript
   ============================================ */

'use strict';

// ─── DOM Ready ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initCursor();
  initNav();
  initScrollProgress();
  initParticles();
  initReveal();
  initCounters();
  initMenu();
  initFAB();
  initTheme();
  initLightbox();
  initMobileNav();
  initLanguage();
});

// ─── SPLASH SCREEN ───────────────────────────
function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 800);
  }, 3400);
}

// ─── CUSTOM CURSOR ───────────────────────────
function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, [data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

// ─── NAVBAR ──────────────────────────────────
function initNav() {
  const nav = document.querySelector('nav');
  const sections = document.querySelectorAll('[data-section]');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);

    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.dataset.section;
      }
    });

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

// ─── SCROLL PROGRESS BAR ─────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ─── HERO PARTICLES ──────────────────────────
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor(W / 12);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 3 + 0.5,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 163, 115, ${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212, 163, 115, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  // Mouse parallax
  let mouseX = W / 2, mouseY = H / 2;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const hero = document.querySelector('.hero-content');
    if (hero) {
      const rx = (mouseY / H - 0.5) * 8;
      const ry = (mouseX / W - 0.5) * -8;
      hero.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  });

  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });
}

// ─── SCROLL REVEAL ────────────────────────────
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ─── ANIMATED COUNTERS ────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const target = parseInt(e.target.dataset.count);
      const suffix = e.target.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        e.target.textContent = current.toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}

// ─── DYNAMIC MENU & CART ENGINE ─────────────────

let allCategories = [];
let cart = JSON.parse(localStorage.getItem('breakout_cart')) || [];
let activeCategoryTab = '';
let activeTag = 'all';
let searchQuery = '';
let viewMode = 'grid'; // grid or spacca
let selectedSizeIndex = 0;
let currentModalItem = null;
let currentModalCategory = null;
let currentPage = 1;
const PRODUCTS_PER_PAGE = 6;

function initMenu() {
  const searchInput = document.getElementById('menuSearchInput');
  const searchClear = document.getElementById('menuSearchClear');
  const tagPills = document.querySelectorAll('.spacca-tag-pill');
  const viewBtns = document.querySelectorAll('.spacca-view-btn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  // Tag filter pills
  tagPills.forEach(pill => {
    pill.addEventListener('click', () => {
      tagPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTag = pill.dataset.tag;
      currentPage = 1;
      renderProducts();
    });
  });

  // Search input & clear button
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (searchClear) searchClear.style.display = searchQuery ? 'block' : 'none';
      currentPage = 1;
      renderProducts();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      searchClear.style.display = 'none';
      currentPage = 1;
      renderProducts();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      if (searchClear) searchClear.style.display = 'none';
      activeTag = 'all';
      tagPills.forEach(p => p.classList.toggle('active', p.dataset.tag === 'all'));
      currentPage = 1;
      renderProducts();
    });
  }

  // View Switcher (Grid vs Spacca Dotted List)
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      viewMode = btn.dataset.view;
      const container = document.getElementById('spaccaMenuContainer');
      if (container) {
        container.className = `spacca-menu-container view-${viewMode}`;
      }
    });
  });

  // Load menu JSON data
  fetchMenuData();
}

async function fetchMenuData() {
  try {
    const response = await fetch('assets/data/menu.json');
    if (!response.ok) throw new Error('Failed to load menu data payload');
    const data = await response.json();
    allCategories = data.categories || [];
    
    // Set first category active by default
    if (allCategories.length > 0) {
      activeCategoryTab = allCategories[0].id;
    }
    
    renderCategoryTabs();
    renderProducts();
    syncCartUI();
    initDeliveryFields();
  } catch (err) {
    console.error('❌ Failed to fetch menu database:', err);
  }
}

function getCategoryIconHtml(catId) {
  const icons = {
    espresso_and_coffee: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M2 21h18v-2H2v2zM20 8h-2V5h2v3zm0-5c-2.206 0-4 1.794-4 4v4H4c-1.103 0-2 .897-2 2v4c0 1.103.897 2 2 2h14c3.309 0 6-2.691 6-6V7c0-2.206-1.794-4-4-4z"/></svg>`,
    hot_drinks: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M2 21h16v-2H2v2zm17-13v7c0 1.654-1.346 3-3 3h-1v-2h1c.551 0 1-.449 1-1V8h-1V6h1c1.654 0 3 1.346 3 3zm-5-5H2v13c0 1.654 1.346 3 3 3h6c1.654 0 3-1.346 3-3V3zm-10 3h8v3H4V6z"/></svg>`,
    iced_latte: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M17.6 6l-2.6-4.5-1.7 1 2 3.5H5v2h1.1l1.4 14c.1 1.1 1 2 2.1 2h8.8c1.1 0 2-.9 2.1-2l1.4-14h1.1V6h-1.6zm-1.8 14H8.2l-1.2-12h10l-1.2 12z"/></svg>`,
    shakes: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M17.6 6l-2.6-4.5-1.7 1 2 3.5H5v2h1.1l1.4 14c.1 1.1 1 2 2.1 2h8.8c1.1 0 2-.9 2.1-2l1.4-14h1.1V6h-1.6zm-1.8 14H8.2l-1.2-12h10l-1.2 12z"/></svg>`,
    frappes: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M17.6 6l-2.6-4.5-1.7 1 2 3.5H5v2h1.1l1.4 14c.1 1.1 1 2 2.1 2h8.8c1.1 0 2-.9 2.1-2l1.4-14h1.1V6h-1.6zm-1.8 14H8.2l-1.2-12h10l-1.2 12z"/></svg>`,
    mix_soda: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M21 2H3c-.55 0-1 .45-1 1v1c0 4.19 3.1 7.66 7.09 8.14V19H7v2h10v-2h-2.09v-6.86C18.9 11.66 22 8.19 22 4V3c0-.55-.45-1-1-1zm-9 8.5c-2.48 0-4.5-2.02-4.5-4.5h9c0 2.48-2.02 4.5-4.5 4.5z"/></svg>`,
    smoothies: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M17.6 6l-2.6-4.5-1.7 1 2 3.5H5v2h1.1l1.4 14c.1 1.1 1 2 2.1 2h8.8c1.1 0 2-.9 2.1-2l1.4-14h1.1V6h-1.6zm-1.8 14H8.2l-1.2-12h10l-1.2 12z"/></svg>`,
    sandwiches: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M21.562 10.024L12.78 1.243a1.1 1.1 0 0 0-1.56 0L2.438 10.024A2 2 0 0 0 2 11.438v1.124a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1.124a2 2 0 0 0-.438-1.414zm-1.562 2.538H4v-.562l8-8 8 8v.562zm1 3H3a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1z"/></svg>`,
    bakery: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M19 14.5c0-1.65-1.35-3-3-3h-1.5v-1.5c0-1.65-1.35-3-3-3S8.5 8.35 8.5 10v1.5H7c-1.65 0-3 1.35-3 3s1.35 3 3 3h12c1.65 0 3-1.35 3-3zm-11-3c0-.83.67-1.5 1.5-1.5S11 10.67 11 11.5v1.5H8v-1.5zm6.5 1.5v-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v1.5h-3z"/></svg>`,
    desserts: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M12.7 1.25a1 1 0 0 0-1.4 0L1.76 10.7a1 1 0 0 0-.26.7v9.6a2 2 0 0 0 2 2h16.8a2 2 0 0 0 2-2v-9.6a1 1 0 0 0-.26-.7L12.7 1.25zM20 21H4v-8.4l8-8 8 8V21zM5 14h14v2H5v-2z"/></svg>`,
    fresh_drinks: `<svg class="category-icon" viewBox="0 0 24 24"><path d="M17.6 6l-2.6-4.5-1.7 1 2 3.5H5v2h1.1l1.4 14c.1 1.1 1 2 2.1 2h8.8c1.1 0 2-.9 2.1-2l1.4-14h1.1V6h-1.6zm-1.8 14H8.2l-1.2-12h10l-1.2 12z"/></svg>`
  };
  return icons[catId] || icons.espresso_and_coffee;
}

function renderCategoryTabs() {
  const container = document.getElementById('menuTabsContainer');
  if (!container || allCategories.length === 0) return;

  const bundle = loadedTranslations[currentLang] || loadedTranslations['en'] || { ui: {} };
  const ui = bundle.ui || {};

  container.innerHTML = allCategories.map(cat => {
    const isActive = cat.id === activeCategoryTab ? 'active' : '';
    const name = currentLang === 'ar' ? cat.name_ar : cat.name;
    const iconHtml = getCategoryIconHtml(cat.id);

    return `
      <button class="menu-tab ${isActive}" data-tab="${cat.id}">
        <span style="display: flex; align-items: center; gap: 8px;">${iconHtml}<span>${name}</span></span>
        <span class="tab-badge">${cat.items.length}</span>
      </button>
    `;
  }).join('');

  // Tab click bindings
  container.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategoryTab = tab.dataset.tab;
      currentPage = 1;
      renderProducts();
    });
  });
}

function generatePlaceholderSvg(name, nameAr, categoryId) {
  let iconPath = '';
  if (categoryId === 'espresso_and_coffee' || categoryId === 'hot_drinks') {
    iconPath = `<path d="M130 170h240v140c0 44-36 80-80 80h-80c-44 0-80-36-80-80V170z" fill="none" stroke="#e2b07e" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M370 210h30c15 0 25 10 25 25v20c0 15-10 25-25 25h-30" fill="none" stroke="#e2b07e" stroke-width="12" stroke-linecap="round"/>
                <path d="M90 410h320" stroke="#e2b07e" stroke-width="12" stroke-linecap="round"/>
                <path d="M190 100c0 0 10-20 0-40M250 100c0 0 10-20 0-40M310 100c0 0 10-20 0-40" stroke="#e2b07e" stroke-width="10" stroke-linecap="round"/>`;
  } else if (categoryId === 'iced_latte' || categoryId === 'shakes' || categoryId === 'frappes' || categoryId === 'smoothies' || categoryId === 'fresh_drinks') {
    iconPath = `<path d="M170 170h160l-25 210c-3 20-18 30-35 30h-76c-17 0-32-10-35-30L170 170z" fill="none" stroke="#e2b07e" stroke-width="12" stroke-linejoin="round"/>
                <path d="M150 170h200" stroke="#e2b07e" stroke-width="14" stroke-linecap="round"/>
                <path d="M250 170L280 60h20" fill="none" stroke="#e2b07e" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (categoryId === 'mix_soda') {
    iconPath = `<path d="M120 120h260L250 250v110h40v16H210v-16h40V250L120 120z" fill="none" stroke="#e2b07e" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="250" cy="160" r="12" fill="#e2b07e"/>
                <path d="M180 80l40 40" stroke="#e2b07e" stroke-width="8" stroke-linecap="round"/>`;
  } else if (categoryId === 'sandwiches') {
    iconPath = `<path d="M110 200h280v50c0 10-8 18-18 18H128c-10 0-18-8-18-18v-50z" fill="none" stroke="#e2b07e" stroke-width="12" stroke-linejoin="round"/>
                <path d="M110 200l140-70 140 70" fill="none" stroke="#e2b07e" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M140 200h220M170 234h160" stroke="#e2b07e" stroke-width="8" stroke-linecap="round"/>`;
  } else {
    iconPath = `<path d="M110 260l140-110 140 110v80c0 10-8 18-18 18H128c-10 0-18-8-18-18v-80z" fill="none" stroke="#e2b07e" stroke-width="12" stroke-linejoin="round"/>
                <path d="M110 260h280" stroke="#e2b07e" stroke-width="12" stroke-linecap="round"/>
                <circle cx="250" cy="110" r="16" fill="#e2b07e"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
    <rect width="500" height="500" fill="#16161a"/>
    <rect x="25" y="25" width="450" height="450" fill="none" stroke="#e2b07e" stroke-width="2" stroke-opacity="0.25" rx="16"/>
    <circle cx="250" cy="220" r="110" fill="#e2b07e" fill-opacity="0.03"/>
    <g>${iconPath}</g>
    <text x="250" y="85" font-family="'Poppins', sans-serif" font-size="13" font-weight="700" fill="#e2b07e" fill-opacity="0.5" text-anchor="middle" letter-spacing="5">BREAK OUT</text>
    <text x="250" y="375" font-family="'Poppins', sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle">${name}</text>
    <text x="250" y="415" font-family="'Cairo', sans-serif" font-size="18" font-weight="600" fill="#e2b07e" text-anchor="middle">${nameAr}</text>
    <line x1="200" y1="440" x2="300" y2="440" stroke="#e2b07e" stroke-width="1.5" stroke-opacity="0.3"/>
    <text x="250" y="465" font-family="'Poppins', sans-serif" font-size="9" font-weight="600" fill="#ffffff" fill-opacity="0.2" text-anchor="middle" letter-spacing="2">NO IMAGE AVAILABLE</text>
  </svg>`.replace(/\s+/g, ' ').trim();

  const base64 = window.btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

function renderProducts() {
  const container = document.getElementById('spaccaMenuContainer');
  const noResults = document.getElementById('spaccaNoResults');
  if (!container) return;

  const bundle = loadedTranslations[currentLang] || loadedTranslations['en'] || { ui: {} };
  const ui = bundle.ui || {};

  // Gather matching filtered items
  let filteredItems = [];
  allCategories.forEach(cat => {
    const isCurrentTab = cat.id === activeCategoryTab;
    const matchesCategory = searchQuery ? true : isCurrentTab;
    
    if (matchesCategory) {
      cat.items.forEach(item => {
        const matchesTag = activeTag === 'all' || (item.tags && item.tags.includes(activeTag));
        const matchesSearch = !searchQuery || 
          item.name.toLowerCase().includes(searchQuery) ||
          (item.name_ar && item.name_ar.toLowerCase().includes(searchQuery)) ||
          (item.description && item.description.toLowerCase().includes(searchQuery));
          
        if (matchesTag && matchesSearch) {
          let emoji = '☕';
          if (cat.id.includes('pizza') || cat.id.includes('bakery')) emoji = '🍕';
          else if (cat.id.includes('dessert')) emoji = '🍰';
          else if (cat.id.includes('cold') || cat.id.includes('smoothie')) emoji = '🥤';
          
          filteredItems.push({
            ...item,
            categoryId: cat.id,
            categoryEmoji: emoji
          });
        }
      });
    }
  });

  const totalItems = filteredItems.length;

  // Slicing for page
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginated = filteredItems.slice(start, start + PRODUCTS_PER_PAGE);

  if (totalItems === 0) {
    container.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    renderPaginationControls(0);
    return;
  }

  if (noResults) noResults.style.display = 'none';

  const itemsHtml = paginated.map(item => {
    const name = currentLang === 'ar' ? item.name_ar : item.name;
    const desc = item.description || '';
    
    let priceStr = '';
    if (item.prices.length === 1) {
      priceStr = `${item.prices[0]} ${currentLang === 'ar' ? 'ج.م' : 'EGP'}`;
    } else {
      priceStr = `${item.prices[0]} - ${item.prices[item.prices.length - 1]} ${currentLang === 'ar' ? 'ج.م' : 'EGP'}`;
    }

    const badge = item.popular ? (currentLang === 'ar' ? 'مفضل' : 'Popular') : (item.isNew ? (currentLang === 'ar' ? 'جديد' : 'New') : '');
    const badgeClass = item.popular ? 'badge-popular' : 'badge-new';

    const safeName = item.name.replace(/'/g, "\\'");
    const safeNameAr = (item.name_ar || item.name).replace(/'/g, "\\'");
    const imgUrl = item.image || generatePlaceholderSvg(item.name, item.name_ar || item.name, item.categoryId);

    return `
      <div class="menu-item reveal" data-name="${item.name}" onclick="openProductDetail('${item.categoryId}', '${item.id}')" style="cursor: pointer;">
        <div class="menu-item-image-wrapper">
          <img src="${imgUrl}" alt="${name}" class="menu-item-img" onerror="this.onerror=null; this.src=generatePlaceholderSvg('${safeName}', '${safeNameAr}', '${item.categoryId}');">
        </div>
        <div class="menu-item-content">
          <div class="menu-item-header">
            <h3 class="menu-item-name">${name}</h3>
            <span class="spacca-leader-dots"></span>
            <div class="menu-item-price">${priceStr}</div>
          </div>
          <div class="menu-stars">★★★★★</div>
          <p class="menu-item-desc">${desc}</p>
          <div class="menu-item-footer">
            <div class="menu-item-badges">
              ${badge ? `<span class="badge ${badgeClass}">${badge}</span>` : ''}
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="menu-add-btn" onclick="event.stopPropagation(); quickAddToCart('${item.categoryId}', '${item.id}')" style="background:var(--accent-gradient); border:none; color:var(--bg-primary); padding:6px 12px; border-radius:50px; font-weight:bold; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:4px;">
                <i class="iconly-boldPlus" style="font-size:10px;"></i>
                <span>${currentLang === 'ar' ? 'أضف' : 'Add'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="menu-grid" style="display:grid; width: 100%;">
      ${itemsHtml}
    </div>
  `;

  renderPaginationControls(totalItems);

  // Bind quick view events to Spacca detail modal
  initReveal();
}

function renderPaginationControls(totalItems) {
  const container = document.getElementById('paginationContainer');
  if (!container) return;

  const pageCount = Math.ceil(totalItems / PRODUCTS_PER_PAGE);
  if (pageCount <= 1) {
    container.innerHTML = '';
    return;
  }

  const pageButton = (label, targetPage, opts = {}) => {
    const isActive = opts.active ? 'active' : '';
    const isDisabled = opts.disabled ? 'disabled' : '';
    return `
      <button ${isDisabled ? 'disabled' : `onclick="changeMenuPage(${targetPage})"`} class="spacca-tag-pill ${isActive}" style="min-width:36px; height:36px; padding:0; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius:50%; font-weight:bold; cursor:${isDisabled ? 'not-allowed' : 'pointer'}; opacity:${isDisabled ? 0.3 : 1}; margin:0 4px; transition:var(--transition); background:${isActive ? 'var(--accent-gradient)' : 'var(--bg-card)'}; color:${isActive ? 'var(--bg-primary)' : 'var(--text-primary)'};">
        ${label}
      </button>
    `;
  };

  const dots = `<span style="padding:0 8px; color:var(--text-muted); font-weight:bold; user-select:none;">…</span>`;
  const keyPages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
  const sortedPages = [...keyPages].filter(p => p >= 1 && p <= pageCount).sort((a, b) => a - b);

  let html = pageButton('<i class="iconly-boldArrow---Left-2" style="font-size:10px;"></i>', currentPage - 1, { disabled: currentPage === 1 });
  let previousPage = 0;

  sortedPages.forEach(p => {
    if (previousPage && p - previousPage > 1) {
      html += dots;
    }
    html += pageButton(p, p, { active: p === currentPage });
    previousPage = p;
  });

  html += pageButton('<i class="iconly-boldArrow---Right-2" style="font-size:10px;"></i>', currentPage + 1, { disabled: currentPage === pageCount });

  container.innerHTML = html;
}

window.changeMenuPage = function(page) {
  if (page < 1) return;
  currentPage = page;
  renderProducts();
  const section = document.getElementById('menu');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

window.quickAddToCart = function(categoryId, itemId) {
  addToCart(categoryId, itemId, 0);
};

window.openProductDetail = function(categoryId, itemId) {
  const modal = document.getElementById('menuItemModal');
  if (!modal) return;

  const category = allCategories.find(c => c.id === categoryId);
  const item = category ? category.items.find(i => i.id === itemId) : null;
  if (!item) return;

  currentModalItem = item;
  currentModalCategory = category;
  selectedSizeIndex = 0;

  const name = currentLang === 'ar' ? item.name_ar : item.name;
  const desc = item.description || '';
  
  let emoji = '☕';
  if (categoryId.includes('pizza') || categoryId.includes('bakery')) emoji = '🍕';
  else if (categoryId.includes('dessert')) emoji = '🍰';
  else if (categoryId.includes('cold') || categoryId.includes('smoothie')) emoji = '🥤';

  const badge = item.popular ? (currentLang === 'ar' ? 'مفضل' : 'Popular') : (item.isNew ? (currentLang === 'ar' ? 'جديد' : 'New') : '');

  const modalEmoji = document.getElementById('modalEmoji');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalIngredients = document.getElementById('modalIngredients');
  const modalCalories = document.getElementById('modalCalories');
  const modalCategory = document.getElementById('modalCategory');

  if (modalEmoji) modalEmoji.textContent = emoji;
  const modalImg = document.getElementById('modalProductImg');
  if (modalImg) {
    modalImg.src = item.image || generatePlaceholderSvg(item.name, item.name_ar || item.name, categoryId);
    modalImg.alt = name;
    modalImg.onerror = function() {
      this.onerror = null;
      this.src = generatePlaceholderSvg(item.name, item.name_ar || item.name, categoryId);
    };
  }
  if (modalBadge) {
    modalBadge.textContent = badge;
    modalBadge.style.display = badge ? 'inline-block' : 'none';
  }
  if (modalTitle) modalTitle.textContent = name;
  if (modalDesc) modalDesc.textContent = desc;
  
  if (modalIngredients) modalIngredients.textContent = currentLang === 'ar' ? 'مكونات ممتازة ومحضرة طازجة' : 'Premium freshly prepared ingredients';
  if (modalCalories) modalCalories.textContent = '~180 kcal';
  if (modalCategory) modalCategory.textContent = currentLang === 'ar' ? category.name_ar : category.name;

  updateModalPriceAndSizes();

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const addBtn = document.getElementById('modalAddToCartBtn');
  if (addBtn) {
    addBtn.onclick = () => {
      addToCart(categoryId, itemId, selectedSizeIndex);
      closeModal();
    };
  }
};

function updateModalPriceAndSizes() {
  const item = currentModalItem;
  if (!item) return;

  const modalPrice = document.getElementById('modalPrice');
  const modalSizesContainer = document.getElementById('modalSizesContainer');
  const modalSizeOptions = document.getElementById('modalSizeOptions');

  const currentPrice = item.prices[selectedSizeIndex];
  if (modalPrice) {
    modalPrice.textContent = `${currentPrice} ${currentLang === 'ar' ? 'ج.م' : 'EGP'}`;
  }

  if (item.prices.length > 1) {
    if (modalSizesContainer) modalSizesContainer.style.display = 'block';
    if (modalSizeOptions) {
      modalSizeOptions.innerHTML = item.prices.map((price, idx) => {
        const isActive = idx === selectedSizeIndex ? 'active' : '';
        let sizeLabel = '';
        if (item.prices.length === 2) {
          sizeLabel = idx === 0 ? (currentLang === 'ar' ? 'وسط' : 'Regular') : (currentLang === 'ar' ? 'كبير' : 'Large');
        } else {
          sizeLabel = idx === 0 ? 'S' : (idx === 1 ? 'M' : 'L');
        }
        return `
          <button class="size-btn ${isActive}" onclick="selectModalSize(${idx})">${sizeLabel}</button>
        `;
      }).join('');
    }
  } else {
    if (modalSizesContainer) modalSizesContainer.style.display = 'none';
  }
}

window.selectModalSize = function(sizeIndex) {
  selectedSizeIndex = sizeIndex;
  updateModalPriceAndSizes();
};

window.closeModal = function() {
  const modal = document.getElementById('menuItemModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

// ─── SHOPPING CART SYSTEM ────────────────────────

window.openCart = function() {
  const modal = document.getElementById('cartModal');
  const drawer = modal?.querySelector('.cart-drawer');
  if (!modal || !drawer) return;
  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    modal.classList.remove('hidden');
    modal.classList.add('is-visible');
    drawer.style.transform = 'translateX(0)';
  });
};

window.closeCart = function() {
  const modal = document.getElementById('cartModal');
  const drawer = modal?.querySelector('.cart-drawer');
  if (!modal || !drawer) return;
  modal.classList.remove('is-visible');
  drawer.style.transform = currentLang === 'ar' ? 'translateX(-100%)' : 'translateX(100%)';
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.add('hidden');
  }, 400);
};

window.addToCart = function(categoryId, itemId, sizeIndex) {
  const category = allCategories.find(c => c.id === categoryId);
  const item = category ? category.items.find(i => i.id === itemId) : null;
  if (!item) return;

  const sizeName = item.prices.length > 1 
    ? (sizeIndex === 0 ? (currentLang === 'ar' ? 'وسط' : 'Regular') : (currentLang === 'ar' ? 'كبير' : 'Large'))
    : '';
  const price = item.prices[sizeIndex];

  const cartId = `${item.id}_${sizeIndex}`;
  const existing = cart.find(x => x.cartId === cartId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      cartId: cartId,
      id: item.id,
      categoryId: categoryId,
      name: item.name,
      name_ar: item.name_ar,
      sizeName: sizeName,
      price: price,
      quantity: 1,
      image: item.image
    });
  }

  localStorage.setItem('breakout_cart', JSON.stringify(cart));
  syncCartUI();
  showToast(currentLang === 'ar' ? 'تمت الإضافة إلى السلة بنجاح ✨' : 'Item added to cart successfully ✨');
};

window.updateCartQuantity = function(idx, delta) {
  if (cart[idx]) {
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) {
      cart.splice(idx, 1);
    }
    localStorage.setItem('breakout_cart', JSON.stringify(cart));
    syncCartUI();
  }
};

window.removeFromCart = function(idx) {
  cart.splice(idx, 1);
  localStorage.setItem('breakout_cart', JSON.stringify(cart));
  syncCartUI();
};

function syncCartUI() {
  const countNav = document.getElementById('cartCount');
  const countMobile = document.getElementById('cartCountMobile');
  const itemsContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const checkoutContainer = document.getElementById('cartCheckout');
  const totalEl = document.getElementById('cartTotal');

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (countNav) countNav.textContent = totalQty;
  if (countMobile) countMobile.textContent = totalQty;

  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = 'flex';
    if (checkoutContainer) checkoutContainer.style.display = 'none';
    if (itemsContainer) itemsContainer.innerHTML = '';
  } else {
    if (emptyCart) emptyCart.style.display = 'none';
    if (checkoutContainer) checkoutContainer.style.display = 'block';

    if (itemsContainer) {
      itemsContainer.innerHTML = cart.map((item, idx) => {
        const name = currentLang === 'ar' ? item.name_ar : item.name;
        const sizeTag = item.sizeName ? `<span style="font-size:11px; color:var(--text-muted); display:block; margin-top:2px;">${item.sizeName}</span>` : '';
        const priceLabel = `${item.price * item.quantity} ${currentLang === 'ar' ? 'ج.م' : 'EGP'}`;

        return `
          <div class="cart-item" style="display:flex; align-items:center; gap:16px; background:var(--bg-primary); padding:16px; border-radius:16px; border:1px solid var(--border);">
            <div class="cart-item-info" style="flex:1;">
              <h4 style="font-size:14px; font-weight:bold; color:var(--text-primary); margin:0;">${name}</h4>
              ${sizeTag}
              <div style="font-size:13px; font-weight:bold; color:var(--gold); margin-top:4px;">${priceLabel}</div>
              <div class="cart-qty-controls" style="display:flex; align-items:center; gap:10px; margin-top:8px;">
                <button onclick="updateCartQuantity(${idx}, -1)" style="width:24px; height:24px; border-radius:50%; border:1px solid var(--border); background:var(--bg-card); color:var(--text-primary); font-weight:bold; cursor:pointer;">-</button>
                <span style="font-size:13px; font-weight:bold; width:16px; text-align:center;">${item.quantity}</span>
                <button onclick="updateCartQuantity(${idx}, 1)" style="width:24px; height:24px; border-radius:50%; border:1px solid var(--border); background:var(--bg-card); color:var(--text-primary); font-weight:bold; cursor:pointer;">+</button>
              </div>
            </div>
            <button onclick="removeFromCart(${idx})" style="background:none; border:none; color:rgba(255, 82, 82, 0.6); cursor:pointer; padding:8px;"><i class="iconly-boldDelete"></i></button>
          </div>
        `;
      }).join('');
    }

    if (totalEl) {
      totalEl.textContent = `${totalPrice} ${currentLang === 'ar' ? 'ج.م' : 'EGP'}`;
    }
  }
}

function showToast(message) {
  let toast = document.getElementById('luxuryToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'luxuryToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="iconly-boldTick-Square" style="color:var(--gold);"></i> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── CHECKOUT & WHATSAPP DISPATCH ────────────────

window.initDeliveryFields = function() {
  const fields = document.getElementById('deliveryFields');
  if (fields) {
    fields.style.maxHeight = '0';
    fields.style.opacity = '0';
    fields.style.overflow = 'hidden';
  }
};

window.toggleDeliveryFields = function() {
  const fields = document.getElementById('deliveryFields');
  const type = document.querySelector('input[name="orderType"]:checked').value;
  if (!fields) return;

  if (type === 'delivery') {
    fields.style.maxHeight = '300px';
    fields.style.opacity = '1';
    fields.style.marginTop = '16px';
    document.getElementById('governorateSelect').setAttribute('required', 'required');
    document.getElementById('deliveryAddress').setAttribute('required', 'required');
  } else {
    fields.style.maxHeight = '0';
    fields.style.opacity = '0';
    fields.style.marginTop = '0';
    document.getElementById('governorateSelect').removeAttribute('required');
    document.getElementById('deliveryAddress').removeAttribute('required');
  }
};

window.sendOrder = function() {
  const errorEl = document.getElementById('cartError');
  if (cart.length === 0) {
    if (errorEl) {
      errorEl.textContent = currentLang === 'ar' ? 'السلة فارغة!' : 'Your cart is empty!';
      errorEl.style.display = 'block';
    }
    return;
  }

  const type = document.querySelector('input[name="orderType"]:checked').value;
  if (type === 'delivery') {
    const gov = document.getElementById('governorateSelect').value;
    const addr = document.getElementById('deliveryAddress').value.trim();
    if (!gov || !addr) {
      if (errorEl) {
        errorEl.textContent = currentLang === 'ar' ? 'يرجى ملء تفاصيل التوصيل (المحافظة والعنوان)' : 'Please fill delivery details (governorate and address)';
        errorEl.style.display = 'block';
      }
      return;
    }
  }

  if (errorEl) errorEl.style.display = 'none';

  const modal = document.getElementById('phoneModal');
  if (modal) {
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.classList.remove('hidden');
      modal.classList.add('is-visible');
    });
  }
};

window.closePhoneModal = function(clear = false) {
  const modal = document.getElementById('phoneModal');
  if (modal) {
    modal.classList.remove('is-visible');
    setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.add('hidden');
    }, 300);
  }
  if (clear) {
    document.getElementById('customerNameInput').value = '';
    document.getElementById('customerPhoneInput').value = '';
    const err = document.getElementById('phoneErrorMsg');
    if (err) err.style.display = 'none';
  }
};

window.confirmPhoneAndSend = function() {
  const name = document.getElementById('customerNameInput').value.trim();
  const phone = document.getElementById('customerPhoneInput').value.trim();
  const errorMsg = document.getElementById('phoneErrorMsg');

  if (!name || !phone) {
    if (errorMsg) {
      errorMsg.textContent = currentLang === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill all required fields';
      errorMsg.style.display = 'block';
    }
    return;
  }

  const phoneRegex = /^01[0125][0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    if (errorMsg) {
      errorMsg.textContent = currentLang === 'ar' ? 'رقم الهاتف غير صحيح (مثال: 01004741050)' : 'Invalid mobile number (e.g., 01004741050)';
      errorMsg.style.display = 'block';
    }
    return;
  }

  if (errorMsg) errorMsg.style.display = 'none';

  const waNumber = '201004741050'; // Target WhatsApp recipient phone number

  const branch = document.getElementById('branchSelect').value;
  const orderType = document.querySelector('input[name="orderType"]:checked').value;

  let deliveryDetails = '';
  if (orderType === 'delivery') {
    const gov = document.getElementById('governorateSelect').value;
    const addr = document.getElementById('deliveryAddress').value.trim();
    deliveryDetails = `🚚 *Order Type / طريقة الطلب:* Delivery / توصيل\n📍 *Governorate / المحافظة:* ${gov}\n🏠 *Address / العنوان:* ${addr}`;
  } else {
    const branchName = document.getElementById('branchSelect').options[document.getElementById('branchSelect').selectedIndex].text;
    deliveryDetails = `🏢 *Order Type / طريقة الطلب:* Pickup / استلام من الفرع\n🏪 *Branch / الفرع:* ${branchName}`;
  }

  const itemsText = cart.map(item => {
    const nameStr = currentLang === 'ar' ? item.name_ar : item.name;
    const sizeStr = item.sizeName ? ` (${item.sizeName})` : '';
    return `- ${nameStr}${sizeStr} x${item.quantity} = ${item.price * item.quantity} EGP`;
  }).join('\n');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const notes = document.getElementById('customerNotes').value.trim();

  const message = `🛍️ *New Order — Break Out Cafe* 🛍️\n\n` +
                  `👤 *Name / العميل:* ${name}\n` +
                  `📱 *Phone / الهاتف:* ${phone}\n\n` +
                  `${deliveryDetails}\n\n` +
                  `📦 *Items / الطلبات:*\n${itemsText}\n\n` +
                  `💰 *Total / الإجمالي:* ${total} EGP / ج.م\n` +
                  (notes ? `📝 *Notes / ملاحظات:* ${notes}` : '');

  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

  // Close modal and cart drawer, clear cart
  closePhoneModal(true);
  closeCart();
  window.open(waUrl, '_blank');

  cart = [];
  localStorage.removeItem('breakout_cart');
  syncCartUI();
};

// ─── FAB & BACK TO TOP ────────────────────────
function initFAB() {
  const fabTop = document.querySelector('.fab-top');
  if (!fabTop) return;
  window.addEventListener('scroll', () => {
    fabTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── THEME INIT (DARK MODE ONLY) ─────────────
function initTheme() {
  document.documentElement.dataset.theme = 'dark';
  localStorage.setItem('breakout-theme', 'dark');
}

// ─── LIGHTBOX ─────────────────────────────────
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  if (!lightbox) return;

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      lbImg.src = el.dataset.lightbox;
      lightbox.classList.add('open');
    });
  });

  document.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
}

// ─── MOBILE NAV ───────────────────────────────
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

/* ============================================
   ARABIC ONLY TRANSLATION ENGINE (JSON LOADER)
   ============================================ */

let currentLang = 'ar';
const loadedTranslations = {};

async function loadTranslationBundle(lang = 'ar') {
  if (loadedTranslations['ar']) {
    return loadedTranslations['ar'];
  }
  try {
    const response = await fetch(`assets/lang/ar.json`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    loadedTranslations['ar'] = data;
    return data;
  } catch (err) {
    console.warn(`Failed to fetch assets/lang/ar.json:`, err);
    return null;
  }
}

function initLanguage() {
  async function updatePageLanguage() {
    currentLang = 'ar';
    localStorage.setItem('breakout_lang', 'ar');

    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';

    const bundle = await loadTranslationBundle('ar');
    if (!bundle) return;

    const ui = bundle.ui || {};

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (ui[key]) {
        el.innerHTML = ui[key];
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (ui[key]) {
        el.placeholder = ui[key];
      }
    });

    // Dynamic translation and layout updates
    renderCategoryTabs();
    renderProducts();
    syncCartUI();

    // Update theme toggle buttons localization
    if (window.updateThemeButtons) {
      window.updateThemeButtons();
    }
  }

  updatePageLanguage();
}

