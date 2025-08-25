
import React, { useMemo } from 'react';
import type { TimeEntry } from '../types';
import { calculateHours } from '../utils/dateHelpers';

interface SummaryProps {
    entries: TimeEntry[];
}

const SummaryCard: React.FC<{ label: string, value: string | number }> = ({ label, value }) => (
    <div className="bg-white p-4 rounded-lg shadow text-center">
        <div className="text-sm font-medium text-gray-500 uppercase">{label}</div>
        <div className="mt-1 text-3xl font-bold text-slate-800">{value}</div>
    </div>
);

export const Summary: React.FC<SummaryProps> = ({ entries }) => {
    const summaryData = useMemo(() => {
        const completed = entries.filter(e => e.end);
        const totalHours = completed.reduce((sum, e) => sum + parseFloat(calculateHours(e.start, e.end)), 0);
        const uniqueDates = [...new Set(completed.map(e => e.date))];
        const avgHours = uniqueDates.length > 0 ? totalHours / uniqueDates.length : 0;

        return {
            totalEntries: entries.length,
            totalHours: totalHours.toFixed(2),
            avgHours: avgHours.toFixed(2)
        };
    }, [entries]);

    return (
        <section className="mt-8 bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <SummaryCard label="Total Entries" value={summaryData.totalEntries} />
                <SummaryCard label="Total Hours" value={summaryData.totalHours} />
                <SummaryCard label="Avg Hours/Day" value={summaryData.avgHours} />
            </div>
        </section>
    );
};
