/* Met à jour le badge panier de la navbar depuis localStorage. */
(function () {
  try {
    const raw = localStorage.getItem('sh.cart');
    if (!raw) return;
    const cart = JSON.parse(raw);
    const count = cart.reduce((sum, l) => sum + (l.qty || 1), 0);
    const el = document.getElementById('cartCount');
    if (el && count > 0) el.textContent = count;
  } catch (e) { /* ignore */ }
})();
