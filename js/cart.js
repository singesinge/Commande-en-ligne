/* Panier : si on a un stack généré dans le configurateur, on l'ajoute en tête de la liste. */
(function () {
  // ── Stepper COUVERTS ────────────────────────────────────
  const couvertsLine = document.querySelector('[data-line-type="couverts"]');
  if (couvertsLine) {
    const qtyEl = couvertsLine.querySelector('[data-couverts-qty]');
    const priceEl = couvertsLine.querySelector('[data-couverts-price]');
    const summaryEl = document.querySelector('[data-summary-couverts]');
    const summaryLine = document.querySelector('[data-summary-couverts-line]');
    const unitPrice = 0.50;
    let qty = parseInt(qtyEl?.textContent || '2', 10);
    const render = () => {
      if (qtyEl) qtyEl.textContent = String(qty).padStart(2, '0');
      if (priceEl) priceEl.textContent = (qty * unitPrice).toFixed(2).replace('.', ',') + ' €';
      if (summaryEl) summaryEl.textContent = (qty * unitPrice).toFixed(2).replace('.', ',') + ' €';
      if (summaryLine) summaryLine.querySelector('.k').textContent = `Couverts bio × ${qty}`;
    };
    render();
    couvertsLine.querySelector('[data-couverts-plus]')?.addEventListener('click', () => { if (qty < 20) { qty++; render(); } });
    couvertsLine.querySelector('[data-couverts-minus]')?.addEventListener('click', () => { if (qty > 0) { qty--; render(); } });
    couvertsLine.querySelector('[data-couverts-remove]')?.addEventListener('click', () => {
      couvertsLine.remove();
      if (summaryLine) summaryLine.remove();
    });
  }

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('sh.cart') || '[]'); } catch (e) {}
  if (!cart.length) return;

  const list = document.getElementById('cartList');
  if (!list) return;

  // Génère une ligne pour chaque item personnalisé en tête
  cart.forEach((item) => {
    const line = document.createElement('article');
    line.className = 'sh-line';
    const total = (item.price * item.qty).toFixed(2).replace('.', ',');
    line.innerHTML = `
      <div class="sh-line__media">
        <img src="img/image.png" alt="${item.name}" />
      </div>
      <div class="sh-line__body">
        <h3 class="sh-line__title">${item.name} <span class="sh-chip sh-chip--neon" style="font-size:9px;">★ TON STACK</span></h3>
        <p class="sh-line__sub">${item.desc}</p>
        ${item.mods && item.mods.length ? `<div class="sh-line__mods">${item.mods.map(m => `<span class="sh-chip" style="font-size:10px;padding:2px 8px;">${m}</span>`).join('')}</div>` : ''}
        <div class="sh-line__actions">
          <button class="sh-btn sh-btn--ghost sh-btn--sm" style="padding:4px 10px;"><i class="fa-solid fa-pen"></i> MODIFIER</button>
          <button class="sh-btn sh-btn--ghost sh-btn--sm" style="padding:4px 10px;color:var(--sh-error);" data-remove="${item.id}"><i class="fa-regular fa-trash-can"></i> RETIRER</button>
        </div>
      </div>
      <div class="sh-line__qty">
        <div class="sh-stepper"><button><i class="fa-solid fa-minus"></i></button><span class="sh-stepper__value">${String(item.qty).padStart(2,'0')}</span><button><i class="fa-solid fa-plus"></i></button></div>
        <span class="sh-line__price">${total} €</span>
      </div>`;
    list.insertBefore(line, list.firstChild);
  });

  // Met à jour le compteur banner + nav
  const totalCount = cart.reduce((s, l) => s + (l.qty || 1), 0) + 3;
  const bannerCount = document.getElementById('bannerCount');
  if (bannerCount) bannerCount.textContent = totalCount;

  // Retirer un item
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (!btn) return;
    const id = Number(btn.dataset.remove);
    cart = cart.filter(it => it.id !== id);
    localStorage.setItem('sh.cart', JSON.stringify(cart));
    btn.closest('.sh-line').remove();
  });
})();
