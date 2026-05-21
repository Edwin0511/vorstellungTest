/* ═══════════════════════════════════════════
   GRÜNWERK – UI Components
   Nav · Reveal · Counter · Slider · Filter
   Before/After · Lightbox · Form · Dots
═══════════════════════════════════════════ */

/* ── Marquee: fill screen with enough copies, then RAF scroll ── */
(function initMarquee() {
    const track    = document.querySelector('.usp-track');
    const original = document.querySelector('.usp-items');
    if (!track || !original) return;

    /* Remove any pre-existing duplicates so we start clean */
    while (track.children.length > 1) track.removeChild(track.lastChild);

    const setW   = original.offsetWidth;
    const stripW = (track.parentElement || document.body).offsetWidth;

    /* Need enough copies so the track always covers the viewport */
    const copies = Math.ceil(stripW / setW) + 2;
    for (let i = 1; i < copies; i++) {
        const clone = original.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    }

    let pos  = 0;
    let last = null;
    const speed = 40; /* px/s */

    function tick(ts) {
        if (last !== null) {
            pos -= speed * (ts - last) / 1000;
            if (pos <= -setW) pos += setW;
            track.style.transform = 'translateX(' + pos + 'px)';
        }
        last = ts;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();

/* ── Scroll Progress Bar ── */
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - innerHeight) * 100;
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = pct + '%';
}, { passive: true });

/* ── Sticky Navigation ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile Menu ── */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const mobileClose = document.getElementById('mobileClose');

function openMenu() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
}

if (hamburger)   hamburger.addEventListener('click', () => navLinks.classList.contains('open') ? closeMenu() : openMenu());
if (mobileClose) mobileClose.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-link, .nav-cta').forEach(a => a.addEventListener('click', closeMenu));

/* ── Back To Top ── */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Scroll Reveal ── */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const delay = e.target.dataset.delay ? parseFloat(e.target.dataset.delay) * 1000 : 0;
        setTimeout(() => e.target.classList.add('visible'), delay);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .split-ready').forEach(el =>
    revealObs.observe(el)
);
setTimeout(() => {
    document.querySelectorAll('.split-ready').forEach(el => revealObs.observe(el));
}, 150);

/* ── Scramble Counter (from 21st.dev AnimatedNumber pattern) ── */
function scrambleCounter(el) {
    const target = +el.dataset.target;
    const STEPS  = 20;
    const DELAY  = 60;
    let   step   = 0;

    el.textContent = '0';
    el.classList.add('scrambling');

    const run = setInterval(() => {
        step++;
        if (step < STEPS) {
            /* Converging random values — base climbs toward target */
            const t     = step / STEPS;
            const base  = Math.floor(t * target * 0.8);
            const noise = Math.floor(Math.random() * target * (1 - t) * 0.5);
            el.textContent = base + noise;
        } else {
            el.textContent = target;
            el.classList.remove('scrambling');
            clearInterval(run);
        }
    }, DELAY);
}

const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        scrambleCounter(e.target);
        counterObs.unobserve(e.target);
    });
}, { threshold: 0.4 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ── Portfolio Group Hover ── */
document.querySelectorAll('.portfolio-grid').forEach(grid => {
    grid.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('mouseenter', () => grid.classList.add('group-hover'));
        item.addEventListener('mouseleave', () => grid.classList.remove('group-hover'));
    });
});

/* ── Testimonials Slider ── */
(function initSlider() {
    const track  = document.getElementById('testimonialsTrack');
    if (!track) return;

    const cards   = [...track.querySelectorAll('.testimonial-card')];
    const dotsEl  = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let current   = 0;
    let autoTimer = null;

    function spv() {
        return innerWidth > 1024 ? 3 : innerWidth > 600 ? 2 : 1;
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
        autoTimer = setInterval(() => goTo(current >= maxSlide() ? 0 : current + 1), 5500);
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
                item.style.display = '';
                item.style.opacity = '0';
                item.style.transform = 'translateY(16px)';
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
    const container = document.getElementById('baContainer');
    if (!container) return;

    const beforeEl = document.getElementById('baBefore');
    const handle   = document.getElementById('baHandle');
    if (!beforeEl || !handle) return;

    let isDragging = false;
    let demoPct = 50, demoDir = 1;
    let userInteracted = false;

    function setPos(x) {
        const r = container.getBoundingClientRect();
        let pct = ((x - r.left) / r.width) * 100;
        pct = Math.max(3, Math.min(97, pct));
        demoPct = pct;
        beforeEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        handle.style.left = pct + '%';
    }

    container.addEventListener('mousedown',  e => { isDragging = true; userInteracted = true; setPos(e.clientX); });
    container.addEventListener('touchstart', e => { isDragging = true; userInteracted = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mousemove',  e => { if (isDragging) setPos(e.clientX); });
    window.addEventListener('touchmove',  e => { if (isDragging) setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup',  () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);

    setPos(container.getBoundingClientRect().left + container.offsetWidth * .5);

    setInterval(() => {
        if (isDragging || userInteracted) return;
        demoPct += demoDir * .35;
        if (demoPct > 70) demoDir = -1;
        if (demoPct < 30) demoDir =  1;
        const r = container.getBoundingClientRect();
        setPos(r.left + r.width * demoPct / 100);
    }, 26);

    container.addEventListener('mouseleave', () => {
        if (!isDragging) userInteracted = false;
    });
})();

/* ── Portfolio Lightbox ── */
document.querySelectorAll('.portfolio-item').forEach(item => {
    const zoomBtn = item.querySelector('.portfolio-zoom');
    function openLB() {
        const img = item.querySelector('img');
        if (!img) return;
        const src = img.src.replace(/w=\d+/, 'w=1400');
        const lb  = document.getElementById('lightbox');
        const lbImg = document.getElementById('lightboxImg');
        if (!lb || !lbImg) return;
        lbImg.src = src;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    if (zoomBtn) zoomBtn.addEventListener('click', e => { e.stopPropagation(); openLB(); });
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

/* ── Multi-Step Form ── */
(function initMSF() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const totalSteps  = 5;
    let   currentStep = 1;

    const progressFill = document.getElementById('msfProgress');
    const backBtn      = document.getElementById('msfBack');
    const nextBtn      = document.getElementById('msfNext');
    const nav          = document.getElementById('msfNav');
    const successEl    = document.getElementById('formSuccess');

    function setStep(n) {
        /* Hide all panels */
        for (let i = 1; i <= totalSteps; i++) {
            const p = document.getElementById('msfStep' + i);
            if (p) p.classList.remove('active');
            const dot = form.querySelector('.msf-step-dot[data-step="' + i + '"]');
            if (dot) { dot.classList.remove('active', 'done'); if (i < n) dot.classList.add('done'); }
        }
        /* Show current panel */
        const panel = document.getElementById('msfStep' + n);
        if (panel) panel.classList.add('active');
        const dot = form.querySelector('.msf-step-dot[data-step="' + n + '"]');
        if (dot) dot.classList.add('active');

        /* Progress bar */
        if (progressFill) progressFill.style.width = (n / totalSteps * 100) + '%';

        /* Back button */
        if (backBtn) backBtn.classList.toggle('hidden', n === 1);

        /* Next button label */
        if (nextBtn) nextBtn.innerHTML = n === totalSteps
            ? '<span>Anfrage absenden</span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>'
            : 'Weiter &#8594;';

        currentStep = n;
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            setStep(currentStep + 1);
        } else {
            /* Submit */
            if (nav) nav.style.display = 'none';
            for (let i = 1; i <= totalSteps; i++) {
                const p = document.getElementById('msfStep' + i);
                if (p) p.classList.remove('active');
            }
            form.querySelector('.msf-steps').style.display = 'none';
            form.querySelector('.msf-progress-track').style.display = 'none';
            const note = form.querySelector('.form-note');
            if (note) note.style.display = 'none';
            if (successEl) successEl.style.display = 'flex';
        }
    });

    if (backBtn) backBtn.addEventListener('click', () => {
        if (currentStep > 1) setStep(currentStep - 1);
    });

    setStep(1);
})();

/* ── Cookie Banner ── */
const cookieBanner = document.getElementById('cookieBanner');
if (cookieBanner && localStorage.getItem('gw_cookie_ok')) {
    cookieBanner.classList.add('hidden');
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
        const mid = window.scrollY + window.innerHeight * .42;
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
