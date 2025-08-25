
import React, { useState, useEffect } from 'react';
import type { TimeEntry } from '../types';
import { ymdLocal } from '../utils/dateHelpers';

interface EntryModalProps {
    entry: TimeEntry | null;
    onClose: () => void;
    onSave: (entryData: { date: string, start: string, end: string }) => void;
}

export const EntryModal: React.FC<EntryModalProps> = ({ entry, onClose, onSave }) => {
    const [date, setDate] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (entry) {
            setDate(entry.date);
            setStart(entry.start);
            setEnd(entry.end || '');
        } else {
            setDate(ymdLocal());
            setStart('');
            setEnd('');
        }
    }, [entry]);

    const handleSave = () => {
        if (!date || !start || !end) {
            setError('All fields are required.');
            return;
        }
        if (start >= end) {
            setError('End time must be after start time.');
            return;
        }
        setError('');
        onSave({ date, start, end });
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-6">{entry ? 'Edit Time Entry' : 'Add Time Entry'}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input type="time" value={start} onChange={e => setStart(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input type="time" value={end} onChange={e => setEnd(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition duration-300">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
