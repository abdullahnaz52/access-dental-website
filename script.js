// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('nav ul').classList.remove('active');
    });
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
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

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