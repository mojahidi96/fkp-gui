import {Column} from '../../../sncr-components/sncr-datatable/column';

export class Panel {
  id: number | string;
  label: string;
  hidden?: string;
  contents: Field[][];
  defaultExpanded?: boolean;
  /*
   [
   [field1],
   [field2, field3]
   ]
   */
}

export class Field {
  type: string; // 'textbox' | 'radio' | 'checkbox' | 'select' | 'date' | 'label' | 'table';
  defaultValue?: any;
  values?: {label: string, value: any}[]; // Only for radio, checkbox & select
  fieldId?: number | string; // Mandatory for every form field
  label?: string;
  required?: any;
  width?: number; // bootstrap columns for width
  hidden?: string;
  show?: string;
  disabled?: string;
  desc?: string;
  validation?: { string, any? };
  // for table only
  cols?: Column[];
  rows?: any;
  minDate?: string;
  inline?: boolean; // For radio groups only
}
