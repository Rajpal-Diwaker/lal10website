import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart.service';
import { SharedService } from '../../_services/shared.service';
import { ScriptService } from '../../_scripts/script.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

declare var Razorpay: any;
declare let $: any;
// declare var orderId: any;

@Component({
  selector: 'app-select-payment',
  templateUrl: './select-payment.component.html',
  styleUrls: ['./select-payment.component.css']
})
export class SelectPaymentComponent implements OnInit {
  submitted = false;
  razorPayData: FormGroup;
  razorPayOptions = {
    "key": 'rzp_live_Dgv9W0Euq5meCV',  // rzp_test_wwHXgyLEIsXlWT  rzp_live_Dgv9W0Euq5meCV
    "amount": '',
    "currency": '',
    "order_id": '',
    "handler": (res) => {
    },
    "prefill.method": '',
    "prefill.name": '',
    "prefill.email": '',
    "prefill.contact": '',
    "save": 1
  };
  ids = [];
  addressId;
  liveCartArr;
  totalAmount = 0;
  userinfo;
  paymentMethodArr = [
    {id: 1, title: 'UPI / QR', description: 'Instant payment using UPI app or UPI id', value: 'upi'},
    {id: 2, title: 'Credit / Debit / ATM cards', description: 'Visa, MasterCard, Rupay & more', value: 'card'},
    {id: 3, title: 'Netbanking', description: 'All Indian banks', value: 'netbanking'},
    {id: 4, title: 'Wallets', description: 'Phonepe & more', value: 'wallet'}
  ];
  paymentSelected;
  continue = false;
  orderId;
  result;
  transactionId;

  constructor(private mainService: UserService, private fb: FormBuilder, private route: ActivatedRoute,
              public cartService: CartService, private sharedService: SharedService, private router: Router,
              private script: ScriptService, private googleAnalyticsService: GoogleAnalyticsService) {
                this.script.load('razorpay').then(data => {
                  console.log('script loaded ', data);
              }).catch(error => console.log(error));
               }

  ngOnInit() {
    this.mainService.setTitle('Select Payment');
    this.googleAnalyticsService.pageView('Select Payment');
    this.route.queryParams.subscribe(params => {
      if (!Array.isArray(params.id)) {
        this.ids.push(params.id);
        this.addressId = params.address;
      } else {
        this.ids = params.id;
        this.addressId = params.address;
      }
    });
    this.userinfo = JSON.parse(localStorage.getItem('user_data'));
    this.getCartData();
  }

  setCheckoutForm() {
    this.razorPayData = this.fb.group({
      totalAmount: '',
      name: '',
      id: ''
    });
  }

  // funtion on buy click
  buyRazorPay(formData: any) {
    this.submitted = true;
    this.mainService.showSpinner();

  }

  checkInventory() {
    this.continue = true;
    if (!this.paymentSelected) {
      return;
    }
    this.mainService.showSpinner();
    this.cartService.checkInventory(this.ids.toString()).subscribe(res => {
      if (res && res.code === 200) {
        const checked = res.result;
        // checked[0].code = 0;
        for (let i = 0; i < checked.length; i++) {
          if (checked[i].code === 0) {
            this.mainService.warning(checked[i].ProductName + ' is out of stock');
            this.mainService.hideSpinner();
            return;
          }
        }
        this.createOrder();
        // this.router.navigate(['cart/checkout'], {queryParams: { id: this.ids, address: this.addressIdSelected } });
      } else {
        this.mainService.error(res.message);
        this.mainService.hideSpinner();
      }
    }, error => {
      this.mainService.error(error);
      this.mainService.hideSpinner();
    });
  }

  createOrder() {
    const payload = {
      amount: this.totalAmount,
      currency: 'INR',
      name: this.userinfo.firstName + ' ' + this.userinfo.lastName
    };
    this.cartService.createOrder(payload).subscribe(res => {
      if (res && res.code === 200) {
        this.mainService.hideSpinner();
        this.razorPayOptions.amount = res.value.amount;
        this.razorPayOptions.order_id = res.value.id;
        this.razorPayOptions.currency = res.value.currency;
        this.razorPayOptions.handler = this.razorpayResponseHandler.bind(this);
        this.razorPayOptions["prefill.contact"] = '+' + '91' + this.userinfo.mobile;
        this.razorPayOptions["prefill.email"] = this.userinfo.email;
        this.razorPayOptions["prefill.name"] = this.userinfo.firstName + ' ' + this.userinfo.lastName;
        this.razorPayOptions["prefill.method"] = this.paymentSelected;
        var rzp = new Razorpay(this.razorPayOptions);
        rzp.open();
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function to get cart data
  getCartData() {
    this.mainService.showSpinner();
    this.cartService.getCartDetail().subscribe(response => {
      if (response.code === 200) {
        let liveArr = response.result.getliveShopCart; // liveShopCart
        liveArr.forEach(element => {
          this.ids.forEach(elementx => {
            if (Number(elementx) === element.id) {
              this.totalAmount = this.totalAmount + (element.amount * element.qty);
            }
          });
        });
        window['ids'] = this.ids.toString();
        window['address'] = this.addressId;
        window['totalAmount'] = this.totalAmount;
        this.mainService.hideSpinner();
      } else {
        this.mainService.error(response.message);
        this.mainService.hideSpinner();
      }
    }, error => {
      this.mainService.error(error);
      this.mainService.hideSpinner();
    });
  }

  razorpayResponseHandler (response) {
    // let ID = [];
    // ID = this.ids;
    this.transactionId = response.razorpay_payment_id;
    const payload = {
      ids: window['ids'],
      totalPrice: window['totalAmount'],
      addressId: window['address'],
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature
    };
    this.cartService.placeOrder(payload).subscribe(res => {
      if (res && res.code === 200) {
        this.sharedService.getCartItems();
        this.orderId = res.result[0].uniqueId;
        this.result = Number(res.redirect);
        // orderId = res.result[0].uniqueId;
        $('#placed_order').modal('toggle');
        try {
          this.mainService.setTitle('Order Placed');
          this.googleAnalyticsService.pageView('Order Placed');
          this.googleAnalyticsService.eventEmitterWithValue('purchase', payload.totalPrice);
        } catch (error) {
          console.log('error in googla analytics');
        }
        setTimeout(() => {
          $('#orderplaced').trigger('click');
        }, 1000);
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  redirectLogic() {
    if (this.result === 1) {
      this.router.navigate(['/cart']);
    } else {
      this.router.navigate(['/']);
    }
  }

  sendEvent(type: string) {
    this.googleAnalyticsService.eventEmitter('Payment', type);
  }

  handlePaymentSendEvent(val) {
    switch (val) {
      case 1:
        this.sendEvent('Payment_upiqr');
        break;

        case 2:
        this.sendEvent('Payment_cred_deb');
        break;

        case 3:
        this.sendEvent('Payment_net_banking');
        break;

        case 4:
        this.sendEvent('Payment_wallet');
        break;

      default:
        break;
    }
  }

}
