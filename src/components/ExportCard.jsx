
export default function ExportCard({
  open,
  onClose,
  onConfirm,

  orderBy,
  setOrderBy,
  filterType,
  setFilterType,
  onlyWithStock,
  setOnlyWithStock,

  //  MOVIMENTAÇÃO
  moveType,
  setMoveType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  if (!open) return null;

  return (
    <div className="export-overlay">
      <div className="export-card">
        <h3>Configurar Exportação</h3>

        {/*  FILTROS DE PRODUTO */}
        <label>Ordenar por:</label>
        <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
          <option value="name-asc">Nome (A–Z)</option>
          <option value="name-desc">Nome (Z–A)</option>
          <option value="qty-asc">Quantidade (menor)</option>
          <option value="qty-desc">Quantidade (maior)</option>
        </select>

        <label>Tipo do Produto:</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">Todos os tipos</option>
          <option value="toner">Toner</option>
          <option value="cilindro">Cilindro</option>
          <option value="tinta">Tinta</option>
          <option value="fusao">Fusão</option>
          <option value="pecas diversas">Peças diversas</option>
          <option value="impressora">Impressora</option>
        </select>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={onlyWithStock}
            onChange={() => setOnlyWithStock(!onlyWithStock)}
          />
          Somente produtos com estoque
        </label>

        {/*  MOVIMENTAÇÃO */}
        <hr />

        <label>Tipo de movimentação:</label>
        <select value={moveType} onChange={(e) => setMoveType(e.target.value)}>
          <option value="all">Entrada + Saída</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <label>Período:</label>
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

        <div className="export-actions">
          <button className="cancel" onClick={onClose}>Cancelar</button>
          <button className="confirm" onClick={onConfirm}>Exportar</button>
        </div>
      </div>
    </div>
  );
}
