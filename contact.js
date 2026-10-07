const params = new URLSearchParams(window.location.search);
const serviceParam = params.get('service');
const modelParam = params.get('model');

const serviceText = document.getElementById('selectedService');
const hiddenInput = document.getElementById('serviceHiddenInput');
const modelNumberInput = document.getElementById('modelNumberHiddenInput');
const serviceSelect = document.getElementById('serviceInput');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (serviceParam) {
  const serviceValue = decodeURIComponent(serviceParam.trim());

  if (serviceText) {
    serviceText.innerHTML = `Odabrana usluga: <strong>${serviceValue}</strong>`;
  }

  if (hiddenInput) {
    hiddenInput.value = serviceValue;
  }

  if (serviceSelect) {
    const matchingOption = Array.from(serviceSelect.options).find((option) => option.value === serviceValue);
    if (matchingOption) {
      serviceSelect.value = serviceValue;
    } else {
      const customOption = new Option(serviceValue, serviceValue);
      serviceSelect.add(customOption);
      serviceSelect.value = serviceValue;
    }
  }
}

if (modelNumberInput && modelParam && /^\d{2}$/.test(modelParam)) {
  modelNumberInput.value = modelParam;
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const service = String(formData.get('service') || formData.get('serviceSelect') || '').trim();
    const modelNumber = String(formData.get('model_number') || '').trim();
    const notes = String(formData.get('notes') || '').trim();

    if (!name || !phone || !service) {
      if (formMessage) {
        formMessage.textContent = 'Molimo popunite ime, telefon i uslugu prije slanja rezervacije.';
        formMessage.dataset.status = 'error';
      }
      return;
    }

    formData.set('service', service);
    formData.set('subject', `Nova rezervacija - ${service}`);
    formData.set('message',
      `Ime i prezime: ${name}\n` +
      `Telefon: ${phone}\n` +
      `Usluga: ${service}\n` +
      `Izabrani model: ${modelNumber || 'Nije odabran'}\n` +
      `Napomena: ${notes || 'Nema dodatne napomene.'}`
    );

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    if (formMessage) {
      formMessage.textContent = 'Slanje rezervacije je u toku...';
      formMessage.dataset.status = 'pending';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Slanje rezervacije nije uspjelo.');
      }

      contactForm.reset();
      if (formMessage) {
        formMessage.textContent = 'Hvala! Vaša rezervacija je uspješno poslana.';
        formMessage.dataset.status = 'success';
      }
    } catch (error) {
      if (formMessage) {
        formMessage.textContent = error.message || 'Došlo je do greške. Pokušajte ponovo.';
        formMessage.dataset.status = 'error';
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}