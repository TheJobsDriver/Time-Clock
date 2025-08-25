
import React from 'react';

interface DeleteModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Entry</h2>
                <p className="text-gray-600">Are you sure you want to delete this time entry? This action cannot be undone.</p>
                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition duration-300">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
