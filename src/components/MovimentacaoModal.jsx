import { useState } from 'react';
import { registrarMovimentacao } from '../services/movimentacoes';
import Dialog from './Dialog';
export default function MovimentacaoModal({open,onClose,product,onSuccess}) {
  const [tipo,setTipo] = useState('entrada'); const [quantidade,setQuantidade] = useState(''); const [observacao,setObservacao] = useState(''); const [loading,setLoading] = useState(false); const [error,setError] = useState('');
  if(!open || !product) return null;
  async function save(event) { event.preventDefault();setLoading(true);setError('');try {await registrarMovimentacao({produto_id:product.id,tipo,quantidade:Number(quantidade),observacao});await onSuccess();onClose();} catch(error) {setError(error.message);} finally {setLoading(false);} }
  const next = Number(product.quantidade) + (tipo === 'entrada' ? 1 : -1) * Number(quantidade);
  return <Dialog title="Movimentar estoque" onClose={onClose}><div className="movement-product"><strong>{product.nome}</strong><span>Saldo atual: {product.quantidade} unidades</span></div><form className="form-stack" onSubmit={save}>
    <div className="form-columns"><label>Movimentação<select value={tipo} onChange={e => setTipo(e.target.value)}><option value="entrada">Entrada</option><option value="saida">Saída</option></select></label><label>Quantidade<input type="number" min="1" step="1" required value={quantidade} onChange={e => setQuantidade(e.target.value)}/></label></div>
    {quantidade && <p className="balance-preview">Saldo após a movimentação<strong>{next.toLocaleString('pt-BR')} unidades</strong></p>}
    <label>Observação <span className="optional">Opcional</span><textarea rows="3" value={observacao} onChange={e => setObservacao(e.target.value)} placeholder="Ex.: reposição, venda ou manutenção"/></label>
    {error && <p className="inline-error" role="alert">{error}</p>}
    <footer className="dialog-actions"><button type="button" disabled={loading} onClick={onClose}>Cancelar</button><button className="primary-button" disabled={loading || next < 0}>{loading ? 'Registrando...' : 'Registrar movimentação'}</button></footer>
    {next < 0 && <p className="field-help">A quantidade de saída é maior que o saldo disponível.</p>}
  </form></Dialog>;
}
