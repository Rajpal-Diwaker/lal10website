import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  searchTerm;
  liveProductArr;
  nonLiveProductArr;
  defaultBanner = 'assets/images/placeholder.png';
  defaultImage = 'assets/images/placeholder.png';

  constructor(private route: ActivatedRoute, private router: Router, private onboardService: OnboardingService,
              private googleAnalyticsService: GoogleAnalyticsService, private userService: UserService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      if (param && param.key) {
        this.searchTerm = param.key;
        this.userService.setTitle('Search-' + this.searchTerm);
        this.googleAnalyticsService.pageView('Search-' + this.searchTerm);
        this.searchProduct(param.key);
      }
    });
  }

  // function to search product
  searchProduct(key) {
    const payload = {
      term: this.searchTerm
    };
    this.onboardService.searchProduct(payload).subscribe(response => {
      if (response.code === 200) {
        this.liveProductArr = response.result.Liveproduct;
        this.nonLiveProductArr = response.result.Nonliveproduct;
      }
    });
  }

}
