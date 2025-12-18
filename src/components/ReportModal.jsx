import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function ReportModal({ products, onClose }) {
  const [type, setType] = useState("todos");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const normalize = (text = "") =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filtered = products
    .filter((p) =>
      type === "todos" ? true : normalize(p.type) === normalize(type)
    )
    .sort((a, b) => {
      const valueA = orderBy === "name" ? a.name : a.quantity;
      const valueB = orderBy === "name" ? b.name : b.quantity;

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });

  // 📊 EXCEL (.xlsx)
  const exportExcel = () => {
    const data = filtered.map((p) => ({
      Nome: p.name,
      Código: p.code,
      Tipo: p.type,
      Quantidade: p.quantity,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");

    XLSX.writeFile(workbook, "relatorio-estoque.xlsx");
  };

  // 📄 PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Relatório de Estoque", 14, 15);

    doc.setFontSize(10);
    doc.text(
      `Tipo: ${type} | Ordenado por: ${orderBy} (${order})`,
      14,
      22
    );

    autoTable(doc, {
      startY: 28,
      head: [["Nome", "Código", "Tipo", "Quantidade"]],
      body: filtered.map((p) => [
        p.name,
        p.code,
        p.type,
        p.quantity,
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [30, 30, 30] },
    });

    doc.save("relatorio-estoque.pdf");
  };

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h3>Relatório de Estoque</h3>

        <div className="report-filters">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="toner">Toner</option>
            <option value="cilindro">Cilindro</option>
            <option value="tinta">Tinta</option>
            <option value="fusao">Fusão</option>
            <option value="pecas diversas">Peças diversas</option>
            <option value="impressora">Impressora</option>
          </select>

          <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value="name">Nome</option>
            <option value="quantity">Quantidade</option>
          </select>

          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>

        <div className="report-actions">
          <button onClick={exportExcel}>📊 Excel</button>
          <button onClick={exportPDF}>📕 PDF</button>
        </div>

        <table className="report-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Código</th>
              <th>Tipo</th>
              <th>Qtd</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.code}</td>
                <td>{p.type}</td>
                <td>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportModal;
