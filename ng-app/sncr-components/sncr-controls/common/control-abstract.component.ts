import {ElementRef, EventEmitter, Injector, Input, OnInit, Output, Renderer2} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NgControl, NgForm} from '@angular/forms';
import {ValidationMessagesService} from '../validation-messages/sncr-validation-messages.service';
import {UtilsService} from '../../sncr-commons/utils.service';

const noop = () => {
};
const defaultName = 'sncr-field-';
let fieldId = 1;

/**
 * Base abstract component to be inherited from actual components, giving them common behaviours.
 *
 * These are the components implementing this behaviours:
 * - {@link CheckGroupComponent}
 * - {@link SncrCheckboxComponent}
 * - {@link DatepickerComponent}
 * - {@link InputComponent}
 * - {@link SelectComponent}
 * - {@link TextareaComponent}
 *
 * Any directives compatible with ngModel should work fine here too.
 */
export abstract class ControlAbstractComponent implements ControlValueAccessor, OnInit {
  /**
   * The label of the field. In the majority of the components the label can be passed
   * as containing html of the component.
   * ``` html
   * <snrc-component>
   *   <span>This is a label with a <a href="url">link</a></span>
   * </snrc-component>
   * ```
   * If the component has the property `required` as true, an asterisk will be automatically added
   * at the end of the label.
   */
  @Input() label: string;

  /**
   * The name of the field. If not specified a name will be automatically generated with the prefix
   * `sncr-field-` and a secuential number. I.E. `sncr-field-1`
   */
  @Input() name: string;

  /**
   * Enforces to show the validation of the field if contains any errors.
   * The default validation messages are shown under these conditions:
   * - **Inside a form**: the validation messages will be shown only after submitting the form.
   * - **Outside a form**: the validation messages will be shown on blur event (after losing focus).
   */
  @Input() showValidation: boolean;

  /**
   * Shows a reset button on the right of the input.
   */
  @Input() showReset: boolean;

  /**
   * Whether the field should be validated as required or not.
   * @returns {boolean}
   */
  @Input()
  get required() {
    if (this._requiredAttr) {
      return true;
    } else if (this.ngControl.control && this.ngControl.control.validator) {
      const validator = this.ngControl.control.validator({} as AbstractControl);
      return validator && validator.required;
    }
    return false;
  }

  set required(value) {
    this._requiredAttr = UtilsService.toBoolean(value);
  }

  /**
   * Whether the field should be disabled or not.
   * @returns {boolean}
   */
  @Input()
  get disabled() {
    return this._disabledAttr || this.ngControl.disabled;
  }

  set disabled(value) {
    this._disabledAttr = UtilsService.toBoolean(value);
  }

  /**
   * Whether the field should be read only or not.
   * @returns {boolean}
   */
  @Input()
  get readonly() {
    return this._readonlyAttr;
  }

  set readonly(value) {
    this._readonlyAttr = UtilsService.toBoolean(value);
  }

  private blurred = false;
  /**
   * @internal
   */
  ngControl: NgControl;

  /**
   * @internal
   */
  private validationMessagesService: ValidationMessagesService;
  private _requiredAttr: boolean;
  private _disabledAttr: boolean;
  private _readonlyAttr: boolean;
  private _renderer: Renderer2;
  private _elementRef: ElementRef;
  private ngForm: NgForm;

  // The internal data model
  private innerValue: any = '';

  /**
   *  Placeholders for the callbacks which are later provided
   *    by the Control Value Accessor
   * @internal
   */
  protected onTouchedCallback: () => void = noop;
  /**
   * @internal
   */
  protected onChangeCallback: (_: any) => void = noop;

  /**
   * datepicker calendar is reset.
   */
  @Output() onReset = new EventEmitter<boolean>();

  /**
   * @internal
   */
  constructor(private injector: Injector) {
    // Injections done here to avoid classes inheriting to inject same services
    this.validationMessagesService = this.injector.get(ValidationMessagesService);
    this._renderer = this.injector.get(Renderer2);
    this._elementRef = this.injector.get(ElementRef);
  }

  ngOnInit() {
    // Needed to be injected here to avoid Circular DI Exception
    this.ngControl = this.injector.get(NgControl, {});

    if (this.ngControl['formDirective']) {
      this.ngForm = this.ngControl['formDirective'];

      // Required to fire validations after submit
      this.ngForm.ngSubmit.subscribe(() => this.onChangeCallback(this.model));
    }

    if (!this.name) {
      this.name = `${defaultName}${fieldId++}`;
    }
  }

  /**
   * get accessor
   * @internal
   */
  get model(): any {
    return this.innerValue;
  };

  /**
   * set accessor including call the onchange callback
   * @internal
   */
  set model(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  /**
   * Set touched on blur
   * @internal
   */
  onBlur() {
    this.blurred = true;
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    const el = this._elementRef.nativeElement.querySelector('input,select,textarea');
    if (el) {
      this._renderer.setProperty(el, 'disabled', isDisabled);
    }
  }

  /**
   * @internal
   */
  hasErrors() {
    return this.validationMessagesService.hasErrors(this.ngControl, {
      ngForm: this.ngForm, blurred: this.blurred, force: this.showValidation
    });
  }

  /**
   * @internal
   */
  protected getErrors() {
    return this.validationMessagesService.getErrors(this.ngControl, {
      ngForm: this.ngForm, blurred: this.blurred, force: this.showValidation
    });
  }

  /**
   * @internal
   */
  showAsterisk(el: any): boolean {
    return this.required && (!!this.label || (el && el.childNodes.length !== 0));
  }

  /**
   * Resets the control component.
   */
  protected resetValue() {
    this.ngControl.control.reset(null, {onlySelf: false, emitEvent: true});
    this.onReset.emit(true);
  }

  /**
   * @internal
   */
  isResetVisible() {
    return this.showReset && UtilsService.notNull(this.model) && this.model !== '';
  }
}
