/* ==========================================================================
   INVITACIÓN DIGITAL: PLIM PLIM CIRCO - LUKA (1 AÑO)
   Efectos de Brillantes (Canvas 2D), Música de Circo y Cuenta Regresiva
   ========================================================================== */

(function () {
  'use strict';

  // Limpiar cualquier configuración previa en caché del navegador
  try {
    localStorage.removeItem('luka_plim_plim_config_v1');
  } catch (e) {}

  // --- DATOS OFICIALES DEL EVENTO DE LUKA ---
  const EVENT_CONFIG = {
    childName: 'Luka',
    ageText: 'Mi Primer año',
    eventDateISO: '2026-11-14T16:00:00-05:00', // Sábado 14 de Noviembre, 4:00 pm
    dayName: 'Sábado',
    dayNum: '14',
    monthName: 'Noviembre',
    timeText: '4:00 pm',
    venueName: 'Hotel Casa Grande - Pasco',
    addressText: 'Av. Circunvalación Túpac Amaru 163 - Hotel Casa Grande - Pasco',
    parentsNames: 'Valeria y Yeyson',
    datePromptText: 'Te esperamos el:',
    whatsappNumber: '51929748371',
    whatsappMessage: 'Hola Valeria, confirmo mi asistencia al cumpleaños de Luka :) '
  };

  function applyConfigToDOM() {
    const elDayName = document.getElementById('display-day-name');
    const elDayNum = document.getElementById('display-day-num');
    const elMonthName = document.getElementById('display-month-name');
    const elParents = document.getElementById('display-parents');
    const elGodparents = document.getElementById('display-godparents');

    if (elDayName) elDayName.textContent = EVENT_CONFIG.dayName;
    if (elDayNum) elDayNum.textContent = EVENT_CONFIG.dayNum;
    if (elMonthName) elMonthName.textContent = EVENT_CONFIG.monthName;
    if (elParents) elParents.textContent = EVENT_CONFIG.parentsNames;
    if (elGodparents) elGodparents.textContent = EVENT_CONFIG.datePromptText;
  }

  // ==========================================================================
  // 1. SISTEMA DE PARTÍCULAS BRILLANTES Y DESTELLOS DORADOS (CANVAS 2D)
  // ==========================================================================
  const canvas = document.getElementById('sparkle-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let burstParticles = [];
  let width = window.innerWidth;
  let height = window.innerHeight;

  function resizeCanvas() {
    if (!canvas) return;
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const SPARKLE_COLORS = [
    '#FFF1B6', // Cream gold original
    '#FFD60A', // Bright circus gold
    '#FFFFFF', // Pure white diamond sparkle
    '#FFE57F', // Soft warm gold
    '#FF9E00'  // Amber glow
  ];

  function createAmbientSparkle() {
    const isStar = Math.random() < 0.48;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: isStar ? (Math.random() * 7 + 4) : (Math.random() * 3.2 + 1.2),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() * -0.55) - 0.15,
      alpha: Math.random(),
      alphaSpeed: (Math.random() * 0.025 + 0.008) * (Math.random() < 0.5 ? 1 : -1),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      isStar: isStar
    };
  }

  function initSparkles() {
    particles = [];
    const count = width < 600 ? 42 : 75;
    for (let i = 0; i < count; i++) {
      particles.push(createAmbientSparkle());
    }
  }

  function spawnTrailSparkle(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.2 + 0.4;
      burstParticles.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        size: Math.random() * 7 + 3.5,
        alpha: 1,
        decay: Math.random() * 0.022 + 0.015,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        isStar: true
      });
    }
  }

  function triggerCelebrationBurst() {
    const cx = width / 2;
    const cy = height / 2;
    const burstColors = ['#FFF1B6', '#FFD60A', '#E6111E', '#29B7FC', '#7FC61E', '#FFFFFF'];
    for (let i = 0; i < 65; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      burstParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 9 + 4,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.12,
        color: burstColors[Math.floor(Math.random() * burstColors.length)],
        isStar: Math.random() < 0.7
      });
    }
  }

  function drawFourPointStar(ctx, x, y, radius, rotation, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;

    ctx.beginPath();
    const inner = radius * 0.24;
    for (let i = 0; i < 4; i++) {
      const outerAngle = (i * Math.PI) / 2;
      const innerAngle = outerAngle + Math.PI / 4;
      ctx.lineTo(Math.cos(outerAngle) * radius, Math.sin(outerAngle) * radius);
      ctx.lineTo(Math.cos(innerAngle) * inner, Math.sin(innerAngle) * inner);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function renderSparkles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.alpha += p.alphaSpeed;

      if (p.alpha >= 1) {
        p.alpha = 1;
        p.alphaSpeed = -Math.abs(p.alphaSpeed);
      } else if (p.alpha <= 0.15) {
        p.alpha = 0.15;
        p.alphaSpeed = Math.abs(p.alphaSpeed);
      }

      if (p.y < -20) p.y = height + 20;
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      if (p.isStar) {
        drawFourPointStar(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
      } else {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const b = burstParticles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.05;
      b.rotation += b.rotSpeed;
      b.alpha -= b.decay;

      if (b.alpha <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }

      if (b.isStar) {
        drawFourPointStar(ctx, b.x, b.y, b.size, b.rotation, b.color, b.alpha);
      } else {
        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    requestAnimationFrame(renderSparkles);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('pointermove', (e) => {
    if (Math.random() < 0.45) {
      spawnTrailSparkle(e.clientX, e.clientY, 1);
    }
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0] && Math.random() < 0.4) {
      spawnTrailSparkle(e.touches[0].clientX, e.touches[0].clientY, 1);
    }
  }, { passive: true });

  // ==========================================================================
  // 2. MÚSICA: "HOY ES TU CUMPLEAÑOS - PLIM PLIM" (VERSIÓN TONITO / CAJITA MUSICAL)
  // ==========================================================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let melodyTimer = null;
  const customAudio = document.getElementById('bg-music-audio');
  const musicBtn = document.getElementById('music-toggle-btn');

  // Frecuencias de notas musicales (Hz)
  const N = {
    REST: 0,
    G3: 196.00, C4: 261.63, F4: 349.23,
    G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
    C6: 1046.50
  };

  // Melodía completa de "Hoy es tu cumpleaños" de Plim Plim en versión tonito / cajita musical:
  // Parte A: "Hoy es tu cumpleaños, feliz cumpleaños, ya diste la vuelta a la ronda del sol"
  // Parte B: "Porque hoy es tu cumpleaños, feliz cumpleaños, otra velita vas a soplar, festejamos un año más"
  const MELODY_NOTES = [
    // --- Frase 1: "Hoy es tu cum-ple-a-ños" (Sol Sol La Sol Do' Si) ---
    { f: N.G4, d: 0.28 },
    { f: N.G4, d: 0.20 },
    { f: N.A4, d: 0.45, b: N.C4 },
    { f: N.G4, d: 0.45, b: N.E5 * 0.5 },
    { f: N.C5, d: 0.45, b: N.C4 },
    { f: N.B4, d: 0.80, b: N.G3 },

    // --- Frase 2: "Fe-liz cum-ple-a-ños" (Sol Sol La Sol Re' Do') ---
    { f: N.G4, d: 0.28 },
    { f: N.G4, d: 0.20 },
    { f: N.A4, d: 0.45, b: N.G3 },
    { f: N.G4, d: 0.45, b: N.B4 * 0.5 },
    { f: N.D5, d: 0.45, b: N.G3 },
    { f: N.C5, d: 0.80, b: N.C4 },

    // --- Frase 3: "Ya dis-te la vuel-ta..." (Sol Sol Sol' Mi' Do' Si La) ---
    { f: N.G4, d: 0.28 },
    { f: N.G4, d: 0.20 },
    { f: N.G5, d: 0.45, b: N.C4 },
    { f: N.E5, d: 0.45, b: N.G4 },
    { f: N.C5, d: 0.42, b: N.C4 },
    { f: N.B4, d: 0.42 },
    { f: N.A4, d: 0.75, b: N.F4 },

    // --- Frase 4: "...a la ron-da del sol" (Fa' Fa' Mi' Do' Re' Do') ---
    { f: N.F5, d: 0.28 },
    { f: N.F5, d: 0.20 },
    { f: N.E5, d: 0.45, b: N.C4 },
    { f: N.C5, d: 0.45, b: N.G4 },
    { f: N.D5, d: 0.48, b: N.G3 },
    { f: N.C5, d: 0.90, b: N.C4 },

    // --- Parte B festiva: "Por-que hoy es tu cum-ple-a-ños, ¡fe-liz cum-ple-a-ños!" ---
    { f: N.E5, d: 0.26, b: N.C4 },
    { f: N.E5, d: 0.26 },
    { f: N.D5, d: 0.26 },
    { f: N.C5, d: 0.26, b: N.G4 },
    { f: N.D5, d: 0.35 },
    { f: N.E5, d: 0.35, b: N.C4 },
    { f: N.C5, d: 0.55 },

    { f: N.D5, d: 0.28, b: N.G3 },
    { f: N.D5, d: 0.28 },
    { f: N.E5, d: 0.30 },
    { f: N.F5, d: 0.35, b: N.G4 },
    { f: N.D5, d: 0.50 },
    { f: N.B4, d: 0.45, b: N.G3 },

    // --- "O-tra ve-li-ta vas a so-plar, fes-te-ja-mos un a-ño más" ---
    { f: N.C5, d: 0.26, b: N.F4 },
    { f: N.D5, d: 0.26 },
    { f: N.E5, d: 0.26 },
    { f: N.F5, d: 0.32, b: N.F4 },
    { f: N.F5, d: 0.32 },
    { f: N.E5, d: 0.32, b: N.C4 },
    { f: N.D5, d: 0.32 },
    { f: N.C5, d: 0.50 },

    { f: N.B4, d: 0.28, b: N.G3 },
    { f: N.C5, d: 0.28 },
    { f: N.D5, d: 0.35 },
    { f: N.E5, d: 0.42, b: N.G4 },
    { f: N.D5, d: 0.42, b: N.G3 },
    { f: N.C5, d: 0.75, b: N.C4 },

    // --- Destello final de cajita musical ("¡A soplar!") ---
    { f: N.E5, d: 0.20 },
    { f: N.G5, d: 0.20 },
    { f: N.C6, d: 0.65, b: N.C4 },
    { f: N.REST, d: 0.45 }
  ];
  let noteIndex = 0;

  function playMusicBoxNote(freq, duration, bassFreq) {
    if (!audioCtx || !isPlayingMusic) return;
    const now = audioCtx.currentTime;

    if (freq > 0) {
      // Voz principal: timbre cristalino de cajita musical / celesta ("tonito")
      const oscMain = audioCtx.createOscillator();
      const oscHarm = audioCtx.createOscillator();
      const oscBell = audioCtx.createOscillator();
      const gainMain = audioCtx.createGain();
      const gainBell = audioCtx.createGain();

      oscMain.type = 'sine';
      oscHarm.type = 'triangle';
      oscBell.type = 'sine';

      oscMain.frequency.setValueAtTime(freq, now);
      oscHarm.frequency.setValueAtTime(freq * 2, now);
      oscBell.frequency.setValueAtTime(freq * 3, now);

      gainMain.gain.setValueAtTime(0.0001, now);
      gainMain.gain.linearRampToValueAtTime(0.085, now + 0.015);
      gainMain.gain.exponentialRampToValueAtTime(0.0008, now + duration * 1.65);

      gainBell.gain.setValueAtTime(0.0001, now);
      gainBell.gain.linearRampToValueAtTime(0.022, now + 0.008);
      gainBell.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      oscMain.connect(gainMain);
      oscHarm.connect(gainMain);
      oscBell.connect(gainBell);

      gainMain.connect(audioCtx.destination);
      gainBell.connect(audioCtx.destination);

      oscMain.start(now);
      oscHarm.start(now);
      oscBell.start(now);

      oscMain.stop(now + duration * 1.7);
      oscHarm.stop(now + duration * 1.7);
      oscBell.stop(now + 0.16);
    }

    // Acompañamiento suave de cajita musical en el bajo
    if (bassFreq && bassFreq > 0) {
      const bassOsc = audioCtx.createOscillator();
      const bassGain = audioCtx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(0.0001, now);
      bassGain.gain.linearRampToValueAtTime(0.038, now + 0.02);
      bassGain.gain.exponentialRampToValueAtTime(0.0005, now + duration * 1.8);

      bassOsc.connect(bassGain);
      bassGain.connect(audioCtx.destination);

      bassOsc.start(now);
      bassOsc.stop(now + duration * 1.85);
    }
  }

  function scheduleNextNote() {
    if (!isPlayingMusic) return;
    const note = MELODY_NOTES[noteIndex % MELODY_NOTES.length];
    playMusicBoxNote(note.f, note.d, note.b);
    noteIndex++;
    melodyTimer = setTimeout(scheduleNextNote, note.d * 1000);
  }

  function startMusic() {
    if (isPlayingMusic) return;
    isPlayingMusic = true;
    if (musicBtn) musicBtn.classList.add('playing');
    updateMusicIcon();

    if (customAudio && customAudio.getAttribute('src')) {
      customAudio.play().catch(() => {
        startSynthMusic();
      });
    } else {
      startSynthMusic();
    }
  }

  function startSynthMusic() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    clearTimeout(melodyTimer);
    scheduleNextNote();
  }

  function stopMusic() {
    isPlayingMusic = false;
    if (musicBtn) musicBtn.classList.remove('playing');
    updateMusicIcon();
    clearTimeout(melodyTimer);
    if (customAudio) {
      customAudio.pause();
    }
  }

  function toggleMusic() {
    if (isPlayingMusic) {
      stopMusic();
    } else {
      startMusic();
    }
  }

  function updateMusicIcon() {
    const iconOn = document.getElementById('music-icon-on');
    const iconOff = document.getElementById('music-icon-off');
    if (iconOn && iconOff) {
      iconOn.style.display = isPlayingMusic ? 'block' : 'none';
      iconOff.style.display = isPlayingMusic ? 'none' : 'block';
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }

  // ==========================================================================
  // 3. TELÓN DE BIENVENIDA ("ABRIR INVITACIÓN")
  // ==========================================================================
  const welcomeOverlay = document.getElementById('welcome-overlay');
  const openInviteBtn = document.getElementById('open-invitation-btn');

  if (openInviteBtn && welcomeOverlay) {
    openInviteBtn.addEventListener('click', () => {
      welcomeOverlay.classList.add('hidden');
      triggerCelebrationBurst();
      startMusic();
    });
  }

  // ==========================================================================
  // 4. CUENTA REGRESIVA EN VIVO (SÁBADO 14 DE NOVIEMBRE - 4:00 PM)
  // ==========================================================================
  function updateCountdown() {
    const target = new Date(EVENT_CONFIG.eventDateISO).getTime();
    const now = Date.now();
    let diff = target - now;

    if (isNaN(target) || diff < 0) {
      diff = 0;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-mins');
    const elSecs = document.getElementById('cd-secs');

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(mins).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);

  // ==========================================================================
  // 5. MODAL DE SUGERENCIA DE REGALOS
  // ==========================================================================
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-open-modal');
      openModal(targetId);
      triggerCelebrationBurst();
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close-modal');
      closeModal(targetId);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });
  });

  // ==========================================================================
  // 6. ANIMACIÓN DE ENTRADA AL HACER SCROLL (INTERSECTION OBSERVER)
  // ==========================================================================
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
  }

  // Inicialización general
  resizeCanvas();
  initSparkles();
  renderSparkles();
  applyConfigToDOM();
  updateCountdown();
  initScrollReveal();
})();
