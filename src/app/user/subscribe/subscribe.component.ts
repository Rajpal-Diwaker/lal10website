import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {
  email;
  expired = false;
  result;

  constructor(private router: Router, private mainService: UserService, private route: ActivatedRoute,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Subscription');
    this.googleAnalyticsService.pageView('Subscription');
    this.route.queryParams.subscribe(params => {
      if (params && params.email) {
        this.email = params.email;
        this.mainService.showSpinner();
        this.hitLink();
      } else {
        this.expired = true;
        // alert('pageExpired');
      }
    });
  }


  navigateToHome() {
    this.router.navigate(['/'], { replaceUrl: true });
  }

  hitLink() {
    this.mainService.subscribeEmail({email: this.email}).subscribe(res => {
      if (res && res.code === 200) {
        this.mainService.hideSpinner();
        this.result = 1;
      }
      // else if (res.code === 404) {
      //   this.mainService.error(res.message);
      //   this.mainService.hideSpinner();
      //   this.result = 0;
      // }
      else {
        this.mainService.error(res.message);
        this.mainService.hideSpinner();
        this.result = 0;
      }
    }, error => {
      this.mainService.error(error);
      this.mainService.hideSpinner();
    });
  }

}
