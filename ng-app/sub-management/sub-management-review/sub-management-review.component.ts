import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';
import {BulkEditRequest} from '../../orderflow-bulk-edits/bulk-edit.config';
import {TranslationService} from 'angular-l10n';
import {DataSelectionService} from '../../data-selection/data-selection.service';

@Component({
  selector: 'sub-management-review',
  templateUrl: 'sub-management-review.component.html',
  styleUrls: ['sub-management-review.component.scss']
})

export class SubManagementReviewComponent implements OnInit, OnChanges {

  @ViewChild('reviewTable') reviewTable: SncrDatatableComponent;

  @Input() reviewUpdatedSub: any;
  @Input() singleEdit = false;
  @Input() tableEdit = false;
  @Input() bulkEdit = false;
  @Input() prefilled = false;
  @Input() uploadReview = false;
  @Input() lazyLoadUrl = '';
  @Input() editedData: BulkEditRequest[] = [];
  @Input() selectCount = 0;
  sortField: string;
  resultMessage = [];
  columns = [];
  configId = '5c60e182-4a75-511c-e053-1405100af36d'; // d
  uploadConfigId= '6fa053d8-63d8-58fe-e053-1405100a920b';
  emptyMessage: any;
  editedDataCopy: BulkEditRequest[] = [];

  constructor(public translation: TranslationService,
              private dataSelectionService: DataSelectionService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reviewUpdatedSub']) {
      this.reviewTable.initNotLoaded = true;
      this.reviewTable.resetAllFilters();
      this.loadCols(this.bulkEdit);
    }
  }

  ngOnInit(): void {
    this.loadCols(this.bulkEdit);
  }

  loadCols(bulkEdit) {
    if (this.uploadReview) {
      this.sortField = '2';
      this.dataSelectionService.getColumns(this.uploadConfigId).then(cols => {
        this.columns = cols;
        this.columns.forEach(col => col.show = true);
      });
    } else {
      this.sortField = 'ban';
      this.columns = [
        {title: 'REVIEW-COLUMN_BAN_NUMBER', field: 'ban', show: !bulkEdit, sortable: true},
        {title: 'REVIEW-COLUMN_SUBS_NUMBER', field: 'id', show: !bulkEdit, sortable: true},
        {title: 'REVIEW-COLUMN_FIELD', field: 'fieldTitle', show: true, sortable: true},
        {title: 'REVIEW-COLUMN_PREVIOUS_VALUE', field: 'oldValue', show: !bulkEdit, sortable: true},
        {title: 'REVIEW-COLUMN_OLD_VALUE', field: 'newValue', show: true, sortable: true}
      ];
    }
  }

}
