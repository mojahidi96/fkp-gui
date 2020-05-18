import {Injectable} from '@angular/core';

/**
 * Service for common methods used along the application.
 */
@Injectable()
export class UtilsService {

  static notNull(value: any) {
    return value !== null && value !== undefined;
  }

  static flattenArray(value: any[]) {
    if (value && value.length) {
      return [].concat(...value);
    }

    return value;
  }

  static deepCompare(value1: any, value2: any): boolean {
    return JSON.stringify(value1) === JSON.stringify(value2);
  }


  static maskAllButLastFour(field: string): string {
    let mask = '';
    if (UtilsService.notNull(field)) {
      if (field.length <= 4) {
        for (let i = 0; i < field.length; i++) {
          mask += '*';
        }
        return mask;
      } else {
        for (let i = 0; i < field.length - 4; i++) {
          mask += '*';
        }
        return mask + field.substring(field.length - 4, field.length);
      }
    } else {
      return mask;
    }
  }

  /**
   * Method focused for directives defaulting to true when no value specified. Basically it'll return true if the value
   * is an empty string or evaluates to true in JavaScript truth table.
   * @param value
   * @returns {boolean}
   */
  static toBoolean(value: any): boolean {
    return value === '' || !!value;
  }

  static stringToBoolean(value: any): boolean {
    if (!value) {
      return false;
    } else if (typeof value === 'boolean') {
      return value;
    } else {
      return value.toString().toLocaleLowerCase() === 'true';
    }
  }

  static isEmpty(value: any): boolean {
    return value === null || value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0);
  }
}