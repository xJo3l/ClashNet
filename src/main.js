// White Desert Interactive Clone
// Complete luxury animations, parallax, card-flick, itinerary drawer, polar audio, modals, and SPA routing

const ITINERARIES_DATA = {
  'early-emperor-penguins': {
    title: 'Baby Penguins & Blue Tunnels',
    price: 'US $75,250',
    tag: 'Early Season',
    duration: '6 Days',
    camp: 'Whichaway Camp',
    image: '/images/trip_baby_penguins.jpg',
    desc: 'Witness Emperor penguin chicks as they take their first steps and explore the ethereal Blue Ice Tunnels. Walk amongst tens of thousands of emperor penguins and their newly hatched chicks at Atka Bay.',
    timeline: [
      { day: 'Day 1', title: 'Cape Town to Antarctica', desc: '5.5-hour business class flight over icebergs. Land at Wolf\'s Fang blue ice runway. Transfer to Whichaway Camp.' },
      { day: 'Day 2', title: 'Blue Ice Tunnels & Nunatak Treks', desc: 'Explore natural underground caves of glowing turquoise ice. Hike gently up the Oasis mountain ridge.' },
      { day: 'Day 3', title: 'Flight to Emperor Penguin Colony', desc: 'Fly on a ski-equipped Basler BT-67 to Atka Bay. Experience 28,000 Emperor penguins and newborn chicks.' },
      { day: 'Day 4', title: 'Polar Activities & Sauna', desc: 'Ice climbing with IFMGA guides, cross-country skiing, and sauna overlooking the frozen freshwater lake.' },
      { day: 'Day 5', title: 'Ice Wave & Glacier Trek', desc: 'Visit giant pressure waves of blue ice and celebrate with a champagne picnic in the wilderness.' },
      { day: 'Day 6', title: 'Return Flight to Cape Town', desc: 'Fly back to South Africa with memories of a lifetime.' }
    ]
  },
  'south-pole-emperor-penguins': {
    title: 'South Pole & Penguins',
    price: 'US $115,500',
    tag: 'Signature Journey',
    duration: '8 Days',
    camp: 'Whichaway or Echo Camp',
    image: '/images/trip_south_pole.jpg',
    desc: 'Our most sought-after expedition. Stand at the lowest point on Earth — the Geographic South Pole (90° S) visited by fewer than 500 people per year — combined with the vast Emperor Penguin colony.',
    timeline: [
      { day: 'Day 1', title: 'Flight to Antarctica', desc: 'Private jet transfer from Cape Town to Wolf\'s Fang Runway. Settle into heated luxury polar pods.' },
      { day: 'Day 2', title: 'Acclimatization & Ice Exploring', desc: 'Trek the frozen plateau, discover ice waves, and prepare for high-altitude South Pole expedition.' },
      { day: 'Day 3', title: 'Emperor Penguin Colony', desc: 'Fly across Queen Maud Land to Atka Bay. Spend the day walking amongst thousands of majestic Emperor penguins.' },
      { day: 'Day 4', title: 'Flight to Geographic South Pole', desc: 'Fly to 90° South. Stand at the Amundsen-Scott South Pole Station where all 360 lines of longitude meet.' },
      { day: 'Day 5', title: 'Polar Plateau Exploration', desc: 'Cross-country skiing and photographic safaris in 24 hours of continuous sunshine.' },
      { day: 'Day 6', title: 'Ice Climbing & Blue Caves', desc: 'Rappel into subterranean crystal ice caves with our polar mountaineering guides.' },
      { day: 'Day 7', title: 'Champagne Toast at Oasis', desc: 'Fine dining prepared by private chefs with vintage wines and celebration.' },
      { day: 'Day 8', title: 'Flight back to Cape Town', desc: 'Return flight to South Africa.' }
    ]
  },
  'south-pole-blue-rivers': {
    title: 'South Pole & Blue Rivers',
    price: 'US $115,500',
    tag: 'New Itinerary',
    duration: '8 Days',
    camp: 'Echo Camp',
    image: '/images/trip_blue_rivers.jpg',
    desc: 'Combines our signature journey to the Geographic South Pole with Antarctica\'s rarely seen turquoise Blue Rivers — crystal meltwater flowing through dramatic white glaciers.',
    timeline: [
      { day: 'Day 1', title: 'Arrival at Echo Camp', desc: 'Arrive at the retro-futuristic Echo Camp pods inspired by space exploration.' },
      { day: 'Day 2', title: 'Blue River Monoliths', desc: 'Witness the surreal contrast of turquoise meltwater rivers carving through white ice shelves.' },
      { day: 'Day 3', title: 'South Pole Flight', desc: 'Flight to the Geographic South Pole (90° S). Stamp your passport at the bottom of the world.' },
      { day: 'Day 4', title: 'Kite Skiing & Fat Biking', desc: 'Experience kite skiing on the wind-packed polar ice and fat biking along the nunatak bases.' },
      { day: 'Day 5', title: 'Wolf\'s Fang Nunatak Summit', desc: 'Guided ascent up the iconic Wolf\'s Fang granite monolith.' },
      { day: 'Day 6-7', title: 'Culinary Masterpieces & Stargazing', desc: 'Gourmet dining and 24-hour sun photowalks.' },
      { day: 'Day 8', title: 'Departure', desc: 'Private charter flight back to Cape Town.' }
    ]
  },
  'the-long-stay': {
    title: 'The Long Stay',
    price: 'US $110,500',
    tag: 'Dual Camp Experience',
    duration: '12 Days',
    camp: 'Whichaway & Echo Camps',
    image: '/images/trip_long_stay.jpg',
    desc: 'Experience both Whichaway and Echo camps on our longest journey. Includes the South Pole, Blue Rivers, and Emperor penguins in an unhurried polar immersion.',
    timeline: [
      { day: 'Day 1-4', title: 'Whichaway Camp Residency', desc: 'Freshwater lakes, Blue Ice Tunnels, and Emperor Penguin colony.' },
      { day: 'Day 5', title: 'Geographic South Pole Expedition', desc: 'Fly to 90° S. Full exploration of the Geographic South Pole.' },
      { day: 'Day 6-8', title: 'Transfer to Echo Camp', desc: 'Transition into space-age sky pods. Glacier trekking and ice climbing.' },
      { day: 'Day 9-11', title: 'Deep Interior Exploration', desc: 'Blue Rivers and nunatak mountaineering.' },
      { day: 'Day 12', title: 'Return Flight to Cape Town', desc: 'Farewell flight to South Africa.' }
    ]
  },
  'antarctica-in-a-day': {
    title: 'Antarctica in a Day',
    price: 'US $16,500',
    tag: 'Exclusive Day Trip',
    duration: '24 Hours',
    camp: 'Wolf\'s Fang Base',
    image: '/images/trip_day.jpg',
    desc: 'Cape Town to Antarctica and back. Descend into an ice cave, hike across a glacier, and toast with champagne in our ice bar during this extraordinary day trip.',
    timeline: [
      { day: '06:00', title: 'Depart Cape Town', desc: 'Board business-class Airbus flight heading due south over the Southern Ocean.' },
      { day: '11:30', title: 'Land on Blue Ice Runway', desc: 'Touch down at Wolf\'s Fang Runway in 24 hours of daylight.' },
      { day: '12:00', title: 'Polar Safari & Ice Cave', desc: 'Hike across the ice, explore blue ice caves, and take stunning photography.' },
      { day: '14:30', title: 'Champagne Lunch on Ice', desc: 'Gourmet meal and champagne toast surrounded by 1,000m sheer mountain monoliths.' },
      { day: '16:00', title: 'Return Flight', desc: 'Fly back to Cape Town, landing before midnight.' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initParallaxAndScrollAnimations();
  initCardFlick();
  initItineraryDrawer();
  initModals();
  initNavigation();
  initPolarAudio();
  initLiquidGlass();
  initCampsShowcase();
  handleInitialRoute();
});

/* ==========================================================================
   1. Luxury Custom Cursor
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const interactables = document.querySelectorAll('a, button, .card-flick_item, .btn, input, select, textarea');
  interactables.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });
}

/* ==========================================================================
   2. Parallax & Scroll-Triggered Animations
   ========================================================================== */
function initParallaxAndScrollAnimations() {
  const clouds = document.querySelectorAll('.clouds-overlay_wrap');
  const heroContent = document.querySelector('.hero-banner_content');
  const heroTitle = document.querySelector('.hero-banner_title-wrapper');
  const mountainImg = document.querySelector('.tall-parallax-banner_inner img');
  const scribble = document.querySelector('.scribble-el');
  const textScrollFades = document.querySelectorAll('.text-scroll-fade');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Clouds parallax drift
    if (clouds.length >= 2) {
      clouds[0].style.transform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
      clouds[1].style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
    }

    // Hero title & content parallax
    if (heroTitle) {
      heroTitle.style.transform = `translate3d(0, ${scrollY * 0.45}px, 0)`;
      heroTitle.style.opacity = `${Math.max(0, 1 - scrollY / 600)}`;
    }
    if (heroContent) {
      heroContent.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
    }

    // Mountain parallax
    if (mountainImg) {
      const rect = mountainImg.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        mountainImg.style.transform = `translate3d(0, ${(rect.top - window.innerHeight * 0.5) * 0.18}px, 0) scale(1.08)`;
      }
    }
  }, { passive: true });

  // IntersectionObserver for Scribble & Text Fade
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-drawn');
        entry.target.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.2 });

  if (scribble) observer.observe(scribble);
  textScrollFades.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   3. "Our Trips" Card-Flick Interactive Accordion
   ========================================================================== */
function initCardFlick() {
  const cardItems = document.querySelectorAll('.card-flick_item');
  if (!cardItems.length) return;

  const keyMap = [
    'early-emperor-penguins',
    'south-pole-emperor-penguins',
    'south-pole-blue-rivers',
    'the-long-stay',
    'antarctica-in-a-day'
  ];

  cardItems.forEach((card, index) => {
    const key = keyMap[index] || 'south-pole-emperor-penguins';

    card.addEventListener('mouseenter', () => {
      cardItems.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
    });

    card.addEventListener('click', (e) => {
      e.preventDefault();
      cardItems.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
      openItineraryDrawer(key);
    });
  });
}

/* ==========================================================================
   4. Itinerary Slide-over Drawer & SPA Route Handling
   ========================================================================== */
function initItineraryDrawer() {
  const drawer = document.getElementById('itineraryDrawer');
  const closeBtn = document.getElementById('closeItineraryDrawer');
  const bookBtn = document.getElementById('drawerBookBtn');

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => closeItineraryDrawer());
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeItineraryDrawer();
    });
  }

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const title = document.getElementById('itineraryTitle').innerText;
      closeItineraryDrawer();
      openEnquireModal(title);
    });
  }
}

function openItineraryDrawer(key) {
  const data = ITINERARIES_DATA[key] || ITINERARIES_DATA['south-pole-emperor-penguins'];
  const drawer = document.getElementById('itineraryDrawer');
  if (!drawer) return;

  document.getElementById('itineraryImg').src = data.image;
  document.getElementById('itineraryTag').innerText = data.tag;
  document.getElementById('itineraryTitle').innerText = data.title;
  document.getElementById('itineraryPrice').innerHTML = `${data.price} <span>/ guest</span>`;
  document.getElementById('itineraryDuration').innerText = data.duration;
  document.getElementById('itineraryCamp').innerText = data.camp;
  document.getElementById('itineraryDesc').innerText = data.desc;

  const timelineContainer = document.getElementById('itineraryTimeline');
  timelineContainer.innerHTML = '';
  data.timeline.forEach(step => {
    const stepEl = document.createElement('div');
    stepEl.className = 'timeline-step';
    stepEl.innerHTML = `
      <div class="timeline-step-day">${step.day}</div>
      <div class="timeline-step-title">${step.title}</div>
      <div class="timeline-step-desc">${step.desc}</div>
    `;
    timelineContainer.appendChild(stepEl);
  });

  drawer.classList.add('is-open');
  history.pushState({ type: 'itinerary', key }, '', `/itineraries/${key}`);
}

function closeItineraryDrawer() {
  const drawer = document.getElementById('itineraryDrawer');
  if (drawer) drawer.classList.remove('is-open');
  if (window.location.pathname.includes('/itineraries')) {
    history.pushState(null, '', '/');
  }
}

/* ==========================================================================
   5. Video, Rates & Enquiry Modals
   ========================================================================== */
function initModals() {
  // Video Film Modal
  const videoModal = document.getElementById('videoModal');
  const closeVideoModal = document.getElementById('closeVideoModal');
  const modalVideo = document.getElementById('modalVideo');

  function openFilmModal() {
    if (!videoModal) return;
    videoModal.classList.add('is-open');
    if (modalVideo) {
      modalVideo.currentTime = 0;
      modalVideo.play().catch(() => {});
    }
  }

  function closeFilmModal() {
    if (!videoModal) return;
    videoModal.classList.remove('is-open');
    if (modalVideo) modalVideo.pause();
  }

  document.querySelectorAll('button, .btn, .btn-image-hover').forEach(btn => {
    if (btn.innerText && btn.innerText.includes('Watch Film')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openFilmModal();
      });
    }
  });

  if (closeVideoModal) closeVideoModal.addEventListener('click', closeFilmModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeFilmModal();
    });
  }

  // Rates Modal
  const ratesModal = document.getElementById('ratesModal');
  const closeRatesModal = document.getElementById('closeRatesModal');

  function openRatesModal() {
    if (ratesModal) ratesModal.classList.add('is-open');
    history.pushState({ type: 'rates' }, '', '/prices');
  }

  function closeRatesModalFn() {
    if (ratesModal) ratesModal.classList.remove('is-open');
    if (window.location.pathname === '/prices') history.pushState(null, '', '/');
  }

  document.querySelectorAll('a[href*="prices"], a.btn-cta:has(.btn-text:contains("Rates")), .btn-tab:has(.btn-text:contains("Rates"))').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openRatesModal();
    });
  });

  // Rates fallback by text content
  document.querySelectorAll('a, button, .btn').forEach(btn => {
    if (btn.innerText && btn.innerText.trim() === 'Rates') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openRatesModal();
      });
    }
  });

  if (closeRatesModal) closeRatesModal.addEventListener('click', closeRatesModalFn);
  if (ratesModal) {
    ratesModal.addEventListener('click', (e) => {
      if (e.target === ratesModal) closeRatesModalFn();
    });
  }

  // Enquiry Modal
  const enquireModal = document.getElementById('enquireModal');
  const closeEnquireModal = document.getElementById('closeEnquireModal');

  window.openEnquireModal = function(prefillTrip) {
    if (!enquireModal) return;
    enquireModal.classList.add('is-open');
    if (prefillTrip) {
      const select = enquireModal.querySelector('select');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.includes(prefillTrip) || prefillTrip.includes(select.options[i].text)) {
            select.selectedIndex = i;
            break;
          }
        }
      }
    }
    history.pushState({ type: 'enquire' }, '', '/enquire');
  };

  function closeEnquireModalFn() {
    if (enquireModal) enquireModal.classList.remove('is-open');
    if (window.location.pathname === '/enquire') history.pushState(null, '', '/');
  }

  document.querySelectorAll('a[href*="enquire"], .menu-enquire').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.openEnquireModal();
    });
  });

  document.querySelectorAll('a, button, .btn').forEach(btn => {
    if (btn.innerText && (btn.innerText.trim() === 'Enquire' || btn.innerText.trim() === 'Enquire now')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openEnquireModal();
      });
    }
  });

  if (closeEnquireModal) closeEnquireModal.addEventListener('click', closeEnquireModalFn);
  if (enquireModal) {
    enquireModal.addEventListener('click', (e) => {
      if (e.target === enquireModal) closeEnquireModalFn();
    });
  }

  // ESC to close any modal/drawer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFilmModal();
      closeRatesModalFn();
      closeEnquireModalFn();
      closeItineraryDrawer();
    }
  });
}

/* ==========================================================================
   6. Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.menu-close');
  const menuComponent = document.querySelector('.menu-component');

  if (menuToggle && menuComponent) {
    menuToggle.addEventListener('click', () => {
      menuComponent.classList.toggle('is-open');
      if (mobileMenu) mobileMenu.classList.toggle('is-open');
    });
  }

  if (menuClose && menuComponent) {
    menuClose.addEventListener('click', () => {
      menuComponent.classList.remove('is-open');
      if (mobileMenu) mobileMenu.classList.remove('is-open');
    });
  }

  // Tab buttons: Experience, Operation, About scroll smoothly
  const tabBtns = document.querySelectorAll('.btn-tab');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.innerText.trim();
      if (text === 'Experience') {
        const target = document.querySelector('.card-flick');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      } else if (text === 'Operation') {
        const target = document.querySelector('.travel-globe, .wd-mnt');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      } else if (text === 'About') {
        const target = document.querySelector('.home-section');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Home links scroll to top
  document.querySelectorAll('a[href="/"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (menuComponent) menuComponent.classList.remove('is-open');
    });
  });
}

/* ==========================================================================
   7. Polar Ambient Audio Synthesis (Pure Web Audio API)
   ========================================================================== */
function initPolarAudio() {
  const soundBtn = document.getElementById('soundToggle');
  const soundText = document.getElementById('soundText');
  if (!soundBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let gainNode = null;

  function toggleAudio() {
    if (!isPlaying) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 320;
        filter.Q.value = 2.5;

        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = 0.15;
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 180;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 2);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        whiteNoise.start();
      } else {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 1.5);
      }

      isPlaying = true;
      soundBtn.classList.add('is-playing');
      soundText.innerText = 'Sound On';
    } else {
      if (gainNode) {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      }
      setTimeout(() => {
        if (audioCtx) audioCtx.suspend();
      }, 1000);

      isPlaying = false;
      soundBtn.classList.remove('is-playing');
      soundText.innerText = 'Sound Off';
    }
  }

  soundBtn.addEventListener('click', toggleAudio);
}

/* ==========================================================================
   8. Liquid Glass Specular & Displacement Mapping
   ========================================================================== */
function initLiquidGlass() {
  const glassContainers = document.querySelectorAll('.nav-ul li, .btn');
  glassContainers.forEach(container => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      const specular = container.querySelector('.liquid-glass__specular');
      if (specular) {
        specular.style.setProperty('--glass-scale', `${0.35 + Math.abs(x) * 0.1}`);
        specular.style.setProperty('--glass-depth', `${x * 10}px`);
      }
    });
  });
}

/* ==========================================================================
   9. "Our Camps" & Mobile Accordions
   ========================================================================== */
function initCampsShowcase() {
  const accordions = document.querySelectorAll('.mobile-menu_accordion-trigger');
  accordions.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('is-active');
      const icon = btn.querySelector('.mobile-menu_accordion-icon');
      if (icon) {
        icon.style.transform = btn.classList.contains('is-active') ? 'rotate(45deg)' : 'rotate(0deg)';
      }
    });
  });

  // Camp card clicks scroll smoothly or open details
  document.querySelectorAll('.horizontal-scroll_camp-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const campName = card.querySelector('h3') ? card.querySelector('h3').innerText.trim() : 'Camp';
      window.openEnquireModal(`Inquiry for ${campName}`);
    });
  });
}

/* ==========================================================================
   10. SPA Route & History Popstate Handling
   ========================================================================== */
function handleInitialRoute() {
  const path = window.location.pathname;
  if (path.startsWith('/itineraries/')) {
    const slug = path.replace('/itineraries/', '').replace(/\/$/, '');
    if (ITINERARIES_DATA[slug]) {
      openItineraryDrawer(slug);
    } else {
      openItineraryDrawer('south-pole-emperor-penguins');
    }
  } else if (path === '/prices') {
    const ratesModal = document.getElementById('ratesModal');
    if (ratesModal) ratesModal.classList.add('is-open');
  } else if (path === '/enquire') {
    if (window.openEnquireModal) window.openEnquireModal();
  }

  window.addEventListener('popstate', (e) => {
    const p = window.location.pathname;
    if (p.startsWith('/itineraries/')) {
      const slug = p.replace('/itineraries/', '').replace(/\/$/, '');
      if (ITINERARIES_DATA[slug]) openItineraryDrawer(slug);
    } else {
      closeItineraryDrawer();
      const ratesModal = document.getElementById('ratesModal');
      const enquireModal = document.getElementById('enquireModal');
      if (ratesModal) ratesModal.classList.remove('is-open');
      if (enquireModal) enquireModal.classList.remove('is-open');
    }
  });
}
