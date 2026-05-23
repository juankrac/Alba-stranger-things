const portal = document.getElementById('portal');
const boton = document.getElementById('botonPortal');
const menu = document.getElementById('menu');
let abierto = false;

// Abrir/cerrar portal y mostrar menú
boton.addEventListener('click', () => {
    if (!abierto) {
        // Abrir portal
        menu.classList.add('mostrar');
        boton.textContent = '🌀 CERRAR PORTAL 🌀';
        portal.style.animation = 'latir 0.5s infinite';
        abierto = true;
        
        // Sacudida
        document.body.style.transform = 'translateX(5px)';
        setTimeout(() => {
            document.body.style.transform = '';
        }, 100);
    } else {
        // Cerrar portal
        menu.classList.remove('mostrar');
        boton.textContent = '⚡ ABRIR PORTAL ⚡';
        portal.style.animation = 'latir 1.5s infinite';
        abierto = false;
    }
});

// Mostrar modales al hacer clic en las secciones
const secciones = document.querySelectorAll('.seccion-btn');
const modales = document.querySelectorAll('.modal');

secciones.forEach(btn => {
    btn.addEventListener('click', () => {
        const seccionId = btn.getAttribute('data-seccion');
        const modal = document.getElementById(seccionId);
        if (modal) {
            modal.style.display = 'block';
        }
    });
});

// Cerrar modales
const cerrarBtns = document.querySelectorAll('.cerrar');
cerrarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modales.forEach(modal => {
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

// Formulario
const formulario = document.getElementById('formulario');
if (formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('✨ ¡Tu creación cruzó el portal! ✨');
        formulario.reset();
    });
}

// Partículas rojas
function crearParticula() {
    const particula = document.createElement('div');
    particula.style.position = 'fixed';
    particula.style.width = '3px';
    particula.style.height = '3px';
    particula.style.backgroundColor = '#ff3300';
    particula.style.left = Math.random() * window.innerWidth + 'px';
    particula.style.top = '0px';
    particula.style.opacity = Math.random();
    particula.style.borderRadius = '50%';
    particula.style.pointerEvents = 'none';
    document.body.appendChild(particula);
    
    let y = 0;
    const caer = setInterval(() => {
        y += 3;
        particula.style.transform = `translateY(${y}px)`;
        if (y > window.innerHeight) {
            clearInterval(caer);
            particula.remove();
        }
    }, 30);
}

setInterval(crearParticula, 200);

// Easter Egg
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀 ¡MENSAJE SECRETO! 💀\nVecna te está observando...');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 1500);
    }
});

// Efecto de luces al mover mouse
document.addEventListener('mousemove', (e) => {
    const luz = document.createElement('div');
    luz.style.position = 'fixed';
    luz.style.width = '100px';
    luz.style.height = '100px';
    luz.style.background = 'radial-gradient(circle, rgba(255,0,0,0.2), transparent)';
    luz.style.left = e.clientX - 50 + 'px';
    luz.style.top = e.clientY - 50 + 'px';
    luz.style.pointerEvents = 'none';
    luz.style.zIndex = '9999';
    document.body.appendChild(luz);
    setTimeout(() => luz.remove(), 200);
});
