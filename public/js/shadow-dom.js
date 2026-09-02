class TestWidget extends HTMLElement {
  connectedCallback() {
    var shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML =
      '<style>' +
      '.box { border: 2px solid #4f46e5; border-radius: 8px; padding: 12px; font-family: sans-serif; }' +
      'button { background: #4f46e5; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }' +
      '</style>' +
      '<div class="box">' +
      '<p id="shadow-text" data-testid="shadow-text">Compteur : <span id="count">0</span></p>' +
      '<button id="shadow-button" data-testid="shadow-button">Incrémenter</button>' +
      '</div>';

    var count = 0;
    var countEl = shadow.getElementById('count');
    shadow.getElementById('shadow-button').addEventListener('click', function () {
      count += 1;
      countEl.textContent = String(count);
    });
  }
}
customElements.define('test-widget', TestWidget);
