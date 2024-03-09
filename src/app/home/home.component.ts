import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, AuthenticationResult } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../product.service';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Category } from '../Category';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginDisplay = false; 
  isAdmin = false;
  loading: boolean = false;
  adminGroupId = '4fb8e9cb-28e9-4c77-ac1f-02848a847761';
  customerGroupId = '3b976708-0f52-4701-b3cc-94d62281281c';
  headers: HttpHeaders = new HttpHeaders();
  searchQuery: string = '';
  products: any[] = [];
  categories: Category[] = [];
  selectedCategory: Category | undefined;
  constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService, private productService: ProductService, public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.msalBroadcastService.msalSubject$
    //   .pipe(
    //     filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
    //   )
    //   .subscribe((result: EventMessage) => {
    //     const payload = result.payload as AuthenticationResult;
    //     this.authService.instance.setActiveAccount(payload.account);
    //     this.setLoginDisplay();
    //   });
    // this.setLoginDisplay();
    this.loginDisplay = true;
    this.getCategories();
    this.getProducts();
  }

  setLoginDisplay() {
    var accnts = this.authService.instance.getAllAccounts();
    console.log(accnts);
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    const accessTokenRequest = {
      scopes: ["api://b5652012-1efb-4c6f-8cef-4e35d6ca33c6/AllAccess"],
      account: this.authService.instance.getAllAccounts()[0],
    };


    this.authService.acquireTokenSilent(accessTokenRequest).subscribe((accessTokenReponse) => {
      if (accessTokenReponse != null) {
        // Acquire token silent success
        let accessToken = accessTokenReponse.accessToken;
        // Call your API with token
        console.log("We got the token! hahaha: " + accessToken);
        let jwtToken: any = jwtDecode(accessToken);
        this.isAdmin = jwtToken['groups'].indexOf(this.adminGroupId) > -1;
        this.headers = new HttpHeaders()
          .set('Authorization', 'Bearer ' + accessToken);
        this.getProducts();
      }
    })
  }

  getProducts() {
    this.loading = true;
    this.productService.getProducts(this.headers).subscribe((resp: any) => {
      console.log(resp);
      this.products = resp;
      this.loading = false;
    });
  }

  getCategories(){
    this.productService.getCategories(this.headers).subscribe((resp: any) => {
      console.log(resp);
      this.categories = resp;
      this.categories.unshift({id: 0, name: "All Categories"});
    });
  }

  search(){
    this.loading = true;
    let querystring = '';
    const categoryId = this.selectedCategory?.id;

    if(this.searchQuery == ''){
      this.getProducts();
    } else if(categoryId && categoryId  > 0){
      querystring += `categoryId=${categoryId}&searchText=${this.searchQuery}`;
    } else {
      querystring += `searchText=${this.searchQuery}`;
    }
    this.productService.searchProducts(querystring).subscribe((resp: any) => {
      console.log(resp);
      this.products = resp;
      this.loading = false;
    });
  }
}
