/* ==========================================================================
   goodbye.html — starry night + floating glowing hearts
   A trimmed, self-contained copy of the Memory Sky canvas from script.js,
   since this page loads on its own (no other init needed here).
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function initStarsAndHearts() {
    const canvas = document.getElementById("stars-canvas");
    const section = document.getElementById("goodbye-section");
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");

    let width, height, stars, hearts;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
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

    resize();
    makeStars();
    makeHearts();
    requestAnimationFrame(draw);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        makeStars();
        makeHearts();
      }, 200);
    });
  }

  document.addEventListener("DOMContentLoaded", initStarsAndHearts);
})();
