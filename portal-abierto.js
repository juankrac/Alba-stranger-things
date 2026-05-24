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
    juego: document.getElementById('modalJuego')
};

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const modalKey = tarjeta.getAttribute('data-modal');
        if (modales[modalKey]) {
            modales[modalKey].style.display = 'block';
            if (modalKey === 'juego') iniciarJuego();
        }
    });
});

const cerrarBtns = document.querySelectorAll('.cerrar-modal');
cerrarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        Object.values(modales).forEach(modal => { if (modal) modal.style.display = 'none'; });
        if (window.animationId) cancelAnimationFrame(window.animationId);
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        if (window.animationId) cancelAnimationFrame(window.animationId);
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

// ========== JUEGO SPACE INVADERS STRANGER THINGS ==========
let gameRunning = false;
let animationId = null;

function iniciarJuego() {
    if (gameRunning) return;
    gameRunning = true;
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Configurar tamaño fijo
    canvas.width = 700;
    canvas.height = 500;
    
    // Jugador (Dustin)
    let player = { x: canvas.width / 2, y: canvas.height - 50, width: 30, height: 30 };
    let piedras = [];
    let demogorgons = [];
    let score = 0;
    let lives = 3;
    let mouseX = player.x;
    
    // Crear Demogorgons (aliens)
    function crearDemogorgons() {
        demogorgons = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 7; col++) {
                demogorgons.push({
                    x: 80 + col * 70,
                    y: 60 + row * 60,
                    width: 40,
                    height: 40,
                    alive: true
                });
            }
        }
    }
    
    // Dibujar Dustin
    function dibujarDustin(x, y) {
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(x + 15, y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + 8, y + 10, 3, 0, Math.PI * 2);
        ctx.arc(x + 22, y + 10, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 5, y + 22, 20, 8);
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(x + 12, y - 5, 6, 10);
    }
    
    // Dibujar Demogorgon
    function dibujarDemogorgon(x, y) {
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.ellipse(x + 20, y + 20, 18, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 5);
        ctx.lineTo(x + 20, y);
        ctx.lineTo(x + 30, y + 5);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + 12, y + 18, 4, 0, Math.PI * 2);
        ctx.arc(x + 28, y + 18, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + 11, y + 17, 2, 0, Math.PI * 2);
        ctx.arc(x + 27, y + 17, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Dibujar piedra
    function dibujarPiedra(x, y) {
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.ellipse(x + 4, y + 4, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Mover mouse
    function moverMouse(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        let x;
        if (e.touches) {
            x = (e.touches[0].clientX - rect.left) * scaleX;
        } else {
            x = (e.clientX - rect.left) * scaleX;
        }
        mouseX = Math.min(Math.max(x - player.width / 2, 0), canvas.width - player.width);
    }
    
    canvas.addEventListener('mousemove', moverMouse);
    canvas.addEventListener('touchmove', moverMouse);
    
    // Disparar
    function disparar(e) {
        e.preventDefault();
        piedras.push({
            x: player.x + player.width / 2 - 3,
            y: player.y,
            width: 6,
            height: 10,
            active: true
        });
    }
    canvas.addEventListener('click', disparar);
    canvas.addEventListener('touchstart', disparar);
    
    // Actualizar juego
    function actualizar() {
        if (!gameRunning) return;
        
        // Mover jugador
        player.x = mouseX;
        player.x = Math.min(Math.max(player.x, 0), canvas.width - player.width);
        
        // Mover piedras
        piedras.forEach((p, i) => {
            p.y -= 5;
            if (p.y + p.height < 0) piedras.splice(i, 1);
        });
        
        // Colisiones piedras vs Demogorgons
        piedras.forEach((p, pi) => {
            demogorgons.forEach((d, di) => {
                if (d.alive && p.x < d.x + d.width && p.x + p.width > d.x && p.y < d.y + d.height && p.y + p.height > d.y) {
                    d.alive = false;
                    piedras.splice(pi, 1);
                    score += 10;
                    document.getElementById('score').innerText = score;
                }
            });
        });
        
        // Mover Demogorgons hacia abajo
        let moverAbajo = false;
        demogorgons.forEach(d => {
            if (d.alive) {
                d.x += 1.5;
                if (d.x + d.width > canvas.width || d.x < 0) moverAbajo = true;
            }
        });
        
        if (moverAbajo) {
            demogorgons.forEach(d => {
                if (d.alive) {
                    d.y += 15;
                    d.x += d.x > canvas.width / 2 ? -15 : 15;
                }
            });
        }
        
        // Eliminar demogorgons muertos
        for (let i = 0; i < demogorgons.length; i++) {
            if (!demogorgons[i].alive) demogorgons.splice(i, 1);
        }
        
        // Colisión jugador vs Demogorgons
        demogorgons.forEach(d => {
            if (d.alive && player.x < d.x + d.width && player.x + player.width > d.x && player.y < d.y + d.height && player.y + player.height > d.y) {
                lives--;
                document.getElementById('lives').innerText = lives;
                if (lives <= 0) {
                    gameRunning = false;
                    cancelAnimationFrame(animationId);
                    alert('💀 GAME OVER 💀\nPuntuación: ' + score);
                    return;
                }
                demogorgons = [];
                crearDemogorgons();
            }
        });
        
        // Victoria
        if (demogorgons.length === 0) {
            gameRunning = false;
            cancelAnimationFrame(animationId);
            alert('🎉 ¡HAS DERROTADO A LOS DEMOGORGONS! 🎉\nPuntuación: ' + score);
            return;
        }
        
        dibujar();
        animationId = requestAnimationFrame(actualizar);
    }
    
    function dibujar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fondo estilo Upside Down
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Partículas de fondo
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `rgba(255, 51, 0, ${Math.random() * 0.3})`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }
        
        // Dibujar Demogorgons
        demogorgons.forEach(d => dibujarDemogorgon(d.x, d.y));
        
        // Dibujar piedras
        piedras.forEach(p => dibujarPiedra(p.x, p.y));
        
        // Dibujar Dustin
        dibujarDustin(player.x, player.y);
        
        // Mira del mouse
        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(mouseX + 15, player.y - 10, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(mouseX + 15, player.y - 12, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    crearDemogorgons();
    actualizar();
    
    // Reset game
    document.getElementById('resetGame').onclick = () => {
        gameRunning = false;
        if (animationId) cancelAnimationFrame(animationId);
        score = 0;
        lives = 3;
        piedras = [];
        document.getElementById('score').innerText = score;
        document.getElementById('lives').innerText = lives;
        crearDemogorgons();
        gameRunning = true;
        actualizar();
    };
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
