import {FormGroup, Validators} from '@angular/forms';
import {SocCategory} from './../category';
import {SocCategoryAslService} from './soc-category-asl.service';
import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {SncrDatatableComponent} from '../../../sncr-components/sncr-datatable/sncr-datatable.component';
import {Removable} from '../../../sncr-components/sncr-datatable/removable';
import {SocManagerService} from '../../soc-manager.service';
import {Soc} from '../../soc-blacklisted/Soc';
import {ActiveSocGroupModelComponent} from '../../soc-groups/active-soc-group/activesoc-group-model.component';

@Component({
  selector: 'soc-category-asl',
  templateUrl: 'soc-category-asl.component.html',
  styleUrls: ['soc-category-aslform.component.scss']
})

export class SocCategoryAslComponent implements OnInit, OnChanges {

  @ViewChild('activeT') activesocModel: ActiveSocGroupModelComponent;
  @ViewChild('sncrtable') sncrTable: SncrDatatableComponent;
  @ViewChild('socCategoryAsl') socCategoryAsl: ElementRef;
  @Input() socCategory = new SocCategory();
  removableContent = new Removable();
  socData = [];
  socCols = [];
  loader: boolean;
  saveForm: FormGroup;
  cols = [];
  activeSocs = [];
  editRowSocId: string;
  resultMessage = [];

  constructor(private socCategoryAslService: SocCategoryAslService,
              private alertMessage: NotificationHandlerService, private socManagerService: SocManagerService) {
  }


  ngOnInit() {
    this.resultMessage = ['Keine Tarifoptionen gefunden', 'Eine Tarifoption gefunden', 'Tarifoptionen gefunden'];
    this.socCols.push(...[
      {
        title: 'Tarifoptionen', field: 'socName', type: 'text', show: true, sortable: true,
        editInfo: {
          type: 'dropdown', validators: [Validators.required], required: true,
          options: this.activeSocs
        },
      }
    ]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.socCategory = changes['socCategory'].currentValue;
    let previousSocId = changes['socCategory'].previousValue;
    if (previousSocId && this.socCategory.id === previousSocId.id) {
      console.log('no Changes');
    } else {
      this.loader = true;
      this.removableContent.headerTitle = 'Tarifoption aus der Gruppe entfernen';
      this.removableContent.name = 'socName';
      this.removableContent.message1 = this.socCategory.categoryName;
      this.removableContent.bodyTitle1 = 'Möchten sie die Tarifoption';
      this.removableContent.bodyTitle2 = 'aus der Gruppe';
      this.removableContent.bodyTitle3 = 'und allen Shops unwideruflich löschen?';
      if (this.socCategory !== null) {
        this.getAssociateSocs();
      }
    }
  }

  saveRow(event) {
    let activesoc = new Soc();
    activesoc.socId = event.socId;
    activesoc.associateId = event.associateId;
    activesoc.socName = event.socName;
    this.socCategoryAslService.saveOrUpdate(activesoc).then((data) => {
      if (data) {
        activesoc.socId = data.id;
        this.getAssociateSocsFS();
        this.alertMessage.printSuccessNotification('Daten wurden gespeichert');
      }
    }).catch(ex => this.errorHandling(ex));
  }

  updateRow(event) {
    let activesoc = new Soc();
    activesoc.socId = this.editRowSocId;
    activesoc.associateId = this.socCategory.id;
    activesoc.socName = event.socName.socName;
    activesoc.newSocId = event.socName.newSocId ? event.socName.newSocId : this.editRowSocId;
    event.socName = event.socName.socName ? event.socName.socName : event.socName;
    this.socCategoryAslService.saveOrUpdate(activesoc).then((data) => {
      if (data) {
        this.getAssociateSocsFS();
        this.alertMessage.printSuccessNotification('Daten wurden aktualisiert');
      }
    }).catch(ex => this.errorHandling(ex));
  }

  deleteRow(event) {
    let activesoc = new Soc();
    activesoc.socId = event.socId;
    activesoc.socName = event.socName;
    activesoc.categoryId = this.socCategory.id;
    this.socCategoryAslService.delete(activesoc).then((data) => {
      if (data) {
        this.getAssociateSocsFS();
        this.alertMessage.printSuccessNotification('Daten wurden erfolgreich gelöscht');
      }
    }).catch(ex => this.errorHandling(ex));
  }

  editOpen(event) {
    this.editRowSocId = event.socId;
    this.getSocByCategoryId();
  }

  getSocByCategoryId() {
    this.socCols.find(c => c.field === 'socName').editInfo.options = [];
    this.socCategoryAslService.getSocsByCategoryId(this.socCategory.id)
      .then(response => {
        this.activeSocs = response.map(v => ({text: v.socName, value: ({newSocId: v.socId, socName: v.socName})}));
        this.socCols.find(c => c.field === 'socName').editInfo.options = this.activeSocs;
      });
  }

  /* resetAll() {
     this.activesocModel.resetModel();
     this.socManagerService.resetFilter(this.sncrTable);
     if (this.sncrTable.dt.sortField === 'displayOrder') {
       let order = {order: this.sncrTable.dt.sortOrder};
       this.customSortOrder(order);
     } else {
       this.sncrTable.currentValue.sort((a, b) => this.socManagerService.restSorting(a, b, this.sncrTable));
     }
     if (this.sncrTable.previousFilters.length === 0) {
       this.sncrTable.dt.value = [...this.socData];
       this.sncrTable.totalRecords = this.sncrTable.currentValue.length;
     }
     this.sncrTable.goToFirstPage();
   }*/


  resetFilterSorting(sncrTable) {
    setTimeout(() => {
      this.sncrTable.previousSort = sncrTable.previousSort;
      this.sncrTable.previousFilters = sncrTable.previousFilters;
      this.sncrTable.dt.sortOrder = sncrTable.dt.sortOrder;
      this.sncrTable.dt.sortField = sncrTable.dt.sortField;
      this.socManagerService.resetFilter(this.sncrTable);
      this.sncrTable.currentValue.sort((a, b) => this.socManagerService.restSorting(a, b, this.sncrTable));
      if (this.sncrTable.previousFilters.length === 0) {
        this.sncrTable.dt.value = [...this.socData];
        this.sncrTable.totalRecords = this.sncrTable.currentValue.length;
      }
      this.sncrTable.goToFirstPage();
    }, 50);
  }


  getAssociateSocs() {
    this.loader = true;
    this.socCategoryAslService.getAssocateSocs(this.socCategory.id)
      .then(response => {
        this.socData = response.map(r => ({
          socId: r.socId, socName: r.socName
        }));
        this.loader = false;
      });
  }

  getAssociateSocsFS() {
    const sncrTable = {...this.sncrTable};
    this.loader = true;
    this.socCategoryAslService.getAssocateSocs(this.socCategory.id)
      .then(response => {
        this.socData = response.map(r => ({
          socId: r.socId, socName: r.socName
        }));
        this.loader = false;
        this.resetFilterSorting(sncrTable);
      });
  }

  private errorHandling(ex) {
    this.alertMessage.printErrorNotification(ex);
    this.getAssociateSocs();
  }
}
