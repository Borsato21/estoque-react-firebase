function ProductCard({ product, onDelete }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Quantidade: {product.quantity}</p>

      <button onClick={onDelete}>Excluir</button>
    </div>
  );
}

export default ProductCard;
