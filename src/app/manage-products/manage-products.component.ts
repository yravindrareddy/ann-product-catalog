import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormComponent } from '../product-form/product-form.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { Category } from '../Category';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  title = 'Manage Products';
  products: any;
  categories: Category[] | undefined;
  displayedColumns: string[] = ['name', 'description', 'price', 'availableStock', 'categoryName', 'actions'];
  headers: HttpHeaders = new HttpHeaders();
  constructor(private productService: ProductService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }

  getProducts(){          
    this.productService.getProducts(this.headers).subscribe((resp: any) => {
      console.log(resp);
      this.products = resp;
    });
  }

  getCategories(){
    this.productService.getCategories(this.headers).subscribe((resp: any) => {
      console.log(resp);
      this.categories = resp;
      this.categories?.unshift({id: 0, name: "All Categories"});
    });
  }

  addProduct(product: any) {
    const formdata = this.getFormData(product);      
    console.log(formdata);
    // Implement logic to add a new product
    this.productService.addProduct(this.headers, formdata).subscribe(resp => {
      this.getProducts();
    });
  }

  editProduct(product: any) {
    // Implement logic to edit a product
    const formdata = this.getFormData(product);
    formdata.append('id', product.id);   
    this.productService.updateProduct(this.headers, formdata, product.id).subscribe(resp => {
      this.getProducts();
    });
  }

  deleteProduct(productId: any) {
    // Implement logic to delete a product
    this.productService.deleteProduct(this.headers, productId).subscribe(resp => {
      this.getProducts();
    });
  }

  openProductDialog(action: string, product?: any): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: { action, product: product ? { ...product } : null, categories: this.categories }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result here (e.g., add/update the product)
     
      if (result) {
        console.log('Product submitted:', result);
        if(result.action == 'Edit'){
          this.editProduct(result.product);
        } else if(result.action == 'Add'){
          this.addProduct(result.product);
        }
      }
    });
  }

  getFormData(product: any): FormData {    
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('categoryId', product.categoryId);
    formData.append('availablestock', product.availableStock);
    formData.append('image', product.image);
    return formData;
  }

  openDeleteConfirmationDialog(product: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
      data: { productId: product.id }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        // Call your delete product method here
        this.deleteProduct(product.id);
      }
    });
  }

}
