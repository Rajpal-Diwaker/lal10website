import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { app_strings } from '../../_constants/app_strings';
// import * as $ from 'jquery'
import { UserService } from '../../_services/user.service';
import { SharedService } from '../../_services/shared.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';
// import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
declare let $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  userinfo;
  userName: any;
  headerCategoryArr;
  options = [];
  searchName;
  searchTerm = new FormControl('');
  previouslySearchedTerm;
  totalItem;
  // hoveredSubCat = 0;
  // @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
  // ng-autocomplete properties
  keyword = 'name';
  @ViewChild('auto') auto;
  faSearch = { keyCode: 13 };
  regex = new RegExp('^[^-\s][a-zA-Z0-9_\s-]+$');
  catImage;
  constructor(private router: Router, private userService: UserService,
              private sharedService: SharedService, private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.userinfo = this.userService.getToken();
    if (this.userinfo) {
      this.userinfo = JSON.parse(localStorage.getItem('user_data'));
      this.sharedService.getCartItems();
      this.sharedService.getCount().subscribe(count => {
        this.totalItem = count;
      });
    }




    $(".menu-item-has-children.dropdown").each(function () {
      $(this).on('click', function () {
        var $temp_text = $(this).children('.dropdown-toggle').html();
        $(this).children('.sub-menu').prepend('<li class="subtitle">' + $temp_text + '</li>');
      });
    });

    // Load Resize
    $(window).on("load resize", function (event) {
      var windowWidth = $(window).width();
      if (windowWidth < 768) {
        $('body').addClass('small-device');
      } else {
        $('body').removeClass('small-device');
      }
    });
    this.getCategory();



  }

  ngAfterViewInit() {
    // this.searchDropDown();
    setTimeout(() => {
      this.onMouseHover();
      $('.input-container input').attr("placeholder", "Search for products here");
      // this.onSubCategoryHover();
      $(document).on("click", ".mega-dropdown", function (e) {
        e.stopPropagation();
      });

      $('.selectpicker').selectpicker;

      $('.search-trigger').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $('.search-trigger').parent('.header-left').addClass('open');
      });

      $('.search-close').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $('.search-trigger').parent('.header-left').removeClass('open');
      });

      // Menu Trigger
      $('#menuToggle').on('click', function (event) {
        var windowWidth = $(window).width();
        if (windowWidth < 768) {
          $('body').removeClass('open');
          if (windowWidth < 768) {
            $('#left-panel').slideToggle();
          } else {
            $('#left-panel').toggleClass('open-menu');
          }
        } else {
          $('body').toggleClass('open');
          $('#left-panel').removeClass('open-menu');
        }
      });
      $(".custom_drop").hover(
        function () {
          $(this).addClass("open");
        },
        function () {
          $(this).removeClass("open");
        }
      );
      $(document).on('click','.overlay ul li a',function(){
        $('html').removeClass('sidePanel');
        })
    }, 2000);

  }

  logout() {
    this.userService.confirmPopup('You want to logout !').then(el => {
      if (el.value) {
        // this.userService.clearLocal();
        this.googleAnalyticsService.eventEmitter('Sign_Out');
        localStorage.removeItem('X-ID');
        localStorage.removeItem('user_data');
        localStorage.removeItem('isEmailVerified');
        this.sharedService.setLocalSotrageUserInfo();
        // this.router.navigate(['user/login']);
        // this.ngOnInit();
        location.reload();
      }
    })
  }

  goto() {
    this.router.navigateByUrl(app_strings.HOME_ROUTE)
  }

  // function to get main header categories
  getCategory() {
    this.userService.mainCategory().subscribe(response => {
      if (response.code === 200) {
        this.headerCategoryArr = response.result;
        localStorage.setItem('mainCat', JSON.stringify(this.headerCategoryArr));
      } else if (response.code === 401) {
        this.userService.error(response.message);
        this.userService.clearLocal();
        this.router.navigate(['/']);
      } else {
        this.userService.error(response.message);
      }
    }, error => {
      this.userService.error(error);
    });
  }

  // function to mouse hover
  onMouseHover() {
    // $('.header_wrap .mega-dropdown').addClass('open');
    $(".header_wrap .mega-dropdown").hover(
      function () {
        $(this).addClass("open");
        $('.subCatDropdown' + 0).addClass('is-active');
        $('.subSubCatDropdown' + 0).addClass('is-active');
        $('.subcatImg').hide();
        $('.headerImg').show();
      },
      function () {
        $(this).removeClass("open");
        $('.subCatDropdown' + window['hoveredSubCat']).removeClass('is-active');
        $('.subSubCatDropdown' + window['hoveredSubCat']).removeClass('is-active');
      }
    );
  }

  // function on subcategory hover
  onSubCategoryHover() {
    $('.subCatDropdown').hover(
      function () {
        $(this).addClass("is-active");
      },
      function () {
        $(this).removeClass("is-active");
      }
    );
  }

  // function on sub sub category hover
  onSubSubCatHover(i) {
    $('.subSubCatDropdown' + i).hover(
      function () {
        $(this).addClass("is-active");
      },
      function () {
        $(this).removeClass("is-active");
      }
    );
  }

  // function on subcategory hover
  onSubCategoryHover1(i, l) {
    $('.headerImg').hide();
    $('.subcatImg').show();
    $('.subCatDropdown' + i).addClass('is-active');
    $('.subSubCatDropdown' + i).addClass('is-active');
    for (let c = 1; c <= l; c++) {
      if (c === i + 1) {
        window['hoveredSubCat'] = i;
        continue;
      }
      $('.subCatDropdown' + (c - 1)).removeClass('is-active');
      $('.subSubCatDropdown' + (c - 1)).removeClass('is-active');
    }
  }

  // function on subcategory leave
  onSubCategoryLeave1(i) {
    $('.subCatDropdown' + i).removeClass('is-active');
    $('.subSubCatDropdown' + i).removeClass('is-active');
  }

  // function to submit search term
  searchProduct(event) {
    if (!this.searchName && event.keyCode === 13) {
      this.options = [];
      this.router.navigate(['/']);
      return;
    }
    if (event.keyCode === 13) {
      this.auto.close();
      this.router.navigate(['/search'], { queryParams: { key: this.searchName } });
    }
  }

  // function to open searched product detail
  openSearchedProductDetail(id) {
    this.router.navigate(['/products/detail'], { queryParams: { productId: id } });
  }

  // function to remove top header label
  removeLabel() {
    $('#remove_label').hide();
    $('.middle_contant_wrap').addClass('add_height');
  }

  // clear search term and search name
  clearSearchTerm(type?: string, name?: string) {
    if (type) {
      this.googleAnalyticsService.eventEmitter(type, name);
    }
    this.searchName = '';
    this.auto.clear();
    this.options = [];
    if (window.innerWidth < 768) {
      $('#toggleNav').trigger('click');
    }
    // this.auto.close();
  }

  // ng-autocomplete starts

  selectEvent(item) {
    // do something with selected item
    this.router.navigate(['/products/detail'], { queryParams: { productId: item.id } });
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    const test = val.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    if (!test) {
      this.searchName = '';
      this.options = [];
      return;
    }
    this.searchName = test;
    this.googleAnalyticsService.eventEmitter('Search', this.searchName);
    let payload = {
      term: test
    };
    this.userService.searchProduct(payload).subscribe(response => {
      if (response.code === 200) {
        this.options = [];
        this.options = response.result.Liveproduct.concat(response.result.Nonliveproduct);
      } else {
        this.userService.error(response.message);
      }
    });
  }

  // ng-autocomplete end

  checkLogin(data) {
    this.googleAnalyticsService.eventEmitter('Send_an_Enquiry');
    if (this.userinfo) {
      this.router.navigate([data]);
    } else {
      $('#noLoggedIn2').modal('show');
    }
  }

  openCart() {
    this.googleAnalyticsService.eventEmitter('Cart_Page');
    const r = Math.random().toString(36).substring(7);
    this.router.navigate(['/cart'], { queryParams:  { scroll: 'data', data: r }});
  }

  removeSidePanel(type?: string, name?: string) {
    if (type) {
      this.googleAnalyticsService.eventEmitter(type, name);
    }
    $('html').removeClass('sidePanel');
    $('#nav-icon1').removeClass('open');
  }

  subscribeNow() {
    if (this.userinfo) {
      let payload = {
        email: this.userinfo.email
      };
      this.userService.subscribeEmail(payload).subscribe(response => {
        if (response.code === 200) {
          // this.f.email.setValue('');
          this.userService.success(response.message);
          this.removeLabel()
        } else {
          this.userService.error(response.message);
          this.removeLabel();
        }
      }, error => {
        this.userService.error(error);
      });
    } else {
      this.scrollGoTo('subscribeNow');
    }
  }

  scrollGoTo(data) {

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

  navigateto(type: string, path: string) {
    this.googleAnalyticsService.eventEmitter(type);
    this.router.navigateByUrl(path);
  }

}
