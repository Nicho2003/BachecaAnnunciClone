import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import RegisterPage from './pages/RegisterPage'; // Import the new page
import LoginPage from './pages/LoginPage'; // Import the new Login page

// Placeholder Page Components (can be moved to separate files later)
const HomePage = () => <div><h1>Home Page</h1><p>Elenco annunci qui.</p></div>;
// const LoginPage = () => <div><h1>Login Page</h1></div>; // Remove old placeholder
// const RegisterPage = () => <div><h1>Register Page</h1></div>; // Remove old placeholder
const DashboardAziendaPage = () => <div><h1>Dashboard Azienda</h1></div>;
const DashboardCandidatoPage = () => <div><h1>Dashboard Candidato</h1></div>;

function App() {
  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Registrati</Link></li>
          <li><Link to="/dashboard-azienda">Dashboard Azienda</Link></li>
          <li><Link to="/dashboard-candidato">Dashboard Candidato</Link></li>
        </ul>
      </nav>
      <hr />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard-azienda" element={<DashboardAziendaPage />} />
        <Route path="/dashboard-candidato" element={<DashboardCandidatoPage />} />
      </Routes>
    </>
  );
}

export default App;
