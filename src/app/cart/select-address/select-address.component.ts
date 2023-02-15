import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.css']
})
export class SelectAddressComponent implements OnInit {
  addressListArr;
  addFlag = false;
  addAddressForm: FormGroup;
  submitted = false;
  addressIdSelected;
  ids = [];
  continued = false;
  addressTypeHomeFlag = false;
  addressTypeWorkFlag = false;
  countryListArr;
  stateListArr = [];
  cityListArr = [];
  apiKey = '';
  mapApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';

  constructor(private router: Router, private cartService: CartService, private fb: FormBuilder, private mainService: UserService,
              private route: ActivatedRoute, private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Select Address');
    this.googleAnalyticsService.pageView('Select Address');
    this.route.queryParams.subscribe(params => {
      if (!Array.isArray(params.id)) {
        this.ids.push(params.id);
      } else {
        this.ids = params.id;
      }
    });
    this.getAddressList();
    this.getCountryList();
  }

  openSelectPayment() {
    this.router.navigate(['./cart/select-payment']);
  }

  // function to get user address list
  getAddressList() {
    this.cartService.getUserAddress().subscribe(response => {
      if (response.code === 200) {
        this.mainService.hideSpinner();
        this.addressListArr = response.result;
        this.scrollTop();
        this.addressListArr.forEach(element => {
          if (element.addressType === 'Home') {
            this.addressTypeHomeFlag = true;
          }
          if (element.addressType === 'Work') {
            this.addressTypeWorkFlag = true;
          }
        });
      } else {
        this.mainService.error(response.message);
        this.mainService.hideSpinner();
      }
    }, error => {
      this.mainService.error(error);
      this.mainService.hideSpinner();
    });
  }

  // function to set form field
  setAddressForm() {
    this.submitted = false;
    this.addAddressForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
      mobile: ['', [Validators.required, Validators.minLength(10),
        Validators.maxLength(15)]],
      line1: ['', [Validators.required]],
      street: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pin: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      type: ['', [Validators.required]],
      addressName: [''],
      latlong: ['0,0']
    });
    this.listenTypeChanges();
  }

  // function to get form controls
  get f() { return this.addAddressForm.controls; }

  // function on submit of add address form
  submit() {
    this.submitted = true;
    if (!this.addAddressForm.valid) {
      return;
    }
    const payload = {
      name: this.f.fullName.value,
      mobNo: this.f.mobile.value,
      addLine1: this.f.line1.value,
      street: this.f.street.value,
      countryId: this.f.country.value,
      stateId: this.f.state.value,
      cityId: this.f.city.value,
      zip: this.f.pin.value,
      addressType: this.f.type.value,
      addressName: this.f.addressName.value,
      latlong: this.f.latlong.value
    };
    this.mainService.showSpinner();
    this.cartService.addAddress(payload).subscribe(response => {
      if (response.code === 200) {
        this.mainService.success(response.message);
        this.addFlag = false;
        this.getAddressList();
      } else {
        this.mainService.error(response.message);
      }
    }, error => {
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

  // function to scroll page to top
  scrollTop() {
    // document.body.scrollTo(0, 0);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  selectAddress(id) {
    this.addressIdSelected = id;
  }

  checkInventory() {
    this.continued = true;
    if (!this.addressIdSelected) {
      return;
    }
    this.sendEvent('Shipping_order_continue');
    this.router.navigate(['cart/checkout'], {queryParams: { id: this.ids, address: this.addressIdSelected } });
    // this.cartService.checkInventory(this.ids.toString()).subscribe(res => {
    //   if (res && res.code === 200) {
    //     const checked = res.result;
    //     // checked[0].code = 0;
    //     for (let i = 0; i < checked.length; i++) {
    //       if (checked[i].code === 0) {
    //         this.mainService.warning(checked[i].ProductName + ' is out of stock');
    //         return;
    //       }
    //     }
    //     this.router.navigate(['cart/checkout'], {queryParams: { id: this.ids, address: this.addressIdSelected } });
    //   } else {
    //     this.mainService.error(res.message);
    //   }
    // }, error => {
    //   this.mainService.error(error);
    // });
  }

  // function to listen for address type change for dynamically show or hide other input box
  listenTypeChanges() {
    this.f.type.valueChanges.subscribe(data => {
      if (data === 'Other') {
        this.f.addressName.setValidators(Validators.required);
      } else {
        this.f.addressName.clearValidators();
      }
      this.f.addressName.updateValueAndValidity();
    });
  }

  // function to notify user about already particular type address exist
  addressExist(type) {
    if (type === 'Home') {
      this.mainService.info('You already have a home address');
    }
    if (type === 'Work') {
      this.mainService.info('You already have a work address');
    }
  }

  // function to get country list
  getCountryList() {
    this.cartService.getCountry().subscribe(res => {
      if (res && res.code === 200) {
        this.countryListArr = res.result;
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function to get state list
  getStateList(country) {
    if (!country) {
      this.stateListArr = [];
      return;
    }
    this.mainService.showSpinner();
    this.cartService.getState(country).subscribe(res => {
      if (res && res.code === 200) {
        // this.stateListArr = [];
        // this.stateListArr.push(res.result);
        this.stateListArr = res.result;
        this.mainService.hideSpinner();
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function to get country list
  getCityList(state) {
    if (!state) {
      this.cityListArr = [];
      return;
    }
    this.mainService.showSpinner();
    this.cartService.getCity(state).subscribe(res => {
      if (res && res.code === 200) {
        // this.cityListArr = [];
        // this.cityListArr.push(res.result);
        this.cityListArr = res.result;
        this.mainService.hideSpinner();
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function to detect current user location
  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.mainService.showSpinner();
        const coord = [position.coords.latitude, position.coords.longitude];
        const stringCoord = coord.toString();
        this.addAddressForm.controls.latlong.setValue(stringCoord);
        this.getUserAddress(position.coords.latitude, position.coords.longitude);
        // this.locate();
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  // function to get user formatted address using lat, long
  getUserAddress(lat, long) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        try {
          const address = JSON.parse(xhttp.responseText);
        this.addAddressForm.controls.line1.setValue(address.results[0].formatted_address);
        address.results[0].address_components.forEach(element => {
          if (element.types && element.types[0] === 'postal_code') {
            this.addAddressForm.controls.pin.setValue(element.long_name);
          }
          if (element.types && element.types[0] === 'country') {
            this.addAddressForm.controls.country.setValue(element.long_name);
            this.getStateList(element.long_name);
          }
        });
        this.mainService.hideSpinner();
        } catch (error) {
          this.mainService.hideSpinner();
          this.mainService.error('Something went wrong')
        }
      }
    };
    xhttp.open('GET', this.mapApiUrl + 'latlng=' + lat + ',' + long + '&key=' + this.apiKey, true);
    xhttp.send();
  }

  sendEvent(type: string) {
    this.googleAnalyticsService.eventEmitter('Payment', type);
  }

}
