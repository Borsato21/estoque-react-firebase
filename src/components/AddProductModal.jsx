import { useState } from "react";

function AddProductModal({ onClose, onSave, editingProduct }) {
  const [name, setName] = useState(editingProduct?.name || "");
  const [code, setCode] = useState(editingProduct?.code || "");
  const [type, setType] = useState(editingProduct?.type || "");
  const [quantity, setQuantity] = useState(editingProduct?.quantity || "");
  const [image, setImage] = useState(editingProduct?.image || "");
  const [loading, setLoading] = useState(false);

  // 📸 Converter imagem para BASE64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name || !type || !quantity || !image) {
      alert("Preencha todos os campos");
      return;
    }

    setLoading(true);

    await onSave({
      name,
      code,
      type,
      quantity: Number(quantity),
      image,
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <button className="modal-close" onClick={onClose}>×</button>

        <h3>{editingProduct ? "Editar Produto" : "Adicionar Produto"}</h3>

        {/* Imagem */}
        <label className="image-input">
          {image ? <img src={image} alt="Preview" /> : <span>Selecionar imagem</span>}
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </label>

        <input placeholder="Nome do Produto" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Código do Produto (Opcional)" value={code} onChange={(e) => setCode(e.target.value)} />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Selecione o tipo</option>
  <option value="toner">Toner</option>
  <option value="cilindro">Cilindro</option>
  <option value="tinta">Tinta</option>
  <option value="fusao">Fusão</option>
  <option value="pecas diversas">Peças diversas</option>
  <option value="impressora">Impressora</option>
        </select>

        <input
          type="number"
          placeholder="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button onClick={handleSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}

export default AddProductModal;
