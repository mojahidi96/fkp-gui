import * as fc from 'fast-check';

import {ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {SncrDatatableComponent} from '../../sncr-datatable.component';

import {AbstractFeatureSpec, DatatableModel, FeatureContext} from './base';

// selectors

const SELECTOR_RESULT_COUNT_COMPONENT = By.css('sncr-results');

// assertions

const assertResultCount = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  expect(
    r.debugElement.query(SELECTOR_RESULT_COUNT_COMPONENT).componentInstance
      .totalRecords
  ).toBe(m.numberOfRows);
};

class CounterFeatureSpec extends AbstractFeatureSpec {
  getSupportedCommands(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    fc.Arbitrary<
      fc.AsyncCommand<DatatableModel, ComponentFixture<SncrDatatableComponent>>
    >
  > {
    return [];
  }

  getSupportedAssertions(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    (
      m: DatatableModel,
      r: ComponentFixture<SncrDatatableComponent>
    ) => Promise<void>
  > {
    return [assertResultCount];
  }
}

export const CounterFeature = new CounterFeatureSpec();
