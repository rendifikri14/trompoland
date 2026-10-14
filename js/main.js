/* ==========================================================================
   TROMPOLAND - Modern Eco Adventure & Leisure Park
   Main Interactive JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAttractionsFilter();
  initTicketCalculator();
  initMapPins();
  initFAQ();
  initModal();
  initGalleryLightbox();
  initBackToTop();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Navbar & Mobile Menu Handling
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close on click link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. Attractions Filtering
   -------------------------------------------------------------------------- */
function initAttractionsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.attraction-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   3. Interactive Ticket Estimator & Booking Calculator
   -------------------------------------------------------------------------- */
const TICKET_PRICES = {
  adultTicket: 25000,
  childTicket: 15000,
  rainbowSlide: 20000,
  lakeBoat: 30000,
  playground: 20000,
  fishing: 35000,
  outbound: 65000
};

function initTicketCalculator() {
  const adultMinus = document.getElementById('adult-minus');
  const adultPlus = document.getElementById('adult-plus');
  const adultCount = document.getElementById('adult-count');

  const childMinus = document.getElementById('child-minus');
  const childPlus = document.getElementById('child-plus');
  const childCount = document.getElementById('child-count');

  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
  const totalAmountEl = document.getElementById('total-calculated-price');
  const summaryListEl = document.getElementById('summary-items-list');
  const btnBookWa = document.getElementById('btn-book-wa');

  let state = {
    adults: 2,
    children: 1,
    addons: ['rainbowSlide', 'lakeBoat']
  };

  function updateCalculator() {
    let total = 0;
    let summaryHTML = '';

    // Adult Ticket
    const adultTotal = state.adults * TICKET_PRICES.adultTicket;
    if (state.adults > 0) {
      total += adultTotal;
      summaryHTML += `
        <li class="summary-item">
          <span>Tiket Dewasa (${state.adults}x)</span>
          <strong>Rp ${adultTotal.toLocaleString('id-ID')}</strong>
        </li>
      `;
    }

    // Child Ticket
    const childTotal = state.children * TICKET_PRICES.childTicket;
    if (state.children > 0) {
      total += childTotal;
      summaryHTML += `
        <li class="summary-item">
          <span>Tiket Anak (${state.children}x)</span>
          <strong>Rp ${childTotal.toLocaleString('id-ID')}</strong>
        </li>
      `;
    }

    // Selected Addons
    addonCheckboxes.forEach(cb => {
      const parentLabel = cb.closest('.addon-checkbox-label');
      const addonKey = cb.value;
      const price = TICKET_PRICES[addonKey] || 0;
      const title = cb.getAttribute('data-name');

      if (cb.checked) {
        if (parentLabel) parentLabel.classList.add('selected');
        total += price;
        summaryHTML += `
          <li class="summary-item">
            <span>${title}</span>
            <strong>Rp ${price.toLocaleString('id-ID')}</strong>
          </li>
        `;
      } else {
        if (parentLabel) parentLabel.classList.remove('selected');
      }
    });

    if (total === 0) {
      summaryHTML = `<li class="summary-item"><span>Belum ada tiket yang dipilih</span><strong>Rp 0</strong></li>`;
    }

    if (summaryListEl) summaryListEl.innerHTML = summaryHTML;
    if (totalAmountEl) totalAmountEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    // Prepare WhatsApp Message
    if (btnBookWa) {
      let waMessage = `Halo Admin TROMPOLAND,%0A%0ASaya ingin reservasi / membeli tiket wisata:%0A`;
      waMessage += `- Dewasa: ${state.adults} orang (Rp ${adultTotal.toLocaleString('id-ID')})%0A`;
      if (state.children > 0) {
        waMessage += `- Anak-anak: ${state.children} orang (Rp ${childTotal.toLocaleString('id-ID')})%0A`;
      }
      waMessage += `*Wahana Tambahan:*%0A`;
      addonCheckboxes.forEach(cb => {
        if (cb.checked) {
          waMessage += `• ${cb.getAttribute('data-name')} (Rp ${TICKET_PRICES[cb.value].toLocaleString('id-ID')})%0A`;
        }
      });
      waMessage += `%0A*Estimasi Total:* Rp ${total.toLocaleString('id-ID')}%0A%0AMohon info ketersediaan & petunjuk pembayaran. Terima kasih!`;

      btnBookWa.href = `https://wa.me/6281234567890?text=${waMessage}`;
    }
  }

  // Adult counter events
  if (adultMinus && adultPlus && adultCount) {
    adultMinus.addEventListener('click', () => {
      if (state.adults > 0) {
        state.adults--;
        adultCount.textContent = state.adults;
        updateCalculator();
      }
    });

    adultPlus.addEventListener('click', () => {
      state.adults++;
      adultCount.textContent = state.adults;
      updateCalculator();
    });
  }

  // Child counter events
  if (childMinus && childPlus && childCount) {
    childMinus.addEventListener('click', () => {
      if (state.children > 0) {
        state.children--;
        childCount.textContent = state.children;
        updateCalculator();
      }
    });

    childPlus.addEventListener('click', () => {
      state.children++;
      childCount.textContent = state.children;
      updateCalculator();
    });
  }

  // Checkboxes
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateCalculator);
  });

  // Initial Calculation
  updateCalculator();
}

/* --------------------------------------------------------------------------
   4. Interactive Map Pins
   -------------------------------------------------------------------------- */
const ATTRACTION_DATA = {
  rainbow: {
    title: 'Rainbow Slide Trompoland',
    badge: 'Wahana Unggulan',
    img: 'images/rainbow_slide.jpg',
    desc: 'Seluncuran warna-warni viral terpanjang dengan trek berbelok yang memacu adrenalin. Dilengkapi dengan ban donat berkualitas tinggi dan helm pengaman. Pengunjung dapat menikmati pemandangan alam perbukitan dan danau sambil meluncur cepat dengan aman.',
    price: 'Rp 20.000 / orang',
    hours: '08.30 - 17.00 WIB',
    specs: ['Panjang Lintasan 120 Meter', 'Standar Keselamatan Penuh', 'Spot Foto Viral']
  },
  boat: {
    title: 'Perahu Keliling Danau Asri',
    badge: 'Wisata Air & Danau',
    img: 'images/lake_boat.jpg',
    desc: 'Nikmati hembusan angin segar dan pemandangan danau alami Trompoland. Tersedia pilihan Perahu Angsa Kayuh (Paddle Boat) untuk 2-4 orang dan Perahu Kayu Safari Wisata berkeliling danau bersama kapten berpengalaman.',
    price: 'Rp 30.000 / perahu (20 menit)',
    hours: '08.00 - 17.30 WIB',
    specs: ['Pelampung / Life Jacket Disediakan', 'Kapasitas 2-6 Orang', 'Pemandangan 360 Danau']
  },
  cafe: {
    title: 'Danau Cafe & Resto Lakeside',
    badge: 'Kuliner & Minuman',
    img: 'images/cafe_umkm.jpg',
    desc: 'Cafe bernuansa kayu modern di tepi danau yang estetik. Menyajikan aneka racikan espresso, signature iced coffee, matcha latte, mocktail tropis segar, serta pastry lezat untuk menemani waktu santai Anda.',
    price: 'Mulai Rp 12.000 - Rp 35.000',
    hours: '08.00 - 20.00 WIB',
    specs: ['Free High-Speed Wi-Fi', 'Outdoor & Indoor Seating', 'Live Music Akhir Pekan']
  },
  umkm: {
    title: 'Pusat Jajanan & Kuliner UMKM',
    badge: 'Kuliner Makanan Lokal',
    img: 'images/cafe_umkm.jpg',
    desc: 'Area food court yang bermitra dengan UMKM lokal menyajikan aneka makanan lezat khas Indonesia seperti Batagor Bandung, Dimsum hangat, Bakso Danau, Sosis Bakar jumbo, Aneka Gorengan, Mie Ayam, dan Nasi Liwet Tradisional.',
    price: 'Mulai Rp 5.000 - Rp 25.000',
    hours: '08.00 - 18.00 WIB',
    specs: ['20+ Mitra UMKM Lokal', 'Harga Sangat Terjangkau', 'Area Makan Luas & Teduh']
  },
  playground: {
    title: 'Kids & Family Playground',
    badge: 'Ramah Anak',
    img: 'images/playground.jpg',
    desc: 'Taman bermain anak dengan beralaskan rumput sintetis higienis. Dilengkapi beragam wahana interaktif seperti perosotan spiral, ayunan aman, trampolin, jaring tali panjat, dan area pasir bersih yang melatih motorik anak.',
    price: 'Rp 20.000 / anak (Pendamping Gratis)',
    hours: '08.00 - 17.30 WIB',
    specs: ['Lantai Karet & Rumput Aman', 'Pengawasan Petugas', 'Gazebo Istirahat Orang Tua']
  },
  fishing: {
    title: 'Kolam Pemancingan Rekreasi',
    badge: 'Wisata Santai',
    img: 'images/fishing_pond.jpg',
    desc: 'Kolam pemancingan air tawar yang tenang dan teduh dikelilingi pepohonan hijau. Tersedia saung gazebo tradisional untuk bersantai bersama keluarga. Ikan hasil pancingan (Nila, Gurame, Bawal) dapat ditimbang dan langsung dibakar di tempat.',
    price: 'Sewa Joran: Rp 15.000 | Tiket Masuk: Rp 20.000',
    hours: '08.00 - 17.30 WIB',
    specs: ['Sewa Alat & Umpan Lengkap', 'Saung Bambu Gratis', 'Bisa Masak Ikan Langsung']
  },
  outbound: {
    title: 'Lapangan Outbound & Gathering',
    badge: 'Team Building & Event',
    img: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80',
    desc: 'Lapangan rumput luas untuk kegiatan outing kantor, gathering komunitas, reuni, maupun field trip sekolah. Dilengkapi paket permainan team building, instruktur profesional, sound system portable, dan tenda kegiatan.',
    price: 'Paket Mulai Rp 65.000 / peserta',
    hours: 'Reservasi Khusus (07.30 - 17.00)',
    specs: ['Kapasitas hingga 500 orang', 'Fasilitator Game Bersertifikat', 'Termasuk Konsumsi & Banner']
  },
  musholla: {
    title: 'Musholla Asri & Nyaman',
    badge: 'Fasilitas Ibadah',
    img: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=1000&q=80',
    desc: 'Fasilitas musholla bernuansa arsitektur kayu modern yang sejuk, bersih, dan asri. Memiliki tempat wudhu terpisah yang higienis untuk pria dan wanita serta dilengkapi sajadah, sarung, mukena bersih, dan Al-Quran.',
    price: 'Gratis untuk Pengunjung',
    hours: 'Selalu Terbuka Waktu Sholat',
    specs: ['Tempat Wudhu Air Mengalir', 'Ruang Sholat Pria & Wanita Terpisah', 'Mukena & Sarung Bersih']
  },
  pool: {
    title: 'Kolam Renang Waterpark (Coming Soon)',
    badge: 'Segera Hadir!',
    img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=80',
    desc: 'Proyek pengembangan kolam renang tematik keluarga di Trompoland! Menghadirkan kolam renang anak dengan ember tumpah, mini slider air, kolam dewasa semi-olympic, dan cabana santai tepi kolam.',
    price: 'Akan Diumumkan',
    hours: 'Tahap Pembangunan (Segera Hadir)',
    specs: ['Wahana Ember Tumpah', 'Kolam Air Alami Pegunungan', 'Cabana & Sunbed']
  },
  flyingfox: {
    title: 'Flying Fox Melintasi Danau (Coming Soon)',
    badge: 'Segera Hadir!',
    img: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?auto=format&fit=crop&w=1000&q=80',
    desc: 'Wahana adrenalin spektakuler yang memungkinkan pengunjung meluncur dari bukit Trompoland melintasi atas permukaan danau berair jernih sepanjang 200 meter dengan standar safety internasional.',
    price: 'Akan Diumumkan',
    hours: 'Tahap Instalasi (Segera Hadir)',
    specs: ['Lintasan 200m di atas danau', 'Double Safety Cable Harness', 'Foto Aksi Otomatis']
  }
};

function initMapPins() {
  const pins = document.querySelectorAll('.map-pin');
  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      const key = pin.getAttribute('data-spot');
      if (key && ATTRACTION_DATA[key]) {
        openModalWithData(ATTRACTION_DATA[key]);
      }
    });
  });

  // Buttons inside attraction cards to open modal
  const detailButtons = document.querySelectorAll('.btn-detail-modal');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-target');
      if (key && ATTRACTION_DATA[key]) {
        openModalWithData(ATTRACTION_DATA[key]);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Modal Logic
   -------------------------------------------------------------------------- */
let modalOverlay = null;

function initModal() {
  modalOverlay = document.getElementById('attraction-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Keyboard escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModalWithData(data) {
  if (!modalOverlay) return;

  const modalImg = document.getElementById('modal-img');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const modalHours = document.getElementById('modal-hours');
  const modalSpecsList = document.getElementById('modal-specs-list');

  if (modalImg) modalImg.src = data.img;
  if (modalBadge) modalBadge.textContent = data.badge;
  if (modalTitle) modalTitle.textContent = data.title;
  if (modalDesc) modalDesc.textContent = data.desc;
  if (modalPrice) modalPrice.textContent = data.price;
  if (modalHours) modalHours.textContent = data.hours;

  if (modalSpecsList) {
    modalSpecsList.innerHTML = data.specs.map(spec => `
      <span class="spec-pill"><i class="fas fa-check-circle" style="color: var(--primary);"></i> ${spec}</span>
    `).join('');
  }

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   7. Gallery Lightbox
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-info h4');
      const desc = item.querySelector('.gallery-info p');
      if (img) {
        openModalWithData({
          title: title ? title.textContent : 'Galeri TROMPOLAND',
          badge: 'Spot Foto Wisata',
          img: img.src,
          desc: desc ? desc.textContent : 'Suasana asri dan seru di destinasi wisata TROMPOLAND.',
          price: 'Gratis Akses Spot',
          hours: 'Buka 08.00 - 17.30 WIB',
          specs: ['Spot Foto Instagramable', 'Pemandangan Alami', 'Keluarga & Sahabat']
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   9. Contact Form handling
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    const message = document.getElementById('c-message').value;

    const waText = `Halo Admin TROMPOLAND,%0A%0ASaya ingin menanyakan informasi wisata:%0A- Nama: ${encodeURIComponent(name)}%0A- WhatsApp/Telp: ${encodeURIComponent(phone)}%0A- Pesan/Kebutuhan: ${encodeURIComponent(message)}`;
    window.open(`https://wa.me/6281234567890?text=${waText}`, '_blank');
  });
}
