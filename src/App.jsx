import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StudentSidebar from './components/StudentSidebar';
import Topbar from './components/Topbar';
import AICopilot from './components/AICopilot';

// Pages
import LoginPage from './pages/LoginPage';

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
import AdminInsightsPage from './pages/AdminInsightsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminHelpPage from './pages/AdminHelpPage';
import AdminProfilePage from './pages/AdminProfilePage';

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
  const [menuVisible, setMenuVisible] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const isStudent = role === 'student';
  const location = useLocation();

  useEffect(() => {
    setMenuVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        window.dispatchEvent(new Event('matchomate:open-search'));
      }
      if (e.key === 'Escape' && aiOpen) {
        setAiOpen(false);
      }
      if (e.key === 'Escape') setMenuVisible(false);
      if (e.key === 'Escape') window.dispatchEvent(new Event('matchomate:close-search'));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aiOpen]);

  return (
    <div className={`app-shell ${menuVisible ? 'app-shell--menu-open' : ''}`}>
      {menuVisible && <button
        className="sidebar-backdrop"
        type="button"
        onClick={() => setMenuVisible(false)}
        aria-label="Close main menu"
      />}
      {isStudent ? (
        <StudentSidebar />
      ) : (
        <Sidebar />
      )}
      <div className="main-wrapper">
        <Topbar
          isStudent={isStudent}
          onAIClick={() => setAiOpen(true)}
          onMenuToggle={() => setMenuVisible((visible) => !visible)}
          menuOpen={menuVisible}
        />
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
              <Route path="announcements" element={<AnnouncementsPage audience="admin" />} />
              
              {/* Admin Operations Pages */}
              <Route path="attendance" element={<AdminAttendancePage />} />
              <Route path="leave" element={<AdminLeavePage />} />
              <Route path="maintenance" element={<AdminMaintenancePage />} />
              <Route path="visitors" element={<AdminVisitorsPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="mess" element={<AdminMessPage />} />
              <Route path="ai-insights" element={<AdminInsightsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="help" element={<AdminHelpPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
              
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
              <Route path="announcements" element={<AnnouncementsPage audience="student" />} />
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
