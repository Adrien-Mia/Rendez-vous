const fs = require('fs');
const path = require('path');
const { slots } = require('./slots');

// DATA_DIR permet de pointer vers un disque persistant monté par
// l'hébergeur (ex. Render) plutôt que vers le dossier du code source.
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DB_PATH = path.join(DATA_DIR, 'bookings.json');

function loadBookings() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) {
    return {};
  }
}

let bookings = loadBookings();

function persist() {
  fs.writeFileSync(DB_PATH, JSON.stringify(bookings, null, 2));
}

function getAllSlotsWithStatus() {
  return slots.map((s) => ({ ...s, booking: bookings[s.id] || null }));
}

// Synchrone et sans await entre la vérification et l'écriture : pas de
// race condition possible côté Node malgré des requêtes concurrentes.
function bookSlot(id, info) {
  const slot = slots.find((s) => s.id === id);
  if (!slot) return { ok: false, reason: 'not_found' };
  if (bookings[id]) return { ok: false, reason: 'taken' };

  bookings[id] = { ...info, bookedAt: new Date().toISOString() };
  persist();
  return { ok: true, slot };
}

module.exports = { getAllSlotsWithStatus, bookSlot };
