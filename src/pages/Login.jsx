import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/estoque");
    } catch {
      setError("Email ou senha inválidos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Estoque Blito</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
          <p
  className="forgot-password"
  onClick={() => setShowForgot(true)}
>
  Esqueceu a senha?
</p>

        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
      {showForgot && (
  <ForgotPasswordModal onClose={() => setShowForgot(false)} />
)}

    </div>
    
  );
}

export default Login;
