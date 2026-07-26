(function () {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let revealObserver = null;

    function initAos() {
        if (window.AOS && !reducedMotion) {
            window.AOS.init({
                once: true,
                duration: 760,
                easing: "ease-out-cubic"
            });
        }
    }

    function initGsapEntrance() {
        if (!window.gsap || reducedMotion) return;

        window.gsap.from(".site-header", {
            y: -26,
            opacity: 0,
            duration: .72,
            delay: .22,
            ease: "power3.out"
        });

        window.gsap.from(".hero__content > *", {
            y: 26,
            opacity: 0,
            duration: .78,
            delay: .35,
            stagger: .08,
            ease: "power3.out"
        });

        window.gsap.from(".hero__visual", {
            scale: .92,
            opacity: 0,
            duration: .9,
            delay: .52,
            ease: "power3.out"
        });
    }

    function revealElements(elements) {
        const items = Array.from(elements || document.querySelectorAll("[data-reveal]"));

        if (!items.length) return;

        if (reducedMotion || !("IntersectionObserver" in window)) {
            items.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        if (!revealObserver) {
            revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                });
            }, {
                threshold: .16,
                rootMargin: "0px 0px -80px"
            });
        }

        items.forEach((element) => revealObserver.observe(element));
    }

    function initCounters() {
        const counters = Array.from(document.querySelectorAll("[data-counter]"));
        if (!counters.length) return;

        const runCounter = (element) => {
            const target = Number(element.dataset.counter || 0);
            const duration = reducedMotion ? 0 : 1250;
            const start = performance.now();

            function tick(now) {
                const progress = duration ? Math.min((now - start) / duration, 1) : 1;
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);
                element.textContent = `${value.toLocaleString("en-US")}+`;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            }

            requestAnimationFrame(tick);
        };

        if (!("IntersectionObserver" in window)) {
            counters.forEach(runCounter);
            return;
        }

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.target.dataset.counted) return;
                entry.target.dataset.counted = "true";
                runCounter(entry.target);
                counterObserver.unobserve(entry.target);
            });
        }, { threshold: .55 });

        counters.forEach((counter) => counterObserver.observe(counter));
    }

    function initCursor() {
        if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

        const dot = document.querySelector(".cursor-dot");
        const ring = document.querySelector(".cursor-ring");
        if (!dot || !ring) return;

        let ringX = window.innerWidth / 2;
        let ringY = window.innerHeight / 2;
        let pointerX = ringX;
        let pointerY = ringY;

        function move() {
            ringX += (pointerX - ringX) * .18;
            ringY += (pointerY - ringY) * .18;
            dot.style.transform = `translate(${pointerX}px, ${pointerY}px) translate(-50%, -50%)`;
            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            requestAnimationFrame(move);
        }

        window.addEventListener("pointermove", (event) => {
            pointerX = event.clientX;
            pointerY = event.clientY;
            document.body.classList.add("cursor-ready");
        }, { passive: true });

        document.addEventListener("pointerover", (event) => {
            if (event.target.closest("a, button, input, select, textarea, iframe")) {
                ring.classList.add("is-hovering");
            }
        });

        document.addEventListener("pointerout", (event) => {
            if (event.target.closest("a, button, input, select, textarea, iframe")) {
                ring.classList.remove("is-hovering");
            }
        });

        move();
    }

    function initHeroParallax() {
        const hero = document.querySelector(".hero");
        const visual = document.querySelector(".hero__visual");
        const light = document.querySelector(".hero__light");
        if (!hero || reducedMotion) return;

        hero.addEventListener("pointermove", (event) => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - .5;
            const y = (event.clientY - rect.top) / rect.height - .5;

            if (visual) {
                visual.style.transform = `translate3d(${x * 18}px, ${y * 14}px, 0)`;
            }

            if (light) {
                light.style.setProperty("--light-x", `${x * 22}px`);
                light.style.setProperty("--light-y", `${y * 18}px`);
            }
        }, { passive: true });

        hero.addEventListener("pointerleave", () => {
            if (visual) visual.style.transform = "";
            if (light) {
                light.style.setProperty("--light-x", "0px");
                light.style.setProperty("--light-y", "0px");
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        initAos();
        revealElements();
        initCounters();
        initCursor();
        initHeroParallax();
        initGsapEntrance();
    });

    window.BreakoutMotion = {
        revealElements
    };
})();
