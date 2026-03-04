import { useNavigate } from "react-router-dom";

function ProductCard({ product, onDelete, onEdit, onMove }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (product.tipo === "impressora") {
      navigate(`/printers/${product.id}`);
    }
  };

  return (
    <div className="product-card" onClick={handleClick}>
      {product.imagem_url && (
        <img
          src={product.imagem_url}
          alt={product.nome}
          loading="lazy"
        />
      )}

      <h4>{product.nome}</h4>
      <p>Código: {product.codigo || "-"}</p>
      <p>Tipo: {product.tipo}</p>
      <p>Qtd: {product.quantidade}</p>
      <p>Obs: {product.observacao || "-"}</p>

      <div className="card-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          ✏️
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          🗑️
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMove(product);
          }}
        >
          🔄
        </button>
      </div>
    </div>
  );
}

export default ProductCard;