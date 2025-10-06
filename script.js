document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (navMenu.classList.contains('active')) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }));
    }
    createSnowflakes();
    createNeonBackground();
    startTyping();
    createClouds();
    initTheme();
    setupThemeToggle();
    setActiveMenuItem();
    initHangingLights();
    initMusicPlayer();
    window.addEventListener('resize', function() {
        setTimeout(createClouds, 100);
    });
});

function setActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === '' || currentPage === 'index.html' || currentPage === '/') {
        const homeLink = document.querySelector('a[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
        return;
    }
    
    const menuLinks = document.querySelectorAll('.nav-link');

    menuLinks.forEach(link => {
        link.classList.remove('active');
    });
    
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

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    

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
    

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        if (theme === 'light') {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Modo Oscuro';
        }
    }

    adjustElementsForTheme(theme);
}

function adjustElementsForTheme(theme) {
    const snowContainer = document.getElementById('snow-container');
    if (snowContainer) {
        snowContainer.style.display = theme === 'light' ? 'none' : 'block';
    }
    
    const hangingLights = document.getElementById('hanging-lights');
    if (hangingLights) {
        if (theme === 'light') {
            hangingLights.style.display = 'none';
        } else {
            hangingLights.style.display = 'flex';
            if (hangingLights.children.length === 0) {
                console.log('Regenerando focos para tema oscuro...');
                generateHangingLights();
            }
        }
    }
    
    const neonBackground = document.querySelector('.neon-background');
    if (neonBackground) {
        neonBackground.style.opacity = theme === 'light' ? '0.1' : '1';
    }
    
    if (theme === 'light') {
        createClouds();
    }
}

function generateHangingLights() {
    const hangingLights = document.getElementById('hanging-lights');
    if (!hangingLights) return;
    
    hangingLights.innerHTML = '';
    
    const screenWidth = window.innerWidth;
    let numberOfLights, positions;
    if (screenWidth < 768) {
        numberOfLights = 5;
        positions = [5, 10, 15, 20];
    } else if (screenWidth < 1024) {
        numberOfLights = 7;
        positions = [8, 15, 22, 29];
    } else {
        numberOfLights = 10;
        positions = [10, 18, 26, 34]; 
    }
    
    const sizes = ['small', 'medium', 'large'];
    
    for (let i = 0; i < numberOfLights; i++) {
        const light = document.createElement('div');
        light.className = 'light';
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        light.classList.add(randomSize);
        const randomPosition = positions[Math.floor(Math.random() * positions.length)];
        light.style.marginTop = `${randomPosition}px`;
        const randomOffset = (Math.random() * 12 - 6);
        light.style.transform = `translateX(${randomOffset}px)`;
        const randomDelay = Math.random() * 6;
        light.style.animationDelay = `${randomDelay}s`;
        
        const randomDuration = 3.5 + Math.random() * 2.5;
        light.style.animationDuration = `${randomDuration}s`;
        
        hangingLights.appendChild(light);
    }
    
    console.log(`Generados ${numberOfLights} focos para pantalla de ${screenWidth}px`);
}

// Función para crear nubes animadas
function createClouds() {
    const cloudsContainer = document.getElementById('clouds-container');
    if (!cloudsContainer) return;
    
    cloudsContainer.innerHTML = '';
    
    const cloudCount = 12;
    const sizes = ['small', 'medium', 'large'];
    
    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        cloud.classList.add(randomSize);
        
        const topPosition = Math.random() * 80 + 5; 
        cloud.style.top = `${topPosition}%`;
        
        let duration;
        if (randomSize === 'small') {
            duration = 25 + Math.random() * 20; 
        } else if (randomSize === 'medium') {
            duration = 40 + Math.random() * 30; 
        } else {
            duration = 60 + Math.random() * 40; 
        }
        
        cloud.style.animationDuration = `${duration}s`;
        
        const delay = Math.random() * -duration;
        cloud.style.animationDelay = `${delay}s`;
        
        if (randomSize === 'small') {
            cloud.style.zIndex = '1';
        } else if (randomSize === 'medium') {
            cloud.style.zIndex = '2';
        } else {
            cloud.style.zIndex = '3';
        }
        
        cloudsContainer.appendChild(cloud);
    }
    
    console.log(`Creadas ${cloudCount} nubes para modo claro`);
}

// inicializar los focos
function initHangingLights() {
    console.log('Inicializando focos colgantes...');
    generateHangingLights();
    
    window.addEventListener('resize', function() {
        setTimeout(generateHangingLights, 100);
    });
}

function initMusicPlayer() {
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const profileImage = document.querySelector('.profile-image');
    
    if (!musicToggleBtn || !backgroundMusic) {
        console.log('Elementos del reproductor de música no encontrados');
        return;
    }
    
    let isPlaying = false;
    
    const soundWaves = document.createElement('div');
    soundWaves.className = 'sound-waves';
    
    const wave1 = document.createElement('div');
    wave1.className = 'wave wave-1';
    
    const wave2 = document.createElement('div');
    wave2.className = 'wave wave-2';
    
    const wave3 = document.createElement('div');
    wave3.className = 'wave wave-3';
    
    soundWaves.appendChild(wave1);
    soundWaves.appendChild(wave2);
    soundWaves.appendChild(wave3);
    
    const musicPlayerContainer = document.querySelector('.music-player-container');
    if (musicPlayerContainer) {
        musicPlayerContainer.appendChild(soundWaves);
    }
    function toggleMusic() {
        if (isPlaying) {
            backgroundMusic.pause();
            musicToggleBtn.classList.remove('playing');
            soundWaves.style.display = 'none';
            musicToggleBtn.innerHTML = '<i class="fas fa-play"></i><div class="vinyl-record"></div>';
        } else {
            backgroundMusic.play().catch(error => {
                console.log('Error al reproducir música:', error);
                alert('No se pudo reproducir la música. Verifica que el archivo exista en la ruta music/nube.mp3');
            });
            musicToggleBtn.classList.add('playing');
            soundWaves.style.display = 'block';
            musicToggleBtn.innerHTML = '<i class="fas fa-pause"></i><div class="vinyl-record"></div>';
        }
        isPlaying = !isPlaying;
    }
    musicToggleBtn.addEventListener('click', toggleMusic);
    
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            if (isPlaying) {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    backgroundMusic.addEventListener('ended', function() {
        isPlaying = false;
        musicToggleBtn.classList.remove('playing');
        soundWaves.style.display = 'none';
        musicToggleBtn.innerHTML = '<i class="fas fa-play"></i><div class="vinyl-record"></div>';
    });
    backgroundMusic.addEventListener('error', function() {
        console.error('Error al cargar el archivo de audio');
        musicToggleBtn.style.opacity = '0.5';
        musicToggleBtn.style.cursor = 'not-allowed';
        musicToggleBtn.title = 'Archivo de audio no disponible';
    });
    
    console.log('Reproductor de música inicializado correctamente');
}