/* ============================================================
   Stack Petals — app.js
   Sections: Vue App · Canvas Animation · Security
   ============================================================ */


/* ── Vue App ────────────────────────────────────────────────── */

const { createApp } = Vue;

createApp({

  /* ---------- State ---------- */
  data() {
    return {
      cartOpen: false,
      cartItems: [],
      selectedBouquet: null,

      navLinks: ['Home', 'Bouquets', 'About', 'Process', 'Gallery', 'Reviews', 'Contact'],

      features: [
        { label: 'Engineered', sub: 'with Precision', icon: './images/engineered-icon.png' },
        { label: 'Crafted',    sub: 'with Love',      icon: './images/crafted-icon.png'    },
        { label: 'Delivered',  sub: 'with Care',      icon: './images/delivered-icon.png'  },
      ],

      products: [
        { name: 'Blush Symphony',  price: '$85.00', image: './images/b1.png' },
        { name: 'Code & Petals',   price: '$95.00', image: './images/b2.png' },
        { name: 'Pink Algorithm',  price: '$75.00', image: './images/b3.png' },
        { name: 'Lavender Logic',  price: '$90.00', image: './images/b4.png' },
      ],
    };
  },

  /* ---------- Computed ---------- */
  computed: {
    cartTotal() {
      const sum = this.cartItems.reduce(
        (acc, item) => acc + parseFloat(item.price.replace('$', '')), 0
      );
      return `$${sum.toFixed(2)}`;
    },
  },

  /* ---------- Methods ---------- */
  methods: {

    openPreview(product) {
      this.selectedBouquet = product;
    },

    addToCart(product, event) {
      this.flyToCart(event);
      this.cartItems.push({ ...product });
    },

    flyToCart(event) {
      const btn = event.currentTarget;
      const cartBtn = document.querySelector('.cart-btn');
      if (!btn || !cartBtn) return;

      const srcRect  = btn.getBoundingClientRect();
      const destRect = cartBtn.getBoundingClientRect();

      const petal = document.createElement('div');
      petal.className = 'fly-petal';

      const startX = srcRect.left + srcRect.width  / 2;
      const startY = srcRect.top  + srcRect.height / 2;

      petal.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: 22px;
        height: 36px;
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        background: rgba(216, 165, 167, 0.9);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) rotate(0deg);
        transition: none;
        box-shadow: 0 2px 8px rgba(216,165,167,0.4);
      `;

      document.body.appendChild(petal);

      const endX = destRect.left + destRect.width  / 2;
      const endY = destRect.top  + destRect.height / 2;

      const dx = endX - startX;
      const dy = endY - startY;

      const duration = 650;
      const start = performance.now();

      const animate = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);

        const x   = startX + dx * ease;
        const arc = -Math.sin(progress * Math.PI) * 120;
        const y   = startY + dy * ease + arc;
        const rot = progress * 360;
        const scale = 1 - progress * 0.5;
        const alpha = progress > 0.8 ? 1 - (progress - 0.8) / 0.2 : 1;

        petal.style.left    = `${x}px`;
        petal.style.top     = `${y}px`;
        petal.style.opacity = alpha;
        petal.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          petal.remove();
          cartBtn.classList.add('cart-bounce');
          cartBtn.addEventListener('animationend', () => cartBtn.classList.remove('cart-bounce'), { once: true });
        }
      };

      requestAnimationFrame(animate);
    },

    removeFromCart(index) {
      this.cartItems.splice(index, 1);
    },

    scrollToProducts() {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    },

    /* ---------- Canvas ---------- */
    initCanvas() {
      const cc = document.getElementById('circuit-canvas');
      const pc = document.getElementById('petal-canvas');
      const W  = () => cc.width;
      const H  = () => cc.height;

      /* Resize both canvases to fill the viewport */
      const resize = () => {
        cc.width = pc.width   = window.innerWidth;
        cc.height = pc.height = window.innerHeight;
        circuit = buildCircuit();
      };
      this._resizeHandler = resize;
      window.addEventListener('resize', resize);

      /* Build a randomised circuit-board graph */
      function buildCircuit() {
        const w = W(), h = H(), grid = 48;
        const nodes = [], lines = [];

        for (let x = grid; x < w; x += grid) {
          for (let y = grid; y < h; y += grid) {
            if (Math.random() < 0.35) {
              nodes.push({
                x: x + (Math.random() - 0.5) * 12,
                y: y + (Math.random() - 0.5) * 12,
              });
            }
          }
        }

        nodes.forEach((a, i) => {
          nodes.forEach((b, j) => {
            if (j <= i) return;
            const dx   = b.x - a.x;
            const dy   = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < grid * 2.2 && Math.random() < 0.45) {
              const horiz = Math.random() < 0.5;
              const mid   = horiz ? { x: b.x, y: a.y } : { x: a.x, y: b.y };
              lines.push({
                a, b, mid,
                pulse:      Math.random() < 0.3,
                pulseT:     Math.random(),
                pulseSpeed: 0.004 + Math.random() * 0.006,
              });
            }
          });
        });

        return { nodes, lines };
      }

      /* Draw the circuit on every frame */
      function drawCircuit(ctx) {
        ctx.clearRect(0, 0, W(), H());
        ctx.lineWidth = 0.8;

        circuit.lines.forEach(l => {
          ctx.strokeStyle = 'rgba(190,140,120,0.18)';
          ctx.beginPath();
          ctx.moveTo(l.a.x, l.a.y);
          ctx.lineTo(l.mid.x, l.mid.y);
          ctx.lineTo(l.b.x, l.b.y);
          ctx.stroke();

          if (l.pulse) {
            const t   = l.pulseT;
            const pts = [l.a, l.mid, l.b];
            const seg = t * 2;
            let px, py;

            if (seg < 1) {
              px = pts[0].x + (pts[1].x - pts[0].x) * seg;
              py = pts[0].y + (pts[1].y - pts[0].y) * seg;
            } else {
              const s = seg - 1;
              px = pts[1].x + (pts[2].x - pts[1].x) * s;
              py = pts[1].y + (pts[2].y - pts[1].y) * s;
            }

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(220,170,100,0.7)';
            ctx.fill();
          }
        });

        circuit.nodes.forEach(n => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(190,140,120,0.32)';
          ctx.fill();
        });
      }

      /* Falling petals */
      const PETAL_COLORS = [
        'rgba(220,170,175,0.82)',
        'rgba(240,200,205,0.75)',
        'rgba(210,155,160,0.7)',
        'rgba(245,215,210,0.65)',
        'rgba(200,140,145,0.6)',
      ];

      const makePetal = (fromTop) => ({
        x:          Math.random() * W(),
        y:          fromTop ? -20 - Math.random() * 80 : Math.random() * H(),
        size:       6 + Math.random() * 8,
        rot:        Math.random() * Math.PI * 2,
        rotSpeed:   (Math.random() - 0.5) * 0.04,
        vx:         (Math.random() - 0.5) * 0.6,
        vy:         0.4 + Math.random() * 0.7,
        swing:      Math.random() * Math.PI * 2,
        swingSpeed: 0.015 + Math.random() * 0.02,
        color:      PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        opacity:    0.5 + Math.random() * 0.5,
      });

      /* Shared state (let, not const — reassigned on resize) */
      let circuit = buildCircuit();
      let petals  = Array.from({ length: 28 }, () => makePetal(false));

      /* Animation loop */
      const loop = () => {
        /* Advance pulse positions */
        circuit.lines.forEach(l => {
          if (l.pulse) {
            l.pulseT += l.pulseSpeed;
            if (l.pulseT > 1) l.pulseT = 0;
          }
        });

        drawCircuit(cc.getContext('2d'));

        /* Draw petals */
        const pctx = pc.getContext('2d');
        pctx.clearRect(0, 0, W(), H());

        petals.forEach(p => {
          p.swing += p.swingSpeed;
          p.x     += p.vx + Math.sin(p.swing) * 0.5;
          p.y     += p.vy;
          p.rot   += p.rotSpeed;

          if (p.y > H() + 20) Object.assign(p, makePetal(true));

          pctx.save();
          pctx.translate(p.x, p.y);
          pctx.rotate(p.rot);
          pctx.globalAlpha = p.opacity;
          pctx.fillStyle   = p.color;
          pctx.beginPath();
          pctx.ellipse(0, 0, p.size * 0.42, p.size, 0, 0, Math.PI * 2);
          pctx.fill();
          pctx.restore();
        });

        this._rafId = requestAnimationFrame(loop);
      };

      resize();
      loop();
    },
  },

  /* ---------- Lifecycle ---------- */
  mounted() {
    this.initCanvas();
  },

  beforeUnmount() {
    cancelAnimationFrame(this._rafId);
    window.removeEventListener('resize', this._resizeHandler);
  },

}).mount('#app');


/* ── Security ───────────────────────────────────────────────── */

/* Disable right-click context menu */
document.addEventListener('contextmenu', e => e.preventDefault());

/* Disable text selection and drag */
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dragstart',   e => e.preventDefault());

/* Disable common devtools shortcuts */
document.addEventListener('keydown', e => {
  const ctrlShift = e.ctrlKey && e.shiftKey;
  const ctrl      = e.ctrlKey;

  if (e.key === 'F12') { e.preventDefault(); return; }
  if (ctrlShift && ['I', 'J', 'C'].includes(e.key)) { e.preventDefault(); return; }
  if (ctrl      && ['U', 'S', 'A'].includes(e.key)) { e.preventDefault(); }
});
