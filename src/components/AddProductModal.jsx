import { useState } from 'react';
import { uploadImage } from '../services/storage';
import Dialog from './Dialog';
export default function AddProductModal({ onClose, onSave, editingProduct }) {
  const [form, setForm] = useState({nome:editingProduct?.nome || '',codigo:editingProduct?.codigo || '',tipo:editingProduct?.tipo || '',quantidade:editingProduct?.quantidade ?? '',observacao:editingProduct?.observacao || ''});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(editingProduct?.imagem_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const field = name => ({value:form[name],onChange:e => setForm({...form,[name]:e.target.value})});
  function chooseImage(event) {
    const file = event.target.files[0]; if(!file) return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5242880) { setError('Selecione uma imagem JPEG, PNG ou WebP de até 5 MB.'); return; }
    setError(''); setImage(file); const reader = new FileReader(); reader.onload = () => setPreview(reader.result); reader.readAsDataURL(file);
  }
  async function save(event) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const imagem_url = image ? await uploadImage(image) : editingProduct?.image_path || editingProduct?.imagem_url || '';
      await onSave({...form,nome:form.nome.trim(),quantidade:Number(form.quantidade),imagem_url});
    } catch(error) { setError(error.message || 'Não foi possível salvar o produto.'); } finally { setLoading(false); }
  }
  return <Dialog title={editingProduct ? 'Editar produto' : 'Adicionar produto'} onClose={onClose}>
    <form className="form-stack" onSubmit={save}>
      <label className="image-picker">{preview && <img src={preview} alt="Imagem selecionada"/>}<span><strong>{preview ? 'Trocar imagem' : 'Adicionar imagem'}</strong><small>JPEG, PNG ou WebP, até 5 MB. Opcional.</small></span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} aria-label="Imagem do produto"/></label>
      <label>Nome do produto<input required {...field('nome')} placeholder="Ex.: Toner Brother TN-3472"/></label>
      <div className="form-columns"><label>Código <span className="optional">Opcional</span><input {...field('codigo')}/></label><label>Tipo<select required {...field('tipo')}><option value="">Selecione</option><option value="toner">Toner</option><option value="tinta">Tinta</option><option value="cilindro">Cilindro</option><option value="fusao">Fusão</option><option value="pecas diversas">Peças diversas</option></select></label></div>
      <label>Quantidade em estoque<input type="number" min="0" step="1" required {...field('quantidade')}/></label>
      {editingProduct && <p className="field-help">Para registrar entradas e saídas no histórico, use Movimentar no estoque.</p>}
      <label>Observação <span className="optional">Opcional</span><textarea rows="2" {...field('observacao')}/></label>
      {error && <p role="alert" className="inline-error">{error}</p>}
      <footer className="dialog-actions"><button type="button" onClick={onClose} disabled={loading}>Cancelar</button><button className="primary-button" disabled={loading}>{loading ? 'Salvando...' : 'Salvar produto'}</button></footer>
    </form>
  </Dialog>;
}
