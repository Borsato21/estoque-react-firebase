import { useEffect, useState, useCallback, useMemo } from "react";
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProducts,
} from "../services/products";

import AddProductModal from "../components/AddProductModal";
import ProductCard from "../components/ProductCard";
import MovimentacaoModal from "../components/MovimentacaoModal";

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

  // 🔥 NOVOS STATES
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/");
  }, [navigate]);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      console.log("PRODUTOS DO BANCO:", data);
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
  const searchLower = search.toLowerCase().trim();

  return products.filter((product) => {
    const nome = (product.nome || "").toLowerCase().trim();
    const codigo = (product.codigo || "").toLowerCase().trim();
    const tipo = (product.tipo || "").toLowerCase().trim();
    const quantidade = String(product.quantidade || "");

    const matchesSearch =
      nome.includes(searchLower) ||
      codigo.includes(searchLower) ||
      tipo.includes(searchLower) ||
      quantidade.includes(searchLower);

    const matchesType =
      typeFilter === "todos" ||
      tipo === typeFilter.toLowerCase().trim();

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
                onMove={(product) => {
                  setSelectedProduct(product);
                  setOpenMoveModal(true);
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

      {/* 🔥 MODAL DE MOVIMENTAÇÃO */}
      <MovimentacaoModal
        open={openMoveModal}
        onClose={() => setOpenMoveModal(false)}
        product={selectedProduct}
        onSuccess={loadProducts}
      />
    </div>
  );
}

export default Stock;