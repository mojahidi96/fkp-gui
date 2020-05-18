import {FixedNetService} from '../../fixednet.service';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';

export class CreateEditShop {
  patternMap: any;
  pattern = '';
  sqlKeyWords = [];

  constructor(fixedNetService: FixedNetService) {
    this.patternMap = fixedNetService.getPattern();
    if (UtilsService.notNull(this.patternMap) && !UtilsService.deepCompare(this.patternMap, '{}')) {
      this.pattern = this.patternMap['pattern'] ? this.patternMap['pattern'] : '';
      this.sqlKeyWords = this.patternMap['sqlKeyWords'] ? this.patternMap['sqlKeyWords'].split(',') : [];
    }
  }


  isInvalidInput(inputVal: string) {
    if (inputVal) {
      return this.sqlKeyWords.some(keyWord => typeof inputVal === 'string' && inputVal.trim().toUpperCase().startsWith(keyWord));
    }
  }
}