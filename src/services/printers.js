import { ref, push, update, remove, onValue, off } from "firebase/database";
import { db } from "./firebase";

const printersRef = ref(db, "printers");

// ➕ Adicionar impressora
export const addPrinter = async (printer) => {
  await push(printersRef, {
    ...printer,
    createdAt: Date.now(),
  });
};

// ✏️ Atualizar impressora
export const updatePrinter = async (id, printer) => {
  await update(ref(db, `printers/${id}`), printer);
};

// ❌ Excluir impressora
export const deletePrinter = async (id) => {
  await remove(ref(db, `printers/${id}`));
};

// ⚡ Listener realtime
export const listenPrinters = (callback) => {
  onValue(printersRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const list = Object.entries(data)
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => b.createdAt - a.createdAt);

      callback(list);
    } else {
      callback([]);
    }
  });

  return () => off(printersRef);
};
