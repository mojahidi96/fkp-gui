import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CONSTANTS} from '../soc-management/constants';
import {ManagementSocService} from './management-soc.service';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {AvailableSocs, Soc, SubscriberSoc} from './classes/dtos/available-socs';
import {SncrPlannedChangesService} from '../sncr-components/sncr-planned-changes/sncr-planned-changes.service';
import {SncrFlowSectionComponent} from '../sncr-components/sncr-flow/sncr-flow-section.component';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service'; 

@Component({
  selector: 'management-soc',
  templateUrl: 'management-soc.component.html',
  styleUrls: ['management-soc.component.scss']
})
export class ManagementSocComponent implements OnChanges, OnInit {

  constants: CONSTANTS;
  isLoading = true;
  initialLoad = true;
  onceModified = false;
  properties: Map<any, any>;

  @Input() subscribers = [];
  @Input() notificationHandler: NotificationHandlerService;
  @Input() showValidation: boolean;
  @Input() reviewFlowSoc: SncrFlowSectionComponent;
  @Input() availableSocFlow: SncrFlowSectionComponent;

  @Output() review = new EventEmitter();

  @Input() allavailableSocs: AvailableSocs;
  @Input() subscriberSocMap: Map<string, SubscriberSoc>;
  @Input() selectCDA: boolean;
  @Input() cdaCategoryName: string;
  selectedCategory: string;
  superScript = '';

  showText = 'Beschreibung einblenden';
  hideText = 'Beschreibung ausblenden';

  constructor(private socMngService: ManagementSocService,
              public sncrPlannedChangesService: SncrPlannedChangesService) {
    this.constants = new CONSTANTS;
    this.properties = this.constants.getProperties();
    this.selectedCategory = this.constants.defaultFilter;
  }

  ngOnInit(): void {
    this.getSuperScriptValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subscribers'] || changes['modified'] || changes['selectCDA']) {
      this.sncrPlannedChangesService.clear();
      let socRequestDto = {orderType: 'MA_MAINTAIN_SOC'};
      let subscriberList = new Set;
      let banList = new Set;
      this.subscribers.forEach(sub => {
        subscriberList.add(sub['2']);
        if (!banList.has(sub['1'])) {
          banList.add(sub['1']);
        }
      });
      socRequestDto['subscriberList'] = Array.from(banList);

      this.socMngService.getBillCycleBySelectedBans(socRequestDto).then((data) => {
        this.properties.set('next.billing.cycle', data);
      });

      socRequestDto['subscriberList'] = Array.from(subscriberList);
      this.isLoading = true;
      this.socMngService.getSocs(socRequestDto).then((data) => {
        this.availableSocFlow.model.availableSocs = data;
        this.allavailableSocs = this.availableSocFlow.model.availableSocs;
        if (this.allavailableSocs) {
          this.initSocDetails(this.allavailableSocs);
          this.onceModified = true;
        }
        this.selectCDAForUpload();
      });
    }
  }

  getMaxHeight() {
    return window.innerHeight - 134 + 'px';
  }

  private initSocDetails(data) {
    this.properties.set('wifi.url', data.wifiUrl);
    this.properties.set('duration.override', data.durationOverride);
    this.properties.set('server.time', data.serverTimeCrossed);
    this.subscriberSocMap = this.socMngService.populateData(data, this.subscribers, this.constants, this.onceModified);
    this.isLoading = this.initialLoad = false;
    this.showAll();
  }

  private showAll() {
    if (this.allavailableSocs && this.allavailableSocs.groups) {
      this.allavailableSocs.groups.forEach(g => {
        g.show = true;
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
  }


  updateValueSelected(event) {
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

  getValidSocs(options: Soc[]) {
    return options.filter(s => s.mandatory).length > 0 ? options.filter(s => s.mandatory) : options;
  }

  textFilterChange() {
    setTimeout(() => {
      this.sncrPlannedChangesService.manualPositionRefreshEvent.emit();
    });
  }

  getSuperScriptValue() {
    this.socMngService.getBundleValues().then((data) => {
      if (data) {
        let str = [...data].find(val => val.basePriceDisclaimer);
        this.superScript = '\u00B9' + str.basePriceDisclaimer;
      }
    }).catch((ex) => {
      console.error('exception in order', ex);
    });
  }

  selectCDAForUpload() {
    this.selectedCategory = this.constants.defaultFilter;
    if (this.selectCDA && this.allavailableSocs) {
      this.allavailableSocs.categories.forEach(val => {
        if (val.name === this.cdaCategoryName) {
          this.selectedCategory = val.name;
        }
      });
    }
    this.updateValueSelected(this.selectedCategory);
  }
}