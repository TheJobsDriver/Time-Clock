
import React from 'react';
import type { TimeEntry } from '../types';
import { calculateHours } from '../utils/dateHelpers';
import { EditIcon, DeleteIcon } from './Icons';

interface EntriesTableProps {
    entries: TimeEntry[];
    isManager: boolean;
    onEdit: (entry: TimeEntry) => void;
    onDelete: (id: string) => void;
}

export const EntriesTable: React.FC<EntriesTableProps> = ({ entries, isManager, onEdit, onDelete }) => {
    return (
        <section className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        {isManager && <th scope="col" className="px-6 py-3">Employee</th>}
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Clock In</th>
                        <th scope="col" className="px-6 py-3">Clock Out</th>
                        <th scope="col" className="px-6 py-3">Hours</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.length > 0 ? (
                        entries.map(entry => (
                            <tr key={entry.id} className="bg-white border-b hover:bg-gray-50">
                                {isManager && <td className="px-6 py-4 font-medium text-gray-900">{entry.employeeId}</td>}
                                <td className="px-6 py-4">{entry.date}</td>
                                <td className="px-6 py-4">{entry.start || '-'}</td>
                                <td className="px-6 py-4">{entry.end || <span className="text-blue-500 font-semibold">In Progress</span>}</td>
                                <td className="px-6 py-4 font-semibold">{calculateHours(entry.start, entry.end)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => onEdit(entry)} className="p-2 text-blue-600 hover:text-blue-800 transition-colors">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => onDelete(entry.id)} className="p-2 text-red-600 hover:text-red-800 transition-colors">
                                        <DeleteIcon />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={isManager ? 6 : 5} className="text-center py-8 text-gray-500">
                                No entries found for the selected criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
};
