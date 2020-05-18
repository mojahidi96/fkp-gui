import {EventEmitter, Injectable} from '@angular/core';
import {Filter} from './filter';
import {UtilsService} from '../../sncr-commons/utils.service';

@Injectable()
export class FilterService {
  operations = {
    // Empty / Not Empty
    'E': a => a === null || a === undefined || (a.toString().trim() === ''),
    'NE': a => !this.operations['E'](a),
    // EQuals / Not EQuals
    'EQ': (a, b) => UtilsService.notNull(a) && UtilsService.notNull(b) &&
      a.toString().trim().toLowerCase() === b.toString().trim().toLowerCase(),
    'NEQ': (a, b) => !this.operations['EQ'](a, b),
    // INCludes / Not INCludes
    'INC': (a, b) => !!a && a.toString().toLowerCase().includes(b.toString().toLowerCase()),
    'NINC': (a, b) => !this.operations['INC'](a, b),
    // Greater Than / Greater Than or Equals
    'GT': (a, b) => parseInt(a, 10) > parseInt(b, 10),
    'GTE': (a, b) => parseInt(a, 10) >= parseInt(b, 10),
    // Lower Than / Lower Than or Equals
    'LT': (a, b) => parseInt(a, 10) < parseInt(b, 10),
    'LTE': (a, b) => parseInt(a, 10) <= parseInt(b, 10)
  };

  calendarOpened = new EventEmitter<boolean>();

  calculate(operation: string, value1: any, value2: any = null) {
    if (value2 !== null) {
      return this.operations[operation](value1, value2);
    } else {
      return this.operations[operation](value1);
    }
  }

  filter(value: any, filter: Filter) {
    if (!filter.comparator1) {
      return;
    }
    const filter1 = filter.type === 'number' || filter.type === 'date' ||
    filter.type === 'price' ? this.parseNumber(filter.filter1) : filter.filter1;
    if (filter.type === 'date' && UtilsService.notNull(value) && (value.toString().trim() === '0')) {
      value = '';
    } else {
      value = filter.type === 'number' || filter.type === 'date' || filter.type === 'price' ? this.parseNumber(value) : value;
    }
    let result = this.calculate(filter.comparator1, value, filter1);
    if (filter.comparator2 &&
      ((result && filter.logicalOperation === 'AND') || (!result && filter.logicalOperation === 'OR'))) {
      const filter2 = filter.type === 'number' || filter.type === 'date' || filter.type === 'price' ?
        this.parseNumber(filter.filter2) : filter.filter2;
      result = this.calculate(filter.comparator2, value, filter2);
    }
    return result;
  }

  private parseNumber(value) {
    if (UtilsService.notNull(value)) {
      let number = value.toString().replace(',', '.').replace('€', '').trim();
      if (number.includes('.')) {
        let numberArray = number.split('');
        for (let i = numberArray.length - 1; i >= 0 && (number[i] === '0' || number[i] === '.'); i--) {
          if (numberArray.pop() === '.') {
            break;
          }
        }
        number = numberArray.join('');
      }
      return number;
    }
    return value;
  }
}