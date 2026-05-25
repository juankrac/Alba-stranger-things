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

// ========== MODALES ==========
function cerrarTodosModales() {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => { modal.style.display = 'none'; });
    if (window.invasoresAnimacion) cancelAnimationFrame(window.invasoresAnimacion);
    if (window.demoguchiInterval) clearInterval(window.demoguchiInterval);
}

// Tarjetas normales
document.querySelectorAll('.tarjeta[data-modal]').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const modalId = tarjeta.getAttribute('data-modal');
        const modal = document.getElementById(`modal${modalId.charAt(0).toUpperCase() + modalId.slice(1)}`);
        if (modal) {
            cerrarTodosModales();
            modal.style.display = 'block';
            if (modalId === 'invasores') iniciarJuegoInvasores();
            if (modalId === 'demoguchi') iniciarDemoguchi();
        }
    });
});

// Castillo Byers
const castilloBtn = document.getElementById('castilloBtn');
if (castilloBtn) {
    castilloBtn.addEventListener('click', () => {
        cerrarTodosModales();
        const modalCastillo = document.getElementById('modalCastillo');
        if (modalCastillo) modalCastillo.style.display = 'block';
    });
}

// Cerrar con X
document.querySelectorAll('.cerrar-modal').forEach(btn => {
    btn.addEventListener('click', cerrarTodosModales);
});

// Cerrar al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) cerrarTodosModales();
});

// ========== ESTUDIO DE DIBUJO ==========
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
    
    document.getElementById('limpiarLienzo')?.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    document.getElementById('descargarDibujo')?.addEventListener('click', () => {
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

// ========== JUEGO INVASORES ==========
let invasoresAnimacion = null;

function iniciarJuegoInvasores() {
    if (invasoresAnimacion) cancelAnimationFrame(invasoresAnimacion);
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 700; canvas.height = 500;
    let playerX = canvas.width / 2;
    let piedras = [];
    let demogorgons = [];
    let score = 0;
    let lives = 3;
    let mouseX = playerX;
    let jugando = true;
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 7; col++) {
            demogorgons.push({ x: 80 + col * 70, y: 60 + row * 60, w: 40, h: 40, vivo: true });
        }
    }
    
    function dibujar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let d of demogorgons) {
            if (!d.vivo) continue;
            ctx.fillStyle = '#8B0000';
            ctx.beginPath();
            ctx.ellipse(d.x + 20, d.y + 20, 18, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.moveTo(d.x + 10, d.y + 5);
            ctx.lineTo(d.x + 20, d.y);
            ctx.lineTo(d.x + 30, d.y + 5);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(d.x + 12, d.y + 18, 4, 0, Math.PI * 2);
            ctx.arc(d.x + 28, d.y + 18, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(d.x + 11, d.y + 17, 2, 0, Math.PI * 2);
            ctx.arc(d.x + 27, d.y + 17, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        for (let p of piedras) {
            ctx.fillStyle = '#808080';
            ctx.fillRect(p.x, p.y, 6, 10);
        }
        
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(playerX + 15, canvas.height - 35, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(playerX + 8, canvas.height - 40, 3, 0, Math.PI * 2);
        ctx.arc(playerX + 22, canvas.height - 40, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(playerX + 5, canvas.height - 28, 20, 8);
        
        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(mouseX + 15, canvas.height - 55, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(mouseX + 15, canvas.height - 57, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function actualizar() {
        if (!jugando) return;
        
        playerX = Math.min(Math.max(mouseX, 0), canvas.width - 30);
        
        for (let i = 0; i < piedras.length; i++) {
            piedras[i].y -= 5;
            if (piedras[i].y + 10 < 0) { piedras.splice(i,1); i--; }
        }
        
        for (let i = 0; i < piedras.length; i++) {
            for (let j = 0; j < demogorgons.length; j++) {
                let d = demogorgons[j];
                if (d.vivo && piedras[i].x < d.x + d.w && piedras[i].x + 6 > d.x && piedras[i].y < d.y + d.h && piedras[i].y + 10 > d.y) {
                    d.vivo = false;
                    piedras.splice(i,1);
                    score += 10;
                    document.getElementById('score').innerText = score;
                    i--; break;
                }
            }
        }
        
        demogorgons = demogorgons.filter(d => d.vivo);
        
        let bajar = false;
        for (let d of demogorgons) {
            d.x += 1;
            if (d.x + d.w > canvas.width || d.x < 0) bajar = true;
        }
        if (bajar) {
            for (let d of demogorgons) { d.y += 10; d.x += d.x > canvas.width/2 ? -10 : 10; }
        }
        
        for (let d of demogorgons) {
            if (playerX < d.x + d.w && playerX + 30 > d.x && canvas.height - 50 < d.y + d.h && canvas.height - 20 > d.y) {
                lives--;
                document.getElementById('lives').innerText = lives;
                if (lives <= 0) { jugando = false; alert('GAME OVER - Puntuación: ' + score); return; }
                demogorgons = [];
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 7; col++) {
                        demogorgons.push({ x: 80 + col * 70, y: 60 + row * 60, w: 40, h: 40, vivo: true });
                    }
                }
                break;
            }
        }
        
        if (demogorgons.length === 0) {
            jugando = false;
            alert('¡VICTORIA! Puntuación: ' + score);
            return;
        }
        
        dibujar();
        invasoresAnimacion = requestAnimationFrame(actualizar);
    }
    
    function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        let x = (e.clientX - rect.left) * scaleX;
        mouseX = Math.min(Math.max(x - 15, 0), canvas.width - 30);
    }
    function onShoot(e) { if (jugando) piedras.push({ x: playerX + 12, y: canvas.height - 60 }); e.preventDefault(); }
    
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onShoot);
    canvas.addEventListener('touchmove', (e) => { onMouseMove(e.touches[0]); });
    canvas.addEventListener('touchstart', onShoot);
    
    actualizar();
    
    const resetBtn = document.getElementById('resetGame');
    const newReset = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newReset, resetBtn);
    newReset.addEventListener('click', () => {
        if (invasoresAnimacion) cancelAnimationFrame(invasoresAnimacion);
        jugando = false;
        setTimeout(() => iniciarJuegoInvasores(), 50);
    });
}

// ========== DEMOGUCHI ==========
let demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
let demoguchiInterval = null;

function actualizarDemoguchi() {
    document.getElementById('barraHambre').style.width = demoguchiStats.hambre + '%';
    document.getElementById('barraFelicidad').style.width = demoguchiStats.felicidad + '%';
    document.getElementById('barraEnergia').style.width = demoguchiStats.energia + '%';
    document.getElementById('hambreValor').innerText = Math.floor(demoguchiStats.hambre) + '%';
    document.getElementById('felicidadValor').innerText = Math.floor(demoguchiStats.felicidad) + '%';
    document.getElementById('energiaValor').innerText = Math.floor(demoguchiStats.energia) + '%';
    
    const cara = document.getElementById('demoguchiCara');
    if (demoguchiStats.hambre <= 20) cara.innerText = '😫';
    else if (demoguchiStats.energia <= 20) cara.innerText = '😴';
    else if (demoguchiStats.felicidad <= 30) cara.innerText = '😢';
    else if (demoguchiStats.felicidad >= 80 && demoguchiStats.hambre >= 70) cara.innerText = '😈';
    else cara.innerText = '👾';
}

function mensajeDemoguchi(msg) {
    const div = document.getElementById('demoguchiMensajes');
    const p = document.createElement('p');
    p.innerText = msg;
    div.appendChild(p);
    while (div.children.length > 5) div.removeChild(div.children[0]);
}

function alimentar(tipo) {
    let add = { hambre: 0, felicidad: 0 };
    if (tipo === 'pizza') { add.hambre = 25; mensajeDemoguchi('🍕 ¡ÑAM! Pizza +25% hambre'); }
    if (tipo === 'huevo') { add.hambre = 15; mensajeDemoguchi('🥚 Huevo +15% hambre'); }
    if (tipo === 'carne') { add.hambre = 30; mensajeDemoguchi('🍖 Carne +30% hambre'); }
    if (tipo === 'postre') { add.hambre = 20; add.felicidad = 10; mensajeDemoguchi('🍦 Postre +20% hambre +10% felicidad'); }
    demoguchiStats.hambre = Math.min(100, demoguchiStats.hambre + add.hambre);
    demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + add.felicidad);
    actualizarDemoguchi();
}

function jugarDemoguchi() {
    if (demoguchiStats.energia >= 15) {
        demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 20);
        demoguchiStats.energia = Math.max(0, demoguchiStats.energia - 15);
        demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 10);
        mensajeDemoguchi('🎾 ¡Jugaste! +20% felicidad');
        actualizarDemoguchi();
    } else mensajeDemoguchi('😴 Demoguchi está muy cansado');
}

function dormirDemoguchi() {
    demoguchiStats.energia = Math.min(100, demoguchiStats.energia + 40);
    demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 15);
    mensajeDemoguchi('😴 Durmió +40% energía');
    actualizarDemoguchi();
}

function resetearDemoguchi() {
    demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
    if (demoguchiInterval) clearInterval(demoguchiInterval);
    actualizarDemoguchi();
    document.getElementById('demoguchiMensajes').innerHTML = '<p>🐣 ¡Demoguchi ha renacido!</p>';
    iniciarDemoguchi();
}

function iniciarDemoguchi() {
    if (demoguchiInterval) clearInterval(demoguchiInterval);
    actualizarDemoguchi();
    demoguchiInterval = setInterval(() => {
        if (document.getElementById('modalDemoguchi')?.style.display === 'block') {
            demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - (Math.random() * 2 + 1));
            demoguchiStats.energia = Math.max(0, demoguchiStats.energia - (Math.random() * 1.5 + 0.5));
            if (demoguchiStats.hambre <= 0) demoguchiStats.felicidad = Math.max(0, demoguchiStats.felicidad - 5);
            actualizarDemoguchi();
        }
    }, 5000);
    
    document.querySelectorAll('.comida-btn').forEach(btn => {
        btn.onclick = () => alimentar(btn.getAttribute('data-comida'));
    });
    document.getElementById('jugarBtn').onclick = jugarDemoguchi;
    document.getElementById('dormirBtn').onclick = dormirDemoguchi;
    document.getElementById('resetDemoguchiBtn').onclick = resetearDemoguchi;
}

// ========== CASTILLO BYERS ==========
function initCastillo() {
    const entrar = document.getElementById('entrarCastilloBtn');
    if (entrar) {
        entrar.addEventListener('click', () => {
            const pass = document.getElementById('passwordCastillo').value;
            if (pass === 'Radagast') {
                document.getElementById('cast
