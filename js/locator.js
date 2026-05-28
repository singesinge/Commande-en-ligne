/* Popup de localisation : modal d'adresse au chargement, puis OK ou KO. */
(function () {
  const locator = document.getElementById('locatorModal');
  const okModal = document.getElementById('zoneOkModal');
  const koModal = document.getElementById('zoneKoModal');
  if (!locator) return;

  const body = document.body;
  const input = locator.querySelector('#locatorAddress');
  const form = locator.querySelector('[data-locator-form]');
  const okAddr = okModal && okModal.querySelector('#zoneOkAddress');
  const koAddr = koModal && koModal.querySelector('#zoneKoAddress');

  function openModal(el) {
    el.classList.add('is-open');
    body.classList.add('sh-locked');
  }
  function closeModal(el) {
    if (el) el.classList.remove('is-open');
  }
  function closeAll() {
    [locator, okModal, koModal].forEach(closeModal);
    body.classList.remove('sh-locked');
  }

  // Au chargement : ouvre le locator sauf si déjà validé dans la session
  if (!sessionStorage.getItem('sh.locatorDismissed')) {
    openModal(locator);
    setTimeout(() => input && input.focus(), 200);
  }

  // Fermetures (X / backdrop / "continuer sur le site")
  document.querySelectorAll('[data-locator-close]').forEach((el) => {
    el.addEventListener('click', () => {
      sessionStorage.setItem('sh.locatorDismissed', '1');
      closeAll();
    });
  });
  document.querySelectorAll('[data-zone-close]').forEach((el) => {
    el.addEventListener('click', () => {
      sessionStorage.setItem('sh.locatorDismissed', '1');
      closeAll();
    });
  });

  // Bouton "Changer d'adresse" dans le modal KO : revient au locator
  document.querySelectorAll('[data-zone-retry]').forEach((el) => {
    el.addEventListener('click', () => {
      closeModal(koModal);
      openModal(locator);
      if (input) { input.value = ''; setTimeout(() => input.focus(), 100); }
    });
  });

  // Toggle mode livraison / click & collect
  const submitBtn = locator.querySelector('[data-locator-submit]');
  let currentMode = 'delivery';
  locator.querySelectorAll('.sh-mode button[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      locator.querySelectorAll('.sh-mode button').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentMode = btn.dataset.mode;
      locator.querySelectorAll('[data-mode-panel]').forEach((p) => {
        p.hidden = p.dataset.modePanel !== currentMode;
      });
      if (submitBtn) {
        submitBtn.innerHTML = currentMode === 'pickup'
          ? 'JE COMMANDE EN CLICK & COLLECT <i class="fa-solid fa-arrow-right"></i>'
          : 'CONTINUER <i class="fa-solid fa-arrow-right"></i>';
      }
    });
  });

  // Sélection d'une suggestion
  locator.querySelectorAll('.sh-locator__sugg').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (input) input.value = btn.dataset.sugg || '';
    });
  });

  // Soumission : on bascule vers OK ou KO
  function isZoneOk(addr) {
    const s = (addr || '').toLowerCase();
    // Heuristique simple : Lyon + arrondissements 1/2/3/6/7
    if (!/lyon/.test(s)) return false;
    const m = s.match(/690(0[12367]|[12367])/);
    return !!m || /lyon\s*(1|2|3|6|7)/.test(s) || s.includes('paul bert') || s.includes('perrache') || s.includes('bellecour') || s.includes('algérie');
  }

  function applyOkMode(mode) {
    if (!okModal) return;
    const banner = okModal.querySelector('[data-ok-banner]');
    const title = okModal.querySelector('[data-ok-title]');
    const lede = okModal.querySelector('[data-ok-lede]');
    const kicker = okModal.querySelector('[data-ok-kicker]');
    const headline = okModal.querySelector('[data-ok-headline]');
    const sub = okModal.querySelector('[data-ok-sub]');
    const icon = okModal.querySelector('[data-ok-icon] i');
    const rightDelivery = okModal.querySelector('[data-ok-right-delivery]');
    const rightPickup = okModal.querySelector('[data-ok-right-pickup]');

    if (mode === 'pickup') {
      if (banner) banner.textContent = '★ COMMANDE EN CLICK & COLLECT';
      if (title) title.innerHTML = 'PARFAIT.<br/><span style="color:var(--sh-red)">15 MIN</span><br/>ET C\'EST PRÊT.';
      if (lede) lede.innerHTML = 'Tu retires au diner : <b id="zoneOkAddress" style="color:var(--sh-ink)">8 rue d\'Algérie, 69001 Lyon</b>. On te ping dès que c\'est chaud.';
      if (kicker) kicker.textContent = 'CLICK & COLLECT';
      if (headline) headline.textContent = '15 MIN · 0 € DE FRAIS';
      if (sub) sub.textContent = 'M° Hôtel de Ville · ouvert jusqu\'à 23h00';
      if (icon) icon.className = 'fa-solid fa-shop';
      if (rightDelivery) rightDelivery.hidden = true;
      if (rightPickup) rightPickup.hidden = false;
    } else {
      if (banner) banner.textContent = '★ ZONE OK · ON LIVRE CHEZ TOI';
      if (title) title.innerHTML = 'PARFAIT.<br/><span style="color:var(--sh-red)">22 MIN</span><br/>ET T\'ES SERVI.';
      if (lede) lede.innerHTML = 'On t\'a localisé : <b id="zoneOkAddress" style="color:var(--sh-ink)">24 rue Paul Bert, 69003 Lyon</b>. Livraison estimée en 22 min — un livreur est dispo maintenant.';
      if (kicker) kicker.textContent = 'LIVRAISON';
      if (headline) headline.textContent = '22 MIN · GRATUITE DÈS 25 €';
      if (sub) sub.textContent = 'Shift ouvert jusqu\'à 22h45 · 2,90 € en dessous';
      if (icon) icon.className = 'fa-solid fa-truck-fast';
      if (rightDelivery) rightDelivery.hidden = false;
      if (rightPickup) rightPickup.hidden = true;
    }
  }

  form && form.addEventListener('submit', (e) => {
    e.preventDefault();

    // En mode Click & Collect : on bascule direct sur l'OK (adresse = resto)
    if (currentMode === 'pickup') {
      sessionStorage.setItem('sh.address', '8 rue d\'Algérie, 69001 Lyon');
      sessionStorage.setItem('sh.mode', 'pickup');
      closeModal(locator);
      applyOkMode('pickup');
      openModal(okModal);
      return;
    }

    const value = (input && input.value.trim()) || '';
    if (!value) { input && input.focus(); return; }
    sessionStorage.setItem('sh.address', value);
    sessionStorage.setItem('sh.mode', 'delivery');

    closeModal(locator);
    if (isZoneOk(value)) {
      applyOkMode('delivery');
      const refreshed = okModal.querySelector('#zoneOkAddress');
      if (refreshed) refreshed.textContent = value;
      openModal(okModal);
    } else {
      if (koAddr) koAddr.textContent = value;
      openModal(koModal);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if ([locator, okModal, koModal].some(m => m && m.classList.contains('is-open'))) {
      sessionStorage.setItem('sh.locatorDismissed', '1');
      closeAll();
    }
  });
})();
