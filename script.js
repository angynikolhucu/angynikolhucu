// Constantes para el administrador
const ADMIN_USER = "niko"; // Tu usuario de administrador
const ADMIN_PASS = "123"; // Tu contraseña de administrador

// URL base de tu repositorio en GitHub Pages
const REPO_URL = "https://angynikolhucu.github.io/angynikolhucu/";
const PDF_FOLDER = "pdfs/";

// ---------------- GESTIÓN DE ACTIVIDADES ----------------

// Actividades base que no se pueden eliminar
const baseActividades = [
    // Asegúrate de que el archivo 'ejemplo.pdf' exista en la carpeta 'pdfs/'
    { nombre: "Mi primera actividad", archivo: "ejemplo.pdf" }
];

function getActividades() {
    let actividadesGuardadas = JSON.parse(localStorage.getItem("actividades")) || [];
    return [...baseActividades, ...actividadesGuardadas];
}

function saveActividad(actividad) {
    let actividadesGuardadas = JSON.parse(localStorage.getItem("actividades")) || [];
    actividadesGuardadas.push(actividad);
    localStorage.setItem("actividades", JSON.stringify(actividadesGuardadas));
}

function deleteActividad(index) {
    let actividadesGuardadas = JSON.parse(localStorage.getItem("actividades")) || [];
    actividadesGuardadas.splice(index, 1);
    localStorage.setItem("actividades", JSON.stringify(actividadesGuardadas));
    loadAdminActivities();
    if (window.location.pathname.endsWith('actividades.html')) {
        loadActivities();
    }
}

function loadActivities() {
    const activitiesList = document.getElementById('activities-list');
    if (!activitiesList) return;

    const actividades = getActividades();
    
    if (actividades.length === 0) {
        activitiesList.innerHTML = '<p>No hay actividades disponibles.</p>';
        return;
    }
    
    activitiesList.innerHTML = actividades.map(act => {
        const fullUrl = REPO_URL + PDF_FOLDER + act.archivo;
        return `
            <div class="activity-card">
                <div class="activity-content">
                    <h3>${act.nombre}</h3>
                    <div class="activity-actions">
                        <a href="${fullUrl}" target="_blank" class="btn-neon">Ver</a>
                        <a href="${fullUrl}" download="${act.nombre}.pdf" class="btn-neon">Descargar</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ---------------- FUNCIONALIDAD EN administrador.html ----------------

function initAdminPage() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const activityForm = document.getElementById('activity-form');
    
    if (localStorage.getItem('loggedIn') === 'true') {
        showAdminPanel();
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === ADMIN_USER && password === ADMIN_PASS) {
                localStorage.setItem('loggedIn', 'true');
                showAdminPanel();
            } else {
                showMessage('Usuario o contraseña incorrectos', 'error');
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedIn');
            hideAdminPanel();
        });
    }
    
    if (activityForm) {
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('activity-name').value;
            const archivo = document.getElementById('activity-file').value;
            
            if (!nombre || !archivo) {
                alert("Por favor, llena ambos campos.");
                return;
            }
            
            const nuevaActividad = { nombre, archivo };
            saveActividad(nuevaActividad);
            
            alert("Actividad agregada. ¡Recuerda subir el PDF a la carpeta 'pdfs/' de tu repositorio!");
            activityForm.reset();
            loadAdminActivities();
        });
    }
}

function showAdminPanel() {
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    if (loginSection && adminPanel) {
        loginSection.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        loadAdminActivities();
    }
}

function hideAdminPanel() {
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    if (loginSection && adminPanel) {
        loginSection.classList.remove('hidden');
        adminPanel.classList.add('hidden');
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('login-message');
    if (messageDiv) {
        messageDiv.innerHTML = message;
        messageDiv.className = `message ${type}`;
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 3000);
    }
}

function loadAdminActivities() {
    const adminActivitiesList = document.getElementById('admin-activities-list');
    if (!adminActivitiesList) return;

    const actividades = getActividades();
    adminActivitiesList.innerHTML = actividades.map((act, index) => {
        const isBaseActivity = index < baseActividades.length;
        const fullUrl = REPO_URL + PDF_FOLDER + act.archivo;
        return `
            <div class="activity-card">
                <div class="activity-content">
                    <h3>${act.nombre}</h3>
                    <p>Archivo: ${act.archivo}</p>
                    <div class="activity-actions">
                        <a href="${fullUrl}" target="_blank" class="btn-neon">Ver</a>
                        <a href="${fullUrl}" download="${act.nombre}.pdf" class="btn-neon">Descargar</a>
                        ${!isBaseActivity ? `<button class="btn-neon" onclick="deleteActivity(${index - baseActividades.length})">Eliminar</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ---------------- EFECTOS Y NAVEGACIÓN ----------------

// Gestión de la navegación móvil
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
}

// Efecto de Nieve
function createSnowflakes() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    snowContainer.id = 'snow-container';
    document.body.appendChild(snowContainer);
    
    const snowflakeSymbols = ['✦', '✧', '✩'];
    
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
        
        snowflake.style.left = Math.random() * 100 + '%';
        const size = Math.random() * 0.1 + 0.2;
        snowflake.style.fontSize = size + 'rem';
        const duration = Math.random() * 20 + 10;
        snowflake.style.animationDuration = duration + 's';
        const delay = Math.random() * 2;
        snowflake.style.animationDelay = delay + 's';
        snowflake.style.opacity = Math.random() * 10 + 15;
        
        snowContainer.appendChild(snowflake);
        
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
        }, (duration + delay) * 1000);
    }
    
    setInterval(createSnowflake, 400);
}

// Fondo Neon
function createNeonBackground() {
    const neonBackground = document.createElement('div');
    neonBackground.className = 'neon-background';
    
    for (let i = 0; i < 3; i++) {
        const circle = document.createElement('div');
        circle.className = 'neon-circle';
        neonBackground.appendChild(circle);
    }
    
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'neon-line';
        neonBackground.appendChild(line);
    }
    
    const grid = document.createElement('div');
    grid.className = 'neon-grid';
    neonBackground.appendChild(grid);
    
    document.body.appendChild(neonBackground);
}

// Efecto de máquina de escribir
function typeWriterEffect(element, text, speed) {
    let i = 0;
    element.textContent = '';
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
            setTimeout(() => {
                deleteTextEffect(element, speed);
            }, 2000);
        }
    }, speed);
}

function deleteTextEffect(element, speed) {
    const deleting = setInterval(() => {
        if (element.textContent.length > 0) {
            element.textContent = element.textContent.slice(0, -1);
        } else {
            clearInterval(deleting);
            setTimeout(() => {
                startTyping();
            }, 500);
        }
    }, speed / 2);
}

const welcomeText = "Hola,soy ...";
const typingSpeed = 70;

function startTyping() {
    const dynamicTextElement = document.querySelector('.dynamic-text');
    if (dynamicTextElement) {
        typeWriterEffect(dynamicTextElement, welcomeText, typingSpeed);
    }
}

// ---------------- INICIALIZACIÓN ----------------

document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    createSnowflakes();
    createNeonBackground();
    startTyping();

    if (window.location.pathname.endsWith('actividades.html')) {
        loadActivities();
    } else if (window.location.pathname.endsWith('administrador.html')) {
        initAdminPage();
    }
});