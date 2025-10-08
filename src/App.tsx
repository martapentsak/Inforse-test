import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProductList } from "./pages/ProductList";
import "./styles/global.scss";
import { ProductView } from "./pages/ProductView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductView />} />
    </Routes>
  );
}

export default App;
