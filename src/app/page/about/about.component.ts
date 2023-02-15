import { Component, OnInit } from '@angular/core';
import { PageService } from '../page.service';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  aboutUsObj: any;
  teamArr;
  defaultImage = 'assets/images/placeholder.png';

  constructor(private pageService: PageService, private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('About Us');
    this.googleAnalyticsService.pageView('About Us');
    this.getAboutUs();
  }

  // function to get about us
  getAboutUs() {
    this.pageService.aboutUs().subscribe(res => {
      if (res && res.code === 200) {
        this.aboutUsObj = res.result;
        this.teamArr = res.team;
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

}
