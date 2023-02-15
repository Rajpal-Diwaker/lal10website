import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { MustMatch } from '../../_helpers/must-match';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token;
  expired = false;
  editPasswordForm: FormGroup;
  submittedPassword = false;
  newPasswordType: boolean;
  confirmPassowrdType: boolean;
  editingPassword = true;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private mainService: UserService, private router: Router,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Reset Password');
    this.googleAnalyticsService.pageView('Reset Password');
    this.route.queryParams.subscribe(params => {
      if (params && params.link) {
        this.token = params.link;
        this.setEditPasswordFormField();
      } else {
        this.expired = true;
        alert('pageExpired');
      }
    });
  }

  // function to set edit password form field
  setEditPasswordFormField() {
    this.editPasswordForm = this.fb.group({
      link: [this.token, [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validator: MustMatch('newPassword', 'confirmNewPassword') }
    );
  }

  // function to get edit password form controls
  get pass() { return this.editPasswordForm.controls; }

  // function to submit edit password form
  submitPassword() {
    this.submittedPassword = true;
    if (!this.editPasswordForm.valid || this.expired) {
      return;
    }
    const payload = {
      link: this.pass.link.value,
      newPassword: this.pass.newPassword.value
    };
    this.mainService.showSpinner();
    this.mainService.resetPassword(payload).subscribe(response => {
      if (response && response.code === 200) {
        this.mainService.success(response.message);
        this.editingPassword = false;
        this.mainService.hideSpinner();
      } else if (response && response.code === 401) {
        this.mainService.error(response.message);
        this.mainService.hideSpinner();
      } else {
        this.mainService.error(response.message);
        this.mainService.hideSpinner();
      }
    }, error => {
      this.mainService.success(error);
      this.mainService.hideSpinner();
    });
  }

  // function to show/hide passwords
  toggleFieldTextType(type) {
    if (type === 2) {
      this.newPasswordType = !this.newPasswordType;
    } else {
      this.confirmPassowrdType = !this.confirmPassowrdType;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/user/login'], { replaceUrl: true });
  }

}
