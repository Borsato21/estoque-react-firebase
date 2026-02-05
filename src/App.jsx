import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Stock from "./pages/Stock";
import Reports from "./pages/Reports";
import Printers from "./pages/Printers";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/estoque" />} />
        <Route path="/estoque" element={<Stock />} />
        <Route path="/impressoras" element={<Printers />} />
        <Route path="/relatorios" element={<Reports />} />
        <Route path="*" element={<h2>Página não encontrada</h2>} />
      </Routes>
    </>
  );
}

export default App;
