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
  // 1️⃣ Buscar produto atual
  const { data: produto, error: erroProduto } = await supabase
    .from("produtos")
    .select("*")
    .eq("id", produto_id)
    .single();

  if (erroProduto) throw erroProduto;

  let novaQuantidade =
    tipo === "entrada"
      ? produto.quantidade + quantidade
      : produto.quantidade - quantidade;

  if (novaQuantidade < 0) {
    throw new Error("Estoque insuficiente");
  }

  // 2️⃣ Atualizar estoque
  const { error: erroUpdate } = await supabase
    .from("produtos")
    .update({ quantidade: novaQuantidade })
    .eq("id", produto_id);

  if (erroUpdate) throw erroUpdate;

  // 3️⃣ Registrar movimentação
  const { error: erroMov } = await supabase
    .from("movimentacoes")
    .insert([
      {
        produto_id,
        tipo,
        quantidade,
        observacao,
      },
    ]);

  if (erroMov) throw erroMov;

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