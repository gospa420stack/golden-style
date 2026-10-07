const signatureCards = document.querySelectorAll('.signature-card');
const previewImage = document.getElementById('previewImage');
const previewTitle = document.getElementById('previewTitle');
const previewText = document.getElementById('previewText');
const previewPrice = document.getElementById('previewPrice');
const comparisonSlider = document.querySelector('.comparison-slider');
const comparisonImage = document.querySelector('.comparison-image');
const divider = document.querySelector('.comparison-divider');
const stepPanels = Array.from(document.querySelectorAll('.step-panel'));
const stepIndicator = document.querySelector('#stepIndicator');
const progressFill = document.querySelector('#progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const designPreviewModal = document.getElementById('designPreviewModal');
const designPreviewModalImage = document.getElementById('designPreviewModalImage');
const designPreviewModalTitle = document.getElementById('designPreviewModalTitle');
const designPreviewModalText = document.getElementById('designPreviewModalText');
const closeDesignPreviewButton = document.getElementById('closeDesignPreview');

const servicePreviewModal = document.getElementById('servicePreviewModal');
const servicePreviewModalImage = document.getElementById('servicePreviewModalImage');
const servicePreviewModalTitle = document.getElementById('servicePreviewModalTitle');
const servicePreviewModalText = document.getElementById('servicePreviewModalText');
const closeServicePreviewButton = document.getElementById('closeServicePreview');
const serviceTreatmentList = document.getElementById('serviceTreatmentList');
const serviceBookButton = document.getElementById('serviceBookButton');
const designBookButton = document.getElementById('designBookButton');
const designSlideshow = document.querySelector('.design-slideshow');

if (designSlideshow) {
  const slides = Array.from(designSlideshow.querySelectorAll('.design-slideshow__image'));
  const track = designSlideshow.querySelector('.design-slideshow__track');
  const indicatorContainer = designSlideshow.querySelector('.design-slideshow__indicators');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visibleSlides = 3;
  let activePage = 0;
  let indicators = [];
  let slideshowTimer = null;

  const getVisibleSlideCount = () => Number.parseInt(getComputedStyle(designSlideshow).getPropertyValue('--visible-slides'), 10) || 1;

  const renderIndicators = () => {
    const pageCount = Math.ceil(slides.length / visibleSlides);
    indicatorContainer.replaceChildren();
    indicators = Array.from({ length: pageCount }, (_, pageIndex) => {
      const firstSlide = pageIndex * visibleSlides + 1;
      const lastSlide = Math.min(firstSlide + visibleSlides - 1, slides.length);
      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.className = 'design-slideshow__indicator';
      indicator.setAttribute('aria-label', `Prikaži slike ${firstSlide}–${lastSlide}`);
      indicator.addEventListener('click', () => {
        showPage(pageIndex);
        startSlideshow();
      });
      indicatorContainer.appendChild(indicator);
      return indicator;
    });
  };

  const showPage = (page) => {
    const pageCount = Math.ceil(slides.length / visibleSlides);
    activePage = (page + pageCount) % pageCount;
    const firstSlide = activePage * visibleSlides;
    const lastSlide = Math.min(firstSlide + visibleSlides, slides.length);
    const firstVisibleRatio = firstSlide / slides.length;
    track.style.transform = `translateX(-${firstVisibleRatio * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      const isVisible = slideIndex >= firstSlide && slideIndex < lastSlide;
      slide.setAttribute('aria-hidden', String(!isVisible));
    });

    indicators.forEach((indicator, indicatorIndex) => {
      const isActive = indicatorIndex === activePage;
      indicator.classList.toggle('is-active', isActive);
      indicator.setAttribute('aria-current', String(isActive));
    });

  };

  const stopSlideshow = () => {
    window.clearInterval(slideshowTimer);
    slideshowTimer = null;
  };

  const startSlideshow = () => {
    stopSlideshow();
    if (reducedMotion.matches || document.hidden || Math.ceil(slides.length / visibleSlides) < 2) {
      return;
    }
    slideshowTimer = window.setInterval(() => showPage(activePage + 1), 5000);
  };

  designSlideshow.querySelectorAll('[data-slide-direction]').forEach((button) => {
    button.addEventListener('click', () => {
      showPage(activePage + (button.dataset.slideDirection === 'next' ? 1 : -1));
      startSlideshow();
    });
  });

  const updateSlideLayout = () => {
    const previousVisibleSlides = visibleSlides;
    visibleSlides = getVisibleSlideCount();
    track.style.width = `calc(100% * ${slides.length} / ${visibleSlides})`;
    slides.forEach((slide) => {
      slide.style.flexBasis = `calc(100% / ${slides.length})`;
    });
    if (previousVisibleSlides !== visibleSlides) {
      activePage = Math.min(activePage, Math.ceil(slides.length / visibleSlides) - 1);
      renderIndicators();
      showPage(activePage);
      startSlideshow();
    }
  };

  visibleSlides = getVisibleSlideCount();
  track.style.width = `calc(100% * ${slides.length} / ${visibleSlides})`;
  slides.forEach((slide) => {
    slide.style.flexBasis = `calc(100% / ${slides.length})`;
  });
  renderIndicators();

  designSlideshow.addEventListener('pointerenter', stopSlideshow);
  designSlideshow.addEventListener('pointerleave', startSlideshow);
  designSlideshow.addEventListener('focusin', stopSlideshow);
  designSlideshow.addEventListener('focusout', (event) => {
    if (!designSlideshow.contains(event.relatedTarget)) {
      startSlideshow();
    }
  });
  document.addEventListener('visibilitychange', startSlideshow);
  reducedMotion.addEventListener('change', startSlideshow);
  window.addEventListener('resize', updateSlideLayout);

  showPage(0);
  startSlideshow();
}

let designPreviewReturnFocus = null;
let servicePreviewReturnFocus = null;

function restoreModalFocus(modal, returnFocus) {
  if (returnFocus instanceof HTMLElement && returnFocus !== document.body && returnFocus.isConnected) {
    returnFocus.focus();
  }

  if (modal.contains(document.activeElement) && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

const faceTreatmentOptions = [
  'Higijenski tretman',
  'Hijaluronski tretman',
  'Collagen tretman',
  'Oxy tretman lica sa kiseonikom',
  'Corrective tretman by Skeyndor',
  'Njega suve kože (Aquatherm by Skeyndor)'
];

let activeStep = 0;

function syncSignaturePreview(card) {
  if (!card || signatureCards.length === 0) {
    return;
  }

  signatureCards.forEach((item) => item.classList.toggle('active', item === card));

  if (previewImage && card.dataset.image) {
    previewImage.src = card.dataset.image;
  }

  if (previewTitle && card.dataset.title) {
    previewTitle.textContent = card.dataset.title;
  }

  if (previewText && card.dataset.text) {
    previewText.textContent = card.dataset.text;
  }

  if (previewPrice && card.dataset.price) {
    previewPrice.textContent = card.dataset.price;
  }
}

function openDesignPreviewDialog(imageSource, imageAlt, title, text) {
  if (!designPreviewModal || !designPreviewModalImage || !designPreviewModalTitle || !designPreviewModalText) {
    return;
  }

  designPreviewModalImage.src = imageSource;
  designPreviewModalImage.alt = imageAlt || title;
  designPreviewModalTitle.textContent = title;
  designPreviewModalText.textContent = text;

  if (designBookButton) {
    designBookButton.href = `contact.html?service=${encodeURIComponent(title)}`;
    designBookButton.textContent = `Zatraži ovaj dizajn`;
  }

  designPreviewModal.classList.add('open');
  designPreviewModal.setAttribute('aria-hidden', 'false');
  designPreviewReturnFocus = document.activeElement;
}

function openSignaturePreview(card) {
  const image = card.querySelector('img');

  if (!image) {
    return;
  }

  openDesignPreviewDialog(image.src, image.alt || card.dataset.title, card.dataset.title, card.dataset.text);
}

function closeDesignPreviewModal() {
  if (!designPreviewModal) {
    return;
  }

  restoreModalFocus(designPreviewModal, designPreviewReturnFocus);
  designPreviewModal.classList.remove('open');
  designPreviewModal.setAttribute('aria-hidden', 'true');
  designPreviewReturnFocus = null;
}

function closeServicePreviewModal() {
  if (!servicePreviewModal) {
    return;
  }

  restoreModalFocus(servicePreviewModal, servicePreviewReturnFocus);
  servicePreviewModal.classList.remove('open');
  servicePreviewModal.setAttribute('aria-hidden', 'true');
  servicePreviewReturnFocus = null;
}

signatureCards.forEach((card) => {
  card.addEventListener('touchstart', () => {
    card.classList.add('is-touched');
  }, { passive: true });

  const bookingLink = card.querySelector('.signature-book-button');
  if (bookingLink) {
    bookingLink.addEventListener('click', (event) => event.stopPropagation());
  }
});

if (previewImage) {
  previewImage.setAttribute('tabindex', '0');
  previewImage.setAttribute('role', 'button');
  previewImage.setAttribute('aria-label', 'Open main preview');

  previewImage.addEventListener('click', () => {
    openDesignPreviewDialog(previewImage.src, previewImage.alt, previewTitle.textContent, previewText.textContent);
  });

  previewImage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDesignPreviewDialog(previewImage.src, previewImage.alt, previewTitle.textContent, previewText.textContent);
    }
  });
}

const faceServiceCard = document.querySelector('.face-service-card');
const serviceCards = Array.from(document.querySelectorAll('.service-card'));

function openServiceModal(card) {
  if (!servicePreviewModal || !servicePreviewModalImage || !servicePreviewModalTitle || !servicePreviewModalText || !serviceTreatmentList || !serviceBookButton) {
    return;
  }

  const image = card.querySelector('img');
  const title = card.querySelector('h3');
  const copy = card.querySelector('p');
  const price = card.querySelector('span');

  if (!image || !title || !copy) {
    return;
  }

  const bookingLink = card.querySelector('.signature-book-button');

  if (bookingLink) {
    bookingLink.addEventListener('click', (event) => event.stopPropagation());
  }

  card.addEventListener('touchstart', () => {
    card.classList.add('is-touched');
  }, { passive: true });

  const titleText = title.textContent.trim();
    if (card.classList.contains('is-touched')) {
      return;
    }
  const descriptionText = copy.textContent.trim();

  servicePreviewModalImage.src = image.src;
  servicePreviewModalImage.alt = image.alt || titleText;
  servicePreviewModalTitle.textContent = titleText;
  servicePreviewModalText.textContent = `${descriptionText}${price ? ` — ${price.textContent.trim()}` : ''}`;

  serviceTreatmentList.innerHTML = '';

  const serviceOption = document.createElement('button');
  serviceOption.type = 'button';
  serviceOption.className = 'service-treatment-option active';
  serviceOption.textContent = 'Konsultacija i rezervacija';

  serviceTreatmentList.appendChild(serviceOption);

  serviceBookButton.textContent = `Zakažite ${titleText}`;
  serviceBookButton.href = `contact.html?service=${encodeURIComponent(titleText)}`;

  servicePreviewModal.classList.add('open');
  servicePreviewModal.setAttribute('aria-hidden', 'false');
  servicePreviewReturnFocus = document.activeElement;
}

function openFaceServiceModal() {
  if (!faceServiceCard) {
    return;
  }

  if (!servicePreviewModal || !servicePreviewModalImage || !servicePreviewModalTitle || !servicePreviewModalText || !serviceTreatmentList || !serviceBookButton) {
    return;
  }

  servicePreviewModalImage.src = 'images/Screenshot 2026-08-10 152332.png';
  servicePreviewModalImage.alt = 'Luksuzni tretman lica';
  servicePreviewModalTitle.textContent = 'Luksuzna njega lica';
  servicePreviewModalText.textContent = 'Odaberite tretman lica koji odgovara vašim potrebama i zakažite termin.';

  serviceTreatmentList.innerHTML = '';

  faceTreatmentOptions.forEach((option, index) => {
    const treatmentButton = document.createElement('button');
    treatmentButton.type = 'button';
    treatmentButton.className = 'service-treatment-option';
    treatmentButton.textContent = option;

    if (index === 0) {
      treatmentButton.classList.add('active');
    }

    treatmentButton.addEventListener('click', () => {
      const buttons = serviceTreatmentList.querySelectorAll('button');
      buttons.forEach((btn) => btn.classList.toggle('active', btn === treatmentButton));
      serviceBookButton.textContent = `Zakažite ${option}`;
      serviceBookButton.href = `contact.html?service=${encodeURIComponent(option)}`;
    });

    serviceTreatmentList.appendChild(treatmentButton);
  });

  serviceBookButton.textContent = 'Zakažite Higijenski tretman';
  serviceBookButton.href = 'contact.html?service=' + encodeURIComponent('Higijenski');

  servicePreviewModal.classList.add('open');
  servicePreviewModal.setAttribute('aria-hidden', 'false');
  servicePreviewReturnFocus = document.activeElement;
}

if (serviceCards.length > 0) {
  serviceCards.forEach((card) => {
    const serviceTitle = card.querySelector('h3')?.textContent.trim();

    if (serviceTitle === 'Lipomodelovanje' || serviceTitle === 'Presoterapija') {
      card.classList.add('has-read-more');

      const readMoreButton = document.createElement('button');
      readMoreButton.type = 'button';
      readMoreButton.className = 'service-card__read-more';
      readMoreButton.textContent = 'Read more';
      readMoreButton.setAttribute('aria-label', `Read more about ${serviceTitle}`);
      readMoreButton.addEventListener('click', (event) => {
        event.stopPropagation();
        openServiceModal(card);
      });

      card.appendChild(readMoreButton);
    }

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open service details for ${serviceTitle || 'service'}`);

    card.addEventListener('click', () => {
      if (card.classList.contains('face-service-card')) {
        openFaceServiceModal();
      } else {
        openServiceModal(card);
      }
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (card.classList.contains('face-service-card')) {
          openFaceServiceModal();
        } else {
          openServiceModal(card);
        }
      }
    });
  });
}

if (faceServiceCard) {
  faceServiceCard.classList.add('clickable-service-card');
}

if (closeDesignPreviewButton) {
  closeDesignPreviewButton.addEventListener('click', closeDesignPreviewModal);
}

if (closeServicePreviewButton) {
  closeServicePreviewButton.addEventListener('click', closeServicePreviewModal);
}

if (designPreviewModal) {
  designPreviewModal.addEventListener('click', (event) => {
    if (event.target === designPreviewModal) {
      closeDesignPreviewModal();
    }
  });
}

if (servicePreviewModal) {
  servicePreviewModal.addEventListener('click', (event) => {
    if (event.target === servicePreviewModal) {
      closeServicePreviewModal();
    }
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (designPreviewModal && designPreviewModal.classList.contains('open')) {
      closeDesignPreviewModal();
    }

    if (servicePreviewModal && servicePreviewModal.classList.contains('open')) {
      closeServicePreviewModal();
    }
  }
});

if (comparisonSlider && divider) {
  comparisonSlider.addEventListener('input', (event) => {
    const value = event.target.value;
    divider.style.left = `${value}%`;
    comparisonImage.style.setProperty('--clip', `${value}%`);
    document.querySelector('.after-image').style.clipPath = `inset(0 0 0 ${value}%)`;
  });
}

if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => {
    if (activeStep < stepPanels.length - 1) {
      stepPanels[activeStep].classList.remove('active');
      activeStep += 1;
      stepPanels[activeStep].classList.add('active');
      stepIndicator.textContent = activeStep + 1;
      progressFill.style.width = `${((activeStep + 1) / stepPanels.length) * 100}%`;
    }
  });

  prevBtn.addEventListener('click', () => {
    if (activeStep > 0) {
      stepPanels[activeStep].classList.remove('active');
      activeStep -= 1;
      stepPanels[activeStep].classList.add('active');
      stepIndicator.textContent = activeStep + 1;
      progressFill.style.width = `${((activeStep + 1) / stepPanels.length) * 100}%`;
    }
  });
}