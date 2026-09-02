document.getElementById('start-1').addEventListener('click', function () {
  var loading = document.getElementById('loading-1');
  var finish = document.getElementById('finish-1');
  finish.classList.add('hidden');
  loading.classList.remove('hidden');
  setTimeout(function () {
    loading.classList.add('hidden');
    finish.classList.remove('hidden');
  }, 3000);
});

document.getElementById('start-2').addEventListener('click', function () {
  var loading = document.getElementById('loading-2');
  var container = document.getElementById('container-2');
  container.innerHTML = '';
  loading.classList.remove('hidden');
  setTimeout(function () {
    loading.classList.add('hidden');
    var el = document.createElement('div');
    el.id = 'finish-2';
    el.setAttribute('data-testid', 'finish-2');
    el.textContent = 'Élément chargé avec succès !';
    container.appendChild(el);
  }, 3000);
});
