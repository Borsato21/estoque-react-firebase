import { useEffect, useState } from "react";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/products";
import AddProductModal from "../components/AddProductModal";
import ProductCard from "../components/ProductCard";
import ReportModal from "../components/ReportModal"; // 👈 novo
import "../styles/stock.css";
import { logout } from "../services/firebase";
import { useNavigate } from "react-router-dom";

function Stock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [showReport, setShowReport] = useState(false); // 👈 novo
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🚪 Logout
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // 📦 Carregar produtos
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

  // 💾 Salvar (add ou edit)
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

  // 🔍 Filtro por texto + tipo
  const filteredProducts = products.filter((product) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product.code.toLowerCase().includes(searchLower) ||
      product.type.toLowerCase().includes(searchLower) ||
      String(product.quantity).includes(searchLower);

    const matchesType =
      typeFilter === "todos" ||
      product.type.toLowerCase() === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="stock-container">
      {/* Topo */}
      <div className="stock-header-top">
        <h2>Estoque Blito</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowReport(true)}>
            📄 Relatório
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </div>

      <br />

      {/* Pesquisa + filtro + add */}
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
          <option value="impressora">Impressora</option>
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

      {/* Lista */}
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
                  loadProducts();
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

      {/* Modal Add / Edit */}
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

      {/* Modal Relatório */}
      {showReport && (
        <ReportModal
          products={products}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}

export default Stock;
