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
  let hasActivated = false;

  const startHeroVideo = () => {
    if (hasActivated) return;
    hasActivated = true;

    hero?.classList.add("is-video-starting");
    hero?.classList.add("is-video-playing");

    video.muted = true;
    video.autoplay = true;
    video.setAttribute("playsinline", "true");
    video.play().catch(() => {});
  };

  if (!document.hidden) startHeroVideo();

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) startHeroVideo();
  });
}

function setupScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal-item");
  if (!revealItems.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  revealItems.forEach((container) => {
    const children = container.querySelectorAll(".work-card, .category-link");
    children.forEach((child, index) => {
      child.style.setProperty("--reveal-index", index.toString());
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -12% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

setupScrollReveal();
