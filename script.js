// Gestión de la navegación móvil
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    // Cargar actividades en actividades.html
    if (window.location.pathname.endsWith('actividades.html')) {
        loadActivities();
    }
    
    // Gestión del login en administrador.html
    if (window.location.pathname.endsWith('administrador.html')) {
        initAdminPage();
    }
});

// Funciones para el administrador
function initAdminPage() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const activityForm = document.getElementById('activity-form');
    
    // Verificar si ya está logueado
    if (localStorage.getItem('loggedIn') === 'true') {
        showAdminPanel();
    }
    
    // Manejar el login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'niko' && password === '123') {
                localStorage.setItem('loggedIn', 'true');
                showAdminPanel();
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
            const activityFile = document.getElementById('activity-file').files[0];
            
            if (activityName && activityFile) {
                saveActivity(activityName, activityFile);
                activityForm.reset();
            }
        });
    }
    
    // Cargar actividades existentes
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

// Gestión de actividades
function saveActivity(name, file) {
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const activity = {
            id: Date.now(),
            name: name,
            fileName: file.name,
            fileType: file.type,
            fileData: e.target.result,
            date: new Date().toISOString()
        };
        
        activities.push(activity);
        localStorage.setItem('activities', JSON.stringify(activities));
        
        // Recargar la lista de actividades
        loadAdminActivities();
        
        // Mostrar mensaje de éxito
        alert('Actividad guardada correctamente');
    };
    reader.readAsDataURL(file);
}

function loadActivities() {
    const activitiesList = document.getElementById('activities-list');
    if (!activitiesList) return;
    
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    if (activities.length === 0) {
        activitiesList.innerHTML = '<p>No hay actividades disponibles.</p>';
        return;
    }
    
    activitiesList.innerHTML = activities.map(activity => `
        <div class="activity-card">
            <div class="activity-content">
                <h3>${activity.name}</h3>
                <p>Fecha: ${new Date(activity.date).toLocaleDateString()}</p>
                <div class="activity-actions">
                    <button class="btn-neon" onclick="viewActivity(${activity.id})">Ver</button>
                    <button class="btn-neon" onclick="downloadActivity(${activity.id})">Descargar</button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadAdminActivities() {
    const adminActivitiesList = document.getElementById('admin-activities-list');
    if (!adminActivitiesList) return;
    
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    if (activities.length === 0) {
        adminActivitiesList.innerHTML = '<p>No hay actividades guardadas.</p>';
        return;
    }
    
    adminActivitiesList.innerHTML = activities.map(activity => `
        <div class="activity-card">
            <div class="activity-content">
                <h3>${activity.name}</h3>
                <p>Archivo: ${activity.fileName}</p>
                <p>Fecha: ${new Date(activity.date).toLocaleDateString()}</p>
                <div class="activity-actions">
                    <button class="btn-neon" onclick="viewActivity(${activity.id})">Ver</button>
                    <button class="btn-neon" onclick="downloadActivity(${activity.id})">Descargar</button>
                    <button class="btn-neon" onclick="deleteActivity(${activity.id})">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
}

function viewActivity(id) {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const activity = activities.find(a => a.id === id);
    
    if (activity) {
        // Verificar si es un tipo de archivo que se puede visualizar directamente
        const blob = dataURItoBlob(activity.fileData);
        const url = URL.createObjectURL(blob);
        
        // Abrir el archivo en una nueva pestaña
        window.open(url, '_blank');
    }
}

// Función auxiliar para convertir Data URI a Blob
function dataURItoBlob(dataURI) {
    // Separar el metadata del contenido real
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
    // Escribir los bytes del archivo
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], {type: mimeString});
}

function downloadActivity(id) {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const activity = activities.find(a => a.id === id);
    
    if (activity) {
        // Crear un enlace temporal para descargar el archivo
        const blob = dataURItoBlob(activity.fileData);
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = activity.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Liberar el objeto URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
}

function deleteActivity(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
        let activities = JSON.parse(localStorage.getItem('activities')) || [];
        activities = activities.filter(a => a.id !== id);
        localStorage.setItem('activities', JSON.stringify(activities));
        loadAdminActivities();
        
        // Si estamos en la página de actividades, recargar también
        if (window.location.pathname.endsWith('actividades.html')) {
            loadActivities();
        }
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
        
        // Posición aleatoria en el eje X
        snowflake.style.left = Math.random() * 100 + '%';
        
        // Tamaño aleatorio
        const size = Math.random() * 0.1 + 0.2;
        snowflake.style.fontSize = size + 'rem';
        
        // Duración de la animación aleatoria
        const duration = Math.random() * 20 + 10;
        snowflake.style.animationDuration = duration + 's';
        
        // Retraso aleatorio
        const delay = Math.random() * 2;
        snowflake.style.animationDelay = delay + 's';
        
        // Opacidad aleatoria
        snowflake.style.opacity = Math.random() * 10 + 15;
        
        snowContainer.appendChild(snowflake);
        
        // Remover el copo de nieve después de la animación
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
        }, (duration + delay) * 1000);
    }
    
    // Crear copos de nieve continuamente
    setInterval(createSnowflake, 400);
}

// Fondo Neon
function createNeonBackground() {
    const neonBackground = document.createElement('div');
    neonBackground.className = 'neon-background';
    
    // Crear círculos
    for (let i = 0; i < 3; i++) {
        const circle = document.createElement('div');
        circle.className = 'neon-circle';
        neonBackground.appendChild(circle);
    }
    
    // Crear líneas
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'neon-line';
        neonBackground.appendChild(line);
    }
    
    // Crear grid
    const grid = document.createElement('div');
    grid.className = 'neon-grid';
    neonBackground.appendChild(grid);
    
    document.body.appendChild(neonBackground);
}
// Función para el efecto de máquina de escribir
function typeWriterEffect(element, text, speed) {
  let i = 0;
  // Limpia el contenido antes de empezar
  element.textContent = ''; 
  const typing = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
      // Opcional: añade una pausa y luego borra el texto
      setTimeout(() => {
        deleteTextEffect(element, speed);
      }, 2000); // Espera 2 segundos antes de borrar
    }
  }, speed);
}

// Función para el efecto de borrado (opcional, para que se repita)
function deleteTextEffect(element, speed) {
  const deleting = setInterval(() => {
    if (element.textContent.length > 0) {
      element.textContent = element.textContent.slice(0, -1);
    } else {
      clearInterval(deleting);
      // Opcional: reinicia el efecto
      setTimeout(() => {
        startTyping();
      }, 500); // Espera medio segundo para empezar de nuevo
    }
  }, speed / 2); // Borra más rápido que escribe
}

// Texto de bienvenida que quieres mostrar
const welcomeText = "Hola,soy ...";
const typingSpeed = 70; // Velocidad en milisegundos

// Función principal para iniciar el efecto
function startTyping() {
  const dynamicTextElement = document.querySelector('.dynamic-text');
  if (dynamicTextElement) {
    typeWriterEffect(dynamicTextElement, welcomeText, typingSpeed);
  }
}

// Llama a la función cuando el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', startTyping);

// Inicializar efectos cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    createSnowflakes();
    createNeonBackground();
});
