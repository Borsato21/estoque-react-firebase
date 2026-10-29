import { supabase } from "./supabaseClient";

/* ================================
   🔄 REGISTRAR MOVIMENTAÇÃO
================================ */
export async function registrarMovimentacao({
  produto_id,
  tipo,
  quantidade,
  observacao,
}) {
  const { error } = await supabase.rpc('registrar_movimentacao', {
    p_produto_id: produto_id, p_tipo: tipo, p_quantidade: quantidade,
    p_observacao: observacao || '',
  });
  if (error) throw error;
  return true;
}

/* ================================
   📊 BUSCAR MOVIMENTAÇÕES (RELATÓRIO)
================================ */
export async function getMovimentacoes() {
  const { data, error } = await supabase
    .from("movimentacoes")
    .select(`
      *,
      produtos (
        nome,
        tipo
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}