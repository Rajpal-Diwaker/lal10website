import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
// import * as AOS from '../../../assets/js/aos.js';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { UserService } from '../../_services/user.service';
import { SharedService } from '../../_services/shared.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnboardingService } from '../onboarding.service.js';
import { Router, ActivatedRoute } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

declare let $: any;


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit, AfterViewInit, OnDestroy {
  userinfo;
  kuldeep;
  subscribeEmailForm: FormGroup;
  submitted = false;
  imageSliderArr;
  emailVerified;
  emailVerificationFlag = false;
  onboardingPopupArr;
  newsfeedArr;
  exhibitionArr;
  bestsellingProductsArr;
  avenueArr;
  brandsArr;
  serviceSectorArr;
  customerFeedbackArr;
  worldManufacturingArr;
  servicingIndiaArr;
  lat = 11.5481416;
  lng = 23.2664882;
  zoom: number = 2;
  bestsellingCategoriesArr;
  worldMapArr;
  indiaMapArr;
  scroll;
  exhibitionRegisterForm: FormGroup;
  submitted2 = false;
  exhibitionPopup = true;
  exhibitionId;
  show = false;
  isDragging: boolean;
  defaultImage = 'assets/images/placeholder.png';
  defaultBanner = 'assets/images/Placeholder.PNG';
  bannerListSubs: Subscription;
  onBoardingSubs: Subscription;
  newsFeedSubs: Subscription;
  exhibitionSubs: Subscription;
  bestSellingProuctsSubs: Subscription;
  avenueSubs: Subscription;
  brandsSubs: Subscription;
  serviceSectorSubs: Subscription;
  customerFeedbackSubs: Subscription;
  worldManuSubs: Subscription;
  servicingIndSubs: Subscription;
  bestSellingCatSubs: Subscription;
  worldMapSubs: Subscription;
  indiaMapSubs: Subscription;
  scrollTime = 2500;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };
  newsFeedOptions: OwlOptions = {
    loop: true,
    margin: 30,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    nav: true,
      navSpeed: 700,
    navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1023: {
        items: 2
      },
      1024: {
        items: 2
      },
      1200: {
        items: 2
      }
    },
  };
  customerFeedbackOptions: OwlOptions = {
    // autoplay:true,
    loop: true,
    margin: 30,
    center: false,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1023: {
        items: 1
      },
      1201: {
        items: 1
      }
    },
    nav: true,
  };
  bestCategories: OwlOptions = {
    loop: true,
    margin: 35,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    nav: true,
    autoplay: true,
    autoWidth: true,
    navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items: 1,
        margin: 10,
      },
      600: {
        items: 3,
        margin: 20,
      },
      1023: {
        items: 3
      },
      1201: {
        items: 3
      }
    },
  };
  onboardingPopup: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };
  bestSelling: OwlOptions = {
    loop: true,
    margin: 10,
    center: false,
    nav: true,
    dots: false,
    autoWidth: true,
    navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 4
      },
      1023: {
        items: 4
      },
      1170: {
        items: 4
      }
    }
  };
  brands: OwlOptions = {
    loop: true,
    autoplay:true,
    margin: 0,
    center: true,
    nav: true,
    dots: false,
    autoWidth: true,
    navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items:3,
      },
      600: {
        items: 3,
      },
      768: {
        items: 5
      },
      1023: {
        items: 5
      },
      1170: {
        items: 5
      }
    }
  };

  constructor(private userService: UserService, private sharedService: SharedService, private fb: FormBuilder,
              private onboardingService: OnboardingService, private router: Router, private route: ActivatedRoute,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.userService.setTitle('Lal10');
    this.googleAnalyticsService.pageView('Homepage');
    if (!history.state.data) {
      this.emailVerificationFlag = false;
    } else if (history.state.data === 'signup') {
      this.emailVerificationFlag = true;
    }
    // this.sharedService.setLocalSotrageUserInfo();
    // this.sharedService.getLocalStorageUserData().subscribe(data => {
    //   if (data === 'loggedIn') {
    //     // debugger
    //     this.userinfo = data;
    //   } else if (data === 'loggedOut') {
    //     this.userinfo = undefined;
    //     this.getOnboardingPopup();
    //   }
    //   this.emailVerified = this.userService.checkEmailVerified();
    // });
    this.userinfo = this.userService.getToken();
    if (this.userinfo) {
      this.userinfo = JSON.parse(localStorage.getItem('user_data'));
      this.setExhibitionFormField(this.userinfo);
    } else {
      this.getOnboardingPopup();
      this.setExhibitionFormField();
    }
    this.route.queryParams.subscribe(params => {
      if (params && params.scroll) {
        this.scroll = params.scroll;
        if (params.data) {
          if (this.scroll === 'avenueCust') {
            this.scrollTime = 6100;
          }
          this.scrollFunction();
        } else {
          this.srcollForHomepage();
        }
        this.router.navigate(
          ['/'],
          { relativeTo: this.route }
        );
      } else {
        document.body.scrollTo(0, 0);
      }
    });

    // this.userinfo = this.userService.getToken();
    this.setSubscribeEmailFormField();
    this.getBanner();

    // this.getWorldMap();
    // this.getIndiaMap();
  }

  ngAfterViewInit() {
    // window.scrollTo(0, 0)
    // const checkModel = sessionStorage.getItem('onboadingModelRendered');
    // if (!this.userinfo && !checkModel) {
    //   setTimeout(() => {
    //     $('#onboarding').modal('show');
    //     sessionStorage.setItem('onboadingModelRendered', '1');
    //   }, 4000);
    // }
    if (this.emailVerified === '0' && this.emailVerificationFlag === true) {
      // show popup to verify email
      if (this.userinfo) {
        setTimeout(() => {
          $('#emailNotVerified').modal('show');
        }, 3000);
      }
    } else {
      // don't show
    }


  }

  ngOnDestroy() {
    // alert('ONBOARDING DESTROYED');
    if (this.imageSliderArr) {
      this.bannerListSubs.unsubscribe();
    }
    if (this.onboardingPopupArr) {
      this.onBoardingSubs.unsubscribe();
    }
    if (this.newsfeedArr) {
      this.newsFeedSubs.unsubscribe();
    }
    if (this.exhibitionArr) {
      this.exhibitionSubs.unsubscribe();
    }
    if (this.bestsellingProductsArr) {
      this.bestSellingProuctsSubs.unsubscribe();
    }
    if (this.avenueArr) {
      this.avenueSubs.unsubscribe();
    }
    if (this.brandsArr) {
      this.brandsSubs.unsubscribe();
    }
    if (this.serviceSectorArr) {
      this.serviceSectorSubs.unsubscribe();
    }
    if (this.customerFeedbackArr) {
      this.customerFeedbackSubs.unsubscribe();
    }
    if (this.worldManufacturingArr) {
      this.worldManuSubs.unsubscribe();
    }
    if (this.servicingIndiaArr) {
      this.servicingIndSubs.unsubscribe();
    }
    if (this.bestsellingCategoriesArr) {
      this.bestSellingCatSubs.unsubscribe();
    }
    if (this.worldMapArr) {
      this.worldMapSubs.unsubscribe();
    }
    if (this.indiaMapArr) {
      this.indiaMapSubs.unsubscribe();
    }
  }

  // function to set subscribe email form field
  setSubscribeEmailFormField() {
    this.subscribeEmailForm = this.fb.group({
      // tslint:disable-next-line: max-line-length
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    });
  }
  // function to get form controls
  get f() { return this.subscribeEmailForm.controls; }

  // function to submit subscribe email form
  submit() {
    this.submitted = true;
    if (!this.subscribeEmailForm.valid) {
      return;
    }
    let payload = {
      email: this.subscribeEmailForm.controls.email.value
    };
    this.onboardingService.subscribeEmail(payload).subscribe(response => {
      if (response.code === 200) {
        // this.sendEvent('Footer_subscribe', '');
        this.userService.success(response.message);
        $('#onboarding').modal('hide');
      } else {
        this.userService.error(response.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to navigate to registration page
  navigateToRegistration() {
    // alert('hi');
    this.router.navigate(['/user/registration']);
  }

  // function to get banner for owl slider
  getBanner() {
    this.bannerListSubs = this.onboardingService.getBanner().subscribe(response => {
      if (response.code === 200) {
        this.imageSliderArr = response.result;
      } else {
        this.userService.error(response.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get onboarding popup
  getOnboardingPopup() {
    const checkModel = sessionStorage.getItem('onboadingModelRendered');
    if (!this.userinfo && !checkModel) {
      this.onBoardingSubs = this.onboardingService.getOnboardingPopup().subscribe(response => {
        if (response.code === 200) {
          $('#onboarding').modal('show');
          $(document).ready(function(){
            $('#myCarousel').carousel({
            pause: true,
             animateOut: 'fadeOut',
             autoplay: true,
            interval: 5000,
            autoplayTimeout:5000
            });
            });
          this.onboardingPopupArr = response.result;
          sessionStorage.setItem('onboadingModelRendered', '1');
        } else {
          this.userService.error(response.message);
        }
      }, error => {
        this.userService.error(error);
      });
    }
  }

  // function to get news feed
  getNewsFeed() {
    this.newsFeedSubs = this.onboardingService.getNewsFeed().subscribe(res => {
      if (res && res.code === 200) {
        this.newsfeedArr = res.result;
        // res.result.forEach(element => {
        //   this.newsfeedArr.push(element);
        // });
        this.newsfeedArr.forEach(element => {
          if (element.description.length < 175) {
            element.visible = true;
            element.showBtn = false;
          } else {
            element.visible = false;
            element.showBtn = true;
          }
        });
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get exhibition
  getExhibition() {
    this.exhibitionSubs = this.onboardingService.exhibition().subscribe(res => {
      if (res && res.code === 200) {
        this.exhibitionArr = res.result;
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get bestselling products
  getBestsellingProducts() {
    this.bestSellingProuctsSubs = this.onboardingService.bestselling().subscribe(res => {
      if (res && res.code === 200) {
        this.bestsellingProductsArr = [];
        // this.bestsellingProductsArr = res.result;
        res.result.forEach((element, i) => {
          if ( (i + 1) % 2 === 0 ) {
            this.bestsellingProductsArr.push([res.result[i - 1], element]);
          } else if ( !( (i + 1) % 2) && ((res.result.length - 1) === i) ) {
            this.bestsellingProductsArr.push([element]);
          }
        });
        // if (this.bestsellingProductsArr && this.bestsellingProductsArr.length) {
        //   this.divideBest = Math.ceil(this.bestsellingProductsArr.length / 2);
        // }
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get avenue
  getAenue() {
    this.avenueSubs = this.onboardingService.avenue().subscribe(res => {
      if (res && res.code === 200) {
        this.avenueArr = res.result;
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    }, () => { this.initAvenue(); });
  }

  initAvenue() {
    function initCarousel(options) {
      function CustomCarousel(options): void {
        this.init(options);
        this.addListeners();
        return this;
      }
      CustomCarousel.prototype.init = function (options) {
        this.node = options.node;
        this.node.slider = this;
        this.slides = this.node.querySelector('.slides').children;
        this.slidesN = this.slides.length;
        this.pagination = this.node.querySelector('.pagination');
        this.pagTransf = 'translate( -50%, -50% )';
        this.dots = this.pagination.children;
        this.dotsN = this.dots.length;
        this.step = -360 / this.dotsN;
        this.angle = 0;
        this.next = this.node.querySelector('.next');
        this.prev = this.node.querySelector('.prev');
        this.activeN = options.activeN || 0;
        this.prevN = this.activeN;
        this.speed = options.speed || 300;
        this.autoplay = options.autoplay || false;
        this.autoplayId = null;

        this.setSlide(this.activeN);
        this.arrangeDots();
        this.pagination.style.transitionDuration = this.speed + 'ms';
        if (this.autoplay) this.startAutoplay();
      }
      CustomCarousel.prototype.addListeners = function () {
        var slider = this;

        if (this.next) {
          this.next.addEventListener('click', function () {
            slider.setSlide(slider.activeN + 1);
          });
        }

        if (this.prev) {
          this.prev.addEventListener('click', function () {
            slider.setSlide(slider.activeN - 1);
          });
        }

        for (var i = 0; i < this.dots.length; i++) {
          this.dots[i].addEventListener('click', function (i) {
            return function () { slider.setSlide(i); }
          }(i));
        }

        if (this.autoplay) {
          this.node.addEventListener('mouseenter', function () {
            slider.stopAutoplay();
          });

          this.node.addEventListener('mouseleave', function () {
            slider.startAutoplay();
          });
        }
      };

      CustomCarousel.prototype.setSlide = function (slideN) {
        this.slides[this.activeN].classList.remove('active');
        if (this.dots[this.activeN]) this.dots[this.activeN].classList.remove('active');

        this.prevN = this.activeN;
        this.activeN = slideN;
        if (this.activeN < 0) this.activeN = this.slidesN - 1;
        else if (this.activeN >= this.slidesN) this.activeN = 0;

        this.slides[this.activeN].classList.toggle('active');
        if (this.dots[this.activeN]) this.dots[this.activeN].classList.toggle('active');

        this.rotate();
      };

      CustomCarousel.prototype.rotate = function () {
        if (this.activeN < this.dotsN) {
          this.angle += function (dots, next, prev, step) {
            var inc, half = dots / 2;
            if (prev > dots) prev = dots - 1;
            if (Math.abs(inc = next - prev) <= half) return step * inc;
            if (Math.abs(inc = next - prev + dots) <= half) return step * inc;
            if (Math.abs(inc = next - prev - dots) <= half) return step * inc;
          }(this.dotsN, this.activeN, this.prevN, this.step)

          this.pagination.style.transform = this.pagTransf + 'rotate(' + this.angle + 'deg)';
        }
      };

      CustomCarousel.prototype.startAutoplay = function () {
        var slider = this;

        this.autoplayId = setInterval(function () {
          slider.setSlide(slider.activeN + 1);
        }, this.autoplay);
      };

      CustomCarousel.prototype.stopAutoplay = function () {
        clearInterval(this.autoplayId);
      };

      CustomCarousel.prototype.arrangeDots = function () {
        for (var i = 0; i < this.dotsN; i++) {
          this.dots[i].style.transform = 'rotate(' + 360 / this.dotsN * i + 'deg)';
        }
      };

      return new CustomCarousel(options);
    }
    var plugins = {
      customCarousel: document.querySelectorAll('.circle-carousel')
    }

    // document.addEventListener('DOMContentLoaded', function () {
    //   if (plugins.customCarousel.length) {
    //     for (var i = 0; i < plugins.customCarousel.length; i++) {
    //       var carousel = initCarousel({
    //         node: plugins.customCarousel[i],
    //         speed: plugins.customCarousel[i].getAttribute('data-speed'),
    //         autoplay: plugins.customCarousel[i].getAttribute('data-autoplay')
    //       });
    //     }
    //   }
    // });
    setTimeout(() => {
      if (plugins.customCarousel.length) {
        for (var i = 0; i < plugins.customCarousel.length; i++) {
          var carousel = initCarousel({
            node: plugins.customCarousel[i],
            speed: plugins.customCarousel[i].getAttribute('data-speed'),
            autoplay: plugins.customCarousel[i].getAttribute('data-autoplay')
          });
        }
      }
      // function isCounterElementVisible($element) {
      //   var topView = $(window).scrollTop();
      //   var botView = topView + $(window).height();
      //   var topElement = $element.offset().top;
      //   var botElement = topElement + $element.height();
      //   return ((botElement <= botView) && (topElement >= topView));
      // }

      // $(window).scroll(function () {
      //   $(".counter").each(function () {
      //     var isOnView = isCounterElementVisible($(this));
      //     if (isOnView && !$(this).hasClass('visibled')) {
      //       $(this).addClass('visibled');
      //       $(this).prop('Counter', 0).animate({
      //         Counter: $(this).text()
      //       }, {
      //         duration: 3000,
      //         easing: 'swing',
      //         step: function (now) {
      //           $(this).text(Math.ceil(now));
      //         }
      //       });
      //     }
      //   });
      // });
    }, 4000);
  }

  // function to get brands
  getBrands() {
    this.brandsSubs = this.onboardingService.brands().subscribe(res => {
      if (res && res.code === 200) {
        this.brandsArr = res.result;
        // res.result.forEach((element, i) => {
        //   if ( (i + 1) % 2 === 0 ) {
        //     this.brandsArr.push([res.result[i - 1], element]);
        //   } else if ( !( (i + 1) % 2) && ((res.result.length - 1) === i) ) {
        //     this.brandsArr.push([element]);
        //   }
        // });
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get service sector
  getServiceSector() {
    this.serviceSectorSubs = this.onboardingService.serviceSector().subscribe(res => {
      if (res && res.code === 200) {
        this.serviceSectorArr = res.result;
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get customer feedback
  getCustomerFeedback() {
    this.customerFeedbackSubs = this.onboardingService.customerFeedback().subscribe(res => {
      if (res && res.code === 200) {
        this.customerFeedbackArr = res.result;
        // res.result.forEach(element => {
        //   this.customerFeedbackArr.push(element);
        // });
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get customer feedback
  getWorldManufacturing() {
    this.worldManuSubs = this.onboardingService.manufacturingWorld().subscribe(res => {
      if (res && res.code === 200) {
        this.worldManufacturingArr = res.result;
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get servicing india
  getServicingIndia() {
    this.servicingIndSubs = this.onboardingService.servicingIndia().subscribe(res => {
      if (res && res.code === 200) {
        this.servicingIndiaArr = res.result;
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get bestselling categories
  getBestSellingCategories() {
    this.bestSellingCatSubs = this.onboardingService.bestsellingCategories().subscribe(res => {
      if (res && res.code === 200) {
        this.bestsellingCategoriesArr = [];
        res.result.forEach((element, i) => {
          if ( (i + 1) % 2 === 0 ) {
            this.bestsellingCategoriesArr.push([res.result[i - 1], element]);
          } else if ( !( (i + 1) % 2) && ((res.result.length - 1) === i) ) {
            this.bestsellingCategoriesArr.push([element]);
          }
        });
        if (res.result.length && res.result.length < 7) {
          // debugger
          // const newBestCat: OwlOptions = Object.assign({}, this.bestCategories);
          this.bestCategories.autoplay = false;
          this.bestCategories.nav = false;
          this.bestCategories.navText = ['',''];
        }
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get world map
  getWorldMap() {
    this.worldManuSubs = this.onboardingService.worldMap().subscribe(res => {
      if (res && res.code === 200) {
        this.worldMapArr = res.result;
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to get india map
  getIndiaMap() {
    this.indiaMapSubs = this.onboardingService.indiaMap().subscribe(res => {
      if (res && res.code === 200) {
        this.indiaMapArr = res.result;
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to scroll to target id
  scrollFunction() {
    // var scroll = $(window).scrollTop();
    setTimeout(() => {
      $('html, body').animate({
        scrollTop: $('#' + this.scroll).offset().top + this.scrollTime
    }, 1000);
    }, 2500);
    // $('#' + this.scroll).animate({ scrollTop: $('#' + this.scroll).prop('scrollHeight')}, 1000);
  }

  srcollForHomepage() {
    $('html, body').animate({
      scrollTop: $('#' + this.scroll).offset().top + -100
  }, 1000);
  }

  // function to set exhibition form field
  setExhibitionFormField(data?) {
    this.exhibitionRegisterForm = this.fb.group({
      name: [data ? data.firstName + ' ' + data.lastName : '', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
      // tslint:disable-next-line: max-line-length
      email: [data ? data.email : '', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      mobile: [data ? data.mobile : '', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]]
    });
  }

  openRegisterForm() {
    $('#register_form').modal('show');
  }

  get ex() { return this.exhibitionRegisterForm.controls; }

  submitExhibitionForm() {
    this.submitted2 = true;
    if (!this.exhibitionRegisterForm.valid) {
      return;
    }
    const payload = {
      name: this.ex.name.value,
      email: this.ex.email.value,
      mobile: this.ex.mobile.value,
      exhibitionId: this.exhibitionId
    };
    this.onboardingService.registerExhibition(payload).subscribe(res => {
      if (res && res.code === 200) {
        try {
          this.sendEvent('Exhibition_register_Success', this.exhibitionArr[0].title);
        } catch (error) {
          console.log('error in sending google analytics event', error);
        }
        this.userService.success(res.message);
        $('#register_form').modal('hide');
        this.submitted2 = false;
        if (this.userinfo) {
          this.setExhibitionFormField(this.userinfo);
        } else {
          this.setExhibitionFormField();
        }
      } else {
        this.userService.error(res.message);
      }
    }, error => {
      this.userService.error(error);
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

  openNews(url) {
    window.open(url, '_blank');
  }

  openBottom() {
    // console.log('scolled');
    if (!this.show) {
      this.show = true;
      this.getNewsFeed();
      this.getExhibition();
      this.getBestsellingProducts();
      this.getAenue();
      this.getBrands();
      this.getServiceSector();
      this.getCustomerFeedback();
      this.getWorldManufacturing();
      this.getServicingIndia();
      this.getBestSellingCategories();
    }
  }

  sendEvent(type: string, label: string) {
    this.googleAnalyticsService.eventEmitter(type, label);
  }

  handleAvenueNavigation() {
    const val = document.querySelector('.circle-carousel')['slider']['activeN'];
    if (val) {
      const newVal = val + 1;
      this.googleAnalyticsService.eventEmitter('Success_Story', newVal);
    }
  }

}
