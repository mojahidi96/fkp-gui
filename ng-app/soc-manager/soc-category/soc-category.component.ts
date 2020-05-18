import {SncrDatatableComponent} from './../../sncr-components/sncr-datatable/sncr-datatable.component';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {SocCategory} from './category';
import {SocCategoryService} from './soc-category.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {SocCustomValidator} from '../soc-custom-validators';
import {Removable} from '../../sncr-components/sncr-datatable/removable';
import {isUndefined} from 'util';
import {SocManagerService} from '../soc-manager.service';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';

@Component({
  selector: 'soc-category',
  templateUrl: 'soc-category.component.html',
  styleUrls: ['soc-category.component.scss']
})
export class SocCategoryComponent implements OnInit {

  @ViewChild('delete') delCat;
  @ViewChild('sncrData') sncrdataTable: SncrDatatableComponent;

  categoryData: SocCategory[];
  socCols = [];
  selected = new SocCategory();
  selectedCategory = true;
  groupName: string;
  loader: boolean;
  saveForm: FormGroup;
  cols = [];
  toggle: boolean;
  formSubmit: boolean;
  editrow: string;
  removableContent = new Removable();
  resultMessage = [];

  constructor(private categoryService: SocCategoryService,
              private formBuilder: FormBuilder,
              public alertMessage: NotificationHandlerService, private socManageService: SocManagerService) {
  }

  ngOnInit(): void {
    this.resultMessage = ['Keine Kategorien gefunden', 'Eine Kategorie gefunden', 'Kategorien gefunden'];
    this.removableContent.headerTitle = 'Kategorie löschen';
    this.removableContent.name = 'categoryName';
    this.removableContent.bodyTitle1 = 'Möchten die Kategorie';
    this.removableContent.bodyTitle2 = 'und entsprechende Gruppenzuweigung vom gesammten Portal unwideruflich löschen?';

    this.loader = true;
    this.socCols.push(...[
      {
        title: 'Name',
        field: 'categoryName',
        sortable: true,
        show: true,
        editInfo: {
          validators: [Validators.compose([Validators.required, SocCustomValidator,
            Validators.pattern('^[äöüÄÖÜßa-zA-Z0-9\\.\\-\\s]*$'), Validators.maxLength(128), this.categoryNameExist()])], required: true
        }
      }
    ]);

    this.getCategorySocs();

  }


  saveCategory(form) {
    if (form.valid) {
      this.formSubmit = true;
      let socCategory = form.value;
      socCategory.updateStatus = false;
      socCategory.categoryName = socCategory.categoryName.trim().split(/  +/g).join(' ');
      if (socCategory.categoryName) {
        this.categoryService.saveOrUpdate(socCategory).then((data) => {
          this.formSubmit = false;
          if (data.id === '10015') {
            this.alertMessage.printErrorNotification('Bitte geben Sie einen eindeutigen Namen ein');
          } else {
            socCategory.id = data.id;
            this.categoryData.push(socCategory);
            this.resetAll();
            this.alertMessage.printSuccessNotification('Daten wurden gespeichert');
          }
          this.selectedCategory = true;
          this.toggle = false;
          this.resetForm();
        }).catch((ex) => {
          this.getCategorySocs();
          this.formSubmit = false;
          console.log('ex : ' + ex);
          this.alertMessage.printErrorNotification(ex);
        });
      }
    }
  }

  deleteRow(event) {
    this.categoryService.delete(event).then((data) => {
      if (data) {
        this.alertMessage.printSuccessNotification('Daten wurden erfolgreich gelöscht');
        this.selectedCategory = true;
        if (event.editing) {
          this.sncrdataTable.cancelEdit(event);
        }
        const index: number = this.categoryData.indexOf(event);
        if (index !== -1) {
          this.categoryData.splice(index, 1);
          this.resetAll();
        }
      }
    }).catch((ex) => {
      this.getCategorySocs();
      this.alertMessage.printErrorNotification(ex);
    });

  }

  editOpen(event) {
    this.editrow = event.categoryName;
  }

  saveChanges(event) {
    let sc = new SocCategory();
    sc.id = event.id;
    sc.categoryName = event.categoryName.trim().split(/  +/g).join(' ');
    if (sc.categoryName) {
      if (sc.categoryName.toLowerCase() === this.editrow.toLowerCase()) {
        sc.updateStatus = true;
      } else {
        sc.updateStatus = false;
      }
      this.categoryService.saveOrUpdate(sc).then((data) => {
        if (data.id === '10015') {
          this.alertMessage.printErrorNotification('Bitte geben Sie einen eindeutigen Namen ein');
        } else {
          this.alertMessage.printSuccessNotification('Daten wurden aktualisiert');
        }
        this.resetAll();
      }).catch((ex) => {
        this.getCategorySocs();
        this.alertMessage.printErrorNotification(ex);
      });
    }

  }


  rowClick(event) {
    if (event.data) {
      this.selectedCategory = false;
      this.selected = Object.assign({}, event.data);
    }
  }

  creatForm() {
    this.saveForm = this.formBuilder.group({
      categoryName: ['', Validators.compose([Validators.required, SocCustomValidator,
        Validators.pattern('^[äöüÄÖÜßa-zA-Z0-9\\.\\-\\s]*$'), Validators.maxLength(128), categoryNameExistValidator(this.categoryData)])]
    });
  }

  resetForm() {
    this.creatForm();
  }

  resetAll() {
    this.socManageService.resetFilter(this.sncrdataTable);
    this.sncrdataTable.currentValue.sort((a, b) => this.socManageService.restSorting(a, b, this.sncrdataTable));
    this.toggle = false;
    this.selectedCategory = false;
    this.creatForm();
    if (this.sncrdataTable.previousFilters.length === 0) {
      this.sncrdataTable.dt.value = [...this.categoryData];
      this.sncrdataTable.totalRecords = this.sncrdataTable.currentValue.length;
    }
    this.sncrdataTable.goToFirstPage();
  }

  /*clearMessage() {
   setTimeout(() => {
   this.alertMessage.clearNotification();
   }, 2500);

   }*/

  getCategorySocs() {
    this.loader = true;
    this.categoryService.getCategorySocs()
      .then(response => {
        this.categoryData = response;
        this.loader = false;
        this.toggle = false;
        this.selectedCategory = true;
        this.creatForm();
      });
  }

  categoryNameExist(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const categoryName = control.value.trim().toLowerCase().split(/  +/g).join(' ');
      const oldValue = isUndefined(this.editrow) ? '' : this.editrow.toLowerCase();
      if (categoryName && oldValue !== categoryName && (this.categoryData.length > 0)
        && this.categoryData.find(f => f.categoryName.toLowerCase() === categoryName)) {
        return {'SOC_CATEGORY-ERROR-UNIQUE_NAME': true};
      } else {
        return null;
      }
    };
  }
}

export function categoryNameExistValidator(categoryData: any[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (control && UtilsService.notNull(control.value)) {
      const categoryName = control.value.trim().toLowerCase().split(/  +/g).join(' ');
      if (categoryName && (categoryData.length > 0) && categoryData.find(f => f.categoryName.toLowerCase() === categoryName)) {
        return {'SOC_CATEGORY-ERROR-UNIQUE_NAME': true};
      } else {
        return null;
      }
    }
  };
}
