import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminHome from './pages/Admin/AdminHome';
import GuestLogin from './pages/Guest/GuestLogin';
import AdminSignUp from './pages/Admin/AdminSignUp';
import GuestSignUp from './pages/Guest/GuestSignUp';
import AddTournament from './pages/Admin/AddTournament';
import AddTeam from './pages/Admin/AddTeam';
import Teams from './pages/Admin/Teams';


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
        <Route path="/admin/add-team" element={<AddTeam />} />
        <Route path="/admin/teams" element={<Teams />} />
      </Routes>
    </Router>
  );
}

export default App;
