import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddProduct, Product, UpdateProduct } from './Product';
import { Category } from './Category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://ann-productcatalog.azurewebsites.net';
  private searchApiUrl = 'https://annproductsearch.azurewebsites.net';
  constructor(private http: HttpClient) {}

  getProducts(headers: HttpHeaders): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/product', { 'headers': headers });
  }

  addProduct(headers: HttpHeaders, productForm: FormData) {
    return this.http.post<AddProduct>(this.apiUrl + '/product', productForm, { 'headers': headers });
  }

  updateProduct(headers: HttpHeaders, productForm: FormData, productId: number) {
    return this.http.put<UpdateProduct>(this.apiUrl + '/product/' + productId, productForm, { 'headers': headers });
  }

  deleteProduct(headers: HttpHeaders, productId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/product/' + productId, { 'headers': headers });
  } 

  getCategories(headers: HttpHeaders): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl + '/product/categories', { 'headers': headers });
  }

  searchProducts(queryString: string): Observable<Category[]> {
    return this.http.get<Category[]>(this.searchApiUrl + `/api/ProductSearch?${queryString}`);
  }
}
