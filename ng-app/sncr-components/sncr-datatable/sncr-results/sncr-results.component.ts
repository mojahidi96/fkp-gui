import {AfterViewInit, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {SncrTranslateDirective} from '../../sncr-translate/sncr-translate.directive';
import {Subscription} from 'rxjs';

@Component({
  selector: 'sncr-results',
  templateUrl: 'sncr-results.component.html',
  styleUrls: ['sncr-results.component.scss']
})
export class SncrResultsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() currentCols: any[];
  @Input() isNew: boolean;
  @Input() lazy: boolean;
  @Input() multiSelection: boolean;
  @Input() maxSelectCount: number;
  @Input() maxSelectionErrMsg = false;
  @Input() prefix: string;
  @Input() resultCount = true;
  @Input() selection: any[];
  @Input() selectCount = 0;
  @Input() totalRecords: number;
  @Input() totalRecordsWithoutFilter: number;
  @Input() value: any[];
  @Input() filteredValue: any[];

  @ViewChildren(SncrTranslateDirective) viewTranslations: QueryList<SncrTranslateDirective>;

  // DEPRECATED
  @Input() resultMessage = [];
  @Input() selectMessage = 'Teilnehmer';
  @Input() selectionMessage = [];
  @Input() singleSelectionMsg = 'Ein';
  @Input() selectionTitle: string;

  resultMessages;

  private subscriptions$: Subscription[] = [];

  ngOnInit(): void {
    this.resultMessages = {
      '=0': 'DATATABLE-RESULT_COUNT-NONE',
      '=1': 'DATATABLE-RESULT_COUNT-ONE',
      'other': 'DATATABLE-RESULT_COUNT-OTHER'
    };
  }

  ngAfterViewInit(): void {
    this.viewTranslations.forEach(() => this.setPrefix());
    this.subscriptions$.push(this.viewTranslations.changes.subscribe(() => this.setPrefix()));
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(s => s.unsubscribe());
  }

  getSelectionMessages() {
    const all = '=' + this.totalRecordsWithoutFilter;
    return {
      [all]: 'DATATABLE-SELECTION_COUNT-ALL',
      '=0': 'DATATABLE-SELECTION_COUNT-NONE',
      '=1': 'DATATABLE-SELECTION_COUNT-ONE',
      'other': 'DATATABLE-SELECTION_COUNT-OTHER'
    };
  }

  private setPrefix() {
    this.viewTranslations.forEach(t => t.prefix = this.prefix);
  }

  private allFilteredValuesSelected(): boolean {
    if (this.filteredValue) {
      return !this.filteredValue.some(val =>
        val._sncrChecked !== true
      );
    }
    return false;
  }
}