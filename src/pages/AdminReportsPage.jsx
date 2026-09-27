import { Download, FileText } from 'lucide-react';
import { useHostelStore } from '../context/HostelStore';

function downloadCsv(filename, headers, rows) {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const content = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AdminReportsPage() {
  const { students, payments, attendance, complaints, visitors, today } = useHostelStore();
  const reports = [
    {
      title: 'Student roster',
      description: 'Room, course, attendance, fee status, and residency state.',
      count: students.length,
      export: () => downloadCsv('matchomate-students.csv', ['ID', 'Name', 'Course', 'Year', 'Room', 'Attendance', 'Payment', 'Status'], students.map((student) => [student.id, student.name, student.course, student.year, student.room, student.attendance, student.payment, student.status])),
    },
    {
      title: 'Fee ledger',
      description: 'Invoice status, amount, due date, and payment reference.',
      count: payments.length,
      export: () => downloadCsv('matchomate-fees.csv', ['Invoice', 'Student ID', 'Month', 'Type', 'Amount', 'Due Date', 'Status', 'Receipt'], payments.map((payment) => [payment.id, payment.studentId, payment.month, payment.type, payment.amount, payment.dueDate, payment.status, payment.receipt])),
    },
    {
      title: 'Attendance roll',
      description: `Daily gate and attendance records for ${today}.`,
      count: attendance.filter((record) => record.date === today).length,
      export: () => downloadCsv('matchomate-attendance.csv', ['Student ID', 'Date', 'Status', 'Check-in', 'Method', 'Gate'], attendance.map((record) => [record.studentId, record.date, record.status, record.checkIn, record.method, record.gate])),
    },
    {
      title: 'Operations tickets',
      description: 'Complaint queue and visitor entry records.',
      count: complaints.length + visitors.length,
      export: () => downloadCsv('matchomate-operations.csv', ['Record Type', 'ID', 'Student ID', 'Category / Visitor', 'Status', 'Created / Expected'], [
        ...complaints.map((item) => ['Complaint', item.id, item.studentId, item.category, item.status, item.createdOn || item.created]),
        ...visitors.map((item) => ['Visitor', item.id, item.studentId, item.visitorName, item.status, item.expectedAt]),
      ]),
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={24} style={{ color: 'var(--accent-500)' }} /><h1 className="page-header__greeting">Reports</h1></div>
        <p className="page-header__subtitle">Export current hostel operations data as CSV files.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {reports.map((report) => (
          <section key={report.title} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{report.title}</h2>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>{report.description}</p>
              <span style={{ display: 'inline-block', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>{report.count} records</span>
            </div>
            <button type="button" className="btn btn--secondary" onClick={report.export}><Download size={15} /> Export CSV</button>
          </section>
        ))}
      </div>
    </div>
  );
}