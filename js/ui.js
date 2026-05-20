/* ═══════════════════════════════════════════
   GRÜNWERK – UI Components
   Nav · Reveal · Counter · Slider · Filter
   Before/After · Lightbox · Form · Dots
═══════════════════════════════════════════ */

/* ── Scroll Progress Bar ── */
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - innerHeight) * 100;
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = pct + '%';
}, { passive: true });

/* ── Sticky Navigation ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 75);
}, { passive: true });

/* ── Mobile Menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const mobileClose = document.getElementById('mobileClose');

function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
});
if (mobileClose) mobileClose.addEventListener('click', closeMenu);

// Close menu on nav link click
document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', closeMenu)
);

/* ── Scroll Reveal ── */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .split-ready').forEach(el =>
    revealObs.observe(el)
);

// Re-observe after split text is created (effects.js runs first)
setTimeout(() => {
    document.querySelectorAll('.split-ready').forEach(el => revealObs.observe(el));
}, 100);

/* ── Animated Counters ── */
const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el     = e.target;
        const target = +el.dataset.target;
        const dur    = 1600;
        const start  = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / dur, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
        counterObs.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ── Testimonials Slider ── */
(function initSlider() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;

    const cards   = [...track.querySelectorAll('.testimonial-card')];
    const dotsEl  = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let current   = 0;
    let autoTimer = null;

    function spv() {
        return innerWidth > 1024 ? 3 : innerWidth > 700 ? 2 : 1;
    }
    function maxSlide() { return Math.max(0, cards.length - spv()); }

    function buildDots() {
        if (!dotsEl) return;
        dotsEl.innerHTML = '';
        for (let i = 0; i <= maxSlide(); i++) {
            const d = document.createElement('div');
            d.className = 'slider-dot' + (i === current ? ' active' : '');
            d.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(d);
        }
    }

    function goTo(n) {
        current = Math.max(0, Math.min(n, maxSlide()));
        const cardW = cards[0].offsetWidth + 24;
        track.style.transform = `translateX(-${current * cardW}px)`;
        document.querySelectorAll('.slider-dot').forEach((d, i) =>
            d.classList.toggle('active', i === current)
        );
    }

    function startAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current >= maxSlide() ? 0 : current + 1), 5000);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current >= maxSlide() ? 0 : current + 1); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current <= 0 ? maxSlide() : current - 1); startAuto(); });

    window.addEventListener('resize', () => { buildDots(); goTo(0); });

    buildDots();
    startAuto();
})();

/* ── Portfolio Filter ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        document.querySelectorAll('.portfolio-item').forEach((item, idx) => {
            const show = filter === 'all' || item.dataset.category === filter;
            if (show) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'opacity .4s ease, transform .4s ease';
                    item.style.opacity    = '1';
                    item.style.transform  = 'translateY(0)';
                }, idx * 60);
            } else {
                item.style.transition = 'opacity .25s ease';
                item.style.opacity = '0';
                setTimeout(() => { item.style.display = 'none'; }, 260);
            }
        });
    });
});

/* ── Before / After Slider ── */
(function initBASlider() {
    const container = document.querySelector('.ba-container');
    if (!container) return;

    const beforeEl = container.querySelector('.ba-before');
    const handle   = container.querySelector('.ba-handle');
    let isDragging = false;
    let demoPct    = 50, demoDir = 1;
    let userInteracted = false;

    function setPos(x) {
        const r = container.getBoundingClientRect();
        let pct = ((x - r.left) / r.width) * 100;
        pct = Math.max(3, Math.min(97, pct));
        demoPct = pct;
        beforeEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        handle.style.left = pct + '%';
        handle.style.transform = 'translateX(-50%)';
    }

    // Pointer events
    container.addEventListener('mousedown',  e => { isDragging = true; userInteracted = true; setPos(e.clientX); });
    container.addEventListener('touchstart', e => { isDragging = true; userInteracted = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mousemove',  e => { if (isDragging) setPos(e.clientX); });
    window.addEventListener('touchmove',  e => { if (isDragging) setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup',  () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);

    // Auto-demo
    setPos(container.getBoundingClientRect().left + container.offsetWidth * .5);

    setInterval(() => {
        if (isDragging || userInteracted) return;
        demoPct += demoDir * .4;
        if (demoPct > 72) demoDir = -1;
        if (demoPct < 28) demoDir =  1;
        const r = container.getBoundingClientRect();
        setPos(r.left + r.width * demoPct / 100);
    }, 28);

    // Reset auto on mouse leave
    container.addEventListener('mouseleave', () => {
        if (!isDragging) userInteracted = false;
    });
})();

/* ── Lightbox ── */
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
        const src = item.querySelector('img').src.replace('w=600', 'w=1400');
        const lb  = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        if (!lb || !img) return;
        img.src = src;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
}
window.closeLightbox = closeLightbox;

const lb = document.getElementById('lightbox');
if (lb) lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── Contact Form ── */
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const content = document.getElementById('formContent');
        const success = document.getElementById('formSuccess');
        if (content) content.style.display = 'none';
        if (success) success.style.display = 'block';
    });
}

/* ── Cookie Banner ── */
const cookieBanner = document.getElementById('cookieBanner');
if (cookieBanner) {
    if (localStorage.getItem('gw_cookie_ok')) {
        cookieBanner.classList.add('hidden');
    }
}
function acceptCookies() {
    localStorage.setItem('gw_cookie_ok', '1');
    if (cookieBanner) cookieBanner.classList.add('hidden');
}
window.acceptCookies = acceptCookies;

/* ── Section Progress Dots ── */
(function initSectionDots() {
    const dots     = document.querySelectorAll('.sd-dot');
    const sections = [...dots].map(d => document.getElementById(d.dataset.section)).filter(Boolean);
    if (!dots.length) return;

    function update() {
        const mid = window.scrollY + window.innerHeight * .45;
        let active = sections[0];
        sections.forEach(s => { if (s.offsetTop <= mid) active = s; });
        dots.forEach(d => d.classList.toggle('active', d.dataset.section === active?.id));
    }

    window.addEventListener('scroll', update, { passive: true });
    update();

    dots.forEach(d => {
        d.addEventListener('click', () => {
            const target = document.getElementById(d.dataset.section);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
})();

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id     = a.getAttribute('href');
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
