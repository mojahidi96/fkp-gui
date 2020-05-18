/**
 * Created by srao0004 on 3/14/2017.
 */
import {SncrDatatableComponent} from './../../sncr-components/sncr-datatable/sncr-datatable.component';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn} from '@angular/forms';
import {Group} from './group';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, ViewChild} from '@angular/core';
import {SocGroupsService} from './soc-groups.service';
import {ActivatedRoute} from '@angular/router';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {SocCustomValidator} from '../soc-custom-validators';
import {Removable} from '../../sncr-components/sncr-datatable/removable';
import {isUndefined} from 'util';
import {SocManagerService} from '../soc-manager.service';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';

@Component({
  selector: 'soc-groups',
  templateUrl: 'soc-groups.component.html',
  styleUrls: ['soc-groups.component.scss']
})
export class SocGroupsComponent implements OnInit {
  @ViewChild('delete') delGroup;
  @ViewChild('sncrData') sncrdataTable: SncrDatatableComponent;


  groupsData = [];
  socCols = [];
  groupIcon = [];
  selected = new Group();
  selectedGroup = true;
  groupId: string;
  ngbRef: NgbModalRef;
  loader: boolean;
  saveForm: FormGroup;
  cols = [];
  toggle: boolean;
  formSubmit: boolean;
  editrow: string;
  removableContent = new Removable();
  resultMessage = [];

  constructor(private socGroupsService: SocGroupsService, private modalService: NgbModal,
              private route: ActivatedRoute, private formBuilder: FormBuilder,
              public alertMessage: NotificationHandlerService, private  socManagerService: SocManagerService) {
  }

  ngOnInit(): void {
    this.removableContent.headerTitle = 'Gruppe löschen';
    this.removableContent.name = 'groupName';
    this.removableContent.bodyTitle1 = 'Möchten sie Gruppe';
    this.removableContent.bodyTitle2 = 'vom gesammten Portal und aus allen Kategorien und Shops unwideruflich löschen?';

    this.resultMessage = ['Keine Gruppen gefunden', 'Eine Gruppe gefunden', 'Gruppen gefunden'];

    this.route.data.subscribe((data: {groupIcons: any[]}) => {
      this.groupIcon = data.groupIcons.map(v => ({text: v.icon, value: v.id}));
    });
    this.socCols.push(...[
      {
        title: 'Symbol', field: 'icon', show: true, type: 'text', sortable: true,
        editInfo: {
          validators: [Validators.required],
          required: true,
          type: 'select',
          options: this.groupIcon
        }
      },
      {
        title: 'Name',
        field: 'groupName',
        show: true,
        sortable: true,
        editInfo: {validators: [Validators.compose([Validators.required, SocCustomValidator,
          Validators.pattern('^[äöüÄÖÜßa-zA-Z0-9\\.\\-\\s]*$'), this.groupNameExist(), Validators.maxLength(128)])], required: true}
      }
    ]);
    this.getGroupSocs();
  }

  creatForm() {
    this.saveForm = this.formBuilder.group({
      icon: [this.groupIcon.length ? this.groupIcon[1].value : '', Validators.required],
      groupName: ['', Validators.compose([Validators.required, SocCustomValidator,
        Validators.pattern('^[äöüÄÖÜßa-zA-Z0-9\\.\\-\\s]*$'), Validators.maxLength(128), groupNameExistValidator(this.groupsData)])]
    });
  }

  /*  open(content) {
      this.ngbRef = this.modalService.open(content, {backdrop: 'static'});
      this.resetForm();
    }*/

  saveGroup(form) {
    let socGroup = form.value;
    socGroup.updateStatus = false;
    socGroup.groupName = socGroup.groupName.trim().split(/  +/g).join(' ');
    if (form.valid) {
      if (socGroup.groupName) {
        this.formSubmit = true;
        this.socGroupsService.saveOrUpdate(socGroup).then((data) => {
          this.formSubmit = false;
          if (data.id === '10015') {
            this.alertMessage.printErrorNotification('Bitte geben Sie einen eindeutigen Namen ein');
          } else {
            socGroup.id = data.id;
            this.groupsData.push(socGroup);
            this.alertMessage.printSuccessNotification('Daten wurden gespeichert');
          }
          this.resetAll();
        }).catch((ex) => {
          this.getGroupSocs();
          this.formSubmit = false;
          console.log('ex : ' + ex);
          this.alertMessage.printErrorNotification(ex);
        });
      }
    }
  }

  deleteRow(event) {
    this.socGroupsService.delete(event).then((data) => {
      if (data) {
        this.alertMessage.printSuccessNotification('Daten wurden erfolgreich gelöscht');
        this.selectedGroup = true;
        if (event.editing) {
          this.sncrdataTable.cancelEdit(event);
        }
        const index: number = this.groupsData.indexOf(event);
        if (index !== -1) {
          this.groupsData.splice(index, 1);
          this.resetAll();
        }
      }
    }).catch((ex) => {
      this.getGroupSocs();
      console.log('ex : ' + ex);
      this.alertMessage.printErrorNotification(ex);
    });

  }

  saveChanges(event) {
    let socGroup = new Group();
    socGroup.id = event.id;
    socGroup.icon = event.icon;
    socGroup.groupName = event.groupName.trim().split(/  +/g).join(' ');
    if (socGroup.groupName) {
      if (socGroup.groupName.toLowerCase() === this.editrow.toLowerCase()) {
        socGroup.updateStatus = true;
      } else {
        socGroup.updateStatus = false;
      }
      this.socGroupsService.saveOrUpdate(socGroup).then((data) => {
        if (data.id === '10015') {
          this.alertMessage.printErrorNotification('Bitte geben Sie einen eindeutigen Namen ein');
        } else {
          this.alertMessage.printSuccessNotification('Daten wurden aktualisiert');
        }
        this.resetAll();
      }).catch((ex) => {
        this.getGroupSocs();
        this.alertMessage.printErrorNotification(ex);
      });
    }
  }

  resetAll() {
    this.creatForm();
    this.selectedGroup = false;
    this.toggle = false;
    this.socManagerService.resetFilter(this.sncrdataTable);
    this.sncrdataTable.currentValue.sort((a, b) => this.socManagerService.restSorting(a, b, this.sncrdataTable));
    if (this.sncrdataTable.previousFilters.length === 0) {
      this.sncrdataTable.dt.value = [...this.groupsData];
      this.sncrdataTable.totalRecords = this.sncrdataTable.currentValue.length;
    }
    this.sncrdataTable.goToFirstPage();
  }

  rowClick(event) {
    if (event.data) {
      this.selectedGroup = false;
      this.selected = Object.assign({}, event.data);
    }
  }

  editOpen(event) {
    this.editrow = event.groupName;
  }

  getGroupSocs() {
    this.loader = true;
    this.socGroupsService.getSocData()
      .then(response => {
        this.groupsData = response;
        this.loader = false;
        this.toggle = false;
        this.selectedGroup = true;
        this.creatForm();
      });
  }

  groupNameExist(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const name = control.value.trim().toLowerCase().split(/  +/g).join(' ');
      const oldValue = isUndefined(this.editrow) ? '' : this.editrow.toLowerCase();
      if (name && oldValue !== name && (this.groupsData.length > 0) && this.groupsData.find(f => f.groupName.toLowerCase() === name)) {
        return {'SOC_GROUP-ERROR-UNIQUE_NAME': true};
      } else {
        return null;
      }
    };
  }
}

export function groupNameExistValidator(groupList: any[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if (control && UtilsService.notNull(control.value)) {
      const name = control.value.trim().toLowerCase().split(/  +/g).join(' ');
      if (name && (groupList.length > 0) && groupList.find(f => f.groupName.toLowerCase() === name)) {
        return {'SOC_GROUP-ERROR-UNIQUE_NAME': true};
      } else {
        return null;
      }
    }
  };
}
