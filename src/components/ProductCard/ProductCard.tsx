import React, { useState } from "react";
import type { Product } from "../../types";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../store/productsSlice";
import type { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const { id, imageUrl, name, count, sizeWidth, weight, sizeHeight } = product;

  return (
    <div className="product-card" onClick={() => navigate(`product/${id}`)}>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="form-buttons">
            Are you sure you want delete current product&
            <button
              className="btn btn-cancel"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-confirm"
              onClick={() => dispatch(deleteProduct(product.id))}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
      <button className="delete-btn" onClick={onDeleteClick}>
        ×
      </button>
      <img src={imageUrl} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p>
          <strong>Count:</strong> {count}
        </p>
        <p>
          <strong>Size:</strong> {sizeWidth}x{sizeHeight}
        </p>
        <p>
          <strong>Weight:</strong> {weight}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
