// Smooth scroll para links internos
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

// Efeito parallax suave no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.4}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Animação dos cards ao entrar na viewport
const observerOptions = {
    threshold: 0.1,
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

document.querySelectorAll('.service-card, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Navbar background ao fazer scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    updateNavbarBackground();
    lastScroll = window.pageYOffset;
});

// Toggle de tema (Modo Claro/Escuro)
const themeToggle = document.querySelector('.checkbox');

// Carrega o tema salvo ao carregar a página
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isLightMode = savedTheme === 'light';
    
    // Aplica o tema
    document.body.classList.toggle('light-mode', isLightMode);
    themeToggle.checked = isLightMode;
    
    // Atualiza o navbar
    updateNavbarBackground();
}

// Atualiza o background do navbar baseado no tema e scroll
function updateNavbarBackground() {
    const nav = document.querySelector('nav');
    const currentScroll = window.pageYOffset;
    const isLightMode = document.body.classList.contains('light-mode');
    
    if (currentScroll > 100) {
        nav.style.background = isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 10, 10, 0.95)';
    } else {
        nav.style.background = isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 10, 10, 0.8)';
    }
}

// Ao clicar, alterna entre modo escuro e claro
themeToggle.addEventListener('change', () => {
    const isLightMode = themeToggle.checked;
    
    // Aplica o tema
    document.body.classList.toggle('light-mode', isLightMode);
    
    // Salva a preferência
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    
    // Atualiza o navbar imediatamente
    updateNavbarBackground();
});

// Carrega o tema ao iniciar
loadTheme();
