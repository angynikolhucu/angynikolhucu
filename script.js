// Gestión de la navegación móvil
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Cargar actividades en actividades.html
    if (window.location.pathname.endsWith('actividades.html') || window.location.pathname === '/actividades.html') {
        loadActivities();
    }
    
    // Gestión del login en administrador.html
    if (window.location.pathname.endsWith('administrador.html') || window.location.pathname === '/administrador.html') {
        initAdminPage();
    }
});

//---
// Funciones para el administrador
//---

// Esta función se encarga de todo el panel de administración.
async function initAdminPage() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const activityForm = document.getElementById('activity-form');
    const pdfSelect = document.getElementById('activity-pdf-select');

    // Verificar si ya está logueado
    if (localStorage.getItem('loggedIn') === 'true') {
        showAdminPanel();
        await populatePdfSelect(); // Llenar el combobox al cargar la página si ya está logueado
    }
    
    // Manejar el login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'niko' && password === '123') {
                localStorage.setItem('loggedIn', 'true');
                showAdminPanel();
                await populatePdfSelect(); // Llenar el combobox al iniciar sesión
                loadAdminActivities(); // Cargar la lista de actividades guardadas
            } else {
                showMessage('Usuario o contraseña incorrectos', 'error');
                setTimeout(() => {
                    document.getElementById('login-message').innerHTML = '';
                }, 3000);
            }
        });
    }
    
    // Manejar el logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedIn');
            hideAdminPanel();
        });
    }
    
    // Manejar el formulario de actividades
    if (activityForm) {
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const activityName = document.getElementById('activity-name').value;
            const selectedPdfPath = pdfSelect.value;
            
            if (activityName && selectedPdfPath) {
                saveActivity(activityName, selectedPdfPath);
                activityForm.reset();
            } else {
                alert('Por favor, selecciona un PDF y escribe un nombre.');
            }
        });
    }
    
    // Cargar la lista de actividades guardadas al inicio
    loadAdminActivities();
}

function showAdminPanel() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
}

function hideAdminPanel() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('login-message');
    messageDiv.innerHTML = message;
    messageDiv.className = `message ${type}`;
}

//---
// Lógica para listar PDFs desde GitHub y guardar en localStorage
//---

async function getPdfList() {
    // Reemplaza 'angynikolhucu' con tu nombre de usuario y 'angynikolhucu' con el nombre de tu repositorio
    const username = 'angynikolhucu'; 
    const repoName = 'angynikolhucu';
    const pdfsFolderPath = 'pdfs';
    const apiUrl = `https://api.github.com/repos/${username}/${repoName}/contents/${pdfsFolderPath}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        
        return data.filter(item => item.type === 'file' && item.name.endsWith('.pdf'));
    } catch (error) {
        console.error('Error al obtener la lista de PDFs:', error);
        return [];
    }
}

async function populatePdfSelect() {
    const pdfSelect = document.getElementById('activity-pdf-select');
    const pdfs = await getPdfList();

    pdfSelect.innerHTML = ''; // Limpiar opciones anteriores

    if (pdfs.length > 0) {
        pdfs.forEach(pdf => {
            const option = document.createElement('option');
            // Usamos la URL raw del archivo, que es la que se usa para ver y descargar
            option.value = `https://raw.githubusercontent.com/${pdf.path}`;
            option.textContent = pdf.name;
            pdfSelect.appendChild(option);
        });
    } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No se encontraron PDFs.';
        pdfSelect.appendChild(option);
    }
}

function saveActivity(name, pdfPath) {
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    const activity = {
        id: Date.now(),
        name: name,
        pdfPath: pdfPath,
        date: new Date().toISOString()
    };
    
    activities.push(activity);
    localStorage.setItem('activities', JSON.stringify(activities));
    
    loadAdminActivities(); // Recargar la lista en el panel de admin
    alert('Actividad guardada correctamente');
}

function deleteActivity(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
        let activities = JSON.parse(localStorage.getItem('activities')) || [];
        activities = activities.filter(a => a.id !== id);
        localStorage.setItem('activities', JSON.stringify(activities));
        loadAdminActivities();
    }
}

//---
// Lógica para mostrar actividades en actividades.html y en el panel de admin
//---

function loadActivities() {
    const activitiesList = document.getElementById('activities-list');
    if (!activitiesList) return;
    
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    if (activities.length === 0) {
        activitiesList.innerHTML = '<p>No hay actividades disponibles.</p>';
        return;
    }
    
    activitiesList.innerHTML = activities.map(activity => {
        const fileName = activity.pdfPath.split('/').pop();
        return `
            <div class="activity-card">
                <div class="activity-content">
                    <h3>${activity.name}</h3>
                    <p>Archivo: ${fileName}</p>
                    <p>Fecha: ${new Date(activity.date).toLocaleDateString()}</p>
                    <div class="activity-actions">
                        <a href="${activity.pdfPath}" class="btn-neon" target="_blank">Ver</a>
                        <a href="${activity.pdfPath}" class="btn-neon" download="${fileName}">Descargar</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadAdminActivities() {
    const adminActivitiesList = document.getElementById('admin-activities-list');
    if (!adminActivitiesList) return;
    
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    if (activities.length === 0) {
        adminActivitiesList.innerHTML = '<p>No hay actividades guardadas.</p>';
        return;
    }
    
    adminActivitiesList.innerHTML = activities.map(activity => {
        const fileName = activity.pdfPath.split('/').pop();
        return `
            <div class="activity-card">
                <div class="activity-content">
                    <h3>${activity.name}</h3>
                    <p>Archivo: ${fileName}</p>
                    <p>Fecha: ${new Date(activity.date).toLocaleDateString()}</p>
                    <div class="activity-actions">
                        <a href="${activity.pdfPath}" class="btn-neon" target="_blank">Ver</a>
                        <a href="${activity.pdfPath}" class="btn-neon" download="${fileName}">Descargar</a>
                        <button class="btn-neon" onclick="deleteActivity(${activity.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

//---
// Efectos visuales que ya tenías
//---

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
        
        const opacity = Math.random() * 0.5 + 0.5;
        snowflake.style.opacity = opacity;
        
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

const welcomeText = "Hola, soy...";
const typingSpeed = 70;

function startTyping() {
    const dynamicTextElement = document.querySelector('.dynamic-text');
    if (dynamicTextElement) {
        typeWriterEffect(dynamicTextElement, welcomeText, typingSpeed);
    }
}

//---
// Inicialización de efectos al cargar
//---

document.addEventListener('DOMContentLoaded', function() {
    startTyping();
    createSnowflakes();
    createNeonBackground();
});