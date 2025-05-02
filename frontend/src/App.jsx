import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminPage from './pages/Admin/AdminPage';
import AdminHome from './pages/Admin/AdminHome';
import GuestLogin from './pages/Guest/GuestLogin';
import AdminSignUp from './pages/Admin/AdminSignUp';
import GuestSignUp from './pages/Guest/GuestSignUp';
import AddTournament from './pages/Admin/AddTournament';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/guest/login" element={<GuestLogin />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/guest/signup" element={<GuestSignUp />} />
        <Route path="/admin/add-tournament" element={<AddTournament />} />
      </Routes>
    </Router>
  );
}

export default App;
