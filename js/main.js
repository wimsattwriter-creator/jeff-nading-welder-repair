/* ============================================
   Jeff Nading Miller Welder Repair — Main JavaScript
   Version: 1.0
   ============================================ */

// --- Mobile Navigation ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

// --- "Don't Panic" Panel ---
function togglePanicPanel() {
    const panel = document.getElementById('panicPanel');
    panel.classList.toggle('open');

    // Check if user has completed assessment
    const assessmentDone = localStorage.getItem('assessmentCompleted');
    const noteEl = document.getElementById('panicAssessmentNote');
    if (noteEl) {
        if (assessmentDone === 'true') {
            noteEl.innerHTML = '<strong>Assessment completed!</strong> Jeff has the context he needs. Reach out anytime.';
            noteEl.style.borderColor = '#28A745';
            noteEl.style.background = '#f0fff4';
        }
    }
}

// --- Active Navigation Highlighting ---
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__links a').forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNav);

// --- Smooth Scroll for Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// --- Lightbox for Gallery Images ---
function openLightbox(src, caption) {
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox__close" onclick="closeLightbox()">&times;</button>
            <img class="lightbox__img" src="" alt="">
            <div class="lightbox__caption"></div>
        `;
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
        document.body.appendChild(lightbox);
    }
    lightbox.querySelector('.lightbox__img').src = src;
    lightbox.querySelector('.lightbox__img').alt = caption || '';
    lightbox.querySelector('.lightbox__caption').textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Close lightbox on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
        const panel = document.getElementById('panicPanel');
        if (panel) panel.classList.remove('open');
        const cart = document.getElementById('cartSidebar');
        if (cart && cart.classList.contains('open')) toggleCart();
    }
});

// --- Gallery Filter ---
function filterGallery(category) {
    document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    document.querySelectorAll('.gallery-item').forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// --- Utility: Format currency ---
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}
