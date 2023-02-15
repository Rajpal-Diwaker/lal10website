import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderModule } from './order.module';

@Injectable()
export class OrderService {
  base_url: string = environment.base_url;
  webRoute = 'api/v2/web';
  artisanRoute = 'api/v1/artisan';
  // userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ 'noauth': 'yes' });
  multipartyHeaders = new HttpHeaders({ 'multiparty': 'yes' });

  constructor(private http: HttpClient) { }

  // function to get enquiry list
  getEnquiry(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getEnquiryList`;
    return this.http.get(url);
  }

  // function to get order list
  getOrder(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getOrderList`;
    return this.http.get(url);
  }

  // function to get enquiry details
  enquiryDetail(id): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/trackEnquiry?id=${id}`;
    return this.http.get(url);
  }

  // function to get order details
  orderDetail(id): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/trackOrder?id=${id}`;
    return this.http.get(url);
  }
}
