import {SncrDatatableComponent} from './../../sncr-components/sncr-datatable/sncr-datatable.component';
import {SocBlackListedService} from './soc-blacklisted.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Soc} from './Soc';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {SocManagerService} from '../soc-manager.service';

@Component({
  selector: 'soc-blockedlist',
  templateUrl: 'soc-blacklisted.component.html',
  styleUrls: ['soc-blacklisted.component.scss']
})
export class SocBlackListedComponent implements OnInit {

  @ViewChild('status') status;
  @ViewChild('sncrData') sncrdataTable: SncrDatatableComponent;


  socCols = [];
  selected = [];
  socBlackListData: Soc[];
  csvName = 'soc-blacklisted';
  title = 'Blacklist';
  sortField = '_sncrChecked';
  loader: boolean;
  formSubmit: boolean;
  resultMessage = [];
  selectionMessage = [];


  constructor(private socBlackListed: SocBlackListedService,
              public alertMessage: NotificationHandlerService, private socManagerService: SocManagerService) {
  }

  ngOnInit() {
    this.resultMessage = ['Keine Tarifoptionen gefunden', 'Eine Tarifoption gefunden', 'Tarifoptionen gefunden'];
    this.selectionMessage = ['Keine Tarifoption schwarzgelistet"', 'Alle Tarifoptionen schwarzgelistet', 'Tarifoptionen schwarzgelistet'];
    this.socCols.push(...[
      {title: 'SOC Code', field: 'socId', show: true, sortable: true},
      {title: 'Tarif Name', field: 'socName', show: true, sortable: true}
    ]);
    this.loader = true;

    this.getSocBlackListed();
  }

  rowSelect(e) {
    console.log(e);
  }

  save(event) {
    this.formSubmit = true;
    document.querySelector('.ui-datatable').classList.add('ui-datatable-disabled');
    this.socBlackListed.saveOrDelete(event.data).then((data) => {
      if (data) {
        this.formSubmit = false;
        this.sncrdataTable.currentValue.sort((a, b) => this.socManagerService.restSorting(a, b, this.sncrdataTable));
        this.sncrdataTable.goToFirstPage();
        this.alertMessage.printSuccessNotification('Daten wurden gespeichert');
        document.querySelector('.ui-datatable').classList.remove('ui-datatable-disabled');
      }
    }).catch((ex) => {
      this.loader = true;
      this.getSocBlackListed();
      this.formSubmit = false;
      console.log('ex : ' + ex);
      this.alertMessage.printErrorNotification(ex);
    });
  }


  exporCSV() {
    this.sncrdataTable.exportCustomCSV(this.selected);
  }

  getSocBlackListed() {
    this.socBlackListed.getSocBlackListed()
      .then(response => {
        this.socBlackListData = response;
        this.selected = this.socBlackListed.getFilterList(this.socBlackListData);
        this.loader = false;
      }).catch((ex) => {
      console.log('ex : ' + ex);
    });
  }


}
