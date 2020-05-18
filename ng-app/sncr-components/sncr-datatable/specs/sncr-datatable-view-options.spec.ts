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

describe('Data Table View Options', () => {
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

  test('should display columns enabled in view options', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      columnSelection: true
    });
    Utils.openViewOptions(fixture);
    tick();
    let viewOptions = Utils.getViewOptions(fixture);
    expect(viewOptions.filter(it => it.checked).map(it => it.label)).toEqual(
      Utils.getColumnHeaders(fixture)
    );
    // uncheck first column
    Utils.toggleViewOption(fixture, 1);
    viewOptions[0].checked = false;
    // check last column
    Utils.toggleViewOption(fixture, 6);
    viewOptions[5].checked = true;
    tick();

    expect(viewOptions.filter(it => it.checked).map(it => it.label)).toEqual(
      Utils.getColumnHeaders(fixture)
    );
  }));

  test('should move down in view options', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      columnSelection: true
    });
    Utils.openViewOptions(fixture);
    tick();
    const initialViewOptions = Utils.getViewOptions(fixture);

    // move the first option down
    Utils.clickMoveViewOption(fixture, 1, '.fa-angle-down');
    Utils.moveArrayElement(initialViewOptions, 0, 'down');
    tick();

    const viewOptions = Utils.getViewOptions(fixture);
    expect(initialViewOptions).toEqual(viewOptions);
    expect(viewOptions.filter(it => it.checked).map(it => it.label)).toEqual(
      Utils.getColumnHeaders(fixture)
    );
  }));

  test('should move up in view options', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      columnSelection: true
    });
    Utils.openViewOptions(fixture);
    tick();
    let initialViewOptions = Utils.getViewOptions(fixture);

    Utils.clickMoveViewOption(fixture, 2, '.fa-angle-up');
    Utils.moveArrayElement(initialViewOptions, 1, 'up');
    tick();

    const viewOptions = Utils.getViewOptions(fixture);
    expect(initialViewOptions).toEqual(viewOptions);
    expect(viewOptions.filter(it => it.checked).map(it => it.label)).toEqual(
      Utils.getColumnHeaders(fixture)
    );
  }));

  test('should move to first position', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      columnSelection: true
    });
    Utils.openViewOptions(fixture);
    tick();
    const initialViewOptions = Utils.getViewOptions(fixture);

    Utils.clickMoveViewOption(fixture, 6, '.fa-angle-double-up');
    Utils.moveArrayElement(initialViewOptions, 5, 'first');
    tick();

    const viewOptions = Utils.getViewOptions(fixture);
    expect(initialViewOptions).toEqual(viewOptions);
    expect(viewOptions.filter(it => it.checked).map(it => it.label)).toEqual(
      Utils.getColumnHeaders(fixture)
    );
  }));

  test('should move to last position', fakeAsync(() => {
    fixture = Utils.createHostComponent({
      columnSelection: true
    });
    Utils.openViewOptions(fixture);
    tick();
    const initialViewOptions = Utils.getViewOptions(fixture);

    Utils.clickMoveViewOption(fixture, 1, '.fa-angle-double-down');
    Utils.moveArrayElement(initialViewOptions, 0, 'last');
    tick();

    const viewOptions = Utils.getViewOptions(fixture);
    expect(initialViewOptions).toEqual(viewOptions);
    expect(viewOptions.filter(it => it.checked).map(it => it.label)).toEqual(
      Utils.getColumnHeaders(fixture)
    );
  }));
});
