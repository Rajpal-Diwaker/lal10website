import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OnboardingModule } from './onboarding.module';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  base_url: string = environment.base_url;
  webRoute = 'api/v2/web';
  artisanRoute = 'api/v2/artisan';
  // userId: BehaviorSubject<any> = new BehaviorSubject(null);
  noauthHeaders = new HttpHeaders({ 'noauth': 'yes' });
  multipartyHeaders = new HttpHeaders({ 'multiparty': 'yes' });

  constructor(private http: HttpClient) { }

  // function to subscribe email
  subscribeEmail(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/subscribe`;
    return this.http.post(url, payload, {headers: this.noauthHeaders});
  }

  // function to send enquiry from header
  sendEnquiry(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/sendEnquiryWithoutLogin`;
    return this.http.post(url, payload);
  }

  // function to get banner image home screen slider owl carausel
  getBanner(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getBanner`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to search product
  searchProduct(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/masterSearch?search=${payload.term}`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get onboarding popup images
  getOnboardingPopup(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getonBoarding`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get news feed
  getNewsFeed(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getNewsFeed`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get exhibition
  exhibition(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getExhibitionBanner`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get exhibition
  bestselling(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/bestsellingProduct`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get avenue
  avenue(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/get/avenue`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get brands
  brands(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/getBrand`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get service sector
  serviceSector(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/serviceSector`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get customer feedback
  customerFeedback(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/customerFeedback`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get manufacturing world
  manufacturingWorld(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/worldManufacturing`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get servicing india
  servicingIndia(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/servicingIndia`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get bestselling categories
  bestsellingCategories(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/category?isBestSelling=1`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get world map
  worldMap(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/countryMap`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to get india map
  indiaMap(): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/indiaMap`;
    return this.http.get(url, {headers: this.noauthHeaders});
  }

  // function to register for exhibition
  registerExhibition(payload): Observable<any> {
    const url = `${this.base_url}/${this.webRoute}/exhibition/user`;
    return this.http.post(url, payload, {headers: this.noauthHeaders});
  }
}
