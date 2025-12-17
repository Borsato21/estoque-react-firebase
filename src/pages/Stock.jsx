import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebase";
import { addProduct, deleteProduct } from "../services/products";
import AddProductModal from "../components/AddProductModal";
import ProductCard from "../components/ProductCard";
import "../styles/stock.css";

function Stock() {
  const [products, setProducts] = useState({});
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const productsRef = ref(db, "products");
    onValue(productsRef, (snapshot) => {
      setProducts(snapshot.val() || {});
    });
  }, []);

  const handleSaveProduct = async (product) => {
    await addProduct(product);
  };

  const filteredProducts = Object.entries(products).filter(
    ([, product]) =>
      product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="stock-container">
      <h2>Estoque</h2>

      <div className="stock-header">
        <input
          placeholder="Pesquisar pelo nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => setShowModal(true)}>
          Adicionar produto
        </button>
      </div>

      <div className="stock-grid">
        {filteredProducts.map(([id, product]) => (
          <ProductCard
            key={id}
            product={product}
            onDelete={() => deleteProduct(id)}
          />
        ))}
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

export default Stock;

