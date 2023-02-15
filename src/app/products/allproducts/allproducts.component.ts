import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { UserService } from '../../_services/user.service';
import { Options } from 'ng5-slider';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

declare let $: any;

@Component({
  selector: 'app-allproducts',
  templateUrl: './allproducts.component.html',
  styleUrls: ['./allproducts.component.css']
})
export class AllproductsComponent implements OnInit, AfterViewChecked {
  categoryId;
  subCategoryId;
  priceFilter = [0, 100000];
  liveProductArr = [];
  nonLiveProductArr = [];
  banner;
  defaultBanner = 'assets/images/Placeholder.PNG';
  defaultImage = 'assets/images/placeholder.png';
  subCategoryArr;
  subcategoryIdFilter = [];
  craftFilter = [];
  materialFilter = [];
  craftListArr;
  sortedCraftListArr;
  materialListArr;
  sortedMaterialListArr;
  value: number = 0;
  highValue: number = 100000;
  options: Options = {
    floor: 0,
    ceil: 100000,
    step: 500
  };
  sortedSubCatArr;
  sortBy = 1;
  liveProductFlag = false;
  showLoader = false;
  limit = 10;
  offset = 0;
  subsubCatId;

  constructor(private route: ActivatedRoute, private productService: ProductService, private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService, private router: Router) { }

  ngOnInit() {
    this.mainService.setTitle('All Products');
    this.googleAnalyticsService.pageView('All Products');
    document.body.scrollTo(0, 0)
    this.route.queryParams.subscribe(params => {
      this.subcategoryIdFilter = [];
      this.craftFilter = [];
      this.materialFilter = [];
      this.value = 0;
      this.highValue = 100000;
      this.priceFilter = [0, 100000];
      this.offset = 0;
      this.categoryId = params.categoryId;
      if (params && params.subCategoryId) {
        this.subCategoryId = Number(params.subCategoryId);
        this.subcategoryIdFilter.push(Number(params.subCategoryId));
      }
      this.subsubCatId = this.route.snapshot.queryParams.subsubcategoryId;
      if (this.subsubCatId) {
        this.subsubCatId = Number(this.subsubCatId);
        // this.getAllProductList(this.categoryId, this.subcategoryIdFilter, this.subsubCatId);
      } else {
        // this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
      }
      this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
      this.getSubCategoryList(this.categoryId);
      this.getCraftList();
      this.getMaterialList();
    });

  }

  ngAfterViewChecked() {
    $(document).ready(function () {
      $('.accordion').find('.accordion-toggle').click(function () {
        $(this).next().slideToggle('600');
        // $(".accordion-content").not($(this).next()).slideUp('600');
      });
      $('.accordion-toggle').on('click', function () {
        $(this).toggleClass('active').siblings().removeClass('active');
      });
    });
    $(document).ready(function () {
      $(".drop-down .selected a").click(function() {
      $(".drop-down .options ul").toggle();
    });

    //SELECT OPTIONS AND HIDE OPTION AFTER SELECTION
      $(".drop-down .options ul li a").click(function() {
      var text = $(this).html();
      $(".drop-down .selected a span").html(text);
      $(".drop-down .options ul").hide();
    });


    //HIDE OPTIONS IF CLICKED ANYWHERE ELSE ON PAGE
      $(document).bind('click', function(e) {
      var $clicked = $(e.target);
      if (! $clicked.parents().hasClass("drop-down"))
          $(".drop-down .options ul").hide();
    });
  });
  }

  // function to get all product list
  getAllProductList(categoryid, subcategoryid) {
    const payload = {
      categoryId: categoryid,
      subcategoryId: subcategoryid,
      craftId: '',
      materialId: '',
      price: '',
      limit: this.limit,
      offset: this.offset,
      sortBy: this.sortBy,
      plive: this.liveProductFlag ? '1' : '0',
      subsubcategoryId: this.subsubCatId
    };
    if (!this.subsubCatId) {
      payload.subsubcategoryId = '';
    }
    if (payload.subcategoryId.length === 0) {
      payload.subcategoryId = '';
    } else {
      payload.subcategoryId = payload.subcategoryId.toString();
    }
    if (this.craftFilter.length === 0) {
      payload.craftId = '';
    } else {
      payload.craftId = this.craftFilter.toString();
    }
    if (this.materialFilter.length === 0) {
      payload.materialId = '';
    } else {
      payload.materialId = this.materialFilter.toString();
    }
    if (this.sortBy == 0) {
      delete payload.sortBy;
    }
    payload.price = this.priceFilter.toString();
    // this.showLoader = true;
    this.mainService.showSpinner();
    this.productService.getProductList(payload).subscribe(res => {
      if (res && res.code === 200) {
        if (this.offset === 0) {
          this.banner = res.banner;
          this.liveProductArr = [];
          this.nonLiveProductArr = [];
        }
        // const liveArr = res.result;
        // const nonLiveArr = res.result;
        if (this.liveProductFlag) {
          res.result.forEach(element => {
            this.liveProductArr.push(element);
          });
        } else {
          res.result.forEach(element => {
            this.nonLiveProductArr.push(element);
          });
        }
        // this.showLoader = false;
        this.mainService.hideSpinner();
      } else {
        this.mainService.error(res.message);
        // this.showLoader = false;
        this.mainService.hideSpinner();
      }
    }, error => {
      this.mainService.error(error);
      // this.showLoader = false;
      this.mainService.hideSpinner();
    });
  }

  // function to get sub category list
  getSubCategoryList(categoryid) {
    const payload = {
      categoryId: categoryid
    };
    this.productService.getSubCategoryList(payload).subscribe(response => {
      if (response.code === 200) {
        this.subCategoryArr = response.result;
        this.sortedSubCatArr = response.result;
        // this.sortedSubCatArr.forEach(element => {
        //   if (element.id === this.subCategoryId) {
        //   }
        // });
      } else {
        this.mainService.error(response.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function on applying subcategory filter
  filterSubCategory(event, id) {
    if (event.target.checked) {
      this.subcategoryIdFilter.push(id);
      this.offset = 0;
      this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
    } else {
      const index = this.subcategoryIdFilter.indexOf(id);
      if (index > -1) {
        this.subcategoryIdFilter.splice(index, 1);
        this.offset = 0;
      }
      this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
    }
  }

  // function on applying craft filter
  filterCraft(event, id) {
    if (event.target.checked) {
      this.craftFilter.push(id);
      this.offset = 0;
      this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
    } else {
      const index = this.craftFilter.indexOf(id);
      if (index > -1) {
        this.offset = 0;
        this.craftFilter.splice(index, 1);
      }
      this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
    }
  }

  // function on applying material filter
  filterMaterial(event, id) {
    if (event.target.checked) {
      this.materialFilter.push(id);
      this.offset = 0;
      this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
    } else {
      const index = this.materialFilter.indexOf(id);
      if (index > -1) {
        this.materialFilter.splice(index, 1);
        this.offset = 0;
      }
      this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
    }
  }

  // function on price slider change
  sliderPriceChagne(lowVal, highVal) {
    this.priceFilter[0] = lowVal;
    this.priceFilter[1] = highVal;
    this.offset = 0;
    this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
  }

  // function to get craft list
  getCraftList() {
    const payload = {
      type: 'craft'
    };
    this.productService.getCraftList(payload).subscribe(response => {
      if (response.code === 200) {
        this.craftListArr = response.result;
        this.sortedCraftListArr = response.result;
      } else {
        this.mainService.error(response.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function to get craft list
  getMaterialList() {
    const payload = {
      type: 'material'
    };
    this.productService.getCraftList(payload).subscribe(response => {
      if (response.code === 200) {
        this.materialListArr = response.result;
        this.sortedMaterialListArr = response.result;
      } else {
        this.mainService.error(response.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  searchSubCat(e) {
    const val = e.target.value;
    if (!val) {
      this.sortedSubCatArr = this.subCategoryArr;
      return;
    }
    this.sortedSubCatArr = this.subCategoryArr.filter(obj =>
      obj.title.toLowerCase().indexOf(val.toLowerCase()) >= 0
    );
  }

  searchCraft(e) {
    const val = e.target.value;
    if (!val) {
      this.sortedCraftListArr = this.craftListArr;
      return;
    }
    this.sortedCraftListArr = this.craftListArr.filter(obj =>
      obj.title.toLowerCase().indexOf(val.toLowerCase()) >= 0
    );
  }

  searchMaterial(e) {
    const val = e.target.value;
    if (!val) {
      this.sortedMaterialListArr = this.materialListArr;
      return;
    }
    this.sortedMaterialListArr = this.materialListArr.filter(obj =>
      obj.title.toLowerCase().indexOf(val.toLowerCase()) >= 0
    );
  }

  selectSortBy(val) {
    this.sortBy = val;
    this.offset = 0;
    this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
  }

  // function on scroll
  onScrollLive() {
    if (this.liveProductFlag) {
      if (!this.liveProductArr.length || this.liveProductArr.length % 10 !== 0) {
        return;
      }
    } else {
      if (!this.nonLiveProductArr.length || this.nonLiveProductArr.length % 10 !== 0) {
        return;
      }
    }
    this.offset += 10;
    this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
  }

  // function on clear all filters
  clearAllFilter() {
    this.subcategoryIdFilter = [];
    this.craftFilter = [];
    this.materialFilter = [];
    this.value = 0;
    this.highValue = 100000;
    this.priceFilter = [0, 100000];
    this.subCategoryId = undefined;
    this.subsubCatId = undefined;
    this.offset = 0;
    this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
    this.getSubCategoryList(this.categoryId);
    this.getCraftList();
    this.getMaterialList();
  }
  toggleLive(data) {
    if ((data === 'live' && this.liveProductFlag) || (data === 'nonlive' && !this.liveProductFlag)) {
      return;
    } else if (data === 'live') {
      this.liveProductFlag = true;
      this.offset = 0;
      this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
    } else {
      this.liveProductFlag = false;
      this.offset = 0;
      this.getAllProductList(this.categoryId, this.subcategoryIdFilter);
    }
  }

  sendEvent(type: string, label: string) {
    this.googleAnalyticsService.eventEmitter(type, label);
  }

  navigateto(path: string, type: string, data) {
    if (type) {
      this.googleAnalyticsService.eventEmitter(type, '');
    }
    this.router.navigate([path], { queryParams: { productId: data.id } });
  }

}
