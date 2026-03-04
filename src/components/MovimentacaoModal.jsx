import { useState } from "react";
import { registrarMovimentacao } from "../services/movimentacoes";

export default function MovimentacaoModal({ open, onClose, product, onSuccess }) {
  const [tipo, setTipo] = useState("entrada");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open || !product) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!quantidade || Number(quantidade) <= 0) {
      alert("Digite uma quantidade válida");
      return;
    }

    try {
      setLoading(true);

      await registrarMovimentacao({
        produto_id: product.id,
        tipo,
        quantidade: Number(quantidade),
        observacao,
      });

      alert("Movimentação registrada com sucesso 🔥");

      setQuantidade("");
      setObservacao("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error);
      alert("Erro ao registrar movimentação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Movimentação de Estoque</h3>

        <p>
          Produto: <strong>{product.nome}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <label>Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>

          <label>Quantidade</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Digite a quantidade"
          />

          <label>Observação</label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Ex: venda, reposição, defeito..."
          />

          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Confirmar"}
            </button>

            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}