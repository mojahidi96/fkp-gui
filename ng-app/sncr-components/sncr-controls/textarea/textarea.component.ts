import {Component, forwardRef, Injector, Input} from '@angular/core';
import {ControlAbstractComponent} from '../common/control-abstract.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {UtilsService} from '../../sncr-commons/utils.service';

/**
 * Component rendering a textarea element.
 * It inherits all the properties from {@link ControlAbstractComponent}.
 */
@Component({
  selector: 'sncr-textarea',
  templateUrl: 'textarea.component.html',
  styleUrls: ['../common/control-abstract.component.scss', 'textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ]
})
export class TextareaComponent extends ControlAbstractComponent {
  /**
   * Number of columns for the element.
   */
  @Input() cols = 10;

  /**
   * Maximum length of the text inside.
   */
  @Input() maxlength: number;

  /**
   * Placeholder when no text is provided.
   */
  @Input() placeholder: string;

  /**
   * Number or rows for the element.
   */
  @Input() rows = 2;

  /**
   * By default the textarea will show how many characters are left to reach the maximum length (if provided).
   * This input sets whether to disable this counter or not.
   * @returns {boolean}
   */
  @Input()
  get disableCounter() {
    return this._disableCounter;
  }

  set disableCounter(value) {
    this._disableCounter = UtilsService.toBoolean(value);
  }

  private _disableCounter: boolean;

  /**
   * @internal
   */
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * @internal
   */
  getRemaining() {
    return this.model && !isNaN(this.maxlength) ? this.maxlength - this.model.length : this.maxlength;
  }
}