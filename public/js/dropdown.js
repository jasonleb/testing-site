document.getElementById('dropdown').addEventListener('change', function (e) {
  document.getElementById('dropdown-result').textContent = 'Sélection : ' + e.target.options[e.target.selectedIndex].text;
});

var toggle = document.getElementById('custom-dropdown-toggle');
var list = document.getElementById('custom-dropdown-list');
toggle.addEventListener('click', function () {
  var isHidden = list.classList.toggle('hidden');
  toggle.setAttribute('aria-expanded', String(!isHidden));
});
list.querySelectorAll('li').forEach(function (li) {
  li.addEventListener('click', function () {
    document.getElementById('custom-dropdown-result').textContent = 'Ville sélectionnée : ' + li.textContent;
    list.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  });
});
