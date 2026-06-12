const hero = document.querySelector(".hero");
const video = document.querySelector(".hero-video");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let ticking = false;

function updateHeroParallax() {
  if (!hero || !video || reduceMotion.matches) return;

  const rect = hero.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height + viewportHeight)));
  const offset = progress * 92;

  hero.style.setProperty("--hero-parallax", `${offset}px`);
  ticking = false;
}

function requestHeroParallax() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateHeroParallax);
}

updateHeroParallax();
window.addEventListener("scroll", requestHeroParallax, { passive: true });
window.addEventListener("resize", requestHeroParallax);

if (video) {
  const playHeroVideo = () => {
    video.muted = true;
    video.play().catch(() => {});
  };

  playHeroVideo();
  video.addEventListener("canplay", playHeroVideo, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) playHeroVideo();
  });
}
