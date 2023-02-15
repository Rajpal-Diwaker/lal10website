import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datediff'
})
export class DatediffPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!value && !args) return null
    
      var startDate = new Date(args);
      var endDate = new Date(value)
      var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    
      var minute = seconds / 60
      var txt = ""
      if (seconds < 60) {
        //just now
        txt = "0"
      } else if (minute > 60) {
        //hr
        let hr = Math.round(minute / 60)
        txt = hr + " hr"
        if (hr > 24) {
          // days
          let day = Math.round(hr / 24)
          txt = day + " day"
          if (day > 7) {
            let week = Math.round(day / 7)
            txt = week + " week"
            if (week > 1) {
              txt = week + " weeks"
            }
          }
        }
    
      } else {
        // min
        txt = Math.round(minute) + " min"
      }

    return txt ;
  }

}
