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
import {SncrDatatableService} from '../sncr-datatable.service';
import {MockSncrDatatableService} from './mocks/mock-sncr-datatable-service';
import {SncrDatatableComponent} from '../sncr-datatable.component';

describe('Data Table', () => {
  let fixture: ComponentFixture<SncrDatatableComponent>;

  const BASE_URL = '/fakeUrl/';

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

  test('should filter text column', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: '/fakeURL/fakeTable',
      filter: true
    });
    tick();

    const columnIndex = 1;
    const filterValue = '5';
    Utils.enterQckFilterValue(fixture, filterValue, columnIndex);
    tick(500);

    fixture.detectChanges();
    let columnContent = Utils.getColumnContent(fixture, columnIndex);

    expect(
      columnContent.length &&
        columnContent.every(value => value.includes(filterValue))
    ).toBeTruthy();
  }));

  test('should filter number column', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: BASE_URL,
      filter: true
    });
    tick();

    const columnIndex = 5;
    const filterValue = 5;
    Utils.enterQckFilterValue(fixture, filterValue, columnIndex);
    tick(500);

    fixture.detectChanges();
    let columnContent = Utils.getColumnContent(fixture, columnIndex);

    expect(
      columnContent.length &&
        columnContent.every(value => parseInt(value, 10) === filterValue)
    ).toBeTruthy();
  }));

  test('should filter date column (programmatically)', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: BASE_URL,
      filter: true
    });
    tick();

    const columnIndex = 4;
    const filterValue = Utils.getColumnContent(fixture, columnIndex)[0];
    Utils.enterQckFilterValue(
      fixture,
      Utils.toUTCTimeStamp(filterValue),
      columnIndex
    );
    tick(500);

    fixture.detectChanges();
    let columnContent = Utils.getColumnContent(fixture, columnIndex);

    expect(
      columnContent.length &&
        columnContent.every(value => value === filterValue)
    ).toBeTruthy();
  }));

  test('should filter date column (pick date)', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: BASE_URL,
      filter: true
    });
    tick();

    const columnIndex = 4;
    const filterValue = Utils.getColumnContent(fixture, columnIndex)[0];
    Utils.clickFilterInput(fixture, columnIndex);
    Utils.pickDate(fixture, filterValue);
    tick(500);

    fixture.detectChanges();
    let columnContent = Utils.getColumnContent(fixture, columnIndex);

    expect(
      columnContent.length &&
        columnContent.every(value => value === filterValue)
    ).toBeTruthy();
  }));
});
