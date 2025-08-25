
import React, { useState, useMemo } from 'react';
import type { TimeEntry } from '../types';
import { calculateHours } from '../utils/dateHelpers';

interface ExportModalProps {
    entries: TimeEntry[];
    onClose: () => void;
}

type ExportFormat = 'excel' | 'csv';

export const ExportModal: React.FC<ExportModalProps> = ({ entries, onClose }) => {
    const [format, setFormat] = useState<ExportFormat>('excel');
    const [copied, setCopied] = useState(false);

    const exportData = useMemo(() => {
        const headers = ['EmployeeID', 'Date', 'Clock In', 'Clock Out', 'Hours'];
        const rows = entries
            .filter(e => e.end) // Only export completed entries
            .map(e => [
                e.employeeId,
                e.date,
                e.start,
                e.end,
                calculateHours(e.start, e.end)
            ]);

        const excelData = [headers, ...rows].map(r => r.join('\t')).join('\n');
        const csvData = [headers, ...rows].map(r => r.map(cell => `"${(cell ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');

        return { excel: excelData, csv: csvData };
    }, [entries]);

    const handleCopy = () => {
        navigator.clipboard.writeText(exportData[format]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Export Data</h2>
                <div className="mb-4 flex gap-6">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="format" value="excel" checked={format === 'excel'} onChange={() => setFormat('excel')} className="form-radio text-blue-600"/>
                        <span>Excel / Sheets (Tab separated)</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="format" value="csv" checked={format === 'csv'} onChange={() => setFormat('csv')} className="form-radio text-blue-600"/>
                        <span>CSV (Comma separated)</span>
                    </label>
                </div>
                <textarea
                    readOnly
                    value={exportData[format]}
                    className="w-full h-64 p-2 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
                />
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition duration-300">
                        Close
                    </button>
                    <button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300 min-w-[150px]">
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        </div>
    );
};
