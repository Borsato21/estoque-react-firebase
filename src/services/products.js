import { ref, push, set, get, remove, update } from "firebase/database";
import { db } from "./firebase";

// Criar produto
export const addProduct = async (product) => {
  const productRef = push(ref(db, "products"));
  await set(productRef, product);
};

// Buscar produtos
export const getProducts = async () => {
  const snapshot = await get(ref(db, "products"));
  return snapshot.exists() ? snapshot.val() : {};
};

// Deletar produto
export const deleteProduct = async (id) => {
  await remove(ref(db, `products/${id}`));
};

// Atualizar produto
export const updateProduct = async (id, data) => {
  await update(ref(db, `products/${id}`), data);
};
