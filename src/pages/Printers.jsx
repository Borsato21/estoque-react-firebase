import { useEffect, useState } from "react";
import {
  addPrinter,
  deletePrinter,
  updatePrinter,
  listenPrinters,
} from "../services/printers";

import AddPrinterModal from "../components/AddPrinterModal";
import "../styles/printers.css";

export default function Printers() {
  const [printers, setPrinters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);

  useEffect(() => {
    const unsubscribe = listenPrinters(setPrinters);
    return () => unsubscribe();
  }, []);

  const handleSave = async (printer) => {
    if (editingPrinter) {
      await updatePrinter(editingPrinter.id, printer);
    } else {
      await addPrinter(printer);
    }

    setEditingPrinter(null);
    setShowModal(false);
  };

  return (
    <div className="printers-container">
      <div className="printers-header">
        <h2>Impressoras</h2>
        <button onClick={() => setShowModal(true)}>Adicionar Impressora</button>
      </div>

      <div className="printers-grid">
        {printers.length === 0 ? (
          <p>Nenhuma impressora cadastrada</p>
        ) : (
          printers.map((printer) => (
            <div key={printer.id} className="printer-card">
              <h4>{printer.model}</h4>
              <p><strong>Série:</strong> {printer.serialNumber}</p>
              <p><strong>Contador:</strong> {printer.counter}</p>
              <p><strong>Obs:</strong> {printer.observation}</p>

              <div className="card-actions">
                <button onClick={() => {
                  setEditingPrinter(printer);
                  setShowModal(true);
                }}>
                  ✏️
                </button>

                <button onClick={() => deletePrinter(printer.id)}>
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
