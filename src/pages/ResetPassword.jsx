import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import '../styles/login.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmation) return setMessage('As senhas precisam ser iguais.');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      navigate('/estoque', { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return <div className="login-container"><div className="login-card">
    <h2>Redefinir senha</h2>
    <p>Abra o link recebido por email antes de definir sua nova senha.</p>
    <form onSubmit={handleSubmit}>
      <input aria-label="Nova senha" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} />
      <input aria-label="Confirme a nova senha" type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={e => setConfirmation(e.target.value)} />
      <button disabled={loading}>{loading ? 'Salvando...' : 'Salvar senha'}</button>
      {message && <p role="alert">{message}</p>}
    </form>
  </div></div>;
}
