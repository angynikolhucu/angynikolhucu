document.addEventListener('DOMContentLoaded', () => {
    const activitiesContainer = document.getElementById('activities-list');

    // Define un array de objetos con la información de las actividades
    const activities = [
        {
            title: 'Actividad 1',
            description: 'Fundamentos de proyecto web',
            file: 'pdfs/fundamentosproyectoweb.pdf'
        }
    ];

    // Recorre el array y crea el HTML para cada actividad
    activities.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';

        activityCard.innerHTML = `
            <h3>${activity.title}</h3>
            <p>${activity.description}</p>
            <a href="${activity.file}" target="_blank" class="download-link">
                Ver y descargar PDF
            </a>
        `;

        activitiesContainer.appendChild(activityCard);
    });
});