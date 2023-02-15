import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { CartService } from '../cart.service';
import { SharedService } from '../../_services/shared.service';
import { app_strings } from '../../_constants/app_strings';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

declare let $: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  bothCartType = true;
  cartType;
  liveCartArr;
  enquiryCartArr;
  enquiryForm: FormGroup;
  submitted = false;
  productEnqDetail: FormArray;
  productLiveDetail: FormArray;
  enqCartToSendArr = [];
  liveCartToBuyArr = [];
  totalLiveCartPrice = 0;
  sentEnqID;
  result;
  id;
  submitted2 = false;
  doableQtyCommon;
  reviewIds;
  defaultImage = app_strings.DEF_IMAGE_URL;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
              private mainService: UserService, private cartService: CartService, private sharedService: SharedService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Cart');
    this.googleAnalyticsService.pageView('Cart');
    $("#exampleModal").on("hidden.bs.modal", () => {
      // put your default event here
      // this.clickContinue()
      if (this.result === '1') {
        // $('#exampleModal').modal('hide');
        this.enqCartToSendArr = [];
        // this.getCartData();
        // this.ngOnInit();
        this.getCartData();
        this.setEnqFormField();
        document.body.scrollTo(0, 0)
        this.sharedService.getCartItems();
      } else {
        this.sharedService.getCartItems();
        // $('#exampleModal').modal('hide');
        this.router.navigate(['./']);
      }
  });
    this.sharedService.getCartItems();
    this.route.queryParams.subscribe(params => {
      if (params && params.order) {
        if (params.order === 'buy') {
          this.bothCartType = false;
          this.cartType = 'buy';
          this.id = Number(params.id);
        } else if (params.order === 'enquire') {
          this.bothCartType = false;
          this.cartType = 'enquire';
          this.id = Number(params.id);
        } else {
          this.bothCartType = true;
          this.cartType = 'both';
        }
        this.router.navigate(
          ['/cart'],
          { relativeTo: this.route }
        );
      }
      if (params && params.review) {
        this.reviewIds = JSON.parse(params.review);
      }
    });
    this.getCartData();
    this.setEnqFormField();
  }

  // function to get cart data
  getCartData() {
    if (this.result && this.result === '1') {
      this.cartType = 'both';
    }
    this.cartService.getCartDetail().subscribe(response => {
      if (response.code === 200) {
        localStorage.setItem('isEmailVerified', response.result.isEmailVerified);
        let liveArr = response.result.getliveShopCart; // liveShopCart
        let enqArr = response.result.EnquiryCart;
        if (this.cartType === 'buy') {
          this.liveCartArr = [];
          this.enquiryCartArr = [];
          liveArr.forEach(element => {
            if (element.productId === this.id) {
              this.liveCartArr.push(element);
            }
          });
        } else if (this.cartType === 'enquire') {
          this.liveCartArr = [];
          this.enquiryCartArr = [];
          enqArr.forEach(element => {
            if (element.productId === this.id) {
              this.enquiryCartArr.push(element);
            }
          });
        } else {
          this.liveCartArr = undefined;
          this.enquiryCartArr = undefined;
          this.liveCartArr = liveArr;
          this.enquiryCartArr = enqArr;
        }
        // this.liveCartArr = response.result.liveShopCart;
        // this.enquiryCartArr = response.result.EnquiryCart;
        this.enquiryCartArr.forEach((element) => {
          const { id, productId, image, qty, uniqueId, name, expPrice, description } = element;

          // tslint:disable-next-line: max-line-length
          this.addProductItem({ id, productId, image, qty, uniqueId, name, expPrice, description, isChecked: false, editing: false });
        });
        this.liveCartArr.forEach((element, i) => {
          const { id, productId, image, qty, uniqueId, name, amount, doableQty } = element;

          // tslint:disable-next-line: max-line-length

          if (this.reviewIds && this.reviewIds.some(ele => Number(ele) === element.id)) {
            // this.reviewIds.find(ele => Number(ele) === element.id);
            this.addLiveItem({ id, productId, image, qty, uniqueId, name, amount, doableQty, isChecked: true, editing: false });
            setTimeout(() => {
              let itemm = this.enquiryForm.get('productLiveDetail')['controls'][i].controls;

              this.liveCartToBuyArr.push(itemm);
              this.totalLiveCartPrice += itemm.amount.value * itemm.qty.value;
            }, 1000);
          } else {
            this.addLiveItem({ id, productId, image, qty, uniqueId, name, amount, doableQty, isChecked: false, editing: false });
          }
        });
      } else {
        this.mainService.error(response.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function to remove live prodcut item from cart
  removeLiveItem(Id) {
    this.mainService.confirmPopup('You want to remove this item !').then(el => {
      if (el.value) {
        const payload = {
          id: Id
        };
        this.cartType = 'both';
        this.cartService.removeCartItem(payload).subscribe(response => {
          if (response.code === 200) {
            this.mainService.success(response.message);
            this.ngOnInit();
          } else {
            this.mainService.error(response.message);
          }
        }, error => {
          this.mainService.error(error);
        });
      }
    });
  }

  // set enq product enq form field
  setEnqFormField() {
    this.enquiryForm = this.fb.group({
      productEnqDetail: this.fb.array([]),
      productLiveDetail: this.fb.array([])
    });
  }

  // createProductItem1(
  //   ob = { id: '', productId: '', image: '', qty: '', uniqueId: '', name: '', expectedPrice: '', description: '', isChecked: '' }
  // ): FormGroup {
  //   return this.fb.group(ob);
  // }

  createProductItem(ob): FormGroup {
    return this.fb.group({
      id: [ob.id, [Validators.required]],
      productId: [ob.productId, [Validators.required]],
      image: [ob.image],
      qty: [{value: ob.qty, disabled: ob.description ? true : false}, [Validators.required, Validators.pattern(/[1-9]\d*/)]],
      uniqueId: [ob.uniqueId],
      name: [ob.name],
      expectedPrice: [{value: ob.expPrice, disabled: ob.description ? true : false}], // Validators.pattern(/^[1-9][0-9]*$/)
      description: [{value: ob.description, disabled: ob.description ? true : false}, [Validators.required]],
      isChecked: [{value: ob.isChecked, disabled: ob.description ? false : true}],
      editing: [{value: ob.description ? false : true, disabled: false}]
    });
  }

  addProductItem(ob): void {
    this.productEnqDetail = this.enquiryForm.get('productEnqDetail') as FormArray;
    this.productEnqDetail.push(this.createProductItem(ob));
  }

  get f() { return this.enquiryForm.get('productEnqDetail')['controls']; }

  get l() { return this.enquiryForm.get('productLiveDetail')['controls'] }

  createLiveItem(ob): FormGroup {
    return this.fb.group({
      id: [ob.id, [Validators.required]],
      productId: [ob.productId, [Validators.required]],
      image: [ob.image],
      qty: [{value: ob.qty, disabled : true}, [Validators.required, Validators.pattern(/[1-9]\d*/)]],
      uniqueId: [ob.uniqueId],
      name: [ob.name],
      amount: [{value: ob.amount, disabled: true}], // Validators.pattern(/^[1-9][0-9]*$/)
      isChecked: [{value: ob.isChecked, disabled: false}],
      editing: [ob.editing],
      doableQty: [ob.doableQty]
    });
  }

  addLiveItem(ob): void {
    this.productLiveDetail = this.enquiryForm.get('productLiveDetail') as FormArray;
    this.productLiveDetail.push(this.createLiveItem(ob));
  }

  checkEnq(i, event) {
    if (event.target.checked) {
      this.sendEvent('Card_selected');
      this.enqCartToSendArr.push(this.f[i]);
    } else {
        this.sendEvent('Card_unselected');
        this.enqCartToSendArr.forEach((element, j) => {
        if (element.controls.id.value === this.f[i].controls.id.value) {
          this.enqCartToSendArr.splice(j, 1);
        }
      });
    }
  }

  // function to accept number only
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  submitEnquiryCart() {
    // this.enqCartToSendArr.forEach(element => {
    //   if (element.status === 'INVALID') {
    //     this.mainService.warning('Please fill all the required fields');
    //     return;
    //   }
    // });
    const isEmailVerified = this.mainService.checkEmailVerified();
    if (!this.enqCartToSendArr.length) {
      return;
    }
    // for (let i = 0; i < this.enqCartToSendArr.length; i++) {
    //   if (this.enqCartToSendArr[i].value.qty === '' ||
    //   this.enqCartToSendArr[i].value.expectedPrice === '' ||
    //   this.enqCartToSendArr[i].value.description === '') {
    //     this.mainService.warning('Please fill all the required fields of checked item');
    //     return;
    //   }
    // }
    if (isEmailVerified === '0') {
      // email is not verified, notify user
      $('#emailNotVerified').modal('show');
      return;
    }
    let submitEnq = [];
    this.enqCartToSendArr.forEach(element1 => {
      submitEnq.push({
        productId: element1.controls.productId.value,
        qty: Number(element1.controls.qty.value),
        expPrice: Number(element1.controls.expectedPrice.value),
        description: element1.controls.description.value,
        id: element1.controls.id.value
      });
    });
    // let eeennq = submitEnq.toString();
    this.sendEvent('Click_enquire_now');
    let payload = {
      productsEnq: submitEnq
    };
    // this.mainService.success('Enquiry sent successfully');
    // this.router.navigate(['./']);
    // $('#exampleModal').modal('toggle');
    // return;
    this.cartService.sendProductEnq(payload).subscribe(response => {
      if (response.code === 200) {
        this.mainService.success(response.message);
        this.result = response.result;
        this.sentEnqID = response.uniqueId;
        $('#exampleModal').modal('toggle');
      } else {
        this.mainService.error(response.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  checkLiveProduct(event, item) {
    if (event.target.checked) {
      this.sendEvent('Card_selected');
      this.liveCartToBuyArr.push(item);
      this.totalLiveCartPrice += item.amount.value * item.qty.value;
    } else {
      // const index = this.liveCartToBuyArr.indexOf(item.id.value);
      // if (index > -1) {
      //   this.liveCartToBuyArr.splice(index, 1);
      // }
      this.sendEvent('Card_unselected');
      this.liveCartToBuyArr.forEach((element, j) => {
        if (element.id.value === item.id.value) {
          this.liveCartToBuyArr.splice(j, 1);
          this.totalLiveCartPrice -= element.amount.value * item.qty.value;
          return;
        }
      });
    }
  }

  clickEditIcon(i, data) {
    this.sendEvent('Click_edit');
    if (data === 'pencil') {
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.editing.value = true;
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.qty.enable();
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.expectedPrice.enable();
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.description.enable();
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.isChecked.value = false;
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.isChecked.disable();
    } else if (data === 'btn') {
      // this.enquiryForm.get('productEnqDetail')['controls'][i].controls.editing.value = false;
      // this.enquiryForm.get('productEnqDetail')['controls'][i].controls.qty.disable();
      // this.enquiryForm.get('productEnqDetail')['controls'][i].controls.expectedPrice.disable();
      // this.enquiryForm.get('productEnqDetail')['controls'][i].controls.description.disable();
    }
  }

  updateCartData(i) {
    this.submitted = true;
    // return;
    if (this.enquiryForm.get('productEnqDetail')['controls'][i].status === 'VALID') {
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.editing.value = false;
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.qty.disable();
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.expectedPrice.disable();
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.description.disable();
      this.enquiryForm.get('productEnqDetail')['controls'][i].controls.isChecked.enable();
    } else {
      return;
    }
    const payload = {
      id: this.enquiryForm.get('productEnqDetail')['controls'][i].controls.id.value,
      qty: this.enquiryForm.get('productEnqDetail')['controls'][i].controls.qty.value,
      description: this.enquiryForm.get('productEnqDetail')['controls'][i].controls.description.value,
      expPrice: this.enquiryForm.get('productEnqDetail')['controls'][i].controls.expectedPrice.value
    };
    this.cartService.updateEnqCartItem(payload).subscribe(response => {
      if (response.code === 200) {
        this.mainService.success(response.message);
      } else {
        this.mainService.error(response.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  clickEditIconLive(i) {
    this.sendEvent('Click_edit');
    this.enquiryForm.get('productLiveDetail')['controls'][i].controls.editing.value = true;
    this.enquiryForm.get('productLiveDetail')['controls'][i].controls.qty.enable();
    this.enquiryForm.get('productLiveDetail')['controls'][i].controls.isChecked.value = false;
    this.enquiryForm.get('productLiveDetail')['controls'][i].controls.isChecked.disable();
  }

  updateCartDataLive(i) {
    this.submitted2 = true;
    // return;
    if (this.enquiryForm.get('productLiveDetail')['controls'][i].status !== 'VALID') {
      return;
    } else if (this.l[i].controls.qty.value < this.l[i].controls.doableQty.value) {
      this.doableQtyCommon = this.l[i].controls.doableQty.value;
      $('#doableQty').modal('toggle');
      return;
    } else {
      // this.enquiryForm.get('productLiveDetail')['controls'][i].controls.editing.value = false;
      // this.enquiryForm.get('productLiveDetail')['controls'][i].controls.qty.disable();
      // this.enquiryForm.get('productLiveDetail')['controls'][i].controls.isChecked.enable();
    }

    // if (this.enquiryForm.get('productLiveDetail')['controls'][i].status === 'VALID') {
    //   this.enquiryForm.get('productLiveDetail')['controls'][i].controls.editing.value = false;
    //   this.enquiryForm.get('productLiveDetail')['controls'][i].controls.qty.disable();
    //   this.enquiryForm.get('productLiveDetail')['controls'][i].controls.isChecked.enable();
    // } else {
    //   return;
    // }

    const payload = {
      id: this.enquiryForm.get('productLiveDetail')['controls'][i].controls.id.value,
      qty: this.enquiryForm.get('productLiveDetail')['controls'][i].controls.qty.value
    };
    this.cartService.updateLiveCartItem(payload).subscribe(response => {
      if (response.code === 200) {
        this.mainService.success(response.message);
        this.enquiryForm.get('productLiveDetail')['controls'][i].controls.editing.value = false;
        this.enquiryForm.get('productLiveDetail')['controls'][i].controls.qty.disable();
        this.enquiryForm.get('productLiveDetail')['controls'][i].controls.isChecked.enable();
      } else {
        this.mainService.error(response.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  clickContinue() {
    $('#exampleModal').modal('hide');
    // if (this.result === '1') {
    //   $('#exampleModal').modal('hide');
    //   this.enqCartToSendArr = [];
    //   // this.getCartData();
    //   this.ngOnInit();
    //   document.body.scrollTo(0, 0)
    // } else {
    //   this.sharedService.getCartItems();
    //   $('#exampleModal').modal('hide');
    //   this.router.navigate(['./']);
    // }
  }

  onClickedOutside() {
  }

  // function to redirect to product details page
  openProductDetail(id) {
    this.router.navigate(['/products/detail'], { queryParams: { productId: id } });
  }

  // function to navigate to select address
  openSelectAddress() {
    this.router.navigate(['/cart/select-address']);
  }

  // function to check invenotry
  checkInventory() {
    const isEmailVerified = this.mainService.checkEmailVerified();
    if (isEmailVerified === '0') {
      // email is not verified, notify user
      $('#emailNotVerified').modal('show');
      return;
    }
    const ids = [];
    this.liveCartToBuyArr.forEach(element => {
      ids.push(element.id.value);
    });
    this.sendEvent('Click_proceed_to_buy');
    this.cartService.checkInventory(ids.toString()).subscribe(res => {
      if (res && res.code === 200) {
        const checked = res.result;
        // checked[0].code = 0;
        for (let i = 0; i < checked.length; i++) {
          if (checked[i].code === 0) {
            this.mainService.warning(checked[i].ProductName + ' is out of stock');
            return;
          }
        }
        this.router.navigate(['cart/select-address'], {queryParams: { id: ids } });
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  onImageError(e) {
    e.target.src = this.defaultImage;
  }

  sendEvent(type: string) {
    this.googleAnalyticsService.eventEmitter('Cart Page', type);
  }

}
