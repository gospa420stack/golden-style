const filterChips = document.querySelectorAll('.filter-chip');
const galleryCards = document.querySelectorAll('.gallery-card');
const modal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalRequestButton = document.getElementById('modalRequestButton');
const faceTreatmentButton = document.querySelector('.face-treatment-button');
const faceTreatmentModal = document.getElementById('faceTreatmentModal');
const faceTreatmentModalClose = document.querySelector('.face-treatment-modal-close');
const serviceDetailModal = document.getElementById('serviceDetailModal');
const serviceDetailModalClose = document.querySelector('.service-detail-modal-close');
const serviceDetailImage = document.getElementById('serviceDetailImage');
const serviceDetailTitle = document.getElementById('serviceDetailTitle');
const serviceDetailDescription = document.getElementById('serviceDetailDescription');
const serviceDetailBooking = document.getElementById('serviceDetailBooking');
let faceTreatmentReturnFocus = null;
let galleryReturnFocus = null;
let serviceDetailReturnFocus = null;

function restoreModalFocus(modal, returnFocus) {
  if (returnFocus instanceof HTMLElement && returnFocus !== document.body && returnFocus.isConnected) {
    returnFocus.focus();
  }

  if (modal.contains(document.activeElement) && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

function closeFaceTreatmentModal() {
  if (!faceTreatmentModal) {
    return;
  }

  restoreModalFocus(faceTreatmentModal, faceTreatmentReturnFocus);
  faceTreatmentModal.classList.remove('open');
  faceTreatmentModal.setAttribute('aria-hidden', 'true');
  faceTreatmentReturnFocus = null;
}

if (faceTreatmentButton && faceTreatmentModal) {
  faceTreatmentButton.addEventListener('click', () => {
    faceTreatmentReturnFocus = document.activeElement;
    faceTreatmentModal.classList.add('open');
    faceTreatmentModal.setAttribute('aria-hidden', 'false');
  });
}

if (faceTreatmentModalClose) {
  faceTreatmentModalClose.addEventListener('click', closeFaceTreatmentModal);
}

if (faceTreatmentModal) {
  faceTreatmentModal.addEventListener('click', (event) => {
    if (event.target === faceTreatmentModal) {
      closeFaceTreatmentModal();
    }
  });
}

function closeServiceDetailModal() {
  if (!serviceDetailModal) {
    return;
  }

  restoreModalFocus(serviceDetailModal, serviceDetailReturnFocus);
  serviceDetailModal.classList.remove('open');
  serviceDetailModal.setAttribute('aria-hidden', 'true');
  serviceDetailReturnFocus = null;
}

function openServiceDetailModal(card) {
  const image = card.querySelector('img');
  const title = card.querySelector('h3');
  const description = card.querySelector('p');
  const bookingLink = card.querySelector('a.btn');

  if (!serviceDetailModal || !image || !title || !description) {
    return;
  }

  serviceDetailImage.src = image.src;
  serviceDetailImage.alt = image.alt || title.textContent.trim();
  serviceDetailTitle.textContent = title.textContent.trim();
  serviceDetailDescription.textContent = description.textContent.trim();
  serviceDetailBooking.href = bookingLink?.href || `contact.html?service=${encodeURIComponent(title.textContent.trim())}`;
  serviceDetailBooking.hidden = !bookingLink;
  serviceDetailReturnFocus = document.activeElement;
  serviceDetailModal.classList.add('open');
  serviceDetailModal.setAttribute('aria-hidden', 'false');
}

document.querySelectorAll('.service-card').forEach((card) => {
  if (card.querySelector('.face-treatment-button')) {
    return;
  }

  card.classList.add('service-card--details');
  card.tabIndex = 0;
  card.setAttribute('aria-haspopup', 'dialog');

  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) {
      return;
    }
    openServiceDetailModal(card);
  });

  card.addEventListener('keydown', (event) => {
    if (event.target === card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openServiceDetailModal(card);
    }
  });
});

if (serviceDetailModalClose) {
  serviceDetailModalClose.addEventListener('click', closeServiceDetailModal);
}

if (serviceDetailModal) {
  serviceDetailModal.addEventListener('click', (event) => {
    if (event.target === serviceDetailModal) {
      closeServiceDetailModal();
    }
  });
}

filterChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    filterChips.forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.dataset.filter;
    galleryCards.forEach((card) => {
      const categories = card.dataset.category || '';
      card.style.display = filter === 'all' || categories.includes(filter) ? 'block' : 'none';
    });
  });
});

document.querySelectorAll('.gallery-image-button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.gallery-card');
    const modelNumber = card?.dataset.modelNumber;
    const image = button.querySelector('img');

    if (!image || !modelNumber) {
      return;
    }

    modalImage.src = image.src;
    if (modalRequestButton) {
      const bookingParams = new URLSearchParams({ service: `Model ${modelNumber}`, model: modelNumber });
      modalRequestButton.href = `contact.html?${bookingParams.toString()}`;
      modalRequestButton.textContent = 'Zatraži ovaj dizajn';
    }
    galleryReturnFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

function closeGalleryModal() {
  if (!modal) {
    return;
  }

  restoreModalFocus(modal, galleryReturnFocus);
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  galleryReturnFocus = null;
}

modalClose.addEventListener('click', closeGalleryModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeGalleryModal();
});
