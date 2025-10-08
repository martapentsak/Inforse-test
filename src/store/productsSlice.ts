import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store";

import { api } from "../constants/api";
import type { Product } from "../types";


type ProductState = {
  products: Product[];
};

const initialState: ProductState = {
  products: [],
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(api);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch products");
    }
  }
);


export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product: Product, { rejectWithValue, getState }) => {
    try {
      const { products } = getState() as RootState;
      const productAlreadyExist = products.products.find((p) => p.id === product.id);
      if (productAlreadyExist) {
        return rejectWithValue("Product already exists");
      }

      const response = await axios.post(api, product);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add product");
    }
  }
);


export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${api}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete product");
    }
  }
);

export const getProduct = createAsyncThunk<Product, string>(
    "products/getProduct",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${api}/${id}`);
        return response.data; 
      } catch (error) {
        return rejectWithValue("Failed to fetch product");
      }
    }
  );

  export const updateProduct = createAsyncThunk< Product, Product>(
  "products/updateProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${api}/${product.id}`, product);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export default productsSlice.reducer;
