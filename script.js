const portal = document.getElementById('madrePortal');
const abrirBtn = document.getElementById('abrirPortalBtn');

// Luces al mover mouse
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// Abrir portal - redirigir a la página de las tarjetas
abrirBtn.addEventListener('click', () => {
    // Efecto de sacudida antes de redirigir
    document.body.style.animation = 'shakePortal 0.3s ease-in-out';
    setTimeout(() => {
        window.location.href = 'portal-abierto.html';
    }, 300);
});

// Animación de sacudida
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shakePortal {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-5px, 5px); }
        50% { transform: translate(5px, -5px); }
        75% { transform: translate(-5px, -5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Interacción con portal
portal.addEventListener('mouseenter', () => {
    portal.style.boxShadow = '0 0 180px rgba(255, 50, 0, 0.9), inset 0 0 60px rgba(0,0,0,0.8)';
    portal.style.transform = 'scale(1.02)';
});

portal.addEventListener('mouseleave', () => {
    portal.style.boxShadow = '0 0 100px rgba(255, 0, 0, 0.8), 0 0 200px rgba(255, 50, 0, 0.6)';
    portal.style.transform = 'scale(1)';
});

// Partículas
function crearParticula() {
    const particula = document.createElement('div');
    particula.style.position = 'fixed';
    particula.style.width = '2px';
    particula.style.height = '2px';
    particula.style.backgroundColor = '#ff3300';
    particula.style.left = Math.random() * window.innerWidth + 'px';
    particula.style.top = '0px';
    particula.style.opacity = Math.random();
    particula.style.borderRadius = '50%';
    particula.style.pointerEvents = 'none';
    particula.style.zIndex = '999';
    document.body.appendChild(particula);
    
    let y = 0;
    const caer = setInterval(() => {
        y += 5;
        particula.style.transform = `translateY(${y}px)`;
        if (y > window.innerHeight) {
            clearInterval(caer);
            particula.remove();
        }
    }, 30);
}
setInterval(crearParticula, 300);

// Easter Egg
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀✨ ¡MENSAJE SECRETO! ✨💀\n"Vecna está mirando desde el otro lado..."');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 2000);
    }
});
