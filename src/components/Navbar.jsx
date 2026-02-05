import { NavLink } from "react-router-dom";
import { logout } from "../services/firebase";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h3>📦 Blito</h3>

      <div className="nav-links">
        <NavLink to="/estoque">Estoque</NavLink>
              <NavLink to="/impressoras">Impressoras</NavLink>
<NavLink to="/relatorios">Relatórios</NavLink>

      </div>

      <button onClick={logout}>🚪</button>
    </nav>
  );
}
