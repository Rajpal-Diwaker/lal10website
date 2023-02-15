import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MustMatch } from '../../_helpers/must-match';
// import { UserService } from '../user.service';
import { take, debounceTime } from 'rxjs/operators';
import { app_strings } from '../../_constants/app_strings';
import { Router } from '@angular/router';
import { UrlChecker } from '../../_helpers/url-checker';
import { environment } from '../../../environments/environment';
import { UserService } from '../../_services/user.service';
import { HttpClient } from '@angular/common/http';
import * as data from './countrycode.json';
import { SharedService } from '../../_services/shared.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

declare var $: any;
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registerFrmGrp: FormGroup;
  typeOfStoreArr: any = [];
  hearAboutUsArr: any = [];
  load = 1;
  userId: any;
  state = 'mortal';
  submitted1: boolean = false;
  submitted2: boolean = false;
  submitted3: boolean = false;
  submitted: boolean = false;
  animating;
  about_us: FormArray;
  product_types: FormArray;
  cust_important: FormArray;
  productsArr: any = [];
  custArr: any = [];
  imageUrl: any = environment.image_url;
  aboutUsErr: boolean = false;
  productTypeErr: boolean = false;
  custImpErr: boolean = false;
  codeArray: any[];
  correct;
  correctPhone;
  customerImportantArr;
  isEmailChecked = false;
  isMobileChecked = false;
  countryListArr = [];
  defaultImg = app_strings.DEF_IMAGE_URL;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private sharedService: SharedService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.getCountryCodesList();
    this.customerImportantArr = [
      {id: 1, value: 'Home Made'},
      {id: 2, value: 'Social Goods'},
      {id: 3, value: 'Made In India'},
      {id: 4, value: 'Made Locally'},
      {id: 5, value: 'Eco Friendly'},
      {id: 6, value: 'Not On Amazon'}
    ];
  }

  ngOnInit() {
    this.userService.setTitle('Registration');
    this.googleAnalyticsService.pageView('Registration');
    // if (!localStorage.getItem('foo')) {
    //     localStorage.setItem('foo', 'no reload')
    //     location.reload()
    //   } else {
    //     localStorage.removeItem('foo')
    //   }
    this.typeOfStore();
    this.hearAboutUs();
    this.products();
    this.custImportant();
    this.getCountryList();
    this.registerFrm();
    $('.scroll_top_data').on("click",function(){
      $(window).scrollTop(0);
});
    // this.customerImportantArr.forEach((element) => {
    //   const { id, value } = element;

    //   this.addCustImp({ id, value, isChecked: false });
    // });

    var current_fs, next_fs, previous_fs;
    var left, opacity, scale;

    var that = this;
    $(document).on('click', '.next', function () {

      var id = +$(this).attr('id');

      that.validateFrm(id);

      if (that.animating) return false;

      that.animating = true;

      current_fs = $(this).parent();

      next_fs = $(this).parent().next();
      // $('input[type=radio][name=store_type]').click(function () {
      //   var srcVal = $('#srcId').val();
      //   if (srcVal != '') {
      //     $('input[name=store_type').each(function () {
      //       var oldVal = $(this)
      //         .parents('.select_product_wrapper')
      //         .find('.fix_img')
      //         .attr('src');
      //       var attrSrc = $(this)
      //         .parents('.select_product_wrapper')
      //         .find('.hover_img')
      //         .attr('src');
      //       if (oldVal == attrSrc) {
      //         $(this)
      //           .parents('.select_product_wrapper')
      //           .find('.fix_img')
      //           .attr('src', srcVal);
      //       }
      //     });
      //   }
      //   var oldVal = $(this)
      //     .parents('.select_product_wrapper')
      //     .find('.fix_img')
      //     .attr('src');
      //   var attrSrc = $(this)
      //     .parents('.select_product_wrapper')
      //     .find('.hover_img')
      //     .attr('src');
      //   $(this)
      //     .parents('.select_product_wrapper')
      //     .find('.fix_img')
      //     .attr('src', attrSrc);
      //   $('#srcId').val(oldVal);
      // });
      // $('input[type=radio][name=customer]').click(function () {
      //   var srcVal = $('#srcId1').val();
      //   if (srcVal != '') {
      //     $('input[name=customer').each(function () {
      //       var oldVal = $(this)
      //         .parents('.select_product_wrapper')
      //         .find('.fix_img')
      //         .attr('src');
      //       var attrSrc = $(this)
      //         .parents('.select_product_wrapper')
      //         .find('.hover_img')
      //         .attr('src');
      //       if (oldVal == attrSrc) {
      //         $(this)
      //           .parents('.select_product_wrapper')
      //           .find('.fix_img')
      //           .attr('src', srcVal);
      //       }
      //     });
      //   }
      //   var oldVal = $(this)
      //     .parents('.select_product_wrapper')
      //     .find('.fix_img')
      //     .attr('src');
      //   var attrSrc = $(this)
      //     .parents('.select_product_wrapper')
      //     .find('.hover_img')
      //     .attr('src');
      //   $(this)
      //     .parents('.select_product_wrapper')
      //     .find('.fix_img')
      //     .attr('src', attrSrc);
      //   $('#srcId1').val(oldVal);
      // });


      // $('input[type=radio][name=store_type]').change(function() {
      //   $('input[name=store_type').each(function() {
      //   $(this).parents('.select_product_wrapper').find('.fix_img').removeAttr("style");
      //   //$(this).parents('.select_product_wrapper').find('.hover_img').removeAttr("style");
      //   $(this).parents('.select_product_wrapper').find('.clickImg').hide();
      //   })
      //   $(this).parents('.select_product_wrapper').find('.fix_img').hide();
      //   //$(this).parents('.select_product_wrapper').find('.hover_img').hide();
      //   $(this).parents('.select_product_wrapper').find('.clickImg').removeAttr("style");
      //   });

      // $('input[type=checkbox][name=isChecked]').click(function() {

      //   $('input[name=isChecked').each(function() {
      //   $(this).parents('.select_product_wrapper').find('.fix_img').hide();
      //   //$(this).parents('.select_product_wrapper').find('.hover_img').hide();
      //   $(this).parents('.select_product_wrapper').find('.clickImg').removeAttr("style");
      //   if(!$(this).is(':checked')){
      //   var oldVal = $(this).parents('.select_product_wrapper').find('.fix_img').removeAttr("style");
      //   //var attrSrc = $(this).parents('.select_product_wrapper').find('.hover_img').show();
      //   $(this).parents('.select_product_wrapper').find('.clickImg').hide();
      //   }
      //   })
      //   });



      $('#progressbar li').eq($('fieldset').index(next_fs)).addClass('active');

      next_fs.show();
      current_fs.animate(
        { opacity: 0 },
        {
          step: function (now, mx) {
            scale = 1 - (1 - now) * 0.2;
            left = now * 50 + '%';
            opacity = 1 - now;
            current_fs.css({ transform: 'scale(' + scale + ')' });
            next_fs.css({ left: left, opacity: opacity });
          },
          duration: 500,
          complete: function () {
            current_fs.hide();
            that.animating = false;
          },
          easing: 'easeOutQuint',
        }
      );
    });

    $(document).on('click', '.previous', function () {
      // if (that.animating) return false;
      that.animating = true;

      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev();

      $('#progressbar li')
        .eq($('fieldset').index(current_fs))
        .removeClass('active');

      previous_fs.show();
      current_fs.animate(
        { opacity: 0 },
        {
          step: function (now, mx) {
            scale = 0.8 + (1 - now) * 0.2;
            left = (1 - now) * 50 + '%';
            opacity = 1 - now;
            current_fs.css({ left: left });
            previous_fs.css({
              transform: 'scale(' + scale + ')',
              opacity: opacity,
            });
          },
          duration: 500,
          complete: function () {
            current_fs.hide();
            that.animating = false;
          },
          easing: 'easeOutQuint',
        }
      );
    });
    // $(".submit").on('click', () => {
    //   return false;
    // });
  }
  validateFrm(part) {
    // window.location.hr = '#/user'

    const invalid = [];
    const controls = this.registerFrmGrp.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }


    const {
      name,
      name2,
      countryCode,
      email,
      // phone,
      password,
      country,
      cnfrmPassword,
      mobile,
      store_type,
      store_name,
      store_years,
      store_postal_code,
      store_website_url,
      store_describe,
      about_us,
      product_types,
      customer,
      cust_important,
    } = this.f;

    this.animating = false;

    switch (part) {
      case 1:
        this.animating =
          name.errors ||
          name2.errors ||
          this.correctPhone == false ||
          this.correct == false ||
          email.errors ||
          country.errors ||
          // phone.errors ||
          password.errors ||
          cnfrmPassword.errors ||
          countryCode.errors ||
          mobile.errors;
        break;
      case 2:
        this.animating = !store_type.value;
        break;
      case 3:
        this.animating = store_name.errors || store_postal_code.errors;
        break;
      case 4:
        this.animating = store_name.errors || store_website_url.errors;
        break;
      case 5:
        this.animating = store_name.errors || store_postal_code.errors;
        break;
      case 6:
        this.animating = store_name.errors || store_describe.errors;
        break;
      case 7:
        this.animating = this.aboutUsErr;
          // about_us.value.filter((element) => !element.isChecked).length ==
          // about_us.value.length;
        break;
      case 8:
        // debugger
        this.animating = this.productTypeErr =
          product_types.value.filter((element) => !element.isChecked).length ==
          product_types.value.length;
        break;
      case 9:
        // this.animating = customer.errors;
        // this.animating = this.custImpErr =
        // cust_important.value.filter((element) => !element.isChecked).length ==
        // cust_important.value.length;
        this.animating = customer.errors;
        break;
      default:
        this.animating = false;
        break;
    }
    if (this.animating && this.animating.required == true)
      this.animating = true;

    if (this.animating) {
      this.submitted = true;
      this.animating = true;
      for (const control in this.f) {
        if (this.f.hasOwnProperty(control)) {
          if (this.f[control].status == 'INVALID') {
            this.f[control].markAsTouched();
          }
        }
      }
    } else {
      // alert('hi')
      // window.scrollTo(0, 0)
      // document.documentElement.scrollTop = 0;
      // document.body.scrollTo(0, 0)
    }
  }

  registerFrm() {
    this.registerFrmGrp = this.fb.group(
      {
        name: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(app_strings.ALPHABET_PATTERN),
          ]),
        ],
        name2: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(app_strings.ALPHABET_PATTERN),
          ]),
        ],
        email: [
          '',
          Validators.compose([Validators.required,
            // tslint:disable-next-line: max-line-length
            Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        ],
        // phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(15)])],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ]),
        ],
        cnfrmPassword: ['', Validators.compose([Validators.required])],
        country: ['', Validators.compose([Validators.required])],
        countryCode: ['+91', Validators.compose([Validators.required])],
        mobile: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(15),
          ]),
        ],
        store_type: ['', Validators.compose([Validators.required])],

        /* common for all except resellers */
        store_name: [''],

        /* brick and mortal start */
        store_years: [''],
        /* brick and mortal end */
        // popupshop start here
        store_postal_code: [''],
        // popupshop end here
        /* online start here */
        store_website_url: [''],
        /* online end here */
        /* other start here*/
        store_describe: [''],
        /* other end here*/

        about_us: this.fb.array([]),
        product_types: this.fb.array([]),
        cust_important: this.fb.array([]),
        customer: ['', Validators.compose([Validators.required])],
      },
      { validator: [MustMatch('password', 'cnfrmPassword')] }
    );
    this.checkEmail();
    this.checkUserMobile();
  }
  stateCondition() {
    this.state = this.registerFrmGrp.value.store_type;
    //Retail Store   Online Store    Online Store    Others

    if (this.state == 'Retail Store') {
      this.registerFrmGrp
        .get('store_postal_code')
        .setValidators([Validators.required, Validators.maxLength(8)]);
      this.registerFrmGrp
        .get('store_name')
        .setValidators([Validators.required]);
      this.registerFrmGrp.get('store_years').clearValidators();
      this.registerFrmGrp.get('store_website_url').clearValidators();
      this.registerFrmGrp.get('store_describe').clearValidators();
    }
    if (this.state == 'Resellers') {
      // debugger
      this.registerFrmGrp
        .get('store_postal_code')
        .setValidators([Validators.required, Validators.maxLength(8)]);
      this.registerFrmGrp.get('store_years').clearValidators();
      this.registerFrmGrp.get('store_website_url').clearValidators();
      this.registerFrmGrp.get('store_describe').clearValidators();
      this.registerFrmGrp.get('store_name').clearValidators();
      this.registerFrmGrp.get('store_name').setValue('');
    }
    if (this.state == 'Online Store') {
      this.registerFrmGrp
        .get('store_website_url')
        .setValidators([
          Validators.required,
          Validators.pattern(app_strings.URL_PATTERN1),
        ]);
      this.registerFrmGrp
        .get('store_name')
        .setValidators([Validators.required]);
      this.registerFrmGrp.get('store_postal_code').clearValidators();
      this.registerFrmGrp.get('store_years').clearValidators();
      this.registerFrmGrp.get('store_describe').clearValidators();
    }
    if (this.state == 'Others') {
      this.registerFrmGrp
        .get('store_describe')
        .setValidators([Validators.required, Validators.maxLength(500)]);
      this.registerFrmGrp
        .get('store_name')
        .setValidators([Validators.required]);
      this.registerFrmGrp.get('store_postal_code').clearValidators();
      this.registerFrmGrp.get('store_website_url').clearValidators();
      this.registerFrmGrp.get('store_years').clearValidators();
    }
    this.registerFrmGrp.get('store_postal_code').updateValueAndValidity();
    this.registerFrmGrp.get('store_website_url').updateValueAndValidity();
    this.registerFrmGrp.get('store_years').updateValueAndValidity();
    this.registerFrmGrp.get('store_describe').updateValueAndValidity();
    this.registerFrmGrp.get('store_name').updateValueAndValidity();
  }

  typeOfStore() {
    this.userService
      .typeOfStore()
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.typeOfStoreArr = res.result;
        },
        (err) => {}
      );
  }

  products() {
    this.userService
      .productsSignUp()
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.productsArr = res.result;

          this.productsArr.forEach((element) => {
            const { id, title, image } = element;

            this.addProductItem({ id, name: title, image, isChecked: false });
          });
        },
        (err) => {}
      );
  }
  custImportant() {
    this.userService
      .custImportant()
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.custArr = res.result;

          this.custArr.forEach((element) => {
            const { id, type, icon } = element;

            this.addCustImp({ id, name: type, image: icon, isChecked: false });
          });
        },
        (err) => {}
      );
  }

  createAboutItem(ob = { id: '', type: '', isChecked: '' }): FormGroup {
    return this.fb.group(ob);
  }

  createProductItem(
    ob = { id: '', name: '', image: '', isChecked: '' }
  ): FormGroup {
    return this.fb.group(ob);
  }

  addAboutItem(ob): void {
    this.about_us = this.registerFrmGrp.get('about_us') as FormArray;
    this.about_us.push(this.createAboutItem(ob));
  }

  addProductItem(ob): void {
    this.product_types = this.registerFrmGrp.get('product_types') as FormArray;
    this.product_types.push(this.createProductItem(ob));
  }

  addCustImp(ob): void {
    this.cust_important = this.registerFrmGrp.get('cust_important') as FormArray;
    this.cust_important.push(this.createCustImp(ob));
  }

  createCustImp(ob = { id: '', name: '', image: '', isChecked: ''}): FormGroup {
    return this.fb.group(ob);
  }

  get f() {
    return this.registerFrmGrp.controls;
  }
  flickerArr: any = {};

  def(e, id) {
    // this.flickerArr[id] = this.flickerArr[id] ? ++this.flickerArr[id] : 0;
    // const img = 'assets/images/product_9.png';
    // if (!e && this.flickerArr[id] > 1) return;
    e.target.src = this.defaultImg;
  }

  hearAboutUs() {
    this.userService
      .hearAboutUs()
      .pipe(take(1))
      .subscribe(
        (res) => {
          const { result } = res;
          this.hearAboutUsArr = result;

          this.hearAboutUsArr.forEach((element) => {
            const { id, type } = element;

            this.addAboutItem({ id, type, isChecked: false });
          });
        },
        (err) => {}
      );
  }

  submit() {
    const invalid = [];
    const controls = this.registerFrmGrp.controls;
    if (this.correct == false) {
      this.userService.error('This email exist please try again');
      return;
    }
    if (this.correctPhone == false) {
      this.userService.error('This mobile no exist please try again.');
      return;
    }
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if (this.registerFrmGrp.invalid) return;
    // $('#exampleModal').modal('toggle');
    const {
      name,
      name2,
      email,
      // phone,
      password,
      country,
      countryCode,
      cnfrmPassword,
      mobile,
      store_type,
      store_name,
      store_years,
      store_postal_code,
      store_website_url,
      store_describe,
      about_us,
      product_types,
      cust_important,
    } = this.registerFrmGrp.value;
    let hearabout = [];
    about_us.forEach((element) => {
      if (element.isChecked) {
        hearabout.push(element.id);
      }
    });
    let category = [];
    product_types.forEach((element) => {
      if (element.isChecked) {
        category.push(element.id);
      }
    });
    let cImortant = [];
    cust_important.forEach(element => {
      if (element.isChecked) {
        // debugger
        cImortant.push(element.id);
      }
    });
    let hear = hearabout.toString();
    let cat = category.toString();
    let cimportant = cImortant.toString();
    let obj = {
      name,
      name2,
      email,
      mobile,
      password,
      country: country,
      // phone,
      countryCode,
      typeofstore: store_type,
      store: store_name,
      year: store_years,
      bussiness: 'cotton Product 123',
      postalCode: store_postal_code,
      websiteUrl: store_website_url,
      description: store_describe,
      hearabout: hear,
      category: cat,
      customerImportant: cimportant,
    };
    // return;

    this.userService
      .signUp(obj)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res.code === 200) {
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
          this.userService.setToken(res.result.authorization);
          localStorage.setItem('isEmailVerified', res.result.is_verified);
          localStorage.setItem('user_data', JSON.stringify(user_data));
          this.sharedService.setLocalSotrageUserInfo();
          this.googleAnalyticsService.eventEmitter('SignUp_Congratulations_Popup');
          $('#exampleModal').modal('toggle');
          }
        },
        (err) => {}
      );
  }

  goto(uri) {
    if (!uri) return;
    // this.router.navigateByUrl(uri)
    window.location.href = '#/user';

    // window.open('/user','_slel')
  }
  getCountryCodesList() {
    this.codeArray = data.countries;
  }
  checkEmail() {
    this.f.email.valueChanges.pipe(debounceTime(300)).subscribe(data1 => {
      this.isEmailChecked = false;
      if (!this.f.email.errors) {
        let temp = {
          email: data1,
        };
        this.userService.checkEmail(temp).subscribe(
          (res) => {
            if (res.code == 401) {
              this.correct = false;
              this.isEmailChecked = true;
              this.userService.error(res.message);
              // this.registerFrmGrp.get('email').setValue('')
            } else {
              this.correct = true;
              this.isEmailChecked = true;
            }
          },
          (error) => {
          }
        );
      }
    });
  }
  checkUserMobile() {
    this.f.mobile.valueChanges.pipe(debounceTime(300)).subscribe(data1 => {
      this.isMobileChecked = false;
      // this.correctPhone = undefined;
      if (!this.f.mobile.errors) {
        let temp = {
          mobile: data1,
        };
        this.userService.checkUserMobile(temp).subscribe(
          (res) => {
            if (res.code == 401) {
              this.correctPhone = false;
              this.isMobileChecked = true;
              this.userService.error(res.message);
            } else {
              this.correctPhone = true;
              this.isMobileChecked = true;
            }
          },
          (error) => {
          }
        );
      }
    });
  }
  next(val) {
    // document.documentElement.scrollTop = 0;

    // this.submitted = true;
    const invalid = [];
    const controls = this.registerFrmGrp.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    switch (val) {
      case '1':
        let temp = [
          'name',
          'name2',
          'email',
          'country',
          'password',
          'cnfrmPassword',
          'countryCode',
          'mobile',
        ];

        temp = temp.filter((el) => {
          if (this.correct === false && !this.f.email.errors) {
            this.userService.error('This email exist please try again');
          }
          if (this.correctPhone === false && !this.f.mobile.errors) {
            this.userService.error('This mobile no. exist please try again');
          }
          if (invalid.includes(el)) {
            return true;
          }
        });

        if (temp.length) {
          this.submitted = true;
        } else this.submitted = false;

        break;
      case '2':
        let temp2 = ['store_type'];

        temp2 = temp2.filter((el) => {
          if (invalid.includes(el)) {
            return true;
          }
        });

        if (temp2.length) {
          this.submitted = true;
        } else this.submitted = false;
        break;
      case '3':
        let temp3 = ['store_name', 'store_postal_code'];

        temp3 = temp3.filter((el) => {
          if (invalid.includes(el)) {
            return true;
          }
        });

        if (temp3.length) {
          this.submitted = true;
        } else this.submitted = false;
        break;
      case '4':
        let temp4 = ['store_name', 'store_website_url'];

        temp4 = temp4.filter((el) => {
          if (invalid.includes(el)) {
            return true;
          }
        });

        if (temp4.length) {
          this.submitted = true;
        } else this.submitted = false;
        break;
      case '5':
        let temp5 = ['store_name', 'store_postal_code'];

        temp5 = temp5.filter((el) => {
          if (invalid.includes(el)) {
            return true;
          }
        });

        if (temp5.length) {
          this.submitted = true;
        } else this.submitted = false;
        break;
      case '6':
        let temp6 = ['store_describe', 'store_name'];

        temp6 = temp6.filter((el) => {
          if (invalid.includes(el)) {
            return true;
          }
        });

        if (temp6.length) {
          this.submitted = true;
        } else this.submitted = false;
        break;
      case '7':
        this.submitted = false;
        let temp7 = this.registerFrmGrp.get('about_us').value;
        temp7 = temp7.filter(el => {
          if (el.isChecked) {
            return true;
          }
        })
        if (temp7.length) this.aboutUsErr = false;
        else this.aboutUsErr = false; // to make about us required change it to true
        break;
      case '8':
        let temp8 = this.registerFrmGrp.get('product_types').value;
        temp8 = temp8.filter((el) => {
          if (el.isChecked) {
            return true;
          }
        });
        if (temp8.length) this.productTypeErr = false;
        else this.productTypeErr = true;
        break;
      case '9':
        // this.submitted = false;
        let temp9 = this.registerFrmGrp.get('cust_important').value;
        temp9 = temp9.filter((el) => {
          if (el.isChecked) {
            return true;
          }
        });
        if (temp9.length) {
          this.custImpErr = false;
          this.registerFrmGrp.controls.customer.clearValidators();
          this.registerFrmGrp.controls.customer.updateValueAndValidity();
        } else { this.custImpErr = true;
                 this.registerFrmGrp.controls.customer.setValidators(Validators.required);
                 this.registerFrmGrp.controls.customer.updateValueAndValidity(); }
        break;
      default:
        this.submitted = false;
        break;
    }
  }

  // function to navigate to login
  navigateToHome() {
    this.googleAnalyticsService.eventEmitter('SignUp_Congratulations_Continue');
    const prodId = this.userService.getProductId();
    if (prodId) {
              this.router.navigate(['/products/detail'], { queryParams: { productId: prodId } });
            } else {
              this.router.navigate(['/'], {state: {data: 'signup'}});
            }
    // this.router.navigate(['/'], {state: {data: 'signup'}});
  }
  getCountryList() {
    this.userService.getCountry().subscribe(res => {
      if (res && res.code === 200) {
        this.countryListArr = res.result;
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  sendEvent(type: string) {
    this.googleAnalyticsService.eventEmitter('Sign Up Screen', type);
  }

  sendEventSelectStore(type: string) {
    this.googleAnalyticsService.eventEmitter('Store_select_screen', type);
  }

  sendEventHearFrom(type: string) {
    this.googleAnalyticsService.eventEmitter('Select_hear_from', type);
  }

  sendEventProductSold(type: string) {
    this.googleAnalyticsService.eventEmitter('Products_sold_screen', type);
  }

  sendEventCustCareAbout(type: string) {
    this.googleAnalyticsService.eventEmitter('Cust_CareAbout_Screen', type);
  }

  nextClickEvent() {
    this.sendEventSelectStore('Store_select_next');
    const selectedType = this.registerFrmGrp.controls.store_type.value;
    if (selectedType) {
      switch (selectedType) {
        case 'Retail Store':
          this.sendEventSelectStore('Store_retail_next');
          break;

          case 'Resellers':
          this.sendEventSelectStore('Store_reseller_next');
          break;

          case 'Online Store':
          this.sendEventSelectStore('Store_online_next');
          break;

          case 'Others':
          this.sendEventSelectStore('Store_others_next');
          break;

        default:
          break;
      }
    }

  }

  prevClickEvent() {
    this.sendEventSelectStore('Store_select_back');
    const selectedType = this.registerFrmGrp.controls.store_type.value;
    if (selectedType) {
      switch (selectedType) {
        case 'Retail Store':
          this.sendEventSelectStore('Store_retail_back');
          break;

          case 'Resellers':
          this.sendEventSelectStore('Store_reseller_back');
          break;

          case 'Online Store':
          this.sendEventSelectStore('Store_online_back');
          break;

          case 'Others':
          this.sendEventSelectStore('Store_others_back');
          break;

        default:
          break;
      }
    }
  }

  alert1(val) {
    alert(val);
  }
}
