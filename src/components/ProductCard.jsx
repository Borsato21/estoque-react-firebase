import { useNavigate } from "react-router-dom";

function ProductCard({ product, onDelete, onEdit }) {
  const navigate = useNavigate();

  // 🔥 Só deixa clicável se for impressora (opcional)
  const handleClick = () => {
    if (product.tipo === "impressora") {
      navigate(`/printers/${product.id}`);
    }
  };

  return (
    <div
      className={`product-card ${
        product.tipo === "impressora" ? "clickable" : ""
      }`}
      onClick={handleClick}
    >
      {/* 🖼 IMAGEM */}
      {product.imagem_url && (
        <img
          src={product.imagem_url}
          alt={product.nome}
          loading="lazy"
        />
      )}

      {/* 📦 DADOS */}
      <h4>{product.nome}</h4>
      <p>Código: {product.codigo || "-"}</p>
      <p>Tipo: {product.tipo}</p>
      <p>Qtd: {product.quantidade}</p>

      {/* ✏️ AÇÕES */}
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