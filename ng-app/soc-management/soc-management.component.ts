import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CONSTANTS} from './constants';
import {SocManagementService} from './soc-management.service';
import {AvailableSocs, Soc} from '../management-soc/classes/dtos/available-socs';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {isObject} from 'util';
import {SncrPlannedChangesService} from '../sncr-components/sncr-planned-changes/sncr-planned-changes.service';
import {ManagementSocService} from '../management-soc/management-soc.service';
import { Language } from 'angular-l10n';

@Component({
  selector: 'soc-management',
  templateUrl: 'soc-management.component.html',
  styleUrls: ['soc-management.component.scss']
})
export class SocManagementComponent implements OnInit {
  @Language() lang: string;
  backButton: string;
  allavailableSocs: AvailableSocs;
  constants: CONSTANTS;
  properties: Map<any, any>;
  showText = 'Beschreibung einblenden';
  hideText = 'Beschreibung ausblenden';
  selectedCategory: string;
  infoDescSingle = 'Teilnehmern hat bereits diese Einstellung';
  infoDescMultiple = 'Teilnehmern haben bereits diese Einstellung';
  superScript = '\u00B9';
  showValidation: boolean;
  textFilter: string;

  constructor(private route: ActivatedRoute,
              private socMngService: SocManagementService,
              private mngsocSerivice: ManagementSocService,
              private plannedChangesService: SncrPlannedChangesService,
              public socNotify: NotificationHandlerService) {

  }

  ngOnInit(): void {

    this.getSuperScriptValue();

    this.route.data.subscribe((data: { availableSocs: AvailableSocs }) => {
      this.constants = new CONSTANTS;
      this.properties = this.constants.getProperties();
      let socRequestDto = {};
      socRequestDto['orderType'] = data.availableSocs.orderType;
      let banList = new Set;
      banList.add(data.availableSocs.ban);
      socRequestDto['subscriberList'] = Array.from(banList);
      this.socMngService.getBillCycleBySelectedBans(socRequestDto).then((nextBilling) => {
        this.properties.set('next.billing.cycle', nextBilling);
      });
      this.allavailableSocs = data.availableSocs;
      this.properties.set('wifi.url', this.allavailableSocs.wifiUrl);
      this.properties.set('duration.override', this.allavailableSocs.durationOverride);
      this.properties.set('server.time', this.allavailableSocs.serverTimeCrossed);
      this.properties.set('activation.order',
        this.constants.activationOrderType.includes(this.allavailableSocs.orderType.toLocaleUpperCase()));
      this.selectedCategory = this.constants.defaultFilter;
      let id = this.constants.backParamsByOrderType[this.allavailableSocs.orderType.toUpperCase()];
      if (this.allavailableSocs['orderType'] === 'redeem_delayed_subsidy') {
        this.backButton = '/portal/client/en_US/BackRedirectAction?id=' + id + '&name=' + id;
      } else {
        this.backButton = '/buyflow/client/en_US/backButton?id=' + id + '&name=' + id;
      }
      this.allavailableSocs['categories'] = [{'name': this.constants.defaultFilter, 'description': '', 'socs': []},
        ...this.allavailableSocs.categories];
      this.showAll();
      this.allavailableSocs.groups.forEach(g =>
        g.families.forEach(f => {
          f.isSelected = null;
          if (this.constants.activationOrderType.includes(this.allavailableSocs.orderType.toLocaleUpperCase())
            && f.mandatory && f.socs.length > 1 && !f.socs.some(s => s.mandatory || UtilsService.notNull(s.defaultSection))) {
            let preSoc = f.socs[0];
            preSoc.defaultSection = preSoc.value;
          }
          if (f.socs.filter(s => s.mandatory).length > 1) {
            f.mandatory = true;
            if (this.constants.activationOrderType.includes(this.allavailableSocs.orderType.toLocaleUpperCase())) {
              let preSoc = f.socs.filter(s => s.mandatory)[0];
              preSoc.defaultSection = preSoc.value;
            }
            f.socs.filter(s => s.mandatory).forEach(s => s.mandatory = false);
          }
          f.socs.forEach(s => {
            if (f.socs.length === 1 && f.mandatory) {
              s.mandatory = f.mandatory;
            }
            if (s.length > 0) {
              s.infoDesc = s.length === 1 ? this.infoDescSingle : this.infoDescMultiple;
              if (s.length === this.allavailableSocs.tariffLength
                || ((s.wifi || s.subsidizedHWSoc) && (s.length + s.excluded) >= this.allavailableSocs.tariffLength)) {
                if (f.socs.length === 1) {
                  s.disabled = true;
                  f.mandatory = false;
                }
                s.mandatory = false;
                s.defaultSection = null;
              }
            }
            if (f.adaptable && !f.mandatory && !f.socs.some(soc => soc.mandatory || UtilsService.notNull(soc.defaultSection))) {
              let preSoc = f.socs[0];
              preSoc.defaultSection = preSoc.value;
              console.log('adaptable selected');
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
          });
          if (f.socs.length > 1 && f.socs.filter(s => s.length === this.allavailableSocs.tariffLength
              || ((s.wifi || s.subsidizedHWSoc)
                && (s.length + s.excluded) >= this.allavailableSocs.tariffLength)).length === f.socs.length) {
            f.mandatory = false;
          }
        })
      );
      this.allavailableSocs = this.processMasterList(data.availableSocs);
    });
  }

  private processMasterList(allAvailableSocs: any) {
    allAvailableSocs.groups.forEach(g => {
      g.families.forEach(f => {
        f.socs.forEach(s => {
          if (s.charge) {
            s.charge.date = null;
          }
          if (s.masterList) {
            s.masterSocs = this.findSocs(s.masterList, allAvailableSocs);
            if (!UtilsService.notNull(s.masterSocs) || s.masterSocs.length === 0) {
              if (f.socs.length === 1 && s.length > 0 && s.canOnly !== 'A') {
                s.canOnly = 'D';
              } else {
                s.disabled = true;
              }
              s.mandatory = f.mandatory = false;
            }
          }
        });
      });
    });
    return allAvailableSocs;
  }

  private findSocs(masterList: any[], allAvailableSocs: any) {
    const groups = allAvailableSocs.groups.filter(g => masterList.map(m => m.group).includes(g.name));
    const families = UtilsService.flattenArray(groups.map(g => {
      return g.families.filter(f => masterList.map(m => m.family).includes(f.name)).map(f => {
        let familyCopy = JSON.parse(JSON.stringify(f));
        familyCopy.group = g.name;
        familyCopy.original = f;
        return familyCopy;
      });
    }));

    families.forEach(f => {
      f.socs = f.socs.filter(s => masterList.map(m => m.value).includes(s.value));
      f.socs = f.socs.map(s => {
        let ins = JSON.parse(JSON.stringify(s));
        ins.canOnly = 'A';
        return ins;
      });
      if (!UtilsService.notNull(f.socs) || f.socs.length === 0) {
        let index: number = families.findIndex(v => v.group === f.group);
        if (index !== -1) {
          families.splice(index, 1);
        }
      }
    });

    return families;
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

  private showAll() {
    this.allavailableSocs.groups.forEach(g => {
      g['show'] = true;
      g.families.forEach(f => {
        f.show = true;
        f.previousShow = true;
        f.socs.forEach(s => s.show = true);
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

  updateSelectedValue(event): void {
    if (event === this.constants.defaultFilter) {
      this.showAll();
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

  private getMasterSoc(masterSocs: any[], selectedSoc) {
    let masterSoc;
    let isOriginalSelected = masterSocs.some(m => UtilsService.notNull(m.original.isSelected) || m.original.socs.some(s => s.mandatory));

    if (!isOriginalSelected && UtilsService.notNull(selectedSoc.isMasterSelected)) {
      const socValues = selectedSoc.isMasterSelected instanceof Object ? Object.keys(selectedSoc.isMasterSelected) :
        [...selectedSoc.isMasterSelected];
      masterSocs.forEach(f => {
        if (UtilsService.notNull(socValues) && !UtilsService.notNull(masterSoc) && !UtilsService.notNull(f.original.isSelected)) {
          let findSoc = f.socs.find(s => socValues.includes(s.value));
          if (UtilsService.notNull(findSoc)) {
            masterSoc = findSoc;
          }
        }
      });
    }
    if (!UtilsService.notNull(masterSoc) && isOriginalSelected) {
      let count = 0;
      masterSocs.forEach(f => {
        let socValues = [];
        if (UtilsService.notNull(f.original.isSelected)) {
          socValues = f.original.isSelected instanceof Object ? Object.keys(f.original.isSelected) :
            [...f.original.isSelected];
        }
        if (!UtilsService.notNull(socValues) || socValues.length === 0) {
          f.original.socs.forEach(ms => {
            if (ms.mandatory) {
              socValues.push(ms.value);
            }
          });
        }
        if (!UtilsService.notNull(masterSoc) && UtilsService.notNull(socValues) && socValues.length > 0) {
          let findSoc = f.socs.find(s => socValues.includes(s.value));
          if (UtilsService.notNull(findSoc)) {
            masterSoc = findSoc;
          }
        }
      });
    }
    if (!UtilsService.notNull(masterSoc) && UtilsService.notNull(masterSocs)) {
      this.plannedChangesService.getPlannedChanges().forEach(p => p.socs.forEach(ps => {
        masterSocs.forEach(mf => {
          mf.socs.forEach(msc => {
            if (ps.isAddition && msc.value === ps.value && !UtilsService.notNull(masterSoc)) {
              let findSoc = mf.original.socs.find(inneros => msc.value === inneros.value);
              masterSoc = findSoc;
              masterSoc.charge.selected = ps.charge.selected;
              masterSoc.charge.date = ps.charge.date;
            }
          });
        });
      }));
    }
    return masterSoc;
  }

  nextButton() {
    this.showValidation = false;

    let selectedSocs = new AvailableSocs();
    selectedSocs.groups = [];
    let noneMandatory = true;
    let masterSocSelected = true;
    this.allavailableSocs.groups.forEach(g => {
      if (g.families.find(f => f.mandatory)) {
        g.families.filter(f => f.mandatory).forEach(f => {
          let selectedSoc;
          let activationType;
          if (UtilsService.notNull(f.isSelected) && isObject(f.isSelected)) {
            Object.keys(f.isSelected).forEach(key => {
              selectedSoc = key;
              activationType = f.isSelected[key];
            });
          } else {
            if (UtilsService.notNull(f.isSelected)) {
              selectedSoc = f.isSelected;
              activationType = 'A';
            }
          }
          if (!UtilsService.notNull(selectedSoc) || !UtilsService.notNull(activationType)) {
            noneMandatory = false;
          }
        });
      }
      if (g.families.filter(f => UtilsService.notNull(f.isSelected)).length > 0) {
        let copyGroup = Object.assign({}, g);
        copyGroup.families = [];
        g.families.filter(f => UtilsService.notNull(f.isSelected)).forEach(f => {
          let defaultSoc;
          if (isObject(f.isSelected)) {
            Object.keys(f.isSelected).forEach(k => {
              if (UtilsService.notNull(f.isSelected[k])) {
                defaultSoc = k;
              }
            });
          } else {
            defaultSoc = f.isSelected;
          }
          if (UtilsService.notNull(defaultSoc)) {
            let copyFamily = Object.assign({}, f);
            copyFamily.socs = f.socs.length === 1 ? [...f.socs] :
              [... f.socs.filter(s => (f.isSelected === s.value || s.mandatory) && s.length !== this.allavailableSocs.tariffLength)];
            if (copyFamily.socs.length > 0) {
              copyFamily.socs.forEach(selectedSoc => {
                if (selectedSoc['masterSocs'] && selectedSoc['masterSocs'].length > 0) {
                  selectedSoc['masterSoc'] = this.getMasterSoc(selectedSoc['masterSocs'], selectedSoc);
                  if (UtilsService.notNull(selectedSoc['masterSoc'])) {
                    if (UtilsService.notNull(selectedSoc['masterSoc'].charge) && selectedSoc['masterSoc'].charge.selected !== 'today') {
                      selectedSoc.charge.selected = selectedSoc['masterSoc'].charge.selected;
                      selectedSoc.charge.date = selectedSoc['masterSoc'].charge.date;
                    }
                  } else {
                    masterSocSelected = false;
                  }
                }
                if (UtilsService.notNull(selectedSoc.trigger)
                  && !UtilsService.notNull(selectedSoc.trigger['isSelected']) && !selectedSoc.trigger.mandatory) {
                  delete selectedSoc.trigger;
                }
              });
              copyGroup.families.push(copyFamily);
            }
          }

        });
        selectedSocs.groups.push(copyGroup);
      }
    });

    if (noneMandatory && masterSocSelected) {
      window.parent['disableThisButton']('removeForm');
      this.socMngService.nextPage(selectedSocs).then(() => {
        let url;
        let locale = parent.location.href.indexOf('/en_US/') > -1 ? '/en_US/' : '/de_DE/';
        if (this.allavailableSocs['orderType'] === 'redeem_delayed_subsidy') {
          url = '/portal/client' + locale;
        } else {
          url = '/buyflow/client' + locale;
        }
        parent.location.href = url + this.constants.nextActionByOrderType[this.allavailableSocs['orderType'].toUpperCase()];
      }).catch((ex) => {
        console.log('Error in the page', ex);
      });
    } else {
      this.showValidation = true;
      if (!masterSocSelected) {
        this.socNotify.printErrorNotification(`<b>Entschuldigung, leider ist ein Fehler aufgetreten</b><p></p>
            <p>Bitte wählen Sie eine der Tarifoptionen.</p>`);

      } else {
        this.socNotify.printErrorNotification(`<b>Entschuldigung, leider ist ein Fehler aufgetreten</b><p></p>
            <p>Bitte wählen Sie eine der Pflichtoptionen.</p>`);

      }
    }
  }

  getValidSocs(options: Soc[]) {
    return options.filter(s => s.mandatory).length > 0 ? options.filter(s => s.mandatory) : options;
  }

  getSuperScriptValue() {
    this.mngsocSerivice.getBundleValues().then((data) => {
      let str = [...data].find(val => val.basePriceDisclaimer);
      this.superScript = this.superScript + str.basePriceDisclaimer;
    }).catch((ex) => {
      console.error('exception in order', ex);
    });
  }

  scrollWindow() {
    parent.scrollTo(0, 0);
  }
}