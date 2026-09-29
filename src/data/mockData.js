// ============================================================
// MATCHOMATE — Mock Data Layer
// All realistic hostel/student data for the UI
// Ready for future FastAPI integration
// ============================================================

export const hostels = [
  { id: 'h1', name: 'ABC Residency', blocks: 4, floors: 12, rooms: 120, capacity: 480 },
  { id: 'h2', name: 'Sunrise Hostel', blocks: 2, floors: 8, rooms: 64, capacity: 256 },
];

export const currentHostel = hostels[0];

export const kpiData = {
  totalStudents: { value: 482, change: 12, changePercent: 2.5, period: 'this month' },
  occupancy: { value: 87.6, change: 4.2, period: 'this month' },
  vacantBeds: { value: 39, change: -8, changePercent: -17, period: 'this month' },
  openComplaints: { value: 18, change: 3, changePercent: 20, period: 'this week' },
  studentExperience: { value: 84, change: 2, period: 'this month' },
};

export const aiAttentionItems = [
  {
    id: 'ai1',
    severity: 'high',
    type: 'complaint',
    title: 'Block C complaints increased 38%',
    description: 'Water-related complaints spiked in Block C over the past 7 days, concentrated on Floors 3 and 4.',
    recommendation: 'Inspect plumbing infrastructure on Floors 3–4 of Block C.',
    cta: 'View Block C',
    icon: 'AlertTriangle',
  },
  {
    id: 'ai2',
    severity: 'high',
    type: 'roommate',
    title: 'Room 304 has elevated conflict risk',
    description: 'Lifestyle compatibility between occupants dropped to 42%. Sleep schedule and noise tolerance are key friction points.',
    recommendation: 'Consider a roommate reassignment or mediation session.',
    cta: 'Inspect Room',
    icon: 'Users',
  },
  {
    id: 'ai3',
    severity: 'medium',
    type: 'occupancy',
    title: '18 beds available across 3 blocks',
    description: 'Block A has 8 vacancies, Block B has 6, and Block D has 4. These could be filled from the 12-student waitlist.',
    recommendation: 'Run smart allocation for waitlisted students.',
    cta: 'Run Allocation',
    icon: 'BedDouble',
  },
  {
    id: 'ai4',
    severity: 'low',
    type: 'maintenance',
    title: 'Scheduled maintenance overdue in Block B',
    description: '3 maintenance tasks in Block B are past their due date. Generator servicing is 5 days overdue.',
    recommendation: 'Prioritize generator servicing and water tank cleaning.',
    cta: 'View Tasks',
    icon: 'Wrench',
  },
];

export const hostelHealth = {
  overall: 84,
  breakdown: [
    { label: 'Occupancy', value: 88, color: 'var(--accent-500)' },
    { label: 'Student Experience', value: 84, color: '#7c3aed' },
    { label: 'Maintenance', value: 76, color: 'var(--warning-500)' },
    { label: 'Complaints', value: 82, color: 'var(--success-500)' },
    { label: 'Compatibility', value: 91, color: '#06b6d4' },
  ],
};

export const occupancyData = {
  occupied: 441,
  vacant: 39,
  reserved: 12,
  maintenance: 8,
  total: 500,
  trend: [
    { day: 'Mon', rate: 85.2 },
    { day: 'Tue', rate: 85.8 },
    { day: 'Wed', rate: 86.1 },
    { day: 'Thu', rate: 86.5 },
    { day: 'Fri', rate: 87.0 },
    { day: 'Sat', rate: 87.3 },
    { day: 'Sun', rate: 87.6 },
  ],
  monthly: [
    { month: 'Apr', rate: 78 },
    { month: 'May', rate: 80 },
    { month: 'Jun', rate: 82 },
    { month: 'Jul', rate: 83 },
    { month: 'Aug', rate: 85 },
    { month: 'Sep', rate: 87.6 },
  ],
};

export const complaintData = {
  total: 156,
  open: 18,
  inProgress: 12,
  critical: 4,
  resolved: 122,
  categories: [
    { name: 'Water', count: 42, color: '#3b82f6' },
    { name: 'Electrical', count: 31, color: '#f59e0b' },
    { name: 'Cleaning', count: 28, color: '#22c55e' },
    { name: 'Internet', count: 25, color: '#8b5cf6' },
    { name: 'Other', count: 30, color: '#71717a' },
  ],
  trend: [
    { week: 'W1', count: 28 },
    { week: 'W2', count: 34 },
    { week: 'W3', count: 22 },
    { week: 'W4', count: 31 },
    { week: 'W5', count: 18 },
    { week: 'W6', count: 23 },
  ],
  aiInsight: 'Water-related complaints are concentrated in Block C, Floors 3–4. Plumbing infrastructure may require inspection.',
};

export const roommateIntelligence = {
  avgCompatibility: 91,
  highRiskRooms: 3,
  recentAllocations: 8,
  allocations: [
    { room: '304', students: ['Rahul S.', 'Aman K.'], score: 94, risk: 'low' },
    { room: '208', students: ['Priya M.', 'Neha R.'], score: 88, risk: 'low' },
    { room: '412', students: ['Vikram T.', 'Suresh P.'], score: 42, risk: 'high' },
  ],
};

export const recentActivity = [
  { id: 'a1', type: 'student', text: 'Arjun Mehta registered as a new student', time: '12 min ago', icon: 'UserPlus' },
  { id: 'a2', type: 'room', text: 'Room 305 allocation approved for Priya Sharma', time: '28 min ago', icon: 'CheckCircle' },
  { id: 'a3', type: 'complaint', text: 'Complaint #1847 resolved — Water leak in B-204', time: '1 hr ago', icon: 'CheckCircle2' },
  { id: 'a4', type: 'payment', text: 'Payment of ₹12,500 received from Suresh Pillai', time: '2 hr ago', icon: 'CreditCard' },
  { id: 'a5', type: 'room', text: 'Room change requested by Neha Reddy (B-108 → A-203)', time: '3 hr ago', icon: 'ArrowRightLeft' },
  { id: 'a6', type: 'leave', text: 'Leave approved for Vikram Tiwari (Sep 28–30)', time: '4 hr ago', icon: 'Calendar' },
];

export const students = [
  { id: 'STU001', name: 'Rahul Sharma', course: 'B.Tech CSE', year: 3, room: 'B-304', bed: 'A', compatibility: 94, attendance: 92, payment: 'pending', status: 'active', avatar: 'RS', phone: '+91 98765 43210', email: 'rahul.sharma@university.edu', city: 'Lucknow', guardian: 'Suresh Sharma', guardianPhone: '+91 98100 11111' },
  { id: 'STU002', name: 'Priya Sharma', course: 'B.Tech ECE', year: 2, room: 'A-208', bed: 'B', compatibility: 88, attendance: 96, payment: 'paid', status: 'active', avatar: 'PS', phone: '+91 98201 44521', email: 'priya.sharma@university.edu', city: 'Jaipur', guardian: 'Kavita Sharma', guardianPhone: '+91 98290 33410' },
  { id: 'STU003', name: 'Aman Kumar', course: 'B.Tech ME', year: 3, room: 'B-304', bed: 'B', compatibility: 94, attendance: 85, payment: 'pending', status: 'active', avatar: 'AK', phone: '+91 99314 22008', email: 'aman.kumar@university.edu', city: 'Patna', guardian: 'Rakesh Kumar', guardianPhone: '+91 94310 77821' },
  { id: 'STU004', name: 'Neha Reddy', course: 'MBA', year: 1, room: 'A-108', bed: 'A', compatibility: 76, attendance: 88, payment: 'paid', status: 'active', avatar: 'NR', phone: '+91 90001 66712', email: 'neha.reddy@university.edu', city: 'Hyderabad', guardian: 'Srinivas Reddy', guardianPhone: '+91 98490 11220' },
  { id: 'STU005', name: 'Vikram Tiwari', course: 'B.Tech IT', year: 4, room: 'C-412', bed: 'A', compatibility: 42, attendance: 78, payment: 'overdue', status: 'active', avatar: 'VT', phone: '+91 94152 88031', email: 'vikram.tiwari@university.edu', city: 'Varanasi', guardian: 'Alok Tiwari', guardianPhone: '+91 94152 22001' },
  { id: 'STU006', name: 'Anjali Patel', course: 'BBA', year: 2, room: 'D-205', bed: 'C', compatibility: 91, attendance: 94, payment: 'paid', status: 'active', avatar: 'AP', phone: '+91 98790 33445', email: 'anjali.patel@university.edu', city: 'Ahmedabad', guardian: 'Nitin Patel', guardianPhone: '+91 98250 44112' },
  { id: 'STU007', name: 'Suresh Pillai', course: 'B.Tech CSE', year: 4, room: 'C-412', bed: 'B', compatibility: 42, attendance: 72, payment: 'paid', status: 'active', avatar: 'SP', phone: '+91 98470 22910', email: 'suresh.pillai@university.edu', city: 'Kochi', guardian: 'Rajan Pillai', guardianPhone: '+91 98460 11880' },
  { id: 'STU008', name: 'Meera Nair', course: 'M.Tech', year: 1, room: 'A-310', bed: 'A', compatibility: 89, attendance: 97, payment: 'paid', status: 'active', avatar: 'MN', phone: '+91 98950 66773', email: 'meera.nair@university.edu', city: 'Thiruvananthapuram', guardian: 'Arun Nair', guardianPhone: '+91 98470 55661' },
  { id: 'STU009', name: 'Karan Joshi', course: 'B.Tech EE', year: 3, room: 'B-401', bed: 'A', compatibility: 85, attendance: 82, payment: 'pending', status: 'active', avatar: 'KJ', phone: '+91 98112 33490', email: 'karan.joshi@university.edu', city: 'Pune', guardian: 'Deepak Joshi', guardianPhone: '+91 98220 77890' },
  { id: 'STU010', name: 'Divya Saxena', course: 'B.Arch', year: 2, room: 'D-102', bed: 'B', compatibility: 93, attendance: 90, payment: 'paid', status: 'active', avatar: 'DS', phone: '+91 99991 22045', email: 'divya.saxena@university.edu', city: 'Bhopal', guardian: 'Pooja Saxena', guardianPhone: '+91 94250 33118' },
];

export const rooms = [
  { id: 'r1', number: 'A-101', block: 'A', floor: 1, capacity: 4, occupied: 4, compatibility: 89, status: 'full', type: 'quad' },
  { id: 'r2', number: 'A-102', block: 'A', floor: 1, capacity: 4, occupied: 3, compatibility: 91, status: 'available', type: 'quad' },
  { id: 'r3', number: 'A-108', block: 'A', floor: 1, capacity: 2, occupied: 2, compatibility: 76, status: 'full', type: 'double' },
  { id: 'r4', number: 'A-208', block: 'A', floor: 2, capacity: 2, occupied: 2, compatibility: 88, status: 'full', type: 'double' },
  { id: 'r5', number: 'A-310', block: 'A', floor: 3, capacity: 2, occupied: 1, compatibility: 89, status: 'available', type: 'double' },
  { id: 'r6', number: 'B-304', block: 'B', floor: 3, capacity: 4, occupied: 3, compatibility: 94, status: 'available', type: 'quad' },
  { id: 'r7', number: 'B-401', block: 'B', floor: 4, capacity: 2, occupied: 1, compatibility: 85, status: 'available', type: 'double' },
  { id: 'r8', number: 'C-412', block: 'C', floor: 4, capacity: 2, occupied: 2, compatibility: 42, status: 'full', type: 'double' },
  { id: 'r9', number: 'D-102', block: 'D', floor: 1, capacity: 3, occupied: 2, compatibility: 93, status: 'available', type: 'triple' },
  { id: 'r10', number: 'D-205', block: 'D', floor: 2, capacity: 4, occupied: 3, compatibility: 91, status: 'available', type: 'quad' },
  { id: 'r11', number: 'B-105', block: 'B', floor: 1, capacity: 2, occupied: 0, compatibility: 0, status: 'maintenance', type: 'double' },
  { id: 'r12', number: 'C-301', block: 'C', floor: 3, capacity: 4, occupied: 4, compatibility: 87, status: 'full', type: 'quad' },
];

export const complaints = [
  { id: 'CMP-1847', studentId: 'STU001', student: 'Rahul Sharma', room: 'B-304', category: 'Water', priority: 'high', assignedTo: 'Maintenance Team A', created: '2 days ago', createdOn: '2026-09-24', status: 'resolved', description: 'Water leak from ceiling in bathroom area.' },
  { id: 'CMP-1852', studentId: 'STU005', student: 'Vikram Tiwari', room: 'C-412', category: 'Internet', priority: 'medium', assignedTo: 'IT Support', created: '1 day ago', createdOn: '2026-09-25', status: 'in-progress', description: 'WiFi connectivity dropping frequently in the evening.' },
  { id: 'CMP-1855', studentId: 'STU004', student: 'Neha Reddy', room: 'A-108', category: 'Electrical', priority: 'critical', assignedTo: 'Electrician B', created: '6 hrs ago', createdOn: '2026-09-26', status: 'open', description: 'Power socket sparking near bed area. Potential safety hazard.' },
  { id: 'CMP-1856', studentId: 'STU006', student: 'Anjali Patel', room: 'D-205', category: 'Cleaning', priority: 'low', assignedTo: 'Housekeeping', created: '4 hrs ago', createdOn: '2026-09-26', status: 'open', description: 'Common bathroom on Floor 2 needs deep cleaning.' },
  { id: 'CMP-1857', studentId: 'STU009', student: 'Karan Joshi', room: 'B-401', category: 'Water', priority: 'high', assignedTo: 'Maintenance Team A', created: '2 hrs ago', createdOn: '2026-09-26', status: 'open', description: 'No hot water supply since yesterday morning.' },
  { id: 'CMP-1858', studentId: 'STU008', student: 'Meera Nair', room: 'A-310', category: 'Other', priority: 'medium', assignedTo: 'Admin', created: '1 hr ago', createdOn: '2026-09-26', status: 'open', description: 'Room door lock is malfunctioning, difficult to open from inside.' },
];

export const announcements = [
  { id: 'ann1', title: 'Water supply disruption on Sep 28', category: 'Important', priority: 'high', date: 'Sep 26', description: 'Municipal water supply will be disrupted on Sep 28 from 10 AM to 4 PM. Please store water accordingly.' },
  { id: 'ann2', title: 'Mess menu updated for October', category: 'Mess', priority: 'normal', date: 'Sep 25', description: 'The October mess menu has been updated based on student feedback. Check the mess board for details.' },
  { id: 'ann3', title: 'Hostel Day celebration on Oct 5', category: 'Events', priority: 'normal', date: 'Sep 24', description: 'Annual Hostel Day will be celebrated on October 5th. Cultural programs, games, and dinner included.' },
  { id: 'ann4', title: 'Generator maintenance scheduled', category: 'Maintenance', priority: 'medium', date: 'Sep 23', description: 'Generator maintenance scheduled for Sep 29. Expect 30-minute power gaps during testing.' },
  { id: 'ann5', title: 'New visitor policy effective Oct 1', category: 'Hostel', priority: 'high', date: 'Sep 22', description: 'Visitor entry will require prior online approval starting October 1. Register visitors through the app.' },
];

export const matchingFactors = [
  { label: 'Sleep Schedule', scoreA: 96, scoreB: 92, match: 96 },
  { label: 'Cleanliness', scoreA: 90, scoreB: 88, match: 94 },
  { label: 'Noise Tolerance', scoreA: 75, scoreB: 80, match: 91 },
  { label: 'Study Routine', scoreA: 85, scoreB: 82, match: 89 },
  { label: 'Social Lifestyle', scoreA: 60, scoreB: 70, match: 84 },
];

export const studentProfile = {
  id: 'STU001',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@university.edu',
  phone: '+91 98765 43210',
  course: 'B.Tech CSE',
  year: 3,
  room: 'B-304',
  bed: 'B',
  roommate: 'Aman Kumar',
  compatibility: 94,
  avatar: 'RS',
  joinDate: 'Aug 2024',
  profileCompletion: 85,
  lifestyle: {
    sleepSchedule: 'Early sleeper (10–11 PM)',
    cleanliness: 'Very tidy',
    noiseTolerance: 'Moderate',
    studyHabits: 'Consistent (6–8 hrs/day)',
    socialPreference: 'Balanced',
    guestPreference: 'Occasional',
    foodPreference: 'Vegetarian',
  },
  attendance: { present: 92, absent: 5, leave: 3 },
};

export const experienceData = {
  overall: 84,
  breakdown: [
    { label: 'Roommate', value: 91 },
    { label: 'Maintenance', value: 76 },
    { label: 'Cleanliness', value: 82 },
    { label: 'Food', value: 78 },
    { label: 'Security', value: 90 },
    { label: 'Communication', value: 85 },
  ],
  trend: [
    { month: 'Apr', score: 78 },
    { month: 'May', score: 80 },
    { month: 'Jun', score: 79 },
    { month: 'Jul', score: 82 },
    { month: 'Aug', score: 83 },
    { month: 'Sep', score: 84 },
  ],
  blockComparison: [
    { block: 'Block A', score: 86 },
    { block: 'Block B', score: 84 },
    { block: 'Block C', score: 78 },
    { block: 'Block D', score: 88 },
  ],
};

export const HOSTEL_TODAY = '2026-09-26';

export const attendanceRecords = [
  { id: 'ATT-001', studentId: 'STU001', date: '2026-09-26', status: 'present', checkIn: '08:12', method: 'Biometric', gate: 'Block B' },
  { id: 'ATT-002', studentId: 'STU002', date: '2026-09-26', status: 'present', checkIn: '07:58', method: 'Biometric', gate: 'Block A' },
  { id: 'ATT-003', studentId: 'STU003', date: '2026-09-26', status: 'late', checkIn: '09:41', method: 'Biometric', gate: 'Block B' },
  { id: 'ATT-004', studentId: 'STU004', date: '2026-09-26', status: 'present', checkIn: '08:05', method: 'QR Scan', gate: 'Block A' },
  { id: 'ATT-005', studentId: 'STU005', date: '2026-09-26', status: 'leave', checkIn: null, method: 'Leave pass', gate: null },
  { id: 'ATT-006', studentId: 'STU006', date: '2026-09-26', status: 'present', checkIn: '08:22', method: 'Biometric', gate: 'Block D' },
  { id: 'ATT-007', studentId: 'STU007', date: '2026-09-26', status: 'absent', checkIn: null, method: null, gate: null },
  { id: 'ATT-008', studentId: 'STU008', date: '2026-09-26', status: 'present', checkIn: '07:46', method: 'Biometric', gate: 'Block A' },
  { id: 'ATT-009', studentId: 'STU009', date: '2026-09-26', status: 'unmarked', checkIn: null, method: null, gate: null },
  { id: 'ATT-010', studentId: 'STU010', date: '2026-09-26', status: 'present', checkIn: '08:18', method: 'QR Scan', gate: 'Block D' },
];

export const payments = [
  { id: 'PAY-SEP-001', studentId: 'STU001', month: 'September 2026', type: 'Hostel Fee', amount: 12500, dueDate: '2026-09-05', paidOn: null, method: null, txnId: null, status: 'pending', receipt: null },
  { id: 'PAY-SEP-002', studentId: 'STU002', month: 'September 2026', type: 'Hostel Fee', amount: 12500, dueDate: '2026-09-05', paidOn: '2026-09-04', method: 'Net Banking', txnId: 'NB88291044', status: 'paid', receipt: 'RCT-88440' },
  { id: 'PAY-SEP-003', studentId: 'STU003', month: 'September 2026', type: 'Hostel Fee', amount: 12500, dueDate: '2026-09-05', paidOn: null, method: null, txnId: null, status: 'pending', receipt: null },
  { id: 'PAY-SEP-004', studentId: 'STU004', month: 'September 2026', type: 'Hostel Fee', amount: 14000, dueDate: '2026-09-05', paidOn: '2026-09-02', method: 'UPI', txnId: 'UPI202609021902', status: 'paid', receipt: 'RCT-88390' },
  { id: 'PAY-AUG-005', studentId: 'STU005', month: 'August 2026', type: 'Hostel Fee', amount: 12500, dueDate: '2026-08-05', paidOn: null, method: null, txnId: null, status: 'overdue', receipt: null },
  { id: 'PAY-SEP-005', studentId: 'STU005', month: 'September 2026', type: 'Hostel Fee', amount: 12500, dueDate: '2026-09-05', paidOn: null, method: null, txnId: null, status: 'overdue', receipt: null },
  { id: 'PAY-SEP-006', studentId: 'STU006', month: 'September 2026', type: 'Hostel Fee', amount: 11000, dueDate: '2026-09-05', paidOn: '2026-09-01', method: 'Cash', txnId: 'CASH-091', status: 'paid', receipt: 'RCT-88211' },
  { id: 'PAY-SEP-007', studentId: 'STU007', month: 'September 2026', type: 'Hostel Fee', amount: 12500, dueDate: '2026-09-05', paidOn: '2026-09-06', method: 'UPI', txnId: 'UPI202609061011', status: 'paid', receipt: 'RCT-88502' },
  { id: 'PAY-SEP-008', studentId: 'STU008', month: 'September 2026', type: 'Hostel Fee', amount: 14000, dueDate: '2026-09-05', paidOn: '2026-09-03', method: 'Card', txnId: 'CARD-7721', status: 'paid', receipt: 'RCT-88418' },
  { id: 'PAY-SEP-009', studentId: 'STU009', month: 'September 2026', type: 'Hostel Fee', amount: 12500, dueDate: '2026-09-05', paidOn: null, method: null, txnId: null, status: 'pending', receipt: null },
  { id: 'PAY-SEP-009B', studentId: 'STU009', month: 'September 2026', type: 'Mess Advance', amount: 4500, dueDate: '2026-09-10', paidOn: null, method: null, txnId: null, status: 'pending', receipt: null },
  { id: 'PAY-SEP-010', studentId: 'STU010', month: 'September 2026', type: 'Hostel Fee', amount: 11000, dueDate: '2026-09-05', paidOn: '2026-09-04', method: 'UPI', txnId: 'UPI202609041733', status: 'paid', receipt: 'RCT-88455' },
];

export const leaveRequests = [
  { id: 'LV-1041', studentId: 'STU005', type: 'Home visit', from: '2026-09-24', to: '2026-09-30', days: 7, reason: 'Family function for Ganesh Visarjan in Varanasi', destination: 'Varanasi, Uttar Pradesh', emergencyContact: '+91 94152 22001', status: 'approved', appliedOn: '2026-09-21', reviewedBy: 'Warden Mehta', remarks: 'Guardian confirmed on call.' },
  { id: 'LV-1044', studentId: 'STU003', type: 'Medical', from: '2026-09-27', to: '2026-09-28', days: 2, reason: 'Dental extraction at Fortis Noida. Doctor note attached.', destination: 'Noida, Uttar Pradesh', emergencyContact: '+91 94310 77821', status: 'pending', appliedOn: '2026-09-25', reviewedBy: null, remarks: '' },
  { id: 'LV-1045', studentId: 'STU009', type: 'Academic', from: '2026-09-29', to: '2026-10-01', days: 3, reason: 'Presenting paper at IEEE student conference, IIT Delhi', destination: 'New Delhi', emergencyContact: '+91 98220 77890', status: 'pending', appliedOn: '2026-09-24', reviewedBy: null, remarks: '' },
  { id: 'LV-1046', studentId: 'STU002', type: 'Home visit', from: '2026-10-02', to: '2026-10-05', days: 4, reason: 'Sister’s wedding in Jaipur', destination: 'Jaipur, Rajasthan', emergencyContact: '+91 98290 33410', status: 'pending', appliedOn: '2026-09-26', reviewedBy: null, remarks: '' },
  { id: 'LV-1038', studentId: 'STU007', type: 'Personal', from: '2026-09-12', to: '2026-09-14', days: 3, reason: 'Attend cousin’s engagement in Kochi', destination: 'Kochi, Kerala', emergencyContact: '+91 98460 11880', status: 'rejected', appliedOn: '2026-09-09', reviewedBy: 'Warden Mehta', remarks: 'Applied after gate-pass cutoff. Re-apply with 48h notice.' },
  { id: 'LV-1040', studentId: 'STU010', type: 'Academic', from: '2026-09-18', to: '2026-09-19', days: 2, reason: 'Site visit for B.Arch studio, IIM Ahmedabad campus tour', destination: 'Ahmedabad, Gujarat', emergencyContact: '+91 94250 33118', status: 'approved', appliedOn: '2026-09-15', reviewedBy: 'Asst. Warden Rao', remarks: 'Faculty email verified.' },
];

export const maintenanceTasks = [
  { id: 'MNT-218', room: 'B-105', block: 'B', floor: 1, category: 'Plumbing', title: 'Bathroom seepage and damp wall', priority: 'high', status: 'in-progress', assignedTo: 'Ramesh Plumbing Co.', raisedOn: '2026-09-22', due: '2026-09-27', linkedComplaintId: null, notes: 'Room vacated. Tiles opened on 24 Sep.' },
  { id: 'MNT-219', room: 'C-412', block: 'C', floor: 4, category: 'Internet', title: 'Access point replacement — evening drops', priority: 'medium', status: 'in-progress', assignedTo: 'IT Support', raisedOn: '2026-09-25', due: '2026-09-27', linkedComplaintId: 'CMP-1852', notes: 'AP reboot did not help. Spare AP requested.' },
  { id: 'MNT-220', room: 'A-108', block: 'A', floor: 1, category: 'Electrical', title: 'Sparking socket near bed A', priority: 'critical', status: 'open', assignedTo: 'Electrician B', raisedOn: '2026-09-26', due: '2026-09-26', linkedComplaintId: 'CMP-1855', notes: 'Isolate circuit until electrician arrives.' },
  { id: 'MNT-221', room: 'B-401', block: 'B', floor: 4, category: 'Water', title: 'No hot water — geyser inspection', priority: 'high', status: 'open', assignedTo: 'Maintenance Team A', raisedOn: '2026-09-26', due: '2026-09-27', linkedComplaintId: 'CMP-1857', notes: 'Geyser tripped twice this week.' },
  { id: 'MNT-222', room: 'A-310', block: 'A', floor: 3, category: 'Carpentry', title: 'Room door lock jammed from inside', priority: 'medium', status: 'open', assignedTo: 'Unassigned', raisedOn: '2026-09-26', due: '2026-09-28', linkedComplaintId: 'CMP-1858', notes: 'Temporary latch issued to student.' },
  { id: 'MNT-223', room: 'D-205', block: 'D', floor: 2, category: 'Cleaning', title: 'Common bathroom deep clean — Floor 2', priority: 'low', status: 'open', assignedTo: 'Housekeeping', raisedOn: '2026-09-26', due: '2026-09-27', linkedComplaintId: 'CMP-1856', notes: 'Schedule after 9 PM to avoid occupancy.' },
  { id: 'MNT-210', room: 'Block B', block: 'B', floor: 0, category: 'Electrical', title: 'Diesel generator quarterly service', priority: 'high', status: 'overdue', assignedTo: 'PowerCare Services', raisedOn: '2026-09-10', due: '2026-09-21', linkedComplaintId: null, notes: '5 days overdue. Vendor delayed spare parts.' },
];

export const visitors = [
  { id: 'VIS-331', studentId: 'STU001', visitorName: 'Suresh Sharma', relation: 'Father', phone: '+91 98100 11111', purpose: 'Drop winter clothes and medicines for Rahul', expectedAt: '2026-09-26 18:00', inTime: null, outTime: null, status: 'expected', vehicle: 'UP32 AB 4512', idProof: 'Aadhaar **** 2291' },
  { id: 'VIS-332', studentId: 'STU002', visitorName: 'Kavita Sharma', relation: 'Mother', phone: '+91 98290 33410', purpose: 'Weekend visit', expectedAt: '2026-09-26 15:30', inTime: '15:42', outTime: null, status: 'checked-in', vehicle: 'RJ14 CD 2290', idProof: 'Aadhaar **** 1188' },
  { id: 'VIS-333', studentId: 'STU008', visitorName: 'Arun Nair', relation: 'Brother', phone: '+91 98470 55661', purpose: 'Campus visit before returning to Kochi', expectedAt: '2026-09-26 17:00', inTime: null, outTime: null, status: 'pending-approval', vehicle: 'KL07 EF 1022', idProof: 'Driving Licence **** 4401' },
  { id: 'VIS-334', studentId: 'STU006', visitorName: 'Riya Patel', relation: 'Sister', phone: '+91 98790 22110', purpose: 'Drop homemade snacks', expectedAt: '2026-09-26 11:00', inTime: '11:08', outTime: '12:40', status: 'checked-out', vehicle: 'GJ01 HK 3344', idProof: 'Aadhaar **** 7720' },
  { id: 'VIS-335', studentId: 'STU009', visitorName: 'Rohan Deshmukh', relation: 'Friend', phone: '+91 98900 44512', purpose: 'Project discussion', expectedAt: '2026-09-26 19:30', inTime: null, outTime: null, status: 'pending-approval', vehicle: 'MH12 PQ 9081', idProof: 'College ID **** 331' },
  { id: 'VIS-328', studentId: 'STU004', visitorName: 'Srinivas Reddy', relation: 'Father', phone: '+91 98490 11220', purpose: 'Pay remaining mess dues in person', expectedAt: '2026-09-25 16:00', inTime: '16:12', outTime: '17:05', status: 'checked-out', vehicle: 'TS09 MN 2218', idProof: 'Aadhaar **** 6502' },
];

export const messMenu = [
  { id: 'MENU-SAT-B', day: 'Saturday', meal: 'Breakfast', items: 'Poha, jalebi, banana, tea / filter coffee', time: '7:30–9:30 AM', veg: true, available: true },
  { id: 'MENU-SAT-L', day: 'Saturday', meal: 'Lunch', items: 'Dal tadka, jeera rice, mix veg, roti, salad, buttermilk', time: '12:30–2:30 PM', veg: true, available: true },
  { id: 'MENU-SAT-S', day: 'Saturday', meal: 'Snacks', items: 'Samosa, green chutney, masala chai', time: '5:00–6:00 PM', veg: true, available: true },
  { id: 'MENU-SAT-D', day: 'Saturday', meal: 'Dinner', items: 'Veg biryani, raita, papad, gulab jamun', time: '7:30–9:30 PM', veg: true, available: true },
  { id: 'MENU-SUN-B', day: 'Sunday', meal: 'Breakfast', items: 'Masala dosa, sambar, coconut chutney, coffee', time: '8:00–10:00 AM', veg: true, available: true },
  { id: 'MENU-SUN-L', day: 'Sunday', meal: 'Lunch', items: 'Chole, bhature, onion salad, sweet lassi', time: '12:30–2:30 PM', veg: true, available: true },
  { id: 'MENU-SUN-D', day: 'Sunday', meal: 'Dinner', items: 'Paneer butter masala, naan, jeera rice, kheer', time: '7:30–9:30 PM', veg: true, available: true },
];

export const messSkips = [
  { id: 'SKIP-12', studentId: 'STU001', date: '2026-09-26', meal: 'Dinner', reason: 'Going out with roommate Aman to Connaught Place', status: 'approved' },
  { id: 'SKIP-13', studentId: 'STU003', date: '2026-09-26', meal: 'Dinner', reason: 'Same outing as Rahul', status: 'pending' },
  { id: 'SKIP-14', studentId: 'STU005', date: '2026-09-26', meal: 'All meals', reason: 'On approved home leave to Varanasi', status: 'approved' },
  { id: 'SKIP-15', studentId: 'STU009', date: '2026-09-27', meal: 'Lunch', reason: 'Department lab till 3 PM', status: 'pending' },
  { id: 'SKIP-11', studentId: 'STU008', date: '2026-09-25', meal: 'Breakfast', reason: 'Early train from Nizamuddin', status: 'approved' },
];

export const messFeedback = [
  { id: 'FB-401', studentId: 'STU002', meal: 'Lunch', rating: 4, comment: 'Dal was good, rotis were a bit cold in the second serving.', date: '2026-09-26', status: 'open' },
  { id: 'FB-402', studentId: 'STU006', meal: 'Breakfast', rating: 5, comment: 'Poha and jalebi combo was perfect today.', date: '2026-09-26', status: 'open' },
  { id: 'FB-403', studentId: 'STU007', meal: 'Dinner', rating: 2, comment: 'Biryani was oily and under-spiced. Need more raita.', date: '2026-09-25', status: 'acknowledged' },
  { id: 'FB-404', studentId: 'STU010', meal: 'Snacks', rating: 3, comment: 'Samosas ran out by 5:20 PM. Please increase quantity.', date: '2026-09-26', status: 'open' },
];
