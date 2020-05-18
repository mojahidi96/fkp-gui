import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SncrFlowSectionComponent} from '../../sncr-components/sncr-flow/sncr-flow-section.component';
import {Column} from '../../sncr-components/sncr-datatable/column';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {BanUpdateInfoService} from '../ban-update-info.service';
import {BanManagementConfig} from './ban-management.config';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {BanSubConfig} from '../../ban-sub-common/ban-sub.config';
import {BanSubValidatorsService} from '../../ban-sub-common/ban-sub-validators.service';
import {FormGroup} from '@angular/forms';
import {SncrDatatableService} from '../../sncr-components/sncr-datatable/sncr-datatable.service';
import {Language, TranslationService} from 'angular-l10n';
import {Subscription} from 'rxjs';

@Component({
  selector: 'ban-management',
  templateUrl: 'ban-management.component.html',
  styleUrls: ['ban-management.component.scss'],
})

export class BanManagementComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild('manageTable', {static: true}) manageTable: SncrDatatableComponent;
  @ViewChild('address') address: any;


  @Input() selectedBans: any;
  @Input() lazy = false;
  @Input() lazyLoadUrl = '';
  @Input() banManagementFlow: SncrFlowSectionComponent;
  @Input() totalRecords: any;
  @Input() countries = [];
  @Input() pattern: any;
  @Input() columns: Column[] = [];

  @Language() lang;

  configId = '5c60e182-4a75-511c-e053-1405100af36g';
  form: FormGroup;
  lazyColsLoad = false;
  isChanged = false;
  alertNotify: NotificationHandlerService = new NotificationHandlerService();
  reviewConfigId = '5c60e182-4a75-511c-e053-1405100af36h';
  banManageTranslations: any = {};
  processing = false;
  manageCols: Column[] = [];
  private inProgressSubscription: Subscription;
  private onFocussedSubscription: Subscription;
  private payFieldsValidationInProgress = false;
  private payFieldFocussed = false;

  constructor(@Inject('NotificationHandlerFactory') private notificationHandlerFactory,
              private banUpdateInfoService: BanUpdateInfoService,
              private banSubValidatorsService: BanSubValidatorsService,
              public translation: TranslationService) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedBans'] && this.manageTable) {
      if (UtilsService.notNull(this.manageTable.allEditForm)) {
        this.manageTable.allEditForm = null;
      }
      this.manageTable.initNotLoaded = true;
      this.manageTable.totalRecords = this.totalRecords;
      this.manageTable.resetAllFilters();
      this.banManagementFlow.model = {};
      this.manageCols = [];

      this.lazyColsLoad = true;
      this.alertNotify.clearNotification();
      this.manageTable.totalRecords = this.totalRecords;

      if (this.columns && this.columns.length) {
        let tempCols = [];
        tempCols = [...this.columns.map(col => Object.assign({}, col))];
        this.manageCols = this.setColumnDefinitions(tempCols);
        this.lazyColsLoad = false;
      }
    }
  }

  ngOnInit(): void {
    this.banManageTranslations = BanManagementConfig.banManageTranslations;
    this.onFocussedSubscription = this.banUpdateInfoService.getPayFieldsFocussed().subscribe(focus => {
      this.payFieldFocussed = focus;
    });
    this.inProgressSubscription = this.banUpdateInfoService.getPayFieldsFocussed().subscribe(inProgress => {
      this.payFieldsValidationInProgress = inProgress;
    });
  }


  reviewUpdate() {
    const validForm = !SncrDatatableService.areDirtyFormsInvalid(this.form);
    if (validForm) {
      if (!this.payFieldsValidationInProgress) {
        this.processing = true;
        let editedData = [...this.manageTable.getEditedRows()];
        this.banUpdateInfoService.persistEditedData(editedData, false).then(data => {
          let selectCount = 0;
          this.banUpdateInfoService.getSelectCount(this.reviewConfigId).then(res => {
            this.processing = false;
            selectCount = res && res.count ? res.count : 0;
            if (selectCount) {
              this.alertNotify.clearNotification();
              this.banManagementFlow.model.selectCount = selectCount;
              this.isChanged = !this.isChanged;
              this.banManagementFlow.model.isChanged = this.isChanged;
              this.banManagementFlow.next(this.banManagementFlow.model);
            } else {
              this.printErrorMsg();
            }
          });
        });
      } else {
        this.alertNotify.printErrorNotification(this.translation.translate('ASYNC-PAYFIELDS-VALIDATION-MESSAGE'));
      }
    } else {
      this.alertNotify.printErrorNotification(`<p class="alertTitle">` + this.translation.translate('MANAGE_DETAILS-ERROR_TITLE') + `</p>
        <p>` + this.translation.translate('MANAGE_DETAILS-ERROR_DESCRIPTION') + `</p>`);
    }
  }


  printErrorMsg() {
    this.processing = false;
    this.alertNotify.printErrorNotification(this.translation.translate('MANAGE_DETAILS-NO_CHANGE_INFO'));
  }


  setColumnDefinitions(cols: any[]): Column[] {
    // filter and sorting is not needed for ban management
    cols.forEach(col => {
      // validations to be added here for each of the fields
      let validators = [];
      col.sortable = false;
      col.filter = false;
      validators = this.banSubValidatorsService.buildValidators(col, BanSubConfig.FL_TYPE_BAN, this.pattern, this.countries);
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

    // cols that are editable must be default shown
    return cols.map(col => {
      if (!col.nonEditable || col.nonEditable !== 'Y') {
        col.show = true;
      }
      if ((col.compoundField && col.compoundField.length > 0) || col.field === '71') {
        col.show = false;
      }
      if (BanSubConfig.fieldWidth[BanSubConfig.FL_TYPE_BAN][col.field]) {
        col.width = BanSubConfig.fieldWidth[BanSubConfig.FL_TYPE_BAN][col.field];
      }
      return col;
    });
  }


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.onFocussedSubscription.unsubscribe();
    this.inProgressSubscription.unsubscribe();
  }
}
