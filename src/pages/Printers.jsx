import { useEffect, useState } from "react";
import {
  addPrinter,
  deletePrinter,
  updatePrinter,
  getPrinters,
} from "../services/printers";

import AddPrinterModal from "../components/AddPrinterModal";
import "../styles/printers.css";

export default function Printers() {
  const [printers, setPrinters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);

  async function loadPrinters() {
    try {
      const data = await getPrinters();
      setPrinters(data);
    } catch (error) {
      console.error("Erro ao carregar impressoras:", error);
    }
  }

  useEffect(() => {
    let active = true;
    getPrinters().then(data => { if (active) setPrinters(data); }).catch(error => { if (active) alert(error.message); });
    return () => { active = false; };
  }, []);

  const handleSave = async (printer) => {
      if (editingPrinter) {
        await updatePrinter(editingPrinter.id, printer);
      } else {
        await addPrinter(printer);
      }

      setEditingPrinter(null);
      setShowModal(false);

      // Recarrega lista após salvar
      loadPrinters();

  };

  const handleDelete = async (id) => {
    try {
      await deletePrinter(id);
      loadPrinters();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
    <div className="printers-container">
      <div className="printers-header">
        <h2>Impressoras</h2>
        <button onClick={() => setShowModal(true)}>
          Adicionar Impressora
        </button>
      </div>

      <div className="printers-grid">
        {printers.length === 0 ? (
          <p>Nenhuma impressora cadastrada</p>
        ) : (
          printers.map((printer) => (
            <div key={printer.id} className="printer-card">
              <h4>{printer.model}</h4>
              <p><strong>Série:</strong> {printer.serial_number}</p>
              <p><strong>Contador:</strong> {printer.counter}</p>
              <p><strong>Obs:</strong> {printer.observation}</p>

              <div className="card-actions">
                <button
                  onClick={() => {
                    setEditingPrinter(printer);
                    setShowModal(true);
                  }}
                >
                  ✏️
                </button>

                <button onClick={() => handleDelete(printer.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <AddPrinterModal
          onClose={() => {
            setShowModal(false);
            setEditingPrinter(null);
          }}
          onSave={handleSave}
          editingPrinter={editingPrinter}
        />
      )}
    </div>
  );
}