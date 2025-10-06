// activity.js - Carga dinámica de actividades desde archivos PDF y localStorage

document.addEventListener('DOMContentLoaded', function() {
    const activitiesGrid = document.getElementById('activities-list');
    
    // Crear el modal neón
    createNeonModal();
    
    // Primero cargar actividades del JSON
    fetch('pdfs/actividades.json')
        .then(response => {
            if (!response.ok) {
                // Si no encuentra el archivo, muestra un mensaje más específico
                if (response.status === 404) {
                    throw new Error('Archivo actividades.json no encontrado');
                }
                throw new Error('No se pudo cargar la lista de actividades');
            }
            return response.json();
        })
        .then(activities => {
            // Verificar si hay actividades
            if (!activities || activities.length === 0) {
                console.log('No hay actividades en el archivo JSON');
                // Cargar actividades locales después de verificar que no hay JSON
                loadLocalActivities();
                return;
            }
            
            // Ordenar actividades por número (actividad1, actividad2, etc.)
            activities.sort((a, b) => {
                const numA = parseInt(a.file.match(/\d+/)?.[0] || 0);
                const numB = parseInt(b.file.match(/\d+/)?.[0] || 0);
                return numA - numB;
            });
            
            // Generar el HTML para cada actividad del JSON
            activities.forEach(activity => {
                const activityCard = createJSONActivityCard(activity);
                activitiesGrid.appendChild(activityCard);
            });
            
            // Después de cargar las actividades del JSON, cargar las locales
            loadLocalActivities();
        })
        .catch(error => {
            console.error('Error cargando JSON:', error);
            // Si hay error cargando JSON, cargar solo actividades locales
            loadLocalActivities();
        });
});

// Función para crear el modal neón
function createNeonModal() {
    const modalHTML = `
        <div id="neonModal" class="neon-modal">
            <div class="neon-modal-content">
                <span class="neon-close">&times;</span>
                <iframe id="neonModalIframe" width="100%" height="100%"></iframe>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar event listeners para el modal
    const modal = document.getElementById('neonModal');
    const closeBtn = document.querySelector('.neon-close');
    
    // Cerrar modal al hacer clic en la X
    closeBtn.addEventListener('click', function() {
        closeNeonModal();
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeNeonModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNeonModal();
        }
    });
}

// Función para abrir el modal neón
function openNeonModal(fileUrl, fileName) {
    const modal = document.getElementById('neonModal');
    const iframe = document.getElementById('neonModalIframe');
    
    iframe.src = fileUrl;
    iframe.title = fileName;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

// Función para cerrar el modal neón
function closeNeonModal() {
    const modal = document.getElementById('neonModal');
    const iframe = document.getElementById('neonModalIframe');
    
    modal.style.display = 'none';
    iframe.src = ''; // Limpiar el iframe
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
}

// Función para cargar actividades del localStorage (al final)
function loadLocalActivities() {
    const activitiesGrid = document.getElementById('activities-list');
    const localActivities = JSON.parse(localStorage.getItem('activities')) || [];
    
    if (localActivities.length === 0) {
        return; // No hay actividades locales
    }
    
    // Generar el HTML para cada actividad local
    localActivities.forEach(activity => {
        const activityCard = createLocalActivityCard(activity);
        activitiesGrid.appendChild(activityCard);
    });
}

// Función para crear una tarjeta de actividad desde JSON (original)
function createJSONActivityCard(activity) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.setAttribute('data-source', 'json');
    
    card.innerHTML = `
        <div class="activity-icon">
            <i class="fas fa-file-pdf"></i>
        </div>
        <h3 class="activity-title">${activity.title || 'Actividad'}</h3>
        <p class="activity-description">${activity.description || 'Actividad de aprendizaje'}</p>
        <div class="activity-actions">
            <button class="btn btn-view json-file-view" data-fileurl="pdfs/${activity.file}" data-filename="${activity.title}">
                <i class="fas fa-eye"></i> Ver
            </button>
            <a href="pdfs/${activity.file}" class="btn btn-download" download>
                <i class="fas fa-download"></i> Descargar
            </a>
        </div>
    `;
    
    // Añadir event listener para el botón de ver
    const viewButton = card.querySelector('.json-file-view');
    viewButton.addEventListener('click', function() {
        const fileUrl = this.getAttribute('data-fileurl');
        const fileName = this.getAttribute('data-filename');
        openNeonModal(fileUrl, fileName);
    });
    
    return card;
}

// Función para crear una tarjeta de actividad desde localStorage
function createLocalActivityCard(activity) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.setAttribute('data-source', 'local');
    
    // Determinar el icono según el tipo de archivo
    let fileIcon = 'fa-file';
    if (activity.fileName) {
        if (activity.fileName.endsWith('.pdf')) fileIcon = 'fa-file-pdf';
        else if (activity.fileName.endsWith('.doc') || activity.fileName.endsWith('.docx')) fileIcon = 'fa-file-word';
        else if (activity.fileName.endsWith('.xls') || activity.fileName.endsWith('.xlsx')) fileIcon = 'fa-file-excel';
        else if (activity.fileName.endsWith('.ppt') || activity.fileName.endsWith('.pptx')) fileIcon = 'fa-file-powerpoint';
        else if (activity.fileName.endsWith('.zip') || activity.fileName.endsWith('.rar')) fileIcon = 'fa-file-archive';
    }
    
    card.innerHTML = `
        <div class="activity-icon">
            <i class="fas ${fileIcon}"></i>
        </div>
        <h3 class="activity-title">${activity.title || 'Actividad'}</h3>
        <p class="activity-description">${activity.description || 'Actividad guardada localmente'}</p>
        <div class="activity-actions">
            <button class="btn btn-view local-file-view" data-filedata="${activity.fileData}" data-filename="${activity.fileName}">
                <i class="fas fa-eye"></i> Ver
            </button>
            <a href="${activity.fileData}" class="btn btn-download" download="${activity.fileName}">
                <i class="fas fa-download"></i> Descargar
            </a>
        </div>
    `;
    
    // Añadir event listener para el botón de ver
    const viewButton = card.querySelector('.local-file-view');
    viewButton.addEventListener('click', function() {
        const fileData = this.getAttribute('data-filedata');
        const fileName = this.getAttribute('data-filename');
        viewLocalFile(fileData, fileName);
    });
    
    return card;
}

// Función para visualizar archivos locales
function viewLocalFile(fileData, fileName) {
    if (fileName.endsWith('.pdf')) {
        // Para PDFs locales, abrir en el modal neón
        openNeonModal(fileData, fileName);
    } else {
        // Para otros tipos de archivo, mostrar mensaje
        alert('Solo se pueden visualizar archivos PDF directamente. Para otros formatos, por favor descargue el archivo.');
    }
}