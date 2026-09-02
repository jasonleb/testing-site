document.getElementById('check-all').addEventListener('click', function () {
  document.querySelectorAll('input[type=checkbox]').forEach(function (cb) { cb.checked = true; });
});
document.getElementById('uncheck-all').addEventListener('click', function () {
  document.querySelectorAll('input[type=checkbox]').forEach(function (cb) { cb.checked = false; });
});
