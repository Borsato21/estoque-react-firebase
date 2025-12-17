import { useState } from "react";
import { uploadImage } from "../services/storage";

function AddProductModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSave = async () => {
    if (!name || !quantity || !file) return;

    setLoading(true);

    const imageUrl = await uploadImage(file);

    await onSave({
      name,
      quantity: Number(quantity),
      image: imageUrl,
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* BOTÃO FECHAR */}
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h3>Adicionar Produto</h3>

        <label className="image-input">
          {preview ? (
            <img src={preview} alt="Preview" />
          ) : (
            <span>Selecionar ou tirar foto</span>
          )}

          <input
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={handleImageChange}
          />
        </label>

        <input
          placeholder="Nome do produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantidade em estoque"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button className="save" onClick={handleSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}

export default AddProductModal;
