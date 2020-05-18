import {Component, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {SncrOptionsAbstract} from './sncr-options-abstract';
import {Option} from './option';
import {SncrCheckboxComponent} from '../sncr-controls/checkbox/sncr-checkbox.component';
import {SncrCardSelectionParent} from './sncr-card-selection-parent';
import {UtilsService} from '../sncr-commons/utils.service';
import {PlannedChange} from '../sncr-planned-changes/planned-change';
import {SncrPlannedChangesService} from '../sncr-planned-changes/sncr-planned-changes.service';
import {SncrCardSelectionComponent} from './sncr-card-selection.component';

@Component({
  selector: 'sncr-checkbox-options',
  templateUrl: 'sncr-checkbox-options.component.html',
  styleUrls: ['sncr-options-abstract.scss', 'sncr-checkbox-options.component.scss']
})
export class SncrCheckboxOptionsComponent extends SncrOptionsAbstract implements OnInit {

  @ViewChildren(SncrCheckboxComponent) checkboxes: QueryList<SncrCheckboxComponent>;

  @Input() showValidation: boolean;
  @Input() isLazy = false;
  @Input() lazyUrl = '';
  @Input() flowType = 'DEFAULT';
  @Output() changeOption = new EventEmitter();

  onInitOnly = true;
  isChanged: boolean;

  constructor(injector: Injector, private plannedChangesService: SncrPlannedChangesService) {
    super();
    this.cardSelection = injector.get(SncrCardSelectionParent) as SncrCardSelectionComponent;
  }


  ngOnInit() {
    super.ngOnInit();
    if (this.onInitOnly && this.options.filter(o => o.defaultSection === o.value || o.mandatory)
      && this.options.filter(o => o.defaultSection === o.value || o.mandatory).length === 1) {
      this.options.filter(o => o.defaultSection === o.value || o.mandatory).forEach(o => {
        o.defaultSection = null;
        this.populateBillCycles(o, true);
      });
      this.onInitOnly = false;
    }

    if (this.value !== undefined && typeof this.value !== 'object') {
      console.warn('sncr-checkbox-options: [value] needs to be an object!');
      this.value = {};
    }
  }

  // gets executed after value change
  checkChange(option: Option, value: any) {
    this.isChanged = !this.isChanged;
    if (option.model === undefined) {
      if (this.totalLength > option.length && option.canOnly !== 'D') {
        this.activate(option);
      } else if (option.canOnly !== 'A') {
        this.deactivate(option);
      }
    } else if (option.model === 'A') {
      if (option.length > 0 && option.canOnly !== 'A') {
        this.deactivate(option);
      } else {
        this.reset(option);
      }
    } else {
      this.reset(option);
    }
    this.changeOption.emit(option);
    this.propagateChange(option);
  }

  reset(option: Option) {
    delete option.model;
    delete option.cssClass;
    this.propagateChange(option);
    this.removeMasterSection(option);
    this.changeOption.emit(option);
  }

  private activate(option: Option) {
    option.model = 'A';
    option.cssClass = 'plus';
  }

  private deactivate(option: Option) {
    option.model = 'D';
    option.cssClass = 'minus';
    this.removeMasterSection(option);
  }

  private propagateChange(option: Option) {
    setTimeout(() => {
      this.populateBillCycles(option, true);
      let checkbox = this.checkboxes.find(c => c.name === option.value);
      checkbox.onChange();
    });
  }

  private removeMasterSection(option) {
    if (UtilsService.notNull(option.isMasterSelected)) {
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
}
