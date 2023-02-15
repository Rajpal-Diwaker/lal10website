import { Component, OnInit } from '@angular/core';
import { PageService } from '../page.service';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  privacyObj;

  constructor(private pageService: PageService, private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.getPrivacyPolicy();
    this.mainService.setTitle('Privacy Policy');
    this.googleAnalyticsService.pageView('Privacy Policy');
  }

  // function to get privacy policy
  getPrivacyPolicy() {
    this.pageService.privacy().subscribe(res => {
      if (res && res.code === 200) {
        this.privacyObj = res.result;
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

}
