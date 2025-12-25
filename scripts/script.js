// Small DOM utilities and page behavior extracted from index.html
document.getElementById("year").textContent = new Date().getFullYear();

const header = document.getElementById("siteHeader");
const setHeaderShadow = () => {
  if (!header) return;
  if (window.scrollY > 6) header.classList.add("shadow-lg");
  else header.classList.remove("shadow-lg");
};
window.addEventListener("scroll", setHeaderShadow, { passive: true });
setHeaderShadow();

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReduced && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}

// Hero Particle Animation
class HeroParticles {
  constructor() {
    this.container = document.querySelector('.particles-container');
    if (!this.container) {
      console.log('Particles container not found');
      return;
    }
    
    this.particles = [];
    this.particleCount = 25;
    this.init();
  }

  init() {
    // Wait a bit for DOM to be ready
    setTimeout(() => {
      this.createParticles();
      this.animate();
    }, 100);
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random starting position
      const startX = Math.random() * 100;
      const startY = Math.random() * 100 + 100; // Start below viewport
      
      particle.style.left = `${startX}%`;
      particle.style.top = `${startY}%`;
      
      // Random animation delay and duration
      const delay = Math.random() * 8;
      const duration = 8 + Math.random() * 4;
      
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      // Random size variation
      const size = 2 + Math.random() * 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      this.container.appendChild(particle);
      this.particles.push(particle);
    }
    console.log(`Created ${this.particles.length} particles`);
  }

  animate() {
    // Particles are animated via CSS, but we can add interactive effects here
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Add subtle parallax effect
      this.particles.forEach((particle, index) => {
        const speed = (index % 3 + 1) * 0.5;
        const xOffset = (x - 50) * speed * 0.1;
        const yOffset = (y - 50) * speed * 0.1;
        
        particle.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    });

    // Reset on mouse leave
    this.container.addEventListener('mouseleave', () => {
      this.particles.forEach(particle => {
        particle.style.transform = '';
      });
    });
  }
}

// Initialize particles when DOM is ready
if (!prefersReduced) {
  // Try multiple initialization methods
  const initParticles = () => {
    console.log('Attempting to initialize particles');
    const container = document.querySelector('.particles-container');
    if (container) {
      console.log('Container found, creating particles');
      new HeroParticles();
    } else {
      console.log('Container not found, retrying...');
      setTimeout(initParticles, 500);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
  } else {
    initParticles();
  }
  
  // Also try as a fallback
  window.addEventListener('load', () => {
    const container = document.querySelector('.particles-container');
    if (container && container.children.length === 0) {
      console.log('Fallback: Loading particles after window load');
      new HeroParticles();
    }
  });
} else {
  console.log('Reduced motion preferred, skipping particles');
}

const activeFilters = new Set();
const filterButtons = Array.from(document.querySelectorAll(".skill-filter"));
const cards = Array.from(document.querySelectorAll(".skill-card"));
const reset = document.getElementById("skillFilterReset");

function applySkillFilters() {
  if (activeFilters.size === 0) {
    cards.forEach((c) => (c.style.display = ""));
    return;
  }
  cards.forEach((c) => {
    const cat = c.getAttribute("data-skill-category");
    c.style.display = activeFilters.has(cat) ? "" : "none";
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-skill-filter");
    if (!key) return;
    if (activeFilters.has(key)) {
      activeFilters.delete(key);
      btn.classList.remove("bg-slate-900", "text-white", "border-slate-900");
      btn.classList.add("bg-white", "text-slate-700", "border-slate-200");
    } else {
      activeFilters.add(key);
      btn.classList.remove("bg-white", "text-slate-700", "border-slate-200");
      btn.classList.add("bg-slate-900", "text-white", "border-slate-900");
    }
    applySkillFilters();
  });
});

reset?.addEventListener("click", () => {
  activeFilters.clear();
  filterButtons.forEach((btn) => {
    btn.classList.remove("bg-slate-900", "text-white", "border-slate-900");
    btn.classList.add("bg-white", "text-slate-700", "border-slate-200");
  });
  applySkillFilters();
});
