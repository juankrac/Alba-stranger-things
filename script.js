// Portal Madre Interactivo
const portal = document.getElementById('madrePortal');
const triggerBtn = document.getElementById('portalTrigger');
let portalAbierto = true;

// Seguimiento del mouse para luces parpadeantes
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// Efecto de abrir/cerrar portal con más intensidad
triggerBtn.addEventListener('click', () => {
    if (portalAbierto) {
        // Cerrar portal
        portal.style.animation = 'none';
        portal.style.transform = 'scale(0.3)';
        portal.style.opacity = '0';
        portal.style.filter = 'blur(30px)';
        triggerBtn.textContent = '🌀 ABRIR PORTAL 🌀';
        portalAbierto = false;
        
        // Sonido imaginario (solo consola)
        console.log('🌀 Portal Madre cerrado...');
    } else {
        // Abrir portal con furia
        portal.style.animation = 'palpitar 1s ease-in-out infinite';
        portal.style.transform = 'scale(1)';
        portal.style.opacity = '1';
        portal.style.filter = 'blur(0px)';
        triggerBtn.textContent = '⚡ CERRAR PORTAL ⚡';
        portalAbierto = true;
        
        // Efecto de sacudida en toda la pantalla
        document.body.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
        console.log('⚡ PORTAL MADRE ABIERTO ⚡');
    }
});

// Efecto de sacudida
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-5px, 5px); }
        50% { transform: translate(5px, -5px); }
        75% { transform: translate(-5px, -5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Interacción con el portal (efecto de "tocar la carne")
portal.addEventListener('mouseenter', () => {
    portal.style.boxShadow = '0 0 180px rgba(255, 50, 0, 0.9), inset 0 0 60px rgba(0,0,0,0.8)';
    portal.style.transform = 'scale(1.02)';
});

portal.addEventListener('mouseleave', () => {
    portal.style.boxShadow = '0 0 100px rgba(255, 0, 0, 0.8), 0 0 200px rgba(255, 50, 0, 0.6)';
    portal.style.transform = 'scale(1)';
});

// Efecto de sonido imaginario al hacer clic en el portal
portal.addEventListener('click', () => {
    console.log('💀 Has tocado el portal... algo se mueve del otro lado 💀');
    // Simular latido más fuerte
    const heartbeat = document.querySelector('.heartbeat');
    heartbeat.style.animation = 'none';
    setTimeout(() => {
        heartbeat.style.animation = 'latido 0.5s infinite';
    }, 10);
    setTimeout(() => {
        heartbeat.style.animation = 'latido 1s infinite';
    }, 1000);
});

// Easter Egg: Código secreto (Ctrl + D)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀✨ ¡HAS DESCUBIERTO EL MENSAJE SECRETO! ✨💀\n"El Vecna está mirando desde el otro lado..."');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 2000);
    }
});

// Partículas rojas que caen (opcional realismo extra)
function crearParticula() {
    const particula = document.createElement('div');
    particula.classList.add('particula');
    particula.style.position = 'fixed';
    particula.style.width = '2px';
    particula.style.height = '2px';
    particula.style.backgroundColor = '#ff3300';
    particula.style.top = '0px';
    particula.style.left = Math.random() * window.innerWidth + 'px';
    particula.style.opacity = Math.random();
    particula.style.borderRadius = '50%';
    particula.style.pointerEvents = 'none';
    particula.style.zIndex = '999';
    document.body.appendChild(particula);
    
    let posY = 0;
    const interval = setInterval(() => {
        posY += 5;
        particula.style.transform = `translateY(${posY}px)`;
        if (posY > window.innerHeight) {
            clearInterval(interval);
            particula.remove();
        }
    }, 30);
}

setInterval(crearParticula, 300);
