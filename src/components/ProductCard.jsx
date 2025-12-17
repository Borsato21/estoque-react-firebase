function ProductCard({ product, onDelete, onEdit }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <h4>{product.name}</h4>
      <p>Código: {product.code}</p>
      <p>Tipo: {product.type}</p>
      <p>Qtd: {product.quantity}</p>

      <div className="card-actions">
        <button className="edit-btn" onClick={onEdit}>
          ✏️
        </button>

        <button className="delete-btn" onClick={onDelete}>
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
