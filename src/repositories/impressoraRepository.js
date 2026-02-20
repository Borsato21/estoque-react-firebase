import { supabase } from "../services/supabaseClient";

export async function listarImpressoras() {
  const { data, error } = await supabase
    .from("impressoras")
    .select("*");

  if (error) throw error;

  return data;
}

export async function criarImpressora(impressora) {
  const { data, error } = await supabase
    .from("impressoras")
    .insert([impressora]);

  if (error) throw error;

  return data;
}