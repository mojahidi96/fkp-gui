export interface DatatableRequestPayload {
  url?: string;
  lazyParams: any;
  selectAll?: boolean;
  selections?: any[];
}

export interface LoadColumnsPayload {
  lazy?: boolean;
  columns?: any[];
}

export interface SelectionChangePayload {
  allSelected?: boolean;
  selection?: any[];
  selectCount?: number;
}

export interface CbChangePayload {
  row?: any;
}

export class LoadColumns {
  static readonly type = '[Datatable] LoadColumns';

  constructor(public payload: LoadColumnsPayload) {

  }
}

export class LoadData {
  static readonly type = '[Datatable] LoadData';

  constructor(public payload: DatatableRequestPayload = {lazyParams: {}}) {

  }
}

export class RetrieveData {
  static readonly type = '[Datatable] RetrieveData';

  constructor(public payload: DatatableRequestPayload = {lazyParams: {}}) {

  }
}

export class SelectionChange {
  static readonly type = '[Datatable] SelectionChange';

  constructor(public payload: SelectionChangePayload) {

  }
}

export class CbChange {
  static readonly type = '[Datatable] CbChange';

  constructor(public payload: CbChangePayload) {

  }
}

export class ShowLoader {
  static readonly type = '[Datatable] ShowLoader';

  constructor() {

  }
}