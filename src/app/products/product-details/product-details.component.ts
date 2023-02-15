import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { LocationStrategy } from '@angular/common';
import { SharedService } from '../../_services/shared.service';
import { GoogleAnalyticsService } from '../../google-analytics.service';

declare let $: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  productID;
  productDetailObj;
  isUserLoggedIn = false;
  productQtyInputForm: FormGroup;
  submitted = false;
  defaultImage = 'assets/images/placeholder.png';
  @ViewChild('xOriginal') original;
  @ViewChild('xPreview') preview;
  selectedImage;
  customOptions: OwlOptions = {
    autoplay: true,
    loop: true,
    dots: false,
    margin: 10,
    autoHeight: true,
       navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
    nav: true
  };
  showMore = false;
  formatDescription;

  constructor(private productService: ProductService, private route: ActivatedRoute, private mainService: UserService,
    private fb: FormBuilder, private router: Router, private _platformStrategy: LocationStrategy, private sharedService: SharedService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Product Detail');
    this.googleAnalyticsService.pageView('Product Detail');
    document.body.scrollTo(0, 0);
    if (this.mainService.getToken()) {
      this.isUserLoggedIn = true;
    } else {
      this.isUserLoggedIn = false;
    }
    this.route.queryParams.subscribe(params => {
      this.productID = params.productId;
      this.getProductDetail(this.productID);
      this.setQtyForm();
      const prodId = this.mainService.getProductId();
      if (prodId) {
        localStorage.removeItem('redirectToProductX');
      }
    });
  }

  ngAfterViewInit() {
    // setTimeout(() => {


    // }, 1500);
    // $('.product_slider').owlCarousel({
    //   autoPlay: 3000,
    //   loop: true,
    //   margin: 10,
    //   nav: false,
    //   dots: true,
    //   responsive: {
    //     0: {
    //       items: 1
    //     },
    //     600: {
    //       items: 2
    //     },
    //     1000: {
    //       items: 1
    //     }
    //   }
    // })
  }

  getProductDetail(id) {
    const payload = {
      productid: id
    };
    this.mainService.showSpinner();
    this.productService.getProductDetail(payload, this.isUserLoggedIn).subscribe(response => {
      if (response.code === 200) {
        this.productDetailObj = response.result;
        if (this.productDetailObj.description) {
          this.formatDescription = this.productDetailObj.description.length > 300 ? this.productDetailObj.description.slice(0,300) + '...' : this.productDetailObj.description;
        } else {
          this.formatDescription = '';
        }
        this.mainService.hideSpinner();
        // this.googleAnalytics.eventEmitter('Product View', 'Products', 'Product Detail', 'Click', this.productDetailObj.amount);
      } else if (response.code === 400) {
        // this.router.navigate.back()
        this.mainService.hideSpinner();
        this._platformStrategy.back();
      }
      else {
        this.mainService.error(response.message);
        this.mainService.hideSpinner();
      }
    }, error => {
      this.mainService.error(error);
      this.mainService.hideSpinner();
    }, () => this.setZoomLogic());
  }

  setZoomLogic() {
    setTimeout(() => {
      // duration of scroll animation
    var scrollDuration = 300;
    // paddles
    var leftPaddle = document.getElementsByClassName('left-paddle');
    var rightPaddle = document.getElementsByClassName('right-paddle');
    // get items dimensions
    var itemsLength = $('.item').length;
    var itemSize = $('.item').outerHeight(true);
    // get some relevant size for the paddle triggering point
    var paddleMargin = 10;

    // get wrapper width
    var getMenuWrapperSize = function () {
      return $('.menu-wrapper').outerHeight();
    }
    var menuWrapperSize = getMenuWrapperSize();
    // the wrapper is responsive
    $(window).on('resize', function () {
      menuWrapperSize = getMenuWrapperSize();

    });
    // size of the visible part of the menu is equal as the wrapper size
    var menuVisibleSize = menuWrapperSize;
    // get total width of all menu items
    var getMenuSize = function () {
      return itemsLength * itemSize;
    };
    var menuSize = getMenuSize();
    // get how much of menu is invisible
    var menuInvisibleSize = menuSize - menuWrapperSize;
    // get how much have we scrolled to the left
    var getMenuPosition = function () {
      return $('.menu').scrollTop();
    };

    // finally, what happens when we are actually scrolling the menu
    $('.menu').on('scroll', function () {
      // get how much of menu is invisible
      menuInvisibleSize = menuSize - menuWrapperSize;

      // get how much have we scrolled so far
      var menuPosition = getMenuPosition();

      var menuEndOffset = menuInvisibleSize - paddleMargin;

      // show & hide the paddles
      // depending on scroll position

      if (menuPosition <= paddleMargin) {
        $(leftPaddle).addClass('hidden');
        $(rightPaddle).removeClass('hidden');
      } else if (menuPosition < menuEndOffset) {
        // show both paddles in the middle
        $(leftPaddle).removeClass('hidden');
        $(rightPaddle).addClass('hidden');
      } else if (menuPosition >= menuEndOffset) {
        $(leftPaddle).removeClass('hidden');
        $(rightPaddle).addClass('hidden');
      }
    });

    // scroll to right
    $(leftPaddle).on('click', function () {
      $('.menu').animate({ scrollTop: '0', behavior: 'smooth' }, scrollDuration);
    });

    // scroll to left
    $(rightPaddle).on('click', function () {
      $('.menu').animate({ scrollTop: menuInvisibleSize, behavior: 'smooth' }, scrollDuration);
    });

    (function ($) {
      $(document).ready(function () {
        $('.xzoom, .xzoom-gallery').xzoom({ zoomWidth: 500, title: true, tint: '#333', Xoffset: 15 });
        $('.xzoom2, .xzoom-gallery2').xzoom({ position: '#xzoom2-id', tint: '#ffa200' });
        $('.xzoom3, .xzoom-gallery3').xzoom({ position: 'lens', lensShape: 'circle', sourceClass: 'xzoom-hidden' });
        $('.xzoom4, .xzoom-gallery4').xzoom({ tint: '#006699', Xoffset: 15 });
        $('.xzoom5, .xzoom-gallery5').xzoom({ tint: '#006699', Xoffset: 15 });

        //Integration with hammer.js
        var isTouchSupported = 'ontouchstart' in window;

        if (isTouchSupported) {
          //If touch device
          $('.xzoom, .xzoom2, .xzoom3, .xzoom4, .xzoom5').each(function () {
            var xzoom = $(this).data('xzoom');
            xzoom.eventunbind();
          });

          $('.xzoom, .xzoom2, .xzoom3').each(function () {
            var xzoom = $(this).data('xzoom');
            $(this).hammer().on("tap", function (event) {
              event.pageX = event.gesture.center.pageX;
              event.pageY = event.gesture.center.pageY;
              var s = 1, ls;

              xzoom.eventmove = function (element) {
                element.hammer().on('drag', function (event) {
                  event.pageX = event.gesture.center.pageX;
                  event.pageY = event.gesture.center.pageY;
                  xzoom.movezoom(event);
                  event.gesture.preventDefault();
                });
              }

              xzoom.eventleave = function (element) {
                element.hammer().on('tap', function (event) {
                  xzoom.closezoom();
                });
              }
              xzoom.openzoom(event);
            });
          });

          $('.xzoom4').each(function () {
            var xzoom = $(this).data('xzoom');
            $(this).hammer().on("tap", function (event) {
              event.pageX = event.gesture.center.pageX;
              event.pageY = event.gesture.center.pageY;
              var s = 1, ls;

              xzoom.eventmove = function (element) {
                element.hammer().on('drag', function (event) {
                  event.pageX = event.gesture.center.pageX;
                  event.pageY = event.gesture.center.pageY;
                  xzoom.movezoom(event);
                  event.gesture.preventDefault();
                });
              }

              var counter = 0;
              xzoom.eventclick = function (element) {
                element.hammer().on('tap', function () {
                  counter++;
                  if (counter == 1) setTimeout(openfancy, 300);
                  event.gesture.preventDefault();
                });
              }

              function openfancy() {
                if (counter == 2) {
                  xzoom.closezoom();
                  $.fancybox.open(xzoom.gallery().cgallery);
                } else {
                  xzoom.closezoom();
                }
                counter = 0;
              }
              xzoom.openzoom(event);
            });
          });

          $('.xzoom5').each(function () {
            var xzoom = $(this).data('xzoom');
            $(this).hammer().on("tap", function (event) {
              event.pageX = event.gesture.center.pageX;
              event.pageY = event.gesture.center.pageY;
              var s = 1, ls;

              xzoom.eventmove = function (element) {
                element.hammer().on('drag', function (event) {
                  event.pageX = event.gesture.center.pageX;
                  event.pageY = event.gesture.center.pageY;
                  xzoom.movezoom(event);
                  event.gesture.preventDefault();
                });
              }

              var counter = 0;
              xzoom.eventclick = function (element) {
                element.hammer().on('tap', function () {
                  counter++;
                  if (counter == 1) setTimeout(openmagnific, 300);
                  event.gesture.preventDefault();
                });
              }

              function openmagnific() {
                if (counter == 2) {
                  xzoom.closezoom();
                  var gallery = xzoom.gallery().cgallery;
                  var i, images = new Array();
                  for (i in gallery) {
                    images[i] = { src: gallery[i] };
                  }
                  $.magnificPopup.open({ items: images, type: 'image', gallery: { enabled: true } });
                } else {
                  xzoom.closezoom();
                }
                counter = 0;
              }
              xzoom.openzoom(event);
            });
          });

        } else {
          //If not touch device
          //Integration with fancybox plugin
          $('#xzoom-fancy').bind('click', function (event) {
            var xzoom = $(this).data('xzoom');
            xzoom.closezoom();
            $.fancybox.open(xzoom.gallery().cgallery, { padding: 0, helpers: { overlay: { locked: false } } });
            event.preventDefault();
          });

          //Integration with magnific popup plugin
          $('#xzoom-magnific').bind('click', function (event) {
            var xzoom = $(this).data('xzoom');
            xzoom.closezoom();
            var gallery = xzoom.gallery().cgallery;
            var i, images = new Array();
            for (i in gallery) {
              images[i] = { src: gallery[i] };
            }
            $.magnificPopup.open({ items: images, type: 'image', gallery: { enabled: true } });
            event.preventDefault();
          });
        }
      });
    })($);

      this.original.nativeElement.attributes.xoriginal.value = this.productDetailObj.images[0].image;
    this.preview.nativeElement.attributes.xpreview.value = this.productDetailObj.images[0].image;
    this.selectedImage = this.productDetailObj.images[0].id;
    }, 500);
  }

  // function to set qty form
  setQtyForm() {
    this.productQtyInputForm = this.fb.group({
      qty: ['', [Validators.required, Validators.pattern(/[1-9]\d*/)]]
    });
  }

  // function to get form controls
  get f() { return this.productQtyInputForm.controls; }

  // function to accept number only
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // function on submit and click on add to cart
  submit(data) {
    this.submitted = true;
    if (!this.productQtyInputForm.valid) {
      return;
    }
    if (this.productDetailObj.is_verified === '0') {
      $('#emailNotVerified').modal('toggle');
      return;
    }
    if (!this.isUserLoggedIn) {
      $('#noLoggedIn').modal('toggle');
      return;
    }
    if (this.productDetailObj.doableQty && this.f.qty.value < this.productDetailObj.doableQty && this.productDetailObj.plive) {
      $('#doableQty').modal('toggle');
      return;
    }
    const payload = {
      productId: this.productDetailObj.id,
      qty: this.f.qty.value
    };
    if (data === 'buy') {
      if (this.f.qty.value <= this.productDetailObj.inventoryQty) {
        this.productService.addToCart(payload).subscribe(response => {
          if (response.code === 200) {
            this.router.navigate(['./cart'], { queryParams: { order: data, id: this.productDetailObj.id } });
          } else {
            this.mainService.error(response.message);
          }
        });
      } else {
        $('#exampleModal').modal('toggle');
      }
    } else if (data === 'cart') {
      if (!this.productDetailObj.plive) {
        this.productService.addToCart(payload).subscribe(response => {
          if (response.code === 200) {
            // this.router.navigate(['./cart'], { queryParams: { order: data, id: this.productDetailObj.id } });
            this.sharedService.getCartItems();
            this.productDetailObj.Cart = 1;
            this.mainService.success(response.message);
          } else {
            this.mainService.error(response.message);
          }
        });
        return;
      }
      if (this.f.qty.value <= this.productDetailObj.inventoryQty) {
        this.productService.addToCart(payload).subscribe(response => {
          if (response.code === 200) {
            // this.router.navigate(['./cart'], { queryParams: { order: data, id: this.productDetailObj.id } });
            this.sharedService.getCartItems();
            this.productDetailObj.Cart = 1;
            this.mainService.success(response.message);
          } else {
            this.mainService.error(response.message);
          }
        });
      } else {
        $('#exampleModal').modal('toggle');
      }
    }
    // else if (data === 'enquire') {
    //   if (this.f.qty.value <= this.productDetailObj.inventoryQty) {
    //     this.productService.addToCart(payload).subscribe(response => {
    //       if (response.code === 200) {
    //         this.router.navigate(['./cart'], { queryParams: { order: data } });
    //       } else {
    //         this.mainService.error(response.message);
    //       }
    //     });
    //   } else {
    //     $('#exampleModal').modal('toggle');
    //   }
    // }
    else {
      this.productService.addToCart(payload).subscribe(response => {
        if (response.code === 200) {
          this.router.navigate(['./cart'], { queryParams: { order: 'enquire', id: this.productDetailObj.id } });
        } else {
          this.mainService.error(response.error);
        }
      }, error => {
        this.mainService.error(error);
      });
    }
  }

  // function on modal dissmiss
  gotoCart() {
    const payload = {
      productId: this.productDetailObj.id,
      qty: this.f.qty.value
    };
    this.productService.addToCart(payload).subscribe(response => {
      if (response.code === 200) {
        $('#exampleModal').modal('toggle');
        this.router.navigate(['./cart'], { queryParams: { order: 'cart', id: this.productDetailObj.id } });
      } else {
        this.mainService.error(response.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function to go to login
  gotoLogin() {
    $('#noLoggedIn').modal('toggle');
    localStorage.setItem('redirectToProductX', this.productDetailObj.id);
    this.router.navigate(['../user/login']);
  }

  // function to select image on hover
  selectImageHover(img) {
    this.selectedImage = img.id;
    this.original.nativeElement.attributes.xoriginal.value = img.image;
    this.original.nativeElement.attributes.src.value = img.image;
    this.preview.nativeElement.attributes.xpreview.value = img.image;
  }

  readMoreLogic() {
    if (this.showMore) {
      this.sendEvent('Product_Read_More', '');
      this.formatDescription = this.productDetailObj.description ? this.productDetailObj.description : '';
    } else {
      if (this.productDetailObj.description) {
        this.sendEvent('Product_Read_Less', '');
        this.formatDescription = this.productDetailObj.description.slice(0, 300) + '...';
      }
    }
  }

  sendEvent(type: string, label: string) {
    this.googleAnalyticsService.eventEmitter(type, label);
  }

}
