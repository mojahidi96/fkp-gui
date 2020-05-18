import {Group} from './../group';
import {Soc} from './../../soc-blacklisted/Soc';
import {ActiveSocGroupService} from './active-soc-group.service';
import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {ActiveSocGroupModelComponent} from './activesoc-group-model.component';
import {Validators} from '@angular/forms';
import {SncrDatatableComponent} from '../../../sncr-components/sncr-datatable/sncr-datatable.component';
import {Removable} from '../../../sncr-components/sncr-datatable/removable';
import {SocManagerService} from '../../soc-manager.service';

@Component({
  selector: 'active-soc-group',
  templateUrl: 'active-soc-group.component.html',
  styleUrls: ['activesoc-group-model.component.scss']
})
export class ActiveSocGroupComponent implements OnInit, OnChanges {
  @ViewChild('activeT') activesocModel: ActiveSocGroupModelComponent;
  @ViewChild('sncrtable') sncrtable: SncrDatatableComponent;
  @Input() socGroup = new Group();
  removableContent = new Removable();
  activeSocs = [];
  editRowSocId: string;
  socData = [];
  socCols = [];
  loader: boolean;
  resultMessage = [];

  constructor(private activeSocGroupService: ActiveSocGroupService,
              private sncrAlert: NotificationHandlerService,
              private socManagerService: SocManagerService) {
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
      },
      {
        title: 'Sortierung', field: 'displayOrder', type: 'number', show: true, sortable: true, maxLength: 3,
        sortFunction: event => this.customSortOrder(event),
        editInfo: {
          type: 'text', validators: [Validators.compose([Validators.pattern('^((?!(0))[0-9]{1,3})$'),
            Validators.maxLength(3)])]
        }
      }
    ]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.socGroup = changes['socGroup'].currentValue;
    let previousGroupId = changes['socGroup'].previousValue;
    if (previousGroupId && this.socGroup.id === previousGroupId.id) {
      console.log('no Changes');
    } else {
      this.loader = true;
      this.removableContent.headerTitle = 'Tarifoption aus der Gruppe entfernen';
      this.removableContent.name = 'socName';
      this.removableContent.message1 = this.socGroup.groupName;
      this.removableContent.bodyTitle1 = 'Möchten sie die Tarifoption';
      this.removableContent.bodyTitle2 = 'aus der Gruppe';
      this.removableContent.bodyTitle3 = 'und allen Shops unwideruflich löschen?';
      if (this.socGroup.id !== null) {
        this.getAssociateActiveSocs();
      }
    }
  }


  editOpen(event) {
    this.editRowSocId = event.socId;
    this.getActiveSocs();
  }

  saveRow(event) {
    let activesoc = new Soc();
    activesoc.socId = event.socId;
    activesoc.groupId = event.groupId;
    activesoc.displayOrder = event.displayOrder ? event.displayOrder.toString() : '';
    activesoc.socName = event.socName;
    this.activeSocGroupService.saveOrUpdate(activesoc).then((data) => {
      if (data) {
        activesoc.socId = data.id;
        activesoc.displayOrder = activesoc.displayOrder ? activesoc.displayOrder : null;
        this.getAssociateActiveSocss();
        this.sncrAlert.printSuccessNotification('Daten wurden gespeichert');
      }
    }).catch((ex) => {
      console.log('ex : ' + ex);
      this.sncrAlert.printErrorNotification(ex);
      this.getAssociateActiveSocs();
    });
  }

  updateRow(event) {
    let activesoc = new Soc();
    activesoc.socId = this.editRowSocId;
    activesoc.groupId = this.socGroup.id;
    activesoc.displayOrder = event.displayOrder ? event.displayOrder.toString() : '';
    activesoc.socName = event.socName.socName;
    activesoc.newSocId = event.socName.newSocId ? event.socName.newSocId : this.editRowSocId;
    event.socName = event.socName.socName ? event.socName.socName : event.socName;
    this.activeSocGroupService.saveOrUpdate(activesoc).then((data) => {
      if (data) {
        event.displayOrder = event.displayOrder ? +event.displayOrder : null;
        this.getAssociateActiveSocss();
        this.sncrAlert.printSuccessNotification('Daten wurden aktualisiert');
      }
    }).catch(ex => this.errorHandling(ex));
  }

  deleteRow(event) {
    let activesoc = new Soc();
    activesoc.socId = event.socId;
    activesoc.socName = event.socName;
    activesoc.displayOrder = event.displayOrder ? event.displayOrder.toString() : '';
    activesoc.groupId = this.socGroup.id;
    this.activeSocGroupService.delete(activesoc).then((data) => {
      if (data) {
        this.getAssociateActiveSocss();
        this.sncrAlert.printSuccessNotification('Daten wurden erfolgreich gelöscht');
      }
    }).catch(ex => this.errorHandling(ex));
  }

  getActiveSocs() {
    this.socCols.find(c => c.field === 'socName').editInfo.options = [];
    this.activeSocGroupService.getActiveSocs(this.socGroup.id)
      .then(response => {
        this.activeSocs = response.map(v => ({text: v.socName, value: ({newSocId: v.socId, socName: v.socName})}));
        this.socCols.find(c => c.field === 'socName').editInfo.options = this.activeSocs;
      });
  }

  reInitilize() {
    setTimeout(() => {
      this.sncrtable.dt.sortField = 'displayOrder';
      this.sncrtable.dt.sortOrder = 1;
      this.customSortOrder({order: this.sncrtable.dt.sortOrder});
    }, 50);
  }

  resetAll() {
    this.activesocModel.resetModel();
    this.socManagerService.resetFilter(this.sncrtable);
    if (this.sncrtable.dt.sortField === 'displayOrder') {
      let order = {order: this.sncrtable.dt.sortOrder};
      this.customSortOrder(order);
    } else {
      this.sncrtable.currentValue.sort((a, b) => this.socManagerService.restSorting(a, b, this.sncrtable));
    }
    if (this.sncrtable.previousFilters.length === 0) {
      this.sncrtable.dt.value = [...this.socData];
      this.sncrtable.totalRecords = this.sncrtable.currentValue.length;
    }
    this.sncrtable.goToFirstPage();
  }

  resetFilterSorting(sncrtable) {
    setTimeout(() => {
      this.sncrtable.previousSort = sncrtable.previousSort;
      this.sncrtable.previousFilters = sncrtable.previousFilters;
      this.sncrtable.dt.sortOrder = sncrtable.dt.sortOrder;
      this.sncrtable.dt.sortField = sncrtable.dt.sortField;
      this.socManagerService.resetFilter(this.sncrtable);
      if (this.sncrtable.dt.sortField === 'displayOrder') {
        let order = {order: this.sncrtable.dt.sortOrder};
        this.customSortOrder(order);
      } else {
        this.sncrtable.currentValue.sort((a, b) => this.socManagerService.restSorting(a, b, this.sncrtable));
      }
      if (this.sncrtable.previousFilters.length === 0) {
        this.sncrtable.dt.value = [...this.socData];
        this.sncrtable.totalRecords = this.sncrtable.currentValue.length;
      }
      this.sncrtable.goToFirstPage();
    }, 50);
  }

  customSortOrder(e) {
    this.sncrtable.previousSort.field = 'displayOrder';
    this.sncrtable.previousSort.order = e.order;
    this.sncrtable.currentValue.sort((a, b) => this.sortByDisplayOrder(a, b, e));
    this.sncrtable.currentValue = [...this.sncrtable.currentValue];
  }

  getAssociateActiveSocs() {
    this.loader = true;
    this.activeSocGroupService.getAssociateActiveSocs(this.socGroup.id)
      .then(response => {
        this.socData = response.map(r => ({
          socId: r.socId, socName: r.socName,
          displayOrder: (r.displayOrder ? +r.displayOrder : null)
        }));
        this.loader = false;
        this.reInitilize();
      });
  }

  getAssociateActiveSocss() {
    const sncrtable = {...this.sncrtable};
    this.loader = true;
    this.activeSocGroupService.getAssociateActiveSocs(this.socGroup.id)
      .then(response => {
        this.socData = response.map(r => ({
          socId: r.socId, socName: r.socName,
          displayOrder: (r.displayOrder ? +r.displayOrder : null)
        }));
        this.loader = false;
        this.resetFilterSorting(sncrtable);
      });
  }

  private sortByDisplayOrder(a, b, event) {
    let order1 = a.displayOrder instanceof String ? Number.parseInt(a.displayOrder) : a.displayOrder;
    let order2 = b.displayOrder instanceof String ? Number.parseInt(b.displayOrder) : b.displayOrder;
    let numComp;
    if (order1 === null || order2 === null) {
      numComp = order2 - order1;
    } else {
      numComp = order1 - order2;
    }
    if (numComp === 0) {
      return a.socName.toLocaleLowerCase().localeCompare(b.socName.toLocaleLowerCase()) * event.order;
    } else {
      return numComp * event.order;
    }
  }

  private errorHandling(ex) {
    this.getAssociateActiveSocs();
    this.sncrAlert.printErrorNotification(ex);
  }
}
