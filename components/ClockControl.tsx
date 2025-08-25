
import React from 'react';
import type { TimeEntry } from '../types';

interface ClockControlProps {
    activeEntry: TimeEntry | null;
    liveTimer: string;
    onToggleClock: () => void;
}

export const ClockControl: React.FC<ClockControlProps> = ({ activeEntry, liveTimer, onToggleClock }) => {
    const isClockedIn = !!activeEntry;
    
    const buttonClasses = isClockedIn
        ? 'bg-red-500 hover:bg-red-600'
        : 'bg-green-500 hover:bg-green-600';
        
    const cardClasses = isClockedIn
        ? 'bg-green-50 border-l-4 border-green-500'
        : 'bg-gray-100';

    return (
        <div className={`rounded-lg p-6 flex flex-col justify-center items-center transition duration-300 ${cardClasses}`}>
            <button
                onClick={onToggleClock}
                className={`w-full text-white font-bold py-4 px-4 rounded-lg transition duration-300 text-lg shadow-md ${buttonClasses}`}
            >
                {isClockedIn ? 'Clock Out' : 'Clock In'}
            </button>
            {isClockedIn && (
                <div className="mt-4 text-center text-sm text-gray-600 w-full">
                    <div>Started: <span className="font-semibold">{activeEntry.start}</span></div>
                    <div className="text-2xl font-mono font-bold text-green-600 mt-1">{liveTimer}</div>
                </div>
            )}
        </div>
    );
};
