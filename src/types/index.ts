export type ProductFields = {
  name: string;
  imageUrl: string;
  count: number;
  sizeWidth: number;
  sizeHeight: number;
  weight: number;
};

export type Comment = {
  id: string;
  productId: string;
  description: string;
  date: string;
};

export type Product = ProductFields & { id: string; comments: Comment[] };
