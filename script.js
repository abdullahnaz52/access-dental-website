// Force WhatsApp button display on mobile
function checkAndShowWhatsAppButton() {
    const whatsappBtn = document.querySelector('.floating-whatsapp-mobile');
    if (whatsappBtn && window.innerWidth <= 768) {
        whatsappBtn.style.display = 'flex';
        console.log('WhatsApp button should be visible on mobile');
    }
}

// Check on load and resize
window.addEventListener('load', checkAndShowWhatsAppButton);
window.addEventListener('resize', checkAndShowWhatsAppButton);

// Also add this to DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    checkAndShowWhatsAppButton();
    
    // Test social links
    const socialLinks = document.querySelectorAll('.social-icon');
    console.log('Social links found:', socialLinks.length);
    
    socialLinks.forEach(link => {
        console.log('Social link:', link.href, link.className);
    });
});

// Mobile Menu Functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const navUl = document.querySelector('nav ul');

// Show menu when hamburger is clicked
mobileMenuBtn.addEventListener('click', function() {
    navUl.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Hide menu when close button is clicked
mobileMenuClose.addEventListener('click', function() {
    navUl.classList.remove('active');
    document.body.style.overflow = '';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        navUl.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideNav = navUl.contains(event.target);
    const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);
    const isClickOnCloseBtn = mobileMenuClose.contains(event.target);
    
    if (navUl.classList.contains('active') && 
        !isClickInsideNav && 
        !isClickOnMenuBtn &&
        !isClickOnCloseBtn) {
        navUl.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close menu on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && navUl.classList.contains('active')) {
        navUl.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close menu on window resize (if resizing to desktop)
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        navUl.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Auto slide change
let slideInterval = setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Pause slider on hover
const slider = document.querySelector('.hero-slider');
slider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

slider.addEventListener('mouseleave', () => {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
});

// Testimonial Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.testimonial-dot');

function showTestimonial(n) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    currentTestimonial = (n + testimonials.length) % testimonials.length;
    
    testimonials[currentTestimonial].classList.add('active');
    testimonialDots[currentTestimonial].classList.add('active');
}

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => showTestimonial(index));
});

// Auto testimonial change
setInterval(() => {
    showTestimonial(currentTestimonial + 1);
}, 6000);

// Chatbot functionality
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotInput = document.querySelector('.chatbot-input input');
const chatbotSend = document.querySelector('.chatbot-input button');
const chatbotMessages = document.querySelector('.chatbot-messages');

chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
});

// Predefined responses for the chatbot
const dentalResponses = {
    'hello': 'Hello! How can I assist you with your dental health today?',
    'hi': 'Hi there! What dental questions do you have for me?',
    'how are you': 'I\'m functioning well, thank you! How can I help with your dental concerns?',
    'appointment': 'To book an appointment, you can call us at +91-7051111411 or use the appointment form on our website.',
    'hours': 'Our clinic is open Monday to Saturday from 9:00 AM to 7:00 PM.',
    'services': 'We offer a wide range of dental services including orthodontic treatment, dental implants, teeth whitening, root canal treatment, crowns and bridges, and pediatric dentistry.',
    'braces': 'We offer various orthodontic treatments including traditional braces and clear aligners. The treatment duration depends on your specific needs.',
    'whitening': 'Our professional teeth whitening can brighten your smile by several shades. Results typically last 6-12 months with proper care.',
    'implant': 'Dental implants are a permanent solution for missing teeth. The procedure involves placing a titanium post in the jawbone that acts as an artificial tooth root.',
    'root canal': 'A root canal treatment is needed when the pulp inside your tooth becomes infected. The procedure is performed under local anesthesia and is generally painless.',
    'pain': 'If you\'re experiencing dental pain, we recommend scheduling an appointment as soon as possible. In the meantime, you can rinse with warm salt water and avoid chewing on that side.',
    'children': 'We provide specialized pediatric dental care in a child-friendly environment. It\'s recommended that children have their first dental visit by age 1 or within 6 months of their first tooth.',
    'cleaning': 'Regular dental cleanings are important for maintaining oral health. We recommend cleanings every 6 months for most patients.',
    'emergency': 'For dental emergencies, please call us immediately at +91-7051111411. We\'ll do our best to see you as soon as possible.',
    'cost': 'The cost of dental treatments varies depending on the procedure. We offer competitive pricing and can discuss payment options during your consultation.',
    'insurance': 'We accept most dental insurance plans. Please bring your insurance information to your appointment so we can verify your coverage.',
    'default': 'I specialize in dental health information. Could you please ask me a question related to dental care, treatments, or our services?'
};

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = message;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getResponse(userMessage) {
    userMessage = userMessage.toLowerCase();
    
    // Check for specific keywords in the user's message
    for (const keyword in dentalResponses) {
        if (userMessage.includes(keyword)) {
            return dentalResponses[keyword];
        }
    }
    
    // If no specific keyword matches, use the default response
    return dentalResponses['default'];
}

chatbotSend.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
        addMessage(message, true);
        chatbotInput.value = '';
        
        // Simulate typing delay
        setTimeout(() => {
            const response = getResponse(message);
            addMessage(response);
        }, 1000);
    }
}

// Form submission
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your appointment request! We will contact you shortly to confirm your booking.');
    this.reset();
});

// Scroll animations
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.service-card, .specialist-card, .about-image img');
    
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        
        // If element is in viewport
        if(position.top < window.innerHeight && position.bottom >= 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Initialize elements with hidden state
document.querySelectorAll('.service-card, .specialist-card, .about-image img').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Trigger scroll event on load to show initial elements
window.dispatchEvent(new Event('scroll'));

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced image loading with fallback
document.addEventListener('DOMContentLoaded', function() {
    const specialistImages = document.querySelectorAll('.specialist-image-circle img');
    
    specialistImages.forEach(img => {
        // Check if image loaded successfully
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const container = this.parentElement;
            const fallbackIcon = document.createElement('div');
            fallbackIcon.className = 'doctor-icon';
            fallbackIcon.innerHTML = '<i class="fas fa-user-md"></i>';
            fallbackIcon.style.display = 'flex';
            fallbackIcon.style.alignItems = 'center';
            fallbackIcon.style.justifyContent = 'center';
            fallbackIcon.style.width = '100%';
            fallbackIcon.style.height = '100%';
            fallbackIcon.style.fontSize = '3rem';
            fallbackIcon.style.color = 'var(--primary)';
            container.appendChild(fallbackIcon);
        });
        
        // Preload and fade in images
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'var(--shadow)';
    }
});

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Access Dental Care website loaded successfully!');
    
    // Add loading animation to logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.animation = 'logoEntrance 1s ease-out 0.5s forwards';
    }
    
    // Test if mobile WhatsApp button exists and is visible
    const whatsappBtn = document.querySelector('.floating-whatsapp-mobile');
    if (whatsappBtn && window.innerWidth <= 768) {
        console.log('Mobile WhatsApp button is active');
    }
});
// Enhanced Chatbot for Mobile Visibility
function initChatbotMobile() {
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    
    if (!chatbotWindow) return;
    
    // Ensure chat window fits on screen when opened
    chatbotToggle.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            // Force recalc to ensure proper sizing
            setTimeout(() => {
                const windowHeight = window.innerHeight;
                const maxHeight = windowHeight - 150; // Account for header and safe areas
                chatbotWindow.style.maxHeight = maxHeight + 'px';
                
                // Scroll to bottom
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 50);
        }
    });
    
    // Auto-scroll to bottom when new messages are added
    const observer = new MutationObserver(() => {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    });
    
    observer.observe(chatbotMessages, {
        childList: true,
        subtree: true
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && chatbotWindow.classList.contains('active')) {
            const windowHeight = window.innerHeight;
            const maxHeight = windowHeight - 150;
            chatbotWindow.style.maxHeight = maxHeight + 'px';
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initChatbotMobile();
});
