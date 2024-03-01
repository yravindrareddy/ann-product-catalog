import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://annproductcatalog.azurewebsites.net';
  constructor(private http: HttpClient) {}

  getProducts(headers: HttpHeaders): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/products', { 'headers': headers });
  }

  addProduct(headers: HttpHeaders, product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl + '/products', product, { 'headers': headers });
  }

  updateProduct(headers: HttpHeaders, product: Product): Observable<Product> {
    return this.http.put<Product>(this.apiUrl + '/products/' + product.id, product, { 'headers': headers });
  }

  deleteProduct(headers: HttpHeaders, productId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/products/' + productId, { 'headers': headers });
  }
}
