import {Pipe, PipeTransform} from '@angular/core';

/**
 * CustomDate pipe formats the date timestamp into corresponding date format which is "DD.MM.YYYY HH:mm"
 * Currently the pipe is restricted to support the above format
 */
@Pipe({name: 'customDate'})
export class CustomDatePipe implements PipeTransform {
  transform(value: any): any {
    let dateFormat = '';
    if (value) {
      let date = new Date(value);
      let day = date.getDate().toString(), month = (date.getMonth() + 1).toString(), year = date.getFullYear().toString(),
        hours = date.getHours().toString(), mins = date.getMinutes().toString();

      dateFormat = [
          day.length === 1 ? '0' + day : day,
          month.length === 1 ? '0' + month : month,
          year
        ].join('.') + ' ' +
        [
          hours.length === 1 ? '0' + hours : hours,
          mins.length === 1 ? '0' + mins : mins
        ].join(':');
    }
    return dateFormat;
  }
}