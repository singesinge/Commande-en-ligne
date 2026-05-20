/* Reveal-on-scroll : ajoute .is-visible aux éléments .sh-reveal quand ils entrent dans le viewport. */
(function () {
  const targets = document.querySelectorAll('.sh-reveal');
  if (!('IntersectionObserver' in window) || targets.length === 0) {
    targets.forEach(t => t.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
  targets.forEach(t => io.observe(t));
})();
