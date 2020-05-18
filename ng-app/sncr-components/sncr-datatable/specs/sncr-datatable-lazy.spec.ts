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

import {MockSncrDatatableService} from './mocks/mock-sncr-datatable-service';
import {SncrDatatableService} from '../sncr-datatable.service';
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
      providers: [
        AppService,
        {provide: SncrDatatableService, useClass: MockSncrDatatableService}
      ]
    });
  });

  afterEach(() => {
    fixture.destroy();
    jest.clearAllMocks();
  });

  test('should display empty message', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: '/fakeURL/emptyTable'
    });

    tick();

    const emptymessageEl = fixture.debugElement.query(
      By.css('.ui-datatable-emptymessage > span')
    );
    expect(emptymessageEl.nativeElement.textContent).toEqual(
      'DATATABLE-EMPTY_MESSAGE'
    );
  }));

  test('should display x item per page', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: '/fakeURL/fakeTable'
    });
    tick();

    // Check the number of rows correspond to the initial itemPerPage(10) set in the paginator
    const itemPerPageSelectEl = fixture.debugElement.query(
      By.css('sncr-paginator select')
    ).nativeElement;
    let itemPerPage = parseInt(itemPerPageSelectEl.value, 10);
    let numberOfRows = fixture.debugElement.queryAll(By.css('table tbody tr'))
      .length;

    expect(numberOfRows).toEqual(itemPerPage);

    // change itemPerPage to 20 and check that 20 rows are displayed
    itemPerPageSelectEl.value = 20;
    itemPerPageSelectEl.dispatchEvent(new Event('change'));
    tick();

    fixture.detectChanges();
    itemPerPage = parseInt(itemPerPageSelectEl.value, 10);
    numberOfRows = fixture.debugElement.queryAll(By.css('table tbody tr'))
      .length;

    expect(numberOfRows).toEqual(itemPerPage);
  }));

  test('should paginate', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: '/fakeURL/fakeTable'
    });
    tick();

    let paginationPages = fixture.debugElement
      .query(By.css('sncr-paginator'))
      .queryAll(By.css('.ui-paginator-pages a.ui-paginator-page'));

    expect(
      paginationPages.map(el => el.nativeElement.textContent.trim())
    ).toEqual(Utils.getPages(fixture.componentInstance.totalRecords, 1));

    let selectPageIndex = 7;
    let selectPage = paginationPages[selectPageIndex];
    selectPage.nativeElement.click();
    tick();

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
    tick();

    fixture.detectChanges();
    paginationPages = fixture.debugElement
      .query(By.css('sncr-paginator'))
      .queryAll(By.css('.ui-paginator-pages a.ui-paginator-page'));

    expect(
      paginationPages.map(el => el.nativeElement.textContent.trim())
    ).toEqual(Utils.getPages(fixture.componentInstance.totalRecords, 1, 20));
  }));
});
