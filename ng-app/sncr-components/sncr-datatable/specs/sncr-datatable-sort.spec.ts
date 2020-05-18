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
import {SncrDatatableService} from '../sncr-datatable.service';
import {MockSncrDatatableService} from './mocks/mock-sncr-datatable-service';

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

  test('should sort by text column ascending', () => {
    fixture = Utils.createHostComponent({});

    const columnIndex = 1;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);

    columnHeader.click();
    fixture.detectChanges();

    expect(columnHeader.classList).toContain('ui-state-active');

    const columnContent = Utils.getColumnContent(fixture, columnIndex);

    expect(Utils.isSortedArray(columnContent)).toBeTruthy();
  });

  test('should sort by text column descending', () => {
    fixture = Utils.createHostComponent({});

    const columnIndex = 1;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);

    columnHeader.click();
    columnHeader.click();
    fixture.detectChanges();

    expect(columnHeader.classList).toContain('ui-state-active');

    const columnContent = Utils.getColumnContent(fixture, columnIndex);

    expect(Utils.isSortedArray(columnContent, false)).toBeTruthy();
  });

  test('should sort by date column ascending', () => {
    fixture = Utils.createHostComponent({});

    const columnIndex = 4;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);

    columnHeader.click();
    fixture.detectChanges();

    expect(columnHeader.classList).toContain('ui-state-active');

    const columnContent = Utils.getColumnContent(fixture, columnIndex).map(c =>
      Date.parse(Utils.normalizeDate(c))
    );

    expect(Utils.isSortedArray(columnContent)).toBeTruthy();
  });

  test('should sort by date column descending', () => {
    fixture = Utils.createHostComponent({});

    const columnIndex = 4;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);

    columnHeader.click();
    columnHeader.click();
    fixture.detectChanges();

    expect(columnHeader.classList).toContain('ui-state-active');

    const columnContent = Utils.getColumnContent(fixture, columnIndex).map(c =>
      Date.parse(Utils.normalizeDate(c))
    );

    expect(Utils.isSortedArray(columnContent, false)).toBeTruthy();
  });

  test('should sort by number column ascending', () => {
    fixture = Utils.createHostComponent({});
    const columnIndex = 5;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);

    columnHeader.click();
    fixture.detectChanges();

    expect(columnHeader.classList).toContain('ui-state-active');

    const columnContent = Utils.getColumnContent(fixture, columnIndex).map(c =>
      parseInt(c, 10)
    );

    expect(Utils.isSortedArray(columnContent)).toBeTruthy();
  });

  test('should sort by number column descending', () => {
    fixture = Utils.createHostComponent({});
    const columnIndex = 5;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);

    columnHeader.click();
    columnHeader.click();
    fixture.detectChanges();

    expect(columnHeader.classList).toContain('ui-state-active');

    const columnContent = Utils.getColumnContent(fixture, columnIndex).map(c =>
      parseInt(c, 10)
    );

    expect(Utils.isSortedArray(columnContent, false)).toBeTruthy();
  });

  // Lazy
  test('should sort by text column ascending - lazy', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: '/fakeURL/fakeTable'
    });
    tick();

    const columnIndex = 1;

    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);
    columnHeader.click();
    tick();

    fixture.detectChanges();
    let columnContent = Utils.getColumnContent(fixture, columnIndex);

    expect(
      columnContent.length && Utils.isSortedArray(columnContent)
    ).toBeTruthy();
  }));

  test('should sort by text column descending - lazy', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: '/fakeURL/fakeTable'
    });
    tick();

    const columnIndex = 1;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);
    columnHeader.click();
    columnHeader.click();
    tick();

    fixture.detectChanges();
    let columnContent = Utils.getColumnContent(fixture, columnIndex);

    expect(
      columnContent.length && Utils.isSortedArray(columnContent, false)
    ).toBeTruthy();
  }));

  test('should sort by date column ascending - lazy', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: '/fakeURL/fakeTable'
    });
    tick();

    const columnIndex = 4;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);
    columnHeader.click();
    tick();

    fixture.detectChanges();
    let columnContent = Utils.getColumnContent(fixture, columnIndex).map(c =>
      Date.parse(Utils.normalizeDate(c))
    );

    expect(
      columnContent.length && Utils.isSortedArray(columnContent)
    ).toBeTruthy();
  }));

  test('should sort by date column descending - lazy', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: '/fakeURL/fakeTable'
    });
    tick();

    const columnIndex = 4;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);
    columnHeader.click();
    columnHeader.click();
    tick();

    fixture.detectChanges();
    let columnContent = Utils.getColumnContent(fixture, columnIndex).map(c =>
      Date.parse(Utils.normalizeDate(c))
    );

    expect(
      columnContent.length && Utils.isSortedArray(columnContent, false)
    ).toBeTruthy();
  }));

  test('should sort by number column ascending - lazy', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: '/fakeURL/fakeTable'
    });
    tick();

    const columnIndex = 5;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);
    columnHeader.click();
    tick();

    fixture.detectChanges();
    let columnContent = Utils.getColumnContent(fixture, columnIndex).map(c =>
      parseInt(c, 10)
    );
    expect(
      columnContent.length && Utils.isSortedArray(columnContent)
    ).toBeTruthy();
  }));

  test('should sort by number column descending - lazy', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: '/fakeURL/fakeTable'
    });
    tick();

    const columnIndex = 5;
    const columnHeader = Utils.getColumnHeader(fixture, columnIndex);
    columnHeader.click();
    columnHeader.click();
    tick();

    fixture.detectChanges();
    let columnContent = Utils.getColumnContent(fixture, columnIndex).map(c =>
      parseInt(c, 10)
    );

    expect(
      columnContent.length && Utils.isSortedArray(columnContent, false)
    ).toBeTruthy();
  }));
});
