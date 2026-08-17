/**
 * =========================================================================
 * BREAK OUT CAFE - Configuration & API Client
 * =========================================================================
 */

const CONFIG = {
  // الرابط الافتراضي للـ Web App من Google Apps Script
  DEFAULT_API_URL: 'https://script.google.com/macros/s/AKfycbwBDwSFafldzIjuxzkZ-yRftTs6iRF1io0kbWSBB2iVAT6uDGXPGw1xqPRcFi3b8_Dviw/exec',
  
  // مفاتيح التخزين المحلي (LocalStorage)
  STORAGE_KEYS: {
    API_URL: 'breakout_api_url',
    MENU_CACHE: 'breakout_menu_cache',
    MENU_CACHE_TIME: 'breakout_menu_cache_time',
    OFFERS_CACHE: 'breakout_offers_cache',
    OFFERS_CACHE_TIME: 'breakout_offers_cache_time',
    ADMIN_AUTH: 'breakout_admin_auth'
  },
  
  // مدة صلاحية الكاش (3 دقائق في واجهة العميل)
  CACHE_TTL: 3 * 60 * 1000,

  // جلب رابط الـ API النشط
  getApiUrl() {
    return localStorage.getItem(this.STORAGE_KEYS.API_URL) || this.DEFAULT_API_URL;
  },

  // تعيين رابط جديد للـ API
  setApiUrl(url) {
    if (!url || typeof url !== 'string') return;
    localStorage.setItem(this.STORAGE_KEYS.API_URL, url.trim());
  },

  // إعادة ضبط الرابط للافتراضي
  resetApiUrl() {
    localStorage.removeItem(this.STORAGE_KEYS.API_URL);
  }
};

// ─── API Client Service ──────────────────────────────────────────
const ApiClient = {
  /**
   * جلب بيانات المنيو كاملة مع الكاش
   */
  async getMenu(forceRefresh = false) {
    const cachedData = localStorage.getItem(CONFIG.STORAGE_KEYS.MENU_CACHE);
    const cachedTime = localStorage.getItem(CONFIG.STORAGE_KEYS.MENU_CACHE_TIME);
    const now = Date.now();

    // استخدام الكاش إذا كان صالحاً ولم يُطلب تحديث قسري
    if (!forceRefresh && cachedData && cachedTime && (now - parseInt(cachedTime, 10)) < CONFIG.CACHE_TTL) {
      try {
        return JSON.parse(cachedData);
      } catch (e) {
        console.warn('Error parsing cached menu, fetching fresh:', e);
      }
    }

    const url = `${CONFIG.getApiUrl()}?action=getMenu&t=${now}`;
    
    try {
      const response = await fetch(url, { method: 'GET', cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();

      if (result.success && result.data) {
        // حفظ في الكاش
        localStorage.setItem(CONFIG.STORAGE_KEYS.MENU_CACHE, JSON.stringify(result.data));
        localStorage.setItem(CONFIG.STORAGE_KEYS.MENU_CACHE_TIME, String(now));
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch menu data');
      }
    } catch (err) {
      console.warn('⚠️ Google Sheets API fetch failed, trying local fallback:', err);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      // السقوط الآمن على menu.json الثابت
      const fallbackResponse = await fetch('assets/data/menu.json');
      return await fallbackResponse.json();
    }
  },

  /**
   * إرسال طلب تعديل / إضافة / حذف عبر POST
   */
  async sendAction(action, payload = null, id = null, extra = {}) {
    const url = CONFIG.getApiUrl();
    const body = {
      action: action,
      payload: payload,
      id: id,
      ...extra
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // لتجنب قيود CORS في Google Apps Script
        },
        body: JSON.stringify(body)
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        result = { success: true, raw: text };
      }

      // إبطال كاش المنيو عند أي تعديل
      localStorage.removeItem(CONFIG.STORAGE_KEYS.MENU_CACHE);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.MENU_CACHE_TIME);

      return result;
    } catch (err) {
      console.error(`❌ Action ${action} failed:`, err);
      throw err;
    }
  },

  // 1. إدارة المنتجات
  async saveProduct(productData) {
    return this.sendAction('saveProduct', productData);
  },

  async deleteProduct(productId) {
    return this.sendAction('deleteProduct', null, productId);
  },

  async updatePrice(productId, prices) {
    return this.sendAction('updatePrice', null, productId, { prices: prices });
  },

  // 2. إدارة الفئات
  async saveCategory(categoryData) {
    return this.sendAction('saveCategory', categoryData);
  },

  async deleteCategory(categoryId) {
    return this.sendAction('deleteCategory', null, categoryId);
  },

  // 3. إدارة العروض
  async saveOffer(offerData) {
    return this.sendAction('saveOffer', offerData);
  },

  async deleteOffer(offerId) {
    return this.sendAction('deleteOffer', null, offerId);
  },

  // 4. استيراد وتغذية البيانات دفعة واحدة (Seeding)
  async seedAll(fullMenuData) {
    return this.sendAction('seedAll', fullMenuData);
  }
};

window.CONFIG = CONFIG;
window.ApiClient = ApiClient;
