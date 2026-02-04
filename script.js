// --- Table of Contents Scroll-Spy & Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const toc = document.querySelector('.toc');
    const tocToggle = document.querySelector('.toc-toggle');
    const tocLinks = Array.from(document.querySelectorAll('.toc-item a'));
    const sections = tocLinks
        .map(link => link.getAttribute('data-section'))
        .map(id => document.getElementById(id))
        .filter(Boolean);

    // Toggle for mobile
    if (toc && tocToggle) {
        const setExpanded = (expanded) => {
            toc.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            tocToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        };
        setExpanded(false);
        tocToggle.addEventListener('click', () => {
            const isOpen = toc.getAttribute('aria-expanded') === 'true';
            setExpanded(!isOpen);
        });
    }

    // Smooth scroll on ToC clicks (ensure selection highlight updates promptly)
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow default anchor behavior, but close mobile panel
            if (toc) toc.setAttribute('aria-expanded', 'false');
            // Briefly mark as active to give immediate feedback
            setActiveLink(link);
            
            // Only play audio if story is already playing
            const sectionId = link.getAttribute('data-section');
            if (sectionId && sectionId !== 'coven') {
                // Check if story system exists and story is currently playing
                if (window.storySystem && window.storySystem.playFromSection && window.storySystem.isPlaying && window.storySystem.isPlaying()) {
                    // Use the story system to play this section (with subsections and continuation)
                    window.storySystem.playFromSection(sectionId);
                }
            }
        });
    });

    // IntersectionObserver to highlight current section
    const setActiveLink = (activeEl) => {
        tocLinks.forEach(a => a.classList.remove('active'));
        if (activeEl) activeEl.classList.add('active');
    };

    const linkById = (id) => tocLinks.find(a => a.getAttribute('data-section') === id);

    const observer = new IntersectionObserver((entries) => {
        // Pick the entry with the largest intersection ratio near viewport top
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
            const id = visible[0].target.id;
            const link = linkById(id);
            if (link) setActiveLink(link);
        }
    }, {
        root: null,
        threshold: [0.3, 0.6],
        rootMargin: '-20% 0px -60% 0px' // favor top-half visibility
    });

    sections.forEach(sec => observer.observe(sec));

    // Fallback: center-line based detection (active only past halfway point)
    const updateActiveByScroll = () => {
        const center = window.innerHeight / 2; // viewport midpoint
        let activeSection = null;

        // Prefer the section that spans the center line
        for (const sec of sections) {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= center && rect.bottom >= center) {
                activeSection = sec;
                break;
            }
        }

        // If none spans the center, pick the nearest edge to center
        if (!activeSection) {
            let best = null;
            let bestDist = Infinity;
            sections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                const dist = Math.min(Math.abs(rect.top - center), Math.abs(rect.bottom - center));
                if (dist < bestDist) { bestDist = dist; best = sec; }
            });
            activeSection = best;
        }

        if (activeSection) {
            const link = linkById(activeSection.id);
            if (link) setActiveLink(link);
        }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveByScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    window.addEventListener('resize', updateActiveByScroll);
    // Initial highlight on load
    updateActiveByScroll();
});
// Custom Cursor - Magic Wand with Sparkles
const cursor = document.querySelector('.custom-cursor');
let lastX = 0;
let lastY = 0;
let sparkleTimer = 0;

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Calculate movement distance
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Create sparkles when moving
    if (distance > 5) {
        sparkleTimer++;
        if (sparkleTimer % 2 === 0) { // Create sparkle every other movement
            createSparkle(e.clientX, e.clientY);
        }
    }
    
    lastX = e.clientX;
    lastY = e.clientY;
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = (x - 8) + 'px';
    sparkle.style.top = (y - 8) + 'px';
    
    // Random direction for sparkle movement
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 30;
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;
    
    sparkle.style.setProperty('--x', moveX + 'px');
    sparkle.style.setProperty('--y', moveY + 'px');
    
    document.body.appendChild(sparkle);
    
    // Remove sparkle after animation
    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.parallax-bg');
    
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    if (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    }
});

// Make hero section visible immediately
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    heroSection.style.opacity = '1';
    heroSection.style.transform = 'translateY(0)';
}

// Ensure all sections become visible (fallback)
setTimeout(() => {
    document.querySelectorAll('section').forEach(section => {
        if (section && section.style.opacity === '0') {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}, 100);

// Card hover effects
const cards = document.querySelectorAll('.pillar-card, .wizard-card, .upgrade-card, .vision-item');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Decrypt text effect on hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let iteration = 0;
    
    const decryptInterval = setInterval(() => {
        heroTitle.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iteration) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        if (iteration >= originalText.length) {
            clearInterval(decryptInterval);
        }
        
        iteration += 1 / 3;
    }, 30);
}

// Glitch effect on trial section
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    setInterval(() => {
        glitchText.style.textShadow = `
            ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px var(--neon-green),
            ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px var(--purple)
        `;
    }, 100);
}

// Portal animation enhancement
const portalRings = document.querySelectorAll('.portal-ring');
portalRings.forEach((ring, index) => {
    ring.style.animationDelay = `${index * 0.5}s`;
});

// Wizard cards constellation effect
const wizardCards = document.querySelectorAll('.wizard-card');
wizardCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.animation = 'fadeIn 0.5s ease forwards';
});

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Crystal ball interactive glow
const crystalBall = document.querySelector('.ball');
if (crystalBall) {
    crystalBall.addEventListener('mousemove', (e) => {
        const rect = crystalBall.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        crystalBall.style.background = `
            radial-gradient(circle at ${x}% ${y}%, rgba(57, 255, 20, 0.5), transparent),
            radial-gradient(circle at ${100-x}% ${100-y}%, rgba(107, 76, 154, 0.3), transparent),
            var(--void-black)
        `;
    });
}

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--neon-green), var(--purple));
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Particle effect for hero section
function createParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--neon-green);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random()};
            animation: float ${5 + Math.random() * 10}s ease-in-out infinite;
            box-shadow: 0 0 10px var(--neon-green);
        `;
        heroSection.appendChild(particle);
    }
}

createParticles();

// Log page load
console.log('%c🧙‍♂️ Green Team 2025 - A Year of Wizardry', 'color: #39ff14; font-size: 20px; font-weight: bold;');
console.log('%cBuilding the Future, One Spell at a Time.', 'color: #c0c0c0; font-size: 14px;');
// ========================================
// SPELLBOOK SECTION ENHANCEMENTS
// ========================================

// Animated particles for spell cards
function createSpellParticles() {
    const spellParticles = document.querySelectorAll('.spell-particles');
    
    spellParticles.forEach(container => {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 3 + 1;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: var(--neon-green);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: 0;
                animation: particle-float ${duration}s ease-in-out ${delay}s infinite;
                box-shadow: 0 0 5px var(--neon-green);
            `;
            
            container.appendChild(particle);
        }
    });
    
    // Add particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particle-float {
            0%, 100% {
                opacity: 0;
                transform: translateY(0) scale(1);
            }
            50% {
                opacity: 0.8;
                transform: translateY(-30px) scale(1.2);
            }
        }
    `;
    document.head.appendChild(particleStyle);
}

// Counter animation for time badges
function animateCounters() {
    const timeNumbers = document.querySelectorAll('.time-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                let currentValue = 0;
                const increment = finalValue / 50;
                const duration = 1500;
                const stepTime = duration / 50;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        target.textContent = finalValue;
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(currentValue);
                    }
                }, stepTime);
                
                target.dataset.animated = 'true';
            }
        });
    }, observerOptions);
    
    timeNumbers.forEach(number => observer.observe(number));
}

// Interactive spell cards
function enhanceSpellCards() {
    const spellCards = document.querySelectorAll('.spell-card');
    
    spellCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add sparkle effect on click
        card.addEventListener('click', function(e) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: var(--neon-green);
                border-radius: 50%;
                left: ${e.offsetX}px;
                top: ${e.offsetY}px;
                pointer-events: none;
                animation: sparkle-burst 0.6s ease-out forwards;
                box-shadow: 0 0 20px var(--neon-green);
            `;
            this.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 600);
        });
    });
    
    // Add sparkle animation
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkle-burst {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(3);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(sparkleStyle);
}

// Trait cards reveal animation
function animateTraitCards() {
    const traitCards = document.querySelectorAll('.trait-card');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.dataset.revealed) {
                setTimeout(() => {
                    entry.target.style.animation = 'slide-in-right 0.6s ease-out forwards';
                    entry.target.dataset.revealed = 'true';
                }, index * 150);
            }
        });
    }, observerOptions);
    
    traitCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
    
    // Add slide animation
    const slideStyle = document.createElement('style');
    slideStyle.textContent = `
        @keyframes slide-in-right {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(slideStyle);
}

// AI benefit cards stagger animation
function animateAIBenefits() {
    const benefitCards = document.querySelectorAll('.ai-benefit-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.dataset.revealed) {
                setTimeout(() => {
                    entry.target.style.animation = 'fade-in-up 0.8s ease-out forwards';
                    entry.target.dataset.revealed = 'true';
                }, index * 200);
            }
        });
    }, observerOptions);
    
    benefitCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
    
    // Add fade-in-up animation
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(fadeStyle);
}

// Interactive wizard evolution
function enhanceWizardEvolution() {
    const wizardStages = document.querySelectorAll('.wizard-stage');
    
    wizardStages.forEach(stage => {
        stage.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.wizard-avatar-evo');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        stage.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.wizard-avatar-evo');
            if (avatar) {
                avatar.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Workflow task highlight on hover
function enhanceWorkflowTasks() {
    const workflowTasks = document.querySelectorAll('.workflow-task');
    
    workflowTasks.forEach(task => {
        task.addEventListener('mouseenter', function() {
            if (this.classList.contains('highlight')) {
                this.style.transform = 'translateX(10px)';
                this.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.5)';
            }
        });
        
        task.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Velocity stage sequential reveal
function animateVelocityStages() {
    const velocityStages = document.querySelectorAll('.velocity-stage');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                velocityStages.forEach((stage, index) => {
                    if (!stage.dataset.revealed) {
                        setTimeout(() => {
                            stage.style.animation = 'pop-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                            stage.dataset.revealed = 'true';
                        }, index * 300);
                    }
                });
            }
        });
    }, observerOptions);
    
    if (velocityStages.length > 0) {
        velocityStages.forEach(stage => stage.style.opacity = '0');
        observer.observe(velocityStages[0]);
    }
    
    // Add pop-in animation
    const popStyle = document.createElement('style');
    popStyle.textContent = `
        @keyframes pop-in {
            from {
                opacity: 0;
                transform: scale(0.5);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(popStyle);
}

// Excellence pillars wave effect
function animateExcellencePillars() {
    const pillars = document.querySelectorAll('.excellence-pillar');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                pillars.forEach((pillar, index) => {
                    if (!pillar.dataset.revealed) {
                        setTimeout(() => {
                            pillar.style.animation = 'bounce-in 0.6s ease-out forwards';
                            pillar.dataset.revealed = 'true';
                        }, index * 200);
                    }
                });
            }
        });
    }, observerOptions);
    
    if (pillars.length > 0) {
        pillars.forEach(pillar => pillar.style.opacity = '0');
        observer.observe(pillars[0]);
    }
    
    // Add bounce-in animation
    const bounceStyle = document.createElement('style');
    bounceStyle.textContent = `
        @keyframes bounce-in {
            0% {
                opacity: 0;
                transform: translateY(-50px);
            }
            60% {
                opacity: 1;
                transform: translateY(10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(bounceStyle);
}


// Initialize all spellbook enhancements
function initSpellbookEffects() {
    try {
        createSpellParticles();
        animateCounters();
        enhanceSpellCards();
        animateTraitCards();
        animateAIBenefits();
        enhanceWizardEvolution();
        enhanceWorkflowTasks();
        animateVelocityStages();
        animateExcellencePillars();
        initAlchemyAnimations();
        console.log('%c✨ Spellbook effects initialized', 'color: #39ff14');
    } catch (error) {
        console.error('Error initializing spellbook effects:', error);
    }
}

// ========================================
// ALCHEMY SECTION ANIMATIONS
// ========================================

function initAlchemyAnimations() {
    const transmutationCards = document.querySelectorAll('.transmutation-card');
    
    if (transmutationCards.length === 0) return;
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.dataset.revealed) {
                setTimeout(() => {
                    entry.target.style.animation = 'fade-in-up 0.8s ease-out forwards';
                    entry.target.dataset.revealed = 'true';
                }, index * 150);
            }
        });
    }, observerOptions);
    
    transmutationCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpellbookEffects);
} else {
    initSpellbookEffects();
}

// --- Storytelling Audio Sequence ---
document.addEventListener('DOMContentLoaded', () => {
    const sections = [
        { 
            id: 'hero', 
            offset: 0,
            subsections: [
                { id: 'coven', time: 18, offset: -440 },
                { id: 'team-constellation', time: 21, offset: -250 },
            ]
        },
        { 
            id: 'alchemy', 
            offset: 0,
            subsections: [
                { id: 'venture-expansion', time: 12, offset: -120 },
                { id: 'value-delivery', time: 28, offset: -120 },
                // temporarily skipping because no audio for these
                // { id: 'multi-tenant-evolution', time: 9, offset: -120 },
                // { id: 'environment-consolidation', time: 12, offset: -120 },
                { id: 'knowledge-exchange', time: 37, offset: -120 }
            ]
        },
        { 
            id: 'spellbook', 
            offset: 0,
            subsections: [
                { id: 'automation-spell', time: 9, offset: 80 },
                { id: 'evolution-enchantment', time: 19, offset: -120 },
                { id: 'ai-amplification', time: 29, offset: -120 },
                { id: 'velocity-boost', time: 37, offset: -120 }
            ]
        },
        { 
            id: 'trial', 
            offset: 100,
            subsections: []
        },
        { 
            id: 'prophecy', 
            offset: 50,
            subsections: []
        }
    ];
    let currentIndex = 0;
    let isStoryPlaying = false;
    let subsectionTimers = [];
    
    // Make these functions accessible to ToC
    window.storySystem = {
        sections,
        isPlaying: () => isStoryPlaying,
        playFromSection: (sectionId) => {
            // Find the index of the section
            const index = sections.findIndex(s => s.id === sectionId);
            if (index === -1) {
                console.warn(`Section not found: ${sectionId}`);
                return;
            }
            
            // Stop all audio first
            document.querySelectorAll('audio').forEach(a => {
                a.pause();
                a.currentTime = 0;
            });
            
            // Set current index and start playing
            currentIndex = index;
            isStoryPlaying = true;
            
            // Update button state
            if (startBtn) {
                startBtn.innerHTML = '⏸ Story Playing...';
                startBtn.disabled = true;
            }
            
            // Hide scroll indicator
            if (scrollIndicator) {
                scrollIndicator.style.display = 'none';
            }
            
            playCurrentSection();
        }
    };

    const startBtn = document.getElementById('startStoryBtn');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const sortingHat = document.getElementById('sortingHat');

    function clearSubsectionTimers() {
        subsectionTimers.forEach(timer => clearTimeout(timer));
        subsectionTimers = [];
    }

    function scrollToElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element not found: ${elementId}`);
            return;
        }
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const scrollPosition = elementTop + offset;
        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }

    function scheduleSubsectionScrolls(sectionConfig, audio) {
        clearSubsectionTimers();
        
        if (!sectionConfig.subsections || sectionConfig.subsections.length === 0) {
            return;
        }

        sectionConfig.subsections.forEach(subsection => {
            const timer = setTimeout(() => {
                console.log(`Scrolling to subsection: ${subsection.id} at ${subsection.time}s`);
                scrollToElement(subsection.id, subsection.offset);
            }, subsection.time * 1000);
            
            subsectionTimers.push(timer);
        });
    }

    function playCurrentSection() {
        if (currentIndex >= sections.length) {
            // Story complete
            clearSubsectionTimers();
            isStoryPlaying = false;
            
            // Change sorting hat back to static
            if (sortingHat) {
                sortingHat.src = 'assets/sortinghat_static.png';
            }
            
            if (startBtn) {
                startBtn.innerHTML = '▶ Begin the Journey';
                startBtn.disabled = false;
            }
            if (scrollIndicator) {
                scrollIndicator.style.display = 'flex';
            }
            console.log('Story complete!');
            return;
        }

        const sectionConfig = sections[currentIndex];
        const sectionId = sectionConfig.id;
        const section = document.getElementById(sectionId);
        const audio = document.getElementById(`audio-${sectionId}`);

        if (!section || !audio) {
            console.warn(`Section or audio not found for: ${sectionId}`);
            currentIndex++;
            playCurrentSection();
            return;
        }

        // Clear any existing subsection timers
        clearSubsectionTimers();

        // Scroll to section with offset
        scrollToElement(sectionId, sectionConfig.offset);

        // Play audio
        audio.currentTime = 0;
        const playPromise = audio.play();

        // Change sorting hat to animated version
        if (sortingHat) {
            sortingHat.src = 'assets/sortinghat_moving.gif';
        }

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log(`Playing audio for section: ${sectionId}`);
                    // Schedule subsection scrolls
                    scheduleSubsectionScrolls(sectionConfig, audio);
                })
                .catch(error => {
                    console.error(`Error playing audio for ${sectionId}:`, error);
                    // Move to next section even if audio fails
                    currentIndex++;
                    playCurrentSection();
                });
        }

        // When audio ends, move to next section
        audio.onended = () => {
            console.log(`Audio ended for section: ${sectionId}`);
            clearSubsectionTimers();
            currentIndex++;
            // Small delay before moving to next section for smoother experience
            setTimeout(() => {
                playCurrentSection();
            }, 500);
        };

        // Change sorting hat back to static when audio is paused or stopped
        audio.onpause = () => {
            if (sortingHat && !isStoryPlaying) {
                sortingHat.src = 'assets/sortinghat_static.png';
            }
        };
    }

    function startStory() {
        if (isStoryPlaying) return;

        isStoryPlaying = true;
        currentIndex = 0;

        // Update button
        if (startBtn) {
            startBtn.innerHTML = '⏸ Story Playing...';
            startBtn.disabled = true;
        }

        // Hide scroll indicator
        if (scrollIndicator) {
            scrollIndicator.style.display = 'none';
        }

        playCurrentSection();
    }

    // Attach event listener to start button
    if (startBtn) {
        startBtn.addEventListener('click', startStory);
    }
});
