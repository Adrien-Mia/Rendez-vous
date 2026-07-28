const DURATION_MIN = 45;

// Journées et heures de début disponibles.
const DAYS = [
  { date: '2026-08-24', label: 'Lundi 24 août 2026', times: ['10:00', '11:00', '14:00', '15:00'] },
  { date: '2026-08-25', label: 'Mardi 25 août 2026', times: ['10:00', '11:00', '14:00', '15:00'] },
  { date: '2026-08-27', label: 'Jeudi 27 août 2026', times: ['10:00', '11:00', '14:00', '15:00'] },
  { date: '2026-08-31', label: 'Lundi 31 août 2026', times: ['10:00', '11:00', '14:00', '15:00'] },
  { date: '2026-09-01', label: 'Mardi 1er septembre 2026', times: ['10:00', '11:00', '14:00', '15:00'] },
  { date: '2026-09-07', label: 'Lundi 7 septembre 2026', times: ['10:00', '11:00', '14:00', '15:00'] },
  { date: '2026-09-08', label: 'Mardi 8 septembre 2026', times: ['10:00', '11:00'] },
  { date: '2026-09-10', label: 'Jeudi 10 septembre 2026', times: ['10:00', '11:00', '14:00', '15:00'] },
  { date: '2026-09-14', label: 'Lundi 14 septembre 2026', times: ['10:00', '11:00', '14:00', '15:00'] },
];

function addMinutes(time, minutes) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}h${String(nm).padStart(2, '0')}`;
}

function formatLabel(time) {
  const [h, m] = time.split(':');
  return `${h}h${m === '00' ? '00' : m}`;
}

const slots = [];
for (const day of DAYS) {
  for (const time of day.times) {
    slots.push({
      id: `${day.date}-${time.replace(':', '')}`,
      date: day.date,
      dateLabel: day.label,
      time,
      timeLabel: formatLabel(time),
      endLabel: addMinutes(time, DURATION_MIN),
    });
  }
}

module.exports = { slots, DURATION_MIN };
