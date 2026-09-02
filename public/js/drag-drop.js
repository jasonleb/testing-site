var dragged = null;

document.querySelectorAll('.dnd-box').forEach(function (box) {
  box.addEventListener('dragstart', function (e) {
    dragged = box;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', box.id);
  });
  box.addEventListener('dragover', function (e) {
    e.preventDefault();
  });
  box.addEventListener('drop', function (e) {
    e.preventDefault();
    if (dragged && dragged !== box) {
      var tmp = box.textContent;
      box.textContent = dragged.textContent;
      dragged.textContent = tmp;
    }
  });
});
