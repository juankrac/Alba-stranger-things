// CERRAR PORTAL
const cerrarBtn = document.getElementById('cerrarPortalBtn');
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

if (cerrarBtn) {
    cerrarBtn.addEventListener('click', () => {
        document.body.style.animation = 'shakePortal 0.3s ease-in-out';
        setTimeout(() => { window.location.href = 'index.html'; }, 300);
    });
}

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shakePortal { 0%,100% { transform: translate(0,0); } 25% { transform: translate(-5px,5px); } 50% { transform: translate(5px,-5px); } 75% { transform: translate(-5px,-5px); } }`;
document.head.appendChild(shakeStyle);

// MODALES
const tarjetas = document.querySelectorAll('.tarjeta');
const modales = {
    inicio: document.getElementById('modalInicio'),
    personajes: document.getElementById('modalPersonajes'),
    curiosidades: document.getElementById('modalCuriosidades'),
    creatividad: document.getElementById('modalCreatividad'),
    demoguchi: document.getElementById('modalDemoguchi')
};

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const modalKey = tarjeta.getAttribute('data-modal');
        if (modales[modalKey]) {
            modales[modalKey].style.display = 'block';
            if (modalKey === 'demoguchi') iniciarDemoguchi();
        }
    });
});

const cerrarBtns = document.querySelectorAll('.cerrar-modal');
cerrarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        Object.values(modales).forEach(modal => { if (modal) modal.style.display = 'none'; });
        if (window.demoguchiInterval) clearInterval(window.demoguchiInterval);
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        if (window.demoguchiInterval) clearInterval(window.demoguchiInterval);
    }
});

// ESTUDIO DE DIBUJO
const canvas = document.getElementById('lienzoDibujo');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let dibujando = false, colorActual = '#ff0000';
    canvas.width = 300; canvas.height = 300;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            colorActual = btn.getAttribute('data-color');
        });
    });
    document.querySelector('.color-btn[data-color="#ff0000"]')?.classList.add('activo');
    
    const dibujar = (e) => {
        if (!dibujando) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
        let x, y;
        if (e.touches) { x = (e.touches[0].clientX - rect.left) * scaleX; y = (e.touches[0].clientY - rect.top) * scaleY; }
        else { x = (e.clientX - rect.left) * scaleX; y = (e.clientY - rect.top) * scaleY; }
        x = Math.min(Math.max(0, x), canvas.width); y = Math.min(Math.max(0, y), canvas.height);
        ctx.strokeStyle = colorActual; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
    };
    canvas.addEventListener('mousedown', (e) => { dibujando = true; dibujar(e); });
    canvas.addEventListener('mouseup', () => { dibujando = false; ctx.beginPath(); });
    canvas.addEventListener('mousemove', dibujar);
    canvas.addEventListener('mouseleave', () => { dibujando = false; ctx.beginPath(); });
    canvas.addEventListener('touchstart', (e) => { dibujando = true; dibujar(e); });
    canvas.addEventListener('touchend', () => { dibujando = false; ctx.beginPath(); });
    canvas.addEventListener('touchmove', dibujar);
    
    document.getElementById('limpiarLienzo').addEventListener('click', () => {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    document.getElementById('descargarDibujo').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `dibujo_${Date.now()}.png`;
        link.href = canvas.toDataURL(); link.click();
    });
}

// FORMULARIO
const formulario = document.getElementById('formCreativo');
const mensajeForm = document.getElementById('mensajeForm');
if (formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        mensajeForm.textContent = '✨ ¡Tu dibujo ha cruzado el portal! ✨';
        formulario.reset();
        setTimeout(() => mensajeForm.textContent = '', 3000);
    });
}

// ========== DEMOGUCHI - TAMAGOTCHI ==========
let demoguchiStats = {
    hambre: 100,
    felicidad: 100,
    energia: 100
};
let demoguchiInterval = null;
let estadoEmocional = "normal";
const caras = {
    feliz: "😈",
    normal: "👾",
    triste: "😢",
    hambriento: "😫",
    cansado: "😴"
};

function actualizarBarras() {
    document.getElementById('barraHambre').style.width = demoguchiStats.hambre + '%';
    document.getElementById('barraFelicidad').style.width = demoguchiStats.felicidad + '%';
    document.getElementById('barraEnergia').style.width = demoguchiStats.energia + '%';
    document.getElementById('hambreValor').innerText = Math.floor(demoguchiStats.hambre) + '%';
    document.getElementById('felicidadValor').innerText = Math.floor(demoguchiStats.felicidad) + '%';
    document.getElementById('energiaValor').innerText = Math.floor(demoguchiStats.energia) + '%';
    
    // Cambiar cara según estado
    const caraElement = document.getElementById('demoguchiCara');
    if (demoguchiStats.hambre <= 20) {
        caraElement.innerText = caras.hambriento;
        agregarMensaje("😫 ¡Tenhooo hambre! Dame de comer...");
    } else if (demoguchiStats.energia <= 20) {
        caraElement.innerText = caras.cansado;
        agregarMensaje("😴 Zzz... Estoy muy cansado, déjame dormir...");
    } else if (demoguchiStats.felicidad <= 30) {
        caraElement.innerText = caras.triste;
        agregarMensaje("😢 Estoy triste... ¿Quieres jugar conmigo?");
    } else if (demoguchiStats.felicidad >= 80 && demoguchiStats.hambre >= 70 && demoguchiStats.energia >= 70) {
        caraElement.innerText = caras.feliz;
    } else {
        caraElement.innerText = caras.normal;
    }
}

function agregarMensaje(msg) {
    const mensajesDiv = document.getElementById('demoguchiMensajes');
    const p = document.createElement('p');
    p.innerText = msg;
    mensajesDiv.appendChild(p);
    if (mensajesDiv.children.length > 5) {
        mensajesDiv.removeChild(mensajesDiv.children[0]);
    }
}

function decaerEstadisticas() {
    if (!document.getElementById('modalDemoguchi') || document.getElementById('modalDemoguchi').style.display !== 'block') {
        return;
    }
    
    demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - (Math.random() * 2 + 1));
    demoguchiStats.energia = Math.max(0, demoguchiStats.energia - (Math.random() * 1.5 + 0.5));
    
    if (demoguchiStats.hambre <= 0) {
        demoguchiStats.hambre = 0;
        demoguchiStats.felicidad = Math.max(0, demoguchiStats.felicidad - 5);
        agregarMensaje("💀 ¡CUIDADO! Demoguchi se está debilitando por el hambre...");
    }
    
    if (demoguchiStats.energia <= 0) {
        demoguchiStats.energia = 0;
        agregarMensaje("😴 Demoguchi está agotado... Duerme un poco.");
    }
    
    if (demoguchiStats.hambre > 30 && demoguchiStats.energia > 30) {
        demoguchiStats.felicidad = Math.max(0, demoguchiStats.felicidad - 1);
    }
    
    actualizarBarras();
    
    if (demoguchiStats.hambre <= 0 && demoguchiStats.energia <= 0) {
        agregarMensaje("💀 ¡OH NO! Demoguchi ha desaparecido al Upside Down... Resetea para revivirlo.");
        if (demoguchiInterval) clearInterval(demoguchiInterval);
    }
}

function alimentar(tipo) {
    let incremento = 0;
    let mensaje = "";
    switch(tipo) {
        case 'pizza':
            incremento = 25;
            mensaje = "🍕 ¡ÑAM! Le encantó la pizza. +25% hambre";
            break;
        case 'huevo':
            incremento = 15;
            mensaje = "🥚 ¡Crack! El huevo del Upside Down. +15% hambre";
            break;
        case 'carne':
            incremento = 30;
            mensaje = "🍖 ¡RAAAAWR! Devoró la carne. +30% hambre";
            break;
        case 'postre':
            incremento = 20;
            mensaje = "🍦 ¡Qué rico! El postre lo puso feliz. +20% hambre, +10% felicidad";
            demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 10);
            break;
    }
    demoguchiStats.hambre = Math.min(100, demoguchiStats.hambre + incremento);
    demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 5);
    agregarMensaje(mensaje);
    actualizarBarras();
}

function jugar() {
    if (demoguchiStats.energia >= 15) {
        demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 20);
        demoguchiStats.energia = Math.max(0, demoguchiStats.energia - 15);
        demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 10);
        agregarMensaje("🎾 ¡Jugaste con Demoguchi! +20% felicidad, -15% energía, -10% hambre");
        actualizarBarras();
    } else {
        agregarMensaje("😴 Demoguchi está muy cansado para jugar. Déjalo dormir primero.");
    }
}

function dormir() {
    demoguchiStats.energia = Math.min(100, demoguchiStats.energia + 40);
    demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 15);
    agregarMensaje("😴 Demoguchi durmió profundamente. +40% energía, -15% hambre");
    actualizarBarras();
}

function resetearDemoguchi() {
    demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
    if (demoguchiInterval) clearInterval(demoguchiInterval);
    actualizarBarras();
    agregarMensaje("🐣 ¡Demoguchi ha renacido! Cuídalo bien...");
    const mensajesDiv = document.getElementById('demoguchiMensajes');
    mensajesDiv.innerHTML = '<p>🐣 ¡Demoguchi ha renacido! Cuídalo bien...</p>';
    iniciarDemoguchi();
}

function iniciarDemoguchi() {
    if (demoguchiInterval) clearInterval(demoguchiInterval);
    
    demoguchiStats = demoguchiStats || { hambre: 100, felicidad: 100, energia: 100 };
    actualizarBarras();
    
    const mensajesDiv = document.getElementById('demoguchiMensajes');
    mensajesDiv.innerHTML = '<p>🐣 ¡Hola! Soy Demoguchi, cuídame...</p>';
    
    demoguchiInterval = setInterval(() => {
        if (document.getElementById('modalDemoguchi') && document.getElementById('modalDemoguchi').style.display === 'block') {
            decaerEstadisticas();
        }
    }, 5000);
    
    // Eventos de comida
    document.querySelectorAll('.comida-btn').forEach(btn => {
        btn.removeEventListener('click', comidaHandler);
        btn.addEventListener('click', comidaHandler);
    });
    
    document.getElementById('jugarBtn')?.removeEventListener('click', jugarHandler);
    document.getElementById('jugarBtn')?.addEventListener('click', jugarHandler);
    
    document.getElementById('dormirBtn')?.removeEventListener('click', dormirHandler);
    document.getElementById('dormirBtn')?.addEventListener('click', dormirHandler);
    
    document.getElementById('resetDemoguchiBtn')?.removeEventListener('click', resetHandler);
    document.getElementById('resetDemoguchiBtn')?.addEventListener('click', resetHandler);
}

function comidaHandler(e) {
    const tipo = e.currentTarget.getAttribute('data-comida');
    alimentar(tipo);
}

function jugarHandler() {
    jugar();
}

function dormirHandler() {
    dormir();
}

function resetHandler() {
    resetearDemoguchi();
}

// Partículas generales
function crearParticula() {
    const p = document.createElement('div');
    p.style.cssText = `position:fixed; width:2px; height:2px; background:#ff3300; left:${Math.random() * window.innerWidth}px; top:0; opacity:${Math.random()}; border-radius:50%; pointer-events:none; z-index:999;`;
    document.body.appendChild(p);
    let y = 0;
    const int = setInterval(() => {
        y += 5;
        p.style.transform = `translateY(${y}px)`;
        if (y > window.innerHeight) { clearInterval(int); p.remove(); }
    }, 30);
}
setInterval(crearParticula, 300);

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀✨ ¡MENSAJE SECRETO! ✨💀\nVecna te está observando...');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 2000);
    }
});
