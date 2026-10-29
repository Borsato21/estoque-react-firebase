import { useEffect, useState } from 'react';
import { addPrinter, deletePrinter, updatePrinter, getPrinters } from '../services/printers';
import AddPrinterModal from '../components/AddPrinterModal';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
export default function Printers() {
  const [printers, setPrinters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  async function loadPrinters() { try { setPrinters(await getPrinters()); setError(''); } catch(error) { setError(error.message); } finally { setLoading(false); } }
  useEffect(() => { let active = true; getPrinters().then(data => { if(active) setPrinters(data); }).catch(error => { if(active) setError(error.message); }).finally(() => { if(active) setLoading(false); }); return () => { active = false; }; }, []);
  async function save(printer) { if(editingPrinter) await updatePrinter(editingPrinter.id, printer); else await addPrinter(printer); setShowModal(false); setEditingPrinter(null); await loadPrinters(); }
  async function remove(printer) { if(!window.confirm(`Excluir a impressora “${printer.model}”, série ${printer.serialNumber}?`)) return; try { await deletePrinter(printer.id); await loadPrinters(); } catch(error) { setError(error.message); } }
  const filtered = printers.filter(p => [p.model,p.serialNumber].join(' ').toLowerCase().includes(search.toLowerCase()));
  return <main className="page-sheet printers-container"><PageHeader title="Impressoras" description="Equipamentos, números de série e contadores." action="Adicionar impressora" onAction={() => { setEditingPrinter(null); setShowModal(true); }}/>
    <div className="list-toolbar"><label className="search-control"><Icon name="search"/><input aria-label="Pesquisar impressoras" placeholder="Pesquisar modelo ou número de série" value={search} onChange={e => setSearch(e.target.value)}/></label><span className="toolbar-count">{filtered.length} equipamentos</span><button className="icon-button" aria-label="Atualizar impressoras" onClick={loadPrinters}><Icon name="refresh"/></button></div>
    {error && <p className="inline-error" role="alert">{error}</p>}
    <div className="printer-list"><div className="printer-list-head"><span>Equipamento</span><span>Número de série</span><span>Observação</span><span className="align-right">Contador</span><span className="align-right">Ações</span></div>
    {loading ? <p className="loading-state" role="status">Carregando impressoras...</p> : filtered.length ? filtered.map(printer => <article className="printer-row" key={printer.id}><div className="printer-identity"><Icon name="printer" size={24}/><h2>{printer.model}</h2></div><span className="serial-number">{printer.serialNumber || '—'}</span><p className="printer-note">{printer.observation || 'Sem observação'}</p><div className="printer-counter"><strong>{Number(printer.counter || 0).toLocaleString('pt-BR')}</strong><span>impressões</span></div><div className="row-actions"><button className="icon-button" aria-label={`Editar ${printer.model}`} onClick={() => { setEditingPrinter(printer); setShowModal(true); }}><Icon name="edit"/></button><button className="icon-button danger-action" aria-label={`Excluir ${printer.model}`} onClick={() => remove(printer)}><Icon name="trash"/></button></div></article>) : <div className="empty-state"><h2>Nenhuma impressora encontrada</h2><p>{printers.length ? 'Tente outro modelo ou número de série.' : 'Cadastre um equipamento para manter as informações por perto.'}</p></div>}</div>
    <footer className="list-footer"><span>{filtered.length} de {printers.length} impressoras</span></footer>
    {showModal && <AddPrinterModal onClose={() => setShowModal(false)} onSave={save} editingPrinter={editingPrinter}/>}
  </main>;
}
