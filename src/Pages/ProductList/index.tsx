import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { ProductForm } from "../../components/AddProductForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { getProducts } from "../../store/productsSlice";
import ProductCard from "../../components/ProductCard/ProductCard";

export const ProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "count">("name");

  const onModalClose = () => setIsModalOpen(false);

  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "count") {
      return a.count - b.count;
    }
    return 0;
  });

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  return (
    <div className="container">
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={onModalClose}
          onConfirm={() => console.log("df")}
        >
          <ProductForm onModalClose={onModalClose} />
        </Modal>
      )}
      <header>
        <h1>Products List</h1>
      </header>
      <div className="filter-section">
        <button
          className="add-btn"
          id="add-product-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </button>
        <select
          id="sort-dropdown"
          onChange={(e) => setSortBy(e.target.value as "name" | "count")}
        >
          <option value="name">Sort by Name</option>
          <option value="count">Sort by Count</option>
        </select>
      </div>

      <main>
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </main>
    </div>
  )
}