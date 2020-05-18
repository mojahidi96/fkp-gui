import {configureTestSuite} from 'ng-bullet';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {
  TranslatePipe,
  TranslationModule,
  TranslationProvider
} from 'angular-l10n';
import {SncrTranslateService} from '../../sncr-translate/sncr-translate.service';
import {SncrDatatableModule} from '../sncr-datatable.module';
import {AppService} from '../../../app/app.service';
import Utils from './utils';
import {MockBanUpdateInfoService} from './mocks/mock-ban-update-info.service';
import {BanUpdateInfoService} from '../../../ban-update-info/ban-update-info.service';
import {MockAppService} from './mocks/mock-app.service';
import {MockTranslationProvider} from './mocks/mock-translation.provider';
import {SvgLoader} from 'angular-svg-icon';
import {MockSvgLoader} from './mocks/mock-svg-loader';
import {TranslatePipe as MockTranslatePipe} from '../../../../test-mocks/translate.pipe';
import {SncrDatatableService} from '../sncr-datatable.service';
import {MockSncrDatatableService} from './mocks/mock-sncr-datatable-service';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {SncrDatatableComponent} from '../sncr-datatable.component';
import {LazyParams} from '../lazy-params';

describe('Data table lazy selection', () => {
  const BASE_URL = '/fakeUrl/',
    PAGINATION_NEXT_SELECTOR = '.ui-paginator-next',
    SELECT_ALL_SELECTOR = 'table sncr-button button i.fa-check',
    TABLE_CHECKBOX_SELECTOR = 'table sncr-checkbox input',
    TABLE_CHECKED_CHECKBOX_SELECTOR = 'table sncr-checkbox input:checked',
    UNSELECT_ALL_SELECTOR = 'table sncr-button button i.fa-remove';

  let datatableService: SncrDatatableService,
    fixture: ComponentFixture<SncrDatatableComponent>,
    selectCount;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        SncrDatatableModule
      ],
      providers: [
        {provide: AppService, useClass: MockAppService},
        {provide: BanUpdateInfoService, useClass: MockBanUpdateInfoService},
        {provide: SvgLoader, useClass: MockSvgLoader},
        {provide: SncrDatatableService, useClass: MockSncrDatatableService},
        {provide: TranslatePipe, useClass: MockTranslatePipe},
        {provide: TranslationProvider, useClass: MockTranslationProvider}
      ]
    });
  });

  beforeEach(() => {
    datatableService = TestBed.get(SncrDatatableService);
    selectCount = 0;
  });

  afterEach(() => {
    fixture.destroy();
    jest.clearAllMocks();
  });

  test('Nothing selected by default', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: BASE_URL,
      multiSelection: true
    });
    tick();

    expect(fixture.componentInstance.selection.length).toBe(0);
    expect(fixture.componentInstance.selectCount).toBe(0);

    Utils.clickElement(fixture, TABLE_CHECKBOX_SELECTOR, 'change');
    tick();
    fixture.detectChanges();
    expect(fixture.componentInstance.selection.length).toBe(1);
    expect(fixture.componentInstance.selectCount).toBe(1);

    const checkedEls = fixture.debugElement.queryAll(
      By.css(TABLE_CHECKED_CHECKBOX_SELECTOR)
    );
    expect(checkedEls.length).toBe(1);
  }));

  test('Should have 3 selected by default', fakeAsync(() => {
    const getDataFn = jest.spyOn(datatableService, 'getData'),
      lazyParams: Partial<LazyParams> = {
        sortField: '_sncrChecked',
        first: 0,
        rows: 10,
        filters: []
      };

    getDataFn.mockImplementationOnce(() => {
      const originalDS = new MockSncrDatatableService();
      return originalDS.getData('', lazyParams, []).then(({rows, id}) => {
        const newRows = JSON.parse(rows).map((row, i) => {
          if (i < 3) {
            return {...row, _sncrChecked: true};
          }
          return row;
        });
        return {rows: JSON.stringify(newRows), id};
      });
    });

    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: BASE_URL,
      multiSelection: true
    });
    tick();

    const checkedEls = fixture.debugElement.queryAll(
      By.css(TABLE_CHECKED_CHECKBOX_SELECTOR)
    );
    expect(checkedEls.length).toBe(3);
  }));

  test('Should count selection when changing page', fakeAsync(() => {
    let selectedMap;

    const getDataFn = jest.spyOn(datatableService, 'getData');
    datatableService.getSelectCount = jest.fn(() => {
      return of({count: selectCount}).toPromise();
    });

    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: BASE_URL,
      multiSelection: true
    });
    tick();

    Utils.clickElement(fixture, TABLE_CHECKBOX_SELECTOR, 'change');
    tick();
    fixture.detectChanges();
    selectedMap = Array.from(fixture.componentInstance.selectedMap.values());
    expect(selectedMap).toEqual([{id: 1, sel: 'Y'}]);
    expect(fixture.componentInstance.selectCount).toBe(1);

    selectCount = fixture.componentInstance.selectCount;
    Utils.clickElement(fixture, PAGINATION_NEXT_SELECTOR);
    tick();
    fixture.detectChanges();
    expect(getDataFn.mock.calls[1][2]).toEqual(selectedMap);

    Utils.clickElement(fixture, TABLE_CHECKBOX_SELECTOR, 'change');
    tick();
    fixture.detectChanges();
    selectedMap = Array.from(fixture.componentInstance.selectedMap.values());
    expect(selectedMap).toEqual([{id: 11, sel: 'Y'}]);
    expect(fixture.componentInstance.selectCount).toBe(2);

    selectCount = fixture.componentInstance.selectCount;
    Utils.clickElement(fixture, PAGINATION_NEXT_SELECTOR);
    tick();
    fixture.detectChanges();
    expect(getDataFn.mock.calls[2][2]).toEqual(selectedMap);
  }));

  test('should send select all flag always after having clicked select all', fakeAsync(() => {
    const {getDataFn, updateOnSelectAllFn} = Utils.getDataTableServiceSpies(
      datatableService
    );

    datatableService.getSelectCount = jest.fn(() => {
      return of({count: selectCount}).toPromise();
    });

    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: BASE_URL,
      multiSelection: true
    });
    tick();

    Utils.clickElement(fixture, SELECT_ALL_SELECTOR, 'change');
    tick();
    fixture.detectChanges();
    tick();

    expect(updateOnSelectAllFn.mock.calls[0][0]).toMatchObject({
      selectAll: 'true'
    });
    expect(fixture.componentInstance.selectCount).toBe(100);
    const checkedEls = fixture.debugElement.queryAll(
      By.css(TABLE_CHECKED_CHECKBOX_SELECTOR)
    );
    expect(checkedEls.length).toBe(10);

    Utils.clickElement(fixture, TABLE_CHECKBOX_SELECTOR, 'change');
    tick();
    fixture.detectChanges();
    selectCount = 99;
    expect(fixture.componentInstance.selectCount).toBe(selectCount);

    Utils.clickElement(fixture, PAGINATION_NEXT_SELECTOR);
    tick();
    fixture.detectChanges();
    const dataCall = getDataFn.mock.calls[1];
    expect(fixture.componentInstance.selectCount).toBe(99);

    // Parameters being sent to backend on pagination
    expect(dataCall[1]).toMatchObject({selectAll: 'true'});
    expect(dataCall[2]).toEqual([{id: 1, sel: 'N'}]);
  }));

  test('should stop sending select All after clicking on unselect all', fakeAsync(() => {
    const {getDataFn, updateOnSelectAllFn} = Utils.getDataTableServiceSpies(
      datatableService
    );

    datatableService.getSelectCount = jest.fn(() => {
      return of({count: selectCount}).toPromise();
    });

    fixture = Utils.createHostComponent({
      lazy: true,
      lazyLoadUrl: BASE_URL,
      multiSelection: true
    });
    tick();

    Utils.clickElement(fixture, SELECT_ALL_SELECTOR, 'change');
    tick();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectCount).toBe(100);
    expect(updateOnSelectAllFn.mock.calls[0][0]).toMatchObject({
      selectAll: 'true'
    });

    Utils.clickElement(fixture, UNSELECT_ALL_SELECTOR, 'change');
    tick();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectCount).toBe(0);
    expect(updateOnSelectAllFn.mock.calls[1][0]).toMatchObject({
      selectAll: 'false'
    });
    const checkedEls = fixture.debugElement.queryAll(
      By.css(TABLE_CHECKED_CHECKBOX_SELECTOR)
    );
    expect(checkedEls.length).toBe(0);

    Utils.clickElement(fixture, TABLE_CHECKBOX_SELECTOR, 'change');
    tick();
    fixture.detectChanges();
    selectCount = 1;
    expect(fixture.componentInstance.selectCount).toBe(1);

    Utils.clickElement(fixture, PAGINATION_NEXT_SELECTOR);
    tick();
    fixture.detectChanges();
    const dataCall = getDataFn.mock.calls[1];
    expect(fixture.componentInstance.selectCount).toBe(1);
    // Parameters being sent to backend on pagination
    expect(dataCall[1]).toMatchObject({selectAll: 'false'});
    expect(dataCall[2]).toEqual([{id: 1, sel: 'Y'}]);
  }));
});
