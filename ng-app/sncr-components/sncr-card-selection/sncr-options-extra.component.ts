import {
  Component,
  EventEmitter,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Option} from './option';
import {SncrPlannedChangesService} from '../sncr-planned-changes/sncr-planned-changes.service';
import {SncrCheckboxOptionsComponent} from './sncr-checkbox-options.component';
import {SncrRadioOptionsComponent} from './sncr-radio-options.component';
import {SncrOptionsAbstract} from './sncr-options-abstract';
import {UtilsService} from '../sncr-commons/utils.service';
import {PlannedChange} from '../sncr-planned-changes/planned-change';
import {SncrCardSelectionService} from './sncr-card-selection.service';
import {finalize} from 'rxjs/operators';
import {Language, TranslationService} from 'angular-l10n';
import {ManagementSocService} from '../../management-soc/management-soc.service';

@Component({
  selector: 'sncr-options-extra',
  templateUrl: 'sncr-options-extra.component.html',
  styleUrls: ['sncr-options-extra.component.scss']
})
export class SncrOptionsExtraComponent implements OnInit, OnDestroy, OnChanges {

  @Input() excluded: number;
  @Input() infoDesc: string;
  @Input() isCheckbox: boolean;
  @Input() option: Option;
  @Input() showDescription: boolean;
  @Input() masterOptions: boolean;
  @Input() triggerOption: boolean;
  @Input() properties: Map<any, any>;
  @Input() showValidation: boolean;
  @Input() isLazy = false;
  @Input() isChanged: boolean;
  @Input() lazyUrl = '';
  @Input() flowType: string;
  @Language() lang: string;
  @Input() infomsg: any;

  @ViewChild('masterSocRadio') masterSocRadio: SncrRadioOptionsComponent;
  @ViewChild('masterSocCheckBox') masterSocCheckBox: SncrCheckboxOptionsComponent;

  @Input()
  get showSelected(): boolean {
    return this._showSelected;
  }

  set showSelected(value: boolean) {
    this._showSelected = value;
  }

  @Input() totalLength: number;

  @Output() reset = new EventEmitter();

  isDescString: boolean;
  masterSocsList: Option[];
  isEligibilityApi = false;

  revertChangesLabel = 'Änderung verwerfen';

  private _showSelected: boolean;
  private optionComponent: SncrOptionsAbstract;
  private valueChangeSubscription: any;
  subsCountForLazy = 0;
  displayMaster = false;

  constructor(@Optional() @Host() checkboxOptions: SncrCheckboxOptionsComponent,
              @Optional() @Host() radioOptions: SncrRadioOptionsComponent,
              private plannedChangesService: SncrPlannedChangesService,
              private sncrCardSelectionService: SncrCardSelectionService,
              private translation: TranslationService,
              private manageService: ManagementSocService) {
              
    this.optionComponent = checkboxOptions || radioOptions;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isChanged']) {
      if (this.option && this.isLazy && this.lazyUrl) {
        let add = true;
        if (this.isCheckbox) {
          add = !(!this.option.model || this.option.model === 'D');
        } else {
          add = !(!this.option.value || this.option.value === 'none') && (this.option.subsCountForLazy > 0 || this.option.selected);
        }
        if (add && !this.option.bookedSoc) {
          this.eligibilityAPI();
          this.isEligibilityApi = true;
        }
      }
    }
  }

  ngOnInit(): void {
    if (this.option.subsCountForLazy) {
      this.subsCountForLazy = this.option.subsCountForLazy;
    }
    if (typeof this.option.description === 'string') {
      this.isDescString = true;
    }
    if (this.option.masterSocs) {
      this.populateMasterSocs(this.option.masterSocs);
    }

    if (this.option.mandatory || (this.showSelected)) {
      if (this.option.value !== 'none') {
        this.plannedChangesService.plannedChangeEmit({
          groupName: this.optionComponent.groupTitle || this.optionComponent.cardSelection.titleText,
          socs: [
            {
              isAddition: this.option.model ? this.option.model === 'A' : true,
              name: this.option.text,
              value: this.option.value,
              quantity: this.getLength(),
              price: this.option.charge && this.option.charge.amount,
              frequency: this.option.charge && this.option.charge.type,
              mandatory: this.option.mandatory,
              showPrice: this.option.mandatory || (this.option.model === 'A' || !this.isCheckbox),
              charge: this.option.charge,
              wifi: this.option.wifi
            }
          ]
        });
      } else {
        this.removeRadioOptionSocs();
      }
      if (this.showSelected && !this.option.mandatory) {
        this.subscriberToPlannedChanges();
      }
    } else {
      this.subscriberToPlannedChanges();
    }
  }

  private removeRadioOptionSocs() {
    const groupName = this.optionComponent.groupTitle || this.optionComponent.cardSelection.titleText;
    this.optionComponent.options.filter(o => o.value !== 'none' && o.length === 0).forEach(o => {
      let plannedChanges = this.plannedChangesService.getPlannedChanges();
      let group: PlannedChange = this.plannedChangesService.getPlannedChanges().find(c => c.groupName === groupName);
      if (group) {
        let existingSoc = group.socs.find(s => s.value === o.value);
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
    });
    const socs = this.optionComponent.options.filter(o => o.value !== 'none' && o.canOnly !== 'A' && o.length > 0).map(o => {
      return {
        isAddition: false,
        name: o.text,
        value: o.value,
        quantity: o.length,
        price: o.charge && o.charge.amount,
        frequency: o.charge && o.charge.type,
        showPrice: false,
        charge: this.option.charge
      };
    });

    this.plannedChangesService.plannedChangeEmit({
      groupName: groupName,
      socs: socs
    });
  }

  private subscriberToPlannedChanges() {
    this.valueChangeSubscription = this.optionComponent.valueChange.subscribe(value => {
      if (!this.isCheckbox || (UtilsService.notNull(value) && Object.keys(value).some(k => k === this.option.value))
          || (this.isCheckbox && !UtilsService.notNull(value))) {
        if (!this.isEligibilityApi && value !== 'none') {
          this.plannedChangesService.plannedChangeEmit({
            groupName: this.optionComponent.groupTitle || this.optionComponent.cardSelection.titleText,
            socs: [
              {
                isAddition: this.option.model === 'A' || this.option.model === true || !this.isCheckbox,
                name: this.option.text,
                value: this.option.value,
                quantity: (this.isCheckbox && this.showSelected && this.option.model !== undefined)
                || this.option.value === value ? this.getLength() : 0,
                price: this.option.charge && this.option.charge.amount,
                frequency: this.option.charge && this.option.charge.type,
                showPrice: this.option.model === 'A' || !this.isCheckbox,
                charge: this.option.charge,
                wifi: this.option.wifi
              }
            ]
          });
        } else {
          this.removeRadioOptionSocs();
        }
      }
    });

    this.plannedChangesService.socRemoveEvent.subscribe(soc => {
      if (soc === this.option.value) {
        this.optionComponent.reset(this.option);
        if (this.flowType === 'PROLONG' && !this.isCheckbox) {
          this.removeRadioOptionSocs();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.option.isTrigger) {
      this.plannedChangesService.plannedChangeEmit({
        groupName: this.optionComponent.groupTitle || this.optionComponent.cardSelection.titleText,
        socs: [
          {
            isAddition: false,
            name: this.option.text,
            value: this.option.value,
            quantity: 0
          }
        ]
      });
    }
    this.option.model = undefined;

    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  getLength() {
    if (this.isLazy) {
      return this.subsCountForLazy;
    }
    if (this.isCheckbox) {
      if (this.option.model === 'A' || this.option.model === true || this.option.mandatory) {
        return (this.option.wifi || this.option.subsidizedHWSoc) && !this.option.isTrigger ?
          this.totalLength - this.option.length - this.option.excluded - this.excluded :
          this.totalLength - this.option.length - this.excluded;
      } else {
        return this.option.length - this.excluded;
      }
    } else {
      if (this.option.value === 'none') {
        return this.option.length - this.excluded;
      } else {
        return (this.option.wifi || this.option.subsidizedHWSoc) && !this.option.isTrigger ?
          this.totalLength - this.option.length - this.option.excluded - this.excluded :
          this.totalLength - this.option.length - this.excluded;
      }
    }
  }

  isAddition() {
    return this.option.model === 'A'
      || (!this.isCheckbox && (this.option.value !== '' && this.option.value !== 'none'))
      || this.option.mandatory;
  }

  isMasterVisible() {
    let selectedSoc;
    if (UtilsService.notNull(this.option.isMasterSelected)) {
      if (this.option.isMasterSelected instanceof Object) {
        Object.keys(this.option.isMasterSelected).forEach(key => {
          selectedSoc = key;
        });
      } else {
        if (UtilsService.notNull(this.option.isMasterSelected)) {
          selectedSoc = this.option.isMasterSelected;
        }
      }
    }
    let subsSet = new Set<any>();
    this.displayMaster = false;
    const isVisible = this.option.masterSocs && !this.option.masterSocs.some(f => {
      let socValues = [];
      if (f.original) {
        if (UtilsService.notNull(f.original.isSelected)) {
          if (f.original.isSelected instanceof Object) {
            socValues = Object.keys(f.original.isSelected);
          } else {
            socValues.push(f.original.isSelected);
          }
        }
        f.original.socs.forEach(ins => {
          if (ins.mandatory || ins.length === this.totalLength) {
            socValues.push(ins.value);
          } else {
            const soc = this.manageService.socList ? this.manageService.socList.get(ins.value) : false;
            if (soc) {
              this.manageService.socList.get(ins.value).forEach(list => {
                subsSet.add(list.subscriberNo);
                if (subsSet.size === this.totalLength) {
                  this.displayMaster = true;
                }
              })
            }
          }
        });
      }
      if (this.displayMaster) {
        return this.displayMaster;
      }
      return socValues.some(socName => {
        return f.socs.map(s => s.value).includes(socName);
      }) || f.socs.some(s => {
        return this.plannedChangesService.getPlannedChanges().some(p => p.socs.some(ps => {
          return ps.value === s.value && selectedSoc !== ps.value;
        }));
      });
    });
    if (!isVisible && UtilsService.notNull(selectedSoc) && UtilsService.notNull(this.masterSocsList)) {
      let selectedMasterSoc = this.masterSocsList.find(m => selectedSoc === m.value);
      if (UtilsService.notNull(selectedMasterSoc)) {
        if (UtilsService.notNull(this.masterSocCheckBox)) {
          this.masterSocCheckBox.reset(selectedMasterSoc);
        } else if (UtilsService.notNull(this.masterSocRadio)) {
          this.masterSocRadio.reset(selectedMasterSoc);
        }

      }
    }
      /**
       * To hide Master div if master selected in other group - VVL flow
       */
    if (this.flowType === 'PROLONG' || this.flowType === 'ACTIVATE_SUBSCRIBER') {
      let isMasterVisible = true;
      if (UtilsService.notNull(this.option.isMasterSelected)) {
        let plannedCh = this.plannedChangesService.getPlannedChanges();
        plannedCh.forEach( (item, index) => {
          let socs = item.socs.filter( sc => sc.value === this.option.isMasterSelected);
          if (socs.length > 0) {
            isMasterVisible = item.groupName === 'Master Soc for ' + this.option.text;
          }
        });
        return isMasterVisible;
      }
    }
    return isVisible;
  }

  getMasterLength() {
    let maxLength = 0;
    if (this.option.masterSocs) {
      this.option.masterSocs.forEach(mf => {
        if (mf.original) {
          mf.original.socs.forEach(ms => {
            maxLength = Math.max(maxLength, ms.length);
          })
        }
      });
    }
    return this.getLength() - maxLength;
  }

  populateMasterSocs(masterSocs) {
    if (!UtilsService.notNull(this.masterSocsList)) {
      this.masterSocsList = [];
      masterSocs.forEach(mf => mf.socs.forEach(ms => {
        let option = new Option;
        Object.keys(ms).forEach(k => {
          option[k] = ms[k];
        });
        this.masterSocsList.push(option);
      }));
    }
    if (UtilsService.notNull(this.masterSocsList)) {
      this.masterSocsList.forEach(masterSoc => {
        if (masterSoc.subsCount > 0) {
          masterSoc['length'] = masterSoc.subsCount;
        }
      });
    }
  }

  getTodayLabel(cycle) {
    if (cycle === 'next' || cycle === 'nbc') {
      return 'Nächster Rechnungszyklus';
    }
    if (cycle === 'today') {
      if (this.isAddition() || !(this.option.duration > 0)) {
        if (this.properties.get('server.time')) {
          return 'Morgen';
        } else {
          return 'Heute';
        }
      } else {
        return 'zum nächstmöglichen Zeitpunkt';
      }
    } else {
      return 'Nächstmöglicher Zeitpunkt';
    }

  }

  getMinDate() {
    let date = new Date();
    let lastDay = new Date(date.getUTCFullYear(), date.getMonth() + 1, 0).getDate();
    let day = date.getUTCDate() + 1;
    let month = day > lastDay ? date.getUTCMonth() + 2 : date.getUTCMonth() + 1;
    return {
      day: day > lastDay ? 1 : day,
      month: month > 12 ? 1 : month,
      year: month > 12 ? date.getUTCFullYear() + 1 : date.getUTCFullYear()
    };
  }


  closeClicked() {
    if (this.flowType === 'PROLONG' && !this.isCheckbox) {
      this.removeRadioOptionSocs();
    }
    this.reset.emit(this.option);
  }


  getRequestObjectForLazy() {
    const requestObj: any = {};
    requestObj.socId = this.option.value;
    return requestObj;
  }


  eligibilityAPI() {
    const requestObj = this.getRequestObjectForLazy();

    if (!this.option.disabled) {
      this.option.canOnly = 'A';
      this.sncrCardSelectionService.getEligibilityCount(requestObj, this.lazyUrl)
        .pipe(finalize(() => {
          this.option.disabled = this.subsCountForLazy <= 0;
          if (this.option.disabled && this.option.length !== this.totalLength) {
            this.closeClicked();
          }
          if (this.option.masterSocs) {
            this.populateMasterSocs(this.option.masterSocs);
          }
        }))
        .subscribe(res => {
          this.subsCountForLazy = res.length;
          this.option.length = res.excluded;
          if (res.trigger && !this.option.trigger) {
            this.option.trigger = res.trigger;
            this.option.trigger.show = true;
          }
          if (res.masterFamilyList) {
            this.option.masterSocs = res.masterFamilyList;
          }
          if (this.subsCountForLazy > 0) {
            if (!this.isCheckbox) {
              this.removeRadioOptionSocs();
            }

            this.plannedChangesService.plannedChangeEmit({
              groupName: this.optionComponent.groupTitle || this.optionComponent.cardSelection.titleText,
              socs: [
                {
                  isAddition: this.option.model === 'A' || this.option.model === true || !this.isCheckbox,
                  name: this.option.text,
                  value: this.option.value,
                  quantity: this.subsCountForLazy,
                  price: this.option.charge && this.option.charge.amount,
                  frequency: this.option.charge && this.option.charge.type,
                  showPrice: this.option.model === 'A' || !this.isCheckbox,
                  charge: this.option.charge,
                  wifi: this.option.wifi
                }
              ]
            });
            this.isEligibilityApi = false;
          }
        });
    }

  }

  getInfoKey(length: number) {
    return length === 1 ? 'SOC_SELECTION-SINGLE_SUBSCRIBER_ELIGIBLE' : 'SOC_SELECTION-MULTI_SUBSCRIBERS_ELIGIBLE';
  }

  getOptionDuration(option: any) {
    if (option.duration > 0) {
      return option.duration + ' ' + this.translation.translate('SOC_SELECTION-MONTHS');
    } else {
      return '';
    }
  }

  getChargeType(option) {
    if (option.charge.type === 'Monatlicher Basispreis') {
      return this.translation.translate('SOC_SELECTION-BUNDLE_TYPE');
    } else if (option.charge.type === 'Einrichtungspreis') {
      return this.translation.translate('SOC_SELECTION-SETUP_FEE');
    } else {
      return option.charge.type;
    }
  }
}
