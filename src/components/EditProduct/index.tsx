import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { updateProduct } from "../../store/productsSlice";
import { v4 as uuidv4 } from "uuid";
import type { Comment, Product, ProductFields } from "../../types";
import { productFormFields } from "../AddProductForm";

type Props = {
  product: Product;
  onModalClose: () => void;
};

export const EditProductForm = ({ product, onModalClose }: Props) => {
  const [productInfo, setProductInfo] = useState<Product>(product);
  const [comments, setComments] = useState<Comment[]>(
    product.comments ? product.comments : []
  );
  const [newComment, setNewComment] = useState("");

  console.log(newComment);

  const dispatch = useDispatch<AppDispatch>();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name, type } = e.target;
    let sanitizedValue: string | number = value;

    if (type === "number") {
      sanitizedValue = value.replace(/^0+(?=\d)/, "").replace(/[.,]/g, "");
      if (sanitizedValue === "") sanitizedValue = "0";
      sanitizedValue = Number(sanitizedValue);
    }

    setProductInfo((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: uuidv4(),
      productId: product.id,
      description: newComment,
      date: new Date().toLocaleString(),
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  const removeComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const isDisabled =
    Object.values(productInfo).some((val) =>
      typeof val === "number" ? val === 0 : val === ""
    ) || false;

  const onProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProduct: Product = {
      ...productInfo,
      id: product.id,
      comments,
    };
    dispatch(updateProduct(updatedProduct));
    onModalClose();
  };

  return (
    <form className="edit-form" onSubmit={onProductSubmit}>
      <h2>Edit Product</h2>
      <div className="form-fields">
        {productFormFields.map(({ name, label, ...rest }) => (
          <label key={name} className="form-label">
            {label}:
            <input
              name={name}
              value={productInfo[name as keyof ProductFields]}
              onChange={onChange}
              onKeyDown={onKeyDown}
              className="form-input"
              {...rest}
            />
          </label>
        ))}
      </div>

      <div className="form-comments">
        <div className="add-comment">
          <input
            type="text"
            placeholder="Add comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="form-input"
          />
          <button
            type="button"
            onClick={addComment}
            className="btn btn-confirm"
          >
            Add
          </button>
        </div>

        <ul className="comments-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <span>{c.description}</span>
              <small>{c.date}</small>
              <button
                type="button"
                onClick={() => removeComment(c.id)}
                className="btn btn-cancel"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-buttons">
        <button type="button" onClick={onModalClose} className="btn btn-cancel">
          Cancel
        </button>
        <button type="submit" disabled={isDisabled} className="btn btn-confirm">
          Save
        </button>
      </div>
    </form>
  );
};

function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === "," || e.key === ".") e.preventDefault();
}
