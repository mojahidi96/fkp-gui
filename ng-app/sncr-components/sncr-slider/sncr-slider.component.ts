import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'sncr-slider',
  templateUrl: 'sncr-slider.component.html',
  styleUrls: ['sncr-slider.component.scss']
})
export class SncrSliderComponent implements OnInit, OnChanges {
  @Input() value: any[];
  @Input() rangeMin: number;
  @Input() rangeMax: number;
  @Input() step = 1;

  @Output() change = new EventEmitter();
  @Output() valueChange = new EventEmitter();

  // Unfortunately this toggle is needed to destroy and rerender the component
  // in case the value input array has been changed.
  // This is currently mainly used for testing the component in Storybook
  // via Cypress.
  forceRerenderToggle = true;

  private config;

  constructor(
    private currencyPipe: CurrencyPipe,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.config = {
      connect: true,
      step: this.step,
      tooltips: true,
      format: {
        to: value => this.applyFormat(value),
        from: this.originalFormat
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    const valueChanged =
      changes.value &&
      !changes.value.isFirstChange() &&
      JSON.stringify(changes.value.currentValue) !==
        JSON.stringify(changes.value.previousValue);
    const stepChanged =
      changes.step &&
      !changes.step.isFirstChange() &&
      changes.step.currentValue !== changes.step.previousValue;

    if (valueChanged || stepChanged) {
      this.config.step = this.step;
      this.forceRerenderToggle = false;

      setTimeout(() => {
        this.forceRerenderToggle = true;
        this.cdr.detectChanges();
      });
    }
  }

  private applyFormat(value) {
    return this.currencyPipe.transform(value, 'EUR', 'symbol', '1.0-0');
  }

  private originalFormat(value) {
    return value.replace(/[\s\.€]/g, '');
  }
}
