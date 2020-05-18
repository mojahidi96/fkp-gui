export class BulkEditConfig {


}

export class BulkEditRequest {
  id: string;
  field: string;
  newValue: string;
  fieldTitle: string;
  oldValue?: string;
  ban?: string;
}