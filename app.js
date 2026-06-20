/* ============================================================
   Stack Petals — app.js
   Sections: Page Components · Router · Vue App · Canvas · Security
   ============================================================ */

const { createApp, ref, computed } = Vue;
const { createRouter, createWebHashHistory, RouterLink, RouterView } = VueRouter;


/* ── Page Components ────────────────────────────────────────── */

/* ---------- Home ---------- */
const HomePage = {
  template: `
    <div>
      <section class="hero">
        <div class="hero-left">
          <h1>Where Code <br>Meets <span>Blooms</span></h1>
          <p>Engineered with Precision, Crafted with Love.</p>
          <div class="buttons">
            <button class="primary" @click="$router.push('/bouquets')">Shop Bouquets</button>
            <button class="secondary" @click="$router.push('/about')">Our Story</button>
          </div>
        </div>
        <div class="hero-right">
          <img src="./images/bouquet-main.png" alt="Bouquet">
        </div>
      </section>

      <div class="feature-bar">
        <div class="feature" v-for="feat in features" :key="feat.label">
          <img :src="feat.icon" :alt="feat.label" width="40" height="40">
          <div>
            <strong>{{ feat.label }}</strong>
            <span>{{ feat.sub }}</span>
          </div>
        </div>
      </div>

      <section class="products" id="products">
        <h2>Featured Bouquets</h2>
        <div class="grid">
          <div class="card" v-for="product in products" :key="product.name">
            <img :src="product.image" :alt="product.name" @click="$root.openPreview(product)">
            <h3>{{ product.name }}</h3>
            <p>{{ product.price }}</p>
            <button class="add-to-cart-btn" @click="$root.addToCart(product, $event)">Add to Cart</button>
          </div>
        </div>
      </section>
    </div>
  `,
  data() {
    return {
      features: [
        { label: 'Engineered', sub: 'with Precision', icon: './images/engineered-icon.png' },
        { label: 'Crafted',    sub: 'with Love',      icon: './images/crafted-icon.png'    },
        { label: 'Delivered',  sub: 'with Care',      icon: './images/delivered-icon.png'  },
      ],
      products: [
        { name: 'Blush Symphony',  price: '₱5,000.00', image: './images/b1.png' },
        { name: 'Code & Petals',   price: '₱5,699.00', image: './images/b2.png' },
        { name: 'Pink Algorithm',  price: '₱4,500.00', image: './images/b3.png' },
        { name: 'Lavender Logic',  price: '₱5,399.00', image: './images/b4.png' },
      ],
    };
  },
};


/* ---------- Bouquets ---------- */
const BouquetsPage = {
  template: `
    <div class="page-section">
      <div class="page-hero">
        <h1>Our <span>Bouquets</span></h1>
        <p>Every arrangement is handcrafted with intention and care.</p>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <button
          v-for="f in filters" :key="f"
          :class="['filter-btn', { active: activeFilter === f }]"
          @click="activeFilter = f">
          {{ f }}
        </button>
      </div>

      <div class="grid wide-grid">
        <div class="card" v-for="product in filteredProducts" :key="product.name">
          <img :src="product.image" :alt="product.name" @click="$root.openPreview(product)">
          <div class="card-badge" v-if="product.badge">{{ product.badge }}</div>
          <h3>{{ product.name }}</h3>
          <p class="card-category">{{ product.category }}</p>
          <p>{{ product.price }}</p>
          <button class="add-to-cart-btn" @click="$root.addToCart(product, $event)">Add to Cart</button>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      activeFilter: 'All',
      filters: ['All', 'Romance', 'Birthday', 'Sympathy', 'Celebration'],
      products: [
        { name: 'Blush Symphony',    price: '₱5,000.00',  image: './images/b1.png', category: 'Romance',     badge: 'Best Seller' },
        { name: 'Code & Petals',     price: '₱5,699.00',  image: './images/b2.png', category: 'Celebration', badge: null },
        { name: 'Pink Algorithm',    price: '₱4,500.00',  image: './images/b3.png', category: 'Birthday',    badge: null },
        { name: 'Lavender Logic',    price: '₱5,399.00',  image: './images/b4.png', category: 'Romance',     badge: null },
        { name: 'Soft Compile',      price: '₱5,000.00',  image: './images/b1.png', category: 'Sympathy',    badge: null },
        { name: 'Binary Blossom',    price: '₱6,599.00', image: './images/b2.png', category: 'Celebration', badge: 'New' },
        { name: 'Debug in Bloom',    price: '₱4,200.00',  image: './images/b3.png', category: 'Birthday',    badge: null },
        { name: 'Null Pointer Rose', price: '₱3,899.00',  image: './images/b4.png', category: 'Sympathy',    badge: null },
      ],
    };
  },
  computed: {
    filteredProducts() {
      if (this.activeFilter === 'All') return this.products;
      return this.products.filter(p => p.category === this.activeFilter);
    },
  },
};


/* ---------- About ---------- */
const AboutPage = {
  template: `
    <div class="page-section">
      <div class="page-hero">
        <h1>About <span>Stack Petals</span></h1>
        <p>Where engineering meets artistry — and every petal tells a story.</p>
      </div>

      <div class="about-grid">
        <div class="about-img">
          <img src="./images/bouquet-main.png" alt="About Stack Petals">
        </div>
        <div class="about-text">
          <h2>Our Story</h2>
          <p>Stack Petals was born at the intersection of two passions — software engineering and the art of floral design. Founded in 2024, we believe that the same precision and care that goes into building beautiful software can be applied to crafting breathtaking bouquets.</p>
          <p>Every arrangement we create is like a piece of code: thoughtfully structured, elegantly composed, and built to last — or in this case, to bloom.</p>
          <h2 style="margin-top:32px">Our Mission</h2>
          <p>To deliver premium, handcrafted bouquets that combine technical precision with heartfelt creativity — making every occasion unforgettable.</p>
        </div>
      </div>

      <div class="values-grid">
        <div class="value-card" v-for="v in values" :key="v.title">
          <div class="value-icon">{{ v.icon }}</div>
          <h3>{{ v.title }}</h3>
          <p>{{ v.desc }}</p>
        </div>
      </div>

      <div class="team-section">
        <h2>Meet the Team</h2>
        <div class="team-grid">
          <div class="team-card" v-for="member in team" :key="member.name">
            <div class="team-avatar">{{ member.initials }}</div>
            <h3>{{ member.name }}</h3>
            <span>{{ member.role }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      values: [
        { icon: '🌸', title: 'Precision',   desc: 'Every stem placed with purpose, like a function with a clear return value.' },
        { icon: '✨', title: 'Lasting Beauty',   desc: 'Handcrafted bouquets designed to stay beautiful for years, not days.' },
        { icon: '📦', title: 'Reliability', desc: 'On-time delivery, every time. No bugs, no delays.' },
        { icon: '💛', title: 'Heart',       desc: 'Each bouquet carries the warmth of genuine human craftsmanship.' },
      ],
      team: [
        { name: 'Klarenz E.',   role: 'Owner',  initials: 'KE' },
        { name: 'Klarenz E.',       role: 'Web Developer/Designer',             initials: 'KE' },
        { name: 'Klarenz E.',    role: 'Florist',     initials: 'KE' },
        { name: 'Klarenz E.',  role: 'Software Engineer',      initials: 'KE' },
      ],
    };
  },
};


/* ---------- Process (placeholder) ---------- */
const ProcessPage = {
  template: `
    <div class="page-section">
      <div class="page-hero">
        <h1>Our <span>Process</span></h1>
        <p>From idea to doorstep — crafted with precision at every step.</p>
      </div>
      <div class="process-steps">
        <div class="process-step" v-for="(step, i) in steps" :key="i">
          <div class="process-num">{{ i + 1 }}</div>
          <div class="process-body">
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      steps: [
        { title: 'You Place Your Order',      desc: 'Browse our catalog, add to cart, and check out with GCash or Maya.' },
        { title: 'We Review Your Payment',    desc: 'Our team verifies your payment screenshot within a few hours.' },
        { title: 'Crafting the Blooms',       desc: 'Each flower is carefully handcrafted to create a beautiful and lasting bouquet.' },
        { title: 'Arranging Your Bouquet',     desc: 'Our florists arrange every stem with care and your preferences in mind.' },
        { title: 'Careful Packaging',         desc: 'Wrapped and secured so your blooms arrive as beautiful as they left.' },
        { title: 'Delivered to Your Door',    desc: 'On-time delivery to your specified address on your chosen date.' },
      ],
    };
  },
};


/* ---------- Gallery (placeholder) ---------- */
const GalleryPage = {
  template: `
    <div class="page-section">
      <div class="page-hero">
        <h1>Our <span>Gallery</span></h1>
        <p>A bloom for every moment.</p>
      </div>
      <div class="gallery-grid">
        <div class="gallery-item" v-for="n in 8" :key="n">
          <img :src="'./images/b' + ((n % 4) + 1) + '.png'" :alt="'Gallery ' + n">
        </div>
      </div>
    </div>
  `,
};


/* ---------- Reviews (placeholder) ---------- */
const ReviewsPage = {
  template: `
    <div class="page-section">
      <div class="page-hero">
        <h1>Customer <span>Reviews</span></h1>
        <p>What our customers say about us.</p>
      </div>
      <div class="reviews-grid">
        <div class="review-card" v-for="r in reviews" :key="r.name">
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"{{ r.text }}"</p>
          <div class="review-author">— {{ r.name }}</div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      reviews: [
        { name: 'Maria S.',   text: 'Absolutely stunning bouquet! The flowers were so fresh and the delivery was right on time. Will definitely order again.' },
        { name: 'Carlo B.',   text: 'Ordered for my girlfriend\'s birthday. She cried happy tears. Stack Petals never disappoints.' },
        { name: 'Jessa R.',   text: 'The GCash payment was so easy and the team confirmed my order super fast. Love the whole experience!' },
        { name: 'Miguel T.',  text: 'Unique concept — flowers + tech vibes. The packaging was gorgeous and everything arrived perfect.' },
        { name: 'Ana G.',     text: 'I\'ve ordered three times already. Every bouquet is more beautiful than the last.' },
        { name: 'Paolo M.',   text: 'Fast delivery, fresh flowers, and great customer service. Highly recommend Stack Petals!' },
      ],
    };
  },
};


/* ---------- Contact ---------- */
const ContactPage = {
  template: `
    <div class="page-section">
      <div class="page-hero">
        <h1>Get in <span>Touch</span></h1>
        <p>We'd love to hear from you. Send us a message and we'll get back to you soon.</p>
      </div>

      <div class="contact-grid">
        <div class="contact-info">
          <h2>Contact Info</h2>
          <div class="contact-item" v-for="item in info" :key="item.label">
            <span class="contact-icon">{{ item.icon }}</span>
            <div>
              <strong>{{ item.label }}</strong>
              <p>{{ item.value }}</p>
            </div>
          </div>

          <h2 style="margin-top:40px">Follow Us</h2>
          <div class="social-links">
            <a href="#" class="social-btn">Facebook</a>
            <a href="#" class="social-btn">Instagram</a>
            <a href="#" class="social-btn">TikTok</a>
          </div>
        </div>

        <div class="contact-form">
          <div v-if="!submitted">
            <h2>Send a Message</h2>
            <div class="co-form">
              <label>Name
                <input v-model="form.name" type="text" placeholder="Your name">
              </label>
              <label>Email
                <input v-model="form.email" type="email" placeholder="your@email.com">
              </label>
              <label>Subject
                <input v-model="form.subject" type="text" placeholder="What's this about?">
              </label>
              <label>Message
                <textarea v-model="form.message" rows="5" placeholder="Write your message here..."></textarea>
              </label>
            </div>
            <button class="co-btn-primary" style="width:100%;margin-top:16px" @click="sendMessage" :disabled="!formValid">
              Send Message 🌸
            </button>
          </div>
          <div v-else class="contact-success">
            <div style="font-size:48px">🌷</div>
            <h2>Message Sent!</h2>
            <p>Thank you for reaching out! We'll get back to you within 24 hours.</p>
            <button class="co-btn-outline" style="margin-top:20px" @click="submitted = false">Send Another</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      submitted: false,
      form: { name: '', email: '', subject: '', message: '' },
      info: [
        { icon: '📍', label: 'Address',       value: 'Quezon City, Metro Manila, Philippines' },
        { icon: '📧', label: 'Email',          value: 'hello@stackpetals.com' },
        { icon: '📱', label: 'Phone / Viber',  value: '+63 9XX XXX XXXX' },
        { icon: '🕐', label: 'Business Hours', value: 'Mon–Sat, 8:00 AM – 7:00 PM' },
      ],
    };
  },
  computed: {
    formValid() {
      return this.form.name && this.form.email && this.form.message;
    },
  },
  methods: {
    sendMessage() {
      if (!this.formValid) return;

      /* ── Persist message to localStorage (shared with admin) ── */
      const msgs = JSON.parse(localStorage.getItem('sp_messages') || '[]');
      msgs.unshift({
        id:        'MSG-' + Date.now(),
        createdAt: new Date().toISOString(),
        name:      this.form.name,
        email:     this.form.email,
        subject:   this.form.subject,
        message:   this.form.message,
        read:      false,
      });
      localStorage.setItem('sp_messages', JSON.stringify(msgs));

      this.submitted = true;
      this.form = { name: '', email: '', subject: '', message: '' };
    },
  },
};


/* ── Router ─────────────────────────────────────────────────── */

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',          component: HomePage     },
    { path: '/bouquets',  component: BouquetsPage },
    { path: '/about',     component: AboutPage    },
    { path: '/process',   component: ProcessPage  },
    { path: '/gallery',   component: GalleryPage  },
    { path: '/reviews',   component: ReviewsPage  },
    { path: '/contact',   component: ContactPage  },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});


/* ── Vue App ────────────────────────────────────────────────── */

createApp({

  /* ---------- State ---------- */
  data() {
    return {
      /* Cart */
      cartOpen:     false,
      cartItems:    [],

      /* Preview modal */
      selectedBouquet: null,

      /* Checkout */
      checkoutStep:       0,
      confirmedTotal:     '',
      paymentMethod:      'gcash',
      paymentProof:       null,
      paymentProofPreview: null,

      /* Customer form */
      customer: {
        name: '', email: '', phone: '', address: '', date: '', note: '',
      },
    };
  },

  /* ---------- Computed ---------- */
  computed: {
    cartTotal() {
      const sum = this.cartItems.reduce((acc, item) => {
        const numeric = parseFloat(item.price.replace(/[₱,]/g, ''));
        return acc + (isNaN(numeric) ? 0 : numeric);
      }, 0);
      return `₱${sum.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    customerValid() {
      const c = this.customer;
      return c.name && c.email && c.phone && c.address && c.date;
    },
  },

  /* ---------- Methods ---------- */
  methods: {

    /* Preview */
    openPreview(product) {
      this.selectedBouquet = product;
    },

    /* Cart */
    addToCart(product, event) {
      this.flyToCart(event);
      this.cartItems.push({ ...product });
    },

    removeFromCart(index) {
      this.cartItems.splice(index, 1);
    },

    /* Fly-to-cart animation */
    flyToCart(event) {
      const btn     = event?.currentTarget;
      const cartBtn = document.querySelector('.cart-btn');
      if (!btn || !cartBtn) return;

      const srcRect  = btn.getBoundingClientRect();
      const destRect = cartBtn.getBoundingClientRect();

      const petal = document.createElement('div');
      petal.style.cssText = `
        position:fixed; pointer-events:none; z-index:9999;
        width:22px; height:36px; border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;
        background:rgba(216,165,167,0.9);
        box-shadow:0 2px 8px rgba(216,165,167,0.4);
        left:${srcRect.left + srcRect.width / 2}px;
        top:${srcRect.top + srcRect.height / 2}px;
        transform:translate(-50%,-50%);
      `;
      document.body.appendChild(petal);

      const startX = srcRect.left + srcRect.width  / 2;
      const startY = srcRect.top  + srcRect.height / 2;
      const endX   = destRect.left + destRect.width  / 2;
      const endY   = destRect.top  + destRect.height / 2;
      const dx = endX - startX, dy = endY - startY;
      const duration = 650, start = performance.now();

      const animate = (now) => {
        const p     = Math.min((now - start) / duration, 1);
        const ease  = 1 - Math.pow(1 - p, 3);
        const x     = startX + dx * ease;
        const y     = startY + dy * ease - Math.sin(p * Math.PI) * 120;
        const alpha = p > 0.8 ? 1 - (p - 0.8) / 0.2 : 1;

        petal.style.left      = `${x}px`;
        petal.style.top       = `${y}px`;
        petal.style.opacity   = alpha;
        petal.style.transform = `translate(-50%,-50%) rotate(${p * 360}deg) scale(${1 - p * 0.5})`;

        if (p < 1) {
          requestAnimationFrame(animate);
        } else {
          petal.remove();
          cartBtn.classList.add('cart-bounce');
          cartBtn.addEventListener('animationend', () => cartBtn.classList.remove('cart-bounce'), { once: true });
        }
      };
      requestAnimationFrame(animate);
    },

    /* Checkout */
    openCheckout() {
      this.cartOpen    = false;
      this.checkoutStep = 1;
    },

    closeCheckout() {
      this.checkoutStep = 0;
    },

    goToPayment() {
      if (!this.customerValid) return;
      this.checkoutStep = 3;
    },

    handleProofUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.paymentProof        = file;
      this.paymentProofPreview = URL.createObjectURL(file);
    },

    handleDrop(e) {
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      this.paymentProof        = file;
      this.paymentProofPreview = URL.createObjectURL(file);
    },

    submitOrder() {
      if (!this.paymentProof) return;
      this.confirmedTotal = this.cartTotal;

      /* ── Persist order to localStorage (shared with admin) ── */
      const reader = new FileReader();
      reader.onload = (e) => {
        const orders = JSON.parse(localStorage.getItem('sp_orders') || '[]');
        orders.unshift({
          id:            'ORD-' + Date.now(),
          createdAt:     new Date().toISOString(),
          customer:      { ...this.customer },
          items:         this.cartItems.map(i => ({ name: i.name, price: i.price, image: i.image })),
          total:         this.cartTotal,
          paymentMethod: this.paymentMethod === 'gcash' ? 'GCash' : 'Maya',
          proofImage:    e.target.result,
          paymentStatus: 'Pending',
          deliveryStatus:'Processing',
        });
        localStorage.setItem('sp_orders', JSON.stringify(orders));
      };
      reader.readAsDataURL(this.paymentProof);

      this.checkoutStep = 4;
    },

    finishCheckout() {
      this.cartItems           = [];
      this.checkoutStep        = 0;
      this.paymentProof        = null;
      this.paymentProofPreview = null;
      this.customer            = { name: '', email: '', phone: '', address: '', date: '', note: '' };
    },

    navigate(path) {
      router.push(path);
    },

    /* ── Canvas ── */
    initCanvas() {
      const cc = document.getElementById('circuit-canvas');
      const pc = document.getElementById('petal-canvas');
      const W  = () => cc.width;
      const H  = () => cc.height;

      const resize = () => {
        cc.width = pc.width   = window.innerWidth;
        cc.height = pc.height = window.innerHeight;
        circuit = buildCircuit();
      };
      this._resizeHandler = resize;
      window.addEventListener('resize', resize);

      function buildCircuit() {
        const w = W(), h = H(), grid = 48, nodes = [], lines = [];
        for (let x = grid; x < w; x += grid)
          for (let y = grid; y < h; y += grid)
            if (Math.random() < 0.35)
              nodes.push({ x: x + (Math.random() - 0.5) * 12, y: y + (Math.random() - 0.5) * 12 });
        nodes.forEach((a, i) => nodes.forEach((b, j) => {
          if (j <= i) return;
          const dx = b.x - a.x, dy = b.y - a.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < grid * 2.2 && Math.random() < 0.45) {
            const horiz = Math.random() < 0.5;
            const mid   = horiz ? { x: b.x, y: a.y } : { x: a.x, y: b.y };
            lines.push({ a, b, mid, pulse: Math.random() < 0.3, pulseT: Math.random(), pulseSpeed: 0.004 + Math.random() * 0.006 });
          }
        }));
        return { nodes, lines };
      }

      function drawCircuit(ctx) {
        ctx.clearRect(0, 0, W(), H());
        ctx.lineWidth = 0.8;
        circuit.lines.forEach(l => {
          ctx.strokeStyle = 'rgba(190,140,120,0.18)';
          ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y); ctx.lineTo(l.mid.x, l.mid.y); ctx.lineTo(l.b.x, l.b.y); ctx.stroke();
          if (l.pulse) {
            const t = l.pulseT, pts = [l.a, l.mid, l.b], seg = t * 2; let px, py;
            if (seg < 1) { px = pts[0].x + (pts[1].x - pts[0].x) * seg; py = pts[0].y + (pts[1].y - pts[0].y) * seg; }
            else { const s = seg - 1; px = pts[1].x + (pts[2].x - pts[1].x) * s; py = pts[1].y + (pts[2].y - pts[1].y) * s; }
            ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(220,170,100,0.7)'; ctx.fill();
          }
        });
        circuit.nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2); ctx.fillStyle = 'rgba(190,140,120,0.32)'; ctx.fill(); });
      }

      const PETAL_COLORS = ['rgba(220,170,175,0.82)','rgba(240,200,205,0.75)','rgba(210,155,160,0.7)','rgba(245,215,210,0.65)','rgba(200,140,145,0.6)'];
      const makePetal = (fromTop) => ({
        x: Math.random() * W(), y: fromTop ? -20 - Math.random() * 80 : Math.random() * H(),
        size: 6 + Math.random() * 8, rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.04,
        vx: (Math.random() - 0.5) * 0.6, vy: 0.4 + Math.random() * 0.7,
        swing: Math.random() * Math.PI * 2, swingSpeed: 0.015 + Math.random() * 0.02,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)], opacity: 0.5 + Math.random() * 0.5,
      });

      let circuit = buildCircuit();
      let petals  = Array.from({ length: 28 }, () => makePetal(false));

      const loop = () => {
        circuit.lines.forEach(l => { if (l.pulse) { l.pulseT += l.pulseSpeed; if (l.pulseT > 1) l.pulseT = 0; } });
        drawCircuit(cc.getContext('2d'));
        const pctx = pc.getContext('2d'); pctx.clearRect(0, 0, W(), H());
        petals.forEach(p => {
          p.swing += p.swingSpeed; p.x += p.vx + Math.sin(p.swing) * 0.5; p.y += p.vy; p.rot += p.rotSpeed;
          if (p.y > H() + 20) Object.assign(p, makePetal(true));
          pctx.save(); pctx.translate(p.x, p.y); pctx.rotate(p.rot);
          pctx.globalAlpha = p.opacity; pctx.fillStyle = p.color;
          pctx.beginPath(); pctx.ellipse(0, 0, p.size * 0.42, p.size, 0, 0, Math.PI * 2);
          pctx.fill(); pctx.restore();
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

})
.use(router)
.component('router-link', RouterLink)
.component('router-view', RouterView)
.mount('#app');


/* ── Security ───────────────────────────────────────────────── */

document.addEventListener('contextmenu',  e => e.preventDefault());
document.addEventListener('selectstart',  e => e.preventDefault());
document.addEventListener('dragstart',    e => e.preventDefault());

document.addEventListener('keydown', e => {
  if (e.key === 'F12')                                                   { e.preventDefault(); return; }
  if (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key))          { e.preventDefault(); return; }
  if (e.ctrlKey && ['U','S','A'].includes(e.key))                        { e.preventDefault(); }
});
