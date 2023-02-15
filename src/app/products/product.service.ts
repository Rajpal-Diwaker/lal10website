import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProductsModule } from './products.module';

@Injectable()
export class ProductService {
  base_url: string = environment.base_url;
  webRoute = 'api/v2/web';
  artisanRoute = 'api/v1/artisan';
  // userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ 'noauth': 'yes' });
  multipartyHeaders = new HttpHeaders({ 'multiparty': 'yes' });

  constructor(private http: HttpClient) { }

  // function to subscribe email
  getProductList(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getCategoryProduct`;
    return this.http.post(url, payload, {headers: this.noauthHeaders});
  }

  // function to get sub category list
  getSubCategoryList(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getSubCategory`;
    return this.http.post(url, payload, {headers: this.noauthHeaders});
  }

  // function to get product details
  getProductDetail(payload, isLoggedIn: boolean): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getProductDetails?productId=${payload.productid}`;
    return isLoggedIn ? this.http.get(url) : this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get craft list
  getCraftList(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getCraftMatrialList?type=${payload.type}`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get material list
  getMaterialList(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getCraftMatrialList?type=${payload.type}`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to add product to cart
  addToCart(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/addToCart`;
    return this.http.post(url, payload);
  }

  // function to get live shop
  liveshop(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getliveShop`;
    return this.http.post(url, payload, {headers: this.noauthHeaders});
  }
}
