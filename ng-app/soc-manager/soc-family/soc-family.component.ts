/**
 * Created by srao0004 on 5/23/2017.
 */
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Column} from '../../sncr-components/sncr-datatable/column';
import {ActivatedRoute} from '@angular/router';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {SocFamilyService} from './soc-family.service';
import {SocFamily} from './socfamily';
import {SocCustomValidator} from '../soc-custom-validators';
import {isUndefined} from 'util';
import {Removable} from '../../sncr-components/sncr-datatable/removable';
import {SocManagerService} from '../soc-manager.service';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';
import {TranslationService} from 'angular-l10n';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';

@Component({
  selector: 'soc-family',
  templateUrl: 'soc-family.component.html',
  styleUrls: ['soc-family.component.scss']
})

export class SocFamilyComponent implements OnInit {

  @ViewChild('sncrData') sncrDatatable: SncrDatatableComponent;
  @ViewChild('settings', {static: true}) settingsTemplate: TemplateRef<any>;

  socFamilyList: SocFamily[];
  columns: Column[] = [];
  selected = [];
  editFamilyName: string;
  selectedRow = [];
  formGroup: FormGroup;
  cols = [];
  toggle = false;
  loading = true;
  formSubmitting: boolean;
  removableContent = new Removable();
  settings: any;
  settingsFields: string[];

  constructor(private socFamilyService: SocFamilyService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public alertMessage: NotificationHandlerService,
              private socManagerService: SocManagerService,
              private translationService: TranslationService) {

  }

  ngOnInit(): void {
    this.removableContent.headerTitle = 'SOC_FAMILY-REMOVABLE-HEADER';
    this.removableContent.name = 'familyName';
    this.removableContent.bodyMessage = 'SOC_FAMILY-REMOVABLE-BODY';
    this.settings = {
      M: this.translationService.translate('SOC_FAMILY-SETTINGS-OPTIONS-MANDATORY'),
      O: this.translationService.translate('SOC_FAMILY-SETTINGS-OPTIONS-OPTIONAL'),
      H: this.translationService.translate('SOC_FAMILY-SETTINGS-OPTIONS-NOT_ALLOWED')
    };

    this.settingsFields = ['twog', 'threeg', 'blackberry', 'smartphone', 'iphone', 'datenstick', 'netbook', 'simonly'];
    const valueFunction = value => this.settings[value];
    this.columns = [
      {
        title: 'SOC_FAMILY-LIST-NAME',
        field: 'familyName',
        sortable: true,
        type: 'text',
        show: true,
        editInfo: {
          type: 'text', validators: [Validators.compose([Validators.required, SocCustomValidator,
            this.familyNameExist(), Validators.maxLength(254),
            Validators.pattern('^[äöüÄÖÜßa-zA-Z0-9\\.\\-\\s]*$')])], required: true
        },
      },
      ...this.settingsFields.map(s => {
        return {
          title: 'SOC_FAMILY-SETTINGS-' + s.toUpperCase(),
          field: s,
          sortable: true,
          bodyTemplate: this.settingsTemplate,
          show: true,
          editInfo: {
            type: 'select',
            options: [
              {text: this.settings.O, value: 'O'},
              {text: this.settings.H, value: 'H'},
              {text: this.settings.M, value: 'M'}
            ],
            hideSelectionTitle: true
          },
          valueFunction
        }
      })
    ];

    this.getSocFamilies();
  }

  saveFamily(form) {
    if (form.valid) {
      this.save(form.value);
    }
  }

  save(value, isUpdate = false) {
    this.formSubmitting = true;
    let socFamily: SocFamily = value;
    socFamily.familyName = socFamily.familyName.trim().split(/  +/g).join(' ');

    if (socFamily.familyName) {
      socFamily.updateStatus = isUpdate && socFamily.familyName.toLowerCase() === this.editFamilyName.toLowerCase();
      this.socFamilyService.saveOrUpdate(socFamily)
        .then((data) => {
          if (data.id === '10015') {
            socFamily = null;
            this.alertMessage.printErrorNotification('SOC_FAMILY-ERROR-UNIQUE_NAME');
          } else {
            socFamily.id = data.id;
            if (!isUpdate) {
              this.settingsFields.forEach(s => socFamily[s] = 'O');
              this.socFamilyList.push(socFamily);
              this.resetAll();
            }
            this.alertMessage.printSuccessNotification('SOC_FAMILY-MESSAGE-DATA_SAVED');
          }
        })
        .catch(ex => {
          this.getSocFamilies();
          this.alertMessage.printErrorNotification(ex);
        })
        .then(() => this.formSubmitting = false);
    }
  }

  deleteRow(event) {
    this.socFamilyService.delete(event).then((data) => {
      console.log(data);
      if (data.toString() === '10016') {
        this.alertMessage.printErrorNotification('SOC_FAMILY-ERROR-LINKED_TARIFFS');
      } else if (data.toString() === 'true') {
        this.alertMessage.printSuccessNotification('SOC_FAMILY-MESSAGE-DATA_DELETED');
        const index: number = this.socFamilyList.indexOf(event);
        if (index !== -1) {
          this.socFamilyList.splice(index, 1);
          this.resetAll();
        }
      }
    }).catch((ex) => {
      this.getSocFamilies();
      this.alertMessage.printErrorNotification(ex);
    });

  }

  editOpen(event) {
    this.editFamilyName = event.familyName;
  }

  creatForm() {
    this.formGroup = this.formBuilder.group(
      {
        familyName: ['', Validators.compose([Validators.required, SocCustomValidator,
          Validators.pattern('^[äöüÄÖÜßa-zA-Z0-9\\.\\-\\s]*$'), Validators.maxLength(254),
          familyNameExistValidator(this.socFamilyList)])]
      }
    );
  }

  resetAll() {
    this.creatForm();
    this.toggle = false;
    this.socManagerService.resetFilter(this.sncrDatatable);
    this.sncrDatatable.currentValue.sort((a, b) => this.socManagerService.restSorting(a, b, this.sncrDatatable));
    if (this.sncrDatatable.previousFilters.length === 0) {
      this.sncrDatatable.dt.value = [...this.socFamilyList];
      this.sncrDatatable.totalRecords = this.sncrDatatable.currentValue.length;
    }
    this.sncrDatatable.goToFirstPage();
  }

  getSocFamilies() {
    this.loading = true;
    this.socFamilyService.getSocFamilies().subscribe((response) => {
      this.socFamilyList = response.map(socFamily => {
        this.settingsFields.forEach(s => socFamily[s] = socFamily[s] || 'O');
        return socFamily;
      });
      this.loading = false;
      this.toggle = false;
      this.creatForm();
    });
  }

  familyNameExist(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const name = control.value.trim().toLowerCase().split(/  +/g).join(' ');
      const oldValue = isUndefined(this.editFamilyName) ? '' : this.editFamilyName.toLowerCase();
      if (name && oldValue !== name && (this.socFamilyList.length > 0) &&
        this.socFamilyList.find(f => f.familyName.toLowerCase() === name)) {
        return {'SOC_FAMILY-ERROR-UNIQUE_NAME': true};
      } else {
        return null;
      }
    };
  }

  getSettings(setting) {
    return this.settings[setting];
  }
}

export function familyNameExistValidator(familyList: any[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (control && UtilsService.notNull(control.value)) {
      const name = control.value.trim().toLowerCase().split(/  +/g).join(' ');
      if (name && (familyList.length > 0) && familyList.find(f => f.familyName.toLowerCase() === name)) {
        return {'SOC_FAMILY-ERROR-UNIQUE_NAME': true};
      } else {
        return null;
      }
    }
  };
}
