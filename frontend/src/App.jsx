import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminHome from './pages/Admin/AdminHome';
import GuestLogin from './pages/Guest/GuestLogin';
import AdminSignUp from './pages/Admin/AdminSignUp';
import GuestSignUp from './pages/Guest/GuestSignUp';
import AddTournament from './pages/Admin/AddTournament';
import AddTeam from './pages/Admin/AddTeam';
import Teams from './pages/Admin/Teams';
import EditTeam from './pages/Admin/EditTeam';
import Tournaments from './pages/Admin/Tournaments';
import EditTournament from './pages/Admin/EditTournament';
import DeleteTournaments from './pages/Admin/DeleteTournaments';
import MatchDetails from './pages/Admin/MatchDetails';
import Venues from './pages/Admin/Venues';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/guest/login" element={<GuestLogin />} />
        <Route path="/guest/signup" element={<GuestSignUp />} />

        {/* Protected Routes */}
        <Route path="/admin/home" element={<ProtectedRoute element={<AdminHome />} />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/admin/add-tournament" element={<ProtectedRoute element={<AddTournament />} />} />
        <Route path="/admin/add-team" element={<ProtectedRoute element={<AddTeam />} />} />
        <Route path="/admin/teams" element={<ProtectedRoute element={<Teams />} />} />
        <Route path="/admin/teams/:teamId/edit" element={<ProtectedRoute element={<EditTeam />}  />} />
        <Route path="/admin/tournaments" element={<ProtectedRoute element={<Tournaments />}  />} />
        <Route path="/admin/tournaments/:tournamentId/edit" element={<ProtectedRoute element={<EditTournament />}  />} />
        <Route path="/admin/delete-tournament" element={<ProtectedRoute element={<DeleteTournaments />}  />} />
        <Route path="/admin/match-details" element={<ProtectedRoute element={<MatchDetails />}  />} />
        <Route path="/admin/venues" element={<ProtectedRoute element={<Venues />}  />} />
      </Routes>
    </Router>
  );
}

export default App;
