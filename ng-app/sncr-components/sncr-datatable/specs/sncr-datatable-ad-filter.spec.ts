import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslationModule} from 'angular-l10n';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {configureTestSuite} from 'ng-bullet';

import {SncrDatatableModule} from '../sncr-datatable.module';
import {AppService} from '../../../app/app.service';
import {SncrTranslateService} from '../../sncr-translate/sncr-translate.service';

import Utils from './utils';
import {SncrDatatableComponent} from '../sncr-datatable.component';

describe('Data Table', () => {
  let fixture: ComponentFixture<SncrDatatableComponent>;

  const stringFilterConfig = {
    defaultValue: 'INC',
    options: ['E', 'NE', 'EQ', 'NEQ', 'INC', 'NINC']
  };

  const numberFilterConfig = {
    defaultValue: 'EQ',
    options: ['E', 'NE', 'EQ', 'NEQ', 'GT', 'GTE', 'LT', 'LTE']
  };

  const dateFilterConfig = {
    defaultValue: 'EQ',
    options: ['E', 'NE', 'EQ', 'NEQ', 'GT', 'GTE', 'LT', 'LTE']
  };

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

  test('should preselect default comparator have correct comparators depending on type', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      filter: true
    });

    const stringColumnIndex = 1;
    const dateColumnIndex = 4;
    const numberColumnIndex = 5;

    Utils.clickAdFilterIcon(fixture, stringColumnIndex);
    tick(10);
    let currentFilterConfig = Utils.getAdFilterPopupConfig(fixture);
    expect(currentFilterConfig).toEqual(stringFilterConfig);

    Utils.clickAdFilterIcon(fixture, dateColumnIndex);
    tick(10);
    currentFilterConfig = Utils.getAdFilterPopupConfig(fixture);
    expect(Utils.getAdFilterPopupConfig(fixture)).toEqual(dateFilterConfig);

    Utils.clickAdFilterIcon(fixture, numberColumnIndex);
    tick(10);
    currentFilterConfig = Utils.getAdFilterPopupConfig(fixture);
    expect(Utils.getAdFilterPopupConfig(fixture)).toEqual(numberFilterConfig);
  }));

  test('should adfilter string column', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      filter: true
    });

    const columnIndex = 1;
    const filterValue = 5;

    Utils.clickAdFilterIcon(fixture, columnIndex);
    tick(10);

    Utils.enterAdFilterValue(fixture, filterValue);
    Utils.submitAdFilter(fixture);
    tick(500);

    let columnContent = Utils.getColumnContent(fixture, columnIndex);
    expect(
      columnContent.length &&
        columnContent.every(value => value.includes(filterValue))
    ).toBeTruthy();
  }));

  test('should adfilter string column for empty & non-empty', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      filter: true
    });

    const columnIndex = 2;
    Utils.clickAdFilterIcon(fixture, columnIndex);
    tick();
    Utils.selectAdComparator(fixture, 'E');
    tick();
    Utils.submitAdFilter(fixture);
    tick(500);

    let columnContent = Utils.getColumnContent(fixture, columnIndex);
    expect(
      columnContent.length && columnContent.every(value => value === '')
    ).toBeTruthy();

    Utils.clickAdFilterIcon(fixture, columnIndex);
    tick();
    Utils.selectAdComparator(fixture, 'NE');
    tick();
    Utils.submitAdFilter(fixture);
    tick(500);
    columnContent = Utils.getColumnContent(fixture, columnIndex);
    expect(
      columnContent.length && columnContent.every(value => value.length)
    ).toBeTruthy();
  }));

  test('should adfilter string column using AND logical operation', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      filter: true
    });

    const columnIndex = 1;
    const filterValue1 = 5;
    const filterValue2 = 9;

    Utils.clickAdFilterIcon(fixture, columnIndex);
    tick(10);

    Utils.enterAdFilterValue(fixture, filterValue1);
    Utils.clickAdFilterLogicalOperation(fixture, 1);
    tick(10);

    Utils.enterAdFilterValue(fixture, filterValue2, 2);
    Utils.submitAdFilter(fixture);
    tick(500);

    const columnContent = Utils.getColumnContent(fixture, columnIndex);
    expect(
      columnContent.length &&
        columnContent.every(
          value => value.includes(filterValue1) && value.includes(filterValue2)
        )
    ).toBeTruthy();
  }));

  test('should adfilter date column programically', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      filter: true
    });

    const columnIndex = 4;
    const filterValue = Utils.getColumnContent(fixture, columnIndex)[0];

    Utils.clickAdFilterIcon(fixture, columnIndex);
    tick(10);

    Utils.enterAdFilterValue(fixture, Utils.toUTCTimeStamp(filterValue));
    Utils.submitAdFilter(fixture);
    tick(500);

    const columnContent = Utils.getColumnContent(fixture, columnIndex);
    expect(
      columnContent.length &&
        columnContent.every(value => value === filterValue)
    ).toBeTruthy();
  }));

  test('should adfilter date column pick date', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      filter: true
    });

    const columnIndex = 4;
    const filterValue = Utils.getColumnContent(fixture, columnIndex)[0];

    Utils.clickAdFilterIcon(fixture, columnIndex);
    tick(10);

    Utils.clickAdFilterInput(fixture);
    Utils.pickDate(fixture, filterValue);
    Utils.submitAdFilter(fixture);
    tick(500);

    const columnContent = Utils.getColumnContent(fixture, columnIndex);
    expect(
      columnContent.length &&
        columnContent.every(value => value === filterValue)
    ).toBeTruthy();
  }));

  test('should adfilter number column', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      filter: true
    });

    const columnIndex = 5;
    const filterValue = 55;

    Utils.clickAdFilterIcon(fixture, columnIndex);
    tick(10);

    Utils.enterAdFilterValue(fixture, filterValue);
    Utils.submitAdFilter(fixture);
    tick(500);

    const columnContent = Utils.getColumnContent(fixture, columnIndex);
    expect(
      columnContent.length &&
        columnContent.every(value => parseInt(value, 10) === filterValue)
    ).toBeTruthy();
  }));

  test('should adfilter number column using OR logical operation', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      filter: true
    });

    const columnIndex = 5;
    const filterValue1 = 10;
    const filterValue2 = 20;
    const comparator1 = 'LTE';
    const comparator2 = 'GTE';

    Utils.clickAdFilterIcon(fixture, columnIndex);
    tick(10);

    Utils.enterAdFilterValue(fixture, filterValue1);
    Utils.selectAdComparator(fixture, comparator1);
    Utils.clickAdFilterLogicalOperation(fixture, 2);
    tick(10);
    Utils.enterAdFilterValue(fixture, filterValue2, 2);
    Utils.selectAdComparator(fixture, comparator2, 2);
    Utils.submitAdFilter(fixture);
    tick(500);

    const columnContent = Utils.getColumnContent(fixture, columnIndex);
    const matches = function(value) {
      value = parseInt(value, 10);
      return value <= filterValue1 || value >= filterValue2;
    };
    expect(columnContent.length && columnContent.every(matches)).toBeTruthy();
  }));

  test('should reset adfilter', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      filter: true
    });

    const columnIndex = 1;
    const filterValue1 = 'xxxx';

    Utils.clickAdFilterIcon(fixture, columnIndex);
    tick(10);

    Utils.enterAdFilterValue(fixture, filterValue1);
    Utils.submitAdFilter(fixture);
    tick(500);

    let columnContent = Utils.getColumnContent(fixture, columnIndex);
    expect(columnContent).toEqual(['DATATABLE-EMPTY_MESSAGE']);

    Utils.clickAdFilterIcon(fixture, columnIndex);
    tick(10);
    Utils.resetAdFilter(fixture);
    tick(500);
    columnContent = Utils.getColumnContent(fixture, columnIndex);
    expect(columnContent.length).not.toEqual(0);
  }));
});
