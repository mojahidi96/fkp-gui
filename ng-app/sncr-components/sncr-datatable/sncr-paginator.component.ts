import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {Paginator} from 'primeng/paginator';
import {Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {SncrTranslateDirective} from '../sncr-translate/sncr-translate.directive';
import {SncrDatatableService} from './sncr-datatable.service';
import {FilterRestoreService} from '../sncr-commons/filter-restore.service';

@Component({
  selector: 'sncr-paginator',
  templateUrl: 'sncr-paginator.component.html',
  styleUrls: ['sncr-paginator.component.scss']
})
export class SncrPaginatorComponent extends Paginator
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(SncrTranslateDirective) viewTranslations: QueryList<
    SncrTranslateDirective
  >;

  @Input() allEditForm: FormGroup;
  @Input() isNew: boolean;
  @Input() prefix: string;
  @Input() restoreViewOption = false;
  @Input() pageLinkSize = 7;
  @Output() rowsChange = new EventEmitter();
  @Output() firstChange = new EventEmitter();

  private subscriptions$: Subscription[] = [];

  constructor(
    private datatableService: SncrDatatableService,
    private cdr: ChangeDetectorRef,
    private filterRestoreService: FilterRestoreService
  ) {
    super(cdr);
  }

  ngOnInit(): void {
    this.pageLinks.splice(0, 1);
    this.subscriptions$.push(
      this.onPageChange.subscribe(() => {
        this.firstChange.emit(this.first);
      })
    );
    if (this.restoreViewOption) {
      this.filterRestoreService.getPageRows().subscribe(previousSavedRows => {
        if (previousSavedRows) {
          this.rows = previousSavedRows;
          this.rowsChange.emit(this.rows);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.subscriptions$.push(
      this.viewTranslations.changes.subscribe(() => {
        this.viewTranslations.forEach(t => (t.prefix = this.prefix));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }

  isHidden(pageLink, page, pageCount) {
    page = page + 1;
    let hide = false;

    if (pageLink === 1 || pageLink === pageCount) {
      hide = true;
    } else if (pageCount <= 8) {
      hide = false;
    } else if (pageCount - page < 4 || page <= 4) {
      hide = false;
    } else if (Math.abs(pageLink - page) > 2) {
      hide = true;
    }

    return hide;
  }

  getButtonClass(pageLink) {
    if (pageLink < 10) {
      return '';
    } else if (pageLink < 100) {
      return 'digits-3';
    } else if (pageLink < 1000) {
      return 'digits-4';
    } else {
      return 'digits-5';
    }
  }

  onRppChange(val): void {
    if (!this.formInvalid()) {
      this.rows = parseInt(val, 10);
      if (this.restoreViewOption) {
        this.filterRestoreService.setViewOption(this.rows);
      }
      this.rowsChange.emit(this.rows);
      this.changePage(this.getPage());
      setTimeout(() => this.cdr.markForCheck());
    }
  }

  changePageToPrev(event) {
    if (!this.formInvalid(event)) {
      super.changePageToPrev(event);
    }
  }

  onPageLinkClick(event, page) {
    if (!this.formInvalid(event) && this.getPage() !== page) {
      super.onPageLinkClick(event, page);
    }
  }

  changePageToNext(event) {
    if (!this.formInvalid(event)) {
      super.changePageToNext(event);
    }
  }

  formInvalid(event?) {
    if (event) {
      event.preventDefault();
    }
    return SncrDatatableService.areDirtyFormsInvalid(this.allEditForm);
  }
}
