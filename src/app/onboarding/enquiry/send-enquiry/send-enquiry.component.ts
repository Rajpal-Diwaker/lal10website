import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../_services/user.service';
import { OnboardingService } from '../../onboarding.service';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

declare let $: any;

@Component({
  selector: 'app-send-enquiry',
  templateUrl: './send-enquiry.component.html',
  styleUrls: ['./send-enquiry.component.css']
})
export class SendEnquiryComponent implements OnInit {
  sendEnquiryForm: FormGroup;
  submitted = false;
  selectedImageFile = [];
  selectedImageFileName = [];
  allImageFilesValid = false;
  userinfo;

  constructor(private fb: FormBuilder, private mainService: UserService, private onboardingService: OnboardingService,
              private router: Router, private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Send Enquiry');
    this.googleAnalyticsService.pageView('Send Enquiry');
    document.body.scrollTo(0, 0);
    this.userinfo = this.mainService.getToken();
    if (this.userinfo) {
      this.userinfo = JSON.parse(localStorage.getItem('user_data'));
      this.setSendEnquiryFormField();
    } else {
      this.router.navigate(['/']);
    }
  }

  // function to set send enquiry form field
  setSendEnquiryFormField() {
    this.sendEnquiryForm = this.fb.group({
      mobile: [this.userinfo ? this.userinfo.mobile : '', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      firstName: [this.userinfo ? this.userinfo.firstName : '', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
      lastName: [this.userinfo ? this.userinfo.lastName : '', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
      // tslint:disable-next-line: max-line-length
      email: [this.userinfo ? this.userinfo.email : '', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      companyName: [this.userinfo ? this.userinfo.storeName : ''],
      productName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      photo: [''],
      photoToSend: ['']
    });
  }

  // function to get form controls
  get f() { return this.sendEnquiryForm.controls; }

  // function on submit of form
  submit() {
    this.submitted = true;
    if (!this.sendEnquiryForm.valid) {
      return;
    }
    if (!this.selectedImageFile.length) {
      this.mainService.error('Please upload at least one image');
      return;
    }
    const formData =  new  FormData();
    formData.append('name', this.f.firstName.value);
    formData.append('name2', this.f.lastName.value);
    formData.append('mobile', this.f.mobile.value);
    formData.append('store', this.f.companyName.value);
    formData.append('email', this.f.email.value);
    formData.append('productName', this.f.productName.value);
    formData.append('description', this.f.description.value);
    if (this.selectedImageFile.length) {
      for  (let i =  0; i <  this.selectedImageFile.length; i++)  {
        formData.append('files',  this.selectedImageFile[i]);
    }
    }
    this.mainService.showSpinner();
    this.onboardingService.sendEnquiry(formData).subscribe(response => {
      if (response.code === 200) {
        this.mainService.hideSpinner();
        // this.mainService.success(response.message);
        $('#exampleModal').modal('show');
        // this.router.navigate(['/']);
      } else if (response.code === 201) {
        this.mainService.hideSpinner();
        $('#emailNotVerified1').modal('show');
        // this.mainService.error(response.message);
      }
    }, error => {
      this.mainService.hideSpinner();
      this.mainService.error(error);
    });
  }

  // function to accept number only
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // function on file upload
  onImageSelect(event) {
    // if (event.target.files.length > 0) {
    //   this.file = this.mainService.imagePreview(event.target.files[0]);
    //   this.sendEnquiryForm.get('photoToSend').setValue(event.target.files[0]);
    // }

    if(event.target.files.length > 0) {
      // this.selectedFile = [];
      Array.prototype.forEach.call(event.target.files, (file) => {

        this.selectedImageFile.push(file);
        this.toLoadBlob(file, (file, kk) => {
          this.selectedImageFileName.push({
        'fileName': file.name,
        'size': file.size,
        'valid': file.size <= 10485760 ? true : false,
        'imageFile': kk});
        this.checkImageValid();
      });

        });
    }
  }

  // function to check image is valid or not
  checkImageValid() {
    this.allImageFilesValid = this.selectedImageFileName.some(d => d.valid === false) ? false : true;
  }

  // function to load image preview
  toLoadBlob(file, cb) {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (_event) => {
            // this.blobImageFile = imageReader.result;
            cb(file, fileReader.result);
          };
          // return this.blobImageFile;
  }

  // function to remove selected image file
  removeSelectedImageFile(id) {
    this.selectedImageFile.splice(id, 1);
    this.selectedImageFileName.splice(id, 1);
  }

}
