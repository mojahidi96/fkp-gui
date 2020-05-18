import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OmDetailService} from '../../order-components/order-commons/om-detail/om-detail.service';
import {finalize} from 'rxjs/internal/operators';

@Component({
  selector: 'system-history',
  templateUrl: 'system-history.component.html'
})
export class SystemHistoryComponent implements OnInit {

  @Input() id: string;

  @ViewChild('sysHistoryTimeStamp', {static: true}) sysHistoryTimeStamp: TemplateRef<any>;

  dataLoading = true;
  sysHistory = [];
  cols: any[];

  constructor(private omDetailService: OmDetailService) {}

  ngOnInit(): void {
    this.cols = [
      {title: 'HISTORY-COL-DATE', field: 'timestamp', show: true, sortable: false, filter: false, bodyTemplate: this.sysHistoryTimeStamp},
      {title: 'HISTORY-COL-USERNAME', field: 'userName', show: true, sortable: false, filter: false},
      {title: 'HISTORY-COL-CATEGORY', field: 'category', show: true, sortable: false, filter: false},
      {title: 'HISTORY-COL-STATUS', field: 'state', show: true, sortable: false, filter: false},
      {title: 'HISTORY-COL-COMMENT', field: 'transComment', show: true, sortable: false, filter: false}
    ];

    this.omDetailService.getSystemHistory().pipe(finalize(() => this.dataLoading = false))
      .subscribe((val) => this.sysHistory = val);
  }
}
