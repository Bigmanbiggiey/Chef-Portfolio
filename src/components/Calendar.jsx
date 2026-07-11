import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { submitContact } from '../lib/contactApi';

const DEFAULT_SCHEDULE = [
  { day_of_week: 0, is_available: false, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 1, is_available: true, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 2, is_available: true, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 3, is_available: true, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 4, is_available: true, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 5, is_available: true, start_time: '09:00', end_time: '18:00' },
  { day_of_week: 6, is_available: true, start_time: '09:00', end_time: '18:00' },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Local calendar-date key, not UTC — toISOString() would shift the date
// by a day for visitors behind UTC depending on the time of day.
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateKey(dateKey) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

const initialRequest = { name: '', email: '', note: '', honeypot: '' };

const CELL_CLASSES = {
  available: 'bg-amber-50 border border-amber-400 text-amber-700 hover:bg-amber-100 cursor-pointer',
  unavailable: 'bg-red-50 text-red-300 line-through cursor-default',
  closed: 'bg-gray-100 text-gray-400 cursor-default',
  past: 'bg-gray-50 text-gray-300 opacity-60 cursor-default',
};

const Calendar = () => {
  const [viewedMonth, setViewedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [periods, setPeriods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [request, setRequest] = useState(initialRequest);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    supabase
      .from('availability_schedule')
      .select('*')
      .order('day_of_week')
      .then(({ data }) => {
        if (data && data.length > 0) setSchedule(data);
      });

    supabase
      .from('unavailability_periods')
      .select('*')
      .then(({ data }) => {
        if (data) setPeriods(data);
      });
  }, []);

  const todayKey = toDateKey(new Date());

  const classify = (date) => {
    const key = toDateKey(date);
    if (key < todayKey) return 'past';
    const daySchedule = schedule.find((r) => r.day_of_week === date.getDay());
    if (!daySchedule || !daySchedule.is_available) return 'closed';
    if (periods.some((p) => p.start_date <= key && key <= p.end_date)) return 'unavailable';
    return 'available';
  };

  const year = viewedMonth.getFullYear();
  const month = viewedMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = new Date(year, month, 1).getDay();

  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const handleSelect = (date) => {
    setSelectedDate(toDateKey(date));
    setStatus('idle');
    setErrorMessage('');
    setRequest(initialRequest);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const message = request.note.trim()
      ? `Availability request for ${formatDateKey(selectedDate)}.\n\n${request.note.trim()}`
      : `Availability request for ${formatDateKey(selectedDate)}.`;

    try {
      await submitContact({ name: request.name, email: request.email, message, honeypot: request.honeypot });
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <section id="availability" className="py-20 bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-10">Check Availability</h2>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setViewedMonth(new Date(year, month - 1, 1))}
            disabled={isCurrentMonth}
            className="px-3 py-1 text-amber-600 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <p className="font-semibold text-lg">{MONTH_NAMES[month]} {year}</p>
          <button
            onClick={() => setViewedMonth(new Date(year, month + 1, 1))}
            className="px-3 py-1 text-amber-600 hover:text-amber-700"
          >
            Next →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm mb-4">
          {DAY_LABELS.map((d) => (
            <div key={d} className="font-medium text-gray-500 py-1">{d}</div>
          ))}
          {cells.map((date, i) => {
            if (!date) return <div key={i} />;
            const state = classify(date);
            const key = toDateKey(date);
            return (
              <button
                key={i}
                onClick={() => state === 'available' && handleSelect(date)}
                disabled={state !== 'available'}
                className={`aspect-square rounded-md ${CELL_CLASSES[state]} ${selectedDate === key ? 'ring-2 ring-amber-500' : ''}`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 text-xs text-gray-500 mb-10 flex-wrap">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-50 border border-amber-400 inline-block" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-50 inline-block" /> Unavailable</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 inline-block" /> Closed</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-50 inline-block" /> Past</span>
        </div>

        {selectedDate && (
          <form onSubmit={handleSubmit} className="text-left space-y-4 max-w-md mx-auto border-t pt-8">
            <p className="font-medium text-gray-800">
              Request {formatDateKey(selectedDate)}
            </p>

            <input
              type="text"
              name="honeypot"
              value={request.honeypot}
              onChange={(e) => setRequest({ ...request, honeypot: e.target.value })}
              className="absolute -left-[9999px]"
              aria-hidden="true"
              tabIndex="-1"
              autoComplete="off"
            />

            <input
              type="text"
              placeholder="Your name"
              required
              maxLength={100}
              value={request.name}
              onChange={(e) => setRequest({ ...request, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="email"
              placeholder="Your email"
              required
              maxLength={200}
              value={request.email}
              onChange={(e) => setRequest({ ...request, email: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <textarea
              placeholder="Anything else? (optional)"
              rows={3}
              maxLength={2000}
              value={request.note}
              onChange={(e) => setRequest({ ...request, note: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium rounded-full shadow transition"
            >
              {status === 'submitting' ? 'Sending…' : 'Request This Date'}
            </button>

            {status === 'success' && (
              <p className="text-green-600 font-medium">Thanks — I&rsquo;ll get back to you soon!</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 font-medium">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

export default Calendar;
