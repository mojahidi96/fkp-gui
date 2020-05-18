import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';
import {BanSubConfig} from '../../ban-sub-common/ban-sub.config';
import {BulkEditRequest} from '../../orderflow-bulk-edits/bulk-edit.config';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {TranslationService} from 'angular-l10n';

@Component({
  selector: 'ban-management-review',
  templateUrl: 'ban-management-review.component.html',
  styleUrls: ['ban-management-review.component.scss']
})

export class BanManagementReviewComponent implements OnInit, OnChanges {

  @ViewChild('reviewTable', {static: true}) reviewTable: SncrDatatableComponent;

  @Input() reviewUpdatedBan: any;
  @Input() lazy = false;
  @Input() lazyLoadUrl = '';
  @Input() editedData = [];
  @Input() selectCount = 0;
  columns = [];
  isLazy = true;
  banReviewTranslations: any = {};
  editedDataCopy: BulkEditRequest[] = [];

  constructor(private route: ActivatedRoute, public translation: TranslationService) {
    this.columns = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reviewUpdatedBan'] && this.lazy) {
      this.reviewTable.initNotLoaded = true;
    }
    // for single selection make all columns available as we have data on client side
    if (changes['reviewUpdatedBan'] && this.selectCount === 1) {
      this.loadCols(true);
      // make all columns visible in case of select count==1
      this.columns.forEach(col => col.show = true);
    }
    this.reviewTable.resetAllFilters();

    if (this.editedData && this.editedData.length) {
      // check for iban/bic field
      // maintain a copy to avoide the binding
      [...this.editedDataCopy] = [...this.editedData.map(x => Object.assign({}, x))];
      // [...this.editedDataCopy] = [...this.editedData];
      this.editedDataCopy.forEach(row => {
        if (row.field === BanSubConfig.IBAN || row.field === BanSubConfig.BIC) {
          row.newValue = UtilsService.maskAllButLastFour(row.newValue);
          row.oldValue = UtilsService.maskAllButLastFour(row.oldValue);
        }
      });
    } else {
      this.editedDataCopy = [];
    }
  }

  ngOnInit(): void {
    if (this.lazy) {
      this.isLazy = true;
      this.loadCols(false);
    } else {
      if (this.selectCount !== 1) {
        this.isLazy = false;
        this.loadCols(true);
      }
    }
    this.banReviewTranslations = {
      'banReviewTotalCountMsg': [
        this.translation.translate('BAN-NO_CHANGES_FOUND'),
        this.translation.translate('BAN-ONE_CHANGE_FOUND'),
        this.translation.translate('BAN-CHANGES_FOUND')]
    };
  }

  loadCols(nonLazy) {
    this.columns = [
      {title: this.translation.translate('REVIEW-COLUMN_BAN_NUMBER'), field: nonLazy ? 'id' : 'ban', show: this.isLazy, sortable: true},
      {title: this.translation.translate('REVIEW-COLUMN_FIELD'), field: 'fieldTitle', show: true, sortable: true},
      {title: this.translation.translate('REVIEW-COLUMN_PREVIOUS_VALUE'), field: 'oldValue', show: true, sortable: true},
      {title: this.translation.translate('REVIEW-COLUMN_OLD_VALUE'), field: 'newValue', show: true, sortable: true}
    ];
  }
}
