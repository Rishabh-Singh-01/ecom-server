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
