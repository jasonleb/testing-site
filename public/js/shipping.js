(function () {
  var form = document.getElementById('shipping-form');
  var errorEl = document.getElementById('shipping-error');
  var resultEl = document.getElementById('shipping-result');
  var undeliverableEl = document.getElementById('shipping-undeliverable');
  var breakdownEl = document.getElementById('shipping-breakdown');

  function show(el) { el.classList.remove('hidden'); }
  function hide(el) { el.classList.add('hidden'); }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    hide(errorEl);
    hide(resultEl);

    var params = new URLSearchParams({
      amount: document.getElementById('amount').value,
      zone: document.getElementById('zone').value,
      premium: document.getElementById('premium').checked ? 'true' : 'false',
      bulky: document.getElementById('bulky').checked ? 'true' : 'false',
    });

    fetch('/api/shipping?' + params.toString())
      .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
      .then(function (r) {
        if (!r.ok) {
          errorEl.textContent = r.body.error || 'Erreur inattendue.';
          show(errorEl);
          return;
        }
        if (!r.body.deliverable) {
          undeliverableEl.textContent = r.body.message;
          show(undeliverableEl);
          hide(breakdownEl);
        } else {
          hide(undeliverableEl);
          document.getElementById('shipping-base').textContent = r.body.baseFee;
          document.getElementById('shipping-surcharge').textContent = r.body.bulkySurcharge;
          document.getElementById('shipping-total').textContent = r.body.total;
          show(breakdownEl);
        }
        show(resultEl);
      })
      .catch(function () {
        errorEl.textContent = 'Le service de livraison est indisponible.';
        show(errorEl);
      });
  });
})();
