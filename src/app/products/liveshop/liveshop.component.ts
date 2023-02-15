import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { ProductService } from '../product.service';
import { Options } from 'ng5-slider';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';
import { Router } from '@angular/router';

declare let $: any;
@Component({
  selector: 'app-liveshop',
  templateUrl: './liveshop.component.html',
  styleUrls: ['./liveshop.component.css']
})
export class LiveshopComponent implements OnInit {
  liveshopListArr = [];
  sortBy = 1;
  showLoader = false;
  offset = 0;
  limit = 10;
  defaultImage = 'assets/images/placeholder.png';
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
  priceFilter = [0, 100000];
  subcategoryIdFilter = [];
  subCategoryArr;
  sortedSubCatArr;
  subCategoryId;
  categoryId;
  categoryListArr;
  sortedCategoryListArr;
  categoryIdFilter = [];

  constructor(private mainService: UserService, private productService: ProductService,
              private googleAnalyticsService: GoogleAnalyticsService, private router: Router) { }

  ngOnInit() {
    this.mainService.setTitle('Live Shop');
    this.googleAnalyticsService.pageView('Live Shop');
    this.categoryListArr = JSON.parse(localStorage.getItem('mainCat'));
    this.sortedCategoryListArr = JSON.parse(localStorage.getItem('mainCat'));
    this.getLiveShopList();
    // this.getSubCategoryList(this.categoryId);
    this.getCraftList();
    this.getMaterialList();

  //   $(".opt_check").change(function(){
  //     // alert('');
  // $(".opt_check").prop('checked',false);
  // $(this).prop('checked',true);
  // });
  //TOGGLING NESTED ul
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
  }

  // function to get live shop list
  getLiveShopList() {
    const payload = {
      categoryId: this.categoryIdFilter.toString(),
      subcategoryId: this.subcategoryIdFilter.toString(),
      craftId: this.craftFilter.toString(),
      materialId: this.materialFilter.toString(),
      price: this.priceFilter.toString(),
      sortBy: this.sortBy,
      limit: this.limit,
      offset: this.offset
    };
    // this.showLoader = true;
    // if (payload.categoryId.length === 0) {
    //   payload.categoryId = '';
    // } else {
    //   payload.categoryId = payload.subcategoryId.toString();
    // }
    // if (payload.subcategoryId.length === 0) {
    //   payload.subcategoryId = '';
    // } else {
    //   payload.subcategoryId = payload.subcategoryId.toString();
    // }
    // if (this.craftFilter.length === 0) {
    //   payload.craftId = '';
    // } else {
    //   payload.craftId = this.craftFilter.toString();
    // }
    // if (this.materialFilter.length === 0) {
    //   payload.materialId = '';
    // } else {
    //   payload.materialId = this.materialFilter.toString();
    // }
    // payload.price = this.priceFilter.toString();
    this.mainService.showSpinner();
    this.productService.liveshop(payload).subscribe(res => {
      if (res && res.code === 200) {
        if (this.offset === 0) {
          this.liveshopListArr = [];
        }
        const liveArr = res.result;
        liveArr.forEach(element => {
          this.liveshopListArr.push(element);
        });
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

  // function to select sort by
  selectSortBy(val) {
    this.sortBy = val;
    this.offset = 0;
    this.getLiveShopList();
  }

  // function on scroll pagingation
  onScrollLive() {
    if (!this.liveshopListArr.length || this.liveshopListArr.length % 10 !== 0) {
      return;
    }
    this.offset += 10;
    this.getLiveShopList();
  }

  // function on applying subcategory filter
  filterSubCategory(event, id) {
    if (event.target.checked) {
      this.subcategoryIdFilter.push(id);
      this.offset = 0;
      this.getLiveShopList();
    } else {
      const index = this.subcategoryIdFilter.indexOf(id);
      if (index > -1) {
        this.subcategoryIdFilter.splice(index, 1);
        this.offset = 0;
      }
      this.getLiveShopList();
    }
  }

  // function on applying subcategory filter
  filterCategory(event, id, i?) {
    // if (i) {
    //   this.sortedCategoryListArr.forEach(element => {
    //     if (element.id !== this.sortedCategoryListArr[i].id) {
    //       $("#option_1" + i).prop('checked', false);
    //     }
    //   });
    // }
    this.subCategoryArr = [];
    this.sortedSubCatArr = [];
    if (event.target.checked) {
      this.categoryIdFilter.push(id);
      this.offset = 0;
      this.getLiveShopList();
      this.getSubCategoryList(this.categoryIdFilter);
    } else {
      const index = this.categoryIdFilter.indexOf(id);
      if (index > -1) {
        this.categoryIdFilter.splice(index, 1);
        this.offset = 0;
      }
      this.getLiveShopList();
    }
  }

  // function on applying craft filter
  filterCraft(event, id) {
    if (event.target.checked) {
      this.craftFilter.push(id);
      this.offset = 0;
      this.getLiveShopList();
    } else {
      const index = this.craftFilter.indexOf(id);
      if (index > -1) {
        this.offset = 0;
        this.craftFilter.splice(index, 1);
      }
      this.getLiveShopList();
    }
  }

  // function on applying material filter
  filterMaterial(event, id) {
    if (event.target.checked) {
      this.materialFilter.push(id);
      this.offset = 0;
      this.getLiveShopList();
    } else {
      const index = this.materialFilter.indexOf(id);
      if (index > -1) {
        this.materialFilter.splice(index, 1);
        this.offset = 0;
      }
      this.getLiveShopList();
    }
  }

  // function on price slider change
  sliderPriceChagne(lowVal, highVal) {
    this.priceFilter[0] = lowVal;
    this.priceFilter[1] = highVal;
    this.offset = 0;
    this.getLiveShopList();
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
  searchCat(e) {
    const val = e.target.value;
    if (!val) {
      this.sortedCategoryListArr = this.categoryListArr;
      return;
    }
    this.sortedCategoryListArr = this.categoryListArr.filter(obj =>
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

  // function on clear all filters
  clearAllFilter() {
    this.categoryListArr = JSON.parse(localStorage.getItem('mainCat'));
    this.sortedCategoryListArr = JSON.parse(localStorage.getItem('mainCat'));
    this.categoryIdFilter = [];
    this.subcategoryIdFilter = [];
    this.craftFilter = [];
    this.materialFilter = [];
    this.value = 0;
    this.highValue = 100000;
    this.priceFilter = [0, 100000];
    this.subCategoryId = undefined;
    this.offset = 0;
    this.subCategoryArr = [];
    this.sortedSubCatArr = [];
    this.getLiveShopList();
    // this.getSubCategoryList(this.categoryId);
    this.getCraftList();
    this.getMaterialList();
  }

  // function to get sub category list
  getSubCategoryList(categoryid) {
    const payload = {
      categoryId: categoryid.toString()
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
