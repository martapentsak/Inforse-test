import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { getProducts } from "../../store/productsSlice";
import Modal from "../../components/Modal";
import { EditProductForm } from "../../components/EditProduct";

export const ProductView = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);

  const currentProduct = products.find((p) => p.id === id);
  if (!currentProduct) return <p>Product not found</p>;

  const { name, imageUrl, sizeWidth, sizeHeight, weight, count, comments } =
    currentProduct;

  useEffect(() => {
    dispatch(getProducts());
  }, [id]);

  return (
    <div className="product-view-container">
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <EditProductForm
            product={currentProduct}
            onModalClose={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
      <div className="product-main">
        <img
          src={imageUrl}
          alt={name}
          width={sizeWidth}
          height={sizeHeight}
          className="product-image"
        />
        <div className="product-info">
          <h1>{name}</h1>
          <p>
            <strong>Count:</strong> {count}
          </p>
          <p>
            <strong>Size:</strong> {sizeWidth} x {sizeHeight}
          </p>
          <p>
            <strong>Weight:</strong> {weight}
          </p>
          <button className="edit-btn" onClick={() => setIsEditModalOpen(true)}>
            Edit Product
          </button>
        </div>
      </div>

      <div className="product-comments">
        <h3>Comments</h3>
        <ul>
          {comments?.map((c) => (
            <li key={c.id}>
              {c.description} <small>{c.date}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
