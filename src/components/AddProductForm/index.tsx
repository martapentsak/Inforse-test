import {
  useState,
  type InputHTMLAttributes,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { addProduct } from "../../store/productsSlice";
import { v4 as uuidv4 } from "uuid";
import type { Product, ProductFields } from "../../types";

type FormField = { label: string } & InputHTMLAttributes<HTMLInputElement>;

export const productFormFields: FormField[] = [
  {
    name: "name",
    label: "Product Name",
    placeholder: "Enter product name",
    type: "text",
  },
  {
    name: "imageUrl",
    label: "Image URL",
    placeholder: "Enter image URL",
    type: "text",
  },
  { name: "count", label: "Count", placeholder: "Enter count", type: "number" },
  {
    name: "sizeWidth",
    label: "Width",
    placeholder: "Enter width",
    type: "number",
  },
  {
    name: "sizeHeight",
    label: "Height",
    placeholder: "Enter height",
    type: "number",
  },
  {
    name: "weight",
    label: "Weight",
    placeholder: "Enter weight (e.g., 200g)",
    type: "number",
  },
];

const initialState = {
  name: "",
  imageUrl: "",
  count: 0,
  sizeWidth: 0,
  sizeHeight: 0,
  weight: 0,
};

type Props = {
  onModalClose: () => void;
};

//TODO: common component with EditProduct. Need to unify.
export const ProductForm = ({ onModalClose }: Props) => {
  const [productInfo, setProductInfo] = useState<ProductFields>(initialState);

  const dispatch = useDispatch<AppDispatch>();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name, type } = e.target;

    let sanitizedValue = value;

    if (type === "number") {
      sanitizedValue = value.replace(/^0+(?=\d)/, "").replace(/[.,]/g, "");

      if (sanitizedValue === "") sanitizedValue = "0";
    }

    setProductInfo((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const onCancel = () => {
    setProductInfo(initialState);
    onModalClose();
  };

  const isDisabled = Object.values(productInfo).some((value) =>
    isNaN(+value) ? value === "" : +value === 0
  );

  const onProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProductInfo(initialState);
    const newProduct: Product = { ...productInfo, id: uuidv4(), comments: [] };
    dispatch(addProduct(newProduct));
    onModalClose();
  };

  return (
    <form className="product-form" onSubmit={onProductSubmit}>
      <h2>Add Product</h2>
      <div className="form-fields">
        {productFormFields.map(({ name, label, ...rest }) => {
          return (
            <label key={name}>
              {label}:
              <input
                name={name}
                value={productInfo[name as keyof ProductFields]}
                onChange={onChange}
                onKeyDown={onKeyDown}
                {...rest}
              />
            </label>
          );
        })}
      </div>
      <div className="form-buttons">
        <button className="btn btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-confirm" type="submit" disabled={isDisabled}>
          Confirm
        </button>
      </div>
    </form>
  );
};

function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === "," || e.key === ".") e.preventDefault();
}
