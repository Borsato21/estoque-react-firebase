import { useState } from "react";

export default function AddPrinterModal({ onClose, onSave, editingPrinter }) {
  const [model, setModel] = useState(editingPrinter?.model || "");
  const [serialNumber, setSerialNumber] = useState(editingPrinter?.serialNumber || "");
  const [counter, setCounter] = useState(editingPrinter?.counter || "");
  const [observation, setObservation] = useState(editingPrinter?.observation || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!model || !serialNumber || !counter) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    await onSave({
      model,
      serialNumber,
      counter: Number(counter),
      observation,
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <button className="modal-close" onClick={onClose}>×</button>

        <h3>{editingPrinter ? "Editar Impressora" : "Adicionar Impressora"}</h3>

        <input
          placeholder="Modelo da Impressora"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <input
          placeholder="Número de Série"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />

        <input
          type="number"
          placeholder="Contador"
          value={counter}
          onChange={(e) => setCounter(e.target.value)}
        />

        <textarea
          placeholder="Observação"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        />

        <button onClick={handleSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}
