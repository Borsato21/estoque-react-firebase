import { useNavigate } from "react-router-dom";

function ProductCard({ product, onDelete, onEdit }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (product.type === "impressora") {
      navigate(`/impressoras/${product.id}`);
    }
  };

  return (
    <div
      className={`product-card ${
        product.type === "impressora" ? "clickable" : ""
      }`}
      onClick={handleClick}
    >
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
      )}

      <h4>{product.name}</h4>
      <p>Código: {product.code || "-"}</p>
      <p>Tipo: {product.type}</p>
      <p>Qtd: {product.quantity}</p>

      <div className="card-actions">
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          ✏️
        </button>

        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
