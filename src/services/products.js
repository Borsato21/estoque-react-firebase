import { ref, push, update, remove, onValue, off } from "firebase/database";
import { db } from "./firebase";

// 📂 Referência direta (SEM UID)
const productsRef = ref(db, "products");

// ➕ Adicionar produto
export const addProduct = async (product) => {
  await push(productsRef, {
    ...product,
    createdAt: Date.now(),
  });
};

// ✏️ Atualizar produto
export const updateProduct = async (id, product) => {
  await update(ref(db, `products/${id}`), product);
};

// ❌ Excluir produto
export const deleteProduct = async (id) => {
  await remove(ref(db, `products/${id}`));
};

// ⚡ Listener em tempo real (IMPORTANTE)
export const listenProducts = (callback) => {
  const unsubscribe = onValue(productsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      const list = Object.entries(data)
        .map(([id, value]) => ({
          id,
          ...value,
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      callback(list);
    } else {
      callback([]);
    }
  });

  return () => off(productsRef);
};
