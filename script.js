const portal = document.getElementById('madrePortal');
const triggerBtn = document.getElementById('portalTrigger');
const sectionsPanel = document.getElementById('sectionsPanel');
let portalAbierto = false;

// Abrir/Cerrar portal
triggerBtn.addEventListener('click', () => {
    if (!portalAbierto) {
        // Abrir portal
        sectionsPanel.classList.add('active');
        triggerBtn.textContent = '🌀 CERRAR PORTAL 🌀';
        portalAbierto = true;
        
        // Efecto de sacudida
        document.body.style.animation = 'shakePortal 0.3s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
        
        console.log('⚡ PORTAL ABIERTO ⚡');
    } else {
        // Cerrar portal
        sectionsPanel.classList.remove('active');
        triggerBtn.textContent = '⚡ ABRIR PORTAL ⚡';
        portalAbierto = false;
        
        console.log('🌀 PORTAL CERRADO 🌀');
    }
});

// Agregar animación de shake
const styleShake = document.createElement('style');
styleShake.textContent = `
    @keyframes shakePortal {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-5px, 5px); }
        50% { transform: translate(5px, -5px); }
        75% { transform: translate(-5px, -5px); }
    }
`;
document.head.appendChild(styleShake);

// Configurar modales
const modals = {
    inicio: document.getElementById('modalInicio'),
    personajes: document.getElementById('modalPersonajes'),
    curiosidades: document.getElementById('modalCuriosidades'),
    creatividad: document.getElementById('modalCreatividad')
};

// Abrir modal al hacer clic en cada tarjeta
document.querySelectorAll('.section-card').forEach(card => {
    card.addEventListener('click', () => {
        const section = card.dataset.section;
        if (modals[section]) {
            modals[section].style.display = 'block';
        }
    });
});

// Cerrar modales
document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Seguimiento del mouse para luces
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// Efectos del portal
portal.addEventListener('mouseenter', () => {
    portal.style.boxShadow = '0 0 180px rgba(255, 50, 0, 0.9), inset 0 0 60px rgba(0,0,0,0.8)';
    portal.style.transform = 'scale(1.02)';
});

portal.addEventListener('mouseleave', () => {
    portal.style.boxShadow = '0 0 100px rgba(255, 0, 0, 0.8), 0 0 200px rgba(255, 50, 0, 0.6)';
    portal.style.transform = 'scale(1)';
});

// Formulario
const form = document.getElementById('formCreativo');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const mensaje = document.getElementById('formMensaje');
        mensaje.textContent = '✨ ¡Tu creación ha cruzado el portal! ✨';
        mensaje.style.color = '#ff6600';
        form.reset();
        setTimeout(() => {
            mensaje.textContent = '';
        }, 3000);
    });
}

// Easter Egg
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀✨ ¡HAS CRUZADO EL PORTAL! ✨💀\n"Vecna te está observando..."');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 2000);
    }
});

// Partículas flotantes
function crearParticula() {
    const particula = document.createElement('div');
    particula.style.position = 'fixed';
    particula.style.width = '3px';
    particula.style.height = '3px';
    particula.style.backgroundColor = '#ff3300';
    particula.style.top = '0px';
    particula.style.left = Math.random() * window.innerWidth + 'px';
    particula.style.opacity = Math.random() * 0.8;
    particula.style.borderRadius = '50%';
    particula.style.pointerEvents = 'none';
    particula.style.zIndex = '999';
    document.body.appendChild(particula);
    
    let posY = 0;
    const interval = setInterval(() => {
        posY += 4;
        particula.style.transform = `translateY(${posY}px)`;
        if (posY > window.innerHeight) {
            clearInterval(interval);
            particula.remove();
        }
    }, 30);
}

setInterval(crearParticula, 200);
