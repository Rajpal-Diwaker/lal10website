// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

//   base_url: 'https://lal10.com/ap',        //  live
//  image_url: 'https://lal10.com/ap/',      //  live

  base_url: 'https://lal10.org/ap', // development
 image_url: 'https://lal10.org/ap/', // development

  razor_url: 'https://api.razorpay.com/v1/orders'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
