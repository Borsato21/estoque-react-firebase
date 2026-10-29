import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import StockAccess from './components/StockAccess';
import Stock from './pages/Stock';
import Reports from './pages/Reports';
import Printers from './pages/Printers';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    let receivedEvent = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => {
      receivedEvent = true;
      if (active) { setSession(current); setLoading(false); }
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || receivedEvent) return;
      if (error) setError('Não foi possível carregar sua sessão. Tente novamente.');
      setSession(data.session);
      setLoading(false);
    }).catch(() => {
      if (active) { setError('Não foi possível conectar ao serviço de login.'); setLoading(false); }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  if (loading) return <p role="status">Carregando sessão...</p>;
  if (error) return <p role="alert">{error} <button onClick={() => window.location.reload()}>Recarregar</button></p>;
  return <>
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/estoque" replace /> : <Login />} />
      <Route path="/redefinir-senha" element={<ResetPassword />} />
      <Route path="/" element={<Navigate to={session ? '/estoque' : '/login'} replace />} />
      <Route element={session ? <StockAccess key={session.user.id} userId={session.user.id} /> : <Navigate to="/login" replace />}>
        <Route path="/estoque" element={<Stock />} />
        <Route path="/impressoras" element={<Printers />} />
        <Route path="/relatorios" element={<Reports />} />
      </Route>
      <Route path="*" element={<h2>Página não encontrada</h2>} />
    </Routes>
  </>;
}
