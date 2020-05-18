/**
 * Created by bhav0001 on 08-Mar-17.
 */
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActiveSocService} from './active-soc.service';
import {Column} from '../../sncr-components/sncr-datatable/column';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {Soc} from '../soc-blacklisted/Soc';
import {SocCustomValidator} from '../soc-custom-validators';
import {Removable} from '../../sncr-components/sncr-datatable/removable';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {sanitizationValidation} from '../soc-common/sanitization-validation';
import {CurrencyPipe} from '@angular/common';
import {SocManagerService} from '../soc-manager.service';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'tariff-options',
  templateUrl: 'active-soc.component.html',
  styleUrls: ['active-soc.component.scss']
})
export class TariffOptionsComponent implements OnInit {
  activeSocs: Soc[];
  columns: Column[] = [];
  selected = [];
  @ViewChild('enable', {static: true}) enableTemplate;
  @ViewChild('description', {static: true}) desTemplate;
  @ViewChild('weblink', {static: true}) webTemplate;
  @ViewChild('doclink', {static: true}) docTemplate;
  @ViewChild('kind', {static: true}) kindTemplate;
  @ViewChild('sncrData') sncrdataTable: SncrDatatableComponent;
  editrow = false;
  selectedRow = [];
  oldFamilyName: string;
  saveForm: FormGroup;
  cols = [];
  toggle: boolean;
  triggerSocs = [];
  socFamilies = [];
  triggerdisabled = false;
  loader = false;
  formSubmitting: boolean;
  removableContent = new Removable();
  resultMessage = [];
  linkUrls = [];
  kindData = [];

  constructor(
    private activeSocService: ActiveSocService,
    private formBuilder: FormBuilder,
    public alertMessage: NotificationHandlerService,
    private currencyPipe: CurrencyPipe,
    private socManagerService: SocManagerService
  ) {}

  ngOnInit(): void {
    this.removableContent.headerTitle = 'Tarifoption löschen';
    this.removableContent.name = 'socName';
    this.removableContent.bodyTitle1 = 'Die Tarifoption';
    this.removableContent.bodyTitle2 =
      'wird aus dem gesamten Portal inkl.' +
      ' aller Kunden-Shops unwiderruflich gelöscht. Möchten Sie die Tarifoption trotzdem löschen?';

    this.resultMessage = [
      'Keine Tarifoptionen gefunden',
      'Eine Tarifoption gefunden',
      'Tarifoptionen gefunden'
    ];

    this.getValidUrls();

    this.kindData = [
      {text: 'Daten', kindValue: 'DATA', value: 'Daten'},
      {
        text: 'Sprache',
        kindValue: 'VOICE',
        value: 'Sprache'
      },
      {text: 'Trigger', kindValue: 'TRIGGER', value: 'Trigger'}
    ];
    // noinspection TypeScriptValidateTypes
    this.columns = [
      {
        title: 'Aktiv',
        field: 'status',
        type: 'boolean',
        sortable: true,
        show: true,
        filter: false,
        bodyTemplate: this.enableTemplate
      },
      {
        title: 'SOC Code',
        field: 'socId',
        sortable: true,
        type: 'text',
        show: true,
        nonEditable: true
      },
      {
        title: 'Familie',
        field: 'familyName',
        show: true,
        type: 'text',
        editInfo: {
          type: 'select',
          options: this.socFamilies,
          validators: [Validators.compose([this.familyEditValidation()])],
          required: false
        },
        sortable: true
      },
      {
        title: 'Name',
        field: 'socName',
        show: true,
        editInfo: {
          type: 'text',
          validators: [
            Validators.compose([
              Validators.required,
              SocCustomValidator,
              Validators.maxLength(254),
              sanitizationValidation
            ])
          ],
          required: true
        },

        sortable: true
      },
      {
        title: 'Beschreibung',
        field: 'description',
        show: true,
        bodyTemplate: this.desTemplate,
        editInfo: {
          type: 'textarea',
          validators: [
            Validators.compose([
              Validators.required,
              SocCustomValidator,
              Validators.maxLength(4000),
              sanitizationValidation
            ])
          ],
          required: true
        },
        sortable: true,
        ellipsis: true
      },
      {
        title: 'Kategorien',
        field: 'categories',
        show: true,
        nonEditable: true,
        sortable: true
      },
      {
        title: 'Gruppen',
        field: 'groups',
        show: true,
        nonEditable: true,
        sortable: true
      },
      {
        title: 'Typ',
        field: 'kindText',
        show: true,
        sortable: true,
        type: 'text',
        bodyTemplate: this.kindTemplate,
        editInfo: {
          validators: [
            Validators.compose([
              Validators.required,
              Validators.maxLength(7),
              this.validateType()
            ])
          ],
          required: true,
          type: 'select',
          options: this.kindData
        }
      },
      {
        title: 'Trigger',
        field: 'trigger',
        show: true,
        sortable: true,
        type: 'text',
        editInfo: {
          validators: [Validators.compose([this.triggerTypeValidation()])],
          type: 'select',
          options: this.triggerSocs
        }
      },
      {
        title: 'Preis (€)',
        field: 'convertBasePrice',
        type: 'price',
        show: true,
        sortFunction: event => this.customSortOrder(event),
        editInfo: {
          type: 'price',
          validators: [
            Validators.compose([
              Validators.required,
              Validators.maxLength(9),
              this.validateGermanCurrency(),
              Validators.pattern('^\\d{1,3}(?:\\,\\d{2})?$')
            ])
          ],
          required: true
        },
        sortable: true
      },
      {
        title: 'Laufzeit',
        field: 'duration',
        type: 'number',
        show: true,
        sortable: true
      },
      {
        title: 'Abwählbar',
        field: 'removable',
        type: 'boolean',
        show: true,
        sortable: true,
        filter: false
      },
      {
        title: 'Webseite',
        field: 'webLink',
        show: true,
        sortable: true,
        bodyTemplate: this.webTemplate,
        editInfo: {
          validators: [
            Validators.compose([
              this.linkValidator(),
              Validators.maxLength(128)
            ])
          ]
        }
      },
      {
        title: 'PDF-Link',
        field: 'documentLink',
        show: true,
        sortable: true,
        bodyTemplate: this.docTemplate,
        editInfo: {
          validators: [
            Validators.compose([
              this.linkValidator(),
              Validators.maxLength(128)
            ])
          ]
        }
      }
    ];

    this.loader = true;
    forkJoin([
      this.activeSocService.getActiveSocs(),
      this.activeSocService.getSocFamilies(),
      this.activeSocService.getActiveTriggerSocs()
    ]).subscribe(results => {
      let socsTemp = results[0];
      if (socsTemp) {
        socsTemp.forEach(s => {
          if (s.categoryName) {
            s.categories = s.categoryName.join(',');
          }
          if (s.groupName) {
            s.groups = s.groupName.join(',');
          }
        });
      }
      this.activeSocs = socsTemp;

      this.socFamilies = results[1]
        .map(v => ({
          text: v.familyName,
          value: v.familyName,
          familyId: v.id
        }))
        .sort((a, b) => {
          return (
            a.value
              .toLocaleLowerCase()
              .localeCompare(b.value.toLocaleLowerCase()) * 1
          );
        });
      this.triggerSocs = results[2].map(v => ({
        text: v.socName,
        value: v.socId
      }));
      this.selected = this.activeSocService.getFilterList(this.activeSocs);
      this.loader = false;
      this.creatForm();
    });
    this.toggle = false;
  }

  saveChanges(event) {
    this.formSubmitting = true;
    console.log('Select Event in tariff opt to save is =', event);
    event.updateSoc = true;
    event.socId = event.socId
      .trim()
      .split(/  +/g)
      .join(' ');
    event.familyId = event.familyName
      ? this.socFamilies.find(f => f.text === event.familyName).familyId
      : 'dummy_trigger_family';
    event.kind = this.kindData.find(f => f.text === event.kindText).kindValue;
    event.familyName = event.familyName ? event.familyName : null;
    event.trigger = event.trigger ? event.trigger : null;
    event.oldFamilyName = this.oldFamilyName ? this.oldFamilyName : null;
    this.activeSocService
      .updateActiveSoc(event)
      .then(data => {
        this.formSubmitting = false;
        this.alertMessage.printSuccessNotification('Daten wurden aktualisiert');
        this.resetAll();
        document
          .querySelector('.ui-datatable')
          .classList.remove('ui-datatable-disabled');
      })
      .catch(ex => this.errorHandling(ex));
    this.editrow = false;
  }

  saveRow(event) {
    if (event.valid) {
      this.formSubmitting = true;
      let soc = event.value;
      soc.updateSoc = false;
      soc.socId = soc.socId
        .trim()
        .toUpperCase()
        .split(/  +/g)
        .join(' ');
      soc.familyId = soc.familyName
        ? this.socFamilies.find(f => f.text === soc.familyName).familyId
        : 'dummy_trigger_family';
      soc.kind = this.kindData.find(f => f.text === soc.kindText).kindValue;
      soc.familyName = soc.familyName ? soc.familyName : null;
      soc.trigger = soc.trigger ? soc.trigger : null;
      console.log('Select Event in tariff opt to save is =', soc);
      this.activeSocService
        .updateActiveSoc(soc)
        .then(data => {
          this.formSubmitting = false;
          if (data['id'] === '10015') {
            this.alertMessage.printErrorNotification(
              'Bitte geben Sie einen eindeutigen Namen ein'
            );
          } else {
            soc.id = data.id;
            this.activeSocs.push(soc);
            this.resetAll();
            this.alertMessage.printSuccessNotification(
              'Daten wurden gespeichert'
            );
          }
          this.toggle = false;
          this.resetForm();
        })
        .catch(ex => this.errorHandling(ex));
    }
  }

  editOpen(event) {
    this.editrow = event.editing;
    this.selectedRow = Object.assign({}, event);
    this.oldFamilyName = event.familyName;
    this.columns.find(
      c => c.field === 'trigger'
    ).editInfo.options = this.triggerSocs;
    this.columns.find(
      c => c.field === 'familyName'
    ).editInfo.options = this.socFamilies;
  }

  getSocPrice(amount): string {
    let price = `${this.currencyPipe.transform(
      parseFloat(amount),
      'EUR',
      'symbol',
      '1.2-2'
    )}`;
    return price !== 'null' ? price.replace('€', '').trim() : '';
  }

  onSelectEnable(row) {
    document
      .querySelector('.ui-datatable')
      .classList.add('ui-datatable-disabled');
    this.selected = this.activeSocService.getFilterList(this.activeSocs);
    console.log('edit ', this.editrow);
    if (!this.editrow) {
      this.saveChanges(row);
    }
  }

  openToggle() {
    this.toggle = !this.toggle;
    this.saveForm.controls['trigger'].setValue('');
  }

  creatForm() {
    let group: any = {};
    this.saveForm = this.formBuilder.group({
      status: [true, Validators.required],
      socId: [
        '',
        Validators.compose([
          Validators.required,
          SocCustomValidator,
          socIdExistValidator(this.activeSocs),
          Validators.maxLength(9),
          Validators.pattern('^[äöüÄÖÜßa-zA-Z0-9\\_]*$')
        ])
      ],

      familyId: [''],
      familyName: ['', this.familyValidation()],
      socName: [
        '',
        Validators.compose([
          Validators.required,
          SocCustomValidator,
          Validators.maxLength(254),
          sanitizationValidation
        ])
      ],
      description: [
        '',
        Validators.compose([
          Validators.required,
          SocCustomValidator,
          Validators.maxLength(4000),
          sanitizationValidation
        ])
      ],
      kindText: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(7),
          this.kindValidator()
        ])
      ],
      trigger: ['', Validators.maxLength(9)],
      convertBasePrice: [
        '',
        Validators.compose([Validators.required, this.validateGermanCurrency()])
      ],
      duration: [''],
      removable: [''],
      webLink: [
        '',
        Validators.compose([this.linkValidator(), Validators.maxLength(128)])
      ],
      documentLink: [
        '',
        Validators.compose([this.linkValidator(), Validators.maxLength(128)])
      ]
    });
  }

  resetForm() {
    this.creatForm();
  }

  resetAll() {
    this.socManagerService.resetFilter(this.sncrdataTable);
    if (this.sncrdataTable.dt.sortField === 'convertBasePrice') {
      let priceOrder = {order: this.sncrdataTable.dt.sortOrder};
      this.customSortOrder(priceOrder);
    } else {
      this.sncrdataTable.currentValue.sort((a, b) =>
        this.socManagerService.restSorting(a, b, this.sncrdataTable)
      );
    }
    if (this.sncrdataTable.previousFilters.length === 0) {
      this.sncrdataTable.dt.value = [...this.activeSocs];
      this.sncrdataTable.totalRecords = this.sncrdataTable.currentValue.length;
    }
    this.sncrdataTable.goToFirstPage();
    this.getActiveTriggerSocs();
    this.selected = this.activeSocService.getFilterList(this.activeSocs);
  }

  customSortOrder(event) {
    this.sncrdataTable.previousSort.field = 'convertBasePrice';
    this.sncrdataTable.previousSort.order = event.order;
    this.sncrdataTable.currentValue.sort((a, b) =>
      this.sortByBasePrice(a, b, event)
    );
    this.sncrdataTable.currentValue = [...this.sncrdataTable.currentValue];
  }

  deleteRow(event) {
    this.activeSocService
      .delete(event)
      .then(data => {
        if (data) {
          this.alertMessage.printSuccessNotification(
            'Daten wurden erfolgreich gelöscht'
          );
          if (event.editing) {
            this.sncrdataTable.cancelEdit(event);
          }
          const index: number = this.activeSocs.indexOf(event);
          if (index !== -1) {
            this.activeSocs.splice(index, 1);
            this.resetAll();
          }
        }
      })
      .catch(ex => {
        this.errorHandling(ex);
      });
  }

  reSet() {
    this.loader = true;
    this.activeSocService.getActiveSocs().subscribe(response => {
      this.activeSocs = response;
      this.selected = this.activeSocService.getFilterList(this.activeSocs);
      this.loader = false;
      this.toggle = false;
      this.resetForm();
      this.getActiveTriggerSocs();
    });
    this.sncrdataTable.resetAllFilters();
  }

  getActiveTriggerSocs() {
    this.activeSocService.getActiveTriggerSocs().subscribe(response => {
      this.triggerSocs = response.map(v => ({text: v.socName, value: v.socId}));
    });
  }

  getValidUrls() {
    this.activeSocService.getValidUrls().then(response => {
      this.linkUrls = response;
    });
  }

  linkValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (control['value'] !== '' && UtilsService.notNull(control['value'])) {
        let valid = this.linkUrls.find(regex => {
          if (control['value'] && control['value'].includes(regex)) {
            return true;
          }
        });
        if (!valid) {
          return {'SOC_ACTIVE-ERROR-VALID_URL': true};
        }
      }
      return null;
    };
  }

  validateGermanCurrency(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let value = control['value'];
      if (value !== '' && UtilsService.notNull(value)) {
        let newValue = value
          .toString()
          .replace(',', '.')
          .trim();
        if (parseFloat(newValue) >= 0.0 && parseFloat(newValue) <= 999.99) {
          return null;
        } else {
          return {'SOC_ACTIVE-ERROR-EXCEED_LIMIT': true};
        }
      }
    };
  }

  validateType(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let kindText = control['value'];
      let trigger;
      if (
        UtilsService.notNull(this.sncrdataTable.editForm) &&
        UtilsService.notNull(this.sncrdataTable.editForm.controls['trigger'])
      ) {
        trigger = this.sncrdataTable.editForm.controls['trigger'].value;
        this.sncrdataTable.editForm.controls[
          'familyName'
        ].updateValueAndValidity();
      }
      if (
        UtilsService.notNull(trigger) &&
        kindText === 'Trigger' &&
        trigger.trim() !== ''
      ) {
        return {TRIGGERERROR: true};
      } else {
        return null;
      }
    };
  }

  triggerTypeValidation(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (
        UtilsService.notNull(this.sncrdataTable.editForm) &&
        UtilsService.notNull(
          this.sncrdataTable.editForm.controls['kindText']
        ) &&
        control['value'] !== null
      ) {
        this.sncrdataTable.editForm.controls[
          'kindText'
        ].updateValueAndValidity();
      } else if (UtilsService.notNull(this.sncrdataTable.editForm)) {
        this.sncrdataTable.editForm.controls['trigger'].setValue('');
      }
      return null;
    };
  }

  familyValidation(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let family = control['value'];
      let kindText;

      if (
        UtilsService.notNull(this.saveForm) &&
        UtilsService.notNull(this.saveForm.controls['familyName'])
      ) {
        if (family === '') {
          return {required: true};
        }
        return null;
      }
    };
  }

  familyEditValidation(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let family = control['value'];
      if (
        UtilsService.notNull(this.sncrdataTable.editForm) &&
        family !== null
      ) {
        this.columns.find(
          c => c.field === 'familyName'
        ).editInfo.required = true;
        if (family === '') {
          return {required: true};
        }
        return null;
      } else {
        if (UtilsService.notNull(this.sncrdataTable.editForm)) {
          this.sncrdataTable.editForm.controls['familyName'].setValue('');
        }
      }
    };
  }

  kindValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (control['value'] === 'Trigger') {
        this.triggerdisabled = true;
        if (!this.saveForm.controls['convertBasePrice'].value) {
          this.saveForm.controls['convertBasePrice'].setValue('0,00');
        }
      } else {
        this.triggerdisabled = false;
      }
      if (UtilsService.notNull(this.saveForm)) {
        this.saveForm.controls['familyName'].updateValueAndValidity();
        this.saveForm.controls['trigger'].setValue('');
      }
      return null;
    };
  }

  private sortByBasePrice(a, b, event) {
    let order1 = a.convertBasePrice
      ? a.convertBasePrice
          .toString()
          .replace(',', '.')
          .trim()
      : null;
    let order2 = b.convertBasePrice
      ? b.convertBasePrice
          .toString()
          .replace(',', '.')
          .trim()
      : null;
    let result = null;
    let value1 = order1 ? parseFloat(order1) : null;
    let value2 = order2 ? parseFloat(order2) : null;
    if (value1 == null && value2 != null) {
      result = -1;
    } else if (value1 != null && value2 == null) {
      result = 1;
    } else if (value1 == null && value2 == null) {
      result = 0;
    } else {
      result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
    }
    return event.order * result;
  }

  private errorHandling(ex) {
    this.reSet();
    this.formSubmitting = false;
    this.alertMessage.printErrorNotification(ex);
  }
}

export function socIdExistValidator(activesocs: any[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if (control && UtilsService.notNull(control.value)) {
      const socId = control.value
        .trim()
        .toLowerCase()
        .split(/  +/g)
        .join(' ');

      if (
        socId &&
        activesocs.length > 0 &&
        activesocs.find(f => f.socId.toLowerCase() === socId)
      ) {
        return {'SOC_ACTIVE-ERROR-UNIQUE_NAME': true};
      } else {
        return null;
      }
    }
  };
}
