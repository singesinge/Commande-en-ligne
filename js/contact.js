/* Popup CONTACT global : injecté sur toutes les pages via le bouton .sh-contact-trigger */
(function () {
  if (document.getElementById('contactModal')) return;

  const modal = document.createElement('div');
  modal.className = 'sh-locator';
  modal.id = 'contactModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'contactTitle');
  modal.innerHTML = `
    <div class="sh-locator__backdrop" data-contact-close></div>
    <div class="sh-locator__card sh-card" role="document" style="max-width:560px;">
      <div class="sh-locator__head">
        <span class="sh-mono" style="font-size:11px;letter-spacing:.18em;color:var(--sh-mustard);">★ ON DISCUTE ?</span>
        <button type="button" class="sh-modal__close" data-contact-close aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="padding:26px 28px;">
        <h2 id="contactTitle" style="font-family:var(--sh-font-display);font-size:clamp(28px,3.4vw,40px);line-height:.95;margin:0;">UNE QUESTION ?<br/><span style="color:var(--sh-red)">ÉCRIS-NOUS.</span></h2>
        <p style="font-size:13px;color:var(--sh-text-muted);margin:10px 0 22px;">On répond vite — souvent dans l'heure pendant le service.</p>

        <div class="sh-contact-list">
          <a href="tel:+33478000000" class="sh-contact-item">
            <span class="sh-contact-item__icon"><i class="fa-solid fa-phone"></i></span>
            <span class="sh-contact-item__body">
              <span class="sh-mono" style="font-size:10px;letter-spacing:.16em;color:var(--sh-text-muted);">TÉLÉPHONE</span>
              <span class="sh-contact-item__v">+33 4 78 00 00 00</span>
            </span>
          </a>
          <a href="https://maps.google.com/?q=8+rue+d%27Alg%C3%A9rie+69001+Lyon" target="_blank" rel="noopener" class="sh-contact-item">
            <span class="sh-contact-item__icon"><i class="fa-solid fa-location-dot"></i></span>
            <span class="sh-contact-item__body">
              <span class="sh-mono" style="font-size:10px;letter-spacing:.16em;color:var(--sh-text-muted);">LE DINER</span>
              <span class="sh-contact-item__v">8 rue d'Algérie, 69001 Lyon</span>
              <span style="font-size:11px;color:var(--sh-text-muted);">11h30 → 23h00 · tous les jours</span>
            </span>
          </a>
        </div>

        <div style="margin-top:18px;">
          <span class="sh-mono" style="font-size:10px;letter-spacing:.16em;color:var(--sh-text-muted);">SUIS-NOUS</span>
          <div class="sh-contact-socials">
            <a href="https://instagram.com/stackhouse.diner" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://tiktok.com/@stackhouse" target="_blank" rel="noopener" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="https://facebook.com/stackhouse" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://twitter.com/stackhouse" target="_blank" rel="noopener" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  function openContact() { modal.classList.add('is-open'); document.body.classList.add('sh-locked'); }
  function closeContact() { modal.classList.remove('is-open'); document.body.classList.remove('sh-locked'); }

  modal.querySelectorAll('[data-contact-close]').forEach(el => el.addEventListener('click', closeContact));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeContact(); });

  document.querySelectorAll('.sh-contact-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openContact(); });
  });
})();
