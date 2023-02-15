import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  link;
  expired = false;
  result;

  constructor(private router: Router, private mainService: UserService, private route: ActivatedRoute,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Email Verification');
    this.googleAnalyticsService.pageView('Email Verification');
    this.route.queryParams.subscribe(params => {
      if (params && params.link) {
        this.link = params.link;
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
    this.mainService.verifyEmail(this.link).subscribe(res => {
      if (res && res.code === 200) {
        this.mainService.hideSpinner();
        this.result = res.result;
      } else if (res.code === 404) {
        this.mainService.error(res.message);
        this.mainService.hideSpinner();
      } else {
        this.mainService.error(res.message);
        this.mainService.hideSpinner();
      }
    }, error => {
      this.mainService.error(error);
      this.mainService.hideSpinner();
    });
  }

}
