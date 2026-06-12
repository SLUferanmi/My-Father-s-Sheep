// Google Sheets Web App URL for shared testimonies (see google_sheets_setup.md for details)
const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHDa1vv4VgfV5NT5O3P5bBRd2xm6NHbvRdm5YOzQWNDjrzDC8EUdoMZ5TDW78senB_/exec";

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
  const audio = document.getElementById('podcast-audio');
  const volumeSlider = document.querySelector('.player-volume-slider');
  const skipBtn = document.querySelector('.player-btn-skip');
  const forwardBtn = document.querySelector('.player-btn-forward');
  
  if (!playBtn || !playerCard || !audio) return;

  // Format seconds to MM:SS
  function formatTime(secs) {
    if (isNaN(secs) || secs === Infinity) return '00:00';
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateDisplay() {
    if (timeDisplay) {
      const cur = audio.currentTime || 0;
      const dur = audio.duration || 0;
      timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    }
  }

  // Toggle playback on button click
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      if (audio.readyState === 0) {
        audio.load();
      }
      audio.play().catch(err => {
        console.warn("Playback failed, retrying...", err);
        audio.load();
        audio.play().catch(err2 => {
          console.error("Playback retry failed:", err2);
          showToast("Click Play again or ensure assets/intro.mp3 is loaded", true);
        });
      });
    } else {
      audio.pause();
    }
  });

  // Track real audio playback events to update the UI
  audio.addEventListener('play', () => {
    playerCard.classList.add('playing');
    playBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px;">
        <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd"/>
      </svg>
    `;
    showToast("Playing Website Intro");
  });

  audio.addEventListener('pause', () => {
    playerCard.classList.remove('playing');
    playBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-left: 3px;">
        <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd"/>
      </svg>
    `;
  });

  audio.addEventListener('ended', () => {
    playerCard.classList.remove('playing');
  });

  audio.addEventListener('timeupdate', updateDisplay);
  audio.addEventListener('loadedmetadata', updateDisplay);
  audio.addEventListener('durationchange', updateDisplay);

  // Skip Backward (10s)
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
      updateDisplay();
    });
  }

  // Skip Forward (10s)
  if (forwardBtn) {
    forwardBtn.addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
      updateDisplay();
    });
  }

  // Volume control
  if (volumeSlider) {
    // Set initial volume
    audio.volume = volumeSlider.value / 100;
    volumeSlider.addEventListener('input', () => {
      audio.volume = volumeSlider.value / 100;
    });
  }

  // Initial display setup
  updateDisplay();
}

/* ==========================================================================
   3. MERCHANDISE COLOR SWITCHER WITH CARD GLOW
   ========================================================================== */
function initMerchColors() {
  const productCards = document.querySelectorAll('.luxury-product-card');

  productCards.forEach(card => {
    const swatches = card.querySelectorAll('.pulse-swatch');
    const viewButtons = card.querySelectorAll('.view-btn');
    const colorLabel = card.querySelector('.color-label');
    const imgContainer = card.querySelector('.luxury-image-container');
    const imgWrapper = card.querySelector('.luxury-product-img-wrapper');
    const colorBgs = card.querySelectorAll('.shirt-color-bg');
    const shadow = card.querySelector('.turntable-shadow');
    const swatchGroup = card.querySelector('.swatch-glow-group');
    const arrowLeft = card.querySelector('.arrow-left');
    const arrowRight = card.querySelector('.arrow-right');

    // Horizontal scroll arrow buttons for mobile swatches carousel
    function updateArrows() {
      if (!swatchGroup || !arrowLeft || !arrowRight) return;
      if (window.innerWidth >= 768) {
        arrowLeft.classList.remove('visible');
        arrowRight.classList.remove('visible');
        return;
      }
      
      const scrollLeft = swatchGroup.scrollLeft;
      const scrollWidth = swatchGroup.scrollWidth;
      const clientWidth = swatchGroup.clientWidth;

      if (scrollLeft > 5) {
        arrowLeft.classList.add('visible');
      } else {
        arrowLeft.classList.remove('visible');
      }

      if (scrollLeft + clientWidth < scrollWidth - 5) {
        arrowRight.classList.add('visible');
      } else {
        arrowRight.classList.remove('visible');
      }
    }

    if (swatchGroup) {
      swatchGroup.addEventListener('scroll', updateArrows);
      
      // Use ResizeObserver to automatically calculate layout when swatches container becomes visible
      if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
          updateArrows();
        });
        resizeObserver.observe(swatchGroup);
      } else {
        window.addEventListener('resize', updateArrows);
        setTimeout(updateArrows, 150);
      }
    }

    if (arrowLeft && swatchGroup) {
      arrowLeft.addEventListener('click', () => {
        swatchGroup.scrollBy({ left: -140, behavior: 'smooth' });
      });
    }

    if (arrowRight && swatchGroup) {
      arrowRight.addEventListener('click', () => {
        swatchGroup.scrollBy({ left: 140, behavior: 'smooth' });
      });
    }

    // 1. Initialize swatch background colors immediately from data-hex
    swatches.forEach(swatch => {
      const hex = swatch.getAttribute('data-hex');
      if (hex) {
        swatch.style.backgroundColor = hex;
        // Make white swatch readable with a fine border
        if (hex.toLowerCase() === '#ffffff') {
          swatch.style.border = '1px solid rgba(0, 0, 0, 0.15)';
        }
      }
    });

    // Track active rotation state (0 or 180 degrees)
    if (imgWrapper) {
      imgWrapper.dataset.currentY = '0';
      imgWrapper.dataset.isDragging = 'false';
    }

    // Helper function to update color and glow styling
    function updateCardState() {
      const activeSwatch = card.querySelector('.pulse-swatch.active');
      if (!activeSwatch) return;

      const colorName = activeSwatch.getAttribute('data-color');
      const colorHex = activeSwatch.getAttribute('data-hex');

      // Update color label text
      if (colorLabel) {
        colorLabel.textContent = colorName;
      }

      // Update order button text and action
      const orderBtn = document.getElementById('whatsapp-order-btn');
      if (orderBtn) {
        orderBtn.textContent = `Order ${colorName} on WhatsApp`;
        
        // Production product variant URL link
        const productionUrl = `https://myfatherssheep.vercel.app/?color=${encodeURIComponent(colorName)}`;
        
        // Draft message
        const baseMessage = `Hi, I saw this and really loved it! I would love to place an order for the Signature T-Shirt in ${colorName} color.\n\nView here: ${productionUrl}`;
        const encodedText = encodeURIComponent(baseMessage);
        
        // WhatsApp URL
        const whatsappUrl = `https://wa.me/2349074121215?text=${encodedText}`;
        
        orderBtn.onclick = () => {
          window.open(whatsappUrl, '_blank');
        };
      }

      // Update background mask colors dynamically
      colorBgs.forEach(bg => {
        bg.style.backgroundColor = colorHex;
      });

      // Apply light/dark contrast classes for print overlays
      const darkColors = ['Black', 'Olive', 'Royal Purple', 'Midnight Navy', 'Forest Green', 'Chocolate Brown'];
      const isDark = darkColors.includes(colorName);
      if (isDark) {
        card.classList.add('dark-shirt');
        card.classList.remove('light-shirt');
      } else {
        card.classList.add('light-shirt');
        card.classList.remove('dark-shirt');
      }

      // Dynamic glow effects on card border
      let glowColor = 'rgba(163, 138, 95, 0.15)';
      let borderGlow = 'rgba(163, 138, 95, 0.15)';

      if (colorName === 'Black') {
        glowColor = 'rgba(31, 29, 28, 0.12)';
        borderGlow = 'rgba(31, 29, 28, 0.2)';
      } else if (colorName === 'White') {
        glowColor = 'rgba(255, 255, 255, 0.2)';
        borderGlow = 'rgba(255, 255, 255, 0.6)';
      } else if (isDark) {
        glowColor = 'rgba(85, 107, 47, 0.12)';
        borderGlow = 'rgba(85, 107, 47, 0.25)';
      } else {
        glowColor = 'rgba(163, 138, 95, 0.1)';
        borderGlow = 'rgba(163, 138, 95, 0.18)';
      }

      card.style.setProperty('--shadow-premium', `0 10px 40px ${glowColor}`);
      card.style.borderColor = borderGlow;
    }

    // Bind swatch click color changes
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        updateCardState();
      });
    });

    // Helper to flip turntable programmatically via buttons
    function setView(viewType) {
      const isFlipped = (viewType === 'back');
      const targetY = isFlipped ? 180 : 0;

      viewButtons.forEach(btn => {
        if (btn.getAttribute('data-view') === viewType) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      if (imgWrapper) {
        imgWrapper.dataset.currentY = targetY.toString();
        imgWrapper.style.transform = `rotateY(${targetY}deg)`;
      }
      if (shadow) {
        shadow.style.transform = 'none';
      }
    }

    // Bind view toggle button clicks
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const viewType = btn.getAttribute('data-view');
        setView(viewType);
      });
    });

    // 2. Interactive Desktop Hover Parallax (Follow Mouse)
    if (imgContainer && imgWrapper) {
      imgContainer.addEventListener('mousemove', (e) => {
        if (imgWrapper.dataset.isDragging === 'true') return;

        const rect = imgContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dx = (x - rect.width / 2) / (rect.width / 2); // -1 to 1
        const dy = (y - rect.height / 2) / (rect.height / 2); // -1 to 1

        const currentY = parseFloat(imgWrapper.dataset.currentY) || 0;
        
        // Tilt relative to mouse position
        const tiltY = currentY + dx * 22; 
        const tiltX = -dy * 15;

        imgWrapper.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.04)`;

        // Move ground shadow slightly in opposite direction
        if (shadow) {
          shadow.style.transform = `translateX(${-dx * 12}px) scaleX(${1 - Math.abs(dx) * 0.15})`;
        }
      });

      imgContainer.addEventListener('mouseleave', () => {
        if (imgWrapper.dataset.isDragging === 'true') return;
        const currentY = parseFloat(imgWrapper.dataset.currentY) || 0;
        imgWrapper.style.transform = `rotateY(${currentY}deg)`;
        if (shadow) {
          shadow.style.transform = 'none';
        }
      });

      // 3. Touch/Mouse Drag-to-Spin & Snapping
      let isDragging = false;
      let startX = 0;
      let startRotY = 0;
      let currentRotY = 0;

      imgContainer.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        // If clicking on the view toggle buttons, prevent drag tracking
        if (e.target.closest('.view-toggle')) return;

        isDragging = true;
        imgWrapper.dataset.isDragging = 'true';
        imgContainer.setPointerCapture(e.pointerId);

        startX = e.clientX;
        startRotY = parseFloat(imgWrapper.dataset.currentY) || 0;
        currentRotY = startRotY;

        imgWrapper.style.transition = 'none';
        if (shadow) shadow.style.transition = 'none';
      });

      imgContainer.addEventListener('pointermove', (e) => {
        if (!isDragging) return;

        const rect = imgContainer.getBoundingClientRect();
        const diffX = e.clientX - startX;
        
        // Dragging full width turns it 270 degrees
        const deltaY = (diffX / rect.width) * 270;
        currentRotY = startRotY + deltaY;

        imgWrapper.style.transform = `rotateY(${currentRotY}deg)`;

        if (shadow) {
          const scaleVal = 1 - Math.min(Math.abs(diffX / rect.width) * 0.2, 0.2);
          shadow.style.transform = `scaleX(${scaleVal})`;
        }
      });

      imgContainer.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        imgWrapper.dataset.isDragging = 'false';
        imgContainer.releasePointerCapture(e.pointerId);

        imgWrapper.style.transition = '';
        if (shadow) shadow.style.transition = '';

        // Normalize angle to [0, 360)
        let normalized = ((currentRotY % 360) + 360) % 360;
        let targetY = 0;
        let view = 'front';

        if (normalized >= 90 && normalized < 270) {
          targetY = (currentRotY - normalized) + 180;
          view = 'back';
        } else {
          targetY = (currentRotY - normalized) + (normalized >= 270 ? 360 : 0);
          view = 'front';
        }

        imgWrapper.dataset.currentY = targetY.toString();
        imgWrapper.style.transform = `rotateY(${targetY}deg)`;
        if (shadow) shadow.style.transform = 'none';

        // Update active class on view buttons
        viewButtons.forEach(btn => {
          if (btn.getAttribute('data-view') === view) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      });

      imgContainer.addEventListener('pointercancel', () => {
        if (!isDragging) return;
        isDragging = false;
        imgWrapper.dataset.isDragging = 'false';
        imgWrapper.style.transition = '';
        if (shadow) shadow.style.transition = '';

        const currentY = parseFloat(imgWrapper.dataset.currentY) || 0;
        imgWrapper.style.transform = `rotateY(${currentY}deg)`;
        if (shadow) shadow.style.transform = 'none';
      });
    }

    // Load color from URL query parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const urlColor = urlParams.get('color');
    if (urlColor) {
      const matchingSwatch = Array.from(swatches).find(s => s.getAttribute('data-color').toLowerCase() === urlColor.toLowerCase());
      if (matchingSwatch) {
        swatches.forEach(s => s.classList.remove('active'));
        matchingSwatch.classList.add('active');
      }
    }

    // Initialize state on page load
    updateCardState();
  });
}

/* ==========================================================================
   4. TESTIMONY HUB (FORM & LOCAL PERSISTENCE)
   ========================================================================== */
const INITIAL_TESTIMONIES = [];

function initTestimonies() {
  const form = document.getElementById('testimony-form');
  const board = document.getElementById('testimony-board');
  const countLabel = document.getElementById('testimony-count');

  let testimonies = [];

  function renderTestimonies() {
    if (!board) return;
    board.innerHTML = '';

    if (countLabel) {
      countLabel.textContent = `${testimonies.length} Blessings Shared`;
    }

    if (testimonies.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.className = 'luxury-testimony-card';
      placeholder.style.textAlign = 'center';
      placeholder.style.padding = '3rem 2rem';
      placeholder.innerHTML = `
        <p class="testimony-quote-text" style="font-size: 1.15rem; color: var(--color-text-muted); font-family: var(--font-serif); font-style: italic;">
          "No blessings shared yet. Be the first to share a testimony of what God is doing!"
        </p>
      `;
      board.appendChild(placeholder);
      return;
    }

    testimonies.forEach(t => {
      const card = document.createElement('div');
      card.className = 'luxury-testimony-card';

      const badgesHtml = (t.badges || []).map(b => {
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
            <span class="profile-date">${t.date || 'Just Now'}</span>
          </div>
          <div class="profile-badges">
            ${badgesHtml}
          </div>
        </div>
      `;
      board.appendChild(card);
    });
  }

  // Load testimonies from Google Sheets or fallback to localStorage
  async function loadTestimonies() {
    if (GOOGLE_SHEETS_SCRIPT_URL) {
      try {
        const response = await fetch(GOOGLE_SHEETS_SCRIPT_URL);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            testimonies = data;
            renderTestimonies();
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to load testimonies from Google Sheets, using fallback:", err);
      }
    }

    // Fallback: local storage
    testimonies = JSON.parse(localStorage.getItem('mfs_testimonies'));
    if (!testimonies || testimonies.length === 0) {
      testimonies = INITIAL_TESTIMONIES;
      localStorage.setItem('mfs_testimonies', JSON.stringify(testimonies));
    }
    renderTestimonies();
  }

  loadTestimonies();

  if (form) {
    form.addEventListener('submit', async (e) => {
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
        type: "testimony",
        name: nameInput.value.trim(),
        text: textInput.value.trim(),
        badges: badges,
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };

      if (GOOGLE_SHEETS_SCRIPT_URL) {
        showToast("Sharing your blessing to the board...");
        try {
          // Send to Google Sheets via POST (no-cors for Google Apps Script redirect)
          await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTestimony)
          });
          
          testimonies.unshift(newTestimony);
          renderTestimonies();
          form.reset();
          showToast("Blessing shared! It is now on the board.");
          return;
        } catch (err) {
          console.warn("Failed to post to Google Sheets, using fallback:", err);
        }
      }

      // Local storage fallback
      testimonies.unshift(newTestimony);
      localStorage.setItem('mfs_testimonies', JSON.stringify(testimonies));
      renderTestimonies();
      form.reset();
      showToast("Blessing received! Saved locally to your browser.");
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
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input');
      if (emailInput && emailInput.value.trim()) {
        const email = emailInput.value.trim();
        
        if (GOOGLE_SHEETS_SCRIPT_URL) {
          showToast("Sending notification request...");
          try {
            await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                type: "newsletter",
                email: email,
                date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              })
            });
            showToast("Welcome! You will be notified the moment the newsletter starts.");
            emailInput.value = '';
            return;
          } catch (err) {
            console.warn("Failed to subscribe via Google Sheets:", err);
          }
        }
        
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
