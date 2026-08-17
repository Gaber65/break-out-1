/**
 * =========================================================================
 * BREAK OUT CAFE — Admin Dashboard Logic (Google Sheets Integration)
 * =========================================================================
 */

'use strict';

// ─── Global State ────────────────────────────────────────────────
let menuData = {
  restaurantName: 'Breakout Cafe',
  currency: 'EGP',
  categories: [],
  offers: []
};

let currentTab = 'overview';
let activeCategoryFilter = 'all';
let activeStatusFilter = 'all';
let searchQuery = '';
let currentPage = 1;
const ITEMS_PER_PAGE = 15;

// ─── Initialization ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSettingsForm();
  if (checkAuth()) {
    loadData(true);
  }
});

// ─── Security & Authentication ───────────────────────────────────
function checkAuth() {
  const isAuth = sessionStorage.getItem('breakout_admin_auth') === 'true' || 
                 localStorage.getItem('breakout_admin_auth') === 'true';
  const overlay = document.getElementById('loginOverlay');
  if (!isAuth) {
    if (overlay) overlay.classList.remove('hidden');
    return false;
  } else {
    if (overlay) overlay.classList.add('hidden');
    return true;
  }
}

function handleLogin(event) {
  event.preventDefault();
  const passInput = document.getElementById('adminPasswordInput');
  const errorMsg = document.getElementById('loginErrorMsg');
  const rememberMe = document.getElementById('rememberMeCheck')?.checked;
  const currentSavedPass = localStorage.getItem('breakout_admin_password') || 'breakout2026';

  const entered = passInput.value.trim();
  if (entered === currentSavedPass) {
    sessionStorage.setItem('breakout_admin_auth', 'true');
    if (rememberMe) {
      localStorage.setItem('breakout_admin_auth', 'true');
    }
    if (errorMsg) errorMsg.style.display = 'none';
    document.getElementById('loginOverlay')?.classList.add('hidden');
    showToast('تم تسجيل الدخول بنجاح! مرحباً بك ☕', 'success');
    loadData(true);
  } else {
    if (errorMsg) {
      errorMsg.textContent = '❌ كلمة المرور غير صحيحة، يرجى المحاولة مجدداً.';
      errorMsg.style.display = 'block';
    }
    passInput.value = '';
    passInput.focus();
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

function handleLogout() {
  sessionStorage.removeItem('breakout_admin_auth');
  localStorage.removeItem('breakout_admin_auth');
  const overlay = document.getElementById('loginOverlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    const passInput = document.getElementById('adminPasswordInput');
    if (passInput) {
      passInput.value = '';
      passInput.focus();
    }
  }
  showToast('تم تسجيل الخروج بنجاح.', 'info');
}

function handleChangePassword(event) {
  event.preventDefault();
  const currentPass = document.getElementById('currentPassInput').value.trim();
  const newPass = document.getElementById('newPassInput').value.trim();
  const confirmPass = document.getElementById('confirmPassInput').value.trim();
  const savedPass = localStorage.getItem('breakout_admin_password') || 'breakout2026';

  if (currentPass !== savedPass) {
    showToast('❌ كلمة المرور الحالية غير صحيحة!', 'error');
    return;
  }

  if (!newPass || newPass.length < 4) {
    showToast('❌ يجب أن تتكون كلمة المرور الجديدة من 4 خانات على الأقل', 'error');
    return;
  }

  if (newPass !== confirmPass) {
    showToast('❌ كلمة المرور الجديدة وتأكيدها غير متطابقين!', 'error');
    return;
  }

  localStorage.setItem('breakout_admin_password', newPass);
  showToast('✅ تم تغيير كلمة المرور بنجاح!', 'success');
  event.target.reset();
}

// ─── Navigation & Tabs ───────────────────────────────────────────
function initNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.dataset.tab;
      if (!tabId) return;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      const activePane = document.getElementById(`tab-${tabId}`);
      if (activePane) activePane.classList.add('active');

      currentTab = tabId;
      document.getElementById('pageTitle').textContent = item.querySelector('span').textContent;

      // Close mobile sidebar if open
      document.querySelector('.sidebar').classList.remove('open');
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('open');
    });
  }
}

// ─── Data Fetching ───────────────────────────────────────────────
async function loadData(forceRefresh = true) {
  showToast('جاري جلب البيانات من Google Sheets...', 'info');
  updateConnectionStatus('connecting');

  try {
    const data = await ApiClient.getMenu(forceRefresh);
    if (!data || !data.categories) {
      throw new Error('لم يتم العثور على بيانات المنيو');
    }

    menuData = data;
    updateConnectionStatus('online');
    renderDashboardOverview();
    renderProductsTable();
    renderCategoriesGrid();
    renderOffersGrid();
    populateCategoryDropdowns();
    showToast('تم تحديث البيانات بنجاح!', 'success');
  } catch (err) {
    console.error('❌ Data loading error:', err);
    updateConnectionStatus('offline');
    showToast(`فشل الاتصال: ${err.message}`, 'error');
  }
}

function updateConnectionStatus(status) {
  const statusEl = document.getElementById('connectionStatus');
  const dotEl = document.getElementById('connectionDot');
  const textEl = document.getElementById('connectionText');

  if (status === 'online') {
    statusEl.className = 'connection-status';
    textEl.textContent = 'متصل بـ Google Sheets';
  } else if (status === 'connecting') {
    statusEl.className = 'connection-status';
    textEl.textContent = 'جاري الاتصال...';
  } else {
    statusEl.className = 'connection-status offline';
    textEl.textContent = 'غير متصل (استخدام محلي)';
  }
}

// ─── Overview Tab ────────────────────────────────────────────────
function renderDashboardOverview() {
  const categories = menuData.categories || [];
  let totalProducts = 0;
  let availableProducts = 0;
  let popularProducts = 0;

  categories.forEach(c => {
    (c.items || []).forEach(item => {
      totalProducts++;
      if (item.available !== false) availableProducts++;
      if (item.popular) popularProducts++;
    });
  });

  const totalOffers = (menuData.offers || []).length;

  document.getElementById('statTotalProducts').textContent = totalProducts;
  document.getElementById('statAvailableProducts').textContent = availableProducts;
  document.getElementById('statTotalCategories').textContent = categories.length;
  document.getElementById('statTotalOffers').textContent = totalOffers;

  // Update nav badges
  document.getElementById('badgeProdCount').textContent = totalProducts;
  document.getElementById('badgeCatCount').textContent = categories.length;
  document.getElementById('badgeOfferCount').textContent = totalOffers;
}

// ─── Products Tab ────────────────────────────────────────────────
function populateCategoryDropdowns() {
  const filterSelect = document.getElementById('prodCategoryFilter');
  const modalSelect = document.getElementById('prodModalCategory');
  const offerTargetCategory = document.getElementById('offerTargetCategory');

  if (!filterSelect || !modalSelect) return;

  const categories = menuData.categories || [];

  // 1. Filter dropdown
  filterSelect.innerHTML = `<option value="all">جميع الفئات (${categories.length})</option>` +
    categories.map(c => `<option value="${c.id}">${c.name_ar || c.name} (${(c.items || []).length})</option>`).join('');

  // 2. Modal dropdown
  modalSelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name_ar || c.name} (${c.name})</option>`).join('');

  // 3. Offers target category dropdown
  if (offerTargetCategory) {
    offerTargetCategory.innerHTML = `<option value="all">كل المنيو (جميع الفئات)</option>` +
      categories.map(c => `<option value="${c.id}">${c.name_ar || c.name}</option>`).join('');
  }
}

function getFilteredProducts() {
  const allItems = [];
  (menuData.categories || []).forEach(cat => {
    (cat.items || []).forEach(item => {
      allItems.push({
        ...item,
        categoryId: cat.id,
        categoryName: cat.name_ar || cat.name
      });
    });
  });

  return allItems.filter(item => {
    // Category filter
    if (activeCategoryFilter !== 'all' && item.categoryId !== activeCategoryFilter) {
      return false;
    }

    // Status filter
    if (activeStatusFilter === 'available' && item.available === false) return false;
    if (activeStatusFilter === 'unavailable' && item.available !== false) return false;
    if (activeStatusFilter === 'popular' && !item.popular) return false;
    if (activeStatusFilter === 'new' && !item.isNew) return false;
    if (activeStatusFilter === 'featured' && !item.featured) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (item.name || '').toLowerCase().includes(q);
      const matchNameAr = (item.name_ar || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchTags = (item.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchNameAr && !matchDesc && !matchTags) return false;
    }

    return true;
  });
}

function renderProductsTable() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  const filtered = getFilteredProducts();
  const totalItems = filtered.length;

  document.getElementById('productsFilteredCount').textContent = `عرض ${totalItems} منتج`;

  if (totalItems === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 48px; color: var(--text-muted);">
          <div style="font-size: 36px; margin-bottom: 8px;">🔍</div>
          <div>لا توجد منتجات مطابقة لخيارات البحث أو الفلتر</div>
        </td>
      </tr>
    `;
    renderPagination(0);
    return;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  tbody.innerHTML = paginated.map(item => {
    const pricesStr = Array.isArray(item.prices) ? item.prices.join(' / ') : item.prices;
    const currency = menuData.currency || 'EGP';
    const imgUrl = item.image || generatePlaceholderSvg(item.name, item.name_ar || item.name, item.categoryId);

    return `
      <tr>
        <td>
          <div class="prod-info-cell">
            <img src="${imgUrl}" alt="${item.name}" class="prod-thumb" onerror="this.src='assets/images/logo.png'">
            <div class="prod-names">
              <div class="prod-title-ar">${item.name_ar || item.name}</div>
              <div class="prod-title-en">${item.name}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge badge-gold">${item.categoryName}</span>
        </td>
        <td>
          <button class="price-tag-badge" title="اضغط لتعديل السعر سريعاً" onclick="quickEditPrice('${item.id}', '${pricesStr}')">
            <span>${pricesStr} ${currency}</span>
            <i class="iconly-boldEdit" style="font-size: 11px;"></i>
          </button>
        </td>
        <td>
          <label class="switch" title="تبديل التوفر">
            <input type="checkbox" ${item.available !== false ? 'checked' : ''} onchange="toggleProductField('${item.categoryId}', '${item.id}', 'available', this.checked)">
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            ${item.popular ? '<span class="badge badge-gold">⭐ مفضل</span>' : ''}
            ${item.isNew ? '<span class="badge badge-green">✨ جديد</span>' : ''}
            ${item.featured ? '<span class="badge badge-blue">🔥 مميز</span>' : ''}
            ${(!item.popular && !item.isNew && !item.featured) ? '<span style="color:var(--text-dim);font-size:11px;">-</span>' : ''}
          </div>
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="openEditProductModal('${item.categoryId}', '${item.id}')" title="تعديل">
              <span>تعديل</span>
            </button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeleteProduct('${item.categoryId}', '${item.id}', '${item.name_ar || item.name}')" title="حذف">
              <span>🗑️</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  renderPagination(totalItems);
}

function renderPagination(totalItems) {
  const container = document.getElementById('productsPagination');
  if (!container) return;

  const pageCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (pageCount <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `<div style="display:flex; align-items:center; gap:6px; justify-content:center; padding:16px 0;">`;
  
  // Prev button
  html += `
    <button class="btn btn-secondary btn-sm" ${currentPage === 1 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : `onclick="changePage(${currentPage - 1})"`}>
      السابق
    </button>
  `;

  // Page numbers
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || (i >= currentPage - 2 && i <= currentPage + 2)) {
      html += `
        <button class="btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'} btn-sm" style="min-width:34px; padding:6px 10px;" onclick="changePage(${i})">
          ${i}
        </button>
      `;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      html += `<span style="color:var(--text-dim); padding:0 4px;">...</span>`;
    }
  }

  // Next button
  html += `
    <button class="btn btn-secondary btn-sm" ${currentPage === pageCount ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : `onclick="changePage(${currentPage + 1})"`}>
      التالي
    </button>
  `;

  html += `</div>`;
  container.innerHTML = html;
}

function changePage(p) {
  currentPage = p;
  renderProductsTable();
}

// ─── Inline Price Quick Edit ─────────────────────────────────────
async function quickEditPrice(productId, currentPriceStr) {
  const newPriceStr = prompt(`تعديل السعر للمنتج (${productId}):\nلو المنتج به أكثر من حجم افصل بفاصلة (مثال: 35, 55)`, currentPriceStr);
  if (newPriceStr === null) return; // User cancelled

  const cleanPrices = newPriceStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  if (cleanPrices.length === 0) {
    showToast('يرجى إدخال رقم سعر صحيح!', 'error');
    return;
  }

  showToast('جاري تحديث السعر في Google Sheets...', 'info');

  try {
    await ApiClient.updatePrice(productId, cleanPrices);

    // Update local state
    (menuData.categories || []).forEach(c => {
      (c.items || []).forEach(i => {
        if (i.id === productId) {
          i.prices = cleanPrices;
        }
      });
    });

    renderProductsTable();
    showToast('تم تحديث السعر بنجاح!', 'success');
  } catch (err) {
    showToast(`فشل تحديث السعر: ${err.message}`, 'error');
  }
}

// ─── Toggle Product Field (Available, etc.) ──────────────────────
async function toggleProductField(categoryId, productId, field, value) {
  const category = (menuData.categories || []).find(c => c.id === categoryId);
  const item = category ? (category.items || []).find(i => i.id === productId) : null;
  if (!item) return;

  item[field] = value;

  try {
    await ApiClient.saveProduct({
      ...item,
      categoryId: categoryId
    });
    showToast(`تم تحديث حالة المنتج بنجاح`, 'success');
    renderDashboardOverview();
  } catch (err) {
    showToast(`فشل حفظ التعديل: ${err.message}`, 'error');
  }
}

// ─── Add / Edit Product Modal ────────────────────────────────────
let dynamicPriceCount = 1;

function openAddProductModal() {
  document.getElementById('productModalTitle').textContent = 'إضافة منتج جديد';
  document.getElementById('prodModalId').value = '';
  document.getElementById('prodModalName').value = '';
  document.getElementById('prodModalNameAr').value = '';
  document.getElementById('prodModalDesc').value = '';
  document.getElementById('prodModalImage').value = '';
  document.getElementById('prodModalTags').value = '';
  document.getElementById('prodModalSort').value = '1';
  document.getElementById('prodModalAvailable').checked = true;
  document.getElementById('prodModalPopular').checked = false;
  document.getElementById('prodModalNew').checked = false;
  document.getElementById('prodModalFeatured').checked = false;

  // Reset price rows to 1
  setPriceInputs([0]);
  updateImagePreview('');

  openModal('productModal');
}

function openEditProductModal(categoryId, productId) {
  const category = (menuData.categories || []).find(c => c.id === categoryId);
  const item = category ? (category.items || []).find(i => i.id === productId) : null;
  if (!item) return;

  document.getElementById('productModalTitle').textContent = `تعديل منتج: ${item.name_ar || item.name}`;
  document.getElementById('prodModalId').value = item.id;
  document.getElementById('prodModalCategory').value = categoryId;
  document.getElementById('prodModalName').value = item.name || '';
  document.getElementById('prodModalNameAr').value = item.name_ar || '';
  document.getElementById('prodModalDesc').value = item.description || '';
  document.getElementById('prodModalImage').value = item.image || '';
  document.getElementById('prodModalTags').value = (item.tags || []).join(', ');
  document.getElementById('prodModalSort').value = item.sortOrder || 1;
  document.getElementById('prodModalAvailable').checked = item.available !== false;
  document.getElementById('prodModalPopular').checked = item.popular === true;
  document.getElementById('prodModalNew').checked = item.isNew === true;
  document.getElementById('prodModalFeatured').checked = item.featured === true;

  setPriceInputs(item.prices || [0]);
  updateImagePreview(item.image || '');

  openModal('productModal');
}

function setPriceInputs(pricesArray) {
  const container = document.getElementById('priceInputsContainer');
  if (!container) return;

  container.innerHTML = pricesArray.map((p, idx) => `
    <div class="price-row-item">
      <input type="number" step="any" min="0" class="form-input prod-price-val" value="${p}" placeholder="السعر">
      <span style="color:var(--text-muted);font-size:12px;">ج.م</span>
      ${idx > 0 ? `<button type="button" class="btn btn-danger btn-sm btn-icon" onclick="this.parentElement.remove()">✕</button>` : ''}
    </div>
  `).join('');
}

function addPriceInputRow() {
  const container = document.getElementById('priceInputsContainer');
  const div = document.createElement('div');
  div.className = 'price-row-item';
  div.innerHTML = `
    <input type="number" step="any" min="0" class="form-input prod-price-val" value="" placeholder="سعر حجم إضافي">
    <span style="color:var(--text-muted);font-size:12px;">ج.م</span>
    <button type="button" class="btn btn-danger btn-sm btn-icon" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(div);
}

function updateImagePreview(url) {
  const preview = document.getElementById('modalImagePreview');
  if (!preview) return;
  preview.src = url || 'assets/images/logo.png';
}

async function handleSaveProduct(e) {
  e.preventDefault();

  const id = document.getElementById('prodModalId').value.trim() || ('prod_' + Date.now());
  const categoryId = document.getElementById('prodModalCategory').value;
  const name = document.getElementById('prodModalName').value.trim();
  const name_ar = document.getElementById('prodModalNameAr').value.trim();
  const description = document.getElementById('prodModalDesc').value.trim();
  const image = document.getElementById('prodModalImage').value.trim();
  const tagsStr = document.getElementById('prodModalTags').value.trim();
  const sortOrder = parseInt(document.getElementById('prodModalSort').value) || 1;
  const available = document.getElementById('prodModalAvailable').checked;
  const popular = document.getElementById('prodModalPopular').checked;
  const isNew = document.getElementById('prodModalNew').checked;
  const featured = document.getElementById('prodModalFeatured').checked;

  // Gather prices
  const priceInputs = document.querySelectorAll('.prod-price-val');
  const prices = Array.from(priceInputs).map(inp => parseFloat(inp.value)).filter(n => !isNaN(n));
  if (prices.length === 0) prices.push(0);

  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

  const productPayload = {
    id,
    categoryId,
    name,
    name_ar: name_ar || name,
    description,
    prices,
    image,
    available,
    popular,
    isNew,
    featured,
    tags,
    sortOrder
  };

  showToast('جاري حفظ المنتج في Google Sheets...', 'info');
  closeModal('productModal');

  try {
    await ApiClient.saveProduct(productPayload);
    showToast('تم حفظ المنتج بنجاح!', 'success');
    await loadData(true);
  } catch (err) {
    showToast(`فشل حفظ المنتج: ${err.message}`, 'error');
  }
}

function confirmDeleteProduct(categoryId, productId, productName) {
  if (!confirm(`هل أنت متأكد من حذف المنتج: "${productName}"؟\nسيتم حذفه نهائياً من Google Sheets.`)) return;

  deleteProduct(productId);
}

async function deleteProduct(productId) {
  showToast('جاري حذف المنتج من Google Sheets...', 'info');
  try {
    await ApiClient.deleteProduct(productId);
    showToast('تم حذف المنتج بنجاح!', 'success');
    await loadData(true);
  } catch (err) {
    showToast(`فشل حذف المنتج: ${err.message}`, 'error');
  }
}

// ─── Categories Tab ──────────────────────────────────────────────
function renderCategoriesGrid() {
  const container = document.getElementById('categoriesGridContainer');
  if (!container) return;

  const categories = menuData.categories || [];

  container.innerHTML = categories.map(cat => {
    const itemsCount = (cat.items || []).length;
    return `
      <div class="category-admin-card">
        <div class="category-card-header">
          <div class="category-icon-box">☕</div>
          <div>
            <h3 style="font-size:16px;font-weight:700;color:#fff;">${cat.name_ar || cat.name}</h3>
            <span style="font-size:12px;color:var(--text-muted);">${cat.name} (${cat.id})</span>
          </div>
        </div>
        <div class="category-card-body">
          <span style="color:var(--text-muted);font-size:13px;">عدد المنتجات:</span>
          <span class="badge badge-gold" style="font-size:13px;">${itemsCount} منتج</span>
        </div>
        <div class="category-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="openEditCategoryModal('${cat.id}')">تعديل</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeleteCategory('${cat.id}', '${cat.name_ar || cat.name}')">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function openAddCategoryModal() {
  document.getElementById('categoryModalTitle').textContent = 'إضافة فئة جديدة';
  document.getElementById('catModalId').value = '';
  document.getElementById('catModalId').readOnly = false;
  document.getElementById('catModalName').value = '';
  document.getElementById('catModalNameAr').value = '';
  document.getElementById('catModalIcon').value = 'coffee';
  document.getElementById('catModalSort').value = (menuData.categories.length + 1);

  openModal('categoryModal');
}

function openEditCategoryModal(catId) {
  const cat = (menuData.categories || []).find(c => c.id === catId);
  if (!cat) return;

  document.getElementById('categoryModalTitle').textContent = `تعديل فئة: ${cat.name_ar || cat.name}`;
  document.getElementById('catModalId').value = cat.id;
  document.getElementById('catModalId').readOnly = true;
  document.getElementById('catModalName').value = cat.name || '';
  document.getElementById('catModalNameAr').value = cat.name_ar || '';
  document.getElementById('catModalIcon').value = cat.icon || 'coffee';
  document.getElementById('catModalSort').value = cat.sortOrder || 1;

  openModal('categoryModal');
}

async function handleSaveCategory(e) {
  e.preventDefault();

  let id = document.getElementById('catModalId').value.trim();
  const name = document.getElementById('catModalName').value.trim();
  const name_ar = document.getElementById('catModalNameAr').value.trim();
  const icon = document.getElementById('catModalIcon').value.trim();
  const sortOrder = parseInt(document.getElementById('catModalSort').value) || 1;

  if (!id) {
    id = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  const categoryPayload = {
    id,
    name,
    name_ar: name_ar || name,
    icon: icon || 'coffee',
    coverImage: '',
    sortOrder
  };

  showToast('جاري حفظ الفئة في Google Sheets...', 'info');
  closeModal('categoryModal');

  try {
    await ApiClient.saveCategory(categoryPayload);
    showToast('تم حفظ الفئة بنجاح!', 'success');
    await loadData(true);
  } catch (err) {
    showToast(`فشل حفظ الفئة: ${err.message}`, 'error');
  }
}

function confirmDeleteCategory(catId, catName) {
  if (!confirm(`هل أنت متأكد من حذف الفئة: "${catName}"؟\nتنبيه: سيتم حذف الفئة ولكن المنتجات ستبقى.`)) return;

  deleteCategory(catId);
}

async function deleteCategory(catId) {
  showToast('جاري حذف الفئة من Google Sheets...', 'info');
  try {
    await ApiClient.deleteCategory(catId);
    showToast('تم حذف الفئة بنجاح!', 'success');
    await loadData(true);
  } catch (err) {
    showToast(`فشل حذف الفئة: ${err.message}`, 'error');
  }
}

// ─── Offers Tab ──────────────────────────────────────────────────
function renderOffersGrid() {
  const container = document.getElementById('offersGridContainer');
  if (!container) return;

  const offers = menuData.offers || [];

  if (offers.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 48px; background: var(--bg-card); border-radius: var(--radius); border: 1px dashed var(--border);">
        <div style="font-size: 36px; margin-bottom: 8px;">🎁</div>
        <h3 style="color:#fff; margin-bottom:6px;">لا توجد عروض ترويجية نشطة حالياً</h3>
        <p style="color:var(--text-muted); font-size:13px; margin-bottom:16px;">قم بإنشاء عرض ترويجي لجذب العملاء وزيادة المبيعات</p>
        <button class="btn btn-primary" onclick="openAddOfferModal()">+ إضافة عرض جديد</button>
      </div>
    `;
    return;
  }

  container.innerHTML = offers.map(o => {
    const discountText = o.discountType === 'percentage' ? `${o.discountValue}% خصم` : `${o.discountValue} ج.م خصم`;

    return `
      <div class="offer-card">
        <span class="badge badge-gold offer-card-badge">${o.badgeText || discountText}</span>
        <div style="font-size: 24px; margin-bottom: 8px;">🎉</div>
        <h3 class="offer-title">${o.title_ar || o.title}</h3>
        <div class="offer-details">
          <div><strong>النوع:</strong> ${o.type === 'category' ? 'على فئة كاملة' : (o.type === 'products' ? 'منتجات محددة' : 'على كل المنيو')}</div>
          <div><strong>الخصم:</strong> ${discountText}</div>
          ${o.startDate ? `<div><strong>تاريخ البدء:</strong> ${o.startDate}</div>` : ''}
          ${o.endDate ? `<div><strong>تاريخ الانتهاء:</strong> ${o.endDate}</div>` : ''}
        </div>
        <div class="offer-footer">
          <label class="switch" title="تفعيل / تعطيل العرض">
            <input type="checkbox" ${o.active !== false ? 'checked' : ''} onchange="toggleOfferActive('${o.id}', this.checked)">
            <span class="slider"></span>
          </label>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="openEditOfferModal('${o.id}')">تعديل</button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeleteOffer('${o.id}', '${o.title_ar || o.title}')">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openAddOfferModal() {
  document.getElementById('offerModalTitle').textContent = 'إنشاء عرض ترويجي جديد';
  document.getElementById('offerModalId').value = '';
  document.getElementById('offerModalTitleInput').value = '';
  document.getElementById('offerModalTitleArInput').value = '';
  document.getElementById('offerModalType').value = 'category';
  document.getElementById('offerModalDiscountType').value = 'percentage';
  document.getElementById('offerModalDiscountVal').value = '15';
  document.getElementById('offerModalBadge').value = 'خصم 15%';
  document.getElementById('offerModalStart').value = new Date().toISOString().split('T')[0];
  document.getElementById('offerModalEnd').value = '';
  document.getElementById('offerModalActive').checked = true;

  openModal('offerModal');
}

function openEditOfferModal(offerId) {
  const offer = (menuData.offers || []).find(o => o.id === offerId);
  if (!offer) return;

  document.getElementById('offerModalTitle').textContent = `تعديل عرض: ${offer.title_ar || offer.title}`;
  document.getElementById('offerModalId').value = offer.id;
  document.getElementById('offerModalTitleInput').value = offer.title || '';
  document.getElementById('offerModalTitleArInput').value = offer.title_ar || '';
  document.getElementById('offerModalType').value = offer.type || 'category';
  document.getElementById('offerModalDiscountType').value = offer.discountType || 'percentage';
  document.getElementById('offerModalDiscountVal').value = offer.discountValue || 0;
  document.getElementById('offerModalBadge').value = offer.badgeText || '';
  document.getElementById('offerModalStart').value = offer.startDate || '';
  document.getElementById('offerModalEnd').value = offer.endDate || '';
  document.getElementById('offerModalActive').checked = offer.active !== false;

  openModal('offerModal');
}

async function handleSaveOffer(e) {
  e.preventDefault();

  const id = document.getElementById('offerModalId').value || ('offer_' + Date.now());
  const title = document.getElementById('offerModalTitleInput').value.trim();
  const title_ar = document.getElementById('offerModalTitleArInput').value.trim();
  const type = document.getElementById('offerModalType').value;
  const targetCategory = document.getElementById('offerTargetCategory').value;
  const discountType = document.getElementById('offerModalDiscountType').value;
  const discountValue = parseFloat(document.getElementById('offerModalDiscountVal').value) || 0;
  const badgeText = document.getElementById('offerModalBadge').value.trim();
  const startDate = document.getElementById('offerModalStart').value;
  const endDate = document.getElementById('offerModalEnd').value;
  const active = document.getElementById('offerModalActive').checked;

  const offerPayload = {
    id,
    title,
    title_ar: title_ar || title,
    type,
    targetIds: targetCategory === 'all' ? ['all'] : [targetCategory],
    discountType,
    discountValue,
    badgeText,
    startDate,
    endDate,
    active
  };

  showToast('جاري حفظ العرض في Google Sheets...', 'info');
  closeModal('offerModal');

  try {
    await ApiClient.saveOffer(offerPayload);
    showToast('تم حفظ العرض بنجاح!', 'success');
    await loadData(true);
  } catch (err) {
    showToast(`فشل حفظ العرض: ${err.message}`, 'error');
  }
}

async function toggleOfferActive(offerId, isActive) {
  const offer = (menuData.offers || []).find(o => o.id === offerId);
  if (!offer) return;

  offer.active = isActive;
  try {
    await ApiClient.saveOffer(offer);
    showToast('تم تحديث حالة العرض', 'success');
  } catch (err) {
    showToast(`فشل تحديث العرض: ${err.message}`, 'error');
  }
}

function confirmDeleteOffer(offerId, title) {
  if (!confirm(`هل أنت متأكد من حذف العرض: "${title}"؟`)) return;

  deleteOffer(offerId);
}

async function deleteOffer(offerId) {
  showToast('جاري حذف العرض من Google Sheets...', 'info');
  try {
    await ApiClient.deleteOffer(offerId);
    showToast('تم حذف العرض بنجاح!', 'success');
    await loadData(true);
  } catch (err) {
    showToast(`فشل حذف العرض: ${err.message}`, 'error');
  }
}

// ─── Settings & Database Management Tab ──────────────────────────
function initSettingsForm() {
  const apiUrlInput = document.getElementById('settingsApiUrl');
  if (apiUrlInput) {
    apiUrlInput.value = CONFIG.getApiUrl();
  }

  // Bind Search & Filters
  const searchInput = document.getElementById('prodSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      currentPage = 1;
      renderProductsTable();
    });
  }

  const categorySelect = document.getElementById('prodCategoryFilter');
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      activeCategoryFilter = e.target.value;
      currentPage = 1;
      renderProductsTable();
    });
  }

  const statusSelect = document.getElementById('prodStatusFilter');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      activeStatusFilter = e.target.value;
      currentPage = 1;
      renderProductsTable();
    });
  }

  // Image preview live binding in modal
  const imageInput = document.getElementById('prodModalImage');
  if (imageInput) {
    imageInput.addEventListener('input', (e) => {
      updateImagePreview(e.target.value.trim());
    });
  }
}

function saveApiUrlSetting() {
  const input = document.getElementById('settingsApiUrl');
  if (!input) return;

  const newUrl = input.value.trim();
  if (!newUrl.startsWith('https://script.google.com/')) {
    showToast('يرجى التأكد من كتابة رابط Google Apps Script صحيح يبدأ بـ https://script.google.com/', 'error');
    return;
  }

  CONFIG.setApiUrl(newUrl);
  showToast('تم حفظ رابط الـ API بنجاح!', 'success');
  loadData(true);
}

async function handleBulkSeedFromJson() {
  if (!confirm('تنبيه هام:\nهل أنت متأكد من رفع كامل بيانات menu.json الأصلية (380+ منتج) إلى Google Sheets؟\nسيتم تحديث وتعبئة ورقة العمل بالكامل.')) {
    return;
  }

  showToast('جاري قراءة ملف menu.json ورفع البيانات إلى Google Sheets...', 'info');

  try {
    const res = await fetch('assets/data/menu.json');
    const localMenuData = await res.json();

    const seedResult = await ApiClient.seedAll(localMenuData);
    if (seedResult.success) {
      showToast(`تم رفع ${seedResult.productsCount} منتج و ${seedResult.categoriesCount} فئة إلى Google Sheets بنجاح!`, 'success');
      await loadData(true);
    } else {
      throw new Error(seedResult.error || 'فشلت عملية الرفع');
    }
  } catch (err) {
    showToast(`خطأ أثناء رفع البيانات: ${err.message}`, 'error');
  }
}

function exportDatabaseToJson() {
  const jsonStr = JSON.stringify(menuData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `breakout_menu_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('تم تصدير النسخة الاحتياطية بنجاح!', 'success');
}

// ─── Modal Helpers ───────────────────────────────────────────────
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('show');
  }
});

// ─── Toast System ────────────────────────────────────────────────
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'info') icon = '⏳';

  toast.innerHTML = `
    <span>${icon}</span>
    <span style="flex:1;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ─── Svg Generator Helper ────────────────────────────────────────
function generatePlaceholderSvg(name, nameAr, categoryId) {
  return 'assets/images/logo.png';
}

// Expose functions to global window for HTML inline events
window.openAddProductModal = openAddProductModal;
window.openEditProductModal = openEditProductModal;
window.handleSaveProduct = handleSaveProduct;
window.confirmDeleteProduct = confirmDeleteProduct;
window.quickEditPrice = quickEditPrice;
window.toggleProductField = toggleProductField;
window.addPriceInputRow = addPriceInputRow;

window.openAddCategoryModal = openAddCategoryModal;
window.openEditCategoryModal = openEditCategoryModal;
window.handleSaveCategory = handleSaveCategory;
window.confirmDeleteCategory = confirmDeleteCategory;

window.openAddOfferModal = openAddOfferModal;
window.openEditOfferModal = openEditOfferModal;
window.handleSaveOffer = handleSaveOffer;
window.confirmDeleteOffer = confirmDeleteOffer;
window.toggleOfferActive = toggleOfferActive;

window.saveApiUrlSetting = saveApiUrlSetting;
window.handleBulkSeedFromJson = handleBulkSeedFromJson;
window.exportDatabaseToJson = exportDatabaseToJson;
window.loadData = loadData;
window.closeModal = closeModal;
window.changePage = changePage;
