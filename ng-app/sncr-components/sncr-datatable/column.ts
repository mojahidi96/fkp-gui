import {TemplateRef} from '@angular/core';

/**
 * Column interface for {@link SncrDatatableComponent}.
 */
export class Column {
  /**
   * A TemplateRef for custom cell contents.
   */
  bodyTemplate?: TemplateRef<any>;
  /**
   * Text to be shown as column header.
   */
  header?: string;
  /**
   * Property name of the field in the `value` input.
   */
  field?: string;
  /**
   * Property name of the fieldId in the `value` input.
   */
  fieldId?: string;
  /**
   * Whether the column can be filtered or not. Default: **true**.
   */
  filter?: boolean;
  /**
   * If set to 'true', the column will not be shown in the "view option" dropdown
   */
  hideSwitch?: boolean;
  /**
   * Whether the column is sortable or not. Default: **true**.
   */
  sortable?: string | boolean;

  sortFunction?: any;
  /**
   * Data type of the column (for filtering purposes). Allowed values: `text`, `number`, `date`, `boolean`.
   */
  type?: string;
  /**
   * Data type of the column (for Visibility).
   */
  show?: boolean;
  /**
   * Text to be shown as column title.
   */
  title?: string;
  /**
   * Whether the current column is non-editable or it is.
   */
  nonEditable?: boolean;
  /**
   * if a column is read only and yet required in form for validation
   */
  requiredInForm?: boolean;
  /**
   * Ellipsis apply for individual fields.
   */
  ellipsis?: boolean;
  /**
   * MaxLength apply for individual fields.
   */
  maxLength?: number;
  /**
   * The column contains required fields so it will show the asterisk.
   */
  required?: boolean;
  /**
   * Options to be shown in a drop-down instead of the quick search text-box.
   * Example:
   * ```
   * {text: 'Test text', value: 'val'}
   * ```
   */
  quickSearchOptions?: any[];
  /**
   * Extra information for edit fields.
   */
  editInfo?: {
    /**
     * Custom edit types. It has precedence over the column type.
     * Available types: 'checkbox' | 'radio' | 'select' | 'textarea'
     */
    type?: string;
    /**
     * Options to be shown in `checkbox`, `radio` and `select`.
     * Example:
     * ```
     * {text: 'Test text', value: 'val'}
     * ```
     */
    options?: any[];
    /**
     * Validators to be applied to the field.
     */
    validators?: any[];
    /**
     * Required to be applied to the field
     */
    required?: boolean;
    /**
     * Only applicable for 'select' type. If true, doesn't show the default selection title.
     */
    hideSelectionTitle?: boolean;
  };

  /**
   * Custom function used for sorting and filtering purposes to get a custom value based on the actual value in the list.
   */
  valueFunction?: any;

  compoundField?: string;

  fieldName?: any;

  colDisabled?: boolean;

  defaultSelectLabel?: string;
}
