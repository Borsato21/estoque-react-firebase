import { useEffect, useState, useMemo } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../services/firebase";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import ExportCard from "../components/ExportCard";
import "../styles/reports.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

export default function Reports() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal export
  const [openExport, setOpenExport] = useState(false);
  const [exportType, setExportType] = useState(null);

  // filtros exportação
  const [orderBy, setOrderBy] = useState("name-asc");
  const [filterType, setFilterType] = useState("all");
  const [onlyWithStock, setOnlyWithStock] = useState(false);

  // 🔹 FILTROS GRÁFICO 1 (estoque)
  const [stockType, setStockType] = useState("all");

  // 🔹 FILTROS GRÁFICO 2 (movimentação)
  const [moveType, setMoveType] = useState("all"); // entrada | saida
  const [moveProductType, setMoveProductType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔥 Buscar produtos
  useEffect(() => {
    const productsRef = ref(db, "products");

    onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
          quantity: Number(value.quantity || 0),
          createdAt: value.createdAt || null,
          movementType: value.movementType || "entrada", // fallback
        }));
        setProducts(list);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => off(productsRef);
  }, []);

  // ===============================
  // 📊 GRÁFICO 1 – ESTOQUE ATUAL
  // ===============================
  const stockData = useMemo(() => {
    return products.filter((p) => {
      if (stockType !== "all" && p.type !== stockType) return false;
      return p.quantity > 0;
    });
  }, [products, stockType]);

  const byProduct = Object.values(
    stockData.reduce((acc, p) => {
      acc[p.name] = acc[p.name] || { name: p.name, value: 0 };
      acc[p.name].value += p.quantity;
      return acc;
    }, {})
  );

  // ===============================
  // 📊 GRÁFICO 2 – MOVIMENTAÇÕES
  // ===============================
  const movementData = useMemo(() => {
    return products.filter((p) => {
      if (moveProductType !== "all" && p.type !== moveProductType) return false;
      if (moveType !== "all" && p.movementType !== moveType) return false;

      if (startDate && p.createdAt) {
        if (new Date(p.createdAt) < new Date(startDate)) return false;
      }

      if (endDate && p.createdAt) {
        if (new Date(p.createdAt) > new Date(endDate)) return false;
      }

      return true;
    });
  }, [products, moveType, moveProductType, startDate, endDate]);

  const byType = Object.values(
    movementData.reduce((acc, p) => {
      acc[p.type] = acc[p.type] || { name: p.type, value: 0 };
      acc[p.type].value += p.quantity;
      return acc;
    }, {})
  );

  // ===============================
  // 📤 EXPORTAÇÃO
  // ===============================
  const prepareData = () => {
  let data = [...products];

  // 🔹 filtro tipo produto
  if (filterType !== "all") {
    data = data.filter((p) => p.type === filterType);
  }

  // 🔹 somente com estoque
  if (onlyWithStock) {
    data = data.filter((p) => p.quantity > 0);
  }

  // 🔹 tipo de movimentação
  if (moveType !== "all") {
    data = data.filter((p) => p.movementType === moveType);
  }

  // 🔹 período
  if (startDate) {
    data = data.filter(
      (p) => p.createdAt && new Date(p.createdAt) >= new Date(startDate)
    );
  }

  if (endDate) {
    data = data.filter(
      (p) => p.createdAt && new Date(p.createdAt) <= new Date(endDate)
    );
  }

  // 🔹 ordenação
  switch (orderBy) {
    case "name-asc":
      data.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      data.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "qty-asc":
      data.sort((a, b) => a.quantity - b.quantity);
      break;
    case "qty-desc":
      data.sort((a, b) => b.quantity - a.quantity);
      break;
    default:
      break;
  }

  return data;
};


  const handleExport = () => {
    const data = prepareData();

    if (exportType === "excel") {
      const ws = XLSX.utils.json_to_sheet(
        data.map((p) => ({
          Nome: p.name,
          Código: p.code,
          Tipo: p.type,
          Quantidade: p.quantity,
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Estoque");
      XLSX.writeFile(wb, "relatorio-estoque.xlsx");
    }

    if (exportType === "pdf") {
      const doc = new jsPDF();
      doc.text("Relatório de Estoque", 14, 15);

      autoTable(doc, {
        startY: 22,
        head: [["Nome", "Código", "Tipo", "Quantidade"]],
        body: data.map((p) => [
          p.name,
          p.code,
          p.type,
          p.quantity,
        ]),
      });

      doc.save("relatorio-estoque.pdf");
    }

    setOpenExport(false);
    setExportType(null);
  };

  if (loading) return <p>Carregando relatório...</p>;

  return (
    <div className="reports-container">
      <h2>Relatórios</h2>
      <div className="report-actions">
  <button
    onClick={() => {
      setExportType("excel");
      setOpenExport(true);
    }}
  >
    Exportar Excel
  </button>

  <button
    onClick={() => {
      setExportType("pdf");
      setOpenExport(true);
    }}
  >
    Exportar PDF
  </button>
</div>


      {/* ===================== */}
      {/* 📊 GRÁFICO 1 */}
      {/* ===================== */}
      <div className="chart-filters">
        <h4>Estoque Atual</h4>
        <select value={stockType} onChange={(e) => setStockType(e.target.value)}>
          <option value="all">Todos os tipos</option>
          <option value="toner">Toner</option>
          <option value="tinta">Tinta</option>
          <option value="cilindro">Cilindro</option>
          <option value="fusao">Fusão</option>
        </select>
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={byProduct} dataKey="value" label>
              {byProduct.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ===================== */}
      {/* 📊 GRÁFICO 2 */}
      {/* ===================== */}
      <div className="chart-filters">
        <h4>Movimentações</h4>

        <select value={moveProductType} onChange={(e) => setMoveProductType(e.target.value)}>
          <option value="all">Todos os tipos</option>
          <option value="toner">Toner</option>
          <option value="tinta">Tinta</option>
          <option value="fusao">Fusão</option>
        </select>

        <select value={moveType} onChange={(e) => setMoveType(e.target.value)}>
          <option value="all">Entrada + Saída</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={byType} dataKey="value" label>
              {byType.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ExportCard
        open={openExport}
        onClose={() => setOpenExport(false)}
        onConfirm={handleExport}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        filterType={filterType}
        setFilterType={setFilterType}
        onlyWithStock={onlyWithStock}
        setOnlyWithStock={setOnlyWithStock}
      />
    </div>
  );
}
