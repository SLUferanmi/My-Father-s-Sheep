document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCustomPlayer();
  initMerchColors();
  initTestimonies();
  initNewsletterToast();
  initDailyScripture();
});

/* ==========================================================================
   1. NAVIGATION & TAB SYSTEM (EXQUISITE TRANSITIONS)
   ========================================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const shopCta = document.getElementById('hero-shop-cta');
  const subscribeBtn = document.getElementById('nav-subscribe-cta');

  function switchTab(tabId) {
    // Scroll to top of window smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update active state in nav links
    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle views with a clean opacity fade-in transition
    tabContents.forEach(content => {
      if (content.id === tabId) {
        content.style.display = 'block';
        // Force reflow
        void content.offsetHeight;
        content.classList.add('active');
      } else {
        content.classList.remove('active');
        content.style.display = 'none';
      }
    });
  }

  // Event Listeners for Nav Links
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Hero CTA to Shop
  if (shopCta) {
    shopCta.addEventListener('click', () => {
      switchTab('shop-view');
    });
  }

  // Floating Nav CTA scrolls to Footer
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
      const footer = document.querySelector('.footer-cta-section');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE CUSTOM MEDIA PLAYER
   ========================================================================== */
function initCustomPlayer() {
  const playerCard = document.querySelector('.player-card');
  const playBtn = document.querySelector('.player-btn-play');
  const timeDisplay = document.querySelector('.player-time');
  
  if (!playBtn || !playerCard) return;

  let isPlaying = false;
  let playTimer = null;
  let currentSeconds = 105; // Starting at 01:45
  const totalSeconds = 2712; // Total time 45:12

  // Format seconds to MM:SS
  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function startTimer() {
    playTimer = setInterval(() => {
      if (currentSeconds < totalSeconds) {
        currentSeconds++;
        updateDisplay();
      } else {
        pausePlayer();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(playTimer);
  }

  function updateDisplay() {
    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(currentSeconds)} / ${formatTime(totalSeconds)}`;
    }
  }

  function playPlayer() {
    isPlaying = true;
    playerCard.classList.add('playing');
    // Swap Play SVG with Pause SVG
    playBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px;">
        <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd"/>
      </svg>
    `;
    startTimer();
    showToast("Now playing: Episode 18 Preview");
  }

  function pausePlayer() {
    isPlaying = false;
    playerCard.classList.remove('playing');
    // Swap Pause SVG with Play SVG
    playBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-left: 3px;">
        <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd"/>
      </svg>
    `;
    stopTimer();
  }

  // Initialize time display text
  updateDisplay();

  // Toggle state on click
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      pausePlayer();
    } else {
      playPlayer();
    }
  });
}

/* ==========================================================================
   3. MERCHANDISE COLOR SWITCHER WITH CARD GLOW
   ========================================================================== */
function initMerchColors() {
  const swatchGroups = document.querySelectorAll('.swatch-glow-group');

  swatchGroups.forEach(group => {
    const swatches = group.querySelectorAll('.pulse-swatch');
    const productCard = group.closest('.luxury-product-card');
    const colorLabel = productCard.querySelector('.color-label');
    const imageContainer = productCard.querySelector('.luxury-image-container');

    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        // Toggle active states on swatches
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        const colorName = swatch.getAttribute('data-color');
        const colorHex = swatch.getAttribute('data-hex');

        // Update color text label
        if (colorLabel) {
          colorLabel.textContent = colorName;
        }

        // 1. Smoothly update product container background color
        if (imageContainer) {
          imageContainer.style.backgroundColor = colorHex;
        }

        // 2. High-end: adjust the card border-color/shadow glow based on the color swatch
        if (productCard) {
          let glowColor = 'rgba(163, 138, 95, 0.15)'; // Default gold glow
          let borderGlow = 'rgba(163, 138, 95, 0.15)';

          if (colorName === 'Black') {
            glowColor = 'rgba(31, 29, 28, 0.12)';
            borderGlow = 'rgba(31, 29, 28, 0.2)';
          } else if (colorName === 'White') {
            glowColor = 'rgba(255, 255, 255, 0.2)';
            borderGlow = 'rgba(255, 255, 255, 0.6)';
          } else if (colorName === 'Olive') {
            glowColor = 'rgba(85, 107, 47, 0.08)';
            borderGlow = 'rgba(85, 107, 47, 0.25)';
          } else if (colorName === 'Sand') {
            glowColor = 'rgba(210, 180, 140, 0.08)';
            borderGlow = 'rgba(210, 180, 140, 0.25)';
          }

          productCard.style.setProperty('--shadow-premium', `0 10px 40px ${glowColor}`);
          productCard.style.borderColor = borderGlow;
        }
      });
    });
  });
}

/* ==========================================================================
   4. TESTIMONY HUB (FORM & LOCAL PERSISTENCE)
   ========================================================================== */
const INITIAL_TESTIMONIES = [
  {
    name: "David Adebayo",
    text: "This podcast has been a massive blessing to my walk with God. Listening to the episodes on Spotify during my daily commute has transformed my mindset. I feel more anchored in my identity in Christ.",
    badges: ["spotify"],
    date: "May 2026"
  },
  {
    name: "Samuel Thompson",
    text: "The raw discussions about brotherhood, responsibility, and seeking Christ together really hit home. It's rare to find content that speaks directly to the minds of men with such grace and truth.",
    badges: ["youtube", "spotify"],
    date: "April 2026"
  },
  {
    name: "Michael Chen",
    text: "The aim 'to be seen, sent, and sustained' is not just a slogan; you can feel it in every single conversation. Thank you for answering the call. Truly premium content for the soul.",
    badges: ["youtube"],
    date: "March 2026"
  }
];

function initTestimonies() {
  const form = document.getElementById('testimony-form');
  const board = document.getElementById('testimony-board');
  const countLabel = document.getElementById('testimony-count');

  let testimonies = JSON.parse(localStorage.getItem('mfs_testimonies'));
  if (!testimonies || testimonies.length === 0) {
    testimonies = INITIAL_TESTIMONIES;
    localStorage.setItem('mfs_testimonies', JSON.stringify(testimonies));
  }

  renderTestimonies();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('testimony-name');
      const textInput = document.getElementById('testimony-text');
      const spotifyCheck = document.getElementById('listener-spotify');
      const youtubeCheck = document.getElementById('listener-youtube');

      if (!nameInput.value.trim() || !textInput.value.trim()) {
        showToast("Please complete the required form fields.", true);
        return;
      }

      const badges = [];
      if (spotifyCheck && spotifyCheck.checked) badges.push('spotify');
      if (youtubeCheck && youtubeCheck.checked) badges.push('youtube');
      if (badges.length === 0) badges.push('spotify'); // Fallback default

      const newTestimony = {
        name: nameInput.value.trim(),
        text: textInput.value.trim(),
        badges: badges,
        date: "Just Now"
      };

      testimonies.unshift(newTestimony);
      localStorage.setItem('mfs_testimonies', JSON.stringify(testimonies));

      renderTestimonies();
      form.reset();

      showToast("Blessing received! Your testimony is on the board.");
    });
  }

  function renderTestimonies() {
    if (!board) return;
    board.innerHTML = '';

    if (countLabel) {
      countLabel.textContent = `${testimonies.length} Blessings Shared`;
    }

    testimonies.forEach(t => {
      const card = document.createElement('div');
      card.className = 'luxury-testimony-card';

      const badgesHtml = t.badges.map(b => {
        if (b === 'spotify') return `<span class="badge-tag badge-tag-spotify">Spotify</span>`;
        if (b === 'youtube') return `<span class="badge-tag badge-tag-youtube">YouTube</span>`;
        return '';
      }).join('');

      card.innerHTML = `
        <div class="grace-quote-mark">“</div>
        <p class="testimony-quote-text">${escapeHTML(t.text)}</p>
        <div class="testimony-profile">
          <div class="profile-details">
            <h4 class="profile-name">${escapeHTML(t.name)}</h4>
            <span class="profile-date">${t.date}</span>
          </div>
          <div class="profile-badges">
            ${badgesHtml}
          </div>
        </div>
      `;
      board.appendChild(card);
    });
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* ==========================================================================
   5. PREMIUM TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, isError = false) {
  const existingToast = document.querySelector('.premium-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'premium-toast';
  
  if (isError) {
    toast.style.borderLeft = "3px solid #DC2626";
  } else {
    toast.style.borderLeft = "3px solid var(--color-accent)";
  }

  const iconSvg = isError 
    ? `<svg class="toast-svg-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#DC2626"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`
    : `<svg class="toast-svg-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--color-accent)"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  // Force reflow
  void toast.offsetHeight;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 4000);
}

/* ==========================================================================
   6. FOOTER NEWSLETTER SUBSCRIPTION
   ========================================================================== */
function initNewsletterToast() {
  const newsletterForm = document.querySelector('.premium-subscribe-input-group');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input');
      if (emailInput && emailInput.value.trim()) {
        showToast("Welcome to the fellowship! You've been subscribed.");
        emailInput.value = '';
      } else {
        showToast("Please enter a valid email address.", true);
      }
    });
  }
}

/* ==========================================================================
   7. DYNAMIC SCRIPTURE DECO (DAILY RENEWAL)
   ========================================================================== */
const SCRIPTURES = [
  { quote: "As iron sharpens iron, so one man sharpens another.", ref: "Proverbs 27:17" },
  { quote: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures...", ref: "Psalm 23:1-2" },
  { quote: "Watch, stand fast in the faith, be brave, be strong. Let all that you do be done with love.", ref: "1 Corinthians 16:13-14" },
  { quote: "Create in me a clean heart, O God, and renew a steadfast spirit within me.", ref: "Psalm 51:10" },
  { quote: "For you were once darkness, but now you are light in the Lord. Walk as children of light.", ref: "Ephesians 5:8" }
];

function initDailyScripture() {
  const quoteEl = document.getElementById('daily-scripture');
  const refEl = document.getElementById('daily-reference');
  
  if (!quoteEl || !refEl) return;
  
  const randomIdx = Math.floor(Math.random() * SCRIPTURES.length);
  const selected = SCRIPTURES[randomIdx];
  
  quoteEl.textContent = `"${selected.quote}"`;
  refEl.textContent = selected.ref;
}
