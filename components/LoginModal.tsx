
import React, { useState } from 'react';

interface LoginModalProps {
    onLogin: (code: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (/^\d{4}$/.test(code)) {
            onLogin(code);
            setError('');
        } else {
            setError('Please enter a valid 4-digit employee code.');
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Employee Login</h2>
                <div className="mb-4">
                    <label htmlFor="employeeCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter your 4-digit code:
                    </label>
                    <input
                        type="text"
                        id="employeeCode"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        onKeyPress={handleKeyPress}
                        maxLength={4}
                        autoFocus
                        className="w-full px-4 py-2 text-lg text-center tracking-widest font-mono border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="----"
                    />
                </div>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <div className="mt-6">
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};
