import { useState } from "react";
import { resetPassword } from "../services/firebase";

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      alert("Digite um email");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      alert("Email de recuperação enviado!");
      onClose();
    } catch (error) {
      console.error(error);

      if (error.code === "auth/user-not-found") {
        alert("Email não encontrado. Fale com o administrador.");
      } else if (error.code === "auth/invalid-email") {
        alert("Email inválido.");
      } else {
        alert("Erro ao enviar email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Recuperar senha</h3>

        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSend} disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
