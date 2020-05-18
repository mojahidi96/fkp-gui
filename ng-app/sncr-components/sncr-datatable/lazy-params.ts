import {Filter} from './filter/filter';
import {Column} from 'primeng/shared';

export class LazyParams {
  rows: number;
  first: number;
  sortField: string;
  sortOrder: number;
  configId: string;
  selectAll: 'true' | 'false';
  filters: Filter[] = [];
  selectedCols: Column[] = [];
  zipDownload?: boolean;
  savedFileName?: string;
  advancedSearch?: boolean;
  selections?: any[];
  viewOptKey?: any;
  maxSelectKey?: string;
}