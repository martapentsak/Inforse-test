import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProductList } from "./Pages/ProductList";
import "./styles/global.scss";
import { ProductView } from "./Pages/ProductView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductView />} />
    </Routes>
  );
}

export default App;
