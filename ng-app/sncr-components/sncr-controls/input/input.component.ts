import {ControlAbstractComponent} from '../common/control-abstract.component';
import {Component, ElementRef, forwardRef, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../../sncr-commons/utils.service';
import {TextFilterPipe} from '../../sncr-pipes/text-filter.pipe';

const NOT_SUPPORTED_TYPES = ['file', 'radio', 'checkbox'];

/**
 * Component rendering an input type element.
 * It inherits all the properties from {@link ControlAbstractComponent}.
 */
@Component({
  selector: 'sncr-input',
  templateUrl: 'input.component.html',
  styleUrls: ['../common/control-abstract.component.scss', 'input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent extends ControlAbstractComponent implements OnInit {

  @ViewChild('dropDown') dropDown: NgbDropdown;
  @ViewChild('dropDownMenu') dropDownMenu: ElementRef;

  /**
   * Placeholder for the text box when no value is set.
   */
  @Input() placeholder: string;
  /**
   * The type of the input. If not provided `text` will be used.
   * The following types aren't supported by this component: file, radio, checkbox.
   */
  @Input() type: string;
  /**
   * The max length of the field, default value is unlimited.
   */
  @Input() maxLength: string;
  /**
   * The pattern of the field.
   */
  @Input() pattern: string;
  /**
   * List of values to be shown in a dropdown below the input while the user is typing.
   */
  @Input() withDropDown: any[];
  /**
   * auto complete attribute on input
   * Off makes not to show the suggestions
   */
  @Input() autocomplete = 'off';
  /**
   * on makes to display the info icon
   * Off makes to display the info icon
   */
  @Input() infoIcon: string;

  /**
   * on lazy load edit do not show title
   */
  @Input() lazy: boolean;

  /**
   * async validation in progress
   */
  @Input() asyncValidationInPorgress = false;

  /**
   * Filtered list of values to be shown in a dropdown below the input while the user is typing.
   */
  filteredDropDown: any[];

  /**
   * @internal
   */
  constructor(private textFilterPipe: TextFilterPipe, injector: Injector) {
    super(injector);
  }

  /**
   * @internal
   */
  ngOnInit() {
    super.ngOnInit();
    if (!this.type) {
      this.type = 'text';
    } else if (NOT_SUPPORTED_TYPES.includes(this.type)) {
      throw new Error(`The following types are not supported through sncr-input: ${NOT_SUPPORTED_TYPES.join(', ')}`);
    }

    this.filteredDropDown = this.withDropDown;
  }

  /**
   * @internal
   */
  onKeyDown(event) {
    if (this.type === 'number' || this.type === 'price') {
      let e = <KeyboardEvent> event;
      if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A/Ctrl+C/Ctrl+V/Ctrl+X
        ([65, 67, 86, 88].indexOf(e.keyCode) !== -1 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return true;
      }
      // allow comma and period if input type = price
      if (this.type === 'price' && [188, 190].indexOf(e.keyCode) !== -1) {
        return true;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
        return false;
      }
      if (UtilsService.notNull(this.maxLength) && this.maxLength <= event.target.value.length) {
        return false;
      }
    }
  }

  onBeforePaste(event) {
    if (this.type === 'number') {
      event.preventDefault();
      let clipboardData = event['clipboardData'] || window['clipboardData'];
      this.model = Number.parseInt(clipboardData.getData('Text').replace(/\D/g, ''));
    }
  }

  inputClick() {
    if (this.dropDownMenu && this.withDropDown && this.dropDown.isOpen()) {
      this.dropDownMenu.nativeElement.scrollTop = 0;
    }
  }

  // If dropdown data is provided show the dropdown 
  onFocus() {
    if (this.withDropDown) {
      this.dropDown.open();
    }
  }

  updateFilteredDropDown () {
    if (this.withDropDown) {
      if (this.model) {
        this.filteredDropDown = this.textFilterPipe.transform(this.withDropDown, this.model);
      } else {
        this.filteredDropDown = this.withDropDown;
      }
    }
  }
}
