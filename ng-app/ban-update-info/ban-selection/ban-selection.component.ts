import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SncrFlowSectionComponent} from '../../sncr-components/sncr-flow/sncr-flow-section.component';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {BanUpdateInfoService} from '../ban-update-info.service';
import {BanSelectionConfig} from './ban-selection.config';
import {LazyParams} from '../../sncr-components/sncr-datatable/lazy-params';
import {ActivatedRoute} from '@angular/router';
import {TranslationService} from 'angular-l10n';

@Component({
  selector: 'ban-selection',
  templateUrl: 'ban-selection.component.html',
  styleUrls: ['ban-selection.component.scss'],
})


export class BanSelectionComponent implements OnInit {

  @Input() cols = [];
  @Input() lazy = false;
  @Input() lazyLoadUrl = '';
  @Input() banSelectionFlow: SncrFlowSectionComponent;
  @Output() onDataChange = new EventEmitter();

  configId = '';

  emptyMessage = '';

  @ViewChild('banSelection') banSelectionTable: SncrDatatableComponent;
  alertNotify: NotificationHandlerService;
  manageBanConfigId = '5c60e182-4a75-511c-e053-1405100af36g';
  isChanged = false;
  banSelectionTranslations: any = {};
  selectAllEvent = false;
  processing = false;
  lazyCount = 0;
  noDataInfoMsg = '';

  constructor(private banUpdateInfoService: BanUpdateInfoService,
              @Inject('NotificationHandlerFactory') public notificationHandlerFactory,
              private route: ActivatedRoute, public translation: TranslationService) {

  }

  ngOnInit(): void {
    this.alertNotify = this.notificationHandlerFactory();
    this.configId = this.lazyLoadUrl.substring(this.lazyLoadUrl.lastIndexOf('/') + 1);
    this.emptyMessage = 'Kein Teilnehmer gefunden';

    this.banSelectionTranslations = BanSelectionConfig.banSelectionTranslations;

    this.noDataInfoMsg = `<p class="alertTitle">Bitte beachten Sie:</p>
      <p class="messageText">Es sind keine Kundennummern vorhanden.</p>
      `;

    if (this.lazy) {
      this.route.data.subscribe((data: { lazyCount: any }) => {
        if (data.lazyCount) {
          this.lazyCount = data.lazyCount;
        }
      });
    }
  }

  updateFlowEvent(event) {
    this.onDataChange.emit(event);
  }

  manageNextSection(bulkEdit: boolean) {
    if (this.lazy) {
      this.processing = true;
      let selectCount = 0;
      this.banUpdateInfoService.persistBansForUpdate(this.getLazyParams()).then(data => {
        this.banSelectionTable.selectedMap = new Map();
        this.getCountNavigateNext(bulkEdit);
      });
    }
  }

  getLazyParams(): LazyParams {
    let selectedMap = this.banSelectionTable.selectedMap;
    let selections = selectedMap.size ? Array.from(selectedMap.values()) : [];
    let lazyParams = new LazyParams();
    lazyParams['configId'] = this.configId;
    lazyParams['selections'] = selections;
    lazyParams['selectAll'] = this.banSelectionTable.selectAll ? 'true' : 'false';

    return lazyParams;
  }


  getCountNavigateNext(bulkEdit: boolean) {
    let selectCount = 0;
    this.banUpdateInfoService.getSelectCount(this.manageBanConfigId).then(data => {
      this.processing = false;
      selectCount = data && data.count ? data.count : 0;
      if (selectCount) {
        this.alertNotify.clearNotification();
        this.banSelectionFlow.model.selectCount = selectCount;
        let reviewMsg = this.translation.translate('REVIEW-BULK_EDIT_INFO_MESSAGE',
          {selectCount: selectCount});
        this.banSelectionFlow.model.reviewMsg = reviewMsg;
        this.banSelectionFlow.model.bulkEdit = bulkEdit;
        this.isChanged = !this.isChanged;
        this.banSelectionFlow.model.isChanged = this.isChanged;
        this.banSelectionFlow.next(this.banSelectionFlow.model);
      } else if (!selectCount) {
        this.alertNotify.printErrorNotification(BanSelectionConfig.banSelectionTranslations.banNoSelectionsMsg);
      } else {
        this.printErrorMsg();
      }
    });
  }

  printErrorMsg() {
    this.processing = false;
    this.alertNotify.printErrorNotification(`
      <p><b>Entschuldigung, leider ist ein Fehler aufgetreten</b></p>
      <p>Es wurden keine Teilnehmer <ausgewäh></ausgewäh>lt.</p>
      `);
  }

}
