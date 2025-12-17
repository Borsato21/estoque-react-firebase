import { db } from "./firebase";
import { ref, push, get, remove, update } from "firebase/database";

// ➕ Adicionar produto
export const addProduct = async (product) => {
  const productsRef = ref(db, "products");
  await push(productsRef, product);
};

// ✏️ Atualizar produto
export const updateProduct = async (id, product) => {
  const productRef = ref(db, `products/${id}`);
  await update(productRef, product);
};

// ❌ Excluir produto
export const deleteProduct = async (id) => {
  const productRef = ref(db, `products/${id}`);
  await remove(productRef);
};

// 📦 Buscar produtos
export const getProducts = async () => {
  const productsRef = ref(db, "products");
  const snapshot = await get(productsRef);
  return snapshot.val();
};
