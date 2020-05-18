import {ControlAbstractComponent} from '../common/control-abstract.component';
import {Component, forwardRef, Injector, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {UtilsService} from '../../sncr-commons/utils.service';

/**
 * Component rendering a select element.
 * It inherits all the properties from {@link ControlAbstractComponent}.
 */
@Component({
  selector: 'sncr-select',
  templateUrl: 'select.component.html',
  styleUrls: ['../common/control-abstract.component.scss', 'select-box.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent extends ControlAbstractComponent {
  /**
   * The number of visible options in the drop down.
   */
  @Input() size: number;

  /**
   * on lazy load edit do not show title
   */
  @Input() lazy: boolean;

  /**
   * Whether the select component allows multiple selection or not.
   * @returns {boolean|null}
   */
  @Input()
  get multiple() {
    return this._multiple || null;
  }

  set multiple(value) {
    this._multiple = UtilsService.toBoolean(value);
  }

  private _multiple = false;

  /**
   * @internal
   */
  constructor(injector: Injector) {
    super(injector);
  }
}