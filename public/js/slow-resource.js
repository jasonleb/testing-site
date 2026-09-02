document.getElementById('load-data').addEventListener('click', function () {
  var result = document.getElementById('slow-data-result');
  result.textContent = 'Chargement…';
  fetch('/slow-resource/data')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      result.textContent = data.message;
    });
});
