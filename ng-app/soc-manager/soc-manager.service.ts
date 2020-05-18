/**
 * Created by srao0004 on 3/14/2017.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class SocManagerService {

  resetFilter(sncrTable) {
    if (sncrTable.previousFilters.length > 0) {
      for (let filter of sncrTable.previousFilters) {
        sncrTable.filtering(filter);
      }
    }

  }

  restSorting(a, b, sncrtable) {
    let value1 = sncrtable.dt.resolveFieldData(a, sncrtable.dt.sortField);
    let value2 = sncrtable.dt.resolveFieldData(b, sncrtable.dt.sortField);
    let result = null;

    if (value1 == null && value2 != null) {
      result = -1;
    } else if (value1 != null && value2 == null) {
      result = 1;
    } else if (value1 == null && value2 == null) {
      result = 0;
    } else if (typeof value1 === 'string' && typeof value2 === 'string') {
      result = value1.localeCompare(value2);
    } else {
      result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
    }
    return (sncrtable.dt.sortOrder * result);
  }
}


