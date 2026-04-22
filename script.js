document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll ── */
  const navbar = document.querySelector('.navbar');
  const isHero = document.querySelector('.hero-section, .page-hero');

  function updateNav() {
    if (!isHero || window.scrollY > 60) {
      navbar.classList.add('solid');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('solid');
      navbar.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', updateNav);
  updateNav();

  /* ── Active nav link ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  /* ── Mobile drawer ── */
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');

  function openDrawer() {
    hamburger?.classList.add('open');
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger?.classList.remove('open');
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  /* ── Testimonial carousel ── */
  const track = document.querySelector('.testimonial-track');
  if (track) {
    track.innerHTML += track.innerHTML;
    let paused = false;
    track.closest('.testimonial-carousel')?.addEventListener('mouseenter', () => paused = true);
    track.closest('.testimonial-carousel')?.addEventListener('mouseleave', () => paused = false);
  }

  /* ── Gallery lightbox ── */
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (galleryItems.length) {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = '<div class="lb-overlay"></div><div class="lb-content"><img id="lb-img" src="" alt=""><button class="lb-close"><i class="fas fa-times"></i></button><button class="lb-prev"><i class="fas fa-chevron-left"></i></button><button class="lb-next"><i class="fas fa-chevron-right"></i></button></div>';
    document.body.appendChild(lb);

    const style = document.createElement('style');
    style.textContent = `
      #lightbox{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center}
      #lightbox.open{display:flex}
      .lb-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.88);cursor:pointer}
      .lb-content{position:relative;max-width:90vw;max-height:90vh;z-index:1}
      #lb-img{max-width:90vw;max-height:85vh;border-radius:6px;object-fit:contain}
      .lb-close{position:absolute;top:-40px;right:0;background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer}
      .lb-prev,.lb-next{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.15);border:none;color:#fff;width:44px;height:44px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center}
      .lb-prev{left:-60px}.lb-next{right:-60px}
      .lb-prev:hover,.lb-next:hover{background:var(--gold)}
    `;
    document.head.appendChild(style);

    let current = 0;
    const imgs = [...galleryItems];

    function openLB(i) {
      current = i;
      document.getElementById('lb-img').src = imgs[i].src;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLB() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    imgs.forEach((img, i) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLB(i));
    });

    lb.querySelector('.lb-overlay').addEventListener('click', closeLB);
    lb.querySelector('.lb-close').addEventListener('click', closeLB);
    lb.querySelector('.lb-prev').addEventListener('click', () => openLB((current - 1 + imgs.length) % imgs.length));
    lb.querySelector('.lb-next').addEventListener('click', () => openLB((current + 1) % imgs.length));

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') openLB((current - 1 + imgs.length) % imgs.length);
      if (e.key === 'ArrowRight') openLB((current + 1) % imgs.length);
    });
  }

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('.counter');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const isDecimal = el.dataset.decimal === 'true';
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;

      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
        if (current >= target) clearInterval(timer);
      }, step);

      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => countObs.observe(el));

});

/* ============================================================
   BACKGROUND CROSSFADE SLIDESHOW — mobile & desktop compatible
   ============================================================ */
class BackgroundSlideshow {
  constructor() {
    const images = [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1595476108010-b4d1f10a5146?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1521590832167-7bfcfaa6362f?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1600',
    ];

    /* Build wrapper */
    this.wrap = document.createElement('div');
    this.wrap.id = 'bg-slideshow';
    this.wrap.setAttribute('aria-hidden', 'true');

    /* Inject CSS once */
    const style = document.createElement('style');
    style.textContent = `
      #bg-slideshow {
        position: fixed;
        inset: 0;
        z-index: -2;
        pointer-events: none;
        overflow: hidden;
      }
      .bg-slide {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center center;
        /* NO background-attachment:fixed — breaks on iOS Safari */
        opacity: 0;
        transition: opacity 1.6s ease-in-out;
        transform: scale(1.08);
        animation: bgKenBurns 8s ease-in-out infinite alternate;
      }
      .bg-slide.active {
        opacity: 1;
      }
      /* Dark overlay on top of each slide — keeps text readable */
      #bg-slideshow::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          170deg,
          rgba(20,14,10,0.72) 0%,
          rgba(26,23,20,0.50) 50%,
          rgba(20,14,10,0.68) 100%
        );
        z-index: 1;
        pointer-events: none;
      }
      @keyframes bgKenBurns {
        from { transform: scale(1.08); }
        to   { transform: scale(1.0);  }
      }
      /* Dot nav */
      #slide-dots {
        position: fixed;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        display: flex;
        gap: 10px;
        pointer-events: all;
      }
      .slide-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: rgba(255,255,255,0.35);
        border: 1px solid rgba(255,255,255,0.5);
        cursor: pointer;
        transition: background 0.3s, transform 0.3s;
      }
      .slide-dot.active {
        background: #C5A059;
        border-color: #C5A059;
        transform: scale(1.35);
      }
    `;
    document.head.appendChild(style);

    /* Create slide divs */
    this.slides = images.map((src, i) => {
      const div = document.createElement('div');
      div.className = 'bg-slide' + (i === 0 ? ' active' : '');
      div.style.backgroundImage = `url('${src}')`;
      this.wrap.appendChild(div);
      return div;
    });

    document.body.prepend(this.wrap);

    /* Dot navigation */
    this.dots = [];
    const dotWrap = document.createElement('div');
    dotWrap.id = 'slide-dots';
    images.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'slide-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => this.goTo(i));
      dotWrap.appendChild(d);
      this.dots.push(d);
    });
    document.body.appendChild(dotWrap);

    this.current = 0;
    this.total   = images.length;
    this.timer   = setInterval(() => this.next(), 5500);

    // Pause on touch (mobile) — resume after lift
    document.addEventListener('touchstart', () => clearInterval(this.timer), { passive: true });
    document.addEventListener('touchend',   () => {
      clearInterval(this.timer);
      this.timer = setInterval(() => this.next(), 5500);
    }, { passive: true });
  }

  goTo(index) {
    this.slides[this.current].classList.remove('active');
    this.dots[this.current].classList.remove('active');
    this.current = (index + this.total) % this.total;
    this.slides[this.current].classList.add('active');
    this.dots[this.current].classList.add('active');
  }

  next() { this.goTo(this.current + 1); }
}

// Boot slideshow
new BackgroundSlideshow();
