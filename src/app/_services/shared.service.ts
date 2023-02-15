import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  base_url: string = environment.base_url;
  webRoute = 'api/v2/web';


  userInfo = new BehaviorSubject('loggedOut');
  userInfo$ = this.userInfo.asObservable();
  count = 0;
  simpleObservable = new Subject();
  simpleObservable$ = this.simpleObservable.asObservable();

  constructor(private mainService: UserService, private httpClient: HttpClient) {
    // this.setLocalSotrageUserInfo();
  }

  // function to set user logged in
  setLocalSotrageUserInfo() {
    if (this.mainService.getToken()) {
      this.userInfo.next('loggedIn');
    } else {
      this.userInfo.next('loggedOut');
    }
  }

  // function to watch for if user logged in or not
  getLocalStorageUserData() {
    return this.userInfo$;
  }

  // function to get cart items
  getCartItems() {

    const url = `${this.base_url}/${this.webRoute}/getCartData`;
    this.httpClient.get(url).subscribe((response: any) => {
      if (response.code === 200) {
        const liveCartArr = response.result.getliveShopCart;  // liveShopCart
        const nonLiveCartArr = response.result.EnquiryCart;
        this.count = liveCartArr.length + nonLiveCartArr.length;
        this.simpleObservable.next(this.count);
      }
    });

    // const url = '/api/user/v1/cartItems';
    // this.apiService.getApi(url).subscribe(response => {
    //   if (response.status === 200) {
    //     const cartArr = response.data.cartItems;
    //     this.count = cartArr.length;
    //     this.simpleObservable.next(this.count);
    //   }
    // });
  }
  getCount() {
    return this.simpleObservable$;
  }
}
