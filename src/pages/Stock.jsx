import { useCallback, useEffect, useMemo, useState } from 'react';
import { addProduct, deleteProduct, updateProduct, getProducts } from '../services/products';
import AddProductModal from '../components/AddProductModal';
import ProductCard from '../components/ProductCard';
import MovimentacaoModal from '../components/MovimentacaoModal';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
export default function Stock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const loadProducts = useCallback(async () => {
    setError('');
    try { setProducts(await getProducts()); }
    catch (error) { setError(error.message || 'Não foi possível carregar os produtos.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    let active = true;
    getProducts().then(data => { if (active) setProducts(data); }).catch(error => { if (active) setError(error.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const filtered = useMemo(() => products.filter(product => {
    const text = [product.nome, product.codigo, product.tipo, product.quantidade].join(' ').toLocaleLowerCase('pt-BR');
    return text.includes(search.trim().toLocaleLowerCase('pt-BR')) && (typeFilter === 'todos' || product.tipo === typeFilter);
  }), [products, search, typeFilter]);
  const total = filtered.reduce((sum, p) => sum + Number(p.quantidade || 0), 0);
  async function saveProduct(product) {
    if (editingProduct) await updateProduct(editingProduct.id, product); else await addProduct(product);
    setNotice(editingProduct ? 'Produto atualizado.' : 'Produto adicionado.');
    setShowModal(false); setEditingProduct(null); await loadProducts();
  }
  async function removeProduct(product) {
    if (!window.confirm(`Excluir o produto “${product.nome}”? Esta ação não pode ser desfeita.`)) return;
    try { await deleteProduct(product.id); setNotice('Produto excluído.'); await loadProducts(); }
    catch { setError('Não foi possível excluir. Produtos com movimentações precisam ser mantidos no histórico.'); }
  }
  return <main className="page-sheet stock-container">
    <PageHeader title="Estoque" description="Materiais, peças e suprimentos para sua operação." action="Adicionar produto" onAction={() => { setEditingProduct(null); setShowModal(true); }}/>
    <div className="stock-overview"><span><strong>{loading ? '—' : total.toLocaleString('pt-BR')}</strong> unidades em estoque</span><span>{filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'} {search || typeFilter !== 'todos' ? 'no resultado' : 'cadastrados'}</span></div>
    <div className="list-toolbar"><label className="search-control"><Icon name="search"/><input aria-label="Pesquisar produtos" placeholder="Pesquisar nome, código ou tipo" value={search} onChange={e => setSearch(e.target.value)}/></label><label className="filter-control"><span>Tipo</span><select aria-label="Filtrar por tipo" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}><option value="todos">Todos os tipos</option><option value="toner">Toner</option><option value="cilindro">Cilindro</option><option value="tinta">Tinta</option><option value="fusao">Fusão</option><option value="pecas diversas">Peças diversas</option></select></label><button className="icon-button refresh-button" aria-label="Atualizar produtos" onClick={loadProducts}><Icon name="refresh"/></button></div>
    {error && <div className="inline-error" role="alert">{error}<button onClick={loadProducts}>Tentar novamente</button></div>}
    {notice && <div className="inline-notice" role="status">{notice}<button className="icon-button" aria-label="Fechar aviso" onClick={() => setNotice('')}><Icon name="close" size={14}/></button></div>}
    <div className="product-list"><div className="product-list-head"><span>Produto</span><span>Tipo</span><span>Observação</span><span className="align-right">Saldo</span><span className="align-right">Ações</span></div>
      {loading ? <div className="loading-state" role="status">Carregando produtos...</div> : filtered.length ? filtered.map(product => <ProductCard key={product.id} product={product} onDelete={() => removeProduct(product)} onEdit={() => { setEditingProduct(product); setShowModal(true); }} onMove={setSelectedProduct}/>) : <div className="empty-state"><h2>{products.length ? 'Nenhum produto encontrado' : 'Seu estoque começa aqui'}</h2><p>{products.length ? 'Tente outro nome ou selecione todos os tipos.' : 'Adicione seu primeiro material para acompanhar o saldo.'}</p></div>}
    </div>
    {!loading && <footer className="list-footer"><span>{filtered.length} de {products.length} produtos</span><span>Saldo em unidades</span></footer>}
    {showModal && <AddProductModal onClose={() => setShowModal(false)} onSave={saveProduct} editingProduct={editingProduct}/>}
    {selectedProduct && <MovimentacaoModal open onClose={() => setSelectedProduct(null)} product={selectedProduct} onSuccess={() => { setNotice('Movimentação registrada.'); loadProducts(); }}/>}
  </main>;
}
