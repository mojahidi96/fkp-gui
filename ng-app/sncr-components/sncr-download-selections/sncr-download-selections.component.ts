import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslationService} from 'angular-l10n';
import {LazyParams} from '../sncr-datatable/lazy-params';
import {SncrDownloadSelectionsService} from './sncr-download-selections.service';
import {DownloadParams} from './downloadParams';
import {SncrDatatableComponent} from '../sncr-datatable/sncr-datatable.component';
import {UtilsService} from '../sncr-commons/utils.service';


@Component({
  selector: 'sncr-download-selections',
  templateUrl: 'sncr-download-selections.component.html',
  styleUrls: ['sncr-download-selections.component.scss']
})


export class SncrDownloadSelectionsComponent {
  @Input() downloadParams = new DownloadParams();
  @Input() dataTableDetails: SncrDatatableComponent;
  @Input() disable = false;
  @Input() className = '';
  @Input() manageConfigId = '';

  @Input() prefix: string;
  @Input() zip: boolean;
  @Input() checkSelectCount = false;
  @Input() savedFileName: string;

  downLoading = false;
  zipDownload = false;
  lazyParams = new LazyParams();

  constructor(private sncrDownloadService: SncrDownloadSelectionsService,
              public translation: TranslationService) {

  }

  downloadSelectionsTemplate() {
    if (!this.disable) {
      this.downLoading = true;
      this.sncrDownloadService.persistSelection(this.getLazyParams()).then(data => {
        if (this.downloadParams.reportKey) {
          this.setViewOptToSession();
        } else {
          this.downLoadEvents();
        }
      }).catch(err => {
        console.log(err);
        this.printError(this.prefix + 'DOWNLOAD_FAIL_ERROR_MESSAGE');
      });
    }
  }

  downLoadEvents() {
    if (this.checkSelectCount) {
      let selectCount = 0;
      this.sncrDownloadService.getSelectCount(this.manageConfigId).then(count => {
        selectCount = count && count.count ? count.count : 0;
        if (selectCount) {
          this.downloadSelections(this.getLazyParams());
          this.downLoading = false;
        } else {
          this.printError(this.prefix + 'NO_PARTICIPANTS_SELECTED');
        }
      });
    } else {
      this.downloadSelections(this.getLazyParams());
      this.downLoading = false;
    }
  }

  printError(errMsg) {
    this.downLoading = false;
    this.downloadParams.notificationHandler.printErrorNotification(
      this.translation.translate(errMsg));
  }

  downloadSelections(lazyParams: LazyParams) {
    const key = this.downloadParams.reportKey ? 'viewOptKey' : 'configId';
    window.location.href = this.downloadParams.url
      + `/${lazyParams[key]}?t=${new Date().getTime()}`;
  }

  setViewOptToSession() {
    this.sncrDownloadService.setViewOptKeyToSession(this.getLazyParams()).then(resp => {
      this.downLoadEvents();
    }).catch(err => {
      console.log(err);
    });
  }


  getLazyParams(): LazyParams {
    this.lazyParams['configId'] = this.downloadParams.configId;
    if (UtilsService.notNull(this.dataTableDetails)) {
      this.lazyParams.filters = this.dataTableDetails.previousFilters;
      this.lazyParams.sortField = this.dataTableDetails.lazyParams.sortField;
      this.lazyParams.sortOrder = this.dataTableDetails.lazyParams.sortOrder;
      this.lazyParams.selectedCols = this.dataTableDetails.currentCols;
      this.lazyParams['selections'] = this.dataTableDetails.selectedMap.size ? Array.from(this.dataTableDetails.selectedMap.values()) : [];
      this.lazyParams.zipDownload = this.zipDownload;
      this.lazyParams.viewOptKey = this.downloadParams.reportKey;
      if (this.savedFileName) {
        this.lazyParams.savedFileName = this.savedFileName;
      }
    }
    return this.lazyParams;
  }
}