import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {SubsDetails} from './processSubscribers';
import {CONSTANTS} from '../constants';
import {OrderReviewService} from './order-review.service';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';
import {SubscriberSelectionService} from '../../subscribers-selection/subscriber-selection.service';

@Component({
  selector: 'order-review',
  templateUrl: 'order-review.component.html',
  styleUrls: ['order-review.component.scss']
})
export class OrderReviewComponent implements OnChanges {

  @ViewChild('orderReviewTable') orderReviewTable: SncrDatatableComponent;
  @Input() isChanged: boolean;
  @Output() footerNoteEvent = new EventEmitter();

  subscriberActionList: Array<SubsDetails>;
  lazy = true;
  lazyLoadUrl = '/buyflow/rest/table/custom/698eb8c1-0f98-6997-e053-1505100a66a9';
  constants: CONSTANTS;
  reviewCols: Array<any>;

  constructor(private orderReviewService: OrderReviewService) {
    this.reviewCols = [
      {'title': 'Kundennummer', 'field': 'ban', 'sortable': true, 'show': true, 'type': 'text'},
      {'title': 'Rufnummer', 'field': 'subscriberNo', 'sortable': true, 'show': true, 'type': 'text'},
      {'title': 'Art der Verbindungsübersicht', 'field': 'callDetailTypeDisplay', 'sortable': true, 'show': true, 'type': 'text'},
      {'title': 'Verkürzte Zielrufnummer', 'field': 'numberDigitsMaskClDisplay', 'sortable': true, 'show': true, 'type': 'text'}
    ];
    this.subscriberActionList = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isChanged']) {
      this.orderReviewTable.initNotLoaded = true;
      this.orderReviewTable.resetAllFilters();

      this.orderReviewService.getCountForExtendedCallDetail()
        .subscribe((countRes) => {
          this.footerNoteEvent.emit(countRes && countRes.count > 0);
        });
    }
  }
}
