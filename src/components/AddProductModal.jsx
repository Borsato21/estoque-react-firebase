import { useState } from "react";

function AddProductModal({ onClose, onSave, editingProduct }) {
  const [name, setName] = useState(editingProduct?.name || "");
  const [code, setCode] = useState(editingProduct?.code || "");
  const [type, setType] = useState(editingProduct?.type || "");
  const [quantity, setQuantity] = useState(editingProduct?.quantity || "");
  const [image, setImage] = useState(editingProduct?.image || "");
  const [loading, setLoading] = useState(false);

  // 🖨️ CAMPOS IMPRESSORA
  const [serialNumber, setSerialNumber] = useState(
    editingProduct?.printers?.[0]?.serialNumber || ""
  );
  const [counter, setCounter] = useState(
    editingProduct?.printers?.[0]?.counter || ""
  );
  const [printerObservation, setPrinterObservation] = useState(
    editingProduct?.printers?.[0]?.observation || ""
  );

  // 🔥 CAMPO FUSÃO
  const [fusionObservation, setFusionObservation] = useState(
    editingProduct?.observation || ""
  );

  // 📸 imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name || !type || !quantity || !image) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    // validações específicas
    if (type === "impressora") {
      if (!serialNumber || !counter || !printerObservation) {
        alert("Preencha todos os dados da impressora");
        return;
      }
    }

    if (type === "fusao") {
      if (!fusionObservation) {
        alert("Informe a observação da fusão");
        return;
      }
    }

    setLoading(true);

    const productData = {
      name,
      code,
      type,
      quantity: Number(quantity),
      image,
    };

    // 🖨️ dados da impressora
    if (type === "impressora") {
      productData.printers = [
        {
          serialNumber,
          counter: Number(counter),
          observation: printerObservation,
        },
      ];
    }

    // 🔥 dados da fusão
    if (type === "fusao") {
      productData.observation = fusionObservation;
    }

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

        {/* imagem */}
        <label className="image-input">
          {image ? <img src={image} alt="Preview" /> : <span>Selecionar imagem</span>}
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </label>

        <input
          placeholder="Nome do Produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Código do Produto (Opcional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
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
