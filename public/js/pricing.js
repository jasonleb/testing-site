(function () {
  var form = document.getElementById('pricing-form');
  var errorEl = document.getElementById('pricing-error');
  var resultEl = document.getElementById('pricing-result');

  function show(el) { el.classList.remove('hidden'); }
  function hide(el) { el.classList.add('hidden'); }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    hide(errorEl);
    hide(resultEl);

    var params = new URLSearchParams({
      age: document.getElementById('age').value,
      member: document.getElementById('member').checked ? 'true' : 'false',
    });

    fetch('/api/pricing?' + params.toString())
      .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
      .then(function (r) {
        if (!r.ok) {
          errorEl.textContent = r.body.error || 'Erreur inattendue.';
          show(errorEl);
          return;
        }
        document.getElementById('pricing-category').textContent = r.body.categoryLabel;
        document.getElementById('pricing-base').textContent = r.body.basePrice;
        document.getElementById('pricing-discount').textContent = r.body.discountPercent;
        document.getElementById('pricing-final').textContent = r.body.finalPrice;
        show(resultEl);
      })
      .catch(function () {
        errorEl.textContent = 'Le service de tarification est indisponible.';
        show(errorEl);
      });
  });
})();
