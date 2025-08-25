
import React from 'react';
import { UserIcon } from './Icons';

interface HeaderProps {
    employeeId: string;
    isManager: boolean;
    onSwitchUser: () => void;
}

export const Header: React.FC<HeaderProps> = ({ employeeId, isManager, onSwitchUser }) => {
    return (
        <header className="bg-slate-800 text-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">Time Tracker</h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <UserIcon />
                    <span>
                        Employee: <strong className="font-semibold">{employeeId}</strong> {isManager && '(Manager)'}
                    </span>
                </div>
                <button
                    onClick={onSwitchUser}
                    className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-300"
                >
                    Switch User
                </button>
            </div>
        </header>
    );
};
