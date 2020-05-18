import {
  AfterContentInit,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {SncrRadioOptionsComponent} from './sncr-radio-options.component';
import {SncrCardSelectionParent} from './sncr-card-selection-parent';
import {SncrCheckboxOptionsComponent} from './sncr-checkbox-options.component';
import {SncrOptionsAbstract} from './sncr-options-abstract';

@Component({
  selector: 'sncr-card-selection',
  templateUrl: 'sncr-card-selection.component.html',
  styleUrls: ['sncr-card-selection.component.scss'],
  exportAs: 'sncrCardSelection',
  providers: [
    {provide: SncrCardSelectionParent, useExisting: forwardRef(() => SncrCardSelectionComponent)}
  ]
})
export class SncrCardSelectionComponent implements OnChanges, AfterContentInit {
  @ContentChildren(SncrRadioOptionsComponent) radioOptions: QueryList<SncrRadioOptionsComponent>;
  @ContentChildren(SncrCheckboxOptionsComponent) checkboxOptions: QueryList<SncrCheckboxOptionsComponent>;

  @Input() titleText: string;
  @Input() showText: string;
  @Input() hideText: string;
  @Input() filter: string;
  @Input() hasDescriptions = true;
  @Input() icon: string;
  @Input() showDescriptions = false;
  @Input() properties: Map<any, any>;

  visible = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && changes['filter'].previousValue !== changes['filter'].currentValue) {
      this.checkVisible();
    }
  }

  ngAfterContentInit(): void {
    this.checkVisible();
  }

  getDescriptionText() {
    return this.showDescriptions ? this.hideText : this.showText;
  }

  private checkVisible() {
    if (this.filter && this.filter.length && this.radioOptions) {
      let lowFilter = this.filter.toLowerCase();

      this.visible = this.titleText.toLowerCase().includes(lowFilter) ||
        this.radioOptions.some(rd => this.includesFilter(lowFilter, rd)) ||
        this.checkboxOptions.some(cb => this.includesFilter(lowFilter, cb));
    } else {
      this.visible = true;
    }
  }

  private includesFilter(filter: string, optGroup: SncrOptionsAbstract): boolean {
    return optGroup.options.some(option => {
      let lowText = option.text.toLowerCase();
      let lowDesc = option.description && typeof option.description === 'string' ?
        option.description.toString().toLowerCase() : '';

      return lowText.includes(filter) || lowDesc.includes(filter);
    });
  }
}