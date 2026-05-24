// ========== PORTAL Y NAVEGACIÓN ==========
const portal = document.getElementById('madrePortal');
const cerrarBtn = document.getElementById('cerrarPortalBtn');

// Luces al mover mouse
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// Cerrar portal - volver a la página principal
if (cerrarBtn) {
    cerrarBtn.addEventListener('click', () => {
        document.body.style.animation = 'shakePortal 0.3s ease-in-out';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    });
}

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
if (portal) {
    portal.addEventListener('mouseenter', () => {
        portal.style.boxShadow = '0 0 180px rgba(255, 50, 0, 0.9), inset 0 0 60px rgba(0,0,0,0.8)';
        portal.style.transform = 'scale(1.02)';
    });

    portal.addEventListener('mouseleave', () => {
        portal.style.boxShadow = '0 0 100px rgba(255, 0, 0, 0.8), 0 0 200px rgba(255, 50, 0, 0.6)';
        portal.style.transform = 'scale(1)';
    });
}

// ========== MODALES ==========
const tarjetas = document.querySelectorAll('.tarjeta');
const modales = {
    inicio: document.getElementById('modalInicio'),
    personajes: document.getElementById('modalPersonajes'),
    curiosidades: document.getElementById('modalCuriosidades'),
    creatividad: document.getElementById('modalCreatividad')
};

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const modalKey = tarjeta.getAttribute('data-modal');
        if (modales[modalKey]) {
            modales[modalKey].style.display = 'block';
        }
    });
});

// Cerrar modales con la X
const cerrarBtns = document.querySelectorAll('.cerrar-modal');
cerrarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        Object.values(modales).forEach(modal => {
            if (modal) modal.style.display = 'none';
        });
    });
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// ========== ESTUDIO DE DIBUJO ==========
const canvas = document.getElementById('lienzoDibujo');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let dibujando = false;
    let colorActual = '#ff0000';
    
    canvas.width = 300;
    canvas.height = 300;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const colores = document.querySelectorAll('.color-btn');
    colores.forEach(btn => {
        btn.addEventListener('click', () => {
            colores.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            colorActual = btn.getAttribute('data-color');
        });
    });
    
    const rojoBtn = document.querySelector('.color-btn[data-color="#ff0000"]');
    if (rojoBtn) rojoBtn.classList.add('activo');
    
    function empezarDibujar(e) {
        dibujando = true;
        dibujar(e);
        e.preventDefault();
    }
    
    function dejarDibujar() {
        dibujando = false;
        ctx.beginPath();
    }
    
    function dibujar(e) {
        if (!dibujando) return;
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let x, y;
        if (e.touches) {
            x = (e.touches[0].clientX - rect.left) * scaleX;
            y = (e.touches[0].clientY - rect.top) * scaleY;
        } else {
            x = (e.clientX - rect.left) * scaleX;
            y = (e.clientY - rect.top) * scaleY;
        }
        
        x = Math.min(Math.max(0, x), canvas.width);
        y = Math.min(Math.max(0, y), canvas.height);
        
        ctx.strokeStyle = colorActual;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    
    canvas.addEventListener('mousedown', empezarDibujar);
    canvas.addEventListener('mouseup', dejarDibujar);
    canvas.addEventListener('mousemove', dibujar);
    canvas.addEventListener('mouseleave', dejarDibujar);
    canvas.addEventListener('touchstart', empezarDibujar);
    canvas.addEventListener('touchend', dejarDibujar);
    canvas.addEventListener('touchmove', dibujar);
    canvas.addEventListener('touchcancel', dejarDibujar);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    const limpiarBtn = document.getElementById('limpiarLienzo');
    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', () => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }
    
    const descargarBtn = document.getElementById('descargarDibujo');
    if (descargarBtn) {
        descargarBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `stranger_things_dibujo_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    }
}

// ========== FORMULARIO ==========
const formulario = document.getElementById('formCreativo');
const mensajeForm = document.getElementById('mensajeForm');

if (formulario) {
    const nuevoForm = formulario.cloneNode(true);
    formulario.parentNode.replaceChild(nuevoForm, formulario);
    
    nuevoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (mensajeForm) {
            mensajeForm.textContent = '✨ ¡Tu dibujo ha cruzado el portal! ✨';
            mensajeForm.style.color = '#ff6600';
        }
        nuevoForm.reset();
        setTimeout(() => {
            if (mensajeForm) mensajeForm.textContent = '';
        }, 3000);
    });
}

// ========== PARTÍCULAS ==========
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
    
    let y = 0
