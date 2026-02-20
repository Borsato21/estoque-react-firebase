import { useEffect, useState, useCallback, useMemo } from "react";
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProducts,
} from "../services/products";

import AddProductModal from "../components/AddProductModal";
import ProductCard from "../components/ProductCard";
import "../styles/stock.css";
import { logout } from "../services/firebase";
import { useNavigate } from "react-router-dom";

function Stock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/");
  }, [navigate]);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = useCallback(
    async (product) => {
      try {
        if (editingProduct) {
          await updateProduct(editingProduct.id, product);
        } else {
          await addProduct(product);
        }

        await loadProducts();
        setEditingProduct(null);
        setShowModal(false);
      } catch (error) {
        console.error("Erro ao salvar produto:", error);
      }
    },
    [editingProduct]
  );

  const filteredProducts = useMemo(() => {
    const searchLower = search.toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.nome?.toLowerCase().includes(searchLower) ||
        product.codigo?.toLowerCase().includes(searchLower) ||
        product.tipo?.toLowerCase().includes(searchLower) ||
        String(product.quantidade).includes(searchLower);

      const matchesType =
        typeFilter === "todos" ||
        product.tipo?.toLowerCase() === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [products, search, typeFilter]);

  return (
    <div className="stock-container">
      <div className="stock-header-top">
        <h2>Estoque Blito</h2>
      </div>

      <br />

      <div className="stock-header">
        <input
          placeholder="Pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="todos">Todos os tipos</option>
          <option value="toner">Toner</option>
          <option value="cilindro">Cilindro</option>
          <option value="tinta">Tinta</option>
          <option value="fusao">Fusão</option>
          <option value="pecas diversas">Peças diversas</option>
        </select>

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
          {filteredProducts.length === 0 ? (
            <p>Nenhum produto encontrado</p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={async () => {
                  await deleteProduct(product.id);
                  await loadProducts();
                }}
                onEdit={() => {
                  setEditingProduct(product);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </div>
      )}

      {showModal && (
        <AddProductModal
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
}

export default Stock;