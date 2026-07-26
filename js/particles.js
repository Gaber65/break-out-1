(function () {
    const canvas = document.getElementById("coffeeParticles");
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    const particles = [];
    const state = {
        width: 0,
        height: 0,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        pointerX: 0,
        pointerY: 0
    };

    function resize() {
        state.width = window.innerWidth;
        state.height = window.innerHeight;
        canvas.width = Math.floor(state.width * state.pixelRatio);
        canvas.height = Math.floor(state.height * state.pixelRatio);
        canvas.style.width = `${state.width}px`;
        canvas.style.height = `${state.height}px`;
        ctx.setTransform(state.pixelRatio, 0, 0, state.pixelRatio, 0, 0);

        const targetCount = state.width < 720 ? 34 : 62;
        particles.length = 0;

        for (let index = 0; index < targetCount; index += 1) {
            particles.push(createParticle(true));
        }
    }

    function createParticle(randomY) {
        const size = 5 + Math.random() * 10;
        return {
            x: Math.random() * state.width,
            y: randomY ? Math.random() * state.height : state.height + size,
            size,
            speed: .16 + Math.random() * .42,
            drift: (Math.random() - .5) * .22,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - .5) * .01,
            alpha: .16 + Math.random() * .2
        };
    }

    function drawBean(particle) {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = "#D4A373";
        ctx.beginPath();
        ctx.ellipse(0, 0, particle.size, particle.size * .62, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = particle.alpha * .72;
        ctx.strokeStyle = "#3E2723";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -particle.size * .48);
        ctx.bezierCurveTo(
            particle.size * .16,
            -particle.size * .2,
            -particle.size * .16,
            particle.size * .2,
            0,
            particle.size * .48
        );
        ctx.stroke();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, state.width, state.height);

        particles.forEach((particle, index) => {
            const pointerPullX = (state.pointerX - state.width / 2) * 0.00008;
            particle.x += particle.drift + pointerPullX;
            particle.y -= particle.speed;
            particle.rotation += particle.rotationSpeed;

            if (particle.y < -particle.size * 2 || particle.x < -40 || particle.x > state.width + 40) {
                particles[index] = createParticle(false);
            }

            drawBean(particle);
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", (event) => {
        state.pointerX = event.clientX;
        state.pointerY = event.clientY;
    }, { passive: true });

    resize();
    animate();
})();
