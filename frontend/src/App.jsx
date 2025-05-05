import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminHome from "./pages/Admin/AdminHome";
import GuestLogin from "./pages/Guest/GuestLogin";
import AdminSignUp from "./pages/Admin/AdminSignUp";
import GuestSignUp from "./pages/Guest/GuestSignUp";
import AddTournament from "./pages/Admin/AddTournament";
import AddTeam from "./pages/Admin/AddTeam";
import Teams from "./pages/Admin/Teams";
import EditTeam from "./pages/Admin/EditTeam";
import Tournaments from "./pages/Admin/Tournaments";
import EditTournament from "./pages/Admin/EditTournament";
import DeleteTournaments from "./pages/Admin/DeleteTournaments";
import MatchDetails from "./pages/Admin/MatchDetails";
import Venues from "./pages/Admin/Venues";
// import ProtectedRoute from './components/ProtectedRoute';
import Tournaments_DetailedMatchStats from "./pages/Admin/Tournaments_DetailedMatchStats";
import Matches_DetailedMatchStats from "./pages/Admin/Matches_DetailedMatchStats";
import DetailedMatchStats from "./pages/Admin/DetailedMatchStats";
import GuestHome from "./pages/Guest/GuestHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/guest/login" element={<GuestLogin />} />
        <Route path="/guest/signup" element={<GuestSignUp />} />

        {/* Protected Routes */}
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/admin/add-tournament" element={<AddTournament />} />
        <Route path="/admin/add-team" element={<AddTeam />} />
        <Route path="/admin/teams" element={<Teams />} />
        <Route path="/admin/teams/:teamId/edit" element={<EditTeam />} />
        <Route path="/admin/tournaments" element={<Tournaments />} />
        <Route
          path="/admin/tournaments/:tournamentId/edit"
          element={<EditTournament />}
        />
        <Route
          path="/admin/delete-tournament"
          element={<DeleteTournaments />}
        />
        <Route path="/admin/match-details" element={<MatchDetails />} />
        <Route path="/admin/venues" element={<Venues />} />
        <Route
          path="/admin/detailed-match-stats"
          element={<Tournaments_DetailedMatchStats />}
        />
        <Route
          path="/admin/detailed-match-stats/:tournamentId/matches"
          element={<Matches_DetailedMatchStats />}
        />
        <Route
          path="/admin/detailed-match-stats/:tournamentId/:matchId/match-stats"
          element={<DetailedMatchStats />}
        />
        <Route path = "/guest/home" element={<GuestHome />} />
      </Routes>
    </Router>
  );
}

export default App;
