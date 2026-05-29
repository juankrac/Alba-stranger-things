// ========== NAVEGACIÓN ==========
const cerrarBtn = document.getElementById('cerrarPortalBtn');
if (cerrarBtn) {
    cerrarBtn.addEventListener('click', () => {
        document.body.style.animation = 'shakePortal 0.3s ease-in-out';
        setTimeout(() => { window.location.href = 'index.html'; }, 300);
    });
}

// Animación de sacudida
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shakePortal { 0%,100% { transform: translate(0,0); } 25% { transform: translate(-5px,5px); } 50% { transform: translate(5px,-5px); } 75% { transform: translate(-5px,-5px); } }`;
document.head.appendChild(shakeStyle);

// Luces al mover mouse
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--x', `${x}%`);
    document.documentElement.style.setProperty('--y', `${y}%`);
});

// ========== FUNCIONES PARA MODALES ==========
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        if (modalId === 'modalInvasores') setTimeout(() => iniciarJuego(), 100);
        if (modalId === 'modalDemoguchi') setTimeout(() => iniciarDemoguchi(), 100);
    }
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
    if (window.gameAnimation) cancelAnimationFrame(window.gameAnimation);
    if (window.demoguchiInterval) clearInterval(window.demoguchiInterval);
    if (window.laberintoInterval) clearInterval(window.laberintoInterval);
}

// ========== EVENTOS DE LAS TARJETAS ==========
document.querySelectorAll('.tarjeta[data-modal]').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const modalKey = tarjeta.getAttribute('data-modal');
        let modalId = '';
        switch(modalKey) {
            case 'inicio': modalId = 'modalInicio'; break;
            case 'personajes': modalId = 'modalPersonajes'; break;
            case 'curiosidades': modalId = 'modalCuriosidades'; break;
            case 'creatividad': modalId = 'modalCreatividad'; break;
            case 'invasores': modalId = 'modalInvasores'; break;
            case 'demoguchi': modalId = 'modalDemoguchi'; break;
            case 'castillo': modalId = 'modalCastillo'; break;
            case 'puzzles': modalId = 'modalPuzzles'; break;
            default: modalId = 'modal' + modalKey.charAt(0).toUpperCase() + modalKey.slice(1);
        }
        abrirModal(modalId);
    });
});

// ========== CERRAR MODALES ==========
document.querySelectorAll('.cerrar-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        cerrarModal(modalId);
        window.removeEventListener('keydown', window.laberintoKeyHandler);
        if (window.laberintoInterval) clearInterval(window.laberintoInterval);
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        if (window.gameAnimation) cancelAnimationFrame(window.gameAnimation);
        if (window.demoguchiInterval) clearInterval(window.demoguchiInterval);
        if (window.laberintoInterval) clearInterval(window.laberintoInterval);
        window.removeEventListener('keydown', window.laberintoKeyHandler);
    }
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

// ========== FORMULARIO CREATIVIDAD ==========
const form = document.getElementById('formCreativo');
const msgForm = document.getElementById('mensajeForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        msgForm.innerText = '✨ ¡Tu creación ha cruzado el portal! ✨';
        form.reset();
        setTimeout(() => msgForm.innerText = '', 3000);
    });
}

// ========== SPRITES PARA JUEGO INVASORES ==========
const imagenDustin = new Image();
const imagenDemogorgon = new Image();
imagenDustin.src = 'dustin.png';
imagenDemogorgon.src = 'demogorgon.png';

// ========== JUEGO INVASORES ==========
let gameAnimation = null;

function iniciarJuego() {
    if (gameAnimation) cancelAnimationFrame(gameAnimation);
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 700; canvas.height = 500;
    let playerX = canvas.width / 2;
    let piedras = [];
    let enemigos = [];
    let score = 0;
    let lives = 3;
    let mouseX = playerX;
    let jugando = true;
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 7; col++) {
            enemigos.push({ x: 80 + col * 70, y: 60 + row * 60, w: 45, h: 45, vivo: true });
        }
    }
    
    function dibujar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let e of enemigos) {
            if (!e.vivo) continue;
            if (imagenDemogorgon.complete && imagenDemogorgon.naturalHeight !== 0) {
                ctx.drawImage(imagenDemogorgon, e.x, e.y, e.w, e.h);
            } else {
                ctx.fillStyle = '#8B0000';
                ctx.fillRect(e.x, e.y, e.w, e.h);
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(e.x + 10, e.y + 10, 25, 10);
                ctx.fillStyle = 'white';
                ctx.fillRect(e.x + 8, e.y + 25, 8, 8);
                ctx.fillRect(e.x + 28, e.y + 25, 8, 8);
            }
        }
        
        for (let p of piedras) {
            ctx.fillStyle = '#808080';
            ctx.fillRect(p.x, p.y, 6, 10);
        }
        
        if (imagenDustin.complete && imagenDustin.naturalHeight !== 0) {
            ctx.drawImage(imagenDustin, playerX, canvas.height - 75, 50, 55);
        } else {
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(playerX, canvas.height - 70, 40, 40);
            ctx.fillStyle = '#000';
            ctx.fillRect(playerX + 8, canvas.height - 62, 8, 8);
            ctx.fillRect(playerX + 24, canvas.height - 62, 8, 8);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(playerX + 10, canvas.height - 30, 20, 8);
        }
        
        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(mouseX + 20, canvas.height - 75, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(mouseX + 20, canvas.height - 77, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function actualizar() {
        if (!jugando) return;
        
        playerX = Math.min(Math.max(mouseX, 0), canvas.width - 50);
        
        for (let i = 0; i < piedras.length; i++) {
            piedras[i].y -= 5;
            if (piedras[i].y + 10 < 0) { piedras.splice(i,1); i--; }
        }
        
        for (let i = 0; i < piedras.length; i++) {
            for (let j = 0; j < enemigos.length; j++) {
                let e = enemigos[j];
                if (e.vivo && piedras[i].x < e.x + e.w && piedras[i].x + 6 > e.x && 
                    piedras[i].y < e.y + e.h && piedras[i].y + 10 > e.y) {
                    e.vivo = false;
                    piedras.splice(i,1);
                    score += 10;
                    document.getElementById('score').innerText = score;
                    i--; break;
                }
            }
        }
        
        for (let i = 0; i < enemigos.length; i++) {
            if (!enemigos[i].vivo) { enemigos.splice(i,1); i--; }
        }
        
        let bajar = false;
        for (let e of enemigos) {
            e.x += 1.5;
            if (e.x + e.w > canvas.width || e.x < 0) bajar = true;
        }
        if (bajar) {
            for (let e of enemigos) { e.y += 12; e.x += e.x > canvas.width/2 ? -15 : 15; }
        }
        
        for (let e of enemigos) {
            if (playerX < e.x + e.w && playerX + 50 > e.x && 
                canvas.height - 75 < e.y + e.h && canvas.height - 20 > e.y) {
                lives--;
                document.getElementById('lives').innerText = lives;
                if (lives <= 0) { jugando = false; alert('💀 GAME OVER 💀\nPuntuación: ' + score); return; }
                enemigos = [];
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 7; col++) {
                        enemigos.push({ x: 80 + col * 70, y: 60 + row * 60, w: 45, h: 45, vivo: true });
                    }
                }
                break;
            }
        }
        
        if (enemigos.length === 0) {
            jugando = false;
            alert('🎉 ¡VICTORIA! 🎉\nPuntuación: ' + score);
            return;
        }
        
        dibujar();
        gameAnimation = requestAnimationFrame(actualizar);
    }
    
    function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        let x = (e.clientX - rect.left) * scaleX;
        mouseX = Math.min(Math.max(x - 25, 0), canvas.width - 50);
    }
    
    function onShoot() { if (jugando) piedras.push({ x: playerX + 22, y: canvas.height - 80 }); }
    
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onShoot);
    canvas.addEventListener('touchmove', (e) => { onMouseMove(e.touches[0]); });
    canvas.addEventListener('touchstart', onShoot);
    
    actualizar();
    
    const resetBtn = document.getElementById('resetGame');
    if (resetBtn) {
        const newBtn = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(newBtn, resetBtn);
        newBtn.addEventListener('click', () => {
            if (gameAnimation) cancelAnimationFrame(gameAnimation);
            jugando = false;
            setTimeout(() => iniciarJuego(), 50);
        });
    }
}

// ========== DEMOGUCHI ==========
let demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
let demoguchiInterval = null;
const caras = { feliz: '😈', normal: '👾', triste: '😢', hambriento: '😫', cansado: '😴' };

function actualizarDemoguchiUI() {
    document.getElementById('barraHambre').style.width = demoguchiStats.hambre + '%';
    document.getElementById('barraFelicidad').style.width = demoguchiStats.felicidad + '%';
    document.getElementById('barraEnergia').style.width = demoguchiStats.energia + '%';
    document.getElementById('hambreValor').innerText = Math.floor(demoguchiStats.hambre) + '%';
    document.getElementById('felicidadValor').innerText = Math.floor(demoguchiStats.felicidad) + '%';
    document.getElementById('energiaValor').innerText = Math.floor(demoguchiStats.energia) + '%';
    
    const caraElement = document.getElementById('demoguchiCara');
    if (demoguchiStats.hambre <= 20) caraElement.innerText = caras.hambriento;
    else if (demoguchiStats.energia <= 20) caraElement.innerText = caras.cansado;
    else if (demoguchiStats.felicidad <= 30) caraElement.innerText = caras.triste;
    else if (demoguchiStats.felicidad >= 80 && demoguchiStats.hambre >= 70 && demoguchiStats.energia >= 70) caraElement.innerText = caras.feliz;
    else caraElement.innerText = caras.normal;
}

function agregarMensajeDemoguchi(msg) {
    const div = document.getElementById('demoguchiMensajes');
    const p = document.createElement('p');
    p.innerText = msg;
    div.appendChild(p);
    while (div.children.length > 5) div.removeChild(div.children[0]);
}

function alimentarDemoguchi(tipo) {
    let incremento = 0;
    let mensaje = "";
    switch(tipo) {
        case 'pizza': incremento = 25; mensaje = "🍕 ¡ÑAM! Pizza +25% hambre"; break;
        case 'huevo': incremento = 15; mensaje = "🥚 Huevo +15% hambre"; break;
        case 'carne': incremento = 30; mensaje = "🍖 Carne +30% hambre"; break;
        case 'postre': incremento = 20; demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 10); mensaje = "🍦 Postre +20% hambre +10% felicidad"; break;
    }
    demoguchiStats.hambre = Math.min(100, demoguchiStats.hambre + incremento);
    demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 5);
    actualizarDemoguchiUI();
    agregarMensajeDemoguchi(mensaje);
}

function jugarDemoguchi() {
    if (demoguchiStats.energia >= 15) {
        demoguchiStats.felicidad = Math.min(100, demoguchiStats.felicidad + 20);
        demoguchiStats.energia = Math.max(0, demoguchiStats.energia - 15);
        demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 10);
        actualizarDemoguchiUI();
        agregarMensajeDemoguchi('🎾 ¡Jugaste con Demoguchi! +20% felicidad');
    } else agregarMensajeDemoguchi('😴 Demoguchi está muy cansado para jugar');
}

function dormirDemoguchi() {
    demoguchiStats.energia = Math.min(100, demoguchiStats.energia + 40);
    demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 15);
    actualizarDemoguchiUI();
    agregarMensajeDemoguchi('😴 Demoguchi durmió profundamente +40% energía');
}

function resetearDemoguchi() {
    demoguchiStats = { hambre: 100, felicidad: 100, energia: 100 };
    if (demoguchiInterval) clearInterval(demoguchiInterval);
    actualizarDemoguchiUI();
    agregarMensajeDemoguchi('🐣 ¡Demoguchi ha renacido! Cuídalo bien');
    iniciarDemoguchi();
}

function iniciarDemoguchi() {
    if (demoguchiInterval) clearInterval(demoguchiInterval);
    actualizarDemoguchiUI();
    
    demoguchiInterval = setInterval(() => {
        if (document.getElementById('modalDemoguchi').style.display === 'block') {
            demoguchiStats.hambre = Math.max(0, demoguchiStats.hambre - 2);
            demoguchiStats.energia = Math.max(0, demoguchiStats.energia - 1.5);
            if (demoguchiStats.hambre <= 0) demoguchiStats.felicidad = Math.max(0, demoguchiStats.felicidad - 5);
            actualizarDemoguchiUI();
        }
    }, 5000);
    
    document.querySelectorAll('.comida-btn').forEach(btn => {
        btn.onclick = () => alimentarDemoguchi(btn.getAttribute('data-comida'));
    });
    document.getElementById('jugarBtn').onclick = jugarDemoguchi;
    document.getElementById('dormirBtn').onclick = dormirDemoguchi;
    document.getElementById('resetDemoguchiBtn').onclick = resetearDemoguchi;
}

// ========== CASTILLO BYERS CON CHAT ==========
function iniciarChat() {
    const chatMensajes = document.getElementById('chatMensajes');
    const chatNombre = document.getElementById('chatNombre');
    const chatTexto = document.getElementById('chatTexto');
    const enviarBtn = document.getElementById('chatEnviarBtn');
    const borrarBtn = document.getElementById('chatBorrarBtn');
    const chatContador = document.getElementById('chatContador');
    
    let mensajes = [];
    const mensajesGuardados = localStorage.getItem('castilloChat');
    if (mensajesGuardados) {
        try {
            mensajes = JSON.parse(mensajesGuardados);
        } catch(e) { console.error('Error cargando chat'); }
    }
    
    function guardarMensajes() {
        localStorage.setItem('castilloChat', JSON.stringify(mensajes));
        if (chatContador) actualizarContador();
    }
    
    function mostrarMensajes() {
        if (!chatMensajes) return;
        chatMensajes.innerHTML = '';
        
        mensajes.forEach(msg => {
            const div = document.createElement('div');
            div.className = `mensaje ${msg.tipo}`;
            
            if (msg.tipo === 'usuario') {
                div.innerHTML = `<span class="nombre">${escapeHTML(msg.nombre)}:</span> <span class="texto">${escapeHTML(msg.texto)}</span>`;
            } else {
                div.innerHTML = msg.texto;
            }
            
            chatMensajes.appendChild(div);
        });
        
        chatMensajes.scrollTop = chatMensajes.scrollHeight;
    }
    
    function escapeHTML(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    function enviarMensaje() {
        let nombre = chatNombre.value.trim();
        const texto = chatTexto.value.trim();
        
        if (!nombre) nombre = 'Anonymous';
        if (nombre.length > 20) nombre = nombre.substring(0, 20);
        if (!texto) { alert('Escribe un mensaje primero'); return; }
        if (texto.length > 200) { alert('Mensaje demasiado largo'); return; }
        
        mensajes.push({ tipo: 'usuario', nombre: nombre, texto: texto, fecha: new Date().toISOString() });
        if (mensajes.length > 100) mensajes = mensajes.slice(-100);
        
        guardarMensajes();
        mostrarMensajes();
        chatTexto.value = '';
        localStorage.setItem('castilloChatNombre', nombre);
    }
    
    function borrarChat() {
        if (confirm('¿Borrar todo el historial del chat?')) {
            mensajes = [];
            guardarMensajes();
            mostrarMensajes();
            mensajes.push({ tipo: 'sistema', texto: '🏰 El chat ha sido limpiado. ¡Empieza una nueva conversación!' });
            guardarMensajes();
            mostrarMensajes();
        }
    }
    
    function actualizarContador() {
        if (chatContador) chatContador.innerText = `${mensajes.length} mensajes guardados`;
    }
    
    const nombreGuardado = localStorage.getItem('castilloChatNombre');
    if (nombreGuardado && chatNombre) chatNombre.value = nombreGuardado;
    
    if (enviarBtn) enviarBtn.addEventListener('click', enviarMensaje);
    if (borrarBtn) borrarBtn.addEventListener('click', borrarChat);
    if (chatTexto) {
        chatTexto.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensaje(); }
        });
    }
    
    mostrarMensajes();
    actualizarContador();
}

function initCastilloConChat() {
    const entrarBtn = document.getElementById('entrarCastillo');
    const salirBtn = document.getElementById('salirCastillo');
    const loginDiv = document.getElementById('castilloLogin');
    const contenidoDiv = document.getElementById('castilloContenido');
    const errorMsg = document.getElementById('errorPass');
    
    if (entrarBtn) {
        entrarBtn.addEventListener('click', () => {
            const pass = document.getElementById('passCastillo').value;
            if (pass === 'Radagast') {
                loginDiv.style.display = 'none';
                contenidoDiv.style.display = 'block';
                errorMsg.innerText = '';
                setTimeout(() => iniciarChat(), 100);
            } else {
                errorMsg.innerText = '❌ Contraseña incorrecta';
                document.getElementById('passCastillo').value = '';
            }
        });
    }
    if (salirBtn) {
        salirBtn.addEventListener('click', () => {
            loginDiv.style.display = 'block';
            contenidoDiv.style.display = 'none';
            document.getElementById('passCastillo').value = '';
            errorMsg.innerText = '';
            cerrarModal('modalCastillo');
        });
    }
}

initCastilloConChat();

// ========== PUZZLES ==========
function abrirPuzzle(tipo) {
    const juegoContainer = document.getElementById('juegoContainer');
    const juegoArea = document.getElementById('juegoArea');
    const puzzlesGrid = document.querySelector('.puzzles-grid');
    
    puzzlesGrid.style.display = 'none';
    juegoContainer.style.display = 'block';
    
    switch(tipo) {
        case 'memoria': iniciarJuegoMemoria(juegoArea); break;
        case 'numeros': iniciarJuegoNumeros(juegoArea); break;
        case 'laberinto': iniciarJuegoLaberinto(juegoArea); break;
        case 'preguntas': iniciarJuegoPreguntas(juegoArea); break;
    }
}

document.getElementById('cerrarJuegoBtn')?.addEventListener('click', () => {
    document.getElementById('juegoContainer').style.display = 'none';
    document.querySelector('.puzzles-grid').style.display = 'grid';
    document.getElementById('juegoArea').innerHTML = '';
    window.removeEventListener('keydown', window.laberintoKeyHandler);
    if (window.laberintoInterval) clearInterval(window.laberintoInterval);
});

// PUZZLE 1: MEMORIA
function iniciarJuegoMemoria(container) {
    const personajes = ['👻', '👥', '📚', '🎨', '👾', '🐣', '🏰', '⚡'];
    const cartas = [...personajes, ...personajes];
    for (let i = cartas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
    let seleccionadas = [], bloqueado = false, paresEncontrados = 0;
    
    container.innerHTML = `<div class="contador-puntuacion">🧩 Parejas encontradas: 0 / 8</div><div class="memoria-grid" id="memoriaGrid"></div><button id="resetMemoria" class="btn-puzzle" style="margin-top:15px;">🔄 Reiniciar</button>`;
    const grid = document.getElementById('memoriaGrid');
    
    function crearTablero() {
        grid.innerHTML = '';
        cartas.forEach((carta, idx) => {
            const card = document.createElement('div');
            card.className = 'memoria-card';
            card.innerText = '?';
            card.addEventListener('click', () => voltearCarta(idx));
            grid.appendChild(card);
        });
    }
    
    function voltearCarta(idx) {
        if (bloqueado) return;
        const carta = grid.children[idx];
        if (carta.innerText !== '?' || seleccionadas.includes(idx)) return;
        carta.innerText = cartas[idx];
        seleccionadas.push(idx);
        if (seleccionadas.length === 2) { bloqueado = true; setTimeout(verificarPar, 700); }
    }
    
    function verificarPar() {
        const [idx1, idx2] = seleccionadas;
        const carta1 = grid.children[idx1], carta2 = grid.children[idx2];
        if (cartas[idx1] === cartas[idx2]) {
            paresEncontrados++;
            document.querySelector('.contador-puntuacion').innerHTML = `🧩 Parejas encontradas: ${paresEncontrados} / 8`;
            carta1.style.background = '#330000';
            carta2.style.background = '#330000';
            if (paresEncontrados === 8) setTimeout(() => alert('🎉 ¡Completaste el puzzle de memoria!'), 100);
        } else {
            carta1.innerText = '?';
            carta2.innerText = '?';
        }
        seleccionadas = [];
        bloqueado = false;
    }
    
    document.getElementById('resetMemoria').addEventListener('click', () => iniciarJuegoMemoria(container));
    crearTablero();
}

// PUZZLE 2: NÚMEROS (15 puzzle)
function iniciarJuegoNumeros(container) {
    let tiles = [], vacioIndex = 15;
    
    function iniciar() {
        tiles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,null];
        vacioIndex = 15;
        for (let i = 0; i < 200; i++) {
            const movimientos = obtenerMovimientosPosibles(vacioIndex);
            const randomMove = movimientos[Math.floor(Math.random() * movimientos.length)];
            moverTile(randomMove, true);
        }
        dibujar();
    }
    
    function obtenerMovimientosPosibles(vacioPos) {
        const movimientos = [];
        const fila = Math.floor(vacioPos / 4), col = vacioPos % 4;
        if (fila > 0) movimientos.push(vacioPos - 4);
        if (fila < 3) movimientos.push(vacioPos + 4);
        if (col > 0) movimientos.push(vacioPos - 1);
        if (col < 3) movimientos.push(vacioPos + 1);
        return movimientos;
    }
    
    function moverTile(pos, sinVerificar = false) {
        if (obtenerMovimientosPosibles(vacioIndex).includes(pos)) {
            tiles[vacioIndex] = tiles[pos];
            tiles[pos] = null;
            vacioIndex = pos;
            if (!sinVerificar) { dibujar(); verificarVictoria(); }
        }
    }
    
    function verificarVictoria() {
        let victoria = true;
        for (let i = 0; i < 15; i++) if (tiles[i] !== i + 1) victoria = false;
        if (victoria) setTimeout(() => alert('🎉 ¡Ganaste! Ordenaste todos los números'), 100);
    }
    
    function dibujar() {
        const grid = document.createElement('div');
        grid.className = 'numeros-grid';
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement('div');
            tile.className = 'numero-tile';
            if (tiles[i] === null) {
                tile.classList.add('vacio');
                tile.innerText = '';
            } else tile.innerText = tiles[i];
            tile.addEventListener('click', () => moverTile(i));
            grid.appendChild(tile);
        }
        container.innerHTML = '';
        container.appendChild(grid);
        const resetBtn = document.createElement('button');
        resetBtn.innerText = '🔄 Reiniciar';
        resetBtn.className = 'btn-puzzle';
        resetBtn.style.marginTop = '15px';
        resetBtn.onclick = () => iniciarJuegoNumeros(container);
        container.appendChild(resetBtn);
    }
    iniciar();
}

// PUZZLE 3: LABERINTO CON ELEVEN Y DEMOGORGON
function iniciarJuegoLaberinto(container) {
    const size = 15, cellSize = 30;
    const canvas = document.createElement('canvas');
    canvas.width = size * cellSize;
    canvas.height = size * cellSize;
    canvas.className = 'laberinto-canvas';
    const ctx = canvas.getContext('2d');
    
    const imagenDemogorgonPerseguidor = new Image();
    imagenDemogorgonPerseguidor.src = 'demogorgon.png';
    
    let vidas = 3, gameOver = false, victoria = false;
    
    function generarLaberinto() {
        const laberinto = Array(size).fill().map(() => Array(size).fill(0));
        function dentroLimites(x, y) { return x > 0 && x < size-1 && y > 0 && y < size-1; }
        function crearCamino(x, y) {
            laberinto[y][x] = 1;
            const direcciones = [[0,-2],[0,2],[-2,0],[2,0]];
            for (let i = direcciones.length-1; i>0; i--) {
                const j = Math.floor(Math.random()*(i+1));
                [direcciones[i], direcciones[j]] = [direcciones[j], direcciones[i]];
            }
            for (let [dx, dy] of direcciones) {
                const nx = x+dx, ny = y+dy;
                if (dentroLimites(nx, ny) && laberinto[ny][nx] === 0) {
                    laberinto[y+dy/2][x+dx/2] = 1;
                    crearCamino(nx, ny);
                }
            }
        }
        const startX = 1 + 2 * Math.floor(Math.random() * ((size-2)/2));
        const startY = 1 + 2 * Math.floor(Math.random() * ((size-2)/2));
        crearCamino(startX, startY);
        laberinto[1][1] = 1;
        laberinto[size-2][size-2] = 1;
        for (let i = 0; i < size*2; i++) {
            const x = 1 + Math.floor(Math.random() * (size-2));
            const y = 1 + Math.floor(Math.random() * (size-2));
            if (laberinto[y][x] === 0) {
                let vecinos = 0;
                if (y>0 && laberinto[y-1][x]===1) vecinos++;
                if (y<size-1 && laberinto[y+1][x]===1) vecinos++;
                if (x>0 && laberinto[y][x-1]===1) vecinos++;
                if (x<size-1 && laberinto[y][x+1]===1) vecinos++;
                if (vecinos >= 2) laberinto[y][x] = 1;
            }
        }
        return laberinto;
    }
    
    let walls = generarLaberinto();
    let player = { x: 1, y: 1 };
    let demogorgon = { x: size-3, y: size-3 };
    const goal = { x: size-2, y: size-2 };
    let floatOffset = 0, floatDirection = 1;
    let demogorgonFloat = 0, demogorgonDirection = 1;
    
    function dibujarVidas() {
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#ff6600';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ff0000';
        let textoVidas = '❤️'.repeat(vidas) + '🖤'.repeat(3-vidas);
        ctx.fillText(`${textoVidas} ${vidas}/3`, 10, 25);
        ctx.shadowBlur = 0;
    }
    
    function reiniciarPosiciones() {
        player = { x: 1, y: 1 };
        demogorgon = { x: size-3, y: size-3 };
        dibujarLaberinto();
    }
    
    function verificarColision() {
        if (gameOver || victoria) return false;
        if (demogorgon.x === player.x && demogorgon.y === player.y) {
            vidas--;
            if (vidas <= 0) {
                gameOver = true;
                if (window.laberintoInterval) clearInterval(window.laberintoInterval);
                alert('💀 GAME OVER 💀\n¡El Demogorgon te ha derrotado!');
                dibujarLaberinto();
                return true;
            } else {
                alert(`⚠️ ¡El Demogorgon te atrapó! ⚠️\nTe quedan ${vidas} vidas.`);
                reiniciarPosiciones();
                dibujarLaberinto();
                return true;
            }
        }
        return false;
    }
    
    function moverDemogorgon() {
        if (gameOver || victoria) return;
        const dx = player.x - demogorgon.x, dy = player.y - demogorgon.y;
        let nuevoX = demogorgon.x, nuevoY = demogorgon.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) nuevoX = demogorgon.x + 1; else nuevoX = demogorgon.x - 1;
            if (walls[demogorgon.y] && walls[demogorgon.y][nuevoX] === 1 && !(nuevoX === player.x && demogorgon.y === player.y)) {
                demogorgon.x = nuevoX;
            } else {
                if (dy > 0) nuevoY = demogorgon.y + 1; else nuevoY = demogorgon.y - 1;
                if (walls[nuevoY] && walls[nuevoY][demogorgon.x] === 1 && !(demogorgon.x === player.x && nuevoY === player.y)) {
                    demogorgon.y = nuevoY;
                }
            }
        } else {
            if (dy > 0) nuevoY = demogorgon.y + 1; else nuevoY = demogorgon.y - 1;
            if (walls[nuevoY] && walls[nuevoY][demogorgon.x] === 1 && !(demogorgon.x === player.x && nuevoY === player.y)) {
                demogorgon.y = nuevoY;
            } else {
                if (dx > 0) nuevoX = demogorgon.x + 1; else nuevoX = demogorgon.x - 1;
                if (walls[demogorgon.y] && walls[demogorgon.y][nuevoX] === 1 && !(nuevoX === player.x && demogorgon.y === player.y)) {
                    demogorgon.x = nuevoX;
                }
            }
        }
        dibujarLaberinto();
        verificarColision();
    }
    
    window.laberintoInterval = setInterval(() => {
        if (!gameOver && !victoria && document.getElementById('modalPuzzles')?.style.display === 'block') {
            moverDemogorgon();
        }
    }, 400);
    
    function dibujarEleven(x, y) {
        const px = x * cellSize, py = y * cellSize + floatOffset;
        ctx.fillStyle = '#ffcc99';
        ctx.beginPath();
        ctx.arc(px + cellSize/2, py + cellSize/2, cellSize/2.5, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(px + cellSize/4, py + cellSize/4, cellSize/2, cellSize/3);
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(px + cellSize/2.8, py + cellSize/2.3, 3, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + cellSize/1.8, py + cellSize/2.3, 3, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#cc0000';
        ctx.fillRect(px + cellSize/2 - 2, py + cellSize/1.8, 4, 6);
        ctx.beginPath();
        ctx.arc(px + cellSize/2, py + cellSize/1.7, 5, 0.05, Math.PI - 0.05);
        ctx.stroke();
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(px + cellSize/5, py + cellSize/3, cellSize/6, cellSize/4);
        ctx.fillRect(px + cellSize - cellSize/4, py + cellSize/3, cellSize/6, cellSize/4);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff44cc';
        ctx.beginPath();
        ctx.arc(px + cellSize/2, py + cellSize/2, cellSize/2.2, 0, Math.PI*2);
        ctx.strokeStyle = '#ff66cc';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    function dibujarDemogorgonPerseguidor(x, y) {
        const px = x * cellSize, py = y * cellSize + demogorgonFloat;
        if (imagenDemogorgonPerseguidor.complete && imagenDemogorgonPerseguidor.naturalHeight !== 0) {
            ctx.drawImage(imagenDemogorgonPerseguidor, px, py, cellSize, cellSize);
        } else {
            ctx.fillStyle = '#8B0000';
            ctx.fillRect(px, py, cellSize, cellSize);
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(px + 8, py + 8, cellSize - 16, cellSize/3);
            ctx.fillStyle = 'white';
            ctx.fillRect(px + 6, py + cellSize/2, 6, 6);
            ctx.fillRect(px + cellSize - 12, py + cellSize/2, 6, 6);
        }
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(px + cellSize/3, py + cellSize/3, 4, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + 2*cellSize/3, py + cellSize/3, 4, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#ff6666';
        ctx.beginPath();
        ctx.arc(px + cellSize/3 - 1, py + cellSize/3 - 1, 1.5, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + 2*cellSize/3 - 1, py + cellSize/3 - 1, 1.5, 0, Math.PI*2);
        ctx.fill();
    }
    
    function dibujarLaberinto() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (walls[y][x] === 0) {
                    ctx.fillStyle = '#1a0000';
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    ctx.strokeStyle = '#ff3300';
                    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    ctx.fillStyle = '#2a0000';
                    ctx.fillRect(x * cellSize + 5, y * cellSize + 5, cellSize - 10, cellSize - 10);
                } else {
                    const gradiente = ctx.createLinearGradient(x * cellSize, y * cellSize, x * cellSize + cellSize, y * cellSize + cellSize);
                    gradiente.addColorStop(0, '#0a0a0a');
                    gradiente.addColorStop(1, '#1a0a0a');
                    ctx.fillStyle = gradiente;
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    if (Math.random() > 0.97) {
                        ctx.fillStyle = '#ff3300';
                        ctx.fillRect(x * cellSize + Math.random() * cellSize, y * cellSize + Math.random() * cellSize, 1, 1);
                    }
                }
            }
        }
        if (!victoria && !gameOver) {
            ctx.fillStyle = '#00cc44';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ff44';
            ctx.beginPath();
            ctx.arc(goal.x * cellSize + cellSize/2, goal.y * cellSize + cellSize/2, cellSize/3, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#88ff88';
            ctx.beginPath();
            ctx.arc(goal.x * cellSize + cellSize/2, goal.y * cellSize + cellSize/2, cellSize/6, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
        } else if (victoria) {
            ctx.fillStyle = '#00ff44';
            ctx.font = 'bold 20px monospace';
            ctx.fillText('✨ ESCAPASTE ✨', canvas.width/2 - 70, canvas.height/2);
        } else if (gameOver) {
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 20px monospace';
            ctx.fillText('💀 GAME OVER 💀', canvas.width/2 - 70, canvas.height/2);
        }
        dibujarDemogorgonPerseguidor(demogorgon.x, demogorgon.y);
        dibujarEleven(player.x, player.y);
        dibujarVidas();
    }
    
    function animarFloat() {
        floatOffset += floatDirection * 1.5;
        if (floatOffset > 3 || floatOffset < -3) floatDirection *= -1;
        demogorgonFloat += demogorgonDirection * 2;
        if (demogorgonFloat > 4 || demogorgonFloat < -4) demogorgonDirection *= -1;
        dibujarLaberinto();
        requestAnimationFrame(animarFloat);
    }
    
    function mover(e) {
        if (gameOver || victoria) return;
        let newX = player.x, newY = player.y;
        if (e.key === 'ArrowUp') newY--;
        if (e.key === 'ArrowDown') newY++;
        if (e.key === 'ArrowLeft') newX--;
        if (e.key === 'ArrowRight') newX++;
        if (newY >= 0 && newY < size && newX >= 0 && newX < size && walls[newY][newX] === 1) {
            player.x = newX; player.y = newY;
            dibujarLaberinto();
            verificarColision();
            if (player.x === goal.x && player.y === goal.y && !victoria && !gameOver) {
                victoria = true;
                if (window.laberintoInterval) clearInterval(window.laberintoInterval);
                alert('⚡✨ ¡Eleven ha escapado del Upside Down! ✨⚡');
                dibujarLaberinto();
            }
        }
    }
    
    function reiniciarJuegoCompleto() {
        if (window.laberintoInterval) clearInterval(window.laberintoInterval);
        walls = generarLaberinto();
        player = { x: 1, y: 1 };
        demogorgon = { x: size-3, y: size-3 };
        vidas = 3; gameOver = false; victoria = false;
        dibujarLaberinto();
        window.laberintoInterval = setInterval(() => {
            if (!gameOver && !victoria && document.getElementById('modalPuzzles')?.style.display === 'block') {
                moverDemogorgon();
            }
        }, 400);
    }
    
    container.innerHTML = '';
    container.appendChild(canvas);
    
    const controlsDiv = document.createElement('div');
    controlsDiv.style.cssText = 'display:flex; justify-content:center; gap:10px; margin-top:15px; flex-wrap:wrap';
    ['⬆️','⬅️','⬇️','➡️'].forEach((icon, i) => {
        const btn = document.createElement('button');
        btn.innerText = icon;
        btn.className = 'btn-puzzle';
        btn.style.padding = '10px 20px';
        btn.onclick = () => mover({ key: ['ArrowUp','ArrowLeft','ArrowDown','ArrowRight'][i] });
        controlsDiv.appendChild(btn);
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.innerText = '🔄 NUEVO LABERINTO';
    resetBtn.className = 'btn-puzzle';
    resetBtn.style.marginTop = '15px';
    resetBtn.style.width = '100%';
    resetBtn.onclick = reiniciarJuegoCompleto;
    
    container.appendChild(controlsDiv);
    container.appendChild(resetBtn);
    
    const infoText = document.createElement('p');
    infoText.innerText = '🎮 Usa flechas o botones. ¡El Demogorgon te persigue! Tienes 3 vidas.';
    infoText.style.cssText = 'color:#ff8866; font-size:0.8rem; margin-top:10px; text-align:center';
    container.appendChild(infoText);
    
    window.laberintoKeyHandler = mover;
    window.addEventListener('keydown', window.laberintoKeyHandler);
    dibujarLaberinto();
    animarFloat();
}

// PUZZLE 4: PREGUNTAS (TRIVIA ALEATORIA)
function iniciarJuegoPreguntas(container) {
    const bancoPreguntas = [
        { pregunta: "¿Cómo se llama el mundo paralelo en Stranger Things?", respuestas: ["El Revés", "El Upside Down", "La Dimensión Oscura", "El Otro Lado"], correcta: 1 },
        { pregunta: "¿Qué número tiene Eleven en el laboratorio?", respuestas: ["007", "008", "011", "012"], correcta: 2 },
        { pregunta: "¿Cuál es el nombre del monstruo principal de la primera temporada?", respuestas: ["Vecna", "Mind Flayer", "Demogorgon", "El Zarpazo"], correcta: 2 },
        { pregunta: "¿Quién interpreta a Dustin?", respuestas: ["Finn Wolfhard", "Gaten Matarazzo", "Caleb McLaughlin", "Noah Schnapp"], correcta: 1 },
        { pregunta: "¿En qué año se ambienta la primera temporada?", respuestas: ["1981", "1982", "1983", "1984"], correcta: 2 },
        { pregunta: "¿Cómo se llama la hermana de Mike?", respuestas: ["Nancy", "Karen", "Holly", "Barbara"], correcta: 0 },
        { pregunta: "¿Qué comida favorita come Dustin en el recreo?", respuestas: ["Pizza", "Pudín", "Galletas", "Frutas"], correcta: 1 },
        { pregunta: "¿Quién es el jefe de policía de Hawkins?", respuestas: ["Hopper", "Powell", "Callahan", "Steve"], correcta: 0 },
        { pregunta: "¿Quién interpreta a Eleven?", respuestas: ["Millie Bobby Brown", "Sadie Sink", "Natalia Dyer", "Maya Hawke"], correcta: 0 },
        { pregunta: "¿Qué poder tiene Eleven?", respuestas: ["Telepatía", "Telequinesis", "Invisibilidad", "Superfuerza"], correcta: 1 }
    ];
    
    function seleccionarPreguntasAleatorias(cantidad) {
        const copia = [...bancoPreguntas];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia.slice(0, cantidad);
    }
    
    let preguntas = seleccionarPreguntasAleatorias(6);
    let preguntaActual = 0, puntuacion = 0, juegoTerminado = false;
    
    function mostrarPregunta() {
        if (juegoTerminado) return;
        if (preguntaActual >= preguntas.length) {
            juegoTerminado = true;
            container.innerHTML = `<div class="trivia-resultado"><h3>🎉 ¡COMPLETASTE LA TRIVIA! 🎉</h3><p>Puntuación: ${puntuacion} / ${preguntas.length}</p><button id="reiniciarTrivia" class="btn-puzzle">🔄 JUGAR DE NUEVO</button><button id="nuevasPreguntasBtn" class="btn-puzzle" style="margin-left:10px;">🎲 NUEVAS PREGUNTAS</button></div>`;
            document.getElementById('reiniciarTrivia')?.addEventListener('click', () => location.reload());
            document.getElementById('nuevasPreguntasBtn')?.addEventListener('click', () => iniciarJuegoPreguntas(container));
            return;
        }
        const p = preguntas[preguntaActual];
        let html = `<div class="contador-puntuacion">📝 Pregunta ${preguntaActual+1} de ${preguntas.length} | 🎲 Preguntas aleatorias</div>`;
        html += `<div class="trivia-pregunta"><p>❓ ${p.pregunta}</p></div><div class="trivia-opciones">`;
        p.respuestas.forEach((resp, idx) => { html += `<div class="trivia-opcion" data-respuesta="${idx}">${resp}</div>`; });
        html += `</div><div class="trivia-resultado" id="triviaResultado"></div>`;
        container.innerHTML = html;
        
        document.querySelectorAll('.trivia-opcion').forEach(opt => {
            opt.addEventListener('click', (e) => {
                const seleccionada = parseInt(e.target.dataset.respuesta);
                const resultadoDiv = document.getElementById('triviaResultado');
                document.querySelectorAll('.trivia-opcion').forEach(btn => { btn.style.pointerEvents = 'none'; btn.style.opacity = '0.7'; });
                if (seleccionada === p.correcta) {
                    puntuacion++;
                    resultadoDiv.innerHTML = '✅ ¡Correcto! +1 punto';
                    resultadoDiv.style.color = '#00cc44';
                } else {
                    resultadoDiv.innerHTML = `❌ Incorrecto. La respuesta era: ${p.respuestas[p.correcta]}`;
                    resultadoDiv.style.color = '#ff3300';
                }
                preguntaActual++;
                setTimeout(() => mostrarPregunta(), 2000);
            });
        });
    }
    
    const resetButton = document.createElement('button');
    resetButton.innerText = '🎲 NUEVAS PREGUNTAS';
    resetButton.className = 'btn-puzzle';
    resetButton.style.marginTop = '15px';
    resetButton.style.width = '100%';
    resetButton.onclick = () => iniciarJuegoPreguntas(container);
    
    mostrarPregunta();
    container.appendChild(resetButton);
}

// ========== PARTÍCULAS ==========
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

// ========== EASTER EGG ==========
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
        alert('💀✨ ¡MENSAJE SECRETO! ✨💀\nVecna te está observando...');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 2000);
    }
});

console.log('✅ portal-abierto.js cargado correctamente');