import { useState } from "react";

function AddProductModal({ onClose, onSave, editingProduct }) {
  const [nome, setNome] = useState(editingProduct?.nome || "");
  const [codigo, setCodigo] = useState(editingProduct?.codigo || "");
  const [tipo, setTipo] = useState(editingProduct?.tipo || "");
  const [quantidade, setQuantidade] = useState(
    editingProduct?.quantidade || ""
  );
  const [imagem_url, setImagemUrl] = useState(
    editingProduct?.imagem_url || ""
  );
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImagemUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!nome || !tipo || !quantidade || !imagem_url) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    const productData = {
      nome,
      codigo,
      tipo,
      quantidade: Number(quantidade),
      imagem_url,
    };

    await onSave(productData);

    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h3>{editingProduct ? "Editar Produto" : "Adicionar Produto"}</h3>

        <label className="image-input">
          {imagem_url ? (
            <img src={imagem_url} alt="Preview" />
          ) : (
            <span>Selecionar imagem</span>
          )}
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </label>

        <input
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          placeholder="Código do Produto (Opcional)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Selecione o tipo</option>
          <option value="toner">Toner</option>
          <option value="cilindro">Cilindro</option>
          <option value="tinta">Tinta</option>
          <option value="fusao">Fusão</option>
          <option value="pecas diversas">Peças diversas</option>
        </select>

        <input
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />

        <button onClick={handleSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}

export default AddProductModal;