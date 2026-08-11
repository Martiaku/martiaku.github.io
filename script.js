// Otevírání a zavírání mobilního menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Zavření menu po kliknutí na libovolný odkaz v něm
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Přepínání motivu
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");
  });
}

// Lightbox (zvětšení obrázků)
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.querySelector('.modal-close');
const clickableImages = document.querySelectorAll('.hero-image-box img, .project-image-box img');

if (clickableImages && modal && modalImg && modalClose) {
  clickableImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = img.src;
      modalImg.alt = img.alt;
    });
  });

  const closeModal = () => { modal.style.display = 'none'; };
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}
