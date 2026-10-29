import { useState } from 'react';
import Dialog from './Dialog';
export default function AddPrinterModal({onClose,onSave,editingPrinter}) {
  const [form,setForm] = useState({model:editingPrinter?.model || '',serialNumber:editingPrinter?.serialNumber || '',counter:editingPrinter?.counter ?? '',observation:editingPrinter?.observation || ''});
  const [loading,setLoading] = useState(false); const [error,setError] = useState('');
  const field = name => ({value:form[name],onChange:e => setForm({...form,[name]:e.target.value})});
  async function save(event) { event.preventDefault(); setLoading(true); setError(''); try { await onSave({...form,counter:Number(form.counter)}); } catch(error) {setError(error.message);} finally {setLoading(false);} }
  return <Dialog title={editingPrinter ? 'Editar impressora' : 'Adicionar impressora'} onClose={onClose}><form className="form-stack" onSubmit={save}>
    <label>Modelo<input required placeholder="Ex.: Brother DCP-L5652DN" {...field('model')}/></label>
    <label>Número de série<input required {...field('serialNumber')}/></label>
    <label>Contador de impressões<input required type="number" min="0" step="1" {...field('counter')}/></label>
    <label>Observação <span className="optional">Opcional</span><textarea rows="3" {...field('observation')}/></label>
    {error && <p className="inline-error" role="alert">{error}</p>}
    <footer className="dialog-actions"><button type="button" disabled={loading} onClick={onClose}>Cancelar</button><button className="primary-button" disabled={loading}>{loading ? 'Salvando...' : 'Salvar impressora'}</button></footer>
  </form></Dialog>;
}
