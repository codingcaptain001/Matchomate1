import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as seed from '../data/mockData';

const HostelContext = createContext(null);

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function paymentStatusForStudent(studentId, payments) {
  const mine = payments.filter((p) => p.studentId === studentId);
  if (mine.some((p) => p.status === 'overdue')) return 'overdue';
  if (mine.some((p) => p.status === 'pending')) return 'pending';
  return 'paid';
}

function nowLabel() {
  return 'just now';
}

export function HostelProvider({ children }) {
  const [students, setStudents] = useState(() => clone(seed.students));
  const [rooms, setRooms] = useState(() => clone(seed.rooms));
  const [complaints, setComplaints] = useState(() => clone(seed.complaints));
  const [attendance, setAttendance] = useState(() => clone(seed.attendanceRecords));
  const [payments, setPayments] = useState(() => clone(seed.payments));
  const [leaveRequests, setLeaveRequests] = useState(() => clone(seed.leaveRequests));
  const [maintenance, setMaintenance] = useState(() => clone(seed.maintenanceTasks));
  const [visitors, setVisitors] = useState(() => clone(seed.visitors));
  const [messMenu, setMessMenu] = useState(() => clone(seed.messMenu));
  const [messSkips, setMessSkips] = useState(() => clone(seed.messSkips));
  const [messFeedback, setMessFeedback] = useState(() => clone(seed.messFeedback));
  const [announcements, setAnnouncements] = useState(() => clone(seed.announcements));
  const [recentActivity, setRecentActivity] = useState(() => clone(seed.recentActivity));
  const [currentStudentId] = useState('STU001'); // Rahul Sharma
  const [movements, setMovements] = useState([
    { id: 'm-2', studentId: 'STU001', type: 'IN', time: '06:18 PM', date: seed.HOSTEL_TODAY, location: 'Block B Main Gate (Biometric)' },
    { id: 'm-1', studentId: 'STU001', type: 'OUT', time: '08:42 AM', date: seed.HOSTEL_TODAY, location: 'Campus Library Gate' },
  ]);
  const [hydrating, setHydrating] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setHydrating(false), 450);
    return () => clearTimeout(t);
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const pushActivity = useCallback((text, type = 'ops', icon = 'CheckCircle') => {
    setRecentActivity((prev) => [
      { id: `a-${Date.now()}`, type, text, time: nowLabel(), icon },
      ...prev,
    ].slice(0, 12));
  }, []);

  const studentById = useCallback(
    (id) => students.find((s) => s.id === id) || null,
    [students]
  );

  const syncStudentPayment = useCallback((studentId, nextPayments) => {
    const status = paymentStatusForStudent(studentId, nextPayments);
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, payment: status } : s)));
  }, []);

  const markAttendance = useCallback((studentId, status) => {
    const student = students.find((s) => s.id === studentId);
    const now = new Date();
    const checkIn = status === 'present' || status === 'late'
      ? `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      : null;

    setAttendance((prev) => {
      const existing = prev.find((r) => r.studentId === studentId && r.date === seed.HOSTEL_TODAY);
      if (existing) {
        return prev.map((r) => (r.id === existing.id
          ? { ...r, status, checkIn, method: status === 'leave' ? 'Leave pass' : 'Manual', gate: r.gate || 'Admin desk' }
          : r));
      }
      return [
        ...prev,
        {
          id: `ATT-${studentId}-${Date.now()}`,
          studentId,
          date: seed.HOSTEL_TODAY,
          status,
          checkIn,
          method: 'Manual',
          gate: 'Admin desk',
        },
      ];
    });

    setStudents((prev) => prev.map((s) => {
      if (s.id !== studentId) return s;
      let pct = s.attendance;
      if (status === 'present') pct = Math.min(100, pct + 0.4);
      if (status === 'late') pct = Math.min(100, pct + 0.1);
      if (status === 'absent') pct = Math.max(40, pct - 1.5);
      return { ...s, attendance: Math.round(pct * 10) / 10 };
    }));

    showToast(`${student?.name || 'Student'} marked ${status}.`);
    pushActivity(`Attendance updated for ${student?.name}: ${status}`, 'attendance', 'ClipboardCheck');
  }, [students, showToast, pushActivity]);

  const markAllUnmarkedPresent = useCallback(() => {
    const now = new Date();
    const checkIn = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const unmarked = new Set();
    setAttendance((prev) => {
      const next = prev.map((row) => ({ ...row }));
      students.forEach((s) => {
        const rec = next.find((a) => a.studentId === s.id && a.date === seed.HOSTEL_TODAY);
        if (!rec || rec.status === 'unmarked') {
          unmarked.add(s.id);
          if (rec) {
            rec.status = 'present';
            rec.checkIn = checkIn;
            rec.method = 'Bulk mark';
            rec.gate = rec.gate || 'Admin desk';
          } else {
            next.push({
              id: `ATT-${s.id}-bulk`,
              studentId: s.id,
              date: seed.HOSTEL_TODAY,
              status: 'present',
              checkIn,
              method: 'Bulk mark',
              gate: 'Admin desk',
            });
          }
        }
      });
      return next;
    });
    if (unmarked.size === 0) {
      showToast('Everyone is already marked for today.');
      return;
    }
    setStudents((prev) => prev.map((s) => (
      unmarked.has(s.id) ? { ...s, attendance: Math.min(100, Math.round((s.attendance + 0.4) * 10) / 10) } : s
    )));
    showToast(`Marked ${unmarked.size} unmarked student(s) present.`);
    pushActivity(`Bulk attendance: ${unmarked.size} students marked present`, 'attendance', 'ClipboardCheck');
  }, [students, showToast, pushActivity]);

  const markPaymentPaid = useCallback((paymentId, method = 'UPI') => {
    const target = payments.find((p) => p.id === paymentId);
    if (!target) return;
    const studentId = target.studentId;
    const amount = target.amount;
    const student = students.find((s) => s.id === studentId);
    const paidOn = seed.HOSTEL_TODAY;
    const txnId = `${method.replace(/\s/g, '').toUpperCase()}${Date.now().toString().slice(-8)}`;
    const receipt = `RCT-${Math.floor(88000 + Math.random() * 1000)}`;

    const nextPayments = payments.map((p) => (
      p.id === paymentId ? { ...p, status: 'paid', paidOn, method, txnId, receipt } : p
    ));

    setPayments(nextPayments);
    syncStudentPayment(studentId, nextPayments);

    showToast(`₹${amount.toLocaleString('en-IN')} marked paid for ${student?.name || 'student'}.`);
    pushActivity(`Payment of ₹${amount.toLocaleString('en-IN')} received from ${student?.name}`, 'payment', 'CreditCard');
  }, [payments, students, syncStudentPayment, showToast, pushActivity]);

  const sendPaymentReminder = useCallback((paymentId) => {
    const p = payments.find((x) => x.id === paymentId);
    const student = students.find((s) => s.id === p?.studentId);
    showToast(`Reminder sent to ${student?.name} (${student?.phone}).`);
    pushActivity(`Fee reminder sent to ${student?.name}`, 'payment', 'CreditCard');
  }, [payments, students, showToast, pushActivity]);

  const updateComplaint = useCallback((complaintId, patch) => {
    const target = complaints.find((c) => c.id === complaintId);
    if (!target) return;
    const studentName = target.student;

    setComplaints((prev) => prev.map((c) => (c.id === complaintId ? { ...c, ...patch } : c)));

    if (patch.status === 'resolved') {
      setMaintenance((prev) => prev.map((m) => (
        m.linkedComplaintId === complaintId && m.status !== 'completed'
          ? { ...m, status: 'completed', notes: `${m.notes} Closed with complaint ${complaintId}.` }
          : m
      )));
    } else if (patch.status === 'in-progress') {
      setMaintenance((prev) => prev.map((m) => (
        m.linkedComplaintId === complaintId && m.status === 'open'
          ? { ...m, status: 'in-progress' }
          : m
      )));
    }

    if (patch.status) {
      showToast(`Complaint ${complaintId} → ${patch.status.replace('-', ' ')}.`);
      pushActivity(`Complaint ${complaintId} ${patch.status} — ${studentName}`, 'complaint', 'CheckCircle2');
    } else if (patch.assignedTo) {
      showToast(`${complaintId} assigned to ${patch.assignedTo}.`);
    }
  }, [complaints, showToast, pushActivity]);

  const updateMaintenance = useCallback((taskId, patch) => {
    const task = maintenance.find((m) => m.id === taskId);
    if (!task) return;
    const title = task.title;

    setMaintenance((prev) => prev.map((m) => (m.id === taskId ? { ...m, ...patch } : m)));

    if (patch.status === 'completed') {
      if (task.room && task.room.includes('-')) {
        setRooms((roomsPrev) => roomsPrev.map((r) => (
          r.number === task.room && r.status === 'maintenance'
            ? { ...r, status: 'available' }
            : r
        )));
      }
      if (task.linkedComplaintId) {
        setComplaints((cPrev) => cPrev.map((c) => (
          c.id === task.linkedComplaintId && c.status !== 'resolved'
            ? { ...c, status: 'resolved' }
            : c
        )));
      }
      showToast(`Maintenance completed: ${title}`);
      pushActivity(`Maintenance completed — ${title}`, 'maintenance', 'Wrench');
    } else {
      showToast('Maintenance task updated.');
    }
  }, [maintenance, showToast, pushActivity]);

  const updateVisitor = useCallback((visitorId, action) => {
    const v = visitors.find((x) => x.id === visitorId);
    if (!v) return;
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const visitorName = v.visitorName;
    const studentId = v.studentId;
    const host = students.find((s) => s.id === studentId);

    setVisitors((prev) => prev.map((item) => {
      if (item.id !== visitorId) return item;
      if (action === 'approve') return { ...item, status: 'expected' };
      if (action === 'deny') return { ...item, status: 'denied' };
      if (action === 'check-in') return { ...item, status: 'checked-in', inTime: hhmm };
      if (action === 'check-out') return { ...item, status: 'checked-out', outTime: hhmm };
      return item;
    }));

    const labels = { approve: 'approved for entry', deny: 'denied', 'check-in': 'checked in at gate', 'check-out': 'checked out from campus' };
    showToast(`${visitorName} ${labels[action]} (Host: ${host?.name || 'Student'}).`);
    pushActivity(`Visitor ${visitorName} ${labels[action]} for ${host?.name}`, 'visitor', 'UserCheck');
  }, [visitors, students, showToast, pushActivity]);

  const reviewLeave = useCallback((leaveId, status, remarks = '') => {
    const l = leaveRequests.find((x) => x.id === leaveId);
    if (!l) return;
    const studentId = l.studentId;
    const from = l.from;
    const to = l.to;
    const student = students.find((s) => s.id === studentId);

    setLeaveRequests((prev) => prev.map((item) => {
      if (item.id !== leaveId) return item;
      return { ...item, status, reviewedBy: 'Warden Mehta', remarks: remarks || item.remarks };
    }));

    if (status === 'approved') {
      const today = seed.HOSTEL_TODAY;
      if (from <= today && today <= to) {
        setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, status: 'on-leave' } : s)));
        setAttendance((prev) => prev.map((a) => (
          a.studentId === studentId && a.date === today
            ? { ...a, status: 'leave', method: 'Leave pass', checkIn: null }
            : a
        )));
      }
      showToast(`Leave approved for ${student?.name || 'Student'}.`);
      pushActivity(`Leave approved for ${student?.name} (${from}–${to})`, 'leave', 'Calendar');
    } else if (status === 'rejected') {
      showToast(`Leave rejected for ${student?.name || 'Student'}.`);
      pushActivity(`Leave rejected for ${student?.name}`, 'leave', 'Calendar');
    } else if (status === 'completed') {
      setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, status: 'active' } : s)));
      showToast(`${student?.name || 'Student'} marked returned from leave.`);
      pushActivity(`${student?.name} returned from leave`, 'leave', 'UserCheck');
    }
  }, [leaveRequests, students, showToast, pushActivity]);

  const reviewMessSkip = useCallback((skipId, status) => {
    let studentId;
    let meal;
    setMessSkips((prev) => prev.map((s) => {
      if (s.id !== skipId) return s;
      studentId = s.studentId;
      meal = s.meal;
      return { ...s, status };
    }));
    const student = students.find((s) => s.id === studentId);
    showToast(`${meal} skip ${status} for ${student?.name}.`);
  }, [students, showToast]);

  const toggleMenuAvailability = useCallback((menuId) => {
    setMessMenu((prev) => prev.map((m) => (m.id === menuId ? { ...m, available: !m.available } : m)));
    showToast('Mess menu updated.');
  }, [showToast]);

  const acknowledgeFeedback = useCallback((fbId) => {
    setMessFeedback((prev) => prev.map((f) => (f.id === fbId ? { ...f, status: 'acknowledged' } : f)));
    showToast('Feedback acknowledged. Kitchen team notified.');
  }, [showToast]);

  const complaintStats = useMemo(() => {
    const open = complaints.filter((c) => c.status === 'open').length;
    const inProgress = complaints.filter((c) => c.status === 'in-progress').length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;
    const critical = complaints.filter((c) => c.priority === 'critical' && c.status !== 'resolved').length;
    const categories = seed.complaintData.categories.map((cat) => ({
      ...cat,
      count: complaints.filter((c) => c.category === cat.name).length || cat.count,
    }));
    return {
      ...seed.complaintData,
      total: complaints.length,
      open,
      inProgress,
      resolved,
      critical,
      categories,
    };
  }, [complaints]);

  const kpi = useMemo(() => ({
    ...seed.kpiData,
    openComplaints: {
      ...seed.kpiData.openComplaints,
      value: complaintStats.open + complaintStats.inProgress,
    },
  }), [complaintStats]);

  const currentStudent = useMemo(() => students.find((s) => s.id === currentStudentId) || students[0], [students, currentStudentId]);
  const currentMovementStatus = movements[0]?.type || 'IN';

  const markMovement = useCallback((type, location = 'Campus Gate') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setMovements((prev) => [
      {
        id: `m-${Date.now()}`,
        studentId: currentStudentId,
        type,
        time: timeStr,
        date: seed.HOSTEL_TODAY,
        location,
      },
      ...prev,
    ]);

    if (type === 'IN') {
      setAttendance((prev) => {
        const existing = prev.find((a) => a.studentId === currentStudentId && a.date === seed.HOSTEL_TODAY);
        if (existing) {
          return prev.map((a) => a.id === existing.id ? { ...a, status: 'present', checkIn: hhmm, method: 'Self Check-in', gate: location } : a);
        }
        return [...prev, { id: `ATT-${currentStudentId}-${Date.now()}`, studentId: currentStudentId, date: seed.HOSTEL_TODAY, status: 'present', checkIn: hhmm, method: 'Self Check-in', gate: location }];
      });
      showToast(`Marked IN at ${timeStr}. Welcome back!`);
      pushActivity(`Rahul Sharma marked IN at ${timeStr} (${location})`, 'attendance', 'ClipboardCheck');
    } else {
      showToast(`Marked OUT at ${timeStr}. Gate pass recorded.`);
      pushActivity(`Rahul Sharma marked OUT at ${timeStr} (${location})`, 'attendance', 'UserCheck');
    }
  }, [currentStudentId, showToast, pushActivity]);

  const addComplaint = useCallback((newCmp) => {
    const id = `CMP-${Math.floor(1860 + Math.random() * 100)}`;
    const full = {
      id,
      studentId: currentStudentId,
      student: currentStudent?.name || 'Rahul Sharma',
      room: currentStudent?.room || 'B-304',
      category: newCmp.category || 'General',
      priority: newCmp.priority || 'medium',
      assignedTo: 'Admin',
      created: 'Just now',
      createdOn: seed.HOSTEL_TODAY,
      status: 'open',
      description: newCmp.description || '',
    };
    setComplaints((prev) => [full, ...prev]);
    showToast(`Complaint ${id} registered successfully.`);
    pushActivity(`New complaint ${id} raised by ${full.student} (${full.category})`, 'complaint', 'AlertCircle');
    return id;
  }, [currentStudentId, currentStudent, showToast, pushActivity]);

  const applyLeave = useCallback((req) => {
    const id = `LV-${Math.floor(1050 + Math.random() * 100)}`;
    const full = {
      id,
      studentId: currentStudentId,
      type: req.type || 'Home visit',
      from: req.from,
      to: req.to,
      days: req.days || 2,
      reason: req.reason,
      destination: req.destination,
      emergencyContact: req.emergencyContact || currentStudent?.guardianPhone || '+91 98100 11111',
      status: 'pending',
      appliedOn: seed.HOSTEL_TODAY,
      reviewedBy: null,
      remarks: '',
    };
    setLeaveRequests((prev) => [full, ...prev]);
    showToast(`Leave request ${id} submitted to warden.`);
    pushActivity(`Leave request submitted by ${currentStudent?.name || 'Rahul Sharma'} (${full.from} to ${full.to})`, 'leave', 'Calendar');
    return id;
  }, [currentStudentId, currentStudent, showToast, pushActivity]);

  const addVisitor = useCallback((vis) => {
    const id = `VIS-${Math.floor(340 + Math.random() * 100)}`;
    const full = {
      id,
      studentId: currentStudentId,
      visitorName: vis.visitorName,
      relation: vis.relation || 'Friend',
      phone: vis.phone || '',
      purpose: vis.purpose || 'Campus visit',
      expectedAt: vis.expectedAt || `${seed.HOSTEL_TODAY} 16:00`,
      inTime: null,
      outTime: null,
      status: 'pending-approval',
      vehicle: vis.vehicle || 'Walk-in',
      idProof: vis.idProof || 'Govt ID',
    };
    setVisitors((prev) => [full, ...prev]);
    showToast(`Visitor pass request ${id} sent for gate approval.`);
    pushActivity(`Visitor pass requested for ${full.visitorName} by ${currentStudent?.name || 'Rahul Sharma'}`, 'visitor', 'UserCheck');
    return id;
  }, [currentStudentId, currentStudent, showToast, pushActivity]);

  const addMessSkip = useCallback((skip) => {
    const id = `SKIP-${Math.floor(20 + Math.random() * 80)}`;
    const full = {
      id,
      studentId: currentStudentId,
      date: skip.date || seed.HOSTEL_TODAY,
      meal: skip.meal || 'Dinner',
      reason: skip.reason || 'Personal outing',
      status: 'pending',
    };
    setMessSkips((prev) => [full, ...prev]);
    showToast(`${full.meal} skip requested.`);
    return id;
  }, [currentStudentId, showToast]);

  const addMessFeedback = useCallback((fb) => {
    const id = `FB-${Math.floor(410 + Math.random() * 90)}`;
    const full = {
      id,
      studentId: currentStudentId,
      meal: fb.meal || 'Lunch',
      rating: fb.rating || 5,
      comment: fb.comment || '',
      date: seed.HOSTEL_TODAY,
      status: 'open',
    };
    setMessFeedback((prev) => [full, ...prev]);
    showToast('Feedback submitted to kitchen warden.');
    return id;
  }, [currentStudentId, showToast]);

  const value = {
    hydrating,
    toast,
    showToast,
    today: seed.HOSTEL_TODAY,
    currentStudentId,
    currentStudent,
    movements,
    currentMovementStatus,
    students,
    rooms,
    complaints,
    attendance,
    payments,
    leaveRequests,
    maintenance,
    visitors,
    messMenu,
    messSkips,
    messFeedback,
    announcements,
    setAnnouncements,
    recentActivity,
    complaintStats,
    kpi,
    hostelHealth: seed.hostelHealth,
    occupancyData: seed.occupancyData,
    roommateIntelligence: seed.roommateIntelligence,
    aiAttentionItems: seed.aiAttentionItems,
    studentById,
    markAttendance,
    markAllUnmarkedPresent,
    markPaymentPaid,
    sendPaymentReminder,
    updateComplaint,
    updateMaintenance,
    updateVisitor,
    reviewLeave,
    reviewMessSkip,
    toggleMenuAvailability,
    acknowledgeFeedback,
    markMovement,
    addComplaint,
    applyLeave,
    addVisitor,
    addMessSkip,
    addMessFeedback,
  };

  return (
    <HostelContext.Provider value={value}>
      {children}
      {toast && <div className="ops-toast">{toast}</div>}
    </HostelContext.Provider>
  );
}

export function useHostelStore() {
  const ctx = useContext(HostelContext);
  if (!ctx) throw new Error('useHostelStore must be used within HostelProvider');
  return ctx;
}
