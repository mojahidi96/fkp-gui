import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OmDetailService} from '../../order-components/order-commons/om-detail/om-detail.service';

@Component({
  selector: 'order-bulk-edit',
  templateUrl: 'order-bulk-edit.component.html',
  styleUrls: ['order-bulk-edit.component.scss']
})
export class OrderBulkEditComponent implements OnInit {

  @Input() tabdetails: any;
  @Output() output = new EventEmitter();
  cols: any[];
  colsTariffOptions: any[];
  enabledTabs = {
    tariffChange: false,
    extension: false,
    tariffOptionChange: false,
    hardware: false
  };
  lazyLoadUrls = {
    tariffChange: '/buyflow/rest/om/tariff_change/',
    extension: '/buyflow/rest/om/extension/',
    tariffOptionChange: '/buyflow/rest/om/tariff_option_change/',
    hardware: '/buyflow/rest/om/hardware/'
  };
  kiasDetails: any[];
  errorCount: any;
  isDetailsLoading = false;

  @Input() id: string;

  constructor(private omDetailsService: OmDetailService) {}

  ngOnInit(): void {
    this.sortKIASTabsByOrder();
    this.cols = [
      {title: 'Kundennummer', field: 'ban', show: true},
      {title: 'Rufnummer', field: 'subscriber', show: true},
      {title: 'Request file', field: 'requestFile', show: true},
      {title: 'Record ID', field: 'recordId', show: true},
      {title: 'Request ID', field: 'requestId', show: true},
      {title: 'Status', field: 'status', show: true},
      {title: 'Response', field: 'response', show: true},
      {title: 'Änderungsdatum', field: 'createdTs', type: 'date', show: true},
    ];

    this.colsTariffOptions = [...this.cols];
    this.colsTariffOptions.splice(2, 0, {title: 'SOC ID', field: 'socId', show: true});

    Object.keys(this.lazyLoadUrls).forEach(k => this.lazyLoadUrls[k] += this.id);

  }

  loadKIASTabDetails(event: any) {
    this.getKIASTabDetails(event.nextId);
  }

  getKIASTabDetails(category: string) {
    this.isDetailsLoading = true;
    this.omDetailsService.loadKIASTabDetails(category).subscribe(response => {
      this.kiasDetails = response.kiasOrderData;
      this.errorCount = response.errorCount;
      this.isDetailsLoading = false;
    }, error => {
       console.error('error while getting KIAS tab details', error);
       this.isDetailsLoading = false;
    });
  }

  /**
   * Sort the KIAS tabs by displayOrder
   */
  sortKIASTabsByOrder() {
    this.tabdetails.sort((a, b) => a.displayOrder < b.displayOrder ? -1 : a.displayOrder > b.displayOrder ? 1 : 0);
    this.getKIASTabDetails(this.tabdetails[0].category);
  }

  /**
   * Emit the response to parent class
   * @param event
   */
  bulkEditOutput(event: any) {
    this.output.emit(event);
  }
  /**
   * Set Error state by category
   */
  setErrorState(event: any) {
    this.tabdetails.forEach(tab => {
      if (tab.category === event.category) {
        tab.errorStatus = event.state === 0 ? 'N' : 'Y';
      }
    });
  }
}
