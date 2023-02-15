import { Injectable } from '@angular/core';
// tslint:disable-next-line: ban-types
declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  GA_MEASUREMENT_ID = 'G-E3Z15Q2FJK';

  constructor() { }

  // public eventEmitter(
  //   eventName: string,
  //   eventCategory: string,
  //   eventAction: string,
  //   eventLabel: string = null,
  //   eventValue: number = null ){
  //        gtag('event', eventName, {
  //                eventCategory: eventCategory,
  //                eventLabel: eventLabel,
  //                eventAction: eventAction,
  //                eventValue: eventValue
  //              })
  //   }

  pageView(pageTitle: string) {
    gtag('config', this.GA_MEASUREMENT_ID, {
      page_title : pageTitle
    });
  }

  eventEmitter(eventName: string, eventLable?: string) {
    gtag('event', eventName, {
      event_category: '',
      event_label: eventLable ? eventLable : ''
    });
  }

  eventEmitterWithValue(eventName: string, values: number) {
    gtag('event', eventName, {
      event_category: '',
      event_label: '',
      value: values
    });
  }

  screenView(screenName, eventName?: string) {
    gtag('event', 'screen_view', {
      app_name: 'Lal10_Website',
      screen_name : screenName,
      event_name: eventName ? eventName : ''
    });
  }
}
