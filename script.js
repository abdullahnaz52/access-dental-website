/* ═══════════════════════════════════════════════════════════
   ACCESS DENTAL CARE & ORTHODONTICS — script.js
   Chatbot calls /api/chat (Vercel proxy — key stored server-side)
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ── Chat via Vercel serverless proxy ── */
const CHAT_ENDPOINT = '/api/chat';

const conversationHistory = [];

async function askGroq(userMessage) {
  conversationHistory.push({ role: 'user', content: userMessage });

  const res = await fetch(CHAT_ENDPOINT, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ messages: conversationHistory })
  });

  // Log the raw response for debugging
  const text = await res.text();
  console.log('Proxy response status:', res.status);
  console.log('Proxy response body:', text);

  if (!res.ok) {
    throw new Error(`Proxy error ${res.status}: ${text}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch(e) {
    throw new Error('Invalid JSON from proxy: ' + text);
  }

  const reply = data.reply ?? '';
  if (!reply) throw new Error('Empty reply from proxy');

  conversationHistory.push({ role: 'assistant', content: reply });
  if (conversationHistory.length > 20) conversationHistory.splice(0, 2);

  return reply;
}

/* ═══════════════════════════════
   DOM READY
═══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Cursor glow ── */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  /* ── Header scroll + active nav ── */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    const sections = document.querySelectorAll('section[id]');
    let active = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) active = s.id; });
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + active);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav overlay ── */
  const hamburger  = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');
  const navClose   = document.getElementById('navClose');

  const openNav  = () => { hamburger.classList.add('open'); navOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeNav = () => { hamburger.classList.remove('open'); navOverlay.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger?.addEventListener('click', () => navOverlay.classList.contains('open') ? closeNav() : openNav());
  navClose?.addEventListener('click', closeNav);
  document.querySelectorAll('.overlay-link').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => e.key === 'Escape' && closeNav());
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeNav(); });

  /* ── WhatsApp floating ── */
  const floatWa = document.querySelector('.float-wa');
  const syncWa  = () => { if (floatWa) floatWa.style.display = window.innerWidth <= 768 ? 'flex' : 'none'; };
  syncWa();
  window.addEventListener('resize', syncWa);

  /* ── Hero slider ── */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots   = document.querySelectorAll('.hero-dot');
  const heroSub    = document.getElementById('heroSub');
  const slideSubs  = [
    'Experience modern dentistry with a personal touch. Our specialists deliver world-class care right here in Srinagar.',
    'From traditional braces to clear aligners — cutting-edge orthodontic solutions for every age.',
    'Our modern techniques ensure every visit is comfortable, gentle, and completely stress-free.'
  ];
  let currentSlide = 0;

  function showSlide(n) {
    heroSlides.forEach(s => s.classList.remove('active'));
    heroDots.forEach(d => d.classList.remove('active'));
    currentSlide = (n + heroSlides.length) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
    heroDots[currentSlide].classList.add('active');
    if (heroSub) {
      heroSub.style.opacity = '0';
      setTimeout(() => { heroSub.textContent = slideSubs[currentSlide]; heroSub.style.opacity = '1'; }, 300);
    }
  }

  if (heroSub) heroSub.style.transition = 'opacity 0.4s ease';
  heroDots.forEach((d, i) => d.addEventListener('click', () => {
    clearInterval(slideTimer);
    showSlide(i);
    slideTimer = setInterval(() => showSlide(currentSlide + 1), 5500);
  }));

  let slideTimer = setInterval(() => showSlide(currentSlide + 1), 5500);
  const heroEl = document.querySelector('.hero');
  heroEl?.addEventListener('mouseenter', () => clearInterval(slideTimer));
  heroEl?.addEventListener('mouseleave', () => { slideTimer = setInterval(() => showSlide(currentSlide + 1), 5500); });

  /* ── Testimonial slider ── */
  const testiSlides = document.querySelectorAll('.testi-slide');
  const tdots       = document.querySelectorAll('.tdot');
  let currentTesti  = 0;

  function showTesti(n) {
    testiSlides.forEach(s => s.classList.remove('active'));
    tdots.forEach(d => d.classList.remove('active'));
    currentTesti = (n + testiSlides.length) % testiSlides.length;
    testiSlides[currentTesti].classList.add('active');
    tdots[currentTesti].classList.add('active');
  }

  tdots.forEach((d, i) => d.addEventListener('click', () => showTesti(i)));
  setInterval(() => showTesti(currentTesti + 1), 6500);

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal,.reveal-up,.reveal-left,.reveal-right');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' }); }
    });
  });

  /* ── Appointment form ── */
  document.getElementById('appointmentForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn  = this.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sent! ✓</span><i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; this.reset(); }, 3500);
  });

  /* ── Specialist image fallback ── */
  document.querySelectorAll('.spec-img-wrap img').forEach(img => {
    img.addEventListener('error', function() {
      const icon = document.createElement('div');
      icon.innerHTML = '<i class="fas fa-user-md"></i>';
      Object.assign(icon.style, {
        display:'flex', alignItems:'center', justifyContent:'center',
        width:'110px', height:'110px', borderRadius:'50%',
        background:'var(--surface2)', fontSize:'2.5rem', color:'var(--purple2)'
      });
      this.replaceWith(icon);
    });
  });

  /* ═══════════════════════════════
     GROQ AI CHATBOT
  ═══════════════════════════════ */
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel  = document.getElementById('chatPanel');
  const chatClose  = document.getElementById('chatClose');
  const chatInput  = document.getElementById('chatInput');
  const chatSend   = document.getElementById('chatSend');
  const chatMsgs   = document.getElementById('chatMsgs');

  const scrollMsgs = () => { if (chatMsgs) chatMsgs.scrollTop = chatMsgs.scrollHeight; };

  function openChat() {
    chatPanel.classList.add('open');
    chatToggle.classList.add('open');
    if (window.innerWidth <= 768) chatPanel.style.maxHeight = (window.innerHeight - 160) + 'px';
    chatInput?.focus();
    scrollMsgs();
  }

  function closeChat() {
    chatPanel.classList.remove('open');
    chatToggle.classList.remove('open');
  }

  chatToggle?.addEventListener('click', () => chatPanel.classList.contains('open') ? closeChat() : openChat());
  chatClose?.addEventListener('click', closeChat);
  window.addEventListener('resize', () => {
    if (chatPanel?.classList.contains('open'))
      chatPanel.style.maxHeight = window.innerWidth <= 768 ? (window.innerHeight - 160) + 'px' : '';
  });

  function addBubble(text, isUser = false) {
    const wrap = document.createElement('div');
    wrap.className = `chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`;
    if (!isUser) {
      const av = document.createElement('div');
      av.className = 'bav'; av.innerHTML = '<i class="fas fa-tooth"></i>';
      wrap.appendChild(av);
    }
    const txt = document.createElement('div');
    txt.className = 'btxt'; txt.textContent = text;
    wrap.appendChild(txt);
    chatMsgs.appendChild(wrap);
    scrollMsgs();
  }

  function showTyping() {
    const wrap = document.createElement('div');
    wrap.id = 'typing'; wrap.className = 'chat-bubble bot-bubble';
    const av = document.createElement('div');
    av.className = 'bav'; av.innerHTML = '<i class="fas fa-tooth"></i>';
    wrap.appendChild(av);
    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    wrap.appendChild(dots);
    chatMsgs.appendChild(wrap);
    scrollMsgs();
  }

  function hideTyping() { document.getElementById('typing')?.remove(); }

  async function sendMsg() {
    const text = chatInput?.value.trim();
    if (!text || chatSend.disabled) return;
    chatInput.value = '';
    chatSend.disabled = true; chatInput.disabled = true;
    addBubble(text, true);
    showTyping();
    try {
      const reply = await askGroq(text);
      hideTyping();
      addBubble(reply, false);
    } catch (err) {
      hideTyping();
      console.error('Chatbot error:', err.message);
      addBubble('Sorry, I had trouble connecting. Please call/WhatsApp +91-7051111411. Error: ' + err.message, false);
    } finally {
      chatSend.disabled = false; chatInput.disabled = false; chatInput.focus();
    }
  }

  chatSend?.addEventListener('click', sendMsg);
  chatInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (chatInput && !chatSend.disabled) { chatInput.value = chip.dataset.q || ''; sendMsg(); }
    });
  });

  console.log('✓ Access Dental — proxy chatbot loaded. Endpoint:', CHAT_ENDPOINT);
});
