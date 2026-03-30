/* ═══════════════════════════════════════════════════════════
   ACCESS DENTAL CARE & ORTHODONTICS — script.js
   Chatbot: preset answers + DuckDuckGo search. No API keys.
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ═══════════════════════════════
   CLINIC KNOWLEDGE BASE
═══════════════════════════════ */
const KB = {
  appointment: {
    title: '📅 Book an Appointment',
    text: `You can book your appointment in two easy ways:\n\n• <strong>WhatsApp / Call:</strong> <a href="https://wa.me/917051111411" target="_blank">+91-7051111411</a>\n• <strong>Online Form:</strong> <a href="https://docs.google.com/forms/d/e/1FAIpQLSe-gED_btapLIEsGG2r703JaFSzgeIhJhBLE5tgZHCZd8TIAA/viewform" target="_blank">Click here to fill the form</a>\n\nWe're open <strong>Monday to Saturday, 9 AM – 7 PM</strong>. Walk-ins are also welcome!`
  },
  hours: {
    title: '🕐 Working Hours',
    text: `<strong>Clinic Hours:</strong>\n\n📅 Monday to Saturday\n⏰ 9:00 AM – 7:00 PM\n\n🚫 Sunday: Closed\n\nFor emergencies, WhatsApp us at <a href="https://wa.me/917051111411" target="_blank">+91-7051111411</a> and we'll do our best to assist you.`
  },
  doctors: {
    title: '👨‍⚕️ Our Specialists',
    text: `<strong>Dr. Sameer Malik</strong> — Orthodontist\n• MDS Orthodontics (RGUHS)\n• MFDS RCS Edinburgh\n• Fellowship in Cleft & Craniofacial Orthodontics — Sick Kids Hospital, Toronto\n• Member, Indian Society of Oral Implantology\n\n<strong>Dr. Nida Lanker</strong> — General Dentist\n• BDS — Government Dental College, Srinagar\n• University Gold Medalist in BDS\n• House Job in Oral Surgery — GDC Srinagar`
  },
  braces: {
    title: '🦷 Braces & Aligners',
    text: `We offer a full range of orthodontic treatments:\n\n• <strong>Traditional Metal Braces</strong> — reliable, most affordable\n• <strong>Ceramic Braces</strong> — tooth-coloured, less visible\n• <strong>Clear Aligners (Invisalign-style)</strong> — removable, nearly invisible\n• <strong>Retainers</strong> — post-treatment maintenance\n\nTreatment duration typically ranges from <strong>12 to 24 months</strong> depending on your case. Dr. Sameer Malik, our specialist, will create a personalised plan for you.\n\n📞 <a href="https://wa.me/917051111411" target="_blank">WhatsApp us to book a consultation</a>`
  },
  whitening: {
    title: '✨ Teeth Whitening',
    text: `Our professional teeth whitening can brighten your smile by <strong>several shades</strong> in a single session.\n\n<strong>What we offer:</strong>\n• In-clinic professional whitening\n• Safe, dentist-supervised procedure\n• Long-lasting results (6–12 months with care)\n\n<strong>Tips to maintain results:</strong>\n• Avoid tea, coffee, and tobacco\n• Use whitening toothpaste\n• Rinse after coloured foods\n\n📞 <a href="https://wa.me/917051111411" target="_blank">Book your whitening session</a>`
  },
  implants: {
    title: '🔩 Dental Implants',
    text: `Dental implants are the <strong>gold standard</strong> for replacing missing teeth — they look, feel, and function like natural teeth.\n\n<strong>The process:</strong>\n1. Consultation & X-ray assessment\n2. Titanium post placed in the jawbone\n3. Healing period (2–6 months)\n4. Custom crown attached on top\n\n<strong>Benefits:</strong>\n• Permanent & durable (can last a lifetime)\n• No slipping like dentures\n• Preserves jawbone\n• Natural appearance\n\n📞 <a href="https://wa.me/917051111411" target="_blank">Ask about implant costs & eligibility</a>`
  },
  rootcanal: {
    title: '💊 Root Canal Treatment',
    text: `A root canal saves an infected or severely decayed tooth — it's <strong>not as scary as it sounds!</strong>\n\n<strong>When you may need it:</strong>\n• Severe toothache\n• Prolonged sensitivity to hot/cold\n• Darkening of the tooth\n• Swelling or tenderness in gums\n\n<strong>Our procedure:</strong>\n• Done under local anaesthesia — virtually painless\n• Usually completed in 1–2 visits\n• Tooth is sealed with a crown afterward\n\n📞 <a href="https://wa.me/917051111411" target="_blank">Book an evaluation today</a>`
  },
  kids: {
    title: '👶 Pediatric Dentistry',
    text: `We provide <strong>specialised, gentle dental care for children</strong> in a friendly, stress-free environment.\n\n<strong>Services for kids:</strong>\n• First dental visit guidance (recommended by age 1)\n• Cavity prevention & fillings\n• Dental sealants\n• Fluoride treatments\n• Orthodontic assessment\n• Special care for children with special needs\n\nDr. Nida Lanker is especially known for being <strong>gentle and great with kids</strong> — many parents have praised her approach.\n\n📞 <a href="https://wa.me/917051111411" target="_blank">Schedule your child's appointment</a>`
  },
  about: {
    title: '🏥 About Access Dental Care',
    text: `<strong>Access Dental Care & Orthodontics</strong> is a premier dental clinic located in the heart of Srinagar, J&K.\n\n<strong>Why choose us?</strong>\n• 10+ years of excellence\n• 5000+ happy patients\n• Modern equipment & sterilisation standards\n• Experienced specialists — Dr. Sameer Malik & Dr. Nida Lanker\n• Treatments for all ages including children with special needs\n• Walk-ins welcome\n\n<strong>Services:</strong> Orthodontics, Implants, Root Canal, Crowns & Bridges, Whitening, Veneers, Extractions, Pediatric Dentistry`
  },
  contact: {
    title: '📞 Contact & Location',
    text: `<strong>Address:</strong>\nAnzimar, Khanyar, Srinagar, J&K — 190003\n\n<strong>Phone / WhatsApp:</strong>\n<a href="https://wa.me/917051111411" target="_blank">+91-7051111411</a>\n\n<strong>Email:</strong>\nShifaclinicc@gmail.com\n\n<strong>Hours:</strong>\nMon–Sat: 9:00 AM – 7:00 PM\n\n<strong>Follow us:</strong>\n• <a href="https://www.instagram.com/access_dentalcare" target="_blank">Instagram</a>\n• <a href="https://www.youtube.com/@Access_dentalcare" target="_blank">YouTube</a>\n• <a href="https://www.linkedin.com/in/sameer-ahmad-malik-531411177/" target="_blank">LinkedIn</a>`
  }
};

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
    clearInterval(slideTimer); showSlide(i);
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
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target); } });
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

  // Form submission handling with consent
const appointmentForm = document.getElementById('appointmentForm');
const submitBtn = document.getElementById('submitBtn');
const consentCheckbox = document.getElementById('consentCheckbox');

if (appointmentForm) {
  appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if consent is given
    if (!consentCheckbox.checked) {
      // Show error message
      consentCheckbox.parentElement.classList.add('error');
      
      // Create or update error message
      let errorMsg = document.querySelector('.consent-error');
      if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'consent-error';
        errorMsg.style.color = '#ef4444';
        errorMsg.style.fontSize = '0.8rem';
        errorMsg.style.marginTop = '8px';
        consentCheckbox.parentElement.parentElement.appendChild(errorMsg);
      }
      errorMsg.textContent = 'Please confirm your consent to continue.';
      
      // Scroll to checkbox
      consentCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    // Remove error state if present
    consentCheckbox.parentElement.classList.remove('error');
    const existingError = document.querySelector('.consent-error');
    if (existingError) existingError.remove();
    
    // Collect form data
    const formData = {
      name: document.getElementById('name')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      email: document.getElementById('email')?.value || '',
      service: document.getElementById('service')?.value || '',
      message: document.getElementById('message')?.value || '',
      consent: true,
      consentDate: new Date().toISOString()
    };
    
    // Store consent record (optional, for compliance)
    localStorage.setItem('formConsent', JSON.stringify({
      given: true,
      timestamp: new Date().toISOString(),
      formData: formData
    }));
    
    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-pulse"></i>';
    submitBtn.disabled = true;
    
    // Redirect to Google Form with pre-filled data (optional enhancement)
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe-gED_btapLIEsGG2r703JaFSzgeIhJhBLE5tgZHCZd8TIAA/viewform';
    
    // You can optionally pre-fill Google Form fields
    // For now, just redirect
    setTimeout(() => {
      window.open(googleFormUrl, '_blank');
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success-message';
      successMsg.style.cssText = `
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid #10b981;
        border-radius: 12px;
        padding: 12px;
        margin-top: 16px;
        text-align: center;
        color: #10b981;
      `;
      successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Redirecting to appointment form...';
      appointmentForm.appendChild(successMsg);
      
      // Reset button after redirect
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Remove success message after 5 seconds
        setTimeout(() => successMsg.remove(), 5000);
      }, 2000);
      
    }, 500);
  });
  
  // Remove error when checkbox is checked
  if (consentCheckbox) {
    consentCheckbox.addEventListener('change', function() {
      if (this.checked) {
        this.parentElement.classList.remove('error');
        const errorMsg = document.querySelector('.consent-error');
        if (errorMsg) errorMsg.remove();
      }
    });
  }
}

  /* ── Specialist image fallback ── */
  document.querySelectorAll('.spec-img-wrap img').forEach(img => {
    img.addEventListener('error', function() {
      const icon = document.createElement('div');
      icon.innerHTML = '<i class="fas fa-user-md"></i>';
      Object.assign(icon.style, { display:'flex', alignItems:'center', justifyContent:'center', width:'110px', height:'110px', borderRadius:'50%', background:'var(--surface2)', fontSize:'2.5rem', color:'var(--purple2)' });
      this.replaceWith(icon);
    });
  });

  /* ═══════════════════════════════
     CHATBOT — Preset Answers + DuckDuckGo
  ═══════════════════════════════ */
  const chatToggle   = document.getElementById('chatToggle');
  const chatPanel    = document.getElementById('chatPanel');
  const chatClose    = document.getElementById('chatClose');
  const chatMsgs     = document.getElementById('chatMsgs');
  const chatInput    = document.getElementById('chatInput');
  const chatSend     = document.getElementById('chatSend');
  const chatInputRow = document.getElementById('chatInputRow');
  const quickBtns    = document.getElementById('chatQuickBtns');

  const scrollMsgs = () => { if (chatMsgs) chatMsgs.scrollTop = chatMsgs.scrollHeight; };

  /* Open / close panel */
  function openChat() {
    chatPanel.classList.add('open');
    chatToggle.classList.add('open');
    if (window.innerWidth <= 768) chatPanel.style.maxHeight = (window.innerHeight - 160) + 'px';
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

  /* Add a bot bubble with optional HTML */
  function addBotBubble(htmlContent) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-bubble bot-bubble';
    const av = document.createElement('div');
    av.className = 'bav'; av.innerHTML = '<i class="fas fa-tooth"></i>';
    wrap.appendChild(av);
    const txt = document.createElement('div');
    txt.className = 'btxt btxt-rich';
    txt.innerHTML = htmlContent.replace(/\n/g, '<br>');
    wrap.appendChild(txt);
    chatMsgs.appendChild(wrap);
    scrollMsgs();
  }

  /* Add a user bubble */
  function addUserBubble(text) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-bubble user-bubble';
    const txt = document.createElement('div');
    txt.className = 'btxt'; txt.textContent = text;
    wrap.appendChild(txt);
    chatMsgs.appendChild(wrap);
    scrollMsgs();
  }

  /* "Back to menu" button after each answer */
  function addBackBtn() {
    const wrap = document.createElement('div');
    wrap.className = 'chat-bubble bot-bubble';
    const av = document.createElement('div');
    av.className = 'bav'; av.innerHTML = '<i class="fas fa-tooth"></i>';
    wrap.appendChild(av);
    const btn = document.createElement('button');
    btn.className = 'back-to-menu';
    btn.innerHTML = '← Back to topics';
    btn.addEventListener('click', showQuickBtns);
    wrap.appendChild(btn);
    chatMsgs.appendChild(wrap);
    scrollMsgs();
  }

  /* Show the quick topic buttons */
  function showQuickBtns() {
    quickBtns.style.display = 'flex';
    chatInputRow.style.display = 'none';
    scrollMsgs();
  }

  /* Hide quick buttons, show search input */
  function showSearchInput() {
    quickBtns.style.display = 'none';
    chatInputRow.style.display = 'flex';
    chatInput?.focus();
  }

  /* Handle topic button clicks */
  quickBtns?.querySelectorAll('.qbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;

      if (type === 'search') {
        addUserBubble('Search the web');
        addBotBubble('Sure! Type your dental question below and I\'ll search DuckDuckGo for you 🔍');
        showSearchInput();
        return;
      }

      const entry = KB[type];
      if (!entry) return;

      // Echo user selection
      addUserBubble(btn.textContent.trim());

      // Hide buttons, show answer
      quickBtns.style.display = 'none';
      chatInputRow.style.display = 'none';

      // Slight delay for feel
      setTimeout(() => {
        addBotBubble(`<strong>${entry.title}</strong><br><br>${entry.text}`);
        addBackBtn();
      }, 300);
    });
  });

  /* DuckDuckGo search */
  function doSearch() {
    const query = chatInput?.value.trim();
    if (!query) return;
    chatInput.value = '';

    addUserBubble(query);

    // Build DuckDuckGo URL — opens in new tab
    const ddgUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query + ' dental')}&ia=web`;

    addBotBubble(
      `Searching for <strong>"${query}"</strong>…<br><br>` +
      `<a href="${ddgUrl}" target="_blank" class="ddg-link">` +
      `🔍 View results on DuckDuckGo</a><br><br>` +
      `Or ask me about something else 👇`
    );
    addBackBtn();
  }

  chatSend?.addEventListener('click', doSearch);
  chatInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
  });

  console.log('✓ Access Dental — chatbot loaded (preset + DuckDuckGo)');
});
