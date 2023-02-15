import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { UserModule } from './user.module';

@Injectable()
export class UserService {
  base_url: string = environment.base_url
  webRoute: string = "api/v2/web";
  artisanRoute: string = "api/v2/artisan";
  userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ 'noauth': 'yes' });
  multipartyHeaders = new HttpHeaders({ 'multiparty': 'yes' })
  constructor(private http: HttpClient, private mainService: UserService) { }

  typeOfStore(): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/typeOfStore`
    return this.http.get(uri, { headers: this.noauthHeaders })
  }

  login(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/login`
    return this.http.post(uri, ob, { headers: this.noauthHeaders })
  }

  signUp(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/signUp`
    return this.http.post(uri, ob, { headers: this.noauthHeaders })
  }
  forgotPassword(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/forgotPassword`
    return this.http.post(uri, ob, { headers: this.noauthHeaders })
  }
  checkEmail(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/checkemail`
    return this.http.post(uri, ob, { headers: this.noauthHeaders })
  }
  checkUserMobile(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/checkUserMobile`
    return this.http.post(uri, ob, { headers: this.noauthHeaders })
  }
  hearAboutUs(): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/hearAboutUs`
    return this.http.get(uri, { headers: this.noauthHeaders })
  }

  products(ob = { type: 'products' }): Observable<any> {
    const uri = `${this.base_url}/${this.artisanRoute}/getManageListing?type=${ob.type}`
    return this.http.get(uri, { headers: this.noauthHeaders })
  }
  getCountryCodeJson() {
    return this.http.get('assets/json/countryCodes.json');
  }
  resetPassword(ob): Observable<any> {
    const uri = `${this.base_url}/${this.webRoute}/resetPassword`;
    return this.http.post(uri, ob, { headers: this.noauthHeaders });
  }

}
