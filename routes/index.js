const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();

// --- Accueil ---
router.get('/', (req, res) => {
  res.render('index', { title: 'Accueil' });
});

// --- Menu déroulant ---
router.get('/dropdown', (req, res) => {
  res.render('dropdown', { title: 'Menu déroulant' });
});

// --- IFrame ---
router.get('/iframe', (req, res) => {
  res.render('iframe', { title: 'IFrame éditable' });
});

// --- Alertes JavaScript ---
router.get('/alerts', (req, res) => {
  res.render('alerts', { title: 'Alertes JavaScript' });
});

// --- Chargement dynamique ---
router.get('/dynamic-loading', (req, res) => {
  res.render('dynamic-loading', { title: 'Chargement dynamique' });
});

// --- Glisser-déposer ---
router.get('/drag-and-drop', (req, res) => {
  res.render('drag-and-drop', { title: 'Glisser-déposer' });
});

// --- Upload de fichier ---
const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safeName);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function listUploads() {
  return fs.readdirSync(uploadDir).filter((f) => f !== '.gitkeep');
}

router.get('/file-upload', (req, res) => {
  res.render('file-upload', { title: 'Upload de fichier', files: listUploads(), uploaded: null, error: null });
});

router.post('/file-upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.render('file-upload', { title: 'Upload de fichier', files: listUploads(), uploaded: null, error: err.message });
    }
    if (!req.file) {
      return res.render('file-upload', { title: 'Upload de fichier', files: listUploads(), uploaded: null, error: 'Aucun fichier sélectionné.' });
    }
    res.render('file-upload', { title: 'Upload de fichier', files: listUploads(), uploaded: req.file.filename, error: null });
  });
});

// --- Éléments cachés ---
router.get('/hidden-elements', (req, res) => {
  res.render('hidden-elements', { title: 'Éléments cachés' });
});

// --- Défilement infini ---
router.get('/infinite-scroll', (req, res) => {
  res.render('infinite-scroll', { title: 'Défilement infini' });
});
router.get('/infinite-scroll/more', (req, res) => {
  const start = parseInt(req.query.start || '0', 10);
  const items = [];
  for (let i = 0; i < 10; i++) items.push(start + i);
  res.json({ items });
});

// --- Connexion ---
const VALID_USER = 'testuser';
const VALID_PASS = 'Test1234!';

router.get('/login', (req, res) => {
  res.render('login', { title: 'Connexion', error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === VALID_USER && password === VALID_PASS) {
    res.cookie('session', 'authenticated', { httpOnly: true });
    return res.redirect('/secure');
  }
  res.render('login', { title: 'Connexion', error: 'Identifiants invalides.' });
});

router.get('/secure', (req, res) => {
  if (req.cookies.session !== 'authenticated') {
    return res.redirect('/login');
  }
  res.render('secure', { title: 'Zone sécurisée' });
});

router.get('/logout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/login');
});

// --- Tableau triable ---
router.get('/tables', (req, res) => {
  const rows = [
    { id: 1, prenom: 'Alice', nom: 'Martin', age: 34, ville: 'Genève' },
    { id: 2, prenom: 'Bruno', nom: 'Dupont', age: 28, ville: 'Lyon' },
    { id: 3, prenom: 'Chloé', nom: 'Bernard', age: 45, ville: 'Paris' },
    { id: 4, prenom: 'David', nom: 'Leroy', age: 19, ville: 'Zürich' },
    { id: 5, prenom: 'Emma', nom: 'Petit', age: 52, ville: 'Bruxelles' },
  ];
  res.render('tables', { title: 'Tableau triable', rows });
});

// --- Codes de statut HTTP ---
router.get('/status-codes', (req, res) => {
  res.render('status-codes', { title: 'Codes de statut HTTP' });
});
router.get('/status-codes/200', (req, res) => {
  res.status(200).render('status-result', { title: '200 OK', code: 200, message: 'La requête a réussi.' });
});
router.get('/status-codes/301', (req, res) => {
  res.redirect(301, '/status-codes/301-target');
});
router.get('/status-codes/301-target', (req, res) => {
  res.render('status-result', { title: '301 Redirection permanente', code: 301, message: 'Vous avez été redirigé de façon permanente vers cette page.' });
});
router.get('/status-codes/404', (req, res) => {
  res.status(404).render('status-result', { title: '404 Not Found', code: 404, message: "La ressource demandée n'existe pas." });
});
router.get('/status-codes/500', (req, res) => {
  res.status(500).render('status-result', { title: '500 Internal Server Error', code: 500, message: 'Une erreur serveur simulée.' });
});

// --- Shadow DOM ---
router.get('/shadow-dom', (req, res) => {
  res.render('shadow-dom', { title: 'Shadow DOM' });
});

// --- Ressource lente ---
router.get('/slow-resource', (req, res) => {
  res.render('slow-resource', { title: 'Ressource lente' });
});
router.get('/slow-resource/image', (req, res) => {
  setTimeout(() => {
    res.type('image/svg+xml').send(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120"><rect width="100%" height="100%" fill="#4f46e5"/><text x="50%" y="50%" fill="white" font-size="16" text-anchor="middle" dominant-baseline="middle">Chargé après 3s</text></svg>'
    );
  }, 3000);
});
router.get('/slow-resource/data', (req, res) => {
  setTimeout(() => {
    res.json({ message: 'Ces données ont mis 3 secondes à arriver.', timestamp: Date.now() });
  }, 3000);
});

// --- Images cassées ---
router.get('/broken-images', (req, res) => {
  res.render('broken-images', { title: 'Images cassées' });
});
router.get('/broken-images/server-error', (req, res) => {
  res.status(500).end();
});

// --- Fenêtres multiples ---
router.get('/multiple-windows', (req, res) => {
  res.render('multiple-windows', { title: 'Fenêtres multiples' });
});
router.get('/multiple-windows/new', (req, res) => {
  res.render('multiple-windows-new', { title: 'Nouvelle fenêtre' });
});

// --- Authentification HTTP Basic ---
router.get('/basic-auth', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Testing Site"');
    return res.status(401).render('basic-auth', { title: 'Authentification HTTP Basic', authenticated: false });
  }
  const decoded = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
  const [user, pass] = decoded.split(':');
  if (user === 'admin' && pass === 'admin') {
    return res.render('basic-auth', { title: 'Authentification HTTP Basic', authenticated: true });
  }
  res.set('WWW-Authenticate', 'Basic realm="Testing Site"');
  res.status(401).render('basic-auth', { title: 'Authentification HTTP Basic', authenticated: false });
});

// --- Redirection ---
router.get('/redirect', (req, res) => {
  res.render('redirect', { title: 'Redirection' });
});
router.get('/redirect/go', (req, res) => {
  res.redirect(302, '/redirect/target');
});
router.get('/redirect/target', (req, res) => {
  res.render('redirect-target', { title: 'Destination de la redirection' });
});

// --- Cases à cocher ---
router.get('/checkboxes', (req, res) => {
  res.render('checkboxes', { title: 'Cases à cocher' });
});

module.exports = router;
