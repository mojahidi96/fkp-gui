import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ControlAbstractComponent} from '../common/control-abstract.component';
import {NgbDateParserFormatter, NgbDatepickerI18n, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {DatepickerParserService} from './datepicker-parser.service';
import {CustomDatepickerI18n, I18n} from './CustomDatepickerI18n';
import {Subscription} from 'rxjs';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';

/**
 * Component rendering a text box showing a datepicker.
 * It inherits all the properties from {@link ControlAbstractComponent}.
 */
@Component({
  selector: 'sncr-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['../common/control-abstract.component.scss', 'datepicker.component.scss'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    },
    {provide: NgbDateParserFormatter, useClass: DatepickerParserService}
  ]
})
export class DatepickerComponent extends ControlAbstractComponent implements AfterViewInit, OnDestroy {
  /**
   * Minimum date that can be selected in the datepicker.
   */
  @Input() minDate: Date;
  /**
   * Maximum date that can be selected in the datepicker.
   */
  @Input() maxDate: Date;
  /**
   * Placeholder for the text box when no value is set.
   */
  @Input() placeholder: string;

  /**
   * auto complete attribute on input
   * Off makes not to show the suggestions
   */
  @Input() autocomplete = 'off';

  /**
   * Whether the datepicker calendar is opened or not.
   */
  @Output() datepickerOpened = new EventEmitter<boolean>();

  @ViewChild('inputGroup') private inputGroup: ElementRef;
  @ViewChild('d') datePicker: NgbInputDatepicker;

  private subscriptions$: Subscription [] = [];

  private scroll$: Subscription;

  @HostListener('click', ['$event'])
  onClick(event) {
    event.preventDefault();

    if (!this.datePicker.isOpen()) {
      this.removeClickListener();
    }
  }

  /**
   * @internal
   */
  constructor(injector: Injector, private datepickerParser: DatepickerParserService) {
    super(injector);
  }

  /**
   * @internal
   */
  ngAfterViewInit(): void {
    super.ngOnInit();

    this.ngControl.valueChanges.subscribe(val => {
      const value = this.datepickerParser.parse(val);
      this.model = value || this.model;
    });
  }

  ngOnDestroy(): void {
    this.removeClickListener();
    if (this.scroll$) {
      this.scroll$.unsubscribe();
    }
  }

  /**
   * @internal
   */
  onKeydown() {
    return false;
  }

  toggleDatepicker() {

    this.datePicker.toggle();
    this.datepickerOpened.emit(this.datePicker.isOpen());

    if (this.datePicker.isOpen()) {
      this.subscriptions$.push(fromEvent(document, 'click')
        .subscribe((e: Event) => this.offClickHandler(e)));
      const tableWrapper = document.querySelector('.ui-datatable-tablewrapper');
      this.scroll$ = fromEvent(tableWrapper, 'scroll')
        .subscribe(this.onParentScrollHandler(this));
    } else {
      this.removeClickListener();
    }
  }

  private offClickHandler(event: Event) {
    if (!this.inputGroup.nativeElement.contains(event.target)) {
      this.datePicker.close();
      this.datepickerOpened.emit(false);
      this.removeClickListener();
    }
  }

  private removeClickListener() {
    this.subscriptions$.forEach(s => s.unsubscribe());
  }

  private onParentScrollHandler(component: DatepickerComponent) {
    return () => {
      if (component.datePicker.isOpen()) {
        component.datePicker.close();
      }
    };
  }
}
