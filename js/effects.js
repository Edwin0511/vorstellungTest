/* ═══════════════════════════════════════════
   GRÜNWERK – Visual Effects
   Preloader · Cursor · Particles · ScrollExpand
   Typewriter · Magnetic · Ripple · Tilt · Split
═══════════════════════════════════════════ */

/* ── Preloader ── */
window.addEventListener('load', () => {
    const pl = document.getElementById('preloader');
    if (!pl) return;
    setTimeout(() => {
        pl.classList.add('hide');
        setTimeout(() => { pl.style.display = 'none'; }, 800);
    }, 2000);
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

    const hoverTargets = 'a, button, .service-card, .portfolio-item, .filter-btn, .slider-btn, .sd-dot, .ba-container, .testimonial-card, .usp-card, .se-media';
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

    for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size   = Math.random() * 6 + 3;
        const isGold = Math.random() > .45;
        const opacity = Math.floor(Math.random() * 4 + 1);
        p.style.cssText = `
            position:absolute;
            left:${Math.random() * 100}%;
            width:${size}px; height:${size}px;
            border-radius:50%;
            background: rgba(${isGold ? '201,168,76' : '255,255,255'},.${opacity});
            animation: floatUp ${Math.random() * 16 + 10}s linear ${Math.random() * 16}s infinite;
        `;
        container.appendChild(p);
    }
})();

/* ════════════════════════════════════
   SCROLL EXPAND HERO
   Inspired by 21st.dev ScrollExpandMedia
   — vanilla JS port for this project —
════════════════════════════════════ */
(function initScrollExpand() {
    const heroBg    = document.getElementById('heroBg');
    const media     = document.getElementById('seMedia');
    const titleA    = document.getElementById('seTitleA');
    const titleB    = document.getElementById('seTitleB');
    const veil      = document.getElementById('seVeil');
    const hints     = document.getElementById('seHints');
    const content   = document.getElementById('heroContent');
    const scrollInd = document.getElementById('seScrollDown');

    if (!media || !content) return;

    let progress  = 0;
    let expanded  = false;
    let touchStartY = 0;
    let animFrameId = null;

    const isMobile = () => window.innerWidth < 768;

    /* Apply all visual changes for a given progress (0→1) */
    function setProgress(p) {
        progress = Math.max(0, Math.min(1, p));

        const vw  = window.innerWidth;
        const vh  = window.innerHeight;
        const mob = isMobile();

        /* ── Media card: small → full viewport ── */
        const startW  = mob ? 240 : 310;
        const startH  = mob ? 340 : 450;
        const mediaW  = startW + progress * (vw  - startW);
        const mediaH  = startH + progress * (vh  - startH);
        const radius  = Math.round(20 * (1 - progress));

        media.style.width        = mediaW + 'px';
        media.style.height       = mediaH + 'px';
        media.style.borderRadius = radius + 'px';

        /* ── Background: fade to nearly black ── */
        if (heroBg) heroBg.style.opacity = String(1 - progress);

        /* ── Title: slide completely off screen (100vw guarantees all resolutions) ── */
        const slide = progress * 100; // vw — same for mobile and desktop
        if (titleA) titleA.style.transform = `translateX(-${slide}vw)`;
        if (titleB) titleB.style.transform = `translateX(${slide}vw)`;

        /* ── Veil over card: stay dark enough for content readability ── */
        const veilOp = Math.max(0.52, 0.75 - progress * 0.23);
        if (veil) veil.style.opacity = String(veilOp);

        /* ── Hints: fade out quickly ── */
        const hintOp = Math.max(0, 1 - progress * 3.5);
        if (hints) hints.style.opacity = String(hintOp);

        /* ── Content & scroll indicator: reveal at end ── */
        if (progress >= 1) {
            content.classList.add('se-visible');
            if (scrollInd) scrollInd.classList.add('se-visible');
        } else if (progress < 0.82) {
            content.classList.remove('se-visible');
            if (scrollInd) scrollInd.classList.remove('se-visible');
        }
    }

    /* ── Wheel handler ── */
    function handleWheel(e) {
        if (expanded) {
            /* Allow collapse when scrolling up at the very top of page */
            if (e.deltaY < 0 && window.scrollY <= 2) {
                e.preventDefault();
                expanded = false;
                /* Animate back smoothly */
                smoothCollapseBy(0.025);
            }
            /* Otherwise: let normal scroll happen */
            return;
        }
        /* Not yet expanded: intercept and drive progress */
        e.preventDefault();
        const delta = e.deltaY * 0.00085;
        const newP  = progress + delta;
        setProgress(newP);
        if (progress >= 1) expanded = true;
    }

    /* ── Touch handlers ── */
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (!touchStartY) return;
        const currentY = e.touches[0].clientY;
        const deltaY   = touchStartY - currentY; /* positive = scroll down */

        if (expanded) {
            if (deltaY < -20 && window.scrollY <= 2) {
                e.preventDefault();
                expanded = false;
                smoothCollapseBy(0.03);
            }
            return;
        }

        e.preventDefault();
        /* Higher sensitivity scrolling back (negative deltaY) */
        const factor = deltaY < 0 ? 0.0075 : 0.0045;
        setProgress(progress + deltaY * factor);
        if (progress >= 1) expanded = true;
        touchStartY = currentY;
    }

    function handleTouchEnd() { touchStartY = 0; }

    /* ── Smooth collapse animation ── */
    function smoothCollapseBy(step) {
        if (animFrameId) cancelAnimationFrame(animFrameId);
        function tick() {
            if (progress <= 0) { setProgress(0); return; }
            setProgress(progress - step);
            if (progress > 0) animFrameId = requestAnimationFrame(tick);
        }
        animFrameId = requestAnimationFrame(tick);
    }

    /* Register event listeners */
    window.addEventListener('wheel',      handleWheel,      { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true  });
    window.addEventListener('touchmove',  handleTouchMove,  { passive: false });
    window.addEventListener('touchend',   handleTouchEnd);

    /* Initial state */
    setProgress(0);
    if (scrollInd) scrollInd.style.opacity = '0';
})();

/* ── Hero Parallax (mouse only, active after expansion) ── */
(function initHeroParallax() {
    const content = document.getElementById('heroContent');
    const hero    = document.getElementById('hero');
    if (!content || !hero) return;

    let mouseX = 0, mouseY = 0;
    let targetMX = 0, targetMY = 0;

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
        /* Only apply when fully expanded and visible */
        if (content.classList.contains('se-visible')) {
            content.style.transform = `translate(${mouseX * 6}px, ${mouseY * 4}px)`;
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
            phraseIdx  = (phraseIdx + 1) % phrases.length;
            delay = 400;
        }
        setTimeout(tick, delay);
    }
    /* Start after preloader, runs regardless of expansion state */
    setTimeout(tick, 2200);
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

/* ════════════════════════════════════════
   SERVICES ANIMATED BACKGROUND
   Ported from 21st.dev BeamsBackground
   — canvas beams + leaf particles + cursor
════════════════════════════════════════ */
(function initServicesCanvas() {
    const canvas  = document.getElementById('servicesCanvas');
    const section = document.getElementById('leistungen');
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    let beams = [], leaves = [];
    let mouseX = -2000, mouseY = -2000;
    let raf;

    /* ── Color palette ── */
    const COLORS = [
        [45,  122,  64],   /* primary green */
        [26,   92,  46],   /* dark green */
        [201, 168,  76],   /* gold */
        [80,  160,  90],   /* light green */
        [160, 130,  55],   /* dark gold */
    ];

    /* ── Beam factory (BeamsBackground pattern) ── */
    function makeBeam() {
        const col   = Math.floor(Math.random() * 3);
        const xZone = W / 3;
        return {
            x:         col * xZone + xZone / 2 + (Math.random() - .5) * xZone * .9,
            y:         H + 80 + Math.random() * 400,
            width:     25 + Math.random() * 65,
            length:    H * 3,
            angle:     -32 + Math.random() * 14,
            speed:     0.25 + Math.random() * 0.55,
            opacity:   0.07 + Math.random() * 0.09,
            color:     COLORS[Math.floor(Math.random() * COLORS.length)],
            pulse:     Math.random() * Math.PI * 2,
            pulseSpd:  0.012 + Math.random() * 0.018,
            col,
        };
    }

    /* ── Leaf particle factory ── */
    function makeLeaf(randY) {
        return {
            x:       Math.random() * W,
            y:       randY !== undefined ? Math.random() * H : H + 12,
            size:    3.5 + Math.random() * 6,
            angle:   Math.random() * Math.PI * 2,
            rotSpd:  (Math.random() - .5) * 0.025,
            vx:      (Math.random() - .5) * 0.35,
            vy:      -(0.35 + Math.random() * 0.65),
            opacity: 0.12 + Math.random() * 0.2,
            sway:    Math.random() * Math.PI * 2,
            swaySpd: 0.018 + Math.random() * 0.022,
        };
    }

    /* ── Draw one beam ── */
    function drawBeam(b) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle * Math.PI / 180);
        const op = b.opacity * (.75 + Math.sin(b.pulse) * .25);
        const [r, g, bl] = b.color;
        const gr = ctx.createLinearGradient(0, 0, 0, b.length);
        gr.addColorStop(0,    `rgba(${r},${g},${bl},0)`);
        gr.addColorStop(0.08, `rgba(${r},${g},${bl},${op * .45})`);
        gr.addColorStop(0.38, `rgba(${r},${g},${bl},${op})`);
        gr.addColorStop(0.62, `rgba(${r},${g},${bl},${op})`);
        gr.addColorStop(0.92, `rgba(${r},${g},${bl},${op * .45})`);
        gr.addColorStop(1,    `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = gr;
        ctx.fillRect(-b.width / 2, 0, b.width, b.length);
        ctx.restore();
    }

    /* ── Draw one leaf (pointed oval — organic leaf path) ── */
    function drawLeaf(l) {
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.angle);
        ctx.globalAlpha = l.opacity;
        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.bezierCurveTo(l.size * .55, -l.size * .5, l.size * .55, l.size * .5, 0, l.size);
        ctx.bezierCurveTo(-l.size * .55, l.size * .5, -l.size * .55, -l.size * .5, 0, -l.size);
        ctx.fillStyle = 'rgba(60,140,70,.75)';
        ctx.fill();
        /* Midrib */
        ctx.beginPath();
        ctx.moveTo(0, -l.size * .85);
        ctx.lineTo(0,  l.size * .85);
        ctx.strokeStyle = 'rgba(100,180,100,.4)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.restore();
    }

    /* ── Resize & init ── */
    function resize() {
        cancelAnimationFrame(raf);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = section.offsetWidth;
        H = section.offsetHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.scale(dpr, dpr);
        beams  = Array.from({ length: 22 }, makeBeam);
        leaves = Array.from({ length: 30 }, () => makeLeaf(true));
        animate();
    }

    /* ── Main animation loop ── */
    function animate() {
        ctx.clearRect(0, 0, W, H);

        /* Beams — blurred layer (BeamsBackground core) */
        ctx.save();
        ctx.filter = 'blur(32px)';
        beams.forEach((b, i) => {
            b.y      -= b.speed;
            b.pulse  += b.pulseSpd;
            /* Gentle cursor attraction */
            b.x += (mouseX - b.x) * 0.00025;
            /* Reset when fully off-screen top */
            if (b.y + b.length < -50) {
                const fresh = makeBeam();
                fresh.col = i % 3;
                beams[i] = fresh;
            }
            drawBeam(b);
        });
        ctx.restore();

        /* Leaf particles — crisp layer */
        leaves.forEach((l, i) => {
            l.y      += l.vy;
            l.x      += l.vx + Math.sin(l.sway) * 0.28;
            l.angle  += l.rotSpd;
            l.sway   += l.swaySpd;
            if (l.y < -15) leaves[i] = makeLeaf(false);
            drawLeaf(l);
        });

        raf = requestAnimationFrame(animate);
    }

    /* ── Mouse tracking ── */
    section.addEventListener('mousemove', e => {
        const r = section.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
    });
    section.addEventListener('mouseleave', () => { mouseX = -2000; mouseY = -2000; });

    resize();
    window.addEventListener('resize', resize);
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

/* ── Text Scramble on Section Labels ── */
(function initTextScramble() {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·–·';

    function scramble(el) {
        const final = el.dataset.original || el.textContent.trim();
        el.dataset.original = final;
        let frame = 0;
        const total = final.length * 1.5 + 10;

        (function tick() {
            el.textContent = final.split('').map((ch, i) => {
                if (ch === ' ') return ' ';
                if (frame > i * 1.4) return ch;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }).join('');
            frame++;
            if (frame <= total) requestAnimationFrame(tick);
            else el.textContent = final;
        })();
    }

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            scramble(e.target);
            obs.unobserve(e.target);
        });
    }, { threshold: 0.8 });

    document.querySelectorAll('.section-label').forEach(el => obs.observe(el));
})();

/* ── About Image Scroll Parallax ── */
(function initAboutParallax() {
    const section = document.getElementById('ueber-uns');
    const img = section ? section.querySelector('.about-img-main img') : null;
    if (!section || !img) return;

    img.style.transform = 'scale(1.12) translateY(0px)';

    window.addEventListener('scroll', () => {
        const rect   = section.getBoundingClientRect();
        const progress = -rect.top / (window.innerHeight + rect.height);
        const shift  = (progress - 0.5) * 60;
        img.style.transform = `scale(1.12) translateY(${shift}px)`;
    }, { passive: true });
})();
