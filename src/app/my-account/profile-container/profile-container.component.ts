import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.css']
})
export class ProfileContainerComponent implements OnInit {
  selectedCase = 'profile';
  userinfo;
  defaultImage = 'assets/images/placeholder.png';

  constructor(private accountService: AccountService, private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.userinfo = JSON.parse(localStorage.getItem('user_data'));
    this.mainService.setTitle('My Account');
    this.googleAnalyticsService.pageView('My Account');
  }

  // function on image select
  onImageSelect(event) {
    if (event.target.files.length > 0) {
      let image = event.target.files[0];
      if (!image) {
        return;
      }
      this.mainService.showSpinner();
      let formData = new FormData();
      formData.append('profileImage', event.target.files[0]);
      this.accountService.updateProfilePic(formData).subscribe(res => {
        if (res && res.code === 200) {
          this.mainService.hideSpinner();
          this.mainService.success(res.message);
          this.userinfo.profileImage = res.result.image;
          localStorage.setItem('user_data', JSON.stringify(this.userinfo));
        } else {
          this.mainService.hideSpinner();
          this.mainService.error(res.message);
        }
      }, error => {
        this.mainService.hideSpinner();
        this.mainService.error (error);
      });
    }
  }

}
