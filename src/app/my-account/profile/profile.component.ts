import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountService } from '../account.service';
import { UserService } from '../../_services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../_helpers/must-match';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() selectedOption;
  editProfileForm: FormGroup;
  submittedProfile = false;
  profileDataArr;
  editBusinessForm: FormGroup;
  submittedBusiness = false;
  @ViewChild('firstNameEle') firstNameEle;
  editingProfile = false;
  @ViewChild('storeNameEle') storeNameEle;
  editingBusiness = false;
  editPasswordForm: FormGroup;
  submittedPassword = false;
  @ViewChild('oldPasswordEle') oldPasswordEle;
  editingPassword = false;
  oldPasswordType: boolean;
  newPasswordType: boolean;
  confirmPassowrdType: boolean;

  constructor(private accountService: AccountService, private mainService: UserService, private fb: FormBuilder,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.getProfile();
    this.setEditProfileFormField();
    this.setEditBusinessFormField();
  }

  // set edit profile form filed
  setEditProfileFormField(ob?: {name, name2, mobile, email}) {
    this.submittedProfile = false;
    this.editingProfile = false;
    this.editProfileForm = this.fb.group({
      firstName: [ob ? ob.name : '', [Validators.required]],
      lastName: [ob ? ob.name2 : '', [Validators.required]],
      email: [ob ? ob.email : '', [Validators.required]],
      mobile: [ob ? ob.mobile : '', [Validators.required, Validators.minLength(10),
        Validators.maxLength(15)]]
    });
    // this.firstNameEle.nativeElement.focus();
    // debugger
  }

  // get edit profile form controls
  get p() { return this.editProfileForm.controls; }

  // submit edit profile
  submitProfile() {
    this.submittedProfile = true;
    if (!this.editProfileForm.valid) {
      return;
    }
    this.sendEvent('personal_save');
    const payload = {
      name: this.p.firstName.value,
      name2: this.p.lastName.value
    };
    this.mainService.showSpinner();
    this.accountService.editProfile(payload).subscribe(response => {
      if (response && response.code === 200) {
        this.mainService.success(response.message);
        this.getProfile();
      } else {
        this.mainService.error(response.message);
        this.mainService.hideSpinner();
      }
    }, error => {
      this.mainService.error(error);
      this.mainService.hideSpinner();
    });
  }

  // function to get profile info
  getProfile() {
    this.accountService.getProfile().subscribe(response => {
      if (response && response.code === 200) {
        this.mainService.hideSpinner();
        // const profile = response.result;
        // profile[0].name = profile[0].name.split(' ');
        this.profileDataArr = response.result;
        this.editProfileForm.disable();
        this.setEditProfileFormField(this.profileDataArr[0]);
        this.editBusinessForm.disable();
        this.setEditBusinessFormField(this.profileDataArr[0]);
      } else {
        this.mainService.error(response.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function to set edit business form field
  setEditBusinessFormField(ob?: {store}) {
    this.submittedBusiness = false;
    this.editingBusiness = false;
    this.editBusinessForm = this.fb.group({
      storeName: [ob ? ob.store : '', [Validators.required]]
    });
    // this.editBusinessForm.disable();
  }

  // function to get edit business form controls
  get b() { return this.editBusinessForm.controls; }

  // function on submit of edit business form
  submitBusiness() {
    this.submittedBusiness = true;
    if (!this.editBusinessForm.valid) {
      return;
    }
    this.sendEvent('business_save');
    const payload = {
      store: this.b.storeName.value
    };
    this.mainService.showSpinner();
    this.accountService.editBusiness(payload).subscribe(response => {
      if (response && response.code === 200) {
        this.mainService.success(response.message);
        this.getProfile();
      } else {
        this.mainService.error(response.message);
        this.mainService.hideSpinner();
      }
    }, error => {
      this.mainService.error(error);
      this.mainService.hideSpinner();
    });
  }

  // function to enable profile editing
  enableProfileEditing() {
    this.editingProfile = true;
    this.editProfileForm.enable();
    this.p.email.disable();
    this.p.mobile.disable();
    this.firstNameEle.nativeElement.focus();
  }

  // function on cancel profile editing
  cancelProfileEditing() {
    // this.submittedProfile = false;
    this.editProfileForm.disable();
    this.setEditProfileFormField(this.profileDataArr[0]);
    // this.editingProfile = false;
  }

  // function to enable business editing
  enableBusinessEditing() {
    this.editingBusiness = true;
    this.editBusinessForm.enable();
    this.storeNameEle.nativeElement.focus();
  }

  // function on cancel business editing
  cancelBusinessEditing() {
    this.editBusinessForm.disable();
    this.setEditBusinessFormField(this.profileDataArr[0]);
    // this.editingBusiness = false;
  }

  // function to set edit password form field
  setEditPasswordFormField() {
    this.submittedPassword = false;
    this.editingPassword = false;
    this.editPasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, {validator: MustMatch('newPassword', 'confirmNewPassword')}
    );
  }

  // function to get edit password form controls
  get pass() { return this.editPasswordForm.controls; }

  // function to submit edit password form
  submitPassword() {
    this.submittedPassword = true;
    if (!this.editPasswordForm.valid) {
      return;
    }
    this.sendEvent('password_save');
    const payload = {
      oldPassword: this.pass.oldPassword.value,
      newPassword: this.pass.newPassword.value
    };
    this.mainService.showSpinner();
    this.accountService.updatePassword(payload).subscribe(response => {
      if (response && response.code === 200) {
        this.mainService.success(response.message);
        this.mainService.hideSpinner();
        this.editingPassword = false;
      } else if (response && response.code === 201) { // on new password is same as old password
        this.mainService.error(response.message);
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
    if (type === 1) {
      this.oldPasswordType = !this.oldPasswordType;
    } else if (type === 2) {
      this.newPasswordType = !this.newPasswordType;
    } else {
      this.confirmPassowrdType = !this.confirmPassowrdType;
    }
  }

  sendEvent(type: string) {
    this.googleAnalyticsService.eventEmitter('My Account', type);
  }

}
