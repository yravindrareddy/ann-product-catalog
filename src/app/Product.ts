export interface Product {
    id?: number; // '?' denotes that the property is optional
    name: string;
    description: string;
    price: number;
    availableStock: number;
  }