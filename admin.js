// admin.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const adminPanel = document.getElementById('admin-panel');
    const logoutBtn = document.getElementById('logout-btn');
    const activityForm = document.getElementById('activity-form');
    const adminActivitiesList = document.getElementById('admin-activities-list');
    const activityFileInput = document.getElementById('activity-file');
    
    // Credenciales válidas
    const validUsername = 'niko';
    const validPassword = '123';
    
    // Verificar si el usuario ya está logueado
    checkLoginStatus();
    
    // Evento para el formulario de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === validUsername && password === validPassword) {
            // Guardar estado de login en localStorage
            localStorage.setItem('isLoggedIn', 'true');
            
            // Mostrar panel de administración
            loginSection.classList.add('hidden');
            adminPanel.classList.remove('hidden');
            
            // Cargar actividades existentes
            loadAdminActivities();
        } else {
            showMessage('Credenciales incorrectas. Intenta nuevamente.', 'error');
        }
    });
    
    // Evento para cerrar sesión
    logoutBtn.addEventListener('click', function() {
        logout();
    });
    
    // Evento para el formulario de actividad
    activityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('activity-name').value;
        const description = document.getElementById('activity-description').value;
        const file = activityFileInput.files[0];
        
        if (!title || !description || !file) {
            showMessage('Por favor, completa todos los campos.', 'error');
            return;
        }
        
        // Leer el archivo como Data URL para almacenarlo
        const reader = new FileReader();
        reader.onload = function(e) {
            saveActivity(title, description, file.name, e.target.result);
            activityForm.reset();
            showMessage('Actividad guardada correctamente.', 'success');
            
            // Recargar la lista de actividades
            loadAdminActivities();
        };
        reader.readAsDataURL(file);
    });
    
    // Función para verificar estado de login
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
            loginSection.classList.add('hidden');
            adminPanel.classList.remove('hidden');
            loadAdminActivities();
        }
    }
    
    // Función para cerrar sesión
    function logout() {
        localStorage.removeItem('isLoggedIn');
        loginSection.classList.remove('hidden');
        adminPanel.classList.add('hidden');
        loginForm.reset();
    }
    
    // Función para guardar actividad
    function saveActivity(title, description, fileName, fileData) {
        // Obtener actividades existentes
        let activities = JSON.parse(localStorage.getItem('activities')) || [];
        
        // Crear nueva actividad
        const newActivity = {
            id: Date.now(), // ID único basado en timestamp
            title: title,
            description: description,
            fileName: fileName,
            fileData: fileData,
            date: new Date().toLocaleDateString('es-ES'),
            type: 'local' // Marcar como actividad local
        };
        
        // Agregar a la lista
        activities.push(newActivity);
        
        // Guardar en localStorage
        localStorage.setItem('activities', JSON.stringify(activities));
    }
    
    // Función para cargar actividades en el panel de administración
    function loadAdminActivities() {
        // Limpiar lista
        adminActivitiesList.innerHTML = '';
        
        // Primero cargar actividades del JSON
        loadJSONActivities();
        
        // Luego cargar actividades locales
        loadLocalActivities();
    }
    
    // Función para cargar actividades del JSON
    function loadJSONActivities() {
        // Cargar actividades del archivo JSON
        fetch('pdfs/actividades.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo JSON');
                }
                return response.json();
            })
            .then(activities => {
                if (activities && activities.length > 0) {
                    // Ordenar actividades por número
                    activities.sort((a, b) => {
                        const numA = parseInt(a.file.match(/\d+/)?.[0] || 0);
                        const numB = parseInt(b.file.match(/\d+/)?.[0] || 0);
                        return numA - numB;
                    });
                    
                    // Crear sección para actividades JSON
                    const jsonSection = document.createElement('div');
                    jsonSection.innerHTML = '<h3>Actividades del Sistema (J)</h3>';
                    
                    // Crear elementos para cada actividad JSON
                    activities.forEach(activity => {
                        const activityElement = document.createElement('div');
                        activityElement.classList.add('activity-item', 'json-activity');
                        activityElement.innerHTML = `
                            <h4>${activity.title || 'Actividad'}</h4>
                            <p>${activity.description || 'Actividad del sistema'}</p>
                            <p>Archivo: ${activity.file}</p>
                            <p class="activity-note"><em>(Actividad del sistema - No se puede eliminar)</em></p>
                        `;
                        
                        jsonSection.appendChild(activityElement);
                    });
                    
                    adminActivitiesList.appendChild(jsonSection);
                }
            })
            .catch(error => {
                console.error('Error cargando actividades JSON:', error);
            });
    }
    
    // Función para cargar actividades locales
    function loadLocalActivities() {
        // Obtener actividades del localStorage
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        
        if (activities.length === 0) {
            // Mostrar mensaje solo si tampoco hay actividades JSON
            if (adminActivitiesList.children.length === 0) {
                adminActivitiesList.innerHTML = '<p>No hay actividades guardadas.</p>';
            }
            return;
        }
        
        // Crear sección para actividades locales
        const localSection = document.createElement('div');
        localSection.innerHTML = '<h3>Actividades Agregadas (L)</h3>';
        
        // Crear elementos para cada actividad local
        activities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.classList.add('activity-item', 'local-activity');
            activityElement.innerHTML = `
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <p>Archivo: ${activity.fileName}</p>
                <p>Fecha: ${activity.date}</p>
                <button class="btn-delete" data-id="${activity.id}">Eliminar</button>
            `;
            
            localSection.appendChild(activityElement);
        });
        
        adminActivitiesList.appendChild(localSection);
        
        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteActivity(id);
            });
        });
    }
    
    // Función para eliminar actividad
    function deleteActivity(id) {
        let activities = JSON.parse(localStorage.getItem('activities')) || [];
        
        // Filtrar la actividad a eliminar
        activities = activities.filter(activity => activity.id !== id);
        
        // Guardar cambios
        localStorage.setItem('activities', JSON.stringify(activities));
        
        // Recargar lista
        loadAdminActivities();
        showMessage('Actividad eliminada correctamente.', 'success');
    }
    
    // Función para mostrar mensajes
    function showMessage(message, type) {
        const messageElement = document.getElementById('login-message');
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'message';
        }, 3000);
    }
});