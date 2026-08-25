/**
 * Magazine Marolar - Scripts Interativos e Design System
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initHeaderScroll();
  initDynamicYear();
  initTestimonialsCarousel();
  initContactWhatsAppForm();
  initScrollSpy();
  initCategoryFilter();
});

/**
 * Filtro interativo das categorias de móveis no showroom (Sofás, Camas, Armários, Colchões, Guarda-roupas)
 */
function initCategoryFilter() {
  const filterBtns = document.querySelectorAll('.showroom-filter-btn');
  const productCards = document.querySelectorAll('.product-card-furniro[data-category]');

  if (filterBtns.length === 0 || productCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 300ms ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Controle de Abertura e Fechamento do Drawer de Navegação Mobile
 */
function initMobileDrawer() {
  const menuToggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const drawerClose = document.querySelector('.mobile-drawer-close');

  if (!menuToggle || !drawer || !overlay) return;

  function openMenu() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMenu);
  if (drawerClose) drawerClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeMenu();
    }
  });

  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/**
 * Adiciona classe de sombra ao cabeçalho quando a página for rolada
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function checkScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

/**
 * ScrollSpy: Atualiza o link ativo da barra de navegação de acordo com a seção visível
 */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  if (navLinks.length === 0 || sections.length === 0) return;

  function onScroll() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Atualiza o ano de copyright no rodapé automaticamente
 */
function initDynamicYear() {
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
}

/**
 * Carrossel de Depoimentos: Alterna de 2 em 2 com setas no topo da seção
 */
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonials-dots');

  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.testimonials-slide');
  const totalSlides = slides.length;
  if (totalSlides <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    return;
  }

  let currentIndex = 0;

  // Cria dots indicadores
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `testimonials-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir para página ${i + 1} de depoimentos`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Atualiza estado dos botões
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;

    // Atualiza dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.testimonials-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    updateCarousel();
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    }
  });

  // Touch Swipe para dispositivos móveis
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold && currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  updateCarousel();
}

/**
 * Formulário de contato rápido que redireciona diretamente para o WhatsApp
 */
function initContactWhatsAppForm() {
  const quoteForm = document.getElementById('whatsapp-quote-form');
  if (!quoteForm) return;

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const categoryInput = document.getElementById('form-category');
    const messageInput = document.getElementById('form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const category = categoryInput ? categoryInput.value : 'Geral';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name) {
      alert('Por favor, informe seu nome.');
      return;
    }

    let text = `Olá! Meu nome é *${name}*.\n`;
    text += `Estou no site da Magazine Marolar e tenho interesse em: *${category}*.\n`;
    if (message) {
      text += `\n*Detalhes da dúvida/pedido:*\n${message}\n`;
    }
    text += `\nPoderiam me passar mais informações e valores?`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/5514996736648?text=${encodedText}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}
