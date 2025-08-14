// ===== GLOBAL VARIABLES =====
let particles = [];
let animationId;
let typingIndex = 0;
let typingText = `import torch
from transformers import pipeline

class NLPProcessor:
    def __init__(self):
        self.classifier = pipeline(
            "text-classification",
            model="bert-base-uncased"
        )
    
    def process_document(self, text):
        # Extract key information
        entities = self.extract_entities(text)
        sentiment = self.analyze_sentiment(text)
        
        return {
            "entities": entities,
            "sentiment": sentiment,
            "confidence": 0.95
        }
    
    def extract_entities(self, text):
        # Named entity recognition
        return self.classifier(text)
    
    def analyze_sentiment(self, text):
        # Sentiment analysis
        return self.classifier(text)

# Initialize processor
processor = NLPProcessor()
result = processor.process_document("Sample text")
print("Processing complete!")`;

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== LOADING SCREEN =====
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1500);
  });
}

// ===== NAVIGATION =====
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');

  // Navbar scroll effect
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 100));

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link[href^="#"]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navItems.forEach(item => item.classList.remove('active'));
        if (navItem) navItem.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', throttle(updateActiveNav, 100));
}

// ===== PARTICLE SYSTEM =====
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = `rgba(99, 102, 241, ${this.opacity})`;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}

function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  
  particlesContainer.appendChild(canvas);

  // Create particles
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(canvas));
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Draw connections
    particles.forEach((particle, i) => {
      particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });

    animationId = requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // Resize handler
  window.addEventListener('resize', debounce(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, 250));
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
  const typingElement = document.getElementById('typing-code');
  if (!typingElement) return;

  function typeText() {
    if (typingIndex < typingText.length) {
      typingElement.textContent += typingText.charAt(typingIndex);
      typingIndex++;
      setTimeout(typeText, 50);
    } else {
      // Add blinking cursor
      setInterval(() => {
        typingElement.textContent = typingElement.textContent.endsWith('|') 
          ? typingElement.textContent.slice(0, -1) 
          : typingElement.textContent + '|';
      }, 500);
    }
  }

  // Start typing after a delay
  setTimeout(typeText, 1000);
}

// ===== STATS COUNTER =====
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  // Intersection Observer for stats
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target;
        animateCounter(statNumber);
        statsObserver.unobserve(statNumber);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => statsObserver.observe(stat));
}

// ===== PROJECTS LOADING =====
async function loadProjects() {
  try {
    const response = await fetch('projects.json');
    const projects = await response.json();
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projects.map(project => `
      <article class="project-card" data-aos="fade-up">
        <div class="project-header">
          <h3 class="project-title">${project.title}</h3>
        </div>
        <p class="project-description">${project.desc}</p>
        <div class="project-tech">
          ${getProjectTech(project.title)}
        </div>
        <div class="project-links">
          ${project.links.map(link => `
            <a href="${link.href}" target="_blank" rel="noopener" class="btn btn-outline">
              ${link.label}
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          `).join('')}
        </div>
      </article>
    `).join('');

    // Add animation delay to each project card
    const projectCards = projectsGrid.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });

  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

function getProjectTech(projectTitle) {
  const techMap = {
    'BC Environment NLP Pipeline': ['Python', 'BERT', 'NLP', 'Ollama', 'ROUGE'],
    'Lay Summarisation Pipeline': ['Python', 'Transformers', 'Biomedical', 'Evaluation'],
    'Detoxification LLM Dataflow': ['Python', 'Data Curation', 'Toxicity', 'Workflow'],
    'Movie Review Corpus and UI': ['Python', 'Corpus', 'Annotation', 'UI', 'GPT']
  };

  const tech = techMap[projectTitle] || ['Python', 'Machine Learning'];
  return tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
}

// ===== SKILLS ANIMATION =====
function initSkillsAnimation() {
  const skillBars = document.querySelectorAll('.skill-bar');
  
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        const level = skillBar.getAttribute('data-level');
        skillBar.style.transform = `scaleX(${level / 100})`;
        skillsObserver.unobserve(skillBar);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => skillsObserver.observe(bar));
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (!backToTopBtn) return;

  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, 100));

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== FORM HANDLING =====
function initContactForm() {
  const form = document.querySelector('.contact-form');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = `
      <span>Sending...</span>
      <svg class="btn-icon animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
    `;
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showNotification('Message sent successfully!', 'success');
        form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  const animatedElements = document.querySelectorAll('.section, .project-card, .timeline-item, .skill-item, .contact-item');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ===== CURSOR EFFECT =====
function initCursorEffect() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: var(--primary);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.1s ease;
    opacity: 0;
  `;
  
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
}

// ===== YEAR UPDATER =====
function updateYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initNavigation();
  initParticles();
  initTypingAnimation();
  // Stats removed
  loadProjects();
  initSkillsAnimation();
  initSmoothScrolling();
  initBackToTop();
  initContactForm();
  initScrollAnimations();
  initCursorEffect();
  updateYear();
});

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Preload critical resources
function preloadResources() {
  const criticalImages = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=630&fit=crop'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Service Worker registration with aggressive update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        // Attempt immediate update
        registration.update();

        // If there's an updated worker waiting, activate it
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // When a new worker is found, ask it to skip waiting once installed
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch(error => {
        console.log('SW registration failed: ', error);
      });

    // Reload the page when the active service worker changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  });
}

// ===== EXPORT FOR MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initLoadingScreen,
    initNavigation,
    initParticles,
    initTypingAnimation,
    initStatsCounter,
    loadProjects,
    initSkillsAnimation,
    initSmoothScrolling,
    initBackToTop,
    initContactForm,
    initScrollAnimations,
    initCursorEffect,
    updateYear
  };
}
