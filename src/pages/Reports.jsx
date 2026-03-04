import { useEffect, useState, useMemo } from "react";
import { getProducts } from "../services/products";
import { getMovimentacoes } from "../services/movimentacoes";

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
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openExport, setOpenExport] = useState(false);
  const [exportType, setExportType] = useState(null);

  const [moveType, setMoveType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔥 NOVOS FILTROS
  const [stockProductType, setStockProductType] = useState("all");
  const [movementProductType, setMovementProductType] = useState("all");

  /* ================================
     🔥 CARREGAR DADOS
  ================================= */
  useEffect(() => {
    async function loadData() {
      try {
        const produtos = await getProducts();
        const movs = await getMovimentacoes();

        setProducts(produtos || []);
        setMovimentacoes(movs || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /* ================================
     📊 GRÁFICO 1 – ESTOQUE ATUAL
  ================================= */
  const byProduct = useMemo(() => {
    const filtered = products.filter((p) => {
      if (stockProductType !== "all" && p.tipo !== stockProductType)
        return false;
      return true;
    });

    return Object.values(
      filtered.reduce((acc, p) => {
        acc[p.nome] = acc[p.nome] || { name: p.nome, value: 0 };
        acc[p.nome].value += Number(p.quantidade || 0);
        return acc;
      }, {})
    );
  }, [products, stockProductType]);

  /* ================================
     📊 GRÁFICO 2 – ENTRADA vs SAÍDA
  ================================= */
  const movementData = useMemo(() => {
    return movimentacoes.filter((m) => {
      if (moveType !== "all" && m.tipo !== moveType) return false;

      if (
        movementProductType !== "all" &&
        m.produtos?.tipo !== movementProductType
      )
        return false;

      if (startDate && m.created_at) {
        if (new Date(m.created_at) < new Date(startDate)) return false;
      }

      if (endDate && m.created_at) {
        if (new Date(m.created_at) > new Date(endDate)) return false;
      }

      return true;
    });
  }, [
    movimentacoes,
    moveType,
    movementProductType,
    startDate,
    endDate,
  ]);

  const byType = Object.values(
    movementData.reduce((acc, m) => {
      acc[m.tipo] = acc[m.tipo] || { name: m.tipo, value: 0 };
      acc[m.tipo].value += Number(m.quantidade || 0);
      return acc;
    }, {})
  );

  /* ================================
     📤 EXPORTAÇÃO MOVIMENTAÇÕES
  ================================= */
  const handleExport = () => {
    const data = movementData;

    if (data.length === 0) {
      alert("Nenhuma movimentação para exportar.");
      return;
    }

    if (exportType === "excel") {
      const ws = XLSX.utils.json_to_sheet(
        data.map((m) => ({
          Produto: m.produtos?.nome || "-",
          "Tipo Produto": m.produtos?.tipo || "-",
          Movimentação: m.tipo,
          Quantidade: m.quantidade,
          Data: m.created_at
            ? new Date(m.created_at).toLocaleDateString()
            : "-",
          Observação: m.observacao || "-",
        }))
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Movimentações");
      XLSX.writeFile(wb, "relatorio-movimentacoes.xlsx");
    }

    if (exportType === "pdf") {
      const doc = new jsPDF();
      doc.text("Relatório de Movimentações", 14, 15);

      autoTable(doc, {
        startY: 22,
        head: [
          [
            "Produto",
            "Tipo Produto",
            "Movimentação",
            "Quantidade",
            "Data",
            "Observação",
          ],
        ],
        body: data.map((m) => [
          m.produtos?.nome || "-",
          m.produtos?.tipo || "-",
          m.tipo,
          m.quantidade,
          m.created_at
            ? new Date(m.created_at).toLocaleDateString()
            : "-",
          m.observacao || "-",
        ]),
      });

      doc.save("relatorio-movimentacoes.pdf");
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
      <h4>Estoque Atual</h4>

      <select
        value={stockProductType}
        onChange={(e) => setStockProductType(e.target.value)}
      >
        <option value="all">Todos os tipos</option>
        <option value="toner">Toner</option>
        <option value="tinta">Tinta</option>
        <option value="cilindro">Cilindro</option>
        <option value="fusao">Fusão</option>
        <option value="pecas diversas">Peças diversas</option>
      </select>

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
      <h4>Movimentações (Entrada vs Saída)</h4>

      <select
        value={movementProductType}
        onChange={(e) => setMovementProductType(e.target.value)}
      >
        <option value="all">Todos os tipos</option>
        <option value="toner">Toner</option>
        <option value="tinta">Tinta</option>
        <option value="cilindro">Cilindro</option>
        <option value="fusao">Fusão</option>
        <option value="pecas diversas">Peças diversas</option>
      </select>

      <select value={moveType} onChange={(e) => setMoveType(e.target.value)}>
        <option value="all">Entrada + Saída</option>
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

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
      />
    </div>
  );
}