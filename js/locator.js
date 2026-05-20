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

  // Toggle mode livraison / click & collect (visuel uniquement)
  locator.querySelectorAll('.sh-mode button').forEach((btn) => {
    btn.addEventListener('click', () => {
      locator.querySelectorAll('.sh-mode button').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
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
    return !!m || /lyon\s*(1|2|3|6|7)/.test(s) || s.includes('mercière') || s.includes('perrache') || s.includes('bellecour');
  }

  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = (input && input.value.trim()) || '';
    if (!value) { input && input.focus(); return; }
    sessionStorage.setItem('sh.address', value);

    closeModal(locator);
    if (isZoneOk(value)) {
      if (okAddr) okAddr.textContent = value;
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
