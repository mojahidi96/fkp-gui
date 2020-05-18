export class Filter {
  saved?: boolean;
  column?: string;
  comparator1?: string;
  comparator2?: string;
  filter1: any;
  filter2?: any;
  logicalOperation?: 'AND'|'OR';
  type?: 'text'|'number'|'price'|'date' = 'number';
}