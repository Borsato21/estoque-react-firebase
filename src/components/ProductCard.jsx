import Icon from './Icon';
const names = { toner: 'Toner', tinta: 'Tinta', cilindro: 'Cilindro', fusao: 'Fusão', 'pecas diversas': 'Peças diversas' };
export default function ProductCard({ product, onDelete, onEdit, onMove }) {
  return <article className="product-row">
    <div className="product-identity"><div className="product-image">{product.imagem_url ? <img src={product.imagem_url} alt={product.nome} loading="lazy"/> : <Icon name="stock" size={24}/>}</div><div><h2>{product.nome}</h2><span className="product-code">{product.codigo || 'Sem código'}</span></div></div>
    <span className="product-type">{names[product.tipo] || product.tipo}</span>
    <p className="product-note">{product.observacao || 'Sem observação'}</p>
    <div className={`product-quantity${Number(product.quantidade) === 0 ? ' is-zero' : ''}`}><strong>{Number(product.quantidade || 0).toLocaleString('pt-BR')}</strong><span>unidades</span></div>
    <div className="row-actions"><button className="move-button" onClick={() => onMove(product)}><Icon name="move"/><span>Movimentar</span></button><button className="icon-button" aria-label={`Editar ${product.nome}`} title="Editar produto" onClick={onEdit}><Icon name="edit"/></button><button className="icon-button danger-action" aria-label={`Excluir ${product.nome}`} title="Excluir produto" onClick={onDelete}><Icon name="trash"/></button></div>
  </article>;
}
