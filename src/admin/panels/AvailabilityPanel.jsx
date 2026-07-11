import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Spinner, EmptyState } from '../ui';
import { dangerLinkClass, confirmDelete } from '../adminUtils';

// Compact variant of the shared inputClass — these sit inline (time/date
// pairs next to "to" labels), so the shared w-full style doesn't fit.
const inputClass = 'rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500';
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const emptyPeriod = { start_date: '', end_date: '', note: '' };

const AvailabilityPanel = () => {
  const [schedule, setSchedule] = useState([]);
  const [scheduleStatus, setScheduleStatus] = useState('idle');
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleLoading, setScheduleLoading] = useState(true);

  const [periods, setPeriods] = useState([]);
  const [newPeriod, setNewPeriod] = useState(emptyPeriod);
  const [periodStatus, setPeriodStatus] = useState('idle');
  const [periodError, setPeriodError] = useState('');
  const [periodsLoading, setPeriodsLoading] = useState(true);

  const loadSchedule = () => {
    supabase
      .from('availability_schedule')
      .select('*')
      .order('day_of_week')
      .then(({ data }) => {
        setSchedule(data || []);
        setScheduleLoading(false);
      });
  };

  const loadPeriods = () => {
    supabase
      .from('unavailability_periods')
      .select('*')
      .order('start_date')
      .then(({ data }) => {
        setPeriods(data || []);
        setPeriodsLoading(false);
      });
  };

  useEffect(() => {
    loadSchedule();
    loadPeriods();
  }, []);

  const updateDay = (day_of_week, patch) => {
    setSchedule((rows) => rows.map((r) => (r.day_of_week === day_of_week ? { ...r, ...patch } : r)));
  };

  const handleSaveSchedule = async () => {
    const invalid = schedule.some((r) => r.is_available && r.start_time >= r.end_time);
    if (invalid) {
      setScheduleError('Start time must be before end time for every available day.');
      setScheduleStatus('error');
      return;
    }

    setScheduleStatus('saving');
    setScheduleError('');

    const { error } = await supabase
      .from('availability_schedule')
      .upsert(schedule, { onConflict: 'day_of_week' });

    if (error) {
      setScheduleError(error.message);
      setScheduleStatus('error');
      return;
    }

    setScheduleStatus('success');
  };

  const handleAddPeriod = async (e) => {
    e.preventDefault();

    if (!newPeriod.start_date || !newPeriod.end_date || newPeriod.end_date < newPeriod.start_date) {
      setPeriodError('End date must be on or after the start date.');
      setPeriodStatus('error');
      return;
    }

    setPeriodStatus('saving');
    setPeriodError('');

    const { error } = await supabase.from('unavailability_periods').insert({
      start_date: newPeriod.start_date,
      end_date: newPeriod.end_date,
      note: newPeriod.note.trim() || null,
    });

    if (error) {
      setPeriodError(error.message);
      setPeriodStatus('error');
      return;
    }

    setNewPeriod(emptyPeriod);
    setPeriodStatus('idle');
    loadPeriods();
  };

  const handleDeletePeriod = async (id) => {
    if (!confirmDelete('Delete this unavailability period? This cannot be undone.')) return;
    await supabase.from('unavailability_periods').delete().eq('id', id);
    loadPeriods();
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Weekly Schedule</h2>
        {scheduleLoading ? (
          <Spinner label="Loading schedule…" />
        ) : (
        <>
        <div className="space-y-2 max-w-lg">
          {schedule.map((row) => (
            <div key={row.day_of_week} className="flex items-center gap-3">
              <label className="w-28 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={row.is_available}
                  onChange={(e) => updateDay(row.day_of_week, { is_available: e.target.checked })}
                />
                {DAY_NAMES[row.day_of_week]}
              </label>
              <input
                type="time"
                value={row.start_time}
                disabled={!row.is_available}
                onChange={(e) => updateDay(row.day_of_week, { start_time: e.target.value })}
                className={`${inputClass} disabled:opacity-50`}
              />
              <span className="text-gray-400">to</span>
              <input
                type="time"
                value={row.end_time}
                disabled={!row.is_available}
                onChange={(e) => updateDay(row.day_of_week, { end_time: e.target.value })}
                className={`${inputClass} disabled:opacity-50`}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveSchedule}
          disabled={scheduleStatus === 'saving'}
          className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium rounded-full shadow transition"
        >
          {scheduleStatus === 'saving' ? 'Saving…' : 'Save Schedule'}
        </button>
        {scheduleStatus === 'success' && <p className="text-green-600 text-sm mt-2">Saved.</p>}
        {scheduleStatus === 'error' && <p className="text-red-600 text-sm mt-2">{scheduleError}</p>}
        </>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Unavailability Periods</h2>
        <form onSubmit={handleAddPeriod} className="flex flex-wrap gap-2 items-end mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start date</label>
            <input
              type="date"
              value={newPeriod.start_date}
              onChange={(e) => setNewPeriod({ ...newPeriod, start_date: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End date</label>
            <input
              type="date"
              value={newPeriod.end_date}
              onChange={(e) => setNewPeriod({ ...newPeriod, end_date: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Note (optional)</label>
            <input
              type="text"
              value={newPeriod.note}
              onChange={(e) => setNewPeriod({ ...newPeriod, note: e.target.value })}
              maxLength={200}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={periodStatus === 'saving'}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium rounded-full shadow transition"
          >
            Add
          </button>
        </form>
        {periodStatus === 'error' && <p className="text-red-600 text-sm mb-2">{periodError}</p>}

        {periodsLoading ? (
          <Spinner label="Loading periods…" />
        ) : periods.length === 0 ? (
          <EmptyState>No unavailability periods set — you're open per the weekly schedule above.</EmptyState>
        ) : (
          <div className="space-y-2">
            {periods.map((p) => (
              <div key={p.id} className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {p.start_date} – {p.end_date}{p.note ? ` · ${p.note}` : ''}
                </span>
                <button onClick={() => handleDeletePeriod(p.id)} className={dangerLinkClass}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityPanel;
