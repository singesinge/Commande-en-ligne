/* ─────────────────────────────────────────────────────────
   STACK HOUSE — Configurateur burger
   Gère les 4 étapes, la preview live, et l'ajout au panier.
   ───────────────────────────────────────────────────────── */

(function () {
  const MAX_MEATS = 3;

  // ── Référentiels ingrédients
  const BUN_LABELS = {
    sesame:   { label: 'THE SESAME',   topBg: 'var(--sh-mustard)',      botBg: 'var(--sh-mustard-deep)' },
    bao:      { label: 'THE BAO',      topBg: 'var(--sh-cream)',        botBg: 'var(--sh-cream-2)' },
    brioche:  { label: 'THE BRIOCHE',  topBg: 'var(--sh-mustard)',      botBg: 'var(--sh-mustard-deep)' },
    charcoal: { label: 'THE CHARCOAL', topBg: 'var(--sh-ink-2)',        botBg: 'var(--sh-ink)' },
    potatoe:  { label: 'THE POTATOE',  topBg: 'var(--sh-mustard-deep)', botBg: 'var(--sh-mustard-deep)' },
    salad:    { label: 'THE SALAD',    topBg: 'var(--sh-pickle)',       botBg: 'var(--sh-pickle)' }
  };
  const MEAT_LABELS = {
    'boeuf-150':     { label: 'BŒUF 150G',     bg: 'var(--sh-ink-2)',        h: 18 },
    'boeuf-100':     { label: 'BŒUF 100G',     bg: 'var(--sh-ink-2)',        h: 14 },
    'poulet-pane':   { label: 'POULET PANÉ',   bg: 'var(--sh-mustard-deep)', h: 16 },
    'poulet-grille': { label: 'POULET GRILLÉ', bg: 'var(--sh-mustard-deep)', h: 16 },
    'vege':          { label: 'STEAK VÉGÉ',    bg: 'var(--sh-pickle)',       h: 16 },
    'poisson':       { label: 'POISSON PANÉ',  bg: 'var(--sh-cream-2)',      h: 16 }
  };
  const TOP_LABELS = {
    cheddar:     { label: 'CHEDDAR',      bg: 'var(--sh-mustard)',      h: 10 },
    bacon:       { label: 'BACON',        bg: 'var(--sh-red-deep)',     h: 8 },
    salade:      { label: 'SALADE',       bg: 'var(--sh-pickle)',       h: 10 },
    tomate:      { label: 'TOMATE',       bg: 'var(--sh-red-deep)',     h: 8 },
    oignonfrit:  { label: 'OIGNON FRIT',  bg: 'var(--sh-mustard-deep)', h: 10 },
    oignonrouge: { label: 'OIGNON ROUGE', bg: 'var(--sh-red)',          h: 8 },
    pickles:     { label: 'PICKLES',      bg: 'var(--sh-pickle)',       h: 8 },
    jalapenos:   { label: 'JALAPEÑOS',    bg: 'var(--sh-pickle)',       h: 8 },
    oeuf:        { label: 'ŒUF MIROIR',   bg: 'var(--sh-mustard)',      h: 10 },
    champignons: { label: 'CHAMPIGNONS',  bg: 'var(--sh-ink-2)',        h: 8 },
    guacamole:   { label: 'GUACAMOLE',    bg: 'var(--sh-pickle)',       h: 8 },
    ananas:      { label: 'ANANAS',       bg: 'var(--sh-mustard)',      h: 8 }
  };
  const SAUCE_LABELS = {
    maison: 'MAISON', neon: 'NEON', bbq: 'BBQ FUMÉE', buffalo: 'BUFFALO',
    aioli: 'AÏOLI', moutarde: 'MOUTARDE', tartare: 'TARTARE', vegan: 'VEGAN'
  };

  // ── État
  const state = {
    step: 1,
    bun: 'sesame',
    meats: {},     // { id: qty }
    toppings: {},  // { id: qty }
    sauce: 'maison',
    name: 'STACK #047'
  };

  // ── Helpers DOM
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function meatTotal() {
    return Object.values(state.meats).reduce((s, v) => s + v, 0);
  }

  // ── Stepper
  function updateStepper() {
    $$('.sh-cfg__step').forEach((el) => {
      const n = Number(el.dataset.step);
      el.classList.remove('active', 'done');
      if (n < state.step) el.classList.add('done');
      else if (n === state.step) el.classList.add('active');
    });
    $$('.sh-cfg__bar').forEach((el, i) => {
      el.classList.toggle('done', (i + 1) < state.step);
    });
    $$('.sh-cfg__panel').forEach((p) => {
      p.hidden = Number(p.dataset.panel) !== state.step;
    });
    const headlines = {
      1: ["ON COMMENCE PAR LE PAIN.",  "Choisis ta base. Tu pourras toujours revenir en arrière, rien n'est figé."],
      2: ["LA PROTÉINE.",              "Jusqu'à 3 items — solo, double, triple, même répétée."],
      3: ["GARNIS LIBREMENT.",         "Clique pour ajouter, double-clic pour +2."],
      4: ["DERNIÈRE ÉTAPE.",           "Sauce, nom, et c'est plié. Ton burger entre dans le carnet de la maison."]
    };
    $('#previewHeadline').textContent = headlines[state.step][0];
    $('#previewSub').textContent      = headlines[state.step][1];
    const notes = {
      1: "ÉTAPE 1/4 · APPUIE ENTRÉE POUR CONTINUER",
      2: "ÉTAPE 2/4 · MAX 3 ITEMS · CLIC DROIT POUR RETIRER",
      3: "ÉTAPE 3/4 · CLIC = +1 · DOUBLE-CLIC = +2",
      4: "ÉTAPE 4/4 · TU PEUX ENCORE TOUT MODIFIER"
    };
    $('#footNote').textContent = notes[state.step];

    $('#prevBtn').style.display = state.step > 1 ? '' : 'none';
    $('#nextBtn').innerHTML = state.step === 4
      ? 'AJOUTER AU PANIER <i class="fa-solid fa-arrow-right"></i>'
      : 'CONTINUER <i class="fa-solid fa-arrow-right"></i>';

    if (state.step === 4) renderFinalRecap();
  }

  // ── Rendu compteur (l'aperçu visuel est désormais une image statique)
  function renderStack() {
    const layers = computeLayers();
    const ings = meatTotal() + Object.values(state.toppings).reduce((s, v) => s + v, 0) + 1; // +1 sauce
    const layersCount = layers.length;
    $('#sumLayers').textContent = layersCount;
    $('#sumLayersPlural').textContent = layersCount > 1 ? 's' : '';
    $('#sumIngs').textContent = ings;
    $('#sumIngsPlural').textContent = ings > 1 ? 's' : '';
    $('#sumName').textContent = state.step === 4 ? '« ' + (state.name || 'STACK #047') + ' »' : 'STACK #047';
  }

  function computeLayers() {
    const layers = [];
    const bun = BUN_LABELS[state.bun] || BUN_LABELS.sesame;
    layers.push({ h: 28, bg: bun.topBg, label: 'BUN — ' + bun.label });

    if (state.step === 4 && state.sauce) {
      layers.push({ h: 6, bg: state.sauce === 'neon' ? 'var(--sh-neon-pink)' : 'var(--sh-red)', label: 'SAUCE ' + SAUCE_LABELS[state.sauce] });
    }

    Object.entries(state.toppings).forEach(([id, qty]) => {
      const t = TOP_LABELS[id];
      for (let i = 0; i < qty; i++) layers.push({ h: t.h, bg: t.bg, label: t.label });
    });
    Object.entries(state.meats).forEach(([id, qty]) => {
      const m = MEAT_LABELS[id];
      for (let i = 0; i < qty; i++) layers.push({ h: m.h, bg: m.bg, label: m.label });
    });

    layers.push({ h: 28, bg: bun.botBg, label: 'BUN BASE' });
    return layers;
  }

  // ── Step 1 · Pain
  $$('#bunGrid .sh-bun').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#bunGrid .sh-bun').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      state.bun = btn.dataset.bun;
      renderStack();
    });
  });

  // ── Step 2 · Protéine — cap à 3 items, multi-qty
  function refreshMeatUI() {
    const total = meatTotal();
    const reached = total >= MAX_MEATS;

    $$('#meatGrid .sh-ing').forEach((btn) => {
      const id = btn.dataset.meat;
      const qty = state.meats[id] || 0;
      btn.classList.toggle('is-selected', qty > 0);
      btn.classList.toggle('is-disabled', reached && qty === 0);

      const badge = btn.querySelector('[data-qty]');
      const valEl = btn.querySelector('[data-qty-value]');
      if (badge && valEl) {
        badge.hidden = qty === 0;
        valEl.textContent = qty;
      }
    });

    const chip = $('#meatCountChip');
    if (chip) chip.textContent = `★ ${total}/${MAX_MEATS} PROTÉINE${total > 1 ? 'S' : ''}` + (reached ? ' · MAX ATTEINT' : ' · CLIQUE POUR AJOUTER');
  }

  $$('#meatGrid .sh-ing').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.meat;
      const total = meatTotal();
      if (total >= MAX_MEATS) return;
      state.meats[id] = (state.meats[id] || 0) + 1;
      refreshMeatUI();
      renderStack();
    });
    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const id = btn.dataset.meat;
      const cur = state.meats[id] || 0;
      if (cur <= 1) delete state.meats[id];
      else state.meats[id] = cur - 1;
      refreshMeatUI();
      renderStack();
    });
  });

  // ── Step 3 · Garnitures (clic = toggle, double-clic = +2)
  function updateTopCount() {
    const total = Object.values(state.toppings).reduce((s, v) => s + v, 0);
    const el = document.getElementById('topCountChip');
    if (el) el.textContent = `★ ${total} GARNITURE${total > 1 ? 'S' : ''} · TOUT COMPRIS`;
  }
  $$('#topGrid .sh-ing').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.top;
      if (state.toppings[id]) { delete state.toppings[id]; btn.classList.remove('is-selected'); }
      else { state.toppings[id] = 1; btn.classList.add('is-selected'); }
      updateTopCount(); renderStack();
    });
    btn.addEventListener('dblclick', () => {
      const id = btn.dataset.top;
      state.toppings[id] = (state.toppings[id] || 0) + 2;
      btn.classList.add('is-selected');
      updateTopCount(); renderStack();
    });
  });

  // ── Step 4 · Sauce & nom
  $$('#sauceGrid .sh-sauce').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#sauceGrid .sh-sauce').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.sauce = btn.dataset.sauce;
      renderStack();
    });
  });
  const burgerNameInput = $('#burgerName');
  if (burgerNameInput) {
    burgerNameInput.addEventListener('input', (e) => {
      state.name = e.target.value.trim() || 'STACK #047';
      renderStack();
    });
  }
  $$('[data-namesuggest]').forEach((c) => {
    c.addEventListener('click', () => {
      const n = c.dataset.namesuggest;
      if (burgerNameInput) burgerNameInput.value = n;
      state.name = n;
      renderStack();
    });
  });

  function renderFinalRecap() {
    const meatsTxt = Object.entries(state.meats).map(([k, q]) => `${MEAT_LABELS[k].label} ×${q}`).join(' · ') || '—';
    const cheeses = ['cheddar'].filter(k => state.toppings[k]).map(k => `${TOP_LABELS[k].label} ×${state.toppings[k]}`).join(' · ') || '—';
    const veg = ['salade', 'tomate', 'oignonrouge', 'pickles', 'oeuf', 'champignons', 'guacamole', 'ananas']
      .filter(k => state.toppings[k]).map(k => TOP_LABELS[k].label).join(' · ') || '—';
    const crisp = ['bacon', 'oignonfrit', 'jalapenos']
      .filter(k => state.toppings[k]).map(k => TOP_LABELS[k].label).join(' · ') || '—';
    const sauceTxt = SAUCE_LABELS[state.sauce] + (state.sauce === 'neon' ? ' (épicé)' : '');
    const rows = [
      ['PAIN', BUN_LABELS[state.bun].label],
      ['PROTÉINE', meatsTxt],
      ['FROMAGES', cheeses],
      ['LÉGUMES', veg],
      ['CROQUANT', crisp],
      ['SAUCE', sauceTxt]
    ];
    $('#finalRecap').innerHTML = rows.map(([k, v]) => `
      <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed var(--sh-border-soft);">
        <span class="sh-mono" style="font-size:10px;letter-spacing:.12em;color:var(--sh-text-muted);">${k}</span>
        <span style="font-weight:500;text-align:right;max-width:60%;">${v}</span>
      </div>`).join('');
  }

  // ── Navigation
  $('#nextBtn').addEventListener('click', () => {
    if (state.step < 4) {
      state.step += 1;
      updateStepper();
      renderStack();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      addToCartAndGo();
    }
  });
  $('#prevBtn').addEventListener('click', () => {
    if (state.step > 1) { state.step -= 1; updateStepper(); renderStack(); }
  });
  $('#editBtn')?.addEventListener('click', () => {
    state.step = 1; updateStepper(); renderStack();
  });

  function addToCartAndGo() {
    const layers = computeLayers();
    const ingredients = layers.slice(1, -1).map(l => l.label).join(' · ');
    const item = {
      id: Date.now(),
      name: '« ' + (state.name || 'STACK #047') + ' »',
      desc: ingredients,
      price: 14.90,
      qty: 1,
      mods: [],
      kind: 'burger'
    };
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('sh.cart') || '[]'); } catch (e) {}
    cart.push(item);
    localStorage.setItem('sh.cart', JSON.stringify(cart));
    window.location.href = 'panier.html';
  }

  // ── Init
  updateStepper();
  renderStack();
  refreshMeatUI();
  updateTopCount();
})();
