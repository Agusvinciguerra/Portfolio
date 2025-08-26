// === MODAL FUNCTIONALITY ===
class ModalManager {
    constructor() {
        this.currentModal = null;
        this.currentGameModal = null;
        this.init();
    }

    init() {
        this.createModalContainer();
        this.createGameModalContainer();
        this.createImagePopup();
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
            if (e.target.classList.contains('game-modal-overlay')) {
                this.closeGameModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.currentModal) {
                    this.closeModal();
                }
                if (this.currentGameModal) {
                    this.closeGameModal();
                }
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            const projectImages = document.querySelectorAll('.project-img');
            
            projectImages.forEach(projectImg => {
                const video = projectImg.querySelector('video');
                let hoverTimeout;
                
                if (video) {
                    projectImg.addEventListener('mouseenter', function() {
                        // Limpiar cualquier timeout anterior
                        clearTimeout(hoverTimeout);
                        
                        // Esperar 500ms antes de empezar el fade y reproducir
                        hoverTimeout = setTimeout(() => {
                            video.currentTime = 0; // Reinicia el video desde el inicio
                            video.play(); // Reproduce el video
                            
                            // Hacer fade del video (de 0 a 1) y de la imagen (de 1 a 0)
                            video.style.opacity = '1';
                            projectImg.querySelector('img').style.opacity = '0';
                        }, 500); // 500ms de retraso
                    });
                    
                    projectImg.addEventListener('mouseleave', function() {
                        // Limpiar el timeout si el usuario quita el cursor antes de que termine
                        clearTimeout(hoverTimeout);
                        
                        // Inmediatamente hacer fade out del video y fade in de la imagen
                        video.style.opacity = '0';
                        projectImg.querySelector('img').style.opacity = '1';
                        
                        // Pausa el video después de que termine el fade
                        setTimeout(() => {
                            video.pause();
                            video.currentTime = 0;
                        }, 300); // Esperar a que termine la transición CSS (0.3s)
                    });
                }
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            const animationVideo = document.querySelector('.animation-projects video');
            
            if (animationVideo) {
                // Asegurar que el video se reproduzca automáticamente cuando esté visible
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Video visible en pantalla - asegurar reproducción
                            animationVideo.play().catch(e => {
                                console.log('Autoplay bloqueado por el navegador:', e);
                            });
                        } else {
                            // Video fuera de pantalla - pausar para ahorrar recursos
                            animationVideo.pause();
                        }
                    });
                }, {
                    threshold: 0.5 // Se activa cuando el 50% del video es visible
                });
                
                observer.observe(animationVideo);
            }
        });

        // Smooth scroll para navegación interna
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    createModalContainer() {
        if (!document.getElementById('modal-overlay')) {
            const modalHTML = `
                <div id="modal-overlay" class="modal-overlay">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3 class="modal-title"></h3>
                            <button class="modal-close" onclick="modalManager.closeModal()">&times;</button>
                        </div>
                        <div class="modal-content">
                            <div class="modal-fecha"></div>
                            <div class="modal-text"></div>
                        </div>
                        <div class="modal-footer">
                            <button class="modal-btn modal-btn-secondary" onclick="modalManager.closeModal()">
                                <span data-translate="modal.close">Cerrar</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.currentModal = document.getElementById('modal-overlay');
        }
    }

    createGameModalContainer() {
        if (!document.getElementById('game-modal-overlay')) {
            const gameModalHTML = `
                <div id="game-modal-overlay" class="game-modal-overlay">
                    <div class="game-modal-container">
                        <div class="game-modal-header">
                            <p class="game-modal-genre">All games > Adventure Games > Game Title</p>
                            <h3 class="game-modal-title">"Game Title"</h3>
                        </div>
                        <div class="game-modal-content">
                            <div class="game-modal-gallery"></div>
                            <div class="game-modal-empty">
                                <div class="date-container">
                                    <p data-translate="game_projects.date"></p>
                                    <p class="game-modal-date"></p>
                                </div>
                                <div class="game-modal-description"></div>
                                <div class="game-modal-tags"></div>
                            </div>
                        </div>
                        <div class="game-modal-footer">
                            <button class="game-modal-btn game-modal-btn-secondary" onclick="modalManager.closeGameModal()">
                                <span data-translate="modal.close">Cerrar</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', gameModalHTML);
            this.currentGameModal = document.getElementById('game-modal-overlay');
        }
    }

    createImagePopup() {
        if (!document.getElementById('image-popup-overlay')) {
            const popupHTML = `
                <div id="image-popup-overlay" class="image-popup-overlay" style="display:none;">
                    <div class="image-popup-container">
                        <img class="image-popup-img" src="" alt="Imagen ampliada" />
                        <button class="image-popup-close" onclick="document.getElementById('image-popup-overlay').style.display='none'">&times;</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', popupHTML);
        }
    }

    openBlogModal(blogData) {
        if (!this.currentModal) return;

        const title = this.currentModal.querySelector('.modal-title');
        const fecha = this.currentModal.querySelector('.modal-fecha');
        const text = this.currentModal.querySelector('.modal-text');

        title.textContent = blogData.title;
        fecha.textContent = blogData.fecha;
        text.innerHTML = blogData.content;

        this.currentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (!this.currentModal) return;

        this.currentModal.classList.add('closing');
        
        setTimeout(() => {
            this.currentModal.classList.remove('active');
            this.currentModal.classList.remove('closing');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    openGameModal(gameData = null) {
        if (!this.currentGameModal) return;

        const title = this.currentGameModal.querySelector('.game-modal-title');
        const genre = this.currentGameModal.querySelector('.game-modal-genre');
        const date = this.currentGameModal.querySelector('.game-modal-date');
        const description = this.currentGameModal.querySelector('.game-modal-description');
        const tags = this.currentGameModal.querySelector('.game-modal-tags');
        const gallery = this.currentGameModal.querySelector('.game-modal-gallery');

        if (gameData && gameData.title) {
            title.textContent = gameData.title;
        }
        
        if (gameData && gameData.genre) {
            genre.textContent = gameData.genre;
        }

        if (gameData && gameData.date) {
            date.textContent = gameData.date;
        }

        if (gameData && gameData.description) {
            description.textContent = gameData.description;
        }

        if (gameData && gameData.tags) {
            tags.innerHTML = gameData.tags.map(tag => `<span class="game-modal-tags">#${tag}</span>`).join('');
        }

        if (gameData && gameData.images && gameData.images.length > 0) {
            gallery.innerHTML = `
                <div class="gallery-slider">
                    <img class="gallery-image" />
                </div>
                <div class="gallery-preview-row">
                    <button class="gallery-prev"></button>
                    <img class="gallery-preview gallery-preview-prev" />
                    <img class="gallery-preview gallery-preview-next" />
                    <button class="gallery-next"></button>
                </div>
            `;
            let current = 0;
            const img = gallery.querySelector('.gallery-image');
            gallery.querySelector('.gallery-prev').onclick = () => {
                current = (current - 1 + gameData.images.length) % gameData.images.length;
                updateGallery(current, gameData.images);
            };
            gallery.querySelector('.gallery-next').onclick = () => {
                current = (current + 1) % gameData.images.length;
                updateGallery(current, gameData.images);
            };
            gallery.style.display = 'block';

            // CARGA LA PRIMERA IMAGEN Y PREVIEW
            updateGallery(current, gameData.images);
        } else {
            gallery.innerHTML = '';
            gallery.style.display = 'none';
        }

        // Detecta si el juego tiene la tag "android"
        this.isAndroidGame = false;
        if (gameData && gameData.tags) {
            this.isAndroidGame = gameData.tags.some(tag => tag.toLowerCase() === 'android');
        }

        this.currentGameModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeGameModal() {
        if (!this.currentGameModal) return;

        this.currentGameModal.classList.add('closing');
        
        setTimeout(() => {
            this.currentGameModal.classList.remove('active');
            this.currentGameModal.classList.remove('closing');
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

const modalManager = new ModalManager();

// === SLIDER FUNCTIONALITY ===
function slideGameProjects(direction) {
    const slider = document.getElementById('gameProjectsSlider');
    const scrollAmount = 400;
    
    if (direction === 'prev') {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function slideAnimationProjects(direction) {
    const slider = document.getElementById('animationProjectsSlider');
    const scrollAmount = 200;
    
    if (direction === 'prev') {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function slideBlogPosts(direction) {
    const slider = document.getElementById('blogPostsSlider');
    const scrollAmount = 300;
    
    if (direction === 'prev') {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function openBlog(blogId) {
    const entryKey = blogId === 'blog1' ? 'entry1' : 'entry2';
    
    const blogData = {
        title: translator.getText(`blog.entries.${entryKey}.title`) || 'Blog Entry',
        fecha: translator.getText(`blog.entries.${entryKey}.fecha`) || 'Fecha no disponible',
        content: translator.getText(`blog.entries.${entryKey}.content`) || '<p>Contenido no disponible</p>',
    };
    
    if (blogData.title !== 'Blog Entry') {
        modalManager.openBlogModal(blogData);
    }
}

function openGameProject(gameId) {
    const folder = translator.getText(`game_projects.${gameId}.folder`) || gameId;

    const gameData = {
        title: translator.getText(`game_projects.${gameId}.title`) || 'Proyecto de Videojuego',
        genre: translator.getText(`game_projects.${gameId}.genre`) || '',
        date: translator.getText(`game_projects.${gameId}.date`) || '',
        description: translator.getText(`game_projects.${gameId}.description`) || '',
        tags: translator.getText(`game_projects.${gameId}.tags`) || [],
        images: [
            `vds/${folder}/video.mp4`,
            `imgs/${folder}/game1.png`,
            `imgs/${folder}/game2.png`,
            `imgs/${folder}/game3.png`,
            `imgs/${folder}/game4.png`,
            `imgs/${folder}/game5.png`
        ]
    };
    
    modalManager.openGameModal(gameData);
}

function updateGallery(mainIndex, images) {
    const mainImg = document.querySelector('.gallery-image');
    const prevImg = document.querySelector('.gallery-preview-prev');
    const nextImg = document.querySelector('.gallery-preview-next');

    // Limpia el contenedor principal
    const slider = mainImg.parentElement;
    slider.innerHTML = '';

    const currentSrc = images[mainIndex];
    let mainMedia;
    if (currentSrc.endsWith('.mp4')) {
        mainMedia = document.createElement('video');
        mainMedia.src = currentSrc;
        mainMedia.controls = true;
        mainMedia.className = 'gallery-image';
        mainMedia.style.width = '100%';
        mainMedia.style.height = '100%';
    } else {
        mainMedia = document.createElement('img');
        mainMedia.src = currentSrc;
        mainMedia.className = 'gallery-image';
        mainMedia.style.width = '100%';
        mainMedia.style.height = '100%';
        mainMedia.style.objectFit = 'contain';

        // Evento para ampliar solo imágenes
        mainMedia.onclick = function() {
            const popup = document.getElementById('image-popup-overlay');
            const popupImg = popup.querySelector('.image-popup-img');
            popupImg.src = mainMedia.src;
            popup.style.display = 'flex';

            if (modalManager.isAndroidGame) {
                popupImg.style.height = '75vh';
                popupImg.style.objectFit = 'contain';
            } else {
                popupImg.style.height = '';
                popupImg.style.objectFit = '';
            }
        };
    }
    slider.appendChild(mainMedia);

    // Índices circulares
    const prevIndex = (mainIndex - 1 + images.length) % images.length;
    const nextIndex = (mainIndex + 1) % images.length;

    // Previews
    if (prevImg) {
        if (images[prevIndex].endsWith('.mp4')) {
            prevImg.src = `imgs/videologo.png`;
            prevImg.style.objectFit = 'contain';
        } else {
            prevImg.src = images[prevIndex];
            prevImg.style.objectFit = 'cover';
        }
    }
    if (nextImg) {
        if (images[nextIndex].endsWith('.mp4')) {
            nextImg.src = 'imgs/videologo.png';
            nextImg.style.objectFit = 'contain';
        } else {
            nextImg.src = images[nextIndex];
            nextImg.style.objectFit = 'cover';
        }
    }
}

document.addEventListener('click', function(e) {
    const popup = document.getElementById('image-popup-overlay');
    if (popup && popup.style.display === 'flex' && e.target === popup) {
        popup.style.display = 'none';
    }
});