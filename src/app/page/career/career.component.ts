import { Component, OnInit } from '@angular/core';
import { PageService } from '../page.service';
import { UserService } from '../../_services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

declare let $: any;

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css']
})
export class CareerComponent implements OnInit {
  careerArr;
  selectedJob;
  careerForm: FormGroup;
  submitted = false;
  userinfo;
  selectedImageFile = [];
  selectedImageFileName = [];

  constructor(private pageService: PageService, private mainService: UserService, private fb: FormBuilder,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Career');
    this.googleAnalyticsService.pageView('Career');
    this.getCareers();
  }

  // function to get careers
  getCareers() {
    this.pageService.career().subscribe(res => {
      if (res && res.code === 200) {
        this.careerArr = res.result;
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  checkDetails(data) {
    this.selectedJob = data;
    this.userinfo = this.mainService.getToken();
    if (this.userinfo) {
      this.userinfo = JSON.parse(localStorage.getItem('user_data'));
      this.setFormsField(this.userinfo);
    } else {
      this.setFormsField();
    }
    this.scrollFunction('jobDiscrip');
  }

  setFormsField(data?) {
    this.submitted = false;
    this.careerForm = this.fb.group({
      name: [data ? data.firstName + ' ' + data.lastName : '', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
      // tslint:disable-next-line: max-line-length
      email: [data ? data.email : '', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      mobile: [data ? data.mobile : '', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      subject: ['', [Validators.required]],
      write: ['']
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

  get f() { return this.careerForm.controls; }

  submit() {
    // this.mainService.showSpinner();
    // return;
    this.submitted = true;
    if (!this.careerForm.valid) {
      return;
    }
    const formData =  new  FormData();
    formData.append('fullName', this.f.name.value);
    formData.append('mobile', this.f.mobile.value);
    formData.append('subject', this.f.subject.value);
    formData.append('email', this.f.email.value);
    if (this.selectedImageFile.length) {
      for  (let i =  0; i <  this.selectedImageFile.length; i++)  {
        formData.append('files',  this.selectedImageFile[i]);
    }
    } else {
      this.mainService.error('Please upload resume');
      return;
    }
    // if (this.f.write.value) {
    //   formData.append('description', this.f.write.value);
    // } else {
    //   formData.append('description', '');
    // }
    this.mainService.showSpinner();
    this.pageService.sendResume(formData).subscribe(res => {
      if (res && res.code === 200) {
        this.mainService.success(res.message);
        this.mainService.hideSpinner();
        this.selectedImageFile = [];
        this.selectedImageFileName = [];
        this.setFormsField();
        this.selectedJob = undefined;
        this.scrollFunction('topOp');
      } else {
        this.mainService.hideSpinner();
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.hideSpinner();
      this.mainService.error(error);
    });
  }

  scrollFunction(data) {
    $('html, body').animate({
      scrollTop: $('#' + data).offset().top + -150
  }, 1000);
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
        // this.checkImageValid();
      });

        });
    }
  }

  // function to check image is valid or not
  checkImageValid() {
    // this.allImageFilesValid = this.selectedImageFileName.some(d => d.valid === false) ? false : true;
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
