import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { MyAccountModule } from './my-account.module';

@Injectable()
export class AccountService {
  base_url: string = environment.base_url;
  webRoute = 'api/v2/web';
  artisanRoute = 'api/v1/artisan';
  // userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ 'noauth': 'yes' });
  multipartyHeaders = new HttpHeaders({ 'multiparty': 'yes' });

  constructor(private http: HttpClient) { }

  // function to add address
  addAddress(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/addAddress`;
    return this.http.post(url, payload);
  }

  // function to get user address
  getUserAddress(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getAddress`;
    return this.http.get(url);
  }

  // function to get profile details
  getProfile(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/viewProfileDetails`;
    return this.http.get(url);
  }

  // function to edit business details
  editBusiness(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/editBussinessDetails`;
    return this.http.post(url, payload);
  }

  // function to edit profile details
  editProfile(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/editPersonalDetails`;
    return this.http.post(url, payload);
  }

  // function to update password
  updatePassword(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/changePassword`;
    return this.http.post(url, payload);
  }

  // function to remove address
  deleteAddress(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/removeData`;
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

  // function to update profile pic
  updateProfilePic(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/profileImage`;
    return this.http.post(url, payload);
  }
}
