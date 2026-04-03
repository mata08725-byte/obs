// Sanatorium Aura - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {

    // Mobile Menu Toggle — управляется через Alpine.js, vanilla JS не нужен

    // Close mobile menu on link click — управляется через Alpine.js
    document.querySelectorAll('[data-mobile-menu-link]').forEach(link => {
        link.addEventListener('click', function() {
            // Alpine.js закроет меню через @click.away, но для надёжности:
            const body = document.body;
            // Если Alpine.js обработчик не сработает, пользователь увидит что меню закрыто
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-md');
                navbar.classList.add('bg-white/95');
            } else {
                navbar.classList.remove('shadow-md');
                navbar.classList.remove('bg-white/95');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0');
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        // Не скрываем элементы сразу, чтобы избежать проблемы с исчезновением
        // el.classList.add('opacity-0');
        observer.observe(el);
    });

    // Testimonial Slider
    const testimonialContainer = document.querySelector('[data-testimonials]');
    if (testimonialContainer) {
        const testimonials = testimonialContainer.querySelectorAll('[data-testimonial]');
        const dots = testimonialContainer.querySelectorAll('[data-testimonial-dot]');
        let currentIndex = 0;

        function showTestimonial(index) {
            testimonials.forEach((t, i) => {
                t.classList.toggle('hidden', i !== index);
            });
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentIndex = index;
                showTestimonial(currentIndex);
            });
        });

        // Auto-rotate testimonials
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }, 5000);
    }

    // Gallery Lightbox
    const lightbox = document.querySelector('[data-lightbox]');
    const lightboxImg = document.querySelector('[data-lightbox-img]');
    const lightboxClose = document.querySelector('[data-lightbox-close]');

    if (lightbox && lightboxImg) {
        document.querySelectorAll('[data-gallery-item]').forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                lightboxImg.src = imgSrc;
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                closeLightbox();
            }
        });
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    // Form validation and submission
    const forms = document.querySelectorAll('form[data-form]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });

            if (isValid) {
                // Show success message
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Отправлено! ✓';
                submitBtn.disabled = true;
                submitBtn.classList.add('bg-green-600');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('bg-green-600');
                    form.reset();
                }, 3000);
            }
        });
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('[data-counter]');
    
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + (element.getAttribute('data-suffix') || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.getAttribute('data-suffix') || '');
            }
        }, 16);
    }

    // Room booking modal
    const bookingModal = document.querySelector('[data-booking-modal]');
    const bookingModalClose = document.querySelector('[data-booking-modal-close]');

    if (bookingModal) {
        document.querySelectorAll('[data-open-booking]').forEach(btn => {
            btn.addEventListener('click', function() {
                const roomName = this.getAttribute('data-room-name');
                const roomInput = document.querySelector('[name="room"]');
                if (roomInput) {
                    roomInput.value = roomName;
                }
                bookingModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });

        if (bookingModalClose) {
            bookingModalClose.addEventListener('click', function() {
                bookingModal.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }

        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) {
                bookingModal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }

    // Filter functionality for rooms/services
    const filterButtons = document.querySelectorAll('[data-filter]');
    const filterItems = document.querySelectorAll('[data-filter-item]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(b => {
                b.classList.remove('bg-teal-600', 'text-white');
                b.classList.add('bg-stone-100', 'text-stone-600');
            });
            
            this.classList.remove('bg-stone-100', 'text-stone-600');
            this.classList.add('bg-teal-600', 'text-white');

            filterItems.forEach(item => {
                const category = item.getAttribute('data-filter-item');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Accordion functionality
    const accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const content = document.querySelector(this.getAttribute('data-accordion-trigger'));
            const parent = this.closest('[data-accordion-item]');
            const isOpen = !parent.classList.contains('active');

            // Close all other accordion items
            parent.parentElement.querySelectorAll('[data-accordion-item]').forEach(item => {
                item.classList.remove('active');
                const content = item.querySelector('[data-accordion-content]');
                if (content) {
                    content.style.maxHeight = null;
                }
            });

            if (isOpen) {
                parent.classList.add('active');
                if (content) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    // Date picker minimum date (today)
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });

    // Phone input mask (simple version)
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                if (value.length > 10) {
                    value = value.substring(0, 10);
                }
                let formatted = '+7';
                if (value.length > 0) {
                    formatted += ' (' + value.substring(0, 3);
                }
                if (value.length > 3) {
                    formatted += ') ' + value.substring(3, 6);
                }
                if (value.length > 6) {
                    formatted += '-' + value.substring(6, 8);
                }
                if (value.length > 8) {
                    formatted += '-' + value.substring(8, 10);
                }
                e.target.value = formatted;
            }
        });
    });

    console.log('Sanatorium Aura - Website loaded successfully!');
});
