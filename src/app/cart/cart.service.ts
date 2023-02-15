import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartModule } from './cart.module';

@Injectable()
export class CartService {
  base_url: string = environment.base_url;
  webRoute = 'api/v2/web';
  artisanRoute = 'api/v1/artisan';
  // userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ 'noauth': 'yes' });
  multipartyHeaders = new HttpHeaders({ 'multiparty': 'yes' });
  razorUrl = environment.razor_url;

  constructor(private http: HttpClient) { }

  // function to get cart detail
  getCartDetail(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getCartData`;
    return this.http.get(url);
  }

  // function to remove cart item
  removeCartItem(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/removeCartData`;
    return this.http.post(url, payload);
  }

  // function to send product enquires
  sendProductEnq(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/sendEnquiry`;
    return this.http.post(url, payload);
  }

  // function to update cart data
  updateEnqCartItem(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/updateCartData`;
    return this.http.post(url, payload);
  }

  // function to update cart data
  updateLiveCartItem(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/updateLiveCartQty`;
    return this.http.post(url, payload);
  }

  // function to get user address
  getUserAddress(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getAddress`;
    return this.http.get(url);
  }

  // function to add address
  addAddress(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/addAddress`;
    return this.http.post(url, payload);
  }

  // function to check inventory
  checkInventory(id): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/checkOut?id=${id}`;
    return this.http.get(url);
  }

  // function to create order razorpay
  createOrder(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/razorpay/order`;
    return this.http.post(url, payload);
  }

  // function to create place order
  placeOrder(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/orderPlace`;
    return this.http.post(url, payload);
  }

  // function to get country list
  getCountry(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getCountry`;
    return this.http.get(url);
  }

  // function to get state list
  getState(country): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getState?country=${country}`;
    return this.http.get(url);
  }

  // function to get city list
  getCity(state): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getCity?state=${state}`;
    return this.http.get(url);
  }

}
