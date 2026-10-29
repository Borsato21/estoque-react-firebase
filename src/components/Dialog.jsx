import { useEffect, useId, useRef } from 'react';
import Icon from './Icon';

export default function Dialog({ title, onClose, children, wide = false }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(ref.current?.querySelectorAll('button:not([disabled]), input:not([hidden]), select, textarea, [tabindex="0"]') || []);
    focusable()[0]?.focus();
    function handleKey(event) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [onClose]);
  return <div className="modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section ref={ref} className={`modal${wide ? ' modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <header className="dialog-header"><h2 id={titleId}>{title}</h2><button className="icon-button" aria-label="Fechar" onClick={onClose}><Icon name="close" /></button></header>
      {children}
    </section>
  </div>;
}
