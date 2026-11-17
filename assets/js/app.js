/**
 * ARENA SPORT DZ - High Conversion E-Commerce COD Engine
 * Synchronisé en temps réel avec l'API officielle de NORD & OUEST EXPRESS (NOEST)
 */

(function () {
  'use strict';

  // --- Configuration Produits & Variantes ---
  const PRODUCT_CONFIG = {
    name: "نظارات رياضية واقية ARENA SPORT (نظام 2 في 1)",
    name_fr: "Lunettes de sport protectrices ARENA SPORT (Système 2 en 1)",
    unitPrice: 2900, // DA (Prix fixe de base)
    freeShippingThreshold: 6000, // DA (Livraison offerte dès 6000 DA)
    variants: {
      black_red: {
        id: "black_red",
        name_ar: "أسود / أحمر",
        name_fr: "Noir & Rouge",
        badge: "الأكثر طلباً 🔥",
        photos: [
          "assets/images/black-red-1.jpg",
          "assets/images/black-red-2.jpg"
        ]
      },
      transparent: {
        id: "transparent",
        name_ar: "شفاف رياضي",
        name_fr: "Transparent Cristal",
        badge: "أناقة رياضية ✨",
        photos: [
          "assets/images/transparent-1.jpg",
          "assets/images/transparent-2.jpg"
        ]
      }
    }
  };

  // --- État de l'application (Tarifs NOEST par défaut pour Alger 16) ---
  let state = {
    selectedVariant: "black_red",
    currentSlideIndex: 0,
    quantity: 1,
    selectedWilayaId: 16, // Alger par défaut
    deliveryType: "desk", // "desk" (NOEST Stop Desk) ou "home" (NOEST Domicile)
    deskFee: 450, // Officiel NOEST Alger Stopdesk
    homeFee: 700, // Officiel NOEST Alger Domicile
    subtotal: 2900,
    shippingFee: 450,
    total: 3350,
    isSubmitting: false
  };

  // --- Éléments DOM ---
  const DOM = {
    gallerySlideImg: document.getElementById('gallerySlideImg'),
    slideCounter: document.getElementById('slideCounter'),
    galleryDotsContainer: document.getElementById('galleryDotsContainer'),
    btnPrevSlide: document.getElementById('btnPrevSlide'),
    btnNextSlide: document.getElementById('btnNextSlide'),
    galleryStage: document.getElementById('galleryStage'),

    variantOptionBtns: document.querySelectorAll('.variant-option-btn'),
    selectedVariantInput: document.getElementById('selectedVariantInput'),

    orderForm: document.getElementById('orderForm'),
    clientNameInput: document.getElementById('clientNameInput'),
    clientPhoneInput: document.getElementById('clientPhoneInput'),
    wilayaSelect: document.getElementById('wilayaSelect'),
    communeSelect: document.getElementById('communeSelect'),
    communeContainer: document.getElementById('communeContainer'),
    stopdeskStationContainer: document.getElementById('stopdeskStationContainer'),
    stationSelect: document.getElementById('stationSelect'),
    stopdeskSelectedAddress: document.getElementById('stopdeskSelectedAddress'),
    stationError: document.getElementById('stationError'),
    addressContainer: document.getElementById('addressContainer'),
    clientAddressInput: document.getElementById('clientAddressInput'),
    deliveryDeskCard: document.getElementById('deliveryDeskCard'),
    deliveryHomeCard: document.getElementById('deliveryHomeCard'),
    deskPriceDisplay: document.getElementById('deskPriceDisplay'),
    homePriceDisplay: document.getElementById('homePriceDisplay'),
    stopdeskNotice: document.getElementById('stopdeskNotice'),

    recapProductPrice: document.getElementById('recapProductPrice'),
    recapShippingLabel: document.getElementById('recapShippingLabel'),
    recapShippingFee: document.getElementById('recapShippingFee'),
    recapTotalAmount: document.getElementById('recapTotalAmount'),
    recapVariantName: document.getElementById('recapVariantName'),

    stickyTotalAmount: document.getElementById('stickyTotalAmount'),
    stickyOrderBtn: document.getElementById('stickyOrderBtn'),
    orderSubmitBtn: document.getElementById('orderSubmitBtn'),

    faqItems: document.querySelectorAll('.faq-item')
  };

  // --- Initialisation ---
  function init() {
    setupWilayas();
    setupGallery();
    setupVariantSelector();
    setupDeliveryOptions();
    setupFormValidation();
    setupFaqAccordion();
    setupStickyButton();

    // Initialisation affichage stations NOEST
    populateStations();
    calculateTotals();

    // Trigger initial slide
    updateGallery(true);
  }

  // --- Gestion de la Galerie & Slides ---
  function setupGallery() {
    if (DOM.btnPrevSlide) {
      DOM.btnPrevSlide.addEventListener('click', prevSlide);
    }
    if (DOM.btnNextSlide) {
      DOM.btnNextSlide.addEventListener('click', nextSlide);
    }

    if (DOM.galleryStage) {
      let touchStartX = 0;
      let touchEndX = 0;

      DOM.galleryStage.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      DOM.galleryStage.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const threshold = 40;
        if (touchEndX < touchStartX - threshold) {
          nextSlide();
        }
        if (touchEndX > touchStartX + threshold) {
          prevSlide();
        }
      }
    }
  }

  function getActivePhotos() {
    const variant = PRODUCT_CONFIG.variants[state.selectedVariant];
    return variant ? variant.photos : [];
  }

  function updateGallery(immediate) {
    const photos = getActivePhotos();
    if (!photos || photos.length === 0) return;

    if (state.currentSlideIndex >= photos.length) {
      state.currentSlideIndex = 0;
    }

    const currentPhotoUrl = photos[state.currentSlideIndex];

    if (DOM.gallerySlideImg) {
      if (immediate) {
        DOM.gallerySlideImg.src = currentPhotoUrl;
      } else {
        DOM.gallerySlideImg.style.opacity = '0.3';
        DOM.gallerySlideImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          DOM.gallerySlideImg.src = currentPhotoUrl;
          DOM.gallerySlideImg.style.opacity = '1';
          DOM.gallerySlideImg.style.transform = 'scale(1)';
        }, 120);
      }
    }

    if (DOM.slideCounter) {
      const currentFormatted = String(state.currentSlideIndex + 1).padStart(2, '0');
      const totalFormatted = String(photos.length).padStart(2, '0');
      DOM.slideCounter.textContent = `${currentFormatted} / ${totalFormatted}`;
    }

    if (DOM.galleryDotsContainer) {
      DOM.galleryDotsContainer.innerHTML = '';
      photos.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `gallery-dot ${idx === state.currentSlideIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          state.currentSlideIndex = idx;
          updateGallery(false);
        });
        DOM.galleryDotsContainer.appendChild(dot);
      });
    }
  }

  function nextSlide() {
    const photos = getActivePhotos();
    state.currentSlideIndex = (state.currentSlideIndex + 1) % photos.length;
    updateGallery(false);
  }

  function prevSlide() {
    const photos = getActivePhotos();
    state.currentSlideIndex = (state.currentSlideIndex - 1 + photos.length) % photos.length;
    updateGallery(false);
  }

  // --- Gestion du Sélecteur de Variantes ---
  function setupVariantSelector() {
    DOM.variantOptionBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const variantId = this.getAttribute('data-variant');
        if (!variantId || variantId === state.selectedVariant) return;

        state.selectedVariant = variantId;
        state.currentSlideIndex = 0;

        DOM.variantOptionBtns.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');

        if (DOM.selectedVariantInput) {
          DOM.selectedVariantInput.value = variantId;
        }

        updateGallery(false);

        const variant = PRODUCT_CONFIG.variants[variantId];
        if (DOM.recapVariantName && variant) {
          DOM.recapVariantName.textContent = `الموديل المختار: ${variant.name_ar} (${variant.name_fr})`;
        }

        if (navigator.vibrate) {
          navigator.vibrate(20);
        }
      });
    });
  }

  // --- Gestion des Wilayas, Communes & Stations NOEST ---
  function setupWilayas() {
    if (!DOM.wilayaSelect || typeof WILAYAS_DATA === 'undefined') return;

    DOM.wilayaSelect.innerHTML = '';

    WILAYAS_DATA.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = `${w.code} - ${w.name_ar} (${w.name_fr})`;
      if (w.id === state.selectedWilayaId) {
        opt.selected = true;
      }
      DOM.wilayaSelect.appendChild(opt);
    });

    DOM.wilayaSelect.addEventListener('change', function () {
      state.selectedWilayaId = parseInt(this.value, 10);
      populateCommunes();
      populateStations();
      updateShippingFees();
      calculateTotals();
    });

    populateCommunes();
    populateStations();
    updateShippingFees();
  }

  function populateCommunes() {
    if (!DOM.communeSelect || typeof WILAYAS_DATA === 'undefined') return;

    const wilaya = WILAYAS_DATA.find(w => w.id === state.selectedWilayaId);
    DOM.communeSelect.innerHTML = '';

    if (wilaya && wilaya.communes) {
      wilaya.communes.forEach((commune, index) => {
        const opt = document.createElement('option');
        opt.value = commune;
        opt.textContent = commune;
        if (index === 0) opt.selected = true;
        DOM.communeSelect.appendChild(opt);
      });
    }
  }

  function populateStations() {
    if (!DOM.stationSelect || typeof WILAYAS_DATA === 'undefined') return;

    const wilaya = WILAYAS_DATA.find(w => w.id === state.selectedWilayaId);
    DOM.stationSelect.innerHTML = '';

    if (wilaya && wilaya.desks && wilaya.desks.length > 0) {
      if (DOM.deliveryDeskCard) {
        DOM.deliveryDeskCard.style.opacity = '1';
        DOM.deliveryDeskCard.style.pointerEvents = 'auto';
      }

      wilaya.desks.forEach((desk, idx) => {
        const opt = document.createElement('option');
        opt.value = desk.code;
        opt.textContent = `${desk.name} (${desk.code})`;
        opt.setAttribute('data-address', desk.address || '');
        if (idx === 0) opt.selected = true;
        DOM.stationSelect.appendChild(opt);
      });

      const firstDesk = wilaya.desks[0];
      if (DOM.stopdeskSelectedAddress && firstDesk) {
        DOM.stopdeskSelectedAddress.textContent = `${firstDesk.name} — ${firstDesk.address}`;
      }
    } else {
      if (DOM.deliveryDeskCard) {
        DOM.deliveryDeskCard.style.opacity = '0.5';
        DOM.deliveryDeskCard.style.pointerEvents = 'none';
      }
      if (state.deliveryType === 'desk') {
        selectDeliveryType('home');
      }
    }

    DOM.stationSelect.addEventListener('change', function () {
      const selectedOpt = this.options[this.selectedIndex];
      if (selectedOpt && DOM.stopdeskSelectedAddress) {
        const addr = selectedOpt.getAttribute('data-address') || '';
        DOM.stopdeskSelectedAddress.textContent = `${selectedOpt.textContent} — ${addr}`;
      }
    });
  }

  function updateShippingFees() {
    const wilaya = typeof WILAYAS_DATA !== 'undefined'
      ? WILAYAS_DATA.find(w => w.id === state.selectedWilayaId)
      : null;

    if (wilaya) {
      state.deskFee = wilaya.desk_fee || 500;
      state.homeFee = wilaya.home_fee || 800;
    } else {
      state.deskFee = 450;
      state.homeFee = 700;
    }

    if (DOM.deskPriceDisplay) {
      DOM.deskPriceDisplay.textContent = `DA ${state.deskFee}`;
    }
    if (DOM.homePriceDisplay) {
      DOM.homePriceDisplay.textContent = `DA ${state.homeFee}`;
    }
  }

  // --- Options de Livraison (NOEST Stop Desk vs Domicile) ---
  function setupDeliveryOptions() {
    if (DOM.deliveryDeskCard) {
      DOM.deliveryDeskCard.addEventListener('click', function () {
        selectDeliveryType('desk');
      });
    }

    if (DOM.deliveryHomeCard) {
      DOM.deliveryHomeCard.addEventListener('click', function () {
        selectDeliveryType('home');
      });
    }
  }

  function selectDeliveryType(type) {
    const wilaya = typeof WILAYAS_DATA !== 'undefined'
      ? WILAYAS_DATA.find(w => w.id === state.selectedWilayaId)
      : null;

    if (type === 'desk' && wilaya && (!wilaya.desks || wilaya.desks.length === 0)) {
      alert("خدمة الاستلام من المكتب غير متوفرة في هذه الولاية، تم تحويل التوصيل إلى المنزل.");
      type = 'home';
    }

    state.deliveryType = type;

    if (type === 'desk') {
      DOM.deliveryDeskCard.classList.add('active');
      DOM.deliveryHomeCard.classList.remove('active');

      if (DOM.stopdeskStationContainer) DOM.stopdeskStationContainer.style.display = 'block';
      if (DOM.stopdeskNotice) DOM.stopdeskNotice.classList.add('visible');
      if (DOM.communeContainer) DOM.communeContainer.style.display = 'none';
      if (DOM.addressContainer) DOM.addressContainer.style.display = 'none';

      if (DOM.recapShippingLabel) {
        DOM.recapShippingLabel.textContent = "تكلفة الشحن (توصيل للمكتب NOEST):";
      }
    } else {
      DOM.deliveryHomeCard.classList.add('active');
      DOM.deliveryDeskCard.classList.remove('active');

      if (DOM.stopdeskStationContainer) DOM.stopdeskStationContainer.style.display = 'none';
      if (DOM.stopdeskNotice) DOM.stopdeskNotice.classList.remove('visible');
      if (DOM.communeContainer) DOM.communeContainer.style.display = 'block';
      if (DOM.addressContainer) DOM.addressContainer.style.display = 'block';

      if (DOM.recapShippingLabel) {
        DOM.recapShippingLabel.textContent = "تكلفة الشحن (توصيل للمنزل):";
      }
    }

    calculateTotals();
  }

  // --- Calcul des Prix & Récapitulatif ---
  function calculateTotals() {
    state.subtotal = PRODUCT_CONFIG.unitPrice * state.quantity;

    let rawShipping = state.deliveryType === 'desk' ? state.deskFee : state.homeFee;

    // Offre livraison offerte si >= 6000 DA
    if (state.subtotal >= PRODUCT_CONFIG.freeShippingThreshold) {
      state.shippingFee = 0;
    } else {
      state.shippingFee = rawShipping;
    }

    state.total = state.subtotal + state.shippingFee;

    if (DOM.recapProductPrice) {
      DOM.recapProductPrice.textContent = `DA ${state.subtotal}`;
    }

    if (DOM.recapShippingFee) {
      if (state.shippingFee === 0) {
        DOM.recapShippingFee.textContent = "مجاني (Livraison Offerte)";
        DOM.recapShippingFee.style.color = "#059669";
      } else {
        DOM.recapShippingFee.textContent = `DA ${state.shippingFee}`;
        DOM.recapShippingFee.style.color = "#059669";
      }
    }

    if (DOM.recapTotalAmount) {
      DOM.recapTotalAmount.textContent = `DA ${state.total}`;
    }

    if (DOM.stickyTotalAmount) {
      DOM.stickyTotalAmount.textContent = `DA ${state.total}`;
    }
  }

  // --- Validation du Formulaire & Envoi NOEST ---
  function setupFormValidation() {
    if (!DOM.orderForm) return;

    let initiateCheckoutFired = false;
    DOM.orderForm.querySelectorAll('input, select').forEach(field => {
      field.addEventListener('focus', function () {
        if (!initiateCheckoutFired) {
          initiateCheckoutFired = true;
          if (typeof fbq === 'function') {
            fbq('track', 'InitiateCheckout', {
              content_name: PRODUCT_CONFIG.name,
              value: state.total,
              currency: 'DZD'
            });
          }
        }
      });
    });

    DOM.orderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleOrderSubmit();
    });
  }

  function validateInput(input, errorId, condition) {
    const parent = input.closest('.form-group');
    const errorEl = document.getElementById(errorId);

    if (!condition) {
      if (parent) parent.classList.add('has-error');
      if (errorEl) errorEl.style.display = 'block';
      return false;
    } else {
      if (parent) parent.classList.remove('has-error');
      if (errorEl) errorEl.style.display = 'none';
      return true;
    }
  }

  function handleOrderSubmit() {
    if (state.isSubmitting) return;

    let isValid = true;

    // 1. Nom & Prénom
    const nameVal = DOM.clientNameInput ? DOM.clientNameInput.value.trim() : "";
    if (!validateInput(DOM.clientNameInput, 'nameError', nameVal.length >= 3)) {
      isValid = false;
    }

    // 2. Téléphone algérien
    const phoneVal = DOM.clientPhoneInput ? DOM.clientPhoneInput.value.trim().replace(/\s+/g, '') : "";
    const phoneRegex = /^(05|06|07)[0-9]{8}$/;
    if (!validateInput(DOM.clientPhoneInput, 'phoneError', phoneRegex.test(phoneVal))) {
      isValid = false;
    }

    // 3. Wilaya
    const wilayaVal = DOM.wilayaSelect ? DOM.wilayaSelect.value : "";
    if (!validateInput(DOM.wilayaSelect, 'wilayaError', wilayaVal !== "")) {
      isValid = false;
    }

    // 4. Validation selon mode de livraison
    let selectedStationCode = null;
    let finalDeliveryAddress = "";
    let finalCommuneName = "";

    if (state.deliveryType === 'desk') {
      const stationVal = DOM.stationSelect ? DOM.stationSelect.value : "";
      if (!validateInput(DOM.stationSelect, 'stationError', stationVal !== "")) {
        isValid = false;
      }
      selectedStationCode = stationVal;
      const selectedStationText = DOM.stationSelect ? DOM.stationSelect.options[DOM.stationSelect.selectedIndex].textContent : "";
      finalDeliveryAddress = `مكتب NOEST [${selectedStationCode}] - ${selectedStationText}`;
      finalCommuneName = ""; // Requis vide par NOEST en mode Stop Desk
    } else {
      // Domicile
      const communeVal = DOM.communeSelect ? DOM.communeSelect.value : "";
      if (!validateInput(DOM.communeSelect, 'communeError', communeVal !== "")) {
        isValid = false;
      }
      finalCommuneName = communeVal;

      const addressVal = DOM.clientAddressInput ? DOM.clientAddressInput.value.trim() : "";
      if (!validateInput(DOM.clientAddressInput, 'addressError', addressVal.length >= 4)) {
        isValid = false;
      }
      finalDeliveryAddress = addressVal;
    }

    if (!isValid) {
      const firstError = document.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const inputToFocus = firstError.querySelector('input, select');
        if (inputToFocus) {
          setTimeout(() => inputToFocus.focus(), 300);
        }
      }
      return;
    }

    // Préparation de la commande
    state.isSubmitting = true;
    if (DOM.orderSubmitBtn) {
      DOM.orderSubmitBtn.classList.add('loading');
      DOM.orderSubmitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2">⏳</span>
        <span>جاري تأكيد وتسجيل شحنتك مع NOEST...</span>
      `;
    }

    const wilayaObj = typeof WILAYAS_DATA !== 'undefined'
      ? WILAYAS_DATA.find(w => w.id === state.selectedWilayaId)
      : null;

    const variantObj = PRODUCT_CONFIG.variants[state.selectedVariant];
    const orderNumber = "ARENA-" + Math.floor(10000 + Math.random() * 90000);
    const token = "tok_" + Math.random().toString(36).substring(2) + Date.now().toString(36);

    const orderPayload = {
      orderId: orderNumber,
      token: token,
      timestamp: new Date().toISOString(),
      clientName: nameVal,
      phone: phoneVal,
      wilayaId: state.selectedWilayaId,
      wilayaName: wilayaObj ? `${wilayaObj.code} - ${wilayaObj.name_ar} (${wilayaObj.name_fr})` : "",
      commune: finalCommuneName,
      address: finalDeliveryAddress,
      stationCode: selectedStationCode,
      deliveryType: state.deliveryType,
      variantId: state.selectedVariant,
      variantName: variantObj ? `${variantObj.name_ar} - ${variantObj.name_fr}` : state.selectedVariant,
      quantity: state.quantity,
      unitPrice: PRODUCT_CONFIG.unitPrice,
      subtotal: state.subtotal,
      shippingFee: state.shippingFee,
      totalAmount: state.total
    };

    // Envoi de la commande vers l'API backend NOEST + Meta CAPI
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.success) {
        if (data.orderId) orderPayload.orderId = data.orderId;
        if (data.tracking) orderPayload.tracking = data.tracking;
      }
    })
    .catch(err => {
      console.log("[Info] Mode statique ou serveur offline, utilisation du stockage local");
    })
    .finally(() => {
      try {
        localStorage.setItem('arena_sport_last_order', JSON.stringify(orderPayload));
      } catch (err) {
        console.warn("Storage error", err);
      }

      setTimeout(() => {
        const finalId = orderPayload.tracking || orderPayload.orderId;
        window.location.href = `merci.html?order_id=${encodeURIComponent(finalId)}&token=${encodeURIComponent(token)}`;
      }, 400);
    });
  }

  // --- Sticky Button Behavior ---
  function setupStickyButton() {
    if (!DOM.stickyOrderBtn) return;

    DOM.stickyOrderBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (DOM.orderForm) {
        DOM.orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (DOM.clientNameInput && !DOM.clientNameInput.value) {
          setTimeout(() => DOM.clientNameInput.focus(), 400);
        }
      }
    });
  }

  // --- FAQ Accordion ---
  function setupFaqAccordion() {
    DOM.faqItems.forEach(item => {
      const header = item.querySelector('.faq-header');
      if (header) {
        header.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          DOM.faqItems.forEach(i => i.classList.remove('open'));
          if (!isOpen) {
            item.classList.add('open');
          }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);

})();
