document.getElementById('btn-alert').addEventListener('click', function () {
  alert('Ceci est une alerte simple.');
  document.getElementById('result').textContent = 'Alerte affichée puis fermée.';
});

document.getElementById('btn-confirm').addEventListener('click', function () {
  var ok = confirm('Confirmez-vous cette action ?');
  document.getElementById('result').textContent = ok ? 'Confirmé' : 'Annulé';
});

document.getElementById('btn-prompt').addEventListener('click', function () {
  var value = prompt('Entrez une valeur :');
  document.getElementById('result').textContent = value === null ? 'Annulé' : 'Valeur saisie : ' + value;
});
