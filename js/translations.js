class Translator {
    constructor() {
        this.currentLanguage = 'es';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.updateHTML();
        this.setupLanguageSelector();
    }

    async loadTranslations() {
        try {
            const response = await fetch('./data/translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    changeLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            this.updateHTML();
            this.updateLanguageButtons();
            localStorage.setItem('preferredLanguage', lang);
        }
    }

    getText(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        return value || key;
    }

    updateHTML() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getText(key);
            
            if (Array.isArray(translation)) {
                // Para arrays como tags
                element.innerHTML = translation.map(tag => `<span class="tag">#${tag}</span>`).join('');
            } else if (typeof translation === 'string' && translation.includes('\n')) {
                // Para texto con saltos de línea - crear párrafos
                const paragraphs = translation.split('\n').filter(p => p.trim() !== '');
                element.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
            } else {
                element.textContent = translation;
            }
        });
    }

    updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="translator.changeLanguage('${this.currentLanguage}')"]`)?.classList.add('active');
    }

    setupLanguageSelector() {
        if (!document.querySelector('.language-selector')) {
            const nav = document.querySelector('.nav');
            const languageSelector = document.createElement('div');
            languageSelector.className = 'language-selector';
            languageSelector.innerHTML = `
                <button onclick="translator.changeLanguage('es')" class="lang-btn ${this.currentLanguage === 'es' ? 'active' : ''}">ES</button>
                <button onclick="translator.changeLanguage('en')" class="lang-btn ${this.currentLanguage === 'en' ? 'active' : ''}">EN</button>
            `;
            nav.appendChild(languageSelector);
        }

        // Cargar idioma preferido del localStorage
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && this.translations[savedLang]) {
            this.changeLanguage(savedLang);
        }
    }
}

// Instanciar el traductor cuando se carga la página
let translator;
document.addEventListener('DOMContentLoaded', () => {
    translator = new Translator();
});

// Funciones para el slider de proyectos
function slideProjects(direction, containerId) {
    const container = document.getElementById(containerId);
    const scrollAmount = 320; // Ancho de tarjeta + gap
    
    if (direction === 'prev') {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else if (direction === 'next') {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Función para deslizar proyectos de videojuegos
function slideGameProjects(direction) {
    slideProjects(direction, 'gameProjectsSlider');
}

// Función para deslizar proyectos de animación
function slideAnimationProjects(direction) {
    slideProjects(direction, 'animationProjectsSlider');
}
