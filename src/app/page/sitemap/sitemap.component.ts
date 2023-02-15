import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css']
})
export class SitemapComponent implements OnInit {

  constructor(private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Sitemap');
    this.googleAnalyticsService.pageView('Sitemap');
  }

}
