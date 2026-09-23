(function () {
  var ACTION_LABELS = {
    edit: 'Modifier',
    submit: 'Soumettre',
    approve: 'Approuver',
    reject: 'Rejeter',
    reopen: 'Reprendre',
    pay: 'Payer',
  };

  var userSelect = document.getElementById('acting-as');
  var tbody = document.getElementById('expenses-tbody');
  var messageEl = document.getElementById('expenses-message');
  var form = document.getElementById('expense-form');
  var idInput = document.getElementById('expense-id');
  var labelInput = document.getElementById('expense-label');
  var amountInput = document.getElementById('expense-amount');
  var formTitle = document.getElementById('expense-form-title');
  var saveButton = document.getElementById('expense-save');
  var cancelButton = document.getElementById('expense-cancel');
  var notesById = {};

  function as() { return userSelect.value; }

  function message(text, isError) {
    messageEl.textContent = text;
    messageEl.className = isError ? 'error' : 'success';
  }
  function clearMessage() {
    messageEl.textContent = '';
    messageEl.className = 'hidden';
  }

  function api(method, url, body) {
    var opts = { method: method, headers: {} };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    return fetch(url, opts).then(function (res) {
      if (res.status === 204) return { ok: true, body: null };
      return res.json().then(function (b) { return { ok: res.ok, body: b }; });
    });
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function render(notes) {
    notesById = {};
    tbody.innerHTML = '';
    notes.forEach(function (n) {
      notesById[n.id] = n;
      var tr = el('tr', { 'data-testid': 'expense-row-' + n.id });
      tr.appendChild(el('td', {}, String(n.id)));

      var labelTd = el('td', { 'data-testid': 'expense-label-' + n.id }, n.label);
      if (n.rejectionReason) {
        labelTd.appendChild(el('div', { 'class': 'expenses-reason', 'data-testid': 'expense-reason-' + n.id }, 'Motif : ' + n.rejectionReason));
      }
      tr.appendChild(labelTd);
      tr.appendChild(el('td', { 'class': 'expenses-amount', 'data-testid': 'expense-amount-' + n.id }, n.amount));
      tr.appendChild(el('td', {}, n.authorName));

      var stateTd = el('td');
      stateTd.appendChild(el('span', { 'class': 'expenses-state', 'data-state': n.state, 'data-testid': 'expense-state-' + n.id }, n.stateLabel));
      tr.appendChild(stateTd);

      var actionsTd = el('td');
      var actionsWrap = el('div', { 'class': 'expenses-actions' });
      actionsTd.appendChild(actionsWrap);
      if (n.allowedActions.indexOf('reject') !== -1) {
        actionsWrap.appendChild(el('input', {
          type: 'text', 'class': 'expenses-reason-input', placeholder: 'Motif de rejet',
          'aria-label': 'Motif de rejet de la note ' + n.id, 'data-testid': 'expense-reason-input-' + n.id,
        }));
      }
      n.allowedActions.forEach(function (a) {
        actionsWrap.appendChild(el('button', {
          type: 'button', 'class': 'expenses-action', 'data-action': a, 'data-id': String(n.id),
          'data-testid': 'expense-' + a + '-' + n.id,
        }, ACTION_LABELS[a]));
      });
      if (!n.allowedActions.length) actionsWrap.appendChild(el('span', { 'class': 'expenses-none' }, '—'));
      tr.appendChild(actionsTd);
      tbody.appendChild(tr);
    });
  }

  function load() {
    return api('GET', '/api/expenses?as=' + encodeURIComponent(as())).then(function (r) {
      if (!r.ok) return message(r.body.error, true);
      render(r.body.notes);
    });
  }

  function resetForm() {
    idInput.value = '';
    labelInput.value = '';
    amountInput.value = '';
    formTitle.textContent = 'Nouvelle note de frais';
    saveButton.textContent = 'Créer la note';
    cancelButton.classList.add('hidden');
  }

  function startEdit(note) {
    idInput.value = note.id;
    labelInput.value = note.label;
    amountInput.value = note.amount;
    formTitle.textContent = 'Modifier la note n° ' + note.id;
    saveButton.textContent = 'Enregistrer';
    cancelButton.classList.remove('hidden');
    labelInput.focus();
  }

  tbody.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-action]');
    if (!button) return;
    var id = button.getAttribute('data-id');
    var action = button.getAttribute('data-action');
    clearMessage();

    if (action === 'edit') return startEdit(notesById[id]);

    var body = { as: as() };
    if (action === 'reject') {
      var reasonInput = tbody.querySelector('[data-testid="expense-reason-input-' + id + '"]');
      body.reason = reasonInput ? reasonInput.value : '';
    }
    api('POST', '/api/expenses/' + id + '/' + action, body).then(function (r) {
      if (!r.ok) return message(r.body.error, true);
      message('Note n° ' + id + ' : ' + r.body.stateLabel + '.', false);
      return load();
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearMessage();
    var id = idInput.value;
    var body = { as: as(), label: labelInput.value, amount: amountInput.value };
    var req = id ? api('PUT', '/api/expenses/' + id, body) : api('POST', '/api/expenses', body);
    req.then(function (r) {
      if (!r.ok) return message(r.body.error, true);
      message(id ? 'Note n° ' + id + ' modifiée.' : 'Note n° ' + r.body.id + ' créée (brouillon).', false);
      resetForm();
      return load();
    });
  });

  cancelButton.addEventListener('click', function () { resetForm(); clearMessage(); });

  userSelect.addEventListener('change', function () { resetForm(); clearMessage(); load(); });

  document.getElementById('expenses-reset').addEventListener('click', function () {
    api('POST', '/api/expenses/reset').then(function () {
      resetForm();
      message('Données réinitialisées.', false);
      return load();
    });
  });

  load();
})();
