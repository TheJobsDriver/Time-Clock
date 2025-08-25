
// Returns YYYY-MM-DD in local time reliably.
export function ymdLocal(dateObj?: Date): string {
    const d = dateObj instanceof Date ? dateObj : new Date();
    // en-CA locale gives YYYY-MM-DD format in local time
    return d.toLocaleDateString('en-CA');
}

// Parses YYYY-MM-DD and HH:MM into a local Date object.
export function localDateFrom(dateStr: string, timeStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = (timeStr || '00:00').split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, 0, 0);
}

// Calculates the difference between two times in hours.
export function calculateHours(start: string, end: string | null): string {
    if (!start || !end) return '0.00';
    // Use a fixed date to compare only the time part
    const a = localDateFrom('2000-01-01', start);
    const b = localDateFrom('2000-01-01', end);
    let diff = b.getTime() - a.getTime();
    
    // Handle overnight shifts
    if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
    }
    
    const hours = diff / 3600000;
    return hours.toFixed(2);
}
