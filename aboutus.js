document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('.lux-section');
  if (!sections.length) return;
  if (!('IntersectionObserver' in window)) {
    sections.forEach(s => s.classList.add('lux-inview'));
    return;
  }
  const luxObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('lux-inview');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  sections.forEach(s => luxObserver.observe(s));
});
