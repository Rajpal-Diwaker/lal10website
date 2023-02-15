import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  emailId;

  constructor(private mainService: UserService, private route: ActivatedRoute,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Forgot Password');
    this.googleAnalyticsService.pageView('Forgot Password');
    this.route.queryParams.subscribe(params => {
      this.emailId = JSON.parse(params.email);
    });
  }

  // function to resend email
  resendEmail() {
    // this.mainService.error('Milestone 4.1 feature !');
    this.mainService.forgotPassword(this.emailId).subscribe(res => {
      if (res && res.code === 200) {
        this.mainService.success(res.message);
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

}
