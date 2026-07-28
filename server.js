const express = require('express');
const path = require('path');
const { getAllSlotsWithStatus, bookSlot } = require('./data/store');
const { DURATION_MIN } = require('./data/slots');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'changeme';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));

function groupByDate(slots) {
  const map = new Map();
  for (const slot of slots) {
    if (!map.has(slot.date)) map.set(slot.date, { dateLabel: slot.dateLabel, slots: [] });
    map.get(slot.date).slots.push(slot);
  }
  return [...map.values()];
}

app.get('/', (req, res) => {
  const grouped = groupByDate(getAllSlotsWithStatus());
  res.render('index', { grouped, duration: DURATION_MIN, error: req.query.error });
});

app.post('/reserver/:id', (req, res) => {
  const commune = (req.body.commune || '').trim();
  const contact = (req.body.contact || '').trim();
  const email = (req.body.email || '').trim();
  const telephone = (req.body.telephone || '').trim();

  if (!commune || !contact || !email || !telephone) {
    return res.redirect('/?error=missing');
  }

  const result = bookSlot(req.params.id, { commune, contact, email, telephone });
  if (!result.ok) {
    return res.redirect(result.reason === 'taken' ? '/?error=taken' : '/?error=unknown');
  }

  res.render('confirmation', { slot: result.slot, commune, contact, email, telephone });
});

app.get('/admin', (req, res) => {
  if (req.query.key !== ADMIN_KEY) {
    return res.status(401).send("Accès refusé. Ajoutez ?key=VOTRE_CLE à l'URL.");
  }
  const grouped = groupByDate(getAllSlotsWithStatus());
  res.render('admin', { grouped });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Espace admin : http://localhost:${PORT}/admin?key=${ADMIN_KEY}`);
});
