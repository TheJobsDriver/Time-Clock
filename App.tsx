import { sendPunch, fetchRecentEntries } from './sheetApi';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { TimeEntry } from './types';
import { ymdLocal, localDateFrom, calculateHours } from './utils/dateHelpers';
import { Header } from './components/Header';
import { ClockControl } from './components/ClockControl';
import { FilterControls } from './components/FilterControls';
import { EntriesTable } from './components/EntriesTable';
import { Summary } from './components/Summary';
import { LoginModal } from './components/LoginModal';
import { EntryModal } from './components/EntryModal';
import { DeleteModal } from './components/DeleteModal';
import { ExportModal } from './components/ExportModal';
import { Alert } from './components/Alert';
import { ManagerControls } from './components/ManagerControls';

const App: React.FC = () => {
    const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);
    const [isManager, setIsManager] = useState(false);
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
    const [liveTimer, setLiveTimer] = useState('00:00:00');

    const [modal, setModal] = useState<'login' | 'entry' | 'delete' | 'export' | null>('login');
    const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
    const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
    
    const [filters, setFilters] = useState({ from: '', to: '', employee: '' });
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        const storedId = localStorage.getItem('employeeId');
        const storedEntries = localStorage.getItem('timeEntries');
        
        if (storedEntries) {
            setEntries(JSON.parse(storedEntries));
        }

        if (storedId) {
            setCurrentEmployeeId(storedId);
            const manager = storedId === '9999';
            setIsManager(manager);
            setModal(null);
            const idForFetch = manager ? undefined : storedId;
            fetchRecentEntries(idForFetch).then(setEntries).catch(console.error);


        } else {
            setModal('login');
        }
    }, []);
    
    // Check for active session on login/reload
    useEffect(() => {
        if (!currentEmployeeId || isManager) {
            setActiveEntry(null);
            return;
        };

        const currentActiveEntry = entries.find(e => e.employeeId === currentEmployeeId && !e.end);
        setActiveEntry(currentActiveEntry || null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentEmployeeId, entries, isManager]);

    // Live timer interval
    useEffect(() => {
        if (!activeEntry) {
            setLiveTimer('00:00:00');
            return;
        }

        const timerId = setInterval(() => {
            const start = localDateFrom(activeEntry.date, activeEntry.start);
            const diff = Math.max(0, new Date().getTime() - start.getTime());
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setLiveTimer(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(timerId);
    }, [activeEntry]);

    // Alert auto-dismiss
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const saveEntries = (updatedEntries: TimeEntry[]) => {
        setEntries(updatedEntries);
        localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));
    };

    const handleLogin = (code: string) => {
        setCurrentEmployeeId(code);
        const manager = code === '9999';
        setIsManager(manager);
        localStorage.setItem('employeeId', code);
        setModal(null);
        const idForFetch = code === '9999' ? undefined : code;
        fetchRecentEntries(idForFetch).then(setEntries).catch(console.error);

        if (manager) setFilters(f => ({ ...f, employee: '' }));
    };
    
    const handleSwitchUser = () => {
        setCurrentEmployeeId(null);
        setIsManager(false);
        setActiveEntry(null);
        localStorage.removeItem('employeeId');
        setModal('login');
    };

    const handleToggleClock = () => {
        if (!currentEmployeeId) return;

        if (activeEntry) { // Clocking out
            const now = new Date();
            const updatedEntries = entries.map(e => 
                e.id === activeEntry.id ? { ...e, end: now.toTimeString().slice(0, 5) } : e
            );
            saveEntries(updatedEntries);
            sendPunch('out', { ...activeEntry, end: now.toTimeString().slice(0, 5) });
            setActiveEntry(null);
            setAlert({ message: 'Clocked out successfully', type: 'success' });
        } else { // Clocking in
            const now = new Date();
            const newEntry: TimeEntry = {
                id: String(Date.now()),
                employeeId: currentEmployeeId,
                date: ymdLocal(now),
                start: now.toTimeString().slice(0, 5),
                end: null
            };
            const updatedEntries = [...entries, newEntry];
            saveEntries(updatedEntries);
            sendPunch('in', newEntry);
            setActiveEntry(newEntry);
            setAlert({ message: `Clocked in at ${newEntry.start}`, type: 'success' });
        }
    };
    
    const handleSaveEntry = (entryData: { date: string, start: string, end: string }) => {
        if (!currentEmployeeId && !editingEntry) return;

        if (editingEntry) { // Editing existing entry
            const updatedEntries = entries.map(e => 
                e.id === editingEntry.id ? { ...e, ...entryData } : e
            );
            saveEntries(updatedEntries);
            setAlert({ message: 'Entry updated successfully', type: 'success' });
        } else { // Adding new entry
            const newEntry: TimeEntry = {
                id: String(Date.now()),
                employeeId: currentEmployeeId!,
                ...entryData
            };
            saveEntries([...entries, newEntry]);
            setAlert({ message: 'Entry added successfully', type: 'success' });
        }
        setModal(null);
        setEditingEntry(null);
    };

    const handleDeleteEntry = () => {
        if (!deletingEntryId) return;
        const updatedEntries = entries.filter(e => e.id !== deletingEntryId);
        saveEntries(updatedEntries);
        setAlert({ message: 'Entry deleted successfully', type: 'success' });
        setModal(null);
        setDeletingEntryId(null);
    };

    const openEntryModal = (entry: TimeEntry | null = null) => {
        setEditingEntry(entry);
        setModal('entry');
    };
    
    const openDeleteModal = (id: string) => {
        setDeletingEntryId(id);
        setModal('delete');
    };

    const filteredEntries = useMemo(() => {
        let displayEntries = isManager
            ? entries
            : entries.filter(e => e.employeeId === currentEmployeeId);

        if (isManager && filters.employee) {
            displayEntries = displayEntries.filter(e => e.employeeId === filters.employee);
        }

        if (filters.from && filters.to) {
            displayEntries = displayEntries.filter(e => e.date >= filters.from && e.date <= filters.to);
        }
        
        return displayEntries.sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start));
    }, [entries, currentEmployeeId, isManager, filters]);

    const allEmployeeIds = useMemo(() => [...new Set(entries.map(e => e.employeeId))].sort(), [entries]);

    if (!currentEmployeeId || modal === 'login') {
        return <LoginModal onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <Header 
                    employeeId={currentEmployeeId} 
                    isManager={isManager} 
                    onSwitchUser={handleSwitchUser} 
                />

                <main className="p-4 sm:p-6">
                    {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
                    
                    {isManager && (
                        <ManagerControls
                            allEmployeeIds={allEmployeeIds}
                            selectedEmployee={filters.employee}
                            onEmployeeChange={(id) => setFilters(f => ({ ...f, employee: id }))}
                        />
                    )}

                    {!isManager && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                           <ClockControl
                                activeEntry={activeEntry}
                                liveTimer={liveTimer}
                                onToggleClock={handleToggleClock}
                           />
                           <div className="bg-gray-100 rounded-lg p-6 flex flex-col justify-center items-center">
                                <button
                                    onClick={() => openEntryModal()}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-lg transition duration-300 text-lg shadow-md"
                                >
                                    Add Manual Entry
                                </button>
                           </div>
                         </div>
                    )}
                   
                    <FilterControls filters={filters} onFilterChange={setFilters} onExport={() => setModal('export')} />
                    
                    <EntriesTable
                        entries={filteredEntries}
                        isManager={isManager}
                        onEdit={openEntryModal}
                        onDelete={openDeleteModal}
                    />
                    
                    <Summary entries={filteredEntries} />
                </main>
            </div>
            {modal === 'entry' && (
                <EntryModal
                    entry={editingEntry}
                    onClose={() => { setModal(null); setEditingEntry(null); }}
                    onSave={handleSaveEntry}
                />
            )}
            {modal === 'delete' && (
                <DeleteModal
                    onClose={() => { setModal(null); setDeletingEntryId(null); }}
                    onConfirm={handleDeleteEntry}
                />
            )}
            {modal === 'export' && (
                <ExportModal
                    entries={filteredEntries}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
};

export default App;
