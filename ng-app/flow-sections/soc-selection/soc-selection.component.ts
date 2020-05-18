import {Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {CONSTANTS} from '../../soc-management/constants';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {AvailableSocs, Soc, SocFamily} from '../../management-soc/classes/dtos/available-socs';
import {SncrPlannedChangesService} from '../../sncr-components/sncr-planned-changes/sncr-planned-changes.service';
import {SocSelectionService} from './soc-selection.service';
import {Language} from 'angular-l10n';
import {Subscription} from 'rxjs';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {isObject} from 'util';
import {finalize} from 'rxjs/operators';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'soc-selection',
  templateUrl: 'soc-selection.component.html',
  styleUrls: ['soc-selection.component.scss']
})
export class SocSelectionComponent implements OnChanges, OnInit, OnDestroy {

  constants: CONSTANTS;
  properties: Map<any, any>;

  @Input() showValidation: boolean;
  @Input() subscribers: any[] = [];
  @Input() isChanged: boolean;
  @Input() prefilledSocs: any;
  @Input() orderType: string;
  @Input() flowType: string;
  @Input() selectedSubs?: any;
  @Input() continueLabel: any;
  @Input() eligibleSubsHardware: any;
  @Output() review = new EventEmitter();

  @Language() lang: string;

  allavailableSocs: AvailableSocs;
  selectedCategory: string;


  subscriptions: Subscription[] = [];
  alert: NotificationHandlerService;
  subscribersCount = 0;
  processing = false;
  lazyUrl = '/buyflow/rest/socs/eligible';
  disableOnceClicked = false;
  textFilter = '';

  constructor(private socSelectionService: SocSelectionService,
              public sncrPlannedChangesService: SncrPlannedChangesService,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory) {
    this.constants = new CONSTANTS;
    this.properties = this.constants.getProperties();
  }

  ngOnInit(): void {
    this.alert = this.notificationHandlerFactory();
    this.loadSocDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isChanged']  &&  !(changes['isChanged'].firstChange)) {
      this.allavailableSocs = new AvailableSocs();
      delete this.prefilledSocs;
      this.showValidation = false;
      this.sncrPlannedChangesService.clear();
      this.loadSocDetails();
    }
  }

  loadSocDetails() {
    let socRequestDto = {orderType: this.orderType};
    this.processing = true;
    let banList = new Set;
    if (UtilsService.notNull(this.subscribers) && this.subscribers.length) {
      this.subscribers.forEach(sub => {
        if (!banList.has(sub['1'])) {
          banList.add(sub['1']);
        }
      });
    }
    let avlSocs$ = this.socSelectionService.getAvailableSocs(socRequestDto);
    socRequestDto['subscriberList'] = Array.from(banList);
    let billCycleBans$ = this.socSelectionService.getBillCycleBySelectedBans(socRequestDto);
    let selectCount$ = this.socSelectionService.getSubscriberCount();

    forkJoin([avlSocs$, billCycleBans$, selectCount$])
      .pipe(finalize(() => this.processing = false))
      .subscribe((response: any) => {
        let availResp = {...response[0]};

        // if prefilled shopping cart
        if (UtilsService.notNull(this.prefilledSocs)) {
          availResp.groups.forEach((group: any) => {
            return group.families.map((family: any) => {
              return family.socs.map((soc: any) => {
                let selectedSOC;
                if (this.prefilledSocs.length > 0) {
                  selectedSOC = this.prefilledSocs[0].socs.find((pSoc) => pSoc.value === soc.value);
                }
                if (selectedSOC) {
                  if (family.socs.length === 1) { // For checkbox preselection
                    soc['model'] = 'A';
                    soc['cssClass'] = 'plus';
                  } else { // For radio button preselection
                    soc['selected'] = true;
                    soc['defaultSection'] = soc.value;
                  }
                  if (soc.subsCount > 0 && this.eligibleSubsHardware === soc.subsCount) {
                    soc['selected'] = true;
                    soc['defaultSection'] = soc.value;
                  }
                  if (selectedSOC.trigger) { // If triggersoc presents for a soc
                    let tSoc = this.prefilledSocs[0].socs.find((ts) => ts.value === selectedSOC.trigger.value);
                    if (tSoc) {
                      soc.trigger = tSoc;
                      soc.trigger['subsCountForLazy'] = selectedSOC.length;
                      soc.trigger['defaultSection'] = tSoc.value;
                      this.checkTriggerSelection(soc);
                    }
                  }
                  soc['subsCountForLazy'] = selectedSOC.length;
                  soc['name'] = selectedSOC.text;
                  soc.charge = selectedSOC.charge;
                  family.isSelected = { [soc.value]: 'A' };
                } else {
                  delete soc['defaultSection'];
                  soc['subsCountForLazy'] = 0;
                  soc['adaptable'] = false;
                  family['adaptable'] = false;
                }
                return soc;
              });
            });
          });
        }

        this.allavailableSocs = availResp;
        this.properties.set('next.billing.cycle', response[1]);
        this.properties.set('wifi.url', this.allavailableSocs.wifiUrl);
        this.properties.set('activation.order', this.orderType === this.constants.ORDERTYPE_ACTIVATE_SUBSCRIBER);
        this.subscribersCount = response[2] && response[2].count ? response[2].count : 0;
        if (this.allavailableSocs && Object.keys(this.allavailableSocs).length) {
          /* reset soc filter - dropdown and input text*/
          this.selectedCategory = this.constants.defaultFilter;
          this.textFilter = '';

          if (this.allavailableSocs.categories) {
            this.allavailableSocs.categories = [{'name': this.constants.defaultFilter, 'description': '', 'socs': []},
              ...this.allavailableSocs['categories']];
          } else {
            this.allavailableSocs.categories = [{'name': this.constants.defaultFilter, 'description': '', 'socs': []}];
          }
          if (this.allavailableSocs.groups) {
            this.showAll(true);
          }
        }
      });
  }

  getMaxHeight() {
    return window.innerHeight - 134 + 'px';
  }

  public radioChanged(event: any, family: any) {
      family.socs.forEach(soc => {
        if (soc['bookedSoc'] && !UtilsService.notNull(family['isSelected'])) {
          soc['selected'] = true;
          family.isSelected = soc.value;
        } else {
          soc['subsCountForLazy'] = 0;
        }
      });
  }
  private showAll(onload: boolean) {
    this.allavailableSocs.groups.forEach(g => {
      g.show = true;
      g.families.forEach(f => {
        f.show = true;
        f.previousShow = true;
        f.socs.forEach(s => {
          s.show = true;
          if (onload) {
            this.setDefaultSocForVRG(f);
            this.setDefaultSocForMandatory(f);
            if (s.subsCount > 0) {
              s['length'] = s.subsCount;
            }
           if (s.subsCount > 0 && this.eligibleSubsHardware === s.subsCount) {
             if (f.socs.length === 1) {
               s['mandatory'] = true;
               s['bookedSoc'] = true;

             } else {
               s['selected'] = true;
               s['defaultSection'] = s.value;
               s['bookedSoc'] = true;
               f.isSelected = s.value;
             }
           }
            if (UtilsService.notNull(s.defaultSection) || s.mandatory) {
              if (f.socs.length === 1 || s.mandatory) {
                let tempObject = {};
                tempObject[s.value] = 'A';
                f.isSelected = tempObject;
                s['model'] = 'A';
                s['cssClass'] = 'plus';
                this.checkTriggerSelection(s);
              } else {
                f.isSelected = s.value;
                this.checkTriggerSelection(s);
              }
            }
          }
        });

      });
    });
    this.allavailableSocs.groups.sort((a, b) => {
      if (!UtilsService.notNull(a['displayOrder'])) {
        a['displayOrder'] = 0;
      }
      if (!UtilsService.notNull(b['displayOrder'])) {
        b['displayOrder'] = 0;
      }
      let order1 = Number.parseInt(a['displayOrder']);
      let order2 = Number.parseInt(b['displayOrder']);
      return order1 - order2 || a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
    });
  }

  private checkTriggerSelection(s) {

    if (UtilsService.notNull(s.trigger) && UtilsService.notNull(s.trigger.defaultSection)) {
      let tempObject = {};
      tempObject[s.trigger.value] = 'A';
      s.trigger['isSelected'] = tempObject;
      s.trigger['model'] = 'A';
      s.trigger['cssClass'] = 'plus';
    }
  }

  private setDefaultSocForVRG(f: SocFamily) {
    if (f.adaptable && !f.mandatory && !f.socs.some(soc => soc.mandatory || UtilsService.notNull(soc.defaultSection))) {
      let preSoc = f.socs[0];
      preSoc.defaultSection = preSoc.value;
    }
  }
  /**
   * Rule: This method applies only for ACTIVATE_SUBSCRIBER flow to preselect mandatory soc
   *
   * @param socFamily
   */
  private setDefaultSocForMandatory(socFamily: SocFamily) {
    if (this.orderType === this.constants.ORDERTYPE_ACTIVATE_SUBSCRIBER && socFamily.mandatory) {
      let preSoc = socFamily.socs[0];
      preSoc.defaultSection = preSoc.value;
    }
  }

  /**
   * Used in the html to update the list of filter based on the conditions
   * @param event
   */
  updateValueSelected(event) {
    if (event === this.constants.defaultFilter) {
      this.showAll(false);
    } else {
      let selectedCategory = this.allavailableSocs.categories.filter(element => element.name === event);
      let catSocs = selectedCategory[0]['socs'];
      let previousShow: boolean;
      this.allavailableSocs.groups.forEach(g => {
        previousShow = false;
        g.families.forEach(f => {
          f.socs.forEach(s => s.show = (catSocs.some(catSoc => catSoc.name === s.value)
            || (event === this.allavailableSocs.bookedCategory && s.length > 0)));
          if (f.socs.some(s => s.mandatory)) {
            f.show = f.socs.filter(s => s.mandatory && s.show).length > 0;
          } else {
            f.show = f.socs.filter(s => s.show).length > 0;
          }
          f.previousShow = previousShow;
          if (f.show) {
            previousShow = f.show;
          }
        });
        g['show'] = g.families.filter(s => s.show).length > 0;
      });

      this.allavailableSocs.groups.sort((a, b) => {
        let order1 = Number.parseInt(a['displayOrder']);
        let order2 = Number.parseInt(b['displayOrder']);
        return order1 - order2 || a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
      });
    }
  }

  getValidSocs(options: Soc[]) {
    return options.filter(s => s.mandatory).length > 0 ? options.filter(s => s.mandatory) : options;
  }

  textFilterChange() {
    setTimeout(() => {
      this.sncrPlannedChangesService.manualPositionRefreshEvent.emit();
    });
  }

  nextButton() {
    this.disableOnceClicked = true;
    this.showValidation = true;
    let selectedSocs = [];
    let mandCount = 0;
    if (this.allavailableSocs && this.allavailableSocs.groups && Object.keys(this.allavailableSocs).length) {
      this.allavailableSocs.groups.forEach(group => {
        group.families.forEach(family => {
          if (family.mandatory
            && (!UtilsService.notNull(family.isSelected))
            && family.socs.filter(soc => soc.mandatory).length === 0
            && (family.socs.length > 1 && !family.socs.some(soc => soc.length === this.subscribersCount))
            && family.socs.some(soc => soc.disabled === false)) {
            mandCount++;
          }
          if (family.isSelected && isObject(family.isSelected)) {
            let socId;
            Object.keys(family.isSelected).forEach(key => {
              let selectedSoc: Soc = family.socs.find(s => s.value === key);
              selectedSocs.push({
                socId: key,
                activationDate: selectedSoc.charge ? selectedSoc.charge.date : undefined,
                activationType: selectedSoc.charge ?
                    selectedSoc.charge.selected === 'next' ? 'nbc' : selectedSoc.charge.selected : undefined
              });
              socId = key;
            });
            this.addTriggerAndMasterSoc(selectedSocs, family.socs.find(selSoc => selSoc.value === socId));
          } else if (family.isSelected) {
            let selectedSoc: Soc = family.socs.find(s => s.value === family.isSelected);
            selectedSocs.push({
              socId: family.isSelected,
              activationDate: selectedSoc.charge ? selectedSoc.charge.date : undefined,
              activationType: selectedSoc.charge ? selectedSoc.charge.selected === 'next' ? 'nbc' : selectedSoc.charge.selected : undefined
            });
            this.addTriggerAndMasterSoc(selectedSocs, family.socs.find(selSoc => selSoc.value === family.isSelected));
          }
        });
      });
      // Master-Slave-Mandatory-Check:: Check if master soc is selected for selected slave soc
      mandCount = this.mandatoryCheckForMasterSlave(selectedSocs, mandCount);
    }
    if (mandCount === 0) {
      this.alert.clearNotification();
      this.socSelectionService.preprocess(selectedSocs).subscribe(() => {
        this.disableOnceClicked = false;
        this.review.emit(this.sncrPlannedChangesService.getPlannedChanges());
      });
    } else {
      this.disableOnceClicked = false;
      this.alert.printErrorNotification(`SOC_MANDATORY_ERROR_MSG`);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private addTriggerAndMasterSoc(selectedSocs: any[], soc: any) {
    if (soc && soc.trigger && soc.trigger.isSelected) {
      Object.keys(soc.trigger.isSelected).forEach(key => selectedSocs.push({socId: key, activationDate: soc.charge.date,
        activationType: soc.charge.selected === 'next' ? 'nbc' : soc.charge.selected}));
    }

    if (soc && soc.isMasterSelected) {
      if (soc.isMasterSelected instanceof Object) {
        Object.keys(soc.isMasterSelected).forEach(key => {
          this.filterActivationDateforMaster(selectedSocs, key, soc);
        });
      } else {
        this.filterActivationDateforMaster(selectedSocs, soc.isMasterSelected, soc);
      }
    }
  }

  private filterActivationDateforMaster(selectedSocs: any[], key: any, soc: any) {
    let activationDate;
    let activationType;
    soc.masterSocs.forEach(masterSoc => {
      masterSoc.socs.forEach(soc1 => {
        if (soc1.value === key) {
          activationType = soc1.charge.selected === 'next' ? 'nbc' : soc1.charge.selected;
          activationDate = soc1.charge.date;
        }
      });
    });
    selectedSocs.push({
      socId: key, activationDate: activationDate,
      activationType: activationType,
      slaveSoc: soc.value
    });
    selectedSocs.forEach(slaveSoc => {
      if (slaveSoc.socId === soc.value) {
        slaveSoc.activationType = activationType;
        slaveSoc.activationDate = activationDate;
      }
    });
  }
  private mandatoryCheckForMasterSlave(selectedSocs: any[], mandCount: number) {
    if (selectedSocs && selectedSocs.length > 0) {
      this.allavailableSocs.groups.forEach(group => {
        group.families.forEach(family => {
          family.socs.forEach(soc => {
            // If slave soc is selected and having masterSocs then check weather any one master soc is presented in selected socs
            if (selectedSocs.find(selSoc => selSoc.socId === soc.value) && soc.masterSocs && soc.masterSocs.length > 0) {
              let masterCount = 0;
              for (let masterFamily of soc.masterSocs) {
                // check weather any one master soc is presented in selected socs
                let selectedMasterSOC = masterFamily['socs'].find(mfs => selectedSocs.find(ss => ss.socId === mfs.value));
                if (selectedMasterSOC) {
                  masterCount++;
                }
              }
              // If master is not selected then increase mandCount
              if (masterCount === 0) {
                mandCount++;
              }
            }
          });
        });
      });
    }
    return mandCount;
  }
}
