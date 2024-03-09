export interface Product {
    id?: number; // '?' denotes that the property is optional
    name: string;
    description: string;
    price: number;
    availableStock: number;
    categoryName: string;
    imageUrl: string;
  }

  export interface AddProduct {    
    name: string;
    description: string;
    price: number;
    availableStock: number;
    categoryId: number;
    image: File;
  }

  export interface UpdateProduct {
    id: number; // '?' denotes that the property is optional
    name: string;
    description: string;
    price: number;
    availableStock: number;
    categoryId: number;
    image?: File;
  }