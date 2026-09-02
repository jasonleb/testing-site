var container = document.getElementById('scroll-items');
var sentinel = document.getElementById('scroll-sentinel');
var nextStart = 0;
var loading = false;

function loadMore() {
  if (loading) return;
  loading = true;
  fetch('/infinite-scroll/more?start=' + nextStart)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      data.items.forEach(function (n) {
        var p = document.createElement('p');
        p.id = 'paragraph-' + n;
        p.setAttribute('data-testid', 'paragraph-' + n);
        p.textContent = 'Paragraphe #' + n;
        container.appendChild(p);
      });
      nextStart += data.items.length;
      loading = false;
    });
}

var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) loadMore();
    });
  },
  { root: document.getElementById('scroll-container') }
);
observer.observe(sentinel);

loadMore();
