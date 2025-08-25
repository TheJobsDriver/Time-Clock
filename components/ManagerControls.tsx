
import React from 'react';

interface ManagerControlsProps {
    allEmployeeIds: string[];
    selectedEmployee: string;
    onEmployeeChange: (employeeId: string) => void;
}

export const ManagerControls: React.FC<ManagerControlsProps> = ({ allEmployeeIds, selectedEmployee, onEmployeeChange }) => {
    return (
        <section className="p-4 mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <h3 className="text-lg font-semibold text-blue-800">Manager View</h3>
                <div className="flex items-center gap-2">
                    <label htmlFor="employeeFilter" className="font-medium text-gray-700">Filter by Employee:</label>
                    <select
                        id="employeeFilter"
                        value={selectedEmployee}
                        onChange={(e) => onEmployeeChange(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Employees</option>
                        {allEmployeeIds.map(id => (
                            <option key={id} value={id}>{id}</option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
};
