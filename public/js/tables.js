var table = document.getElementById('sortable-table');
var tbody = document.getElementById('sortable-tbody');
var headers = table.querySelectorAll('th');
var sortState = {};

headers.forEach(function (th, colIndex) {
  th.addEventListener('click', function () {
    var type = th.getAttribute('data-sort');
    var asc = !sortState[colIndex];
    sortState = {};
    sortState[colIndex] = asc;

    var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
    rows.sort(function (a, b) {
      var av = a.children[colIndex].textContent.trim();
      var bv = b.children[colIndex].textContent.trim();
      if (type === 'number') {
        return asc ? (av - bv) : (bv - av);
      }
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    rows.forEach(function (row) { tbody.appendChild(row); });
  });
});
