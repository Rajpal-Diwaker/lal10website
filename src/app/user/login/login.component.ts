import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { app_strings } from '../../_constants/app_strings';
import { take } from 'rxjs/operators';
import { UserService } from '../../_services/user.service';
import { SharedService } from '../../_services/shared.service';
import { debounceTime } from 'rxjs/operators';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loader: boolean = false;
  loginFrmGrp: FormGroup;
  page1 = true;
  fieldTextType: boolean;
  correct: boolean = false;
  submitted: boolean=false;
  isEmailChecked = false;
  constructor(private router: Router, private fb: FormBuilder,
              private userService: UserService, private sharedService: SharedService,
              private googleAnalyticsService: GoogleAnalyticsService) { }
  ngOnInit() {
    this.userService.setTitle('Login');
    this.googleAnalyticsService.pageView('Login');
    this.loginFrm();
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
  }
  loginFrm() {
    this.loginFrmGrp = this.fb.group({
      email: [
        '',
        Validators.compose([Validators.required,
          // tslint:disable-next-line: max-line-length
          Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      ],
      password: ['', [Validators.required]]
    });
    this.checkEmailID();
  }
  get f() { return this.loginFrmGrp.controls }
  checkEmail() {

    this.submitted=true
    if (this.correct && !this.loginFrmGrp.get('email').invalid) {
      this.userService.error('This email is not registered with us, please register first');
    }
    if (this.correct || this.loginFrmGrp.get('email').invalid) {
      this.page1 = true;
      return;
    }
    if (this.correct === false && !this.loginFrmGrp.get('email').invalid && this.isEmailChecked) {
      this.page1 = false;
      this.submitted = false;
    }
    else {
      this.submitted = false;
      // this.page1 = false;
     }
  }
  login(val) {
    // if (this.correct) {
    //   this.userService.warning('This email is not registered with us, please register first');
    //   return;
    // }
    if (this.loginFrmGrp.invalid) {
      this.submitted=true
      // this.userService.error(app_strings.INVALID_FORM)
      return
    }
    const ob = {
      email: val.email.trim(),
      password: val.password.trim()
    }
    this.userService.login(ob)
      .pipe(take(1))
      .subscribe(res => {

        if(res.code==200){
            this.userService.setToken(res.result.authorization);
            // this.goto('/');
            // localStorage.setItem('user_data',res.result.storeName);
            const user_data = {
              firstName: res.result.firstName,
            lastName: res.result.lastName,
            email: res.result.email,
            mobile: res.result.mobile,
            storeName: res.result.storeName,
            profileImage: res.result.profileImage
            };
            localStorage.setItem('isEmailVerified', res.result.is_verified);
            localStorage.setItem('user_data', JSON.stringify(user_data));
            this.sharedService.setLocalSotrageUserInfo();
            const prodId = this.userService.getProductId();
            if (prodId) {
              this.router.navigate(['/products/detail'], { queryParams: { productId: prodId } });
            } else {
              this.router.navigate(['/'], {state: {data: 'signup'}});
            }
          }
          else{
            this.userService.error(res.message)
          }
      }, err => {})
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  goto(uri) {
    if (!uri) return;
    // this.router.navigateByUrl(uri)
    this.router.navigate([uri], { queryParams: { email: JSON.stringify(this.loginFrmGrp.value) } });
  }
  forgotPassword(val) {

    this.userService.forgotPassword(val).subscribe(res => {
      if (res && res.code === 200) {
        this.goto('/user/forgot-password');
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }
  checkEmailID() {
    // if (!this.f.email.errors) {
      // let temp = {
      //   email: val
      // }
      // this.userService.checkEmail(temp).subscribe(res => {
      //   if (res.code === 401) {

      //     this.correct = false;
      //   } else {

      //     this.correct = true;

      //   }
      // }, error => {
      // });
      this.f.email.valueChanges.pipe(debounceTime(300)).subscribe(data => {
        // alert(data);
        this.isEmailChecked = false;
        if (!this.f.email.errors) {
          this.userService.checkEmail({email: data}).subscribe(res => {
            if (res.code === 401) {
              this.correct = false;
              this.isEmailChecked = true;
            } else {
              this.correct = true;
              this.isEmailChecked = true;
            }
          }, error => {
          });
        }
      });
    // }
  }

  // function to navigate to registeration
  navigateToRegisteration() {
    this.router.navigate(['user/registration']);
  }
}
