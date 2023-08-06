export interface Product {
  id: number;
  name: string;
  description: string;
  images: string;
  previous_price: string;
  price: string;
  inventory_id: string;
  category_id: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface SingleProduct {
  id: string;
  name: string;
  description: string;
  images: string;
  previous_price: string;
  price: string;
  fabric: string;
  quantity: number;
  category_name: string;
  size_name: string;
  size_description: string;
  theme_title: string;
  gender_category_name: string;
}

export interface SingleProductResponse {
  status: string;
  results: number;
  data: {
    data: SingleProduct[];
  };
}
