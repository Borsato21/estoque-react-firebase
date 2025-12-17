import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Stock from "./pages/Stock";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/estoque" element={<Stock />} />
    </Routes>
  );
}

export default App;
