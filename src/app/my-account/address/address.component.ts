import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  @Input() selectedOption;
  addFlag = false; // AIzaSyDAIJ08X0BznyCJXQiD5Dt3cRXWoj8WZd8
  addAddressForm: FormGroup;
  submitted = false;
  addressListArr;
  editFlag = false;
  addressTypeHomeFlag = false;
  addressTypeWorkFlag = false;
  countryListArr;
  stateListArr = [];
  cityListArr = [];
  apiKey = ''; //
  mapApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';

  constructor(private router: Router, private fb: FormBuilder, private accountService: AccountService, private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.getAddressList();
    this.getCountryList();
  }

  // function to set form field
  setAddressForm(data?) {
    this.submitted = false;
    this.addAddressForm = this.fb.group({
      fullName: [data ? data.name : '', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
      mobile: [data ? data.mobNo : '', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      line1: [data ? data.addLine1 : '', [Validators.required]],
      street: [data ? data.street : '', [Validators.required]],
      country: [data ? data.countryId : '', [Validators.required]],
      state: [data ? data.stateId : '', [Validators.required]],
      city: [data ? data.cityId : '', [Validators.required]],
      pin: [data ? data.zip : '', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      // tslint:disable-next-line: max-line-length
      type: [data ? data.addressType : '', [Validators.required]],
      addressName: [data ? data.addressName : ''],
      id: [data ? data.id : ''],
      latlong: [data ? data.latlong : '0,0']
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
    if (this.editFlag && this.addressTypeHomeFlag) {
      this.mainService.success('Edited successfully');
      return;
    }
    this.sendEvent('Address_save');
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
      id: this.f.id.value,
      latlong: this.f.latlong.value
    };
    if (payload.id === '') {
      delete payload.id;
    }
    this.mainService.showSpinner();
    this.accountService.addAddress(payload).subscribe(response => {
      if (response.code === 200) {
        this.mainService.success(response.message);
        this.addFlag = false;
        this.editFlag = false;
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

  // function to get address list
  getAddressList() {
    this.accountService.getUserAddress().subscribe(response => {
      if (response.code === 200) {
        this.mainService.hideSpinner();
        this.scrollTop();
        this.addressTypeHomeFlag = false;
        this.addressTypeWorkFlag = false;
        this.addressListArr = response.result;
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
      }
    }, error => {
      this.mainService.error(error);
    });
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

  // function to remove address
  deleteAddress(Id) {
    this.sendEvent('Address_delete');
    this.mainService.confirmPopup('You want to remove this address !').then(el => {
      if (el.value) {
        const payload = {
          id: Id,
          type: 'address'
        };
        this.accountService.deleteAddress(payload).subscribe(response => {
          if (response.code === 200) {
            this.mainService.success(response.message);
            this.getAddressList();
            this.addFlag = false;
            this.editFlag = false;
          } else {
            this.mainService.error(response.message);
          }
        }, error => {
          this.mainService.error(error);
        });
      }
    });
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
    this.accountService.getCountry().subscribe(res => {
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
    this.accountService.getState(country).subscribe(res => {
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
    this.accountService.getCity(state).subscribe(res => {
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
    this.googleAnalyticsService.eventEmitter('My Account', type);
  }

}
