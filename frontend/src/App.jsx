// ============================================
// ProvinceApp — Main App Router
// Add new pages here — one import, one Route
// ============================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';

// Layout
import Layout from './components/Layout';
import Toast from './components/Toast';

// Pages
import SelectInstitution from './pages/SelectInstitution';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import RestaurantMenu from './pages/RestaurantMenu';
import Academics from './pages/Academics';
import ChapterDetail from './pages/ChapterDetail';
import FAQ from './pages/FAQ';
import PGListings from './pages/PGListings';
import Clubs from './pages/Clubs';
import ConfessionWall from './pages/ConfessionWall';
import Discussion from './pages/Discussion';
import MockTests from './pages/MockTests';
import CGPACalculator from './pages/CGPACalculator';
import Timetable from './pages/Timetable';
import LostFound from './pages/LostFound';
import CampusMap from './pages/CampusMap';
import Vendors from './pages/Vendors';
import Feedback from './pages/Feedback';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

// Protected route wrapper
const Protected = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        {/* Public */}
        <Route path="/" element={<SelectInstitution />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App — with nav layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantMenu />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/academics/:courseId/:subjectCode/:chapterId" element={<ChapterDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pg" element={<PGListings />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/confession" element={<ConfessionWall />} />
          <Route path="/discussion" element={<Discussion />} />
          <Route path="/mocktest" element={<MockTests />} />
          <Route path="/cgpa" element={<CGPACalculator />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/lostfound" element={<LostFound />} />
          <Route path="/map" element={<CampusMap />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Protected routes */}
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
