import {AfterViewInit, Component, ElementRef, Host, Input, Optional, SkipSelf} from '@angular/core';
import {CheckGroupComponent} from '../check-group/check-group.component';
import {UtilsService} from '../../sncr-commons/utils.service';

/**
 * Component rendering a radio element.
 * It must be wrapped by {@link CheckGroupComponent}
 */
@Component({
  selector: 'sncr-radio',
  templateUrl: 'radio.component.html',
  styleUrls: ['../common/control-abstract.component.scss', 'sncr-radio.component.scss']
})
export class RadioComponent implements AfterViewInit {
  /**
   * The label of the field. In the majority of the components the label can be passed
   * as containing html of the component.
   * ``` html
   * <snrc-radio>
   *   <span>This is a label with a <a href="url">link</a></span>
   * </snrc-radio>
   * ```
   * If the component has the property `required` as true, an asterisk will be automatically added
   * at the end of the label.
   */
  @Input() label: string;

  /**
   * Value to be bind to the {@link CheckGroupComponent} model.
   */
  @Input() value: any;

  /**
   * Whether the radio is checked or not.
   * @returns {boolean}
   */
  @Input()
  get checked() {
    return this._checked;
  }

  set checked(value: any) {
    this._checked = UtilsService.toBoolean(value);
  }

  /**
   * Whether the radio is disabled or not.
   * @returns {boolean|null}
   */
  @Input()
  get disabled() {
    return this.checkGroupComponent.disabled || this.checkGroupComponent.readonly || this._disabled ||
      this.checkGroupComponent.ngControl.disabled || null;
  }

  set disabled(value: any) {
    this._disabled = UtilsService.toBoolean(value);
    this.switchDisable();
  }

  /**
   * **Read only** The name should be provided by the CheckGroupComponent.
   * @returns {string}
   */
  get name() {
    return this.checkGroupComponent.name;
  }

  /**
   * **Read only** The required validation should be provided by the CheckGroupComponent.
   * @returns {boolean}
   */
  get required() {
    return this.checkGroupComponent.required;
  }

  /**
   * @internal
   */
  get model() {
    return this.checkGroupComponent.model;
  }

  /**
   * @internal
   */
  set model(value: any) {
    this.checkGroupComponent.model = value;
  }

  /**
   * @internal
   */
  get inline() {
    return this.checkGroupComponent.inline;
  }

  private _checked: boolean;
  private _disabled: boolean;

  /**
   * @internal
   */
  constructor(@Optional() @Host() @SkipSelf() private checkGroupComponent: CheckGroupComponent, private el: ElementRef) {
    if (!checkGroupComponent) {
      throw Error('sncr-radio: this component must be used inside a sncr-check-group component');
    }

    if (el.nativeElement.attributes.getNamedItem('name')) {
      throw Error('sncr-radio: name attribute must be provided through sncr-check-group');
    }
  }

  ngAfterViewInit(): void {
    this.switchDisable();
  }

  isReadOnly() {
    return this.checkGroupComponent.readonly;
  }

  private switchDisable() {
    const input = this.el.nativeElement.querySelector('input');
    if (input) {
      input.disabled = this.disabled;
    }
  }
}
