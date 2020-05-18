import {Component, Input, OnInit} from '@angular/core';
import {OmDetailService} from '../../order-components/order-commons/om-detail/om-detail.service';
import {finalize} from 'rxjs/internal/operators';

@Component({
  selector: 'kias-activity',
  templateUrl: 'kias-activity.component.html'
})
export class KiasActivityComponent implements OnInit {

  @Input() id: string;

  cols: any[];
  kiasValues: any;
  dataLoading = true;
  constructor(private omdetailService: OmDetailService) {  }

  ngOnInit(): void {
    this.cols = [
      {title: 'KIAS-COL-TS', field: 'createdTs', show: true, sortable: true},
      {title: 'KIAS-COL-FILE_NAME', field: 'fileName', show: true, sortable: true},
      {title: 'KIAS-COL-RECORD_ID', field: 'recordId', show: true, sortable: true},
      {title: 'KIAS-COL-REQUEST_ID', field: 'requestId', show: true, sortable: true},
      {title: 'KIAS-COL-STATUS', field: 'status', show: true, sortable: true},
      {title: 'KIAS-COL-ERROR_DESC', field: 'errorDesc', show: true, sortable: true}
    ];

    this.omdetailService.getKIASDetails(this.id).pipe(finalize(() => this.dataLoading = false))
      .subscribe((val) => this.kiasValues = val);
  }
}