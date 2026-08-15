/* ==========================================================================
   For Safalta 💖 — script.js
   Vanilla JS only. No frameworks, no build step.
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ------------------------------------------------------------------ *
   * 0. FORCE START AT THE TOP
   *
   *    Mobile browsers sometimes restore the last scroll position on
   *    reload, or jump straight to a URL fragment (e.g. from the dot
   *    nav, which used plain <a href="#section"> links). Combined with
   *    the hero's scroll lock, that can strand a visitor mid-page with
   *    no way to scroll back up to "Open My Heart". This runs
   *    immediately — before anything else — to guarantee the hero is
   *    what's on screen when the page loads.
   * ------------------------------------------------------------------ */
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function forceScrollTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  // Drop any "#section" fragment from the URL so neither this load nor a
  // future reload auto-jumps past the hero.
  if (location.hash) {
    history.replaceState(null, "", location.pathname + location.search);
  }

  forceScrollTop();
  window.addEventListener("load", forceScrollTop);

  /* ------------------------------------------------------------------ *
   * 1. LOADING SCREEN
   * ------------------------------------------------------------------ */
  function initLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    const fill = document.getElementById("loader-fill");
    if (!loadingScreen || !fill) return;

    let progress = 0;
    const tick = () => {
      // ease toward 100 so the bar feels alive, not linear
      progress += (100 - progress) * 0.12 + 1.2;
      if (progress > 100) progress = 100;
      fill.style.width = progress + "%";
      if (progress < 100) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);

    const finish = () => {
      loadingScreen.classList.add("is-hidden");
    };

    // Hide once the page has loaded, with a small minimum delay so the
    // animation is actually seen rather than flashing by instantly.
    const minDelay = new Promise((res) => setTimeout(res, 1600));
    const pageReady = new Promise((res) => {
      if (document.readyState === "complete") res();
      else window.addEventListener("load", res, { once: true });
    });

    Promise.all([minDelay, pageReady]).then(finish);
  }

  /* ------------------------------------------------------------------ *
   * 2. AMBIENT BACKGROUND — floating hearts + glowing particles
   * ------------------------------------------------------------------ */
  function initAmbientCanvas() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width, height, dpr;
    let particles = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticle() {
      const isHeart = Math.random() < 0.45;
      return {
        x: Math.random() * width,
        y: height + Math.random() * 200,
        size: isHeart ? 8 + Math.random() * 14 : 1.5 + Math.random() * 2.5,
        speed: 0.25 + Math.random() * 0.55,
        drift: Math.random() * 1.2 - 0.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.005 + Math.random() * 0.015,
        opacity: 0.15 + Math.random() * 0.35,
        isHeart,
        hue: Math.random() < 0.5 ? "pink" : "lavender",
      };
    }

    function initParticles() {
      const count = width < 640 ? 16 : 28;
      particles = Array.from({ length: count }, makeParticle);
    }

    function drawHeart(p) {
      const s = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s / 2, -s / 3, -s, s / 6, 0, s);
      ctx.bezierCurveTo(s, s / 6, s / 2, -s / 3, 0, s * 0.3);
      ctx.fillStyle = p.hue === "pink" ? "#e88fb8" : "#b79fe0";
      ctx.fill();
      ctx.restore();
    }

    function drawParticle(p) {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size * 3
      );
      const color = p.hue === "pink" ? "240,207,142" : "212,106,159";
      gradient.addColorStop(0, `rgba(${color},0.9)`);
      gradient.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 0.4 + p.drift * 0.05;

        if (p.y < -40) {
          Object.assign(p, makeParticle(), { y: height + 20 });
        }

        if (p.isHeart) drawHeart(p);
        else drawParticle(p);
      }
      raf = requestAnimationFrame(step);
    }

    let raf;
    resize();
    initParticles();

    if (!prefersReducedMotion) {
      raf = requestAnimationFrame(step);
    } else {
      // draw a single static, gentle frame for reduced-motion users
      stepOnce();
    }

    function stepOnce() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (p.isHeart) drawHeart(p);
        else drawParticle(p);
      }
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initParticles();
        if (prefersReducedMotion) stepOnce();
      }, 200);
    });
  }

  /* ------------------------------------------------------------------ *
   * 3. HERO LOCK + CINEMATIC "OPEN MY HEART" TRANSITION
   *
   *    On load, scrolling is fully disabled (html/body get .is-locked)
   *    so the hero is the only thing visible. Pressing the button plays
   *    a fade + blur + floating-hearts-burst transition, then unlocks
   *    scrolling and reveals the Welcome section.
   * ------------------------------------------------------------------ */
  function initCinematicOpen() {
    const btn = document.getElementById("open-heart-btn");
    const hero = document.getElementById("hero");
    const welcome = document.getElementById("welcome");
    const overlay = document.getElementById("transition-overlay");
    const heartsLayer = document.getElementById("transition-hearts");
    const dotNav = document.getElementById("dot-nav");

    if (!btn || !hero || !welcome || !overlay) return;

    function spawnBurstHearts() {
      if (!heartsLayer) return;
      heartsLayer.innerHTML = "";
      const emojis = ["💗", "💖", "💕", "🤍", "✨"];
      const count = prefersReducedMotion ? 0 : 22;

      for (let i = 0; i < count; i++) {
        const span = document.createElement("span");
        span.className = "transition-heart";
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.setProperty("--x", Math.random() * 100 + "%");
        span.style.setProperty("--tx", (Math.random() * 160 - 80) + "px");
        span.style.setProperty("--rot", (Math.random() * 50 - 25) + "deg");
        span.style.setProperty("--size", (1 + Math.random() * 1.4) + "rem");
        span.style.setProperty("--d", (1.8 + Math.random() * 1.4) + "s");
        span.style.setProperty("--delay", (Math.random() * 0.6) + "s");
        heartsLayer.appendChild(span);
      }
    }

    function unlockScrolling() {
      document.documentElement.classList.remove("is-locked");
      document.body.classList.remove("is-locked");
      if (dotNav) dotNav.classList.add("is-visible");
    }

    function openExperience() {
      if (btn.disabled) return; // prevent double-triggering
      btn.disabled = true;

      // Step 1 — fade & blur the hero out
      hero.classList.add("is-opening");

      // Step 2 — bring in the cinematic overlay: glow + heart burst
      spawnBurstHearts();
      requestAnimationFrame(() => overlay.classList.add("is-active"));

      const revealDelay = prefersReducedMotion ? 200 : 900;
      const fadeOutDelay = prefersReducedMotion ? 400 : 1500;
      const cleanupDelay = prefersReducedMotion ? 600 : 2500;

      // Step 3 — once the glow has peaked, unlock scrolling and move to
      // the Welcome section while the overlay still covers the jump
      setTimeout(() => {
        unlockScrolling();
        welcome.scrollIntoView({ behavior: "auto", block: "start" });
      }, revealDelay);

      // Step 4 — let the overlay dissolve, revealing Welcome underneath
      setTimeout(() => {
        overlay.classList.remove("is-active");
        overlay.classList.add("is-fading");
      }, fadeOutDelay);

      // Step 5 — cleanup: remove the overlay classes & burst hearts so
      // everything is reset if the visitor scrolls back up to the hero
      setTimeout(() => {
        overlay.classList.remove("is-fading");
        if (heartsLayer) heartsLayer.innerHTML = "";
        hero.classList.remove("is-opening");
      }, cleanupDelay);
    }

    btn.addEventListener("click", openExperience);
  }

  /* ------------------------------------------------------------------ *
   * 4. DOT NAVIGATION — highlight active section, click to scroll
   *
   *    Navigation happens via scrollIntoView, not native anchor jumps,
   *    so clicking a dot never writes a "#section" fragment into the
   *    URL (which is what caused the scroll-trap bug above).
   * ------------------------------------------------------------------ */
  function initDotNav() {
    const dots = document.querySelectorAll(".dot-nav__dot");
    const sections = Array.from(dots)
      .map((d) => document.querySelector(d.getAttribute("href")))
      .filter(Boolean);

    if (!dots.length || !sections.length) return;

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(dot.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            dots.forEach((dot) =>
              dot.classList.toggle(
                "is-active",
                dot.getAttribute("href") === id
              )
            );
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ------------------------------------------------------------------ *
   * 5. VOICE MESSAGE PLAYER — play/pause, progress bar, seek
   *    Does NOT autoplay. Only starts on user interaction.
   * ------------------------------------------------------------------ */
  function initMusicPlayer() {
    const audio = document.getElementById("birthday-audio");
    const playBtn = document.getElementById("play-btn");
    const iconPlay = document.getElementById("icon-play");
    const iconPause = document.getElementById("icon-pause");
    const art = document.getElementById("player-art");
    const progressBar = document.querySelector(".player__progress-bar");
    const progressFill = document.getElementById("progress-fill");
    const currentTimeEl = document.getElementById("current-time");
    const durationEl = document.getElementById("duration-time");

    if (!audio || !playBtn) return;

    function formatTime(seconds) {
      if (!isFinite(seconds)) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
      return `${m}:${s}`;
    }

    function setPlayingUI(isPlaying) {
      iconPlay.hidden = isPlaying;
      iconPause.hidden = !isPlaying;
      playBtn.setAttribute("aria-label", isPlaying ? "Pause voice message" : "Play voice message");
      art.classList.toggle("is-playing", isPlaying);
    }

    playBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {
          // If no audio file has been added yet, fail silently in the UI
          // but let the user know via the hint text.
          const hint = document.querySelector(".player__hint");
          if (hint) {
            hint.textContent =
              "Add your recording to assets/voice-message.mp3 to hear it play. 🎙️";
          }
        });
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", () => setPlayingUI(true));
    audio.addEventListener("pause", () => setPlayingUI(false));
    audio.addEventListener("ended", () => setPlayingUI(false));

    audio.addEventListener("loadedmetadata", () => {
      durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        progressFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    if (progressBar) {
      progressBar.addEventListener("click", (e) => {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * audio.duration;
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * 6. ENVELOPE — open to unfold the letter
   * ------------------------------------------------------------------ */
  function initEnvelope() {
    const envelope = document.getElementById("envelope");
    const letterPaper = document.getElementById("letter-paper");
    const hint = document.getElementById("envelope-hint");
    if (!envelope || !letterPaper) return;

    function openEnvelope() {
      envelope.classList.add("is-open");
      envelope.setAttribute("aria-expanded", "true");
      letterPaper.classList.add("is-visible");
      if (hint) hint.textContent = "with love 💌";

      // Gently scroll the unfolding letter into view
      setTimeout(() => {
        letterPaper.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center",
        });
      }, prefersReducedMotion ? 0 : 450);
    }

    envelope.addEventListener("click", () => {
      if (!envelope.classList.contains("is-open")) openEnvelope();
    });

    envelope.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !envelope.classList.contains("is-open")) {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * 7. REVEAL ON SCROLL — appreciation cards + generic .reveal elements
   * ------------------------------------------------------------------ */
  function initRevealOnScroll() {
    const targets = document.querySelectorAll(".card, .reveal");
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------ *
   * 8. MEMORY SKY — twinkling stars + softly rising glowing hearts
   * ------------------------------------------------------------------ */
  function initStarsCanvas() {
    const canvas = document.getElementById("stars-canvas");
    const section = document.getElementById("sky");
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");

    let width, height, stars, hearts;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = section.offsetWidth;
      height = section.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeStars() {
      const count = width < 640 ? 60 : 110;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.025,
      }));
    }

    function makeHearts() {
      const count = width < 640 ? 6 : 10;
      hearts = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: height + Math.random() * height,
        size: 6 + Math.random() * 10,
        speed: 0.12 + Math.random() * 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.006 + Math.random() * 0.01,
        opacity: 0.25 + Math.random() * 0.35,
      }));
    }

    function drawHeart(h) {
      const s = h.size;
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.globalAlpha = h.opacity;
      ctx.shadowColor = "rgba(240, 207, 142, 0.8)";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s / 2, -s / 3, -s, s / 6, 0, s);
      ctx.bezierCurveTo(s, s / 6, s / 2, -s / 3, 0, s * 0.3);
      ctx.fillStyle = "#f6d9ef";
      ctx.fill();
      ctx.restore();
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(s.phase + time * s.speed);
        ctx.globalAlpha = 0.25 + twinkle * 0.75;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff8ec";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const h of hearts) {
        h.y -= h.speed;
        h.wobble += h.wobbleSpeed;
        h.x += Math.sin(h.wobble) * 0.3;
        if (h.y < -20) {
          h.y = height + 20;
          h.x = Math.random() * width;
        }
        drawHeart(h);
      }
      ctx.shadowBlur = 0;

      if (!prefersReducedMotion) requestAnimationFrame(draw);
    }

    let visible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !visible) {
            visible = true;
            resize();
            makeStars();
            makeHearts();
            requestAnimationFrame(draw);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(section);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (visible) {
          resize();
          makeStars();
          makeHearts();
        }
      }, 200);
    });
  }

  /* ------------------------------------------------------------------ *
   * INIT — run everything once the DOM is ready
   * ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    forceScrollTop();
    document.documentElement.classList.add("is-locked");
    document.body.classList.add("is-locked");

    initLoadingScreen();
    initAmbientCanvas();
    initCinematicOpen();
    initDotNav();
    initMusicPlayer();
    initEnvelope();
    initRevealOnScroll();
    initStarsCanvas();
  });
})();
