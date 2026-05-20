/* ═══════════════════════════════════════════
   GRÜNWERK – Visual Effects
   Preloader · Cursor · Particles · Parallax
   Typewriter · Magnetic · Ripple · Tilt · Split
═══════════════════════════════════════════ */

/* ── Preloader ── */
window.addEventListener('load', () => {
    const pl = document.getElementById('preloader');
    if (!pl) return;
    setTimeout(() => {
        pl.classList.add('hide');
        setTimeout(() => { pl.style.display = 'none'; }, 800);
    }, 2200);
});

/* ── Animate hero headline on load ── */
window.addEventListener('load', () => {
    setTimeout(() => {
        const h = document.querySelector('.hero-headline');
        if (h) h.classList.add('animated');
    }, 2400);
    setTimeout(() => {
        document.querySelectorAll('.hero-content .reveal, .hero-content .hero-badge').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 150);
        });
        const heroSub = document.querySelector('.hero-sub');
        if (heroSub) heroSub.style.opacity = '1';
        const heroActs = document.querySelector('.hero-actions');
        if (heroActs) {
            heroActs.style.opacity = '0';
            heroActs.style.transform = 'translateY(20px)';
            heroActs.style.transition = 'opacity .7s ease .1s, transform .7s ease .1s';
            setTimeout(() => {
                heroActs.style.opacity = '1';
                heroActs.style.transform = 'translateY(0)';
            }, 2700);
        }
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            heroStats.style.opacity = '0';
            heroStats.style.transform = 'translateY(20px)';
            heroStats.style.transition = 'opacity .7s ease .25s, transform .7s ease .25s';
            setTimeout(() => {
                heroStats.style.opacity = '1';
                heroStats.style.transform = 'translateY(0)';
            }, 2900);
        }
    }, 2200);
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
        mx = e.clientX; my = e.clientY;
        dot.style.left  = mx + 'px';
        dot.style.top   = my + 'px';
    });

    (function animateRing() {
        rx += (mx - rx) * .12;
        ry += (my - ry) * .12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    })();

    const hoverTargets = 'a, button, .service-card, .portfolio-item, .filter-btn, .slider-btn, .sd-dot, .ba-container, .testimonial-card, .usp-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
        el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
    });

    const darkSections = '#hero, #leistungen, #prozess, #stats, #vorher-nachher, #kontakt, #footer';
    document.querySelectorAll(darkSections).forEach(sec => {
        sec.addEventListener('mouseenter', () => dot.classList.add('on-dark'));
        sec.addEventListener('mouseleave', () => dot.classList.remove('on-dark'));
    });

    document.addEventListener('mousedown', () => dot.classList.add('clicked'));
    document.addEventListener('mouseup',   () => dot.classList.remove('clicked'));
})();

/* ── Hero Particles ── */
(function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size   = Math.random() * 6 + 3;
        const isGold = Math.random() > .45;
        const opacity = Math.floor(Math.random() * 4 + 1);
        p.style.cssText = `
            left:${Math.random() * 100}%;
            width:${size}px; height:${size}px;
            border-radius:50%;
            background: rgba(${isGold ? '201,168,76' : '255,255,255'},.${opacity});
            animation: floatUp ${Math.random() * 16 + 10}s linear ${Math.random() * 16}s infinite;
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
        mouseX += (targetMX - mouseX) * .055;
        mouseY += (targetMY - mouseY) * .055;
        if (scrollY < window.innerHeight) {
            bg.style.transform =
                `scale(1.12) translate(${mouseX * -16}px, ${mouseY * -10}px) translateY(${scrollY * 0.25}px)`;
            content.style.transform =
                `translate(${mouseX * 8}px, ${mouseY * 5}px) translateY(${scrollY * -0.08}px)`;
        }
        requestAnimationFrame(raf);
    })();
})();

/* ── Typewriter Effect ── */
(function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = ['Gartengestaltung', 'Terrassenbauten', 'Naturteiche', 'Pflasterarbeiten', 'Grüne Lebensräume'];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;

    function tick() {
        const current = phrases[phraseIdx];
        if (isDeleting) {
            el.textContent = current.substring(0, --charIdx);
        } else {
            el.textContent = current.substring(0, ++charIdx);
        }
        let delay = isDeleting ? 55 : 100;
        if (!isDeleting && charIdx === current.length) {
            delay = 2400; isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            delay = 450;
        }
        setTimeout(tick, delay);
    }
    setTimeout(tick, 3200);
})();

/* ── Magnetic Buttons ── */
(function initMagnetic() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width  / 2) * .22;
            const y = (e.clientY - r.top  - r.height / 2) * .22;
            btn.style.transform = `translate(${x}px, ${y}px)`;
            btn.style.transition = 'transform .1s ease';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform  = '';
            btn.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)';
        });
    });
})();

/* ── Ripple Effect ── */
(function initRipple() {
    const targets = '.btn-primary, .btn-outline, .btn-submit, .filter-btn, .slider-btn, .nav-cta';
    document.querySelectorAll(targets).forEach(btn => {
        btn.addEventListener('click', e => {
            const r    = btn.getBoundingClientRect();
            const size = Math.max(r.width, r.height) * 2.2;
            const span = document.createElement('span');
            span.className = 'ripple-effect';
            span.style.cssText = `
                width:${size}px; height:${size}px;
                left:${e.clientX - r.left - size / 2}px;
                top:${e.clientY - r.top  - size / 2}px;
            `;
            btn.appendChild(span);
            setTimeout(() => span.remove(), 700);
        });
    });
})();

/* ── 3D Card Tilt ── */
(function initTilt() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  - .5) *  12;
            const y = ((e.clientY - r.top)  / r.height - .5) * -12;
            card.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform  = '';
            card.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform .12s ease';
        });
    });
})();

/* ── Split Text (word-by-word reveal) ── */
(function initSplitText() {
    document.querySelectorAll('.section-title').forEach(el => {
        if (el.classList.contains('split-ready')) return;
        const words = el.innerHTML.trim().split(/\s+/);
        el.innerHTML = words.map((w, i) =>
            `<span class="word-wrap"><span class="word" style="transition-delay:${i * .09}s">${w}</span></span>`
        ).join(' ');
        el.classList.add('split-ready');
    });
})();
