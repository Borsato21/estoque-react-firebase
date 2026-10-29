import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { logout } from '../services/auth';
import Icon from './Icon';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const close = event => { if(event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  const title = { '/estoque': 'Estoque', '/impressoras': 'Impressoras', '/relatorios': 'Relatórios' }[location.pathname] || 'Operação';
  return <>
    <aside className={`sidebar${open ? ' is-open' : ''}`}>
      <NavLink className="brand" to="/estoque" onClick={() => setOpen(false)}><img src="/LogoBlito.png" alt=""/><span>blito<span className="brand-caption">Copiadoras</span></span></NavLink>
      <div className="workspace-name"><span className="workspace-dot"/>Controle de estoque</div>
      <nav aria-label="Navegação principal" className="nav-links">
        <NavLink to="/estoque" onClick={() => setOpen(false)}><Icon name="stock"/>Estoque</NavLink>
        <NavLink to="/impressoras" onClick={() => setOpen(false)}><Icon name="printer"/>Impressoras</NavLink>
        <NavLink to="/relatorios" onClick={() => setOpen(false)}><Icon name="chart"/>Relatórios</NavLink>
      </nav>
      <div className="sidebar-bottom"><p>Blito Copiadoras<span>Gestão de materiais e equipamentos</span></p><button className="logout-button" onClick={() => logout().catch(error => alert(error.message))}><Icon name="logout"/>Sair da conta</button></div>
    </aside>
    <div className="app-topbar"><button className="icon-button mobile-menu" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'}/></button><span>Blito Copiadoras <span className="breadcrumb-separator">/</span> <strong>{title}</strong></span><span className="session-indicator">Área da equipe</span></div>
    {open && <button className="nav-backdrop" aria-label="Fechar navegação" onClick={() => setOpen(false)}/>}
  </>;
}
