// SELF-NOTE: This file contains all the JavaScript that makes my website interactive and animated.

// --- SCRIPT 1: Interactive Particle Animation ---
// This script creates the animated lines in the background that follow the mouse.
function initInteractiveCircuit() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleColor = 'rgba(245, 245, 245, 0.7)';
    const lineColor = 'rgba(212, 175, 55, 0.4)';
    const mouseLineColor = 'rgba(245, 245, 245, 0.8)';

    let particles = [];
    const particleCount = 80;
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', event => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // This 'Particle' class defines how each dot on the screen behaves.
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = Math.random() * 0.4 - 0.2; // Horizontal velocity
            this.vy = Math.random() * 0.4 - 0.2; // Vertical velocity
            this.radius = 1.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            // Bounces the particles off the edges of the screen
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // This function draws lines between particles that are close to each other and close to the mouse.
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const distance = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(212, 175, 55, ${1 - distance / 120})`;
                    ctx.lineWidth = 0.3;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            const mouseDistance = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
            if (mouseDistance < mouse.radius) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(245, 245, 245, ${1 - mouseDistance / mouse.radius})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    // The main animation loop that redraws the canvas on every frame.
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
    });
}

// --- SCRIPT 2: Fade-in & Skills Animation on Scroll ---
// This script makes sections appear smoothly as I scroll down and animates my skill bars.
function initScrollBasedAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-section, .skill-bar');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it's a regular section, fade it in.
                if (entry.target.classList.contains('fade-in-section')) {
                    entry.target.classList.add('is-visible');
                }
                // If it's a skill bar, trigger its animation.
                if (entry.target.classList.contains('skill-bar')) {
                    // Set a CSS variable with the skill level from the data attribute.
                    entry.target.style.setProperty('--skill-level', entry.target.dataset.level);
                    entry.target.classList.add('animated');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// --- SCRIPT 3: Vertical Stacking Scroll Animation ---
// This professional animation handles the project section.
function initStackingScroll() {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray('.project-card');
    
    cards.forEach((card, i) => {
        if (i < cards.length - 1) { // Pin every card except the last one
            ScrollTrigger.create({
                trigger: card,
                start: "top top",
                pin: true,
                pinSpacing: false,
            });
        }
    });
    
    // This loop creates the 'scaling down' effect as a new card slides over the old one.
    cards.forEach((card, i) => {
        if (i > 0) { // All cards except the first will animate in
            gsap.from(card.querySelector('.project-card-content'), {
                y: 100,
                opacity: 0,
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "top 50%",
                    scrub: 1,
                }
            });
        }
    });
}

// --- SCRIPT 4: Magnetic Buttons & Hero Text Reveal ---
function initEngagingAnimations() {
    // Hero Text Reveal Animation
    gsap.from(".hero-content > div > *", {
        duration: 1.2,
        opacity: 0,
        y: 50,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
    });

    // Magnetic Buttons Effect
    const magneticElements = document.querySelectorAll('.nav-link, .contact-btn');
    magneticElements.forEach(el => {
        const strength = 0.5;
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, {
                x: x * strength,
                y: y * strength,
                duration: 0.7,
                ease: "power3.out"
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

// --- SCRIPT 5: Contact Form Handling ---
// This script prepares the contact form for back-end integration.
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusMessage = document.getElementById('form-status');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents the default browser page refresh.

        // For now, this just shows a message. Later, we will add code here to send the data to our Python script.
        statusMessage.textContent = "Sending...";
        statusMessage.style.color = "var(--primary-accent)";

        // Simulate a network request
        setTimeout(() => {
            statusMessage.textContent = "Message sent successfully!";
            statusMessage.style.color = "lightgreen";
            form.reset(); // Clear the form fields
            setTimeout(() => {
                 statusMessage.textContent = "";
            }, 3000); // Clear the success message after 3 seconds
        }, 2000);
    });
}

// --- Initialize All Scripts ---
// This ensures all my JavaScript runs only after the page's HTML has fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    initInteractiveCircuit();
    initScrollBasedAnimations();
    initStackingScroll();
    initEngagingAnimations();
    initContactForm();
});

