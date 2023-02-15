import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

declare let $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  headerCategoryArr;
  susbcribeForm: FormGroup;
  submitted = false;
  userinfo;
  blogsFalg: boolean;

  constructor(private router: Router, private fb: FormBuilder, private userService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.setSubscribeForm();
    this.userinfo = this.userService.getToken();
    setTimeout(() => {
      this.headerCategoryArr = JSON.parse(localStorage.getItem('mainCat'));
    }, 3000);
  }

  // function to navigate to routes
  goto(data, type?: string) {
    if (type) {
      this.sendEvent(type, '');
    }
    this.router.navigate([data]);
  }

  // function to set form field
  setSubscribeForm() {
    this.submitted = false;
    this.susbcribeForm = this.fb.group({
      // tslint:disable-next-line: max-line-length
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    });
  }

  get f() { return this.susbcribeForm.controls; }

  // function on submit subscribe
  submit() {
    this.submitted = true;
    if (!this.susbcribeForm.valid) {
      setTimeout(() => {
        this.submitted = false;
      }, 5000);
      return;
    }
    let payload = {
      email: this.f.email.value
    };
    this.userService.subscribeEmail(payload).subscribe(response => {
      if (response.code === 200) {
        // this.f.email.setValue('');
        this.sendEvent('Footer_subscribe', '');
        this.setSubscribeForm();
        this.userService.success(response.message);
        this.removeLabel();
      } else {
        this.userService.error(response.message);
        this.removeLabel();
      }
    }, error => {
      this.userService.error(error);
    });
  }

  checkLogin(data) {
    if (this.userinfo) {
      this.goto(data);
    } else {
      $('#noLoggedIn1').modal('show');
    }
  }

  downloadCatalogue() {
    window.open('https://www.dropbox.com/sh/ngf6su9ylbkao9s/AAB6uu6a9jkWBrwguhNTGK-la?dl=0', '_blank');
    // $('#downCat').modal('hide');
    // this.layoutService.catalogue().subscribe(res => {
    //   if (res && res.code === 200) {
    //     window.open(res.result[0].link, '_blank');
    //     // $('#downCat').modal('hide');
    //   } else {
    //     this.userService.error(res.message);
    //   }
    // }, error => {
    //   this.userService.error(error);
    // });
  }

  scrollGoTo(data, type?: string) {
    if (type) {
      this.sendEvent(type, '');
    }
    const url = this.router.url.toString();
    if (url === '/') {
      // const r = Math.random().toString(36).substring(7);
      this.router.navigate(['/'], { queryParams:  { scroll: data }});
    } else {
      const r = Math.random().toString(36).substring(7);
      this.router.navigate(['/'], { queryParams:  { scroll: data, data: r }});
    }
    // this.router.navigateByUrl(`/?scroll=${data}`);
  }

  showDownlaodCatPopup() {
    this.sendEvent('Footer_download_catelogue', '');
    $('#downCat').modal('show');
  }

   // function to remove top header label
   removeLabel() {
    $('#remove_label').hide();
    $('.middle_contant_wrap').addClass('add_height');
  }
  showComingSoon(type: string) {
    this.sendEvent(type, '');
    $('#comingSoon').modal('show');
  }

  sendEvent(type: string, label: string) {
    this.googleAnalyticsService.eventEmitter(type, label);
  }

}
