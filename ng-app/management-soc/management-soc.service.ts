import {Injectable} from '@angular/core';
import {AssociatedSoc, AvailableSocs, Charge, SubscriberInfo, SubscriberSoc} from './classes/dtos/available-socs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {CONSTANTS} from '../soc-management/constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ManagementSocService {
  infoDescSingle = 'Teilnehmern hat bereits diese Einstellung';
  infoDescMultiple = 'Teilnehmern haben bereits diese Einstellung';
  showText = 'Beschreibung einblenden';
  hideText = 'Beschreibung ausblenden';
  constants: CONSTANTS;
  otherGroupLabel: string;
  socList: any;

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  getSocs(availableSocRequest): Promise<AvailableSocs> {
    return this.http.post<AvailableSocs>('/buyflow/rest/socmanagement/availablesoc?t=' + new Date().getTime(), availableSocRequest,
      {headers: this.headers})
      .toPromise();
  }

  getBillCycleBySelectedBans(availableSocRequest): Promise<NgbDateStruct> {
    return this.http.post<NgbDateStruct>('/buyflow/rest/socmanagement/billcycles?t=' + new Date().getTime(), availableSocRequest,
      {headers: this.headers})
      .toPromise();
  }

  getBundleValues(): Promise<any[]> {
    return this.http.get<any[]>('/buyflow/rest/socmanagement/bundleValues?t=' + new Date().getTime(),
      {headers: this.headers})
      .toPromise();
  }

  populateSocLengthForSelectedSubscribers(subscribers) {
    if (subscribers.length > 0) {
      this.socList = new Map<string, Set<SubscriberInfo>>();
      subscribers.forEach(sub => {
        if (sub[this.constants.socColValue]) {
          sub[this.constants.socColValue].split(',').forEach(value => {
            let subsSet = new Set<SubscriberInfo>();
            if (this.socList.has(value)) {
              subsSet = this.socList.get(value);
            }
            let subUltra = new SubscriberInfo();
            subUltra.subscriberNo = sub[this.constants.subscriberCol];
            subUltra.ultraCard = sub[this.constants.ultraColValue];
            subsSet.add(subUltra);
            this.socList.set(value, subsSet);
          });
        }
      });
    }
  }

  public populateData(data, selectedSubscribers, constants, modified) {
    this.constants = constants;
    let subscriberSocMap = new Map<string, SubscriberSoc>();
    if (UtilsService.notNull(data.categories) && UtilsService.notNull(data.groups)) {
      data.categories.forEach(c => c.socs.forEach(g => {
        if (c.name === data.bookedCategory) {
          this.otherGroupLabel = g.name;
        }
      }));
      this.populateSocLengthForSelectedSubscribers(selectedSubscribers);
      data.groups.forEach(g => g.families.forEach(f => {
        let noneNotRequired = 0;
        if (f.socs.filter(s => s.mandatory).length > 1) {
          f.mandatory = true;
          f.socs.filter(s => s.mandatory).forEach(s => s.mandatory = false);
        }
        f.socs.forEach(s => {
          if (!UtilsService.notNull(s.excluded)) {
            s.excluded = 0;
          }
          if (f.socs.length === 1 && f.mandatory) {
            s.mandatory = f.mandatory;
          }
          if (this.socList && UtilsService.notNull(this.socList.get(s.value))) {
            let subscribers: Set<SubscriberInfo> = this.socList.get(s.value);
            subscribers.forEach(subSoc => {
              let subSocSetEntry = new SubscriberSoc;
              let associatedSocArray: AssociatedSoc[] = [];
              let associatedSoc = new AssociatedSoc();
              associatedSoc.soc = s;
              associatedSoc.familyName = f.name;

              if (subscriberSocMap.has(subSoc.subscriberNo)) {
                subSocSetEntry = subscriberSocMap.get(subSoc.subscriberNo);
                associatedSocArray = subSocSetEntry.socs;
                if (!associatedSocArray.some(asoc => asoc.soc.value === s.value)) {
                  associatedSocArray.push(associatedSoc);
                }
              } else {
                subSocSetEntry.subscriberNo = subSoc.subscriberNo;
                associatedSocArray.push(associatedSoc);
                subSocSetEntry.socs = associatedSocArray;
                subscriberSocMap.set(subSoc.subscriberNo, subSocSetEntry);
              }

            });
            s.length = subscribers.size;
            if (s.excluded > 0 && subscribers.size > 0) {
              let ultraCount = 0;
              subscribers.forEach(subUltra => {
                if (subUltra.ultraCard > 0) {
                  ultraCount++;
                }
              });
              s.excluded = s.excluded - ultraCount;
            }
            if (s.length === selectedSubscribers.length && UtilsService.notNull(s.canOnly) && s.canOnly === 'A') {
              if (f.socs.length === 1) {
                f.mandatory = false;
              }
              s.disabled = true;
              s.mandatory = false;
            } else if (s.length > 0 && s.canOnly !== 'A') {
              noneNotRequired += s.length;
            }
            s.infoDesc = s.length === 1 ? this.infoDescSingle : this.infoDescMultiple;
          }
          if ((s.wifi || s.subsidizedHWSoc) && (s.length + s.excluded) >= selectedSubscribers.length) {
            if (f.socs.length === 1) {
              f.mandatory = false;
            }
            if (s.canOnly === 'A') {
              s.disabled = true;
              s.mandatory = f.mandatory = false;
            } else {
              s.canOnly = 'D';
            }
          }
        });

        if (f.socs.length > 1 && f.socs.filter(s => s.length === selectedSubscribers.length
          || ((s.wifi || s.subsidizedHWSoc) && (s.length + s.excluded) >= selectedSubscribers.length)).length === f.socs.length) {
          f.mandatory = false;
        }

        if (noneNotRequired === 0) {
          let index: number = f.socs.findIndex(v => v.value === 'none');
          if (index !== -1) {
            f.socs.splice(index, 1);
          }
        } else if (noneNotRequired > 0 && f.socs.find(v => v.value === 'none')) {
          let noneSoc = f.socs.find(v => v.value === 'none');
          noneSoc.length = noneNotRequired;
          noneSoc.charge = new Charge;
        }
      }));
      data = this.processMasterList(data, selectedSubscribers, modified);
      data.categories = [{'name': this.constants.defaultFilter, 'description': '', 'socs': []},
        ...data['categories']];
      this.showAll(data);
    }
    return subscriberSocMap;
  }

  private checkTriggerSelection(s) {

    if (UtilsService.notNull(s.trigger) && UtilsService.notNull(s.trigger.defaultSection)) {
      let tempObject = {};
      tempObject[s.trigger.value] = s.trigger.defaultSection;
      s.trigger['isSelected'] = tempObject;
      s.trigger['model'] = s.trigger.defaultSection;
      s.trigger['cssClass'] = s.trigger.defaultSection === 'A' ? 'plus' : 'minus';
    }
  }

  private processMasterList(allAvailableSocs: any, selectedSubscribers, modified) {
    allAvailableSocs.removeError = 0;
    allAvailableSocs.groups.forEach(g => {
      g.families.forEach(f => {
        if (!f.socs.some(sl => sl.defaultSection === sl.value || sl.defaultSection === 'none')) {
          f.isSelected = null;
        }
        f.socs.forEach(s => {
          if (!modified && UtilsService.notNull(s.defaultSection) && (!s.canOnly || s.canOnly === s.defaultSection)
            && !s.disabled && s.defaultSection !== s.value) {
            if (f.socs.length === 1) {
              if (s.defaultSection === 'D' && !s.length) {
                allAvailableSocs.removeError++;
              } else {
                let tempObject = {};
                tempObject[s.value] = s.defaultSection;
                f.isSelected = tempObject;
                s['model'] = s.defaultSection;
                s['cssClass'] = s.defaultSection === 'A' ? 'plus' : 'minus';
                this.checkTriggerSelection(s);
              }
            } else {
              f.isSelected = s.defaultSection === 'A' ? s.value : 'none';
              if (s.defaultSection === 'A') {
                this.checkTriggerSelection(s);
              }
            }
            // assign exact value to get it prepopulate in UI
            if (f.socs.length === 1 || s.defaultSection === 'A') {
              s.defaultSection = s.value;
            } else if (f.socs.length > 1 && s.defaultSection === 'D' && f.socs.some(ns => ns.value === 'none')) {
              if (f.socs.some(rs => rs.length && rs.value !== 'none')) {
                f.socs.find(nones => nones.value === 'none').defaultSection = 'none';
              } else {
                allAvailableSocs.removeError++;
              }
            }
          }
          if (s.charge && (s.defaultSection !== s.value || (s.defaultSection === s.value && s.charge.selected !== 'custom'))) {
            s.charge.date = null;
          }
          if (s.masterList) {
            s.masterSocs = this.findSocs(s.masterList, allAvailableSocs, selectedSubscribers);
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

  private findSocs(masterList: any[], allAvailableSocs: any, selectedSubscribers) {
    const groups = allAvailableSocs.groups.filter(g => masterList.map(m => m.group).includes(g.name));
    const families = UtilsService.flattenArray(groups.map(g => {
      return g.families.filter(f => masterList.map(m => m.family).includes(f.name)).map(f => {
        let familyCopy = JSON.parse(JSON.stringify(f));
        familyCopy.group = g.name;
        familyCopy.original = f;
        return familyCopy;
      });
    }));
    let removeFamilies = [];
    families.forEach(f => {
      if (f.group === this.otherGroupLabel) {
        f.socs = f.socs.filter(s => masterList.map(m => m.value).includes(s.value) && s.length === selectedSubscribers.length);
      } else {
        f.socs = f.socs.filter(s => masterList.map(m => m.value).includes(s.value));
      }
      if (UtilsService.notNull(f.socs) && f.socs.length > 0) {
        f.socs = f.socs.map(s => {
          let ins = JSON.parse(JSON.stringify(s));
          ins.canOnly = 'A';
          return ins;
        });
      }
      if (!UtilsService.notNull(f.socs) || f.socs.length === 0) {
        removeFamilies.push(f.name + '#' + f.group);
      }
    });
    return families.filter(gf => !(removeFamilies.includes(gf.name + '#' + gf.group)));
  }

  private showAll(data) {
    data.groups.forEach(g => {
      g.show = true;
      g.families.forEach(f => {
        f.show = true;
        f.previousShow = true;
        f.socs.forEach(s => s.show = true);
      });
    });
    data.groups.sort((a, b) => {
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
}