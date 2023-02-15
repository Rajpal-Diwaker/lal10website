import { Component, Renderer2, AfterViewInit } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
// tslint:disable-next-line: ban-types
// declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  showHead = true;
  constructor(public router: Router, private renderer: Renderer2) {
    this.router.events.subscribe(event => {
       if (event instanceof NavigationEnd) {
         console.log('checkUrl', event.url);
         const url = event.url.split('?')[0];
         if (url === '/user' ||
             url === '/user/registration' ||
             url === '/user/login' ||
             url === '/user/forgot-password' ||
             url === '/user/resetPassword' ||
             url === '/user/emailVerify' ||
             url === '/user/subscribe-email') {
           this.showHead = false;
         } else {
           this.showHead = true;
         }
        //  gtag('config', 'G-E3Z15Q2FJK',
        //          {
        //            page_path: event.urlAfterRedirects
        //          }
        //         );
        }
     }
  ); }

  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#loader');
    this.renderer.setStyle(loader, 'display', 'none');
  }
}
