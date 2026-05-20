/* ═══════════════════════════════════════════
   GRÜNWERK – Visual Effects
   Preloader · Cursor · Particles · Parallax
   Magnetic · Ripple · Typewriter · Tilt
═══════════════════════════════════════════ */

/* ── Preloader ── */
window.addEventListener('load', () => {
    const pl = document.getElementById('preloader');
    if (!pl) return;
    setTimeout(() => {
        pl.classList.add('hide');
        setTimeout(() => { pl.style.display = 'none'; }, 700);
    }, 1500);
});

/* ── Custom Cursor ── */
(function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    // Ring lags with lerp
    (function animateRing() {
        rx += (mx - rx) * 0.13;
        ry += (my - ry) * 0.13;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    })();

    // Hover states
    const hoverTargets = 'a, button, .service-card, .portfolio-item, .filter-btn, .slider-btn, .sd-dot, .ba-container, .testimonial-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hovered');
            ring.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hovered');
            ring.classList.remove('hovered');
        });
    });

    // Dark section: lighter dot
    const darkSections = '#hero, #stats, #warum-wir, #vorher-nachher, footer';
    document.querySelectorAll(darkSections).forEach(sec => {
        sec.addEventListener('mouseenter', () => dot.classList.add('on-dark'));
        sec.addEventListener('mouseleave', () => dot.classList.remove('on-dark'));
    });

    // Click feedback
    document.addEventListener('mousedown', () => dot.classList.add('clicked'));
    document.addEventListener('mouseup',   () => dot.classList.remove('clicked'));
})();

/* ── Hero Particles ── */
(function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 24; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 8 + 4;
        const isGold = Math.random() > .5;
        p.style.cssText = `
            left:${Math.random() * 100}%;
            width:${size}px; height:${size}px;
            background: rgba(${isGold ? '201,168,76' : '255,255,255'},.${Math.floor(Math.random() * 4 + 1)});
            animation-duration:${Math.random() * 14 + 9}s;
            animation-delay:${Math.random() * 14}s;
        `;
        container.appendChild(p);
    }
})();

/* ── Hero Parallax: scroll + mouse ── */
(function initHeroParallax() {
    const bg      = document.getElementById('heroBg');
    const content = document.getElementById('heroContent');
    const hero    = document.getElementById('hero');
    if (!bg || !content || !hero) return;

    let scrollY = 0;
    let mouseX  = 0, mouseY = 0;
    let targetMX = 0, targetMY = 0;

    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    hero.addEventListener('mousemove', e => {
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;
        targetMX = (e.clientX - cx) / cx;
        targetMY = (e.clientY - cy) / cy;
    });
    hero.addEventListener('mouseleave', () => { targetMX = 0; targetMY = 0; });

    (function raf() {
        mouseX += (targetMX - mouseX) * .06;
        mouseY += (targetMY - mouseY) * .06;

        if (scrollY < window.innerHeight) {
            bg.style.transform =
                `scale(1.12) translate(${mouseX * -18}px, ${mouseY * -12}px) translateY(${scrollY * 0.28}px)`;
            content.style.transform =
                `translate(${mouseX * 9}px, ${mouseY * 6}px)`;
        }
        requestAnimationFrame(raf);
    })();
})();

/* ── Typewriter Effect ── */
(function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Gartengestaltung',
        'Terrassenbauten',
        'Naturteiche',
        'Pflasterarbeiten',
        'Grüne Lebensräume'
    ];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;

    function tick() {
        const current = phrases[phraseIdx];
        if (isDeleting) {
            el.textContent = current.substring(0, --charIdx);
        } else {
            el.textContent = current.substring(0, ++charIdx);
        }

        let delay = isDeleting ? 65 : 110;

        if (!isDeleting && charIdx === current.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx  = (phraseIdx + 1) % phrases.length;
            delay = 400;
        }
        setTimeout(tick, delay);
    }
    setTimeout(tick, 1800);
})();

/* ── Magnetic Buttons ── */
(function initMagnetic() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width  / 2) * .28;
            const y = (e.clientY - r.top  - r.height / 2) * .28;
            btn.style.transform = `translate(${x}px, ${y}px)`;
            btn.style.transition = 'transform .1s ease';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform  = '';
            btn.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
        });
    });
})();

/* ── Ripple Effect ── */
(function initRipple() {
    const targets = '.btn-primary, .btn-secondary, .btn-submit, .filter-btn, .slider-btn';
    document.querySelectorAll(targets).forEach(btn => {
        btn.addEventListener('click', e => {
            const r    = btn.getBoundingClientRect();
            const size = Math.max(r.width, r.height) * 2;
            const span = document.createElement('span');
            span.className = 'ripple-effect';
            span.style.cssText = `
                width:${size}px; height:${size}px;
                left:${e.clientX - r.left - size / 2}px;
                top:${e.clientY - r.top  - size / 2}px;
            `;
            btn.appendChild(span);
            setTimeout(() => span.remove(), 680);
        });
    });
})();

/* ── 3D Card Tilt ── */
(function initTilt() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  - .5) *  13;
            const y = ((e.clientY - r.top)  / r.height - .5) * -13;
            card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform  = '';
            card.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1), box-shadow .4s ease';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform .1s ease, box-shadow .4s ease';
        });
    });
})();

/* ── Split Text (word-by-word reveal) ── */
(function initSplitText() {
    document.querySelectorAll('.section-title').forEach(el => {
        // Don't split if already done
        if (el.classList.contains('split-ready')) return;

        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words.map((w, i) =>
            `<span class="word-wrap"><span class="word" style="transition-delay:${i * .08}s">${w}</span></span>`
        ).join(' ');
        el.classList.add('split-ready');
    });
})();
