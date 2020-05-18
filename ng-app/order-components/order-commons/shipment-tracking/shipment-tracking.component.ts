import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ShipTrackService} from './ship.track.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'shipment-tracking',
  templateUrl: 'shipment-tracking.component.html',
  styleUrls: ['shipment-tracking.component.scss']
})
export class ShipmentTrackingComponent implements OnInit {

  private shipTrackDetails = [];
  dataLoading = true;
  cols: any[];
  @ViewChild('trackingNo', {static: true}) trackingNo: TemplateRef<any>;

  constructor(private shiptrackService: ShipTrackService) {

  }

  ngOnInit(): void {
    this.cols = [
      {title: 'SHIPMENT-COL-PACKET', field: 'packet', show: true, sortable: false, filter: false},
      {title: 'SHIPMENT-COL-SERVICE', field: 'partner', show: true, sortable: false, filter: false},
      {title: 'SHIPMENT-COL-TRACKING', field: 'trackingNum', show: true, sortable: false, filter: false,
          showInfoIcon: true, infoMsg: 'SHIPMENT-COL-TRACKING-INFO', bodyTemplate: this.trackingNo}
    ];
    this.shiptrackService.getTrackingDetails().pipe(finalize(() => this.dataLoading = false))
      .subscribe((val) => this.shipTrackDetails = val);
  }
}
