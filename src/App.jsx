import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StudentSidebar from './components/StudentSidebar';
import Topbar from './components/Topbar';
import AICopilot from './components/AICopilot';

// Pages
import LoginPage from './pages/LoginPage';
import GenericPage from './pages/GenericPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import StudentsPage from './pages/StudentsPage';
import RoomsPage from './pages/RoomsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import AIMatchingPage from './pages/AIMatchingPage';
import SmartAllocationPage from './pages/SmartAllocationPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AdminAttendancePage from './pages/AdminAttendancePage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import AdminMaintenancePage from './pages/AdminMaintenancePage';
import AdminVisitorsPage from './pages/AdminVisitorsPage';
import AdminLeavePage from './pages/AdminLeavePage';
import AdminMessPage from './pages/AdminMessPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentRoommate from './pages/StudentRoommate';
import StudentComplaints from './pages/StudentComplaints';
import StudentRoom from './pages/StudentRoom';
import StudentAttendance from './pages/StudentAttendance';
import StudentPayments from './pages/StudentPayments';
import StudentLeave from './pages/StudentLeave';
import StudentVisitors from './pages/StudentVisitors';
import StudentMess from './pages/StudentMess';
import StudentSettings from './pages/StudentSettings';
import StudentHelp from './pages/StudentHelp';

function PageTransition({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
}

function AppLayout({ children, role }) {
  const [collapsed, setCollapsed] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const isStudent = role === 'student';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setAiOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && aiOpen) {
        setAiOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aiOpen]);

  return (
    <div className="app-shell">
      {isStudent ? (
        <StudentSidebar />
      ) : (
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      )}
      <div className={`main-wrapper ${collapsed && !isStudent ? 'main-wrapper--collapsed' : ''}`}>
        <Topbar isStudent={isStudent} onAIClick={() => setAiOpen(true)} />
        <main className="main-content">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
      {!isStudent && <AICopilot isOpen={aiOpen} onClose={() => setAiOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AppLayout role="admin">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="ai-matching" element={<AIMatchingPage />} />
              <Route path="smart-allocation" element={<SmartAllocationPage />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              
              {/* Admin Operations Pages */}
              <Route path="attendance" element={<AdminAttendancePage />} />
              <Route path="leave" element={<AdminLeavePage />} />
              <Route path="maintenance" element={<AdminMaintenancePage />} />
              <Route path="visitors" element={<AdminVisitorsPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="mess" element={<AdminMessPage />} />
              <Route path="ai-insights" element={<GenericPage title="AI Insights" description="Deep predictive analytics for hostel operations." />} />
              <Route path="reports" element={<GenericPage title="Reports" description="Generate printable compliance reports." />} />
              <Route path="settings" element={<GenericPage title="Settings" description="Configure hostel rules and application preferences." />} />
              <Route path="help" element={<GenericPage title="Help & Support" description="Documentation and support tickets." />} />
              <Route path="profile" element={<GenericPage title="Admin Profile" description="Your account details and security." />} />
              
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AppLayout>
        } />

        {/* Student Routes */}
        <Route path="/student/*" element={
          <AppLayout role="student">
            <Routes>
              <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="room" element={<StudentRoom />} />
              <Route path="roommate" element={<StudentRoommate />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="payments" element={<StudentPayments />} />
              <Route path="complaints" element={<StudentComplaints />} />
              <Route path="leave" element={<StudentLeave />} />
              <Route path="visitors" element={<StudentVisitors />} />
              <Route path="mess" element={<StudentMess />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="settings" element={<StudentSettings />} />
              <Route path="help" element={<StudentHelp />} />
              
              <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
            </Routes>
          </AppLayout>
        } />

      </Routes>
    </Router>
  );
}

export default App;
