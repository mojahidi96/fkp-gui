import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Column} from '../sncr-datatable/column';
import {Language, TranslationService} from 'angular-l10n';
import {NgModel} from '@angular/forms';
import {Subscription} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {SncrTranslateService} from '../sncr-translate/sncr-translate.service';
import {UtilsService} from '../sncr-commons/utils.service';

@Component({
  selector: 'sncr-multi-select',
  templateUrl: 'sncr-multi-select.component.html',
  styleUrls: ['sncr-multi-select.component.scss']
})
export class SncrMultiSelectComponent implements AfterViewInit, AfterViewChecked, OnDestroy, OnChanges {

  /**
   * cols for dynamic columns.
   */
  @Input() cols: Column[];

  @Output() colsChange: EventEmitter<Column[]> = new EventEmitter();

  @Input() hideColSelect = false;

  @Language() lang: string;

  @ViewChild('inputFilter') inputFilter: NgModel;

  @ViewChild('dropdown') customDropDown: ElementRef;

  colsCopy = [];
  searchCols = '';

  private inputFilter$: Subscription;

  constructor(private translation: TranslationService,
              private cdr: ChangeDetectorRef,
              private sncrTranslateService: SncrTranslateService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cols']) {
      if (UtilsService.isEmpty(this.searchCols)) {
        if (UtilsService.notNull(this.cols)) {
          this.colsCopy = [...this.cols];
        }
      }
    }
  }


  public moveUpAndDown(col, status) {
    this.cols.splice(this.cols.indexOf(col), 1);
    if (status) {
      this.cols.unshift(col);
    } else {
      this.cols.push(col);
    }
    this.assignColsCopy();
    this.colsChange.emit(this.cols);
  }

  reorderCols(col, newPosition, value) {
    if (newPosition === 0) {
      newPosition = this.cols.indexOf(col) + value;
    }
    this.cols[this.cols.indexOf(col)] = this.cols[newPosition];
    this.cols[newPosition] = col;
    this.assignColsCopy();
    this.colsChange.emit(this.cols);
  }

  ngAfterViewInit(): void {
    this.inputFilter$ = this.inputFilter.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value: string) => {
        if (value) {
          this.colsCopy = [...this.cols.filter(col => this.translation.translate(col.title).toLowerCase().includes(value.toLowerCase()))];
        } else {
          this.assignColsCopy();
        }
        this.searchCols = value;
        this.cdr.detectChanges();
      });
  }

  ngAfterViewChecked(): void {
    // this.customDropDown.nativeElement.scrollTop = 0;
  }

  ngOnDestroy(): void {
    if (this.inputFilter$) {
      this.inputFilter$.unsubscribe();
    }
  }

  assignColsCopy() {
    if (UtilsService.notNull(this.cols)) {
      this.colsCopy = [...this.cols];
    }
  }

  resetFilter(event) {
    event.stopPropagation();
    this.searchCols = '';
  }

  getPlaceholderKeyword(key, params?) {
      return this.sncrTranslateService.getTranslation(key, null, params);
  }
}
