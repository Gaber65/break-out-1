// ------------------- Global State -------------------
let menuData = {

};
let categories = [];
let currentDrinksView = "main";
let cart = [];
let checkoutType = "pickup";
let selectedArea = " ";
let deliveryAreas = []; // Will be loaded from JSON
let PRODUCT_EXTRAS = [];
const WHATSAPP_NUMBER = "201093027040";
const CART_STORAGE_KEY = "spaccaCart";
const OPEN_MINUTES = 9 * 60;
const CLOSE_MINUTES = 3 * 60 + 30;
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby0rFKMPrE6oHezVT-a5X8gl1ctvlERsZtZ6vEhs4UrwnNvu_SgLl3bvV2YIVijZxbf_g/exec";
// ------------------- Utility Functions -------------------
function escapeHtml(str) {
    return String(str || "").replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function formatPrice(price) {
    return `${Number(price || 0).toLocaleString("ar-EG")} جنيه`;
}

function getCurrentMinutes(date = new Date()) {
    return date.getHours() * 60 + date.getMinutes();
}

function isRestaurantOpen(date = new Date()) {
    const minutes = getCurrentMinutes(date);
    return minutes >= OPEN_MINUTES || minutes < CLOSE_MINUTES;
}

function showClosedModal() {
    const modal = document.getElementById("closedModal");
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

window.closeClosedModal = function () {
    const modal = document.getElementById("closedModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
};

function updateWorkingHoursStatus() {
    const badge = document.getElementById("restaurantStatusBadge");
    if (!badge) return;

    if (isRestaurantOpen()) {
        badge.textContent = "مفتوح الآن";
        badge.className = "inline-flex w-fit items-center rounded-full bg-green-100 px-4 py-1 font-semibold text-green-700";
    } else {
        badge.textContent = "مغلق حاليًا - نفتح الساعة 9:00 صباحًا";
        badge.className = "inline-flex w-fit items-center rounded-full bg-red-100 px-4 py-1 font-semibold text-red-700";
    }
}

function guardWorkingHours() {
    updateWorkingHoursStatus();
    if (isRestaurantOpen()) return true;
    showClosedModal();
    return false;
}

function encodeProduct(item) {
    return encodeURIComponent(JSON.stringify({
        id: `${item.name}-${item.price}-${item.image}`,
        name: item.name,
        price: Number(item.price) || 0,
        image: item.image || "./assets/img.png"
    }));
}

// ------------------- Data Loading -------------------
async function loadDeliveryAreas() {
    try {
        const response = await fetch("data/delivery-areas.json");
        const data = await response.json();
        deliveryAreas = data.areas;
        renderDeliveryAreasSelect();
    } catch (error) {
        console.error("خطأ في تحميل مناطق التوصيل:", error);
        // Fallback default areas if JSON fails to load
        deliveryAreas = [
            { area: "الأماكن بجوار المطعم", fee: 15 },
            { area: "شرق النيل", fee: 25 },
            { area: "صلاح سالم", fee: 30 }
        ];
        renderDeliveryAreasSelect();
    }
}

async function loadData() {
    loadCart();
    await loadDeliveryAreas();
    await loadExtras();
    updateCartCount();
    updateWorkingHoursStatus();
    setInterval(updateWorkingHoursStatus, 60000);
    try {
        const response = await fetch("data/data.json");
        const data = await response.json();
        menuData = data.menu;
        categories = Object.keys(menuData).map(key => ({
            id: key,
            name: menuData[key].title,
            img: menuData[key].image
        }));
        renderCategories();
        renderQuickLinks();
    } catch (error) {
        console.error("خطأ في تحميل ملف JSON:", error);
    }
}

// ------------------- Render Functions -------------------
function renderCategories() {
    const container = document.getElementById("categories-grid");
    if (!container) return;
    container.innerHTML = "";
    categories.forEach(cat => {
        container.innerHTML += `
            <div onclick="window.openCategory('${cat.id}')"
                class="category-card bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer border border-gray-100">
                <img src="${cat.img}" alt="${escapeHtml(cat.name)}" class="w-full h-48 object-cover">
                <div class="p-5 text-center">
                    <span class="text-xl font-semibold text-gray-800">${cat.name}</span>
                </div>
            </div>
        `;
    });
}

function renderQuickLinks() {
    const container = document.getElementById("quickLinksContainer");
    if (!container) return;
    container.innerHTML = "";
    categories.forEach(cat => {
        container.innerHTML += `<a href="#" onclick="window.openCategory('${cat.id}'); return false;" class="hover:text-red-400">${cat.name}</a>`;
    });
}

function isProductInCart(productId) {
    return cart.some(item => item.id === productId);
}

function renderProductCard(item) {
    const encoded = encodeProduct(item);
    const hasPrice = Number(item.price) > 0;

    const productId = `${item.name}-${item.price}-${item.image}`;
    const inCart = isProductInCart(productId);

    return `
        <div class="product-card relative bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">

            ${inCart
            ? `
                <div class="absolute top-3 left-3 z-10 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <i class="fas fa-check"></i>
                    بالسلة
                </div>
                `
            : ""
        }

            <img src="${item.image}" alt="${escapeHtml(item.name)}" class="w-full h-48 object-cover">

            <div class="p-5">
                <h4 class="font-semibold text-xl">${item.name}</h4>

                <p class="text-sm text-gray-500 mt-2">
                    ${item.description || ""}
                </p>

                ${hasPrice
            ? `
                    <span class="block text-red-600 font-bold text-2xl mt-3">
                        ${formatPrice(item.price)}
                    </span>
                    `
            : ""
        }

                ${hasPrice
            ? inCart
                ? `
                        <div class="mt-4 grid grid-cols-2 gap-2">
                            <button
                                onclick="window.addToCartFromEncoded('${encoded}')"
                                class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                                <i class="fas fa-plus"></i>
                                زود
                            </button>

                            <button
                                onclick="window.removeProductFromProductView('${encodeURIComponent(productId)}')"
                                class="w-full bg-gray-900 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                                <i class="fas fa-trash"></i>
                                إزالة
                            </button>
                        </div>
                        `
                : `
                        <button
                            onclick="window.addToCartFromEncoded('${encoded}')"
                            class="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                            <i class="fas fa-cart-plus"></i>
                            أضف للسلة
                        </button>
                        `
            : `
                    <button
                        disabled
                        class="mt-4 w-full bg-gray-300 cursor-not-allowed text-white py-3 rounded-xl font-semibold">
                        غير متاح
                    </button>
                    `
        }
            </div>
        </div>
    `;
}
function renderDeliveryAreasSelect(filteredAreas = deliveryAreas) {
    const list = document.getElementById("deliveryAreaList");
    const input = document.getElementById("deliveryAreaSearch");

    if (!list) return;

    if (!filteredAreas.length) {
        list.innerHTML = `
            <div class="p-4 text-center text-sm text-gray-500">
                لا توجد منطقة بهذا الاسم
            </div>
        `;
        return;
    }

    list.innerHTML = filteredAreas.map(({ area, fee }) => `
        <button
            type="button"
            onclick="window.selectDeliveryArea('${escapeHtml(area)}')"
            class="flex w-full items-center justify-between px-4 py-3 text-right hover:bg-red-50"
        >
            <span class="font-semibold text-gray-800">${area}</span>
            <span class="text-sm font-bold text-red-600">${fee} جنيه</span>
        </button>
    `).join("");

    if (input && selectedArea) {
        const selected = deliveryAreas.find(a => a.area === selectedArea);
        input.value = selected ? `${selected.area} - ${selected.fee} جنيه` : "";
    }
}

window.filterDeliveryAreas = function (value) {
    const keyword = value.trim().toLowerCase();
    const list = document.getElementById("deliveryAreaList");

    if (list) {
        list.classList.remove("hidden");
    }

    const filtered = deliveryAreas.filter(item =>
        item.area.toLowerCase().includes(keyword)
    );

    renderDeliveryAreasSelect(filtered);
};

window.showDeliveryAreasList = function () {
    const list = document.getElementById("deliveryAreaList");
    if (!list) return;

    list.classList.remove("hidden");
    renderDeliveryAreasSelect();
};

window.selectDeliveryArea = function (area) {
    selectedArea = area;

    const selected = deliveryAreas.find(a => a.area === area);
    const input = document.getElementById("deliveryAreaSearch");
    const hidden = document.getElementById("deliveryAreaSelect");
    const list = document.getElementById("deliveryAreaList");

    if (input && selected) {
        input.value = `${selected.area} - ${selected.fee} جنيه`;
    }

    if (hidden) {
        hidden.value = area;
    }

    if (list) {
        list.classList.add("hidden");
    }

    renderCart();
};

document.addEventListener("click", function (event) {
    const wrapper = event.target.closest("#deliveryFields");
    const list = document.getElementById("deliveryAreaList");

    if (!wrapper && list) {
        list.classList.add("hidden");
    }
});
// ------------------- Category Navigation -------------------
window.openCategory = function (id) {
    if (id === "drinks") {
        openDrinks();
        return;
    }
    const data = menuData[id];
    if (!data) return;
    document.getElementById("modalTitle").innerHTML = `<span class="text-3xl">${data.title}</span> `;
    document.getElementById("productsContainer").innerHTML = data.items.map(renderProductCard).join("");
    showModal();
};

function openDrinks() {
    const drinks = menuData.drinks;
    if (!drinks) return;
    currentDrinksView = "main";
    document.getElementById("modalTitle").innerHTML = `<span class="text-3xl">${drinks.title}</span>`;
    document.getElementById("productsContainer").innerHTML = drinks.categories.map(cat => `
        <div onclick="window.openDrinkCategory('${cat.id}')"
            class="product-card bg-white border rounded-3xl p-6 cursor-pointer hover:shadow-lg text-center">
            <h3 class="text-xl font-bold">${cat.title}</h3>
        </div>
    `).join("");
    showModal();
}

window.openDrinkCategory = function (id) {
    const drinks = menuData.drinks;
    const category = drinks.categories.find(c => c.id === id);
    if (!category) return;
    document.getElementById("modalTitle").innerHTML = `
        <div class="flex items-center gap-3">
            <button onclick="openDrinks()" class="bg-gray-200 px-4 py-2 rounded-xl">رجوع</button>
            <span class="text-3xl">${category.title}</span>
        </div>
    `;
    document.getElementById("productsContainer").innerHTML = category.items.map(renderProductCard).join("");
    showModal();
};

// ------------------- Modal Controls -------------------
function showModal() {
    const modal = document.getElementById("productModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

window.closeModal = function () {
    const modal = document.getElementById("productModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
};

// ------------------- Cart Functions -------------------
function loadCart() {
    try {
        cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        cart = cart.map(item => ({
            ...item,
            note: item.note || "",
            extras: Array.isArray(item.extras) ? item.extras : []
        }));
    } catch (e) {
        cart = [];
    }
}
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}

window.addToCartFromEncoded = function (encoded) {
    addToCart(JSON.parse(decodeURIComponent(encoded)));
};

function addToCart(product) {
    if (!guardWorkingHours()) return;
    if (!product.price) return;

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            note: "",
            extras: []
        });
    }

    saveCart();
    renderCart();
    renderProductsAfterCartUpdate();

    const searchInput = document.getElementById("menuSearchInput");
    if (searchInput && searchInput.value.trim()) {
        window.searchMenu(searchInput.value);
    }
}
function renderProductsAfterCartUpdate() {
    const modal = document.getElementById("productsContainer");
    if (!modal) return;

    const title = document.getElementById("modalTitle")?.textContent || "";

    Object.keys(menuData).forEach(key => {
        const data = menuData[key];

        if (title.includes(data.title)) {
            modal.innerHTML = data.items.map(renderProductCard).join("");
        }
    });
}

function changeQuantity(productId, delta) {
    const item = cart.find(p => p.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== productId);
    }

    saveCart();
    renderCart();
    renderProductsAfterCartUpdate();

    const searchInput = document.getElementById("menuSearchInput");
    if (searchInput && searchInput.value.trim()) {
        window.searchMenu(searchInput.value);
    }
}
window.removeProductFromProductView = function (encodedId) {
    const productId = decodeURIComponent(encodedId);

    cart = cart.filter(item => item.id !== productId);

    saveCart();
    renderCart();
    renderProductsAfterCartUpdate();

    const searchInput = document.getElementById("menuSearchInput");
    if (searchInput && searchInput.value.trim()) {
        window.searchMenu(searchInput.value);
    }
};
window.changeQuantityFromEncoded = function (encodedId, delta) {
    changeQuantity(decodeURIComponent(encodedId), delta);
};

window.updateCartItemNote = function (encodedId, note) {
    const productId = decodeURIComponent(encodedId);
    const item = cart.find(p => p.id === productId);
    if (!item) return;
    item.note = note;
    saveCart();
};

function updateCartCount() {
    const count = cart.reduce((s, i) => s + i.quantity, 0);

    const mainCount = document.getElementById("cartCount");
    const modalCount = document.getElementById("cartCountModal");

    if (mainCount) mainCount.textContent = count;
    if (modalCount) modalCount.textContent = count;
}

function getItemExtrasTotal(item) {
    return (item.extras || []).reduce((sum, extra) => {
        return sum + (Number(extra.price) || 0);
    }, 0);
}

function getItemTotal(item) {
    return (Number(item.price) + getItemExtrasTotal(item)) * item.quantity;
}

function getSubtotal() {
    return cart.reduce((sum, item) => sum + getItemTotal(item), 0);
}

function getDeliveryFee() {
    if (checkoutType !== "delivery" || !selectedArea) return 0;
    const area = deliveryAreas.find(a => a.area === selectedArea);
    return area ? area.fee : 0;
}

window.setCheckoutType = function (type) {
    checkoutType = type;
    if (type === "pickup") selectedArea = "";
    renderCart();
};

window.setDeliveryArea = function (area) {
    selectedArea = area;
    renderCart();
};

window.openCart = function () {
    if (!guardWorkingHours()) return;
    renderCart();
    const modal = document.getElementById("cartModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
};

window.closeCart = function () {
    const modal = document.getElementById("cartModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
};

window.toggleCartItemExtra = function (encodedId, extraName, extraPrice, checked) {
    const productId = decodeURIComponent(encodedId);
    const item = cart.find(p => p.id === productId);
    if (!item) return;

    if (!Array.isArray(item.extras)) {
        item.extras = [];
    }

    if (checked) {
        const exists = item.extras.some(extra => extra.name === extraName);
        if (!exists) {
            item.extras.push({
                name: extraName,
                price: Number(extraPrice) || 0
            });
        }
    } else {
        item.extras = item.extras.filter(extra => extra.name !== extraName);
    }

    saveCart();
    renderCart();
};
function renderCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    const emptyDiv = document.getElementById("emptyCart");
    const checkoutDiv = document.getElementById("cartCheckout");
    const subtotalEl = document.getElementById("cartSubtotal");
    const deliveryEl = document.getElementById("cartDelivery");
    const totalEl = document.getElementById("cartTotal");
    const pickupFields = document.getElementById("pickupFields");
    const deliveryFields = document.getElementById("deliveryFields");
    const pickupBtn = document.getElementById("pickupBtn");
    const deliveryBtn = document.getElementById("deliveryBtn");
    const delSelect = document.getElementById("deliveryAreaSelect");

    if (!cartItemsDiv) return;

    const isEmpty = cart.length === 0;

    emptyDiv.classList.toggle("hidden", !isEmpty);
    checkoutDiv.classList.toggle("hidden", isEmpty);

    cartItemsDiv.innerHTML = cart.map(item => {
        const encodedId = encodeURIComponent(item.id);
        const itemTotal = getItemTotal(item);
        const extrasTotal = getItemExtrasTotal(item);

        const extrasHtml = PRODUCT_EXTRAS.map(extra => {
            const checked = (item.extras || []).some(e => e.name === extra.name);

            return `
                <label class="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <span class="flex items-center gap-2">
                        <input type="checkbox"
                            ${checked ? "checked" : ""}
                            onchange="window.toggleCartItemExtra('${encodedId}', '${escapeHtml(extra.name)}', ${extra.price}, this.checked)"
                            class="h-4 w-4 accent-red-600">
                        <span>${extra.name}</span>
                    </span>
                    <strong class="text-red-600">${formatPrice(extra.price)}</strong>
                </label>
            `;
        }).join("");

        const selectedExtrasText = (item.extras || []).length
            ? item.extras.map(e => `${e.name} +${e.price} جنيه`).join("، ")
            : "";

        const extrasButtonText = (item.extras || []).length
            ? `تعديل الإضافات (${item.extras.length})`
            : "إضافة إضافات";

        return `
            <div class="rounded-2xl border bg-white p-3 shadow-sm">
                <div class="flex gap-4">
                    <img src="${item.image}" class="h-20 w-20 rounded-xl object-cover" alt="${escapeHtml(item.name)}">

                    <div class="flex-1">
                        <div class="flex justify-between gap-3">
                            <h4 class="font-semibold">${item.name}</h4>

                            <div class="text-left">
                                <div class="text-sm font-bold text-red-600">
                                    ${formatPrice(item.price)}
                                </div>

                                ${extrasTotal > 0
                ? `
                                        <div class="mt-1 text-xs text-gray-500">
                                            إضافات: +${formatPrice(extrasTotal)}
                                        </div>
                                        `
                : ""
            }
                            </div>
                        </div>

                        <div class="mt-3 flex justify-between items-center">
                            <div class="flex gap-2 bg-gray-100 p-1 rounded-full">
                                <button onclick="window.changeQuantityFromEncoded('${encodedId}', -1)" class="h-8 w-8 rounded-full bg-white text-red-600">
                                    <i class="fas fa-minus text-xs"></i>
                                </button>

                                <span class="w-8 text-center font-bold">${item.quantity}</span>

                                <button onclick="window.changeQuantityFromEncoded('${encodedId}', 1)" class="h-8 w-8 rounded-full bg-red-600 text-white">
                                    <i class="fas fa-plus text-xs"></i>
                                </button>
                            </div>

                            <span class="font-semibold">${formatPrice(itemTotal)}</span>
                        </div>
                    </div>
                </div>

                <label class="mt-3 block text-sm font-semibold text-gray-700">
                    ملاحظة خاصة بالمنتج
                </label>

                <textarea rows="2"
                    oninput="window.updateCartItemNote('${encodedId}', this.value)"
                    class="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-red-500 focus:bg-white"
                    placeholder="مثال: بدون بصل، صوص زيادة، بدون جبنة">${escapeHtml(item.note || "")}</textarea>

                <div class="mt-4">
                    <button type="button"
                        onclick="this.nextElementSibling.classList.toggle('hidden')"
                        class="w-full rounded-2xl bg-red-50 px-4 py-3 text-right font-bold text-red-600">
                        ${extrasButtonText}
                        ${selectedExtrasText
                ? `<span class="block mt-1 text-xs text-gray-600 font-medium">${selectedExtrasText}</span>`
                : ""
            }
                    </button>

                    <div class="mt-3 grid grid-cols-1 gap-2 hidden">
                        ${extrasHtml || `<p class="text-sm text-gray-500">لا توجد إضافات متاحة</p>`}
                    </div>
                </div>
            </div>
        `;
    }).join("");

    pickupFields.classList.toggle("hidden", checkoutType !== "pickup");
    deliveryFields.classList.toggle("hidden", checkoutType !== "delivery");

    if (pickupBtn) {
        pickupBtn.className = `flex-1 rounded-xl px-4 py-3 font-semibold ${checkoutType === "pickup"
            ? "bg-red-600 text-white"
            : "bg-gray-100 text-gray-700"
            }`;
    }

    if (deliveryBtn) {
        deliveryBtn.className = `flex-1 rounded-xl px-4 py-3 font-semibold ${checkoutType === "delivery"
            ? "bg-red-600 text-white"
            : "bg-gray-100 text-gray-700"
            }`;
    }

    if (delSelect) delSelect.value = selectedArea;

    const areaInput = document.getElementById("deliveryAreaSearch");

    if (areaInput) {
        const selected = deliveryAreas.find(a => a.area === selectedArea);
        areaInput.value = selected ? `${selected.area} - ${selected.fee} جنيه` : "";
    }

    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();

    subtotalEl.textContent = formatPrice(subtotal);
    deliveryEl.textContent = checkoutType === "pickup" ? "٠ جنيه" : formatPrice(deliveryFee);
    totalEl.textContent = formatPrice(subtotal + deliveryFee);
}
// ------------------- WhatsApp Order -------------------
function buildWhatsAppMessage(notes, phone, customerName) {
    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = subtotal + deliveryFee;
    const typeText = checkoutType === "delivery" ? "توصيل للمنزل" : "استلام من الفرع";

    const orderLines = cart.map(item => {
        const lines = [
            `• ${item.name} × ${item.quantity} = ${getItemTotal(item)} جنيه`
        ];

        if ((item.extras || []).length) {
            lines.push("الإضافات:");
            item.extras.forEach(extra => {
                lines.push(`  - ${extra.name} = ${extra.price} جنيه`);
            });
        }

        const itemNote = item.note?.trim();

        if (itemNote) {
            lines.push(`ملاحظة على ${item.name}: ${itemNote}`);
        }

        return lines.join("\n");
    });

    const message = [
        "طلب جديد من سباكا:",
        "",
        "بيانات العميل:",
        `اسم العميل: ${customerName || "غير مسجل"}`,
        `رقم الهاتف: ${phone || "غير مسجل"}`,
        "",
        ...orderLines,
        "",
        `المجموع الفرعي: ${subtotal} جنيه`,
        `رسوم التوصيل: ${deliveryFee} جنيه`,
        `الإجمالي: ${total} جنيه`,
        "",
        `نوع الطلب: ${typeText}`,
        checkoutType === "delivery" ? `المنطقة: ${selectedArea}` : "استلام من الفرع"
    ];

    if (notes?.trim()) {
        message.push("", "ملاحظات العميل:", notes.trim());
    }

    return message.join("\n");
}

window.sendOrder = function () {
    const errEl = document.getElementById("cartError");
    const notes = checkoutType === "delivery"
        ? document.getElementById("customerNotesDelivery")?.value.trim()
        : document.getElementById("customerNotes")?.value.trim();

    if (cart.length === 0) {
        errEl.textContent = "أضف منتج واحد على الأقل للسلة.";
        return;
    }
    if (checkoutType === "delivery" && !selectedArea) {
        errEl.textContent = "اختر منطقة التوصيل.";
        return;
    }

    const message = buildWhatsAppMessage(notes || "");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
};


window.sendOrder = function () {
    const errEl = document.getElementById("cartError");
    const notes = checkoutType === "delivery"
        ? document.getElementById("customerNotesDelivery")?.value.trim()
        : document.getElementById("customerNotes")?.value.trim();

    if (!guardWorkingHours()) return;

    if (cart.length === 0) {
        errEl.textContent = "أضف منتج واحد على الأقل للسلة.";
        return;
    }
    if (checkoutType === "delivery" && !selectedArea) {
        errEl.textContent = "اختر منطقة التوصيل.";
        return;
    }

    const phone = document.getElementById("customerPhoneInput")?.value.trim();
    const message = buildWhatsAppMessage(notes || "", phone);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
};

document.addEventListener("click", function (event) {
    const link = event.target.closest("a[href*='wa.me'], a[href*='whatsapp.com']");
    if (!link) return;
    if (guardWorkingHours()) return;
    event.preventDefault();
});

window.isRestaurantOpen = isRestaurantOpen;

// ------------------- Mobile Menu -------------------
window.toggleMobileMenu = function () {
    const menu = document.getElementById("mobileMenu");
    if (menu) menu.classList.toggle("hidden");
};

// ------------------- Initialize -------------------
window.openDrinks = openDrinks;
window.openDrinkCategory = window.openDrinkCategory;
function getAllProductsForSearch() {
    const products = [];

    Object.keys(menuData).forEach(categoryKey => {
        const category = menuData[categoryKey];

        if (!category) return;

        if (categoryKey === "drinks" && Array.isArray(category.categories)) {
            category.categories.forEach(drinkCat => {
                drinkCat.items.forEach(item => {
                    products.push({
                        ...item,
                        categoryTitle: drinkCat.title
                    });
                });
            });
        } else if (Array.isArray(category.items)) {
            category.items.forEach(item => {
                products.push({
                    ...item,
                    categoryTitle: category.title
                });
            });
        }
    });

    return products;
}

window.searchMenu = function (value) {
    const resultsContainer = document.getElementById("menuSearchResults");
    const categoriesGrid = document.getElementById("categories-grid");

    if (!resultsContainer || !categoriesGrid) return;

    const keyword = value.trim().toLowerCase();

    if (!keyword) {
        resultsContainer.innerHTML = "";
        categoriesGrid.classList.remove("hidden");
        return;
    }

    categoriesGrid.classList.add("hidden");

    const results = getAllProductsForSearch().filter(item => {
        const name = String(item.name || "").toLowerCase();
        const desc = String(item.description || "").toLowerCase();
        const category = String(item.categoryTitle || "").toLowerCase();

        return (
            name.includes(keyword) ||
            desc.includes(keyword) ||
            category.includes(keyword)
        );
    });

    if (!results.length) {
        resultsContainer.innerHTML = `
            <div class="col-span-full rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                <i class="fas fa-search text-3xl text-gray-400"></i>
                <p class="mt-3 text-lg font-semibold">لا توجد نتائج مطابقة</p>
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = results.map(item => `
        <div class="relative">
            <div class="absolute top-3 right-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-red-600 shadow">
                ${item.categoryTitle}
            </div>
            ${renderProductCard(item)}
        </div>
    `).join("");
};
window.requestPhoneBeforeOrder = function () {
    const errEl = document.getElementById("cartError");
    if (!guardWorkingHours()) return;
    if (cart.length === 0) { errEl.textContent = "أضف منتج واحد على الأقل للسلة."; return; }
    if (checkoutType === "delivery" && !selectedArea) { errEl.textContent = "اختر منطقة التوصيل."; return; }
    const notes = checkoutType === "delivery" ? document.getElementById("customerNotesDelivery")?.value.trim() : document.getElementById("customerNotes")?.value.trim();
    pendingOrderData = { notes: notes || "" };
    const phoneModal = document.getElementById("phoneModal");
    if (phoneModal) {
        document.getElementById("customerNameInput").value = "";
        document.getElementById("customerPhoneInput").value = "";
        document.getElementById("phoneErrorMsg").classList.add("hidden");
        phoneModal.classList.remove("hidden");
        phoneModal.classList.add("flex");
    }
};
window.closePhoneModal = closePhoneModal;
function closePhoneModal(cancel = true) {
    const modal = document.getElementById("phoneModal");
    if (modal) { modal.classList.add("hidden"); modal.classList.remove("flex"); }
    if (cancel) pendingOrderData = null;
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\s/g, '');
    const phoneRegex = /^(\+20|0)?[0-9]{10,12}$/;
    return phoneRegex.test(cleaned);
}

function formatPhoneForWhatsApp(phone) {
    let cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('0')) cleaned = '20' + cleaned.substring(1);
    else if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
    return cleaned;
}
function getProductsTextForSheet() {

    return cart.map(item => {

        const extrasText = (item.extras || []).length
            ? " | إضافات: " + item.extras.map(e => `${e.name} +${e.price}`).join("، ")
            : "";

        const noteText = item.note?.trim()
            ? ` | ملاحظة: ${item.note.trim()}`
            : "";

        return `${item.name} × ${item.quantity} = ${getItemTotal(item)} جنيه${extrasText}${noteText}`;

    }).join("\n");
}

function saveOrderToGoogleSheet(orderData) {

    fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    }).catch(error => {

        console.error("Google Sheet Error:", error);

    });

}
window.confirmPhoneAndSend = function () {
    const nameInput = document.getElementById("customerNameInput");
    const phoneInput = document.getElementById("customerPhoneInput");
    const phoneError = document.getElementById("phoneErrorMsg");

    const customerName = nameInput.value.trim();
    let rawPhone = phoneInput.value.trim();

    if (!customerName) {
        phoneError.textContent = "يرجى إدخال اسم العميل";
        phoneError.classList.remove("hidden");
        nameInput.classList.add("shake-animation");
        setTimeout(() => nameInput.classList.remove("shake-animation"), 400);
        return;
    }

    if (!rawPhone) {
        phoneError.textContent = "يرجى إدخال رقم الهاتف";
        phoneError.classList.remove("hidden");
        phoneInput.classList.add("shake-animation");
        setTimeout(() => phoneInput.classList.remove("shake-animation"), 400);
        return;
    }

    if (!validatePhone(rawPhone)) {
        phoneError.textContent = "رقم غير صالح (مثال: 01012345678 أو 201012345678)";
        phoneError.classList.remove("hidden");
        phoneInput.classList.add("shake-animation");
        setTimeout(() => phoneInput.classList.remove("shake-animation"), 400);
        return;
    }

    phoneError.classList.add("hidden");

    const notes = pendingOrderData ? pendingOrderData.notes : "";
    const message = buildWhatsAppMessage(notes, rawPhone, customerName);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    saveOrderToGoogleSheet({

        customerName: customerName,

        phone: rawPhone,

        checkoutType:
            checkoutType === "delivery"
                ? "توصيل للمنزل"
                : "استلام من الفرع",

        area:
            checkoutType === "delivery"
                ? selectedArea
                : "استلام من الفرع",

        products: getProductsTextForSheet(),

        notes: notes || "",

        total: getSubtotal() + getDeliveryFee(),

        message: message

    });
    closePhoneModal(false);
    pendingOrderData = null;
    window.open(url, "_blank");
};
window.requestPhoneBeforeOrder = window.requestPhoneBeforeOrder;
async function loadExtras() {
    try {
        const response = await fetch("data/extras.json");
        const data = await response.json();

        PRODUCT_EXTRAS = Array.isArray(data.extras)
            ? data.extras
            : [];

    } catch (error) {
        console.error("خطأ في تحميل الإضافات:", error);
        PRODUCT_EXTRAS = [];
    }
}


loadData();
