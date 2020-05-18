import {Component, ElementRef, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {SncrOptionsAbstract} from './sncr-options-abstract';
import {SncrCardSelectionParent} from './sncr-card-selection-parent';
import {UtilsService} from '../sncr-commons/utils.service';
import {Option} from './option';
import {SncrPlannedChangesService} from '../sncr-planned-changes/sncr-planned-changes.service';
import {PlannedChange} from '../sncr-planned-changes/planned-change';
import {SncrCardSelectionComponent} from './sncr-card-selection.component';

@Component({
  selector: 'sncr-radio-options',
  templateUrl: 'sncr-radio-options.component.html',
  styleUrls: ['sncr-options-abstract.scss']
})
export class SncrRadioOptionsComponent extends SncrOptionsAbstract implements OnChanges {

  @Input() showValidation: boolean;
  @Input() mandatory: boolean;
  @Input() eligibleOptions = true;
  @Input() isLazy = false;
  @Input() lazyUrl = '';
  @Input() flowType = 'DEFAULT';
  @Output() changeRadio = new EventEmitter();
  @Input() infomsg: any;

  originalValue: any;
  userChange: boolean;
  isChanged: boolean;

  constructor(injector: Injector, private plannedChangesService: SncrPlannedChangesService, public  element: ElementRef) {
    super();
    this.cardSelection = injector.get(SncrCardSelectionParent) as SncrCardSelectionComponent;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalLength'] || changes['options']) {
        if (this.flowType === 'PROLONG' && this.isLazy
            && UtilsService.notNull(changes['options'].currentValue
            && changes['options'].currentValue.length)) {
          changes.options.currentValue.forEach( item => {
            if (item.selected) {
              item.selected = false;
            }
          });
        }
      const defaultSection = this.options.find(o => (o.defaultSection === o.value));
      let defaultSelected = this.options.find(o => (o.length === this.totalLength && this.totalLength !== 0 && o.value !== 'none'));
      if (UtilsService.notNull(defaultSection)) {
        defaultSelected = defaultSection;
      }

      if (!this.userChange || this.value === undefined || this.value === null) {
        if (defaultSelected) {
          setTimeout(() => {
            this.originalValue = defaultSelected.value;
            this.value = defaultSelected.value;
            if (defaultSection) {
              if (defaultSelected.value === defaultSection.defaultSection) {
                this.originalValue = null;
              }
              this.value = defaultSection.defaultSection;
              defaultSection.defaultSection = null;
            }

          });
        } else {
          setTimeout(() => {
            this.originalValue = null;
            this.value = null;
          });
        }
      } else if (defaultSelected) {
        setTimeout(() => this.originalValue = defaultSelected.value);
      } else {
        setTimeout(() => this.originalValue = null);
      }
    }
    if (changes['value']) {
      if (UtilsService.notNull(changes['value']['currentValue'])) {
        let option = this.options.find(o => (o.value === changes['value']['currentValue']));
        this.populateBillCycles(option, false);
      }
      if (UtilsService.notNull(changes['value']['previousValue'])) {
        let option = this.options.find(o => (o.value === changes['value']['previousValue']));
        if (UtilsService.notNull(option) && option.isMasterSelected) {
          let selectedSoc = option.isMasterSelected;
          if (option.isMasterSelected instanceof Object) {
            Object.keys(option.isMasterSelected).forEach(k => {
              selectedSoc = k;
            });
          }
          let groupName = 'Master Soc for ' + option.text;
          let plannedChanges = this.plannedChangesService.getPlannedChanges();
          let group: PlannedChange = this.plannedChangesService.getPlannedChanges().find(c => c.groupName === groupName);
          if (group) {
            let existingSoc = group.socs.find(s => s.value === selectedSoc);
            if (existingSoc) {
              if (group.socs.length > 1) {
                const i = group.socs.indexOf(existingSoc);
                group.socs.splice(i, 1);
              } else {
                const i = plannedChanges.indexOf(group);
                plannedChanges.splice(i, 1);
              }
            }
          }
        }
      }
      if (this.flowType === 'PROLONG') {
        this.eligibleOptions = this.options.some(o => o.disabled === false);
      }
    }
  }

  reset(option: Option) {
    if (this.element.nativeElement.querySelector('.selected')) {
      this.scrollInstance(this.element.nativeElement.querySelector('.selected').parentNode.parentNode.parentNode.parentNode);
    }
    this.value = this.originalValue;
    this.changeRadio.emit(option);
  }

  userClick(option: Option, event) {
    this.isChanged = !this.isChanged;
    this.options.forEach(eachOpt => eachOpt.selected = false);
    this.scrollInstance(event.currentTarget);
    this.userChange = option.value !== this.originalValue;
    option.selected = true;
    this.changeRadio.emit(option);
  }

  scrollInstance(event) {
    setTimeout(() => {
      if (event) {
        if (!this.isScrolledIntoView(event)) {
          event.scrollIntoView();
        }
      }
    }, 50);
  }

  isScrolledIntoView(el) {
    const elemTop = el.getBoundingClientRect().top;
    const elemBottom = el.getBoundingClientRect().bottom;

    return (elemTop >= 0) && (elemBottom <= window.innerHeight);
  }
}
