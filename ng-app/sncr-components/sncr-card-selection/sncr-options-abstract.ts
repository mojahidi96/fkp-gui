import {Option} from './option';
import {EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SncrCardSelectionComponent} from './sncr-card-selection.component';
import {UtilsService} from '../sncr-commons/utils.service';

export abstract class SncrOptionsAbstract implements OnInit {

  @Input() options: Option[];
  @Input() infoDesc: string;
  @Input() showDescription: boolean;
  @Input() totalLength: number;
  @Input() excluded: number;
  @Input() masterOptions: boolean;
  @Input() triggerOption: boolean;
  @Input() showAllOptions = true;
  @Input() groupTitle: string;
  @Input() properties: Map<any, any>;

  @Input()
  get value() {
    return this._value;
  }

  @Output() valueChange = new EventEmitter();

  set value(value: any) {
    this._value = value;
    this.valueChange.emit(value);
  }

  public cardSelection: SncrCardSelectionComponent;

  private _value: any;

  ngOnInit(): void {
    if (!this.excluded) {
      this.excluded = 0;
    }

    this.options.forEach(o => {
      o.show = true;
      if (o.length === undefined) {
        o.length = 0;
      }
    });
  }

  abstract reset(option?: Option);

  populateBillCycles(option: Option, isCheckbox: boolean) {
    setTimeout(() => {
      if (UtilsService.notNull(option) && option.charge) {
        if (!this.isAddition(option, isCheckbox)) {
          option.charge.selected = option.charge.selected && (option.charge.selected !== 'custom' || option.duration === 0)
            ? option.charge.selected : option.duration > 0 && this.properties.get('duration.override') ? 'next' : 'today';
          option.charge.billingCycles = option.duration > 0 ? this.properties.get('duration.override')
            ? ['next', 'today'] : ['today'] : ['today', 'next', 'custom'];
        } else {
          option.charge.selected = option.charge.selected ? option.charge.selected : 'today';
          option.charge.billingCycles = this.properties.get('activation.order') ? ['today'] : ['today', 'next', 'custom'];
        }
        let date = new Date();
        let lastDay = new Date(date.getUTCFullYear(), date.getMonth() + 1, 0).getDate();
        let day = date.getUTCDate() + 1;
        let month = day > lastDay ? date.getUTCMonth() + 2 : date.getUTCMonth() + 1;
        option.charge.date = option.charge.selected === 'custom' && option.charge.date ? option.charge.date : {
          day: day > lastDay ? 1 : day,
          month: month > 12 ? 1 : month,
          year: month > 12 ? date.getUTCFullYear() + 1 : date.getUTCFullYear()
        };
      }
    });
  }

  isAddition(option: Option, isCheckbox: boolean) {
    return option.model === 'A'
      || (!isCheckbox && (option.value !== '' && option.value !== 'none'))
      || option.mandatory;
  }
}
