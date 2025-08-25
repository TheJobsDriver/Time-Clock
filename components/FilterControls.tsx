
import React from 'react';
import { DownloadIcon } from './Icons';

interface FilterControlsProps {
    filters: { from: string, to: string };
    onFilterChange: (filters: { from: string, to: string, employee: string }) => void;
    onExport: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange, onExport }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        onFilterChange({ ...filters, from: '', to: '' });
    };

    return (
        <section className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap">
                    <label className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">From:</span>
                        <input
                            type="date"
                            name="from"
                            value={filters.from}
                            onChange={handleInputChange}
                            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                    <label className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">To:</span>
                        <input
                            type="date"
                            name="to"
                            value={filters.to}
                            onChange={handleInputChange}
                            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </label>
                    <button onClick={clearFilters} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md text-sm transition duration-300">
                        Clear
                    </button>
                </div>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-300"
                >
                    <DownloadIcon />
                    Export
                </button>
            </div>
        </section>
    );
};
