import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, AuthenticationResult } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductService } from '../product.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginDisplay = false;
  products: any;
  displayedColumns: string[] = ['name', 'description', 'price', 'availableStock', 'actions'];
  headers: HttpHeaders = new HttpHeaders();
  constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService, private productService: ProductService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
        this.setLoginDisplay();
      });
      this.setLoginDisplay();      
  }

  setLoginDisplay() {
    var accnts = this.authService.instance.getAllAccounts();
    console.log(accnts);
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    const accessTokenRequest = {
      scopes: ["user.read"],
      account: this.authService.instance.getAllAccounts()[0],
    };
    
    
    this.authService.acquireTokenSilent(accessTokenRequest).subscribe( (accessTokenReponse) => {
      if(accessTokenReponse != null) {
        // Acquire token silent success
        let accessToken = accessTokenReponse.accessToken;
        // Call your API with token
        console.log("We got the token! hahaha: " + accessToken);
        this.headers= new HttpHeaders()
        .set('Authorization','Bearer '+ accessToken);  
        this.getProducts();
      }
    })
  }

  getProducts(){          
    this.productService.getProducts(this.headers).subscribe((resp: any) => {
      console.log(resp);
      this.products = resp;
    });
  }

  addProduct(product: any) {
    // Implement logic to add a new product
    this.productService.addProduct(this.headers, product).subscribe(resp => {
      this.getProducts();
    });
  }

  editProduct(product: any) {
    // Implement logic to edit a product
    this.productService.updateProduct(this.headers, product).subscribe(resp => {
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
      data: { action, product: product ? { ...product } : null }
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
