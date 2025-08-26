const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxw_u0KyVv_MbrKqwgJxZ9U--CHLTKKJbBKx2iJ4SSYSnZAFQKQmoM5_hgHHnOKyokU/exec';

type PunchOp = 'in' | 'out';

export async function sendPunch(op: PunchOp, entry: {
  id: string;
  employeeId: string;
  date: string;
  start: string;
  end: string | null;
}) {
  const body = new URLSearchParams({
    op,
    id: entry.id,
    employeeId: entry.employeeId,
    date: entry.date,
    start: entry.start || '',
    end: entry.end ?? ''
  });

  await fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
}

export async function fetchRecentEntries(employeeId?: string) {
  const res = await fetch(SHEET_URL + '?op=fetch&employeeId=' + (employeeId || ''));
  const data = await res.json();
  return data;
}
