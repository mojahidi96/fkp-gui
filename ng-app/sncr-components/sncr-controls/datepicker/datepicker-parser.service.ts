import {Injectable} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DatepickerParserService extends NgbDateParserFormatter {

  parse(value: any): NgbDateStruct {
    if (value && !isNaN(value)) {
      const dateValue = new Date(parseInt(value, 10));
      return {
        year: dateValue.getFullYear(),
        month: dateValue.getMonth() + 1,
        day: dateValue.getDate()
      };
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    if (date) {
      return `${this.padNumber(date.day)}.${this.padNumber(date.month)}.${date.year}`;
    }
    return null;
  }

  toNumber(date: NgbDateStruct): number {
    if (date) {
      return new Date(Date.UTC(date.year, date.month - 1, date.day)).getTime();
    }
    return null;
  }

  private padNumber(n): string {
    return `0${n}`.slice(-2);
  }
}