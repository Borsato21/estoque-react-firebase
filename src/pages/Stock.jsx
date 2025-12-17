import { useEffect, useState } from "react";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/products";
import AddProductModal from "../components/AddProductModal";
import ProductCard from "../components/ProductCard";
import "../styles/stock.css";

function Stock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();

    const list = Object.entries(data || {}).map(([id, value]) => ({
      id,
      ...value,
    }));

    setProducts(list);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = async (product) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, product);
    } else {
      await addProduct(product);
    }

    setEditingProduct(null);
    setShowModal(false);
    loadProducts();
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="stock-container">
      <h2>Estoque</h2>

      <div className="stock-header">
        <input
          placeholder="Pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
        >
          Adicionar produto
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="stock-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={async () => {
                await deleteProduct(product.id);
                loadProducts();
              }}
              onEdit={() => {
                setEditingProduct(product);
                setShowModal(true);
              }}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
}

export default Stock;
