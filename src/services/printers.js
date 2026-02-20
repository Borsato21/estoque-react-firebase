import { supabase } from "./supabaseClient";

export async function getPrinters() {
  const { data, error } = await supabase
    .from("impressoras")
    .select("*");

  if (error) throw error;

  // Converter snake_case → camelCase
  return data.map(p => ({
    ...p,
    serialNumber: p.serial_number
  }));
}

export async function addPrinter(printer) {
  const { error } = await supabase
    .from("impressoras")
    .insert([{
      model: printer.model,
      serial_number: printer.serialNumber,
      counter: printer.counter,
      observation: printer.observation
    }]);

  if (error) throw error;
}

export async function updatePrinter(id, printer) {
  const { error } = await supabase
    .from("impressoras")
    .update({
      model: printer.model,
      serial_number: printer.serialNumber,
      counter: Number(printer.counter),
      observation: printer.observation
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deletePrinter(id) {
  const { error } = await supabase
    .from("impressoras")
    .delete()
    .eq("id", id);

  if (error) throw error;
}