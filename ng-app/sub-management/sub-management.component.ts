import {Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {SncrDatatableComponent} from '../sncr-components/sncr-datatable/sncr-datatable.component';
import {SncrFlowSectionComponent} from '../sncr-components/sncr-flow/sncr-flow-section.component';
import {SubUpdateInfoService} from '../subscriber-update-info/sub-update-info.service';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {Column} from '../sncr-components/sncr-datatable/column';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {BanSubConfig} from '../ban-sub-common/ban-sub.config';
import {BanSubValidatorsService} from '../ban-sub-common/ban-sub-validators.service';
import {FormGroup} from '@angular/forms';
import {SncrDatatableService} from '../sncr-components/sncr-datatable/sncr-datatable.service';
import {Language, TranslationService} from 'angular-l10n';

@Component({
  selector: 'sub-management',
  templateUrl: 'sub-management.component.html',
  styleUrls: ['sub-management.component.scss'],
})
export class SubManagementComponent implements OnChanges {

  @ViewChild('manageTable', {static: true}) manageTable: SncrDatatableComponent;

  @Input() flowType = '';
  @Input() selectedSubs: any;
  @Input() lazy = false;
  @Input() lazyLoadUrl = '';
  @Input() subManagementFlow: SncrFlowSectionComponent;
  @Input() totalRecords: any;
  @Input() countries = [];
  @Input() msisdn = [];
  @Input() pattern = '';
  @Input() columns: Column[] = [];
  @Input() columnSelection = true;
  @Input() continueLabel;
  @Input() configId = '5c60e182-4a75-511c-e053-1405100af36b';
  @Input() reviewSubsConfigId = '5c60e182-4a75-511c-e053-1405100af36d';
  @Input() resetEditedRows = true;
  @Input() isPreQueryEligible = false;
  @Input() simTypes = [];

  @Output() simSelection = new EventEmitter();
  @Output() reviewUpdatedSub = new EventEmitter();
  @Output() processingEvent = new EventEmitter();

  @Language() lang;

  form: FormGroup;
  lazyColsLoad = false;
  hasChanged = false;
  alertNotify: NotificationHandlerService = new NotificationHandlerService();
  processing = false;
  manageCols: Column[] = [];
  enablePreQuery = false;
  selectedSim: string;

  constructor(private subUpdateInfoService: SubUpdateInfoService, @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
              private banSubValidatorsService: BanSubValidatorsService, public translation: TranslationService) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSubs'] && this.manageTable) {
      if (this.subManagementFlow.prefilled) {
        this.subManagementFlow.prefilled = false;
      } else if (changes['totalRecords']) {
        this.subManagementFlow.model = {};
      }
      if (this.isPreQueryEligible) {
        this.getSubsDetailsPrequery();
      } else {
        this.reLoadData();
      }
    }
  }

  reLoadData() {
    this.selectedSim = 'NEW_SIM';
    if (UtilsService.notNull(this.manageTable.allEditForm)) {
      this.manageTable.allEditForm = null;
    }
    this.manageTable.initNotLoaded = true;
    this.manageTable.totalRecords = this.totalRecords;
    this.manageTable.resetAllFilters();
    if (this.resetEditedRows && this.manageTable.lazyParams['editData']) {
      this.manageTable.lazyParams['editData'] = [];
    }

    this.manageCols = [];
    this.lazyColsLoad = true;
    this.alertNotify.clearNotification();
    if (this.columns && this.columns.length) {
      let tempCols = [];
      tempCols = [...this.columns.map(col => Object.assign({}, col))];
      this.manageCols = this.setColumnDefnitions(tempCols);
      this.lazyColsLoad = false;
    }
    this.resetColumns();
  }

  resetColumns() {
    if (this.isPreQueryEligible) {
      this.manageCols.forEach( col => {
        col.show = BanSubConfig.hideCols[this.selectedSim].indexOf(col.field) <= -1;
      });
      this.manageTable.colsChange(this.manageCols);
      this.simSelection.emit(this.selectedSim);
    }
  }

  getSubsDetailsPrequery() {
    this.subUpdateInfoService.getSubsDetailsPrequery()
      .subscribe((response: boolean) => {
          this.enablePreQuery = response;
          this.reLoadData();
        }
      );
  }

  reviewUpdate() {
    const validForm = !SncrDatatableService.areDirtyFormsInvalid(this.form);
    if (validForm) {
      this.processing = true;
      this.processingEvent.emit(this.processing);
      let editedData = [...this.manageTable.getEditedRows()];
      this.subUpdateInfoService.persistEditedData(editedData, this.configId, false).then(data => {
        let selectCount = 0;
        this.subUpdateInfoService.getSelectCount(this.reviewSubsConfigId).then(res => {
          this.processing = false;
          this.processingEvent.emit(this.processing);
          selectCount = res && res.count ? res.count : 0;
          if (selectCount || this.flowType === BanSubConfig.FL_TYPE_ACT_SUB) {
            this.alertNotify.clearNotification();
            this.subManagementFlow.model.selectCount = selectCount;
            this.hasChanged = !this.hasChanged;
            this.subManagementFlow.model.hasChanged = this.hasChanged;
            this.subManagementFlow.next(this.subManagementFlow.model);
          } else {
            this.alertNotify.printErrorNotification(`<p class="alertTitle"><span l10nTranslate>`
                + this.translation.translate('MANAGE_DETAILS-NO_CHANGE_INFO') + `</span></p>`);
          }
        });
      });
    } else {
      this.processing = false;
      this.processingEvent.emit(this.processing);
      this.alertNotify.printErrorNotification(`<p class="alertTitle">` + this.translation.translate('MANAGE_DETAILS-ERROR_TITLE') + `</p>
        <p>` + this.translation.translate('MANAGE_DETAILS-ERROR_DESCRIPTION') + `</p>`);
    }
  }

  setColumnDefnitions(cols: any[]): any[] {
    // filter and sorting is not needed for subs management
    cols.forEach(col => {
      // validations to be added here for each of the fields
      let validators = [];
      col.sortable = false;
      col.filter = false;
      if (BanSubConfig.fieldControlNames[this.flowType].msisdn === col.field) {
        validators = this.banSubValidatorsService.msisdnValidators(col, this.flowType, this.pattern, this.msisdn);
      } else {
        validators = this.banSubValidatorsService.buildValidators(col, this.flowType, this.pattern, this.countries, this.simTypes);
      }
      if (validators && validators.length) {
        let obj = {
          editInfo: {
            validators: []
          }
        };
        if (col.editInfo && JSON.stringify(col.editInfo) !== '{}') {
          col.editInfo.validators = [...validators];
        } else {
          obj.editInfo.validators = [...validators];
          col.editInfo = obj.editInfo;
        }
      }
    });

    // cols that are editable must be default shown and remove default view of compound columns
    return cols.map(col => {
      if (!col.nonEditable || col.nonEditable !== 'Y') {
        col.show = true;
      }
      if (col.compoundField && col.compoundField.length > 0) {
        col.show = false;
      }
      if (BanSubConfig.fieldWidth[this.flowType][col.field]) {
        col.width = BanSubConfig.fieldWidth[this.flowType][col.field];
      }
      return col;
    });
  }

  resetManageTable(event) {
    if (event) {
      this.subUpdateInfoService.assignAllMsisdn().subscribe(response => {
        this.reLoadData();
      });
    }
  }
}
