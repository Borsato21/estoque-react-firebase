import { resolveImage } from "./storage";
import { supabase } from "./supabaseClient";

// 🔹 Buscar produtos
export async function getProducts() {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return Promise.all(data.map(async product => ({
    ...product, image_path: product.imagem_url, imagem_url: await resolveImage(product.imagem_url),
  })));
}

// 🔹 Adicionar produto
export async function addProduct(product) {
  const { error } = await supabase
    .from("produtos")
    .insert([product]);

  if (error) throw error;
}

// 🔹 Atualizar produto
export async function updateProduct(id, product) {
  const { error } = await supabase
    .from("produtos")
    .update(product)
    .eq("id", id);

  if (error) throw error;
}

// 🔹 Deletar produto
export async function deleteProduct(id) {
  const { error } = await supabase
    .from("produtos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}