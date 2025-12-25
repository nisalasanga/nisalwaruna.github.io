// Neural Network Animation System
class NeuralNetworkAnimation {
  constructor() {
    this.container = document.getElementById('neuralNetwork');
    this.nodes = [];
    this.connections = [];
    this.dataParticles = [];
    
    this.nodeCount = 20;
    this.connectionCount = 25;
    this.dataParticleCount = 12;
    
    this.init();
  }

  init() {
    if (!this.container) return;
    
    this.createNeuralNetwork();
    this.startAnimations();
    this.setupInteraction();
  }

  createNeuralNetwork() {
    // Create neural nodes
    for (let i = 0; i < this.nodeCount; i++) {
      const node = document.createElement('div');
      node.className = 'neural-node';
      
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.dataset.x = x;
      node.dataset.y = y;
      
      // Random animation delay
      node.style.animationDelay = `${Math.random() * 3}s`;
      
      this.container.appendChild(node);
      this.nodes.push(node);
    }

    // Create neural connections
    for (let i = 0; i < this.connectionCount; i++) {
      const node1 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      const node2 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      
      if (node1 !== node2) {
        this.createConnection(node1, node2);
      }
    }

    // Create data flow particles
    for (let i = 0; i < this.dataParticleCount; i++) {
      this.createDataParticle();
    }
  }

  createConnection(node1, node2) {
    const connection = document.createElement('div');
    connection.className = 'neural-connection';
    
    const x1 = parseFloat(node1.dataset.x);
    const y1 = parseFloat(node1.dataset.y);
    const x2 = parseFloat(node2.dataset.x);
    const y2 = parseFloat(node2.dataset.y);
    
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    connection.style.width = `${distance}px`;
    connection.style.left = `${x1}px`;
    connection.style.top = `${y1}px`;
    connection.style.transform = `rotate(${angle}deg)`;
    
    connection.style.animationDelay = `${Math.random() * 2}s`;
    
    this.container.appendChild(connection);
    this.connections.push(connection);
  }

  createDataParticle() {
    const particle = document.createElement('div');
    particle.className = 'data-particle';
    
    const startNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    const endNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    
    particle.dataset.startX = startNode.dataset.x;
    particle.dataset.startY = startNode.dataset.y;
    particle.dataset.endX = endNode.dataset.x;
    particle.dataset.endY = endNode.dataset.y;
    particle.dataset.progress = '0';
    
    particle.style.left = `${startNode.dataset.x}px`;
    particle.style.top = `${startNode.dataset.y}px`;
    
    this.container.appendChild(particle);
    this.dataParticles.push(particle);
  }

  startAnimations() {
    // Animate data particles along connections
    setInterval(() => {
      this.dataParticles.forEach(particle => {
        let progress = parseFloat(particle.dataset.progress);
        progress += 0.015;
        
        if (progress >= 1) {
          // Reset particle with new random connection
          const startNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
          const endNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
          
          particle.dataset.startX = startNode.dataset.x;
          particle.dataset.startY = startNode.dataset.y;
          particle.dataset.endX = endNode.dataset.x;
          particle.dataset.endY = endNode.dataset.y;
          particle.dataset.progress = '0';
          progress = 0;
        } else {
          particle.dataset.progress = progress;
        }
        
        const startX = parseFloat(particle.dataset.startX);
        const startY = parseFloat(particle.dataset.startY);
        const endX = parseFloat(particle.dataset.endX);
        const endY = parseFloat(particle.dataset.endY);
        
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        
        particle.style.left = `${currentX}px`;
        particle.style.top = `${currentY}px`;
      });
    }, 30);

    // Randomly activate nodes
    setInterval(() => {
      const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      randomNode.classList.add('active');
      
      setTimeout(() => {
        randomNode.classList.remove('active');
      }, 1000);
    }, 1500);
  }

  setupInteraction() {
    // Mouse interaction with neural network
    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      this.nodes.forEach(node => {
        const nodeX = parseFloat(node.dataset.x);
        const nodeY = parseFloat(node.dataset.y);
        
        const distance = Math.sqrt(
          Math.pow(mouseX - nodeX, 2) + Math.pow(mouseY - nodeY, 2)
        );
        
        if (distance < 150) {
          const intensity = 1 - (distance / 150);
          node.style.transform = `scale(${1 + intensity * 0.8})`;
          node.style.opacity = 0.6 + intensity * 0.4;
        } else {
          node.style.transform = '';
          node.style.opacity = '';
        }
      });
    });

    // Resize handling
    window.addEventListener('resize', () => {
      this.recreateNetwork();
    });
  }

  recreateNetwork() {
    // Clear existing network
    this.container.innerHTML = '';
    this.nodes = [];
    this.connections = [];
    this.dataParticles = [];
    
    // Recreate with new dimensions
    this.createNeuralNetwork();
  }
}

// Initialize neural network animation
document.addEventListener('DOMContentLoaded', () => {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    new NeuralNetworkAnimation();
  }
});

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
