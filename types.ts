
export interface TimeEntry {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
  end: string | null; // HH:MM or null if active
}
