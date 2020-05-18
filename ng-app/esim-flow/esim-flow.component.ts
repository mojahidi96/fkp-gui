import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Language, TranslationService} from 'angular-l10n';
import {EsimFlowService} from './esim-flow.service';
import {ActivatedRoute} from '@angular/router';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {EsimConfig} from './esim.config';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../sncr-components/sncr-controls/custom-validators';
import {Column} from '../sncr-components/sncr-datatable/column';
import {SncrDatatableComponent} from '../sncr-components/sncr-datatable/sncr-datatable.component';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';


@Component({
  selector: 'esim-flow',
  templateUrl: 'esim-flow.component.html',
  styleUrls: ['esim-flow.component.scss']
})

export class EsimFlowComponent implements OnInit {
  @Language() lang: string;
  columns = [];
  originalColumns = [];
  lazyLoadUrl: string;
  processing = false;
  panels = [];
  activePanel: number;
  configId: string;
  statusList: any;
  orderFalloutForm: FormGroup;
  showCancelDD = false;
  currentPanel: any;
  cancelOptions: any;
  showDataTable = true;
  defaultCancelOption: any;
  formData: any;
  showValidation = false;
  allordersportal = false;
  private patternMap: any;
  @ViewChild('orderLink', {static: true}) orderLink;
  @ViewChild('receivedEpochTime', {static: true}) receivedEpochTime;
  @ViewChild('responseEpochTime', {static: true}) responseEpochTime;
  @ViewChild('esimTable') eSimDatatable: SncrDatatableComponent;

  constructor(protected route: ActivatedRoute,
              public subsAlert: NotificationHandlerService,
              public translation: TranslationService,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
              private fb: FormBuilder, private esimService: EsimFlowService) {

  }

  ngOnInit() {
    this.defaultCancelOption = this.translation.translate('ESIM_CANCEL-OPTION');
    this.route.data.subscribe((data: {columns: any, lazyCount: any[], configId: any, pattern: any}) => {
      this.originalColumns = data.columns.filter(c => c.field !== '1');
      this.setColumnTemplate(this.originalColumns, '7', this.orderLink);
      this.setColumnTemplate(this.originalColumns, '10', this.receivedEpochTime);
      this.setColumnTemplate(this.originalColumns, '11', this.responseEpochTime);
      this.configId = data.configId;
      this.patternMap = data.pattern ? data.pattern : '';
    });
    this.panels = EsimConfig.panelList;
    this.activePanel = EsimConfig.defaultActivePanel;
    this.lazyLoadUrl = '/buyflow/rest/table/custom/' + this.configId + '_' + EsimConfig.defaultConfig;
    this.resetPanel();
    this.getStatusList(EsimConfig.defaultConfig);
  }

  onRowSelect() {
    if (!this.allordersportal &&
      (this.eSimDatatable.selection.length === this.eSimDatatable.selection.filter(el => el[3] === 'P').length)) {
      if (this.orderFalloutForm.get('falloutStatus').value === '11') {
        this.showCancelDD = false;
        this.orderFalloutForm.get('cancel').disable();
      }
      this.allordersportal = true;
      this.orderFalloutForm.get('customerInfo').setValidators([Validators.maxLength(4000),
        CustomValidators.sanitization(this.patternMap)]);
      this.orderFalloutForm.get('customerInfo').updateValueAndValidity();
    }
    if (this.allordersportal && 
      this.eSimDatatable.selection.length !== this.eSimDatatable.selection.filter(el => el[3] === 'P').length) {
      if (this.orderFalloutForm.get('falloutStatus').value === '11') {
        this.showCancelDD = true;
        (this.orderFalloutForm.get('cancel')) ? this.orderFalloutForm.get('cancel').enable() :
          this.orderFalloutForm.addControl('cancel', new FormControl(this.defaultCancelOption));
        let currentConfig = this.currentPanel && this.currentPanel.statusConfig;
        this.getCancelOptions((currentConfig) ? this.currentPanel.statusConfig : (EsimConfig.defaultConfig));
        this.orderFalloutForm.get('cancel').setValidators([Validators.required]);
      }
      this.allordersportal = false;
      this.orderFalloutForm.get('customerInfo').setValidators([Validators.maxLength(4000),
        Validators.required, CustomValidators.sanitization(this.patternMap)]);
      this.orderFalloutForm.get('customerInfo').updateValueAndValidity();
    }
  }

    dynamicAddOrRemoveCancelDropdown() {
      this.orderFalloutForm.get('customerInfo').setValidators([Validators.maxLength(4000),
        CustomValidators.sanitization(this.patternMap)]);
      this.orderFalloutForm.get('customerInfo').updateValueAndValidity();
      this.orderFalloutForm.get('falloutStatus').clearValidators();
      this.orderFalloutForm.get('falloutStatus').updateValueAndValidity();
      this.showValidation = false;
      let dropstatus = this.orderFalloutForm.get('falloutStatus').value;
      this.showCancelDD = false;
      if (dropstatus === '11' && 
        this.eSimDatatable.selection.length !== this.eSimDatatable.selection.filter(el => el[3] === 'P').length) {
        this.orderFalloutForm.addControl('cancel', new FormControl(this.defaultCancelOption));
        this.orderFalloutForm.get('cancel').enable();
        this.orderFalloutForm.get('falloutStatus').setValidators([Validators.required]);
        this.orderFalloutForm.get('cancel').setValidators([Validators.required]);
        this.orderFalloutForm.get('customerInfo').setValidators([Validators.maxLength(4000),
          Validators.required, CustomValidators.sanitization(this.patternMap)]);
        this.showCancelDD = true;
        let currentConfig = this.currentPanel && this.currentPanel.statusConfig;
        this.getCancelOptions((currentConfig) ? this.currentPanel.statusConfig : (EsimConfig.defaultConfig));
      } else if (dropstatus && dropstatus !== '11') {
        if (this.orderFalloutForm.get('cancel')) {
          this.orderFalloutForm.get('cancel').disable();
        }
        this.orderFalloutForm.get('customerInfo').setValidators([Validators.maxLength(4000),
          CustomValidators.sanitization(this.patternMap)]);
        this.showCancelDD = false;
      } else {
        this.orderFalloutForm.get('customerInfo').setValidators([Validators.maxLength(4000),
          CustomValidators.sanitization(this.patternMap)]);
      }

  }

  createForm() {
    this.orderFalloutForm = this.fb.group({
      falloutStatus: ['', Validators.required],
      customerInfo: ['', [Validators.maxLength(4000), CustomValidators.sanitization(this.patternMap)]]
    });
  }

  getPanelOpened(id: any) {
    return this.panels.find(panel => 'panel_' + panel.id === id);
  }


  onUncheckTableRows(event?: any) {
    this.onRowSelect();
    if (this.eSimDatatable?.selectCount === 0 || (UtilsService.notNull(event?.checked) && event.checked === false)) {
      this.orderFalloutForm.reset();
      this.restoreFormToInitialState();
      this.showCancelDD = false;
    }
  }

  panelChange(event: any): void {
    this.allordersportal = false;
    this.showDataTable = false;
    this.esimService.clearSession().subscribe(res => {
      if (res) {
        this.orderFalloutForm.reset();
        this.resetPanel();
        this.currentPanel = this.getPanelOpened(event.panelId);
        this.lazyLoadUrl = '/buyflow/rest/table/custom/' + this.configId + '_' + this.currentPanel.statusConfig;
        this.getStatusList(this.currentPanel.statusConfig);
        this.showCancelDD = false;
        this.showDataTable = true;
      }
    });
  }

  resetPanel() {
    this.allordersportal = false;
    this.columns = [...this.originalColumns.map(x => Object.assign({}, x))];
    this.createForm();
  }

  getStatusList(statusConfig: any) {
    this.esimService.getStatusList(statusConfig).subscribe(resp => {
      this.statusList = resp;
    });
  }

  getCancelOptions(panelconfig: any) {
    this.esimService.getCancelOptions(panelconfig).subscribe(response => {
      this.cancelOptions = response;
    });
    this.orderFalloutForm.get('cancel').setValue(this.defaultCancelOption);
  }

  submitFormChanges(panelId: any) {
    let lazyParams: any = this.eSimDatatable.lazyParams;
    lazyParams['selectAll'] = this.eSimDatatable.dt.allSelected;
    lazyParams['selections'] = [];
    this.eSimDatatable.selectedMap.forEach( item => {
      lazyParams.selections.push(item);
    });
    this.esimService.persistSelections(lazyParams).then(response => {
      if (response) {
        this.showDataTable = false;
        this.formData = {
          '19': this.orderFalloutForm.get('falloutStatus')?.value,
          '20': this.orderFalloutForm.get('cancel')?.value,
          '21': this.orderFalloutForm.get('customerInfo')?.value
        };
        this.esimService.submitFormData(this.formData).then(resp => {
          if (resp) {
            this.esimService.clearSession().subscribe(res => {
              if (res) {
                this.resetPanel();
                this.currentPanel = this.panels.filter(panel => panel.id === panelId)[0];
                this.lazyLoadUrl = '/buyflow/rest/table/custom/' + this.configId + '_' + this.currentPanel.statusConfig;
                this.getStatusList(this.currentPanel.statusConfig);
                this.showCancelDD = false;
                this.showDataTable = true;
              }
            });
          }
        });
        this.restoreFormToInitialState();
      }
    });
  }

  saveFalloutStatus(panelId: any) {
    this.showValidation = true;
    this.orderFalloutForm.get('falloutStatus').setValidators([Validators.required]);
    this.orderFalloutForm.get('falloutStatus').updateValueAndValidity();
    this.orderFalloutForm.get('customerInfo').updateValueAndValidity();
    if (this.orderFalloutForm.valid) {
      this.submitFormChanges(panelId);
    }
  }

  restoreFormToInitialState() {
    this.orderFalloutForm = this.fb.group({
      falloutStatus: ['', Validators.required],
      customerInfo: ['', [Validators.maxLength(4000), CustomValidators.sanitization(this.patternMap)]]
    })
  }

  setColumnTemplate(cols: Column[], field: string, template: any) {
    if (cols && cols.find(c => c.field === field) && !cols.find(c => c.field === field).bodyTemplate) {
      cols.find(c => c.field === field).bodyTemplate = template;
    }
  }

  asIsOrder(a, b) {
    return 1;
  }
}

