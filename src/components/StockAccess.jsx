import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { logout } from '../services/auth';
import Navbar from './Navbar';

export default function StockAccess({ userId }) {
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    let active = true;
    supabase.from('estoque_membros').select('user_id').eq('user_id', userId).maybeSingle()
      .then(({ data, error }) => { if (active) setStatus(error ? 'error' : data ? 'allowed' : 'denied'); })
      .catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [userId]);
  if (status === 'loading') return <p role="status">Verificando acesso ao estoque...</p>;
  if (status !== 'allowed') return <main>
    <p role="alert">{status === 'denied' ? 'Sua conta ainda não tem acesso ao estoque. Solicite autorização ao administrador.' : 'Não foi possível verificar seu acesso. Recarregue a página para tentar novamente.'}</p>
    <button onClick={() => logout().catch(error => alert(error.message))}>Sair</button>
  </main>;
  return <><Navbar /><Outlet /></>;
}
