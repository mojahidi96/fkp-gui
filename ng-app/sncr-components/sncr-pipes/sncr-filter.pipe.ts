import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {isObject} from 'util';

@Pipe({
  name: 'filter'
})
export class SncrFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, key?: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(val => {
      // as it returns the object
      // we are filtering it with the name object
      if (isObject(val) && UtilsService.notNull(key)) {
        return val[key].toString().toLowerCase().includes(searchText);
      } else {
        return val.toString().toLowerCase().includes(searchText);
      }
    });
  }
}