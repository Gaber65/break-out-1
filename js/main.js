(function () {
    const menuItems = [
        {
            name: "Spanish Latte",
            category: "signature",
            price: 85,
            rating: 4.9,
            badge: "Popular",
            image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80",
            description: "Creamy espresso, chilled milk, and caramel depth with a polished reserve finish."
        },
        {
            name: "Flat White",
            category: "hot",
            price: 75,
            rating: 4.8,
            badge: "Barista Pick",
            image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=700&q=80",
            description: "Velvety microfoam over double espresso for a smooth, focused cup."
        },
        {
            name: "Cappuccino",
            category: "hot",
            price: 80,
            rating: 4.8,
            badge: "Classic",
            image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=700&q=80",
            description: "Bold espresso, airy foam, cocoa dust, and a clean coffee finish."
        },
        {
            name: "Ice Mocha",
            category: "cold",
            price: 95,
            rating: 4.9,
            badge: "Popular",
            image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",
            description: "Cold espresso with dark chocolate, milk, and a soft cream top."
        },
        {
            name: "Caramel Frappe",
            category: "frappe",
            price: 105,
            rating: 4.7,
            badge: "New",
            image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
            description: "Blended coffee, caramel ribbon, whipped cream, and a chilled dessert texture."
        },
        {
            name: "Chocolate Cake",
            category: "dessert",
            price: 75,
            rating: 4.8,
            badge: "Sweet",
            image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=700&q=80",
            description: "Deep cocoa layers with a soft ganache finish for coffee pairing."
        },
        {
            name: "Cheesecake",
            category: "dessert",
            price: 85,
            rating: 4.7,
            badge: "Signature",
            image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80",
            description: "Creamy vanilla cheesecake with a biscuit base and berry lift."
        },
        {
            name: "Cold Brew Tonic",
            category: "cold",
            price: 90,
            rating: 4.6,
            badge: "Fresh",
            image: "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?auto=format&fit=crop&w=700&q=80",
            description: "Slow-steeped coffee, tonic sparkle, citrus, and a bright clean finish."
        },
        {
            name: "Hazelnut Mocha",
            category: "signature",
            price: 100,
            rating: 4.9,
            badge: "New",
            image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=700&q=80",
            description: "Espresso, chocolate, toasted hazelnut, and a silky milk build."
        }
    ];

    const featuredItems = [
        {
            name: "Spanish Latte",
            price: 85,
            image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80",
            description: "The house favorite: glossy, balanced, and made for a slow first sip."
        },
        {
            name: "Ice Mocha",
            price: 95,
            image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
            description: "Chocolate-cold, espresso-rich, and finished with soft cream."
        },
        {
            name: "Cappuccino",
            price: 80,
            image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
            description: "A clean classic with a BREAK OUT foam texture."
        },
        {
            name: "Flat White",
            price: 75,
            image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80",
            description: "Focused espresso flavor with elegant milk balance."
        },
        {
            name: "Chocolate Cake",
            price: 75,
            image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80",
            description: "Dark cocoa layers for late-night coffee pairings."
        },
        {
            name: "Cheesecake",
            price: 85,
            image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
            description: "Creamy, bright, and photogenic from every angle."
        }
    ];

    const testimonials = [
        {
            quote: "The coffee feels premium without becoming stiff. It is my favorite place to work between classes.",
            name: "Mariam Adel",
            role: "Architecture student",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=220&q=80"
        },
        {
            quote: "Great lighting, fast service, and the Spanish Latte is honestly the drink I keep coming back for.",
            name: "Youssef Nabil",
            role: "Freelance designer",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=220&q=80"
        },
        {
            quote: "It has the calm of a lounge and the energy of a cafe. Perfect for meeting friends after work.",
            name: "Nadine Samir",
            role: "Marketing lead",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=220&q=80"
        }
    ];

    const selectors = {
        header: "#siteHeader",
        progress: "#scrollProgressBar",
        menuGrid: "#menuGrid",
        featuredGrid: "#featuredGrid",
        navToggle: "#navToggle",
        primaryNav: "#primaryNav",
        themeToggle: "#themeToggle",
        audioToggle: "#audioToggle",
        backToTop: "#backToTop",
        splash: "#splash",
        testimonialSlider: "#testimonialSlider",
        reservationForm: "#reservationForm",
        newsletterForm: "#newsletterForm"
    };

    const state = {
        activeFilter: "all",
        reviewIndex: 0,
        reviewTimer: null,
        ambience: {
            context: null,
            gain: null,
            noise: null,
            tone: null,
            playing: false
        }
    };

    function qs(selector, parent = document) {
        return parent.querySelector(selector);
    }

    function qsa(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    }

    function renderIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function formatPrice(price) {
        return `${Number(price).toLocaleString("en-US")} EGP`;
    }

    function stars() {
        return Array.from({ length: 5 }, () => "<i data-lucide=\"star\"></i>").join("");
    }

    function renderMenu(filter = "all") {
        const grid = qs(selectors.menuGrid);
        if (!grid) return;

        const items = filter === "all"
            ? menuItems
            : menuItems.filter((item) => item.category === filter);

        grid.innerHTML = items.map((item, index) => `
            <article class="menu-card appear" data-category="${item.category}" style="animation-delay:${index * 45}ms">
                <div class="menu-card__media">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
                </div>
                <div class="menu-card__body">
                    <div class="badge-row">
                        <span class="badge ${item.badge === "New" ? "badge--new" : ""}">${item.badge}</span>
                        <span class="rating"><i data-lucide="star"></i>${item.rating}</span>
                    </div>
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="menu-card__footer">
                        <span class="price">${formatPrice(item.price)}</span>
                        <a class="button button--small button--ghost" href="#reservation">
                            <i data-lucide="plus"></i>
                            <span>Reserve</span>
                        </a>
                    </div>
                </div>
            </article>
        `).join("");

        renderIcons();
        if (window.BreakoutMotion) {
            window.BreakoutMotion.revealElements(qsa("[data-reveal]", grid));
        }
    }

    function renderFeatured() {
        const grid = qs(selectors.featuredGrid);
        if (!grid) return;

        grid.innerHTML = featuredItems.map((item, index) => `
            <article class="product-card appear" style="animation-delay:${index * 60}ms">
                <div class="product-card__media">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
                </div>
                <div class="product-card__body">
                    <div class="badge-row">
                        <span class="badge">Featured</span>
                        <span class="rating">${stars()}</span>
                    </div>
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="menu-card__footer">
                        <span class="price">${formatPrice(item.price)}</span>
                        <a class="button button--small button--gold" href="#reservation">
                            <i data-lucide="shopping-bag"></i>
                            <span>Order Mood</span>
                        </a>
                    </div>
                </div>
            </article>
        `).join("");

        renderIcons();
        initTiltCards();
    }

    function initMenuFilters() {
        qsa(".filter-button").forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter || "all";
                state.activeFilter = filter;

                qsa(".filter-button").forEach((item) => {
                    const isActive = item === button;
                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-selected", String(isActive));
                });

                const grid = qs(selectors.menuGrid);
                if (!grid) return;
                grid.classList.add("is-switching");

                window.setTimeout(() => {
                    renderMenu(filter);
                    grid.classList.remove("is-switching");
                }, 120);
            });
        });
    }

    function initTiltCards() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(pointer: fine)").matches) return;

        qsa(".product-card").forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;
                card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-6px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    function initNavigation() {
        const header = qs(selectors.header);
        const progress = qs(selectors.progress);
        const backToTop = qs(selectors.backToTop);
        const navToggle = qs(selectors.navToggle);
        const nav = qs(selectors.primaryNav);

        function closeMenu() {
            if (!nav || !navToggle) return;
            nav.classList.remove("is-open");
            document.body.classList.remove("menu-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.innerHTML = "<i data-lucide=\"menu\"></i>";
            renderIcons();
        }

        if (navToggle && nav) {
            navToggle.addEventListener("click", () => {
                const isOpen = nav.classList.toggle("is-open");
                document.body.classList.toggle("menu-open", isOpen);
                navToggle.setAttribute("aria-expanded", String(isOpen));
                navToggle.innerHTML = isOpen ? "<i data-lucide=\"x\"></i>" : "<i data-lucide=\"menu\"></i>";
                renderIcons();
            });
        }

        qsa("a[href^=\"#\"]").forEach((link) => {
            link.addEventListener("click", () => closeMenu());
        });

        function onScroll() {
            const scrollTop = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progressValue = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

            if (header) {
                header.classList.toggle("is-scrolled", scrollTop > 18);
            }

            if (progress) {
                progress.style.width = `${Math.min(progressValue, 100)}%`;
            }

            if (backToTop) {
                backToTop.classList.toggle("visible", scrollTop > 620);
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        if (backToTop) {
            backToTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        initActiveSections();
    }

    function initActiveSections() {
        const navLinks = qsa(".nav-link");
        const sections = qsa("main section[id]").filter((section) => {
            return navLinks.some((link) => link.getAttribute("href") === `#${section.id}`);
        });

        if (!sections.length || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visible) return;

            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
            });
        }, {
            threshold: [.22, .4, .6],
            rootMargin: "-22% 0px -56% 0px"
        });

        sections.forEach((section) => observer.observe(section));
    }

    function initTheme() {
        const button = qs(selectors.themeToggle);
        const savedTheme = localStorage.getItem("breakoutTheme");
        const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        const theme = savedTheme || preferred;

        function applyTheme(nextTheme) {
            document.body.dataset.theme = nextTheme;
            localStorage.setItem("breakoutTheme", nextTheme);

            if (button) {
                button.setAttribute("aria-label", nextTheme === "dark" ? "Toggle light mode" : "Toggle dark mode");
                button.innerHTML = nextTheme === "dark" ? "<i data-lucide=\"sun\"></i>" : "<i data-lucide=\"moon\"></i>";
                renderIcons();
            }
        }

        applyTheme(theme);

        if (button) {
            button.addEventListener("click", () => {
                applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
            });
        }
    }

    function initSplash() {
        const splash = qs(selectors.splash);
        if (!splash) return;

        function hideSplash() {
            splash.classList.add("is-hidden");
            document.body.classList.remove("is-loading");
            window.setTimeout(() => splash.remove(), 900);
        }

        const minimumDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 250 : 2400;
        window.setTimeout(hideSplash, minimumDelay);
    }

    function initCountdown() {
        const countdown = qs("#countdown");
        if (!countdown) return;

        const hoursEl = qs("[data-time=\"hours\"]", countdown);
        const minutesEl = qs("[data-time=\"minutes\"]", countdown);
        const secondsEl = qs("[data-time=\"seconds\"]", countdown);

        function nextClosingTime() {
            const now = new Date();
            const target = new Date(now);
            target.setHours(23, 59, 59, 999);
            if (target <= now) {
                target.setDate(target.getDate() + 1);
            }
            return target;
        }

        function pad(value) {
            return String(value).padStart(2, "0");
        }

        function tick() {
            const diff = Math.max(0, nextClosingTime() - new Date());
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            if (hoursEl) hoursEl.textContent = pad(hours);
            if (minutesEl) minutesEl.textContent = pad(minutes);
            if (secondsEl) secondsEl.textContent = pad(seconds);
        }

        tick();
        window.setInterval(tick, 1000);
    }

    function renderTestimonials() {
        const slider = qs(selectors.testimonialSlider);
        if (!slider) return;

        slider.innerHTML = testimonials.map((item, index) => `
            <article class="testimonial-card ${index === 0 ? "active" : ""}" aria-hidden="${index === 0 ? "false" : "true"}">
                <div class="testimonial-rating">${stars()}</div>
                <blockquote>"${item.quote}"</blockquote>
                <p>Rated 5.0 for atmosphere, service, and signature coffee.</p>
                <div class="testimonial-author">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
                    <div>
                        <strong>${item.name}</strong>
                        <span>${item.role}</span>
                    </div>
                </div>
            </article>
        `).join("");

        renderIcons();
    }

    function showReview(index) {
        const cards = qsa(".testimonial-card");
        if (!cards.length) return;

        state.reviewIndex = (index + cards.length) % cards.length;
        cards.forEach((card, cardIndex) => {
            const active = cardIndex === state.reviewIndex;
            card.classList.toggle("active", active);
            card.setAttribute("aria-hidden", String(!active));
        });
    }

    function initReviews() {
        renderTestimonials();

        const prev = qs("#prevReview");
        const next = qs("#nextReview");

        function restartTimer() {
            window.clearInterval(state.reviewTimer);
            state.reviewTimer = window.setInterval(() => showReview(state.reviewIndex + 1), 5200);
        }

        if (prev) {
            prev.addEventListener("click", () => {
                showReview(state.reviewIndex - 1);
                restartTimer();
            });
        }

        if (next) {
            next.addEventListener("click", () => {
                showReview(state.reviewIndex + 1);
                restartTimer();
            });
        }

        restartTimer();
    }

    function initLightbox() {
        const lightbox = qs("#lightbox");
        const image = qs("#lightboxImage");
        const close = qs("#lightboxClose");
        if (!lightbox || !image || !close) return;

        function openLightbox(button) {
            const source = button.dataset.full;
            const preview = qs("img", button);
            image.src = source || preview?.src || "";
            image.alt = preview?.alt || "Gallery image";
            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            close.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
            window.setTimeout(() => {
                image.src = "";
            }, 260);
        }

        qsa(".gallery-item").forEach((button) => {
            button.addEventListener("click", () => openLightbox(button));
        });

        close.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) closeLightbox();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    function initReservationForm() {
        const form = qs(selectors.reservationForm);
        if (!form) return;

        const message = qs("#reservationMessage", form);
        const dateInput = qs("#guestDate", form);

        if (dateInput) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const dd = String(today.getDate()).padStart(2, "0");
            dateInput.min = `${yyyy}-${mm}-${dd}`;
        }

        function setMessage(text, type) {
            if (!message) return;
            message.textContent = text;
            message.className = `form-message ${type || ""}`;
        }

        function validateField(field) {
            const row = field.closest(".form-row");
            let valid = field.checkValidity();

            if (field.type === "tel") {
                valid = /^[+0-9\s-]{8,18}$/.test(field.value.trim());
            }

            row?.classList.toggle("is-invalid", !valid);
            return valid;
        }

        qsa("input, select", form).forEach((field) => {
            field.addEventListener("input", () => validateField(field));
            field.addEventListener("blur", () => validateField(field));
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const fields = qsa("input, select", form);
            const valid = fields.every(validateField);

            if (!valid) {
                setMessage("Please complete all reservation fields correctly.", "error");
                return;
            }

            setMessage("Reservation request received. We will confirm your table shortly.", "success");
            form.classList.add("success-flash");
            window.setTimeout(() => form.classList.remove("success-flash"), 650);
            form.reset();
            if (dateInput) {
                dateInput.dispatchEvent(new Event("input"));
            }
        });
    }

    function initNewsletter() {
        const form = qs(selectors.newsletterForm);
        if (!form) return;

        const input = qs("#newsletterEmail", form);
        const message = qs("#newsletterMessage", form);

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!input || !input.checkValidity()) {
                if (message) {
                    message.textContent = "Enter a valid email to subscribe.";
                    message.style.color = "var(--danger)";
                }
                return;
            }

            if (message) {
                message.textContent = "You are on the list for new specials.";
                message.style.color = "var(--success)";
            }
            form.reset();
        });
    }

    function initAmbience() {
        const button = qs(selectors.audioToggle);
        if (!button) return;

        function createNoiseBuffer(context) {
            const bufferSize = context.sampleRate * 2;
            const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
            const data = buffer.getChannelData(0);

            for (let index = 0; index < bufferSize; index += 1) {
                data[index] = (Math.random() * 2 - 1) * .28;
            }

            return buffer;
        }

        async function startAmbience() {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            if (!state.ambience.context) {
                const context = new AudioContext();
                const gain = context.createGain();
                gain.gain.value = .035;

                const filter = context.createBiquadFilter();
                filter.type = "lowpass";
                filter.frequency.value = 850;

                const noise = context.createBufferSource();
                noise.buffer = createNoiseBuffer(context);
                noise.loop = true;
                noise.connect(filter).connect(gain).connect(context.destination);

                const tone = context.createOscillator();
                const toneGain = context.createGain();
                tone.type = "sine";
                tone.frequency.value = 196;
                toneGain.gain.value = .012;
                tone.connect(toneGain).connect(context.destination);

                state.ambience.context = context;
                state.ambience.gain = gain;
                state.ambience.noise = noise;
                state.ambience.tone = tone;

                noise.start();
                tone.start();
            }

            await state.ambience.context.resume();
            state.ambience.playing = true;
            button.classList.add("is-playing");
            button.setAttribute("aria-label", "Mute cafe ambience");
            button.innerHTML = "<i data-lucide=\"volume-x\"></i>";
            renderIcons();
        }

        async function stopAmbience() {
            if (state.ambience.context) {
                await state.ambience.context.suspend();
            }

            state.ambience.playing = false;
            button.classList.remove("is-playing");
            button.setAttribute("aria-label", "Toggle cafe ambience");
            button.innerHTML = "<i data-lucide=\"volume-2\"></i>";
            renderIcons();
        }

        button.addEventListener("click", () => {
            if (state.ambience.playing) {
                stopAmbience();
            } else {
                startAmbience();
            }
        });
    }

    function initImageFallbacks() {
        qsa("img").forEach((image) => {
            image.addEventListener("error", () => {
                image.style.background = "linear-gradient(135deg, #3E2723, #D4A373)";
                image.alt = image.alt || "BREAK OUT coffee visual";
            }, { once: true });
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        initTheme();
        initSplash();
        renderMenu();
        renderFeatured();
        initMenuFilters();
        initNavigation();
        initCountdown();
        initReviews();
        initLightbox();
        initReservationForm();
        initNewsletter();
        initAmbience();
        initImageFallbacks();
        renderIcons();
    });
})();
