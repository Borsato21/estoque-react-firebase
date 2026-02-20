import { supabase } from "../services/supabaseClient";

export async function listarProdutos() {
  const { data, error } = await supabase
    .from("produtos")
    .select("*");

  if (error) throw error;

  return data;
}

export async function criarProduto(produto) {
  const { data, error } = await supabase
    .from("produtos")
    .insert([produto]);

  if (error) throw error;

  return data;
}

export async function deletarProduto(id) {
  const { error } = await supabase
    .from("produtos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}