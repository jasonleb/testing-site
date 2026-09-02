const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { challenges, categories } = require('./data/challenges');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.challenges = challenges;
app.locals.categories = categories;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Déduit automatiquement le défi courant depuis l'URL, pour que header/footer
// (inclus séparément) puissent afficher le badge et la navigation prev/next
// sans que chaque vue ait besoin de repasser `current` explicitement.
app.use((req, res, next) => {
  const match = challenges.find((c) => c.path === req.path);
  res.locals.current = match ? match.id : null;
  next();
});

app.use('/', routes);

// 404 - doit être déclaré après toutes les routes
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page non trouvée' });
});

// Gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500', { title: 'Erreur serveur', message: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Testing site démarré : http://localhost:${PORT}`);
});
