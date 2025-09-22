// Gestión de la navegación móvil y inicialización
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Persistencia del menú de hamburguesa
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cierra el menú cuando se hace clic en un enlace
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    // Inicialización de efectos visuales
    createSnowflakes();
    createNeonBackground();

    // Efecto de máquina de escribir
    startTyping();
    
    // Inicializar el tema
    initTheme();
    
    // Configurar el botón de cambio de tema
    setupThemeToggle();
    
    // Resaltar elemento de menú activo
    setActiveMenuItem();
});

// Función para resaltar el elemento de menú activo
function setActiveMenuItem() {
    // Obtener la URL actual
    const currentPage = window.location.pathname.split('/').pop();
    
    // Si estamos en la página principal (index.html o raíz)
    if (currentPage === '' || currentPage === 'index.html' || currentPage === '/') {
        const homeLink = document.querySelector('a[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
        return;
    }
    
    // Buscar todos los enlaces del menú
    const menuLinks = document.querySelectorAll('.nav-link');
    
    // Remover la clase active de todos los enlaces
    menuLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar la clase active al enlace correspondiente a la página actual
    const currentLink = document.querySelector(`a[href="${currentPage}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
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

// Gestión del cambio de tema
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Establecer tema basado en preferencias guardadas o del sistema
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Actualizar texto del botón
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        if (theme === 'light') {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Modo Oscuro';
        }
    }
    
    // Ajustar elementos específicos según el tema
    adjustElementsForTheme(theme);
}

function adjustElementsForTheme(theme) {
    const snowContainer = document.getElementById('snow-container');
    if (snowContainer) {
        if (theme === 'light') {
            snowContainer.style.display = 'none';
        } else {
            snowContainer.style.display = 'block';
        }
    }
    
    // Opcional: Ajustar el fondo neon según el tema
    const neonBackground = document.querySelector('.neon-background');
    if (neonBackground) {
        if (theme === 'light') {
            neonBackground.style.opacity = '0.1'; // Más sutil en modo claro
        } else {
            neonBackground.style.opacity = '1'; // Completo en modo oscuro
        }
    }
}