
import React from 'react';

interface AlertProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    const baseClasses = "p-4 mb-4 rounded-lg flex justify-between items-center";
    const typeClasses = {
        success: "bg-green-100 text-green-800 border border-green-200",
        error: "bg-red-100 text-red-800 border border-red-200",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="text-xl font-bold leading-none">&times;</button>
        </div>
    );
};
