import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {XinvFlowService} from './xinv-flow.service';


@Component({
  selector: 'xinv-flow',
  templateUrl: 'xinv-flow.component.html',
  styleUrls: ['xinv-flow.component.scss']
})

export class XinvFlowComponent implements OnInit {
  @ViewChild('debitorId', {static: true}) debitorId;
  columns = [];
  lazyLoadUrl: string;
  processing = false;
  configId: string;
  constructor( private route: ActivatedRoute,
               private xinvFlowService: XinvFlowService) {

  }

  ngOnInit() {
    this.route.data.subscribe((data: { columns: any, lazyCount: any[], configId: any}) => {
      this.columns = data.columns;
      this.configId = data.configId;
      this.evaluteColumn(this.columns);
    });
    this.lazyLoadUrl = '/buyflow/rest/table/custom/' + this.configId;
  }

  evaluteColumn(columns) {
    columns.forEach(column => {
      if (column.fieldName === 'DEBITOR_NUMBER') {
        column.bodyTemplate = this.debitorId;
      }
    });
  }
  selectDebitor() {
    return;
  }
}
