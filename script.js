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

(function() {
    // Cria o canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'circuit-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let circuits = [];
    let nodes = [];

    // Configurações
    const config = {
        circuitCount: 15,
        nodeCount: 30,
        speed: 0.3,
        lineWidth: 1.5,
        nodeSize: 3
    };

    // Classe para os nós (pontos de conexão)
    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce nas bordas
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mantém dentro dos limites
            this.x = Math.max(0, Math.min(width, this.x));
            this.y = Math.max(0, Math.min(height, this.y));
        }
    }

    // Classe para os circuitos (linhas animadas)
    class Circuit {
        constructor() {
            this.reset();
        }

        reset() {
            // Escolhe direção: horizontal ou vertical
            this.isHorizontal = Math.random() > 0.5;
            
            if (this.isHorizontal) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.length = 100 + Math.random() * 200;
                this.progress = 0;
                this.direction = Math.random() > 0.5 ? 1 : -1;
            } else {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.length = 100 + Math.random() * 200;
                this.progress = 0;
                this.direction = Math.random() > 0.5 ? 1 : -1;
            }

            this.segments = this.generateSegments();
            this.speed = 0.5 + Math.random() * 1;
        }

        generateSegments() {
            const segments = [];
            let currentX = this.x;
            let currentY = this.y;
            let remainingLength = this.length;

            while (remainingLength > 0) {
                const segmentLength = 20 + Math.random() * 60;
                const actualLength = Math.min(segmentLength, remainingLength);

                // Alterna entre horizontal e vertical
                if (segments.length % 2 === 0) {
                    currentX += actualLength * this.direction;
                } else {
                    currentY += actualLength * (Math.random() > 0.5 ? 1 : -1);
                }

                segments.push({ x: currentX, y: currentY });
                remainingLength -= actualLength;
            }

            return segments;
        }

        update() {
            this.progress += this.speed;

            if (this.progress > this.length + 50) {
                this.reset();
            }
        }

        draw(color) {
            ctx.strokeStyle = color;
            ctx.lineWidth = config.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const segmentIndex = Math.floor(this.progress / 40);
            const segmentProgress = (this.progress % 40) / 40;

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);

            // Desenha segmentos completados
            for (let i = 0; i < Math.min(segmentIndex, this.segments.length); i++) {
                ctx.lineTo(this.segments[i].x, this.segments[i].y);
            }

            // Desenha segmento atual (animado)
            if (segmentIndex < this.segments.length) {
                const prevX = segmentIndex === 0 ? this.x : this.segments[segmentIndex - 1].x;
                const prevY = segmentIndex === 0 ? this.y : this.segments[segmentIndex - 1].y;
                const nextX = this.segments[segmentIndex].x;
                const nextY = this.segments[segmentIndex].y;

                const currentX = prevX + (nextX - prevX) * segmentProgress;
                const currentY = prevY + (nextY - prevY) * segmentProgress;

                ctx.lineTo(currentX, currentY);
            }

            ctx.stroke();

            // Desenha ponto brilhante na ponta
            if (segmentIndex < this.segments.length) {
                const prevX = segmentIndex === 0 ? this.x : this.segments[segmentIndex - 1].x;
                const prevY = segmentIndex === 0 ? this.y : this.segments[segmentIndex - 1].y;
                const nextX = this.segments[segmentIndex].x;
                const nextY = this.segments[segmentIndex].y;

                const currentX = prevX + (nextX - prevX) * segmentProgress;
                const currentY = prevY + (nextY - prevY) * segmentProgress;

                // Tamanho da bolinha varia com o tema
                const isLightMode = document.body.classList.contains('light-mode');
                const glowSize = isLightMode ? 4 : 8;
                
                const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, glowSize);
                gradient.addColorStop(0, color.replace('0.15', '0.6'));
                gradient.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(currentX, currentY, glowSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Função para obter a cor baseada no tema
    function getColor() {
        const isLightMode = document.body.classList.contains('light-mode');
        return isLightMode ? 'rgba(150, 150, 150, 0.15)' : 'rgba(220, 38, 38, 0.15)';
    }

    // Redimensiona o canvas
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        // Reinicia os circuitos e nós
        circuits = [];
        nodes = [];

        for (let i = 0; i < config.circuitCount; i++) {
            circuits.push(new Circuit());
        }

        for (let i = 0; i < config.nodeCount; i++) {
            nodes.push(new Node());
        }
    }

    // Loop de animação
    function animate() {
        ctx.clearRect(0, 0, width, height);

        const color = getColor();

        // Atualiza e desenha circuitos
        circuits.forEach(circuit => {
            circuit.update();
            circuit.draw(color);
        });

        // Atualiza e desenha nós
        ctx.fillStyle = color;
        nodes.forEach(node => {
            node.update();
            ctx.beginPath();
            ctx.arc(node.x, node.y, config.nodeSize, 0, Math.PI * 2);
            ctx.fill();
        });

        // Desenha conexões entre nós próximos
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.strokeStyle = color.replace('0.15', opacity.toString());
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Inicia
    resize();
    window.addEventListener('resize', resize);
    animate();

    // Observer para mudanças de tema
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                // O tema mudou, a cor será atualizada no próximo frame
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
})();

// Carrega o tema ao iniciar
loadTheme();
