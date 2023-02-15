import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageModule } from './page.module';


@Injectable()
export class PageService {
  base_url: string = environment.base_url;
  webRoute = 'api/v2/web';
  artisanRoute = 'api/v1/artisan';
  // userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ 'noauth': 'yes' });
  multipartyHeaders = new HttpHeaders({ 'multiparty': 'yes' });

  constructor(private http: HttpClient) { }

  // function to get about us
  aboutUs(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/aboutUs`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get blogs
  blogs(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getBlogs`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get career
  career(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/careers`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get privacy policy
  privacy(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/privacyPolicy`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get return policy
  returnPolicy(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/returnPolicy`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to send resume
  sendResume(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/sendResume`;
    return this.http.post(url, payload, {headers: this.noauthHeaders});
  }
}
