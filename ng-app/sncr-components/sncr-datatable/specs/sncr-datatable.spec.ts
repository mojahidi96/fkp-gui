import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslationModule} from 'angular-l10n';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {By} from '@angular/platform-browser';
import {configureTestSuite} from 'ng-bullet';

import {SncrDatatableModule} from '../sncr-datatable.module';
import {AppService} from '../../../app/app.service';
import {SncrTranslateService} from '../../sncr-translate/sncr-translate.service';

import Utils from './utils';
import {SncrDatatableComponent} from '../sncr-datatable.component';

describe('Data Table', () => {
  let fixture: ComponentFixture<SncrDatatableComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        SncrDatatableModule
      ],
      providers: [AppService]
    });
  });

  afterEach(() => {
    fixture.destroy();
    jest.clearAllMocks();
  });

  test('should display empty message', () => {
    fixture = Utils.createHostComponent({
      value: [],
      multiSelection: true,
      selection: []
    });
    const emptymessageEl = fixture.debugElement.query(
      By.css('.ui-datatable-emptymessage > span')
    );
    expect(emptymessageEl.nativeElement.textContent).toEqual(
      'DATATABLE-EMPTY_MESSAGE'
    );
  });

  test('should display filters', () => {
    fixture = Utils.createHostComponent({
      multiSelection: true,
      selection: [],
      filter: true
    });
    const filterListEl = fixture.debugElement.queryAll(
      By.css('sncr-advanced-filter')
    );
    expect(filterListEl.length).not.toEqual(0);
  });

  test('should hide filters', () => {
    fixture = Utils.createHostComponent({
      multiSelection: true,
      selection: [],
      filter: false
    });
    const filterListEl = fixture.debugElement.queryAll(
      By.css('sncr-advanced-filter')
    );
    expect(filterListEl.length).toEqual(0);
  });

  test('should show multi selection', () => {
    fixture = Utils.createHostComponent({
      multiSelection: true,
      selection: [],
      filter: false
    });
    let checkboxListEl = fixture.debugElement.queryAll(By.css('sncr-checkbox'));

    expect(checkboxListEl.length).toEqual(10);
  });

  test('should filter', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      filter: true
    });

    let firstColumnFilterIn = fixture.debugElement.query(
      By.css('table thead th:first-child input')
    ).nativeElement;

    tick();

    const filterValue = '5';
    firstColumnFilterIn.value = filterValue;
    firstColumnFilterIn.dispatchEvent(new Event('input', {bubbles: true}));

    tick(500);
    fixture.detectChanges();

    let firstColumnContent = fixture.debugElement
      .queryAll(By.css('table > tbody > tr > td:first-child'))
      .map(el => el.nativeElement.textContent);

    expect(
      firstColumnContent.every(value => value.includes(filterValue))
    ).toBeTruthy();
  }));

  test('should select/deselect all', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      multiSelection: true,
      selection: [],
      filter: false
    });
    const selectAllBtn = fixture.debugElement.query(
      By.css('.col-select-all sncr-button:first-child')
    );
    selectAllBtn.nativeElement.click();
    tick();

    let checkboxListEl = fixture.debugElement
      .queryAll(By.css('input[type="checkbox"]'))
      .map(el => el.nativeElement.checked);
    expect(checkboxListEl.every(i => i)).toBeTruthy();
  }));

  test('should show single selection', () => {
    fixture = Utils.createHostComponent({
      selectionMode: 'radio'
    });
    const radioListEl = fixture.debugElement.queryAll(By.css('sncr-radio'));
    expect(radioListEl.length).toEqual(10);
  });

  test('should paginate', () => {
    fixture = Utils.createHostComponent({});
    let paginationPages = fixture.debugElement
      .query(By.css('sncr-paginator'))
      .queryAll(By.css('.ui-paginator-pages a.ui-paginator-page'));

    expect(
      paginationPages.map(el => el.nativeElement.textContent.trim())
    ).toEqual(Utils.getPages(fixture.componentInstance.totalRecords, 1));

    let selectPageIndex = 7;
    let selectPage = paginationPages[selectPageIndex];
    selectPage.nativeElement.click();
    fixture.detectChanges();

    paginationPages = fixture.debugElement
      .query(By.css('sncr-paginator'))
      .queryAll(By.css('.ui-paginator-pages a.ui-paginator-page'));

    expect(
      paginationPages.map(el => el.nativeElement.textContent.trim())
    ).toEqual(
      Utils.getPages(fixture.componentInstance.totalRecords, selectPageIndex)
    );

    let itemPerPage = fixture.debugElement
      .query(By.css('sncr-paginator'))
      .query(By.css('select'));

    itemPerPage.nativeElement.value = 20;
    itemPerPage.nativeElement.dispatchEvent(
      new Event('change', {bubbles: true})
    );

    fixture.detectChanges();

    paginationPages = fixture.debugElement
      .query(By.css('sncr-paginator'))
      .queryAll(By.css('.ui-paginator-pages a.ui-paginator-page'));

    expect(
      paginationPages.map(el => el.nativeElement.textContent.trim())
    ).toEqual(Utils.getPages(fixture.componentInstance.totalRecords, 1, 20));
  });
});
